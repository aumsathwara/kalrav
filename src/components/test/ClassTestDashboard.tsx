"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts"
import { translateClassNameToGujarati } from "@/lib/utils"

interface Test {
  id: string
  name: string
  test_date: string
  classes?: { name: string }
}

interface Student {
  id: string
  name: string
  emoji: string
}

interface Subject {
  id: string;
  name: string;
}

interface Mark {
  student_id: string
  subject_id: string
  obtained: number | null
  total: number
}

interface ClassTestDashboardProps {
  test: Test
  students: Student[]
  subjects: Subject[]
  marks: Mark[]
}

const translations = {
  en: {
    dashboard: "Class Performance Dashboard",
    classAverage: "Class Average",
    totalStudents: "Total Students",
    subjectsCount: "Subjects",
    toppersTitle: "🏆 Subject Toppers",
    chartTitle: "📊 Overall Performance Comparison",
    tableTitle: "📋 Student Score Matrix",
    clickSort: "Tip: Click column headers to sort students top-to-bottom",
    studentCol: "Student",
    overallCol: "Overall %",
    absent: "Absent",
    backBtn: "Back to Home",
    viewDashboard: "💡 Click a student's row to view their progress dashboard",
    topper: "Topper",
    noData: "No marks recorded for this test yet."
  },
  gu: {
    dashboard: "વર્ગ પ્રદર્શન ડેશબોર્ડ",
    classAverage: "વર્ગ સરેરાશ",
    totalStudents: "કુલ વિદ્યાર્થીઓ",
    subjectsCount: "વિષયો",
    toppersTitle: "🏆 વિષયવાર ટોપર્સ",
    chartTitle: "📊 સમગ્ર પ્રદર્શન સરખામણી",
    tableTitle: "📋 વિદ્યાર્થી ગુણ પત્રક",
    clickSort: "ટિપ: વિષયવાર ક્રમમાં ગોઠવવા માટે હેડર પર ક્લિક કરો",
    studentCol: "વિદ્યાર્થી",
    overallCol: "કુલ ટકા",
    absent: "ગેરહાજર",
    backBtn: "મુખ્ય પૃષ્ઠ",
    viewDashboard: "💡 વિદ્યાર્થીનું પર્સનલ ડેશબોર્ડ જોવા માટે નામ પર ક્લિક કરો",
    topper: "ટોપર",
    noData: "આ કસોટી માટે હજી સુધી ગુણ પત્રક ઉપલબ્ધ નથી."
  }
}

