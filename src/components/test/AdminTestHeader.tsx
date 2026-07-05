"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { processOcrImage } from "@/lib/actions/ocr.actions"
import { updateMarksBatch } from "@/lib/actions/marks.actions"
import { generateTestInsights, getTestInsights, publishTestInsights } from "@/lib/actions/insights.actions"

interface Student {
  id: string
  name: string
  emoji: string
}

interface Subject {
  id: string
  name: string
}

interface Mark {
  student_id: string
  subject_id: string
  obtained: number | null
  total: number
}

interface AdminTestHeaderProps {
  testId: string
  classId: string
  testName: string
  className?: string
  testDate: string
  students: Student[]
  subjects: Subject[]
  marks: Mark[]
  setMarks: React.Dispatch<React.SetStateAction<Mark[]>>
}

export function AdminTestHeader({
  testId,
  classId,
  testName,
  className,
  testDate,
  students,
  subjects,
  marks,
  setMarks
}: AdminTestHeaderProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Modals state
  const [showOcrModal, setShowOcrModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showInsightsModal, setShowInsightsModal] = useState(false)

  // OCR Processing state
  const [isOcrProcessing, setIsOcrProcessing] = useState(false)
  const [ocrError, setOcrError] = useState<string | null>(null)
  const [ocrResults, setOcrResults] = useState<Mark[]>([])
  const [isSavingOcr, setIsSavingOcr] = useState(false)

  // Insights state
  const [insightsContent, setInsightsContent] = useState<string>("")
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false)
  const [insightsError, setInsightsError] = useState<string | null>(null)
  const [isPublishingInsights, setIsPublishingInsights] = useState(false)

  // 1. OCR: File upload & convert to base64
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsOcrProcessing(true)
    setOcrError(null)
    setOcrResults([])

    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = async () => {
        const base64data = reader.result as string
        try {
          const res = await processOcrImage(testId, base64data)
          if (res.success && res.marks) {
            const formattedMarks: Mark[] = res.marks.map((m: any) => {
              const existingMark = marks.find(
                (im) => im.student_id === m.student_id && im.subject_id === m.subject_id
              )
              return {
                student_id: m.student_id,
                subject_id: m.subject_id,
                obtained: m.obtained !== null ? Number(m.obtained) : null,
                total: existingMark ? existingMark.total : (m.total || 100)
              }
            })
            setOcrResults(formattedMarks)
          } else {
            setOcrError("No marks were parsed from the image.")
          }
        } catch (err) {
          console.error(err)
          setOcrError("Failed to read text from the image. Please try again.")
        } finally {
          setIsOcrProcessing(false)
        }
      }
    } catch (err) {
      console.error(err)
      setOcrError("Failed to load file.")
      setIsOcrProcessing(false)
    }
  }

  // 2. OCR: Edit single field in results
  const handleOcrResultChange = (studentId: string, subjectId: string, value: string) => {
    setOcrResults(prev =>
      prev.map(item =>
        item.student_id === studentId && item.subject_id === subjectId
          ? { ...item, obtained: value === "" ? null : Number(value) }
          : item
      )
    )
  }

  // 3. OCR: Save reviewed marks
  const handleSaveOcrResults = async () => {
    setIsSavingOcr(true)
    try {
      await updateMarksBatch(testId, ocrResults)
      setMarks(ocrResults)
      setShowOcrModal(false)
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Failed to save OCR results.")
    } finally {
      setIsSavingOcr(false)
    }
  }

  // 4. Insights: Fetch or Generate
  const handleOpenInsights = async () => {
    setShowInsightsModal(true)
    setIsGeneratingInsights(true)
    setInsightsError(null)

    try {
      const existing = await getTestInsights(testId)
      if (existing) {
        setInsightsContent(existing.content)
      } else {
        // Automatically generate if none exists yet
        const res = await generateTestInsights(testId)
        if (res.success && res.insights) {
          setInsightsContent(res.insights)
        } else {
          setInsightsError("Could not generate insights automatically.")
        }
      }
    } catch (err) {
      console.error(err)
      setInsightsError("Failed to load AI insights.")
    } finally {
      setIsGeneratingInsights(false)
    }
  }

  const handleRegenerateInsights = async () => {
    setIsGeneratingInsights(true)
    setInsightsError(null)
    try {
      const res = await generateTestInsights(testId)
      if (res.success && res.insights) {
        setInsightsContent(res.insights)
      } else {
        setInsightsError("Could not regenerate insights.")
      }
    } catch (err) {
      console.error(err)
      setInsightsError("Failed to regenerate insights.")
    } finally {
      setIsGeneratingInsights(false)
    }
  }

  const handlePublishInsights = async () => {
    setIsPublishingInsights(true)
    try {
      await publishTestInsights(testId, insightsContent)
      alert("AI Insights published for parents! ✓")
      setShowInsightsModal(false)
    } catch (err) {
      console.error(err)
      alert("Failed to publish insights.")
    } finally {
      setIsPublishingInsights(false)
    }
  }

  // 5. WhatsApp: Format share message
  const [copiedImage, setCopiedImage] = useState(false)
  const [isCopyingImage, setIsCopyingImage] = useState(false)

  // 5. WhatsApp: Format share message with Monospace Matrix Table
  const getShareText = () => {
    const totalMarks = marks.reduce((sum, m) => sum + (m.obtained || 0), 0)
    const totalMax = marks.reduce((sum, m) => sum + m.total, 0)
    const classAverage = totalMax > 0 ? (totalMarks / totalMax) * 100 : 0

    // 1. Group marks by student to get overall percentages
    const studentPerformance = students.map(student => {
      const studentMarks = marks.filter(m => m.student_id === student.id)
      const validMarks = studentMarks.filter(m => m.obtained !== null)
      const obtainedSum = validMarks.reduce((sum, m) => sum + Number(m.obtained), 0)
      const totalSum = validMarks.reduce((sum, m) => sum + Number(m.total), 0)
      const percentage = totalSum > 0 ? (obtainedSum / totalSum) * 100 : 0
      return {
        id: student.id,
        name: student.name,
        percentage,
        hasMarks: validMarks.length > 0
      }
    })
    .filter(s => s.hasMarks)
    .sort((a, b) => b.percentage - a.percentage) // Rank by overall percentage descending

    // 2. Format marks matrix as a vertical tree list (perfect mobile-alignment on WhatsApp)
    const matrixText = studentPerformance.map(s => {
      const studentMarks = marks.filter(m => m.student_id === s.id)
      
      const subjectLines = subjects.map(sub => {
        const mark = studentMarks.find(m => m.subject_id === sub.id)
        if (mark && mark.obtained !== null) {
          const pct = (Number(mark.obtained) / Number(mark.total)) * 100
          return `  ├ ${sub.name}: *${Math.round(pct)}%*`
        }
        return null
      }).filter(Boolean)

      const overallLine = `  └ Overall Score: *${Math.round(s.percentage)}%*`
      return `👤 *${s.name}*\n${subjectLines.join("\n")}${subjectLines.length > 0 ? "\n" : ""}${overallLine}`
    }).join("\n\n")

    const viewUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/std/${testId}`

    return `📚 *${testName} Results (Class ${className || ""})*

📋 *Marks Matrix:*
${matrixText}

🔗 View detailed reports, progress charts, and AI insights:
${viewUrl}`
  }

  // 6. Generate Horizonal Bar Chart PNG Blob via HTML5 Canvas
  const generateChartImageBlob = async (): Promise<Blob> => {
    const studentPerformance = students.map(student => {
      const studentMarks = marks.filter(m => m.student_id === student.id)
      const validMarks = studentMarks.filter(m => m.obtained !== null)
      const obtainedSum = validMarks.reduce((sum, m) => sum + Number(m.obtained), 0)
      const totalSum = validMarks.reduce((sum, m) => sum + Number(m.total), 0)
      const percentage = totalSum > 0 ? (obtainedSum / totalSum) * 100 : 0
      return {
        name: student.name,
        percentage,
        hasMarks: validMarks.length > 0
      }
    })
    .filter(s => s.hasMarks)
    .sort((a, b) => b.percentage - a.percentage)

    const canvas = document.createElement("canvas")
    canvas.width = 600
    canvas.height = 140 + studentPerformance.length * 45
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Could not get canvas context")

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#ffffff")
    gradient.addColorStop(1, "#f9fafb")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Border
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 4
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4)

    // Draw Header Title
    ctx.fillStyle = "#1e3a8a" // Slate Blue
    ctx.font = "bold 22px sans-serif"
    ctx.fillText("Kalrav Classes - Leaderboard", 30, 45)

    ctx.fillStyle = "#4b5563"
    ctx.font = "14px sans-serif"
    ctx.fillText(`${testName} • Class ${className || ""}`, 30, 72)

    // Draw horizontal bars
    const startY = 110
    const barHeight = 24
    const spacing = 45
    const maxBarWidth = 350
    const startX = 160

    studentPerformance.forEach((s, idx) => {
      const y = startY + idx * spacing

      // Name & Rank
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 13px sans-serif"
      ctx.fillText(`${idx + 1}. ${s.name.substring(0, 16)}`, 30, y + 17)

      // Bar container background
      ctx.fillStyle = "#e5e7eb"
      ctx.fillRect(startX, y, maxBarWidth, barHeight)

      // Filled bar width
      const width = (s.percentage / 100) * maxBarWidth
      // Gradient for bar
      const barGradient = ctx.createLinearGradient(startX, 0, startX + maxBarWidth, 0)
      if (s.percentage >= 90) {
        barGradient.addColorStop(0, "#22c55e")
        barGradient.addColorStop(1, "#4ade80")
      } else if (s.percentage >= 75) {
        barGradient.addColorStop(0, "#3b82f6")
        barGradient.addColorStop(1, "#60a5fa")
      } else if (s.percentage >= 50) {
        barGradient.addColorStop(0, "#eab308")
        barGradient.addColorStop(1, "#facc15")
      } else {
        barGradient.addColorStop(0, "#ef4444")
        barGradient.addColorStop(1, "#f87171")
      }
      ctx.fillStyle = barGradient
      ctx.fillRect(startX, y, width, barHeight)

      // Percentage value text
      ctx.fillStyle = "#111827"
      ctx.font = "bold 13px sans-serif"
      ctx.fillText(`${s.percentage.toFixed(1)}%`, startX + maxBarWidth + 15, y + 17)
    })

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
      }, "image/png")
    })
  }

  const handleCopyImage = async () => {
    setIsCopyingImage(true)
    try {
      const blob = await generateChartImageBlob()
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ])
      setCopiedImage(true)
      setTimeout(() => setCopiedImage(false), 2000)
    } catch (err) {
      console.error(err)
      alert("Browser clipboard copy failed. Please use 'Download Chart' instead.")
    } finally {
      setIsCopyingImage(false)
    }
  }

  const handleDownloadImage = async () => {
    try {
      const blob = await generateChartImageBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${testName.replace(/\s+/g, "_")}_chart.png`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert("Failed to download image.")
    }
  }

  const handleWhatsAppShare = async () => {
    const text = getShareText()
    
    // 1. Try sharing using the native Web Share API (supported on mobile safari/chrome)
    if (navigator.share && navigator.canShare) {
      try {
        const blob = await generateChartImageBlob()
        const file = new File([blob], `${testName.replace(/\s+/g, "_")}_chart.png`, { type: "image/png" })
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${testName} Results`,
            text: text,
            files: [file]
          })
          setShowShareModal(false)
          return
        }
      } catch (err) {
        console.warn("Native file sharing failed, falling back to redirect link", err)
      }
    }
    
    // 2. Desktop Fallback: Automatically copy image to clipboard & redirect to WhatsApp Web
    try {
      const blob = await generateChartImageBlob()
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ])
      alert("Chart image copied to clipboard! Opening WhatsApp... Just press Paste (Ctrl+V) in the chat window to attach the chart. ✓")
    } catch (e) {
      console.warn("Failed to copy image to clipboard dynamically on fallback", e)
    }

    const encodedText = encodeURIComponent(text)
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank")
    setShowShareModal(false)
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(getShareText())
    alert("Share template copied to clipboard! ✓")
  }

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href={`/admin/${classId}`} className="text-gray-500 hover:text-gray-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{testName}</h1>
            <p className="text-sm text-gray-500">{className} • {testDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowOcrModal(true)}
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            📸 <span>OCR Scan</span>
          </button>
          <button 
            onClick={handleOpenInsights}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            ✨ <span>AI Insights</span>
          </button>
          <button 
            onClick={() => setShowShareModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            📢 <span>Share</span>
          </button>
        </div>
      </header>

      {/* OCR Modal */}
      {showOcrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">AI Handwritten Marksheet Reader</h2>
              <p className="text-gray-500 text-sm">Upload a photo of your paper mark sheet. Gemini AI will extract student scores.</p>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {ocrResults.length === 0 && !isOcrProcessing && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-2xl p-12 text-center cursor-pointer hover:bg-purple-50/30 transition-all group"
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">📸</div>
                  <p className="text-gray-700 font-bold text-lg">Click or tap to upload photo</p>
                  <p className="text-gray-400 text-sm mt-1">PNG, JPG or JPEG up to 10MB</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              )}

              {isOcrProcessing && (
                <div className="text-center py-12 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto"></div>
                  <p className="text-gray-700 font-medium">Gemini is parsing handwritten marksheet...</p>
                  <p className="text-gray-400 text-xs">This takes about 2-4 seconds.</p>
                </div>
              )}

              {ocrError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
                  ⚠️ {ocrError}
                </div>
              )}

              {ocrResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 text-lg">Verify & Edit Parsed Scores</h3>
                  <div className="border rounded-xl max-h-[40vh] overflow-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 sticky top-0 border-b">
                        <tr>
                          <th className="p-3 font-semibold text-gray-600 text-sm">Student</th>
                          {subjects.map(sub => (
                            <th key={sub.id} className="p-3 font-semibold text-gray-600 text-sm">{sub.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(student => (
                          <tr key={student.id} className="border-b last:border-0 hover:bg-gray-50/50">
                            <td className="p-3 font-bold text-gray-800 text-sm flex items-center gap-1.5">
                              <span>{student.emoji}</span>
                              <span>{student.name}</span>
                            </td>
                            {subjects.map(subject => {
                              const result = ocrResults.find(
                                r => r.student_id === student.id && r.subject_id === subject.id
                              )
                              return (
                                <td key={subject.id} className="p-2">
                                  <input 
                                    type="number"
                                    value={result?.obtained !== null && result?.obtained !== undefined ? result.obtained : ""}
                                    onChange={(e) => handleOcrResultChange(student.id, subject.id, e.target.value)}
                                    className="w-20 bg-gray-50 border rounded p-1 text-center font-semibold"
                                  />
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setShowOcrModal(false)
                  setOcrResults([])
                }} 
                className="px-4 py-2 font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
                disabled={isSavingOcr}
              >
                Cancel
              </button>
              {ocrResults.length > 0 && (
                <button 
                  onClick={handleSaveOcrResults} 
                  className="px-5 py-2 font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors disabled:opacity-50"
                  disabled={isSavingOcr}
                >
                  {isSavingOcr ? "Saving..." : "Apply & Save Marks ✓"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Modal */}
      {showInsightsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">✨ AI Performance Analysis</h2>
                <p className="text-gray-500 text-sm">Class stats and recommendation engine powered by Gemini.</p>
              </div>
              <button 
                onClick={handleRegenerateInsights}
                className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                disabled={isGeneratingInsights}
              >
                🔄 Regenerate
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {isGeneratingInsights && (
                <div className="text-center py-12 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto"></div>
                  <p className="text-gray-700 font-medium">Generating performance insights...</p>
                </div>
              )}

              {insightsError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
                  ⚠️ {insightsError}
                </div>
              )}

              {!isGeneratingInsights && !insightsError && (
                <textarea 
                  value={insightsContent}
                  onChange={(e) => setInsightsContent(e.target.value)}
                  className="w-full h-80 border rounded-xl p-4 font-sans text-gray-800 leading-relaxed outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowInsightsModal(false)} 
                className="px-4 py-2 font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Close
              </button>
              <button 
                onClick={handlePublishInsights} 
                className="px-5 py-2 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50"
                disabled={isPublishingInsights || isGeneratingInsights}
              >
                {isPublishingInsights ? "Publishing..." : "Publish to Parents ✓"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">📢 Share Test Results</h2>
              <p className="text-gray-500 text-sm mb-6">Send summaries and view links directly to parents.</p>
              
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm text-gray-700 mb-6 font-medium whitespace-pre-wrap leading-relaxed max-h-[25vh] overflow-y-auto">
                {getShareText()}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleCopyToClipboard}
                  className="flex-1 py-2.5 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  📋 Copy Text
                </button>
                <button 
                  onClick={handleWhatsAppShare} 
                  className="flex-1 py-2.5 font-semibold bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  🟢 WhatsApp
                </button>
              </div>

              <div className="border-t border-gray-100 my-4 pt-4">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Visual Bar Chart (PNG)</p>
                <div className="flex gap-2">
                  <button 
                    onClick={handleCopyImage}
                    disabled={isCopyingImage}
                    className="flex-1 py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {copiedImage ? "✓ Copied Chart!" : isCopyingImage ? "Copying..." : "📷 Copy Chart Image"}
                  </button>
                  <button 
                    onClick={handleDownloadImage}
                    className="flex-1 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                  >
                    💾 Download Chart
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <button 
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