export function ClassTestDashboard({ test, students, subjects, marks }: ClassTestDashboardProps) {
  const [lang, setLang] = useState<"en" | "gu">("en")
  const t = translations[lang]
  const [isMounted, setIsMounted] = useState(false)
  
  // Sorting state
  const [sortField, setSortField] = useState<string>("overall")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Process student scores
  const studentsWithData = students
    .map(student => {
      const studentMarks = marks.filter(m => m.student_id === student.id)
      
      // Calculate obtained and total for subjects they actually took
      const validMarks = studentMarks.filter(m => m.obtained !== null)
      const totalObtained = validMarks.reduce((sum, m) => sum + Number(m.obtained), 0)
      const totalMax = validMarks.reduce((sum, m) => sum + Number(m.total), 0)
      
      const overallPercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0
      
      // Subject percentage map
      const subjectPercentages: Record<string, number | null> = {}
      const subjectObtained: Record<string, string> = {}
      
      subjects.forEach(subject => {
        const mark = studentMarks.find(m => m.subject_id === subject.id)
        if (mark && mark.obtained !== null) {
          subjectPercentages[subject.id] = (Number(mark.obtained) / Number(mark.total)) * 100
          subjectObtained[subject.id] = `${mark.obtained}/${mark.total}`
        } else {
          subjectPercentages[subject.id] = null
          subjectObtained[subject.id] = "-"
        }
      })
      
      return {
        ...student,
        overallPercentage,
        totalObtained,
        totalMax,
        subjectPercentages,
        subjectObtained,
        hasMarks: validMarks.length > 0
      }
    })
    .filter(s => s.hasMarks)

  // Sort logic
  const sortedStudents = [...studentsWithData].sort((a, b) => {
    let valA: number | string = 0
    let valB: number | string = 0

    if (sortField === "name") {
      valA = a.name.toLowerCase()
      valB = b.name.toLowerCase()
      if (valA < valB) return sortDirection === "asc" ? -1 : 1
      if (valA > valB) return sortDirection === "asc" ? 1 : -1
      return 0
    } else if (sortField === "overall") {
      valA = a.overallPercentage
      valB = b.overallPercentage
    } else {
      valA = a.subjectPercentages[sortField] ?? -1
      valB = b.subjectPercentages[sortField] ?? -1
    }

    return sortDirection === "asc" ? valA - valB : valB - valA
  })

  // Get toppers for each subject
  const subjectToppers = subjects.map(subject => {
    let topScore = -1
    let toppersList: typeof studentsWithData = []
    
    studentsWithData.forEach(s => {
      const score = s.subjectPercentages[subject.id]
      if (score !== null && score >= 0) {
        if (score > topScore) {
          topScore = score
          toppersList = [s]
        } else if (score === topScore) {
          toppersList.push(s)
        }
      }
    })
    
    return {
      subject,
      score: topScore,
      toppers: toppersList
    }
  }).filter(t => t.score >= 0)

  // Overall class details
  const totalPercentageSum = studentsWithData.reduce((sum, s) => sum + s.overallPercentage, 0)
  const classAverage = studentsWithData.length > 0 ? totalPercentageSum / studentsWithData.length : 0

  // Chart representation data (sorted by score descending)
  const chartData = [...studentsWithData]
    .sort((a, b) => b.overallPercentage - a.overallPercentage)
    .map(s => ({
      name: s.name,
      percentage: Math.round(s.overallPercentage * 10) / 10
    }))

  // Handle click on column header
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("desc") // Default to sorting highest first
    }
  }

  const getBarColor = (pct: number) => {
    if (pct >= 90) return "#22c55e" // Green
    if (pct >= 75) return "#3b82f6" // Blue
    if (pct >= 50) return "#eab308" // Yellow
    return "#ef4444" // Red
  }

  // Gujarati digits helper
  const toGujText = (val: number | string) => {
    if (lang === "en") return val.toString()
    const gujDigits = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"]
    return val
      .toString()
      .split("")
      .map(char => (/\d/.test(char) ? gujDigits[parseInt(char)] : char))
      .join("")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-12">
      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-md px-5 py-4 border-b sticky top-0 z-40 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.jpeg" 
            alt="Kalrav Classes Logo" 
            className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100"
          />
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              {lang === "en" ? "Kalrav Classes" : "કલરવ ક્લાસીસ"}
            </h1>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              {lang === "en" ? (test.classes?.name || "") : translateClassNameToGujarati(test.classes?.name || "")} • {test.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="bg-gray-100 p-0.5 rounded-lg flex gap-0.5">
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                lang === "en" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("gu")}
              className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                lang === "gu" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              ગુજ
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 space-y-6">
        {studentsWithData.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center space-y-4">
            <div className="text-5xl">📊</div>
            <h3 className="text-xl font-bold text-gray-800">{t.noData}</h3>
            <Link 
              href="/" 
              className="inline-block bg-blue-600 text-white font-bold px-6 py-2.5 rounded-2xl shadow-sm hover:bg-blue-700 transition-all text-sm"
            >
              {t.backBtn}
            </Link>
          </div>
        ) : (
          <>
            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.classAverage}</span>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-3xl font-extrabold text-blue-600">{toGujText(Math.round(classAverage * 10) / 10)}%</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.totalStudents}</span>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-3xl font-extrabold text-gray-800">{toGujText(studentsWithData.length)}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm col-span-2 md:col-span-1 flex flex-col justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.subjectsCount}</span>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-3xl font-extrabold text-gray-800">{toGujText(subjects.length)}</span>
                </div>
              </div>
            </div>

            {/* Recharts Chart Section */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-md font-bold text-gray-800">{t.chartTitle}</h3>
              <div className="h-72 w-full">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} 
                        axisLine={false} 
                        tickLine={false}
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        tick={{ fontSize: 10, fill: '#64748b' }} 
                        axisLine={false} 
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [`${toGujText(value)}%`]}
                      />
                      <Bar 
                        dataKey="percentage" 
                        radius={[8, 8, 0, 0]}
                        animationDuration={800}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-slate-100 animate-pulse rounded-2xl" />
                )}
              </div>
            </div>

            {/* Subject Toppers Section */}
            <div className="space-y-3">
              <h3 className="text-md font-bold text-gray-800 px-1">{t.toppersTitle}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {subjectToppers.map(({ subject, score, toppers }) => (
                  <div 
                    key={subject.id} 
                    className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between gap-3 relative overflow-hidden"
                  >
                    {/* Tiny crown element decoration */}
                    <div className="absolute -right-2 -top-2 text-yellow-100 text-5xl font-black select-none pointer-events-none opacity-20">
                      👑
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">{subject.name}</span>
                      <span className="text-lg font-black text-blue-600 block mt-0.5">{toGujText(Math.round(score * 10) / 10)}%</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl bg-slate-50 w-9 h-9 rounded-full flex items-center justify-center border shadow-inner">
                        {toppers[0]?.emoji || "🎓"}
                      </span>
                      <span className="text-xs font-bold text-gray-700 truncate max-w-[100px]">
                        {toppers.map(top => top.name).join(", ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sortable Matrix Score Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-4 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
                <div>
                  <h3 className="text-md font-bold text-gray-800">{t.tableTitle}</h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{t.clickSort}</p>
                </div>
                <div className="text-[10px] text-gray-400 bg-gray-50 border px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 self-start">
                  💡 <span>{t.viewDashboard}</span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {/* Name Column */}
                      <th 
                        onClick={() => handleSort("name")}
                        className="p-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors select-none min-w-[140px]"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{t.studentCol}</span>
                          {sortField === "name" && (
                            <span className="text-[10px]">{sortDirection === "asc" ? "▲" : "▼"}</span>
                          )}
                        </div>
                      </th>
                      
                      {/* Subject Columns */}
                      {subjects.map(subject => (
                        <th 
                          key={subject.id}
                          onClick={() => handleSort(subject.id)}
                          className="p-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors select-none text-center"
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span>{subject.name}</span>
                            {sortField === subject.id && (
                              <span className="text-[10px]">{sortDirection === "asc" ? "▲" : "▼"}</span>
                            )}
                          </div>
                        </th>
                      ))}

                      {/* Overall Percentage Column */}
                      <th 
                        onClick={() => handleSort("overall")}
                        className="p-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors select-none text-right min-w-[100px]"
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <span>{t.overallCol}</span>
                          {sortField === "overall" && (
                            <span className="text-[10px]">{sortDirection === "asc" ? "▲" : "▼"}</span>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sortedStudents.map(student => (
                      <tr 
                        key={student.id}
                        className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      >
                        {/* Name Cell */}
                        <td className="p-3">
                          <Link href={`/student/${student.id}`} className="flex items-center gap-3">
                            <span className="text-2xl bg-slate-50 rounded-full w-9 h-9 flex items-center justify-center border shadow-inner">
                              {student.emoji}
                            </span>
                            <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors text-sm">
                              {student.name}
                            </span>
                          </Link>
                        </td>

                        {/* Subject Score Cells */}
                        {subjects.map(subject => {
                          const score = student.subjectPercentages[subject.id]
                          const obtainedText = student.subjectObtained[subject.id]
                          return (
                            <td key={subject.id} className="p-3 text-center">
                              {score !== null ? (
                                <div className="space-y-0.5">
                                  <span className="text-xs font-bold text-slate-800 block">
                                    {toGujText(Math.round(score * 10) / 10)}%
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-semibold block">
                                    ({toGujText(obtainedText)})
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs font-semibold text-slate-300 italic">
                                  {t.absent}
                                </span>
                              )}
                            </td>
                          )
                        })}

                        {/* Overall Cell */}
                        <td className="p-3 text-right">
                          <span className="font-black text-slate-800 text-sm">
                            {toGujText(Math.round(student.overallPercentage * 10) / 10)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
