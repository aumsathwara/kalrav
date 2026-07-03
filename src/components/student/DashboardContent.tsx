"use client"

import { useState } from "react"
import { ProgressChart } from "@/components/charts/ProgressChart"
import Link from "next/link"

interface Student {
  id: string
  name: string
  emoji: string
  classes?: { name: string }
}

interface SubjectPerformance {
  subjectName: string
  obtained: number | null
  total: number
  percentage: number
}

interface HistoryItem {
  testName: string
  date: string
  percentage: number
}

interface DashboardContentProps {
  student: Student
  latestTestName: string
  currentScore: number
  improvement: number
  history: HistoryItem[]
  subjectPerformance: SubjectPerformance[]
  insights: string | null
}

const translations = {
  en: {
    title: "Tuition Progress Tracker",
    switch: "Switch Student",
    overallScore: "Latest Test Score",
    progress: "Progress History",
    subjects: "Subject Breakdown",
    insightsTitle: "AI Learning Insights",
    obtainedOf: "obtained out of",
    improvementUp: "up from last test",
    improvementDown: "down from last test",
    noImprovement: "Same as last test",
    noInsights: "AI insights will be published by the teacher soon."
  },
  gu: {
    title: "ટ્યુશન પ્રગતિ ટ્રેકર",
    switch: "વિદ્યાર્થી બદલો",
    overallScore: "છેલ્લી કસોટીના ગુણ",
    progress: "પ્રગતિનો ઇતિહાસ",
    subjects: "વિષયવાર ગુણ",
    insightsTitle: "AI શિક્ષણ વિશ્લેષણ",
    obtainedOf: "મેળવેલ ગુણ / કુલ ગુણ",
    improvementUp: "ગઈ ટેસ્ટ કરતા વધારો",
    improvementDown: "ગઈ ટેસ્ટ કરતા ઘટાડો",
    noImprovement: "ગઈ ટેસ્ટ જેટલા જ ગુણ",
    noInsights: "શિક્ષક ટૂંક સમયમાં AI વિશ્લેષણ પ્રકાશિત કરશે."
  }
}

export function DashboardContent({
  student,
  latestTestName,
  currentScore,
  improvement,
  history,
  subjectPerformance,
  insights
}: DashboardContentProps) {
  const [lang, setLang] = useState<"en" | "gu">("en")
  const t = translations[lang]

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-700 bg-green-50/50 border-green-200"
    if (percentage >= 75) return "text-blue-700 bg-blue-50/50 border-blue-200"
    if (percentage >= 50) return "text-yellow-700 bg-yellow-50/50 border-yellow-200"
    return "text-red-700 bg-red-50/50 border-red-200"
  }

  // Gujarati Gujarati digits helper
  const toGujaratiDigits = (num: number | string) => {
    if (lang === "en") return num.toString()
    const gujDigits = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"]
    return num
      .toString()
      .split("")
      .map(char => (/\d/.test(char) ? gujDigits[parseInt(char)] : char))
      .join("")
  }

  // Dynamic Insights Translation logic or stubs if needed
  const getInsightsDisplay = () => {
    if (!insights) return t.noInsights
    if (lang === "en") return insights

    // Simple auto-translator stub for key terms to Gujarati if requested
    return insights
      .replace("Class Strengths", "વર્ગની શક્તિઓ")
      .replace("Areas of Improvement", "સુધારણાના ક્ષેત્રો")
      .replace("Actionable Recommendations", "ભલામણો")
      .replace("💡", "💡")
      .replace("⚠️", "⚠️")
      .replace("📝", "📝")
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md px-5 py-4 shadow-sm sticky top-0 z-40 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center shadow-inner">
            {student.emoji}
          </span>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{student.name}</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{student.classes?.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Language selector toggle */}
          <div className="bg-gray-100 p-0.5 rounded-lg flex text-xs font-semibold">
            <button 
              onClick={() => setLang("en")}
              className={`px-2 py-1.5 rounded-md transition-all ${lang === "en" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLang("gu")}
              className={`px-2 py-1.5 rounded-md transition-all ${lang === "gu" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
            >
              ગુજ
            </button>
          </div>
          <Link 
            href={`/std/${student.classes?.name.toLowerCase().replace(" ", "-") || "std-7"}`} 
            className="text-xs text-blue-600 font-bold border border-blue-100 bg-blue-50/50 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            {t.switch}
          </Link>
        </div>
      </header>

      <main className="px-4 py-6 max-w-md mx-auto space-y-6 animate-fade-in">
        {/* Overall Score */}
        <section className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100/80 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">{latestTestName}</p>
          <h3 className="text-sm font-semibold text-gray-500 mb-1">{t.overallScore}</h3>
          <div className="text-5xl font-black text-gray-900 tracking-tight my-2">
            {toGujaratiDigits(currentScore)}%
          </div>
          {improvement !== 0 ? (
            <div className={`inline-flex items-center gap-1 font-bold px-3 py-1 rounded-full text-xs border ${
              improvement > 0 
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-red-50 text-red-700 border-red-200"
            }`}>
              {improvement > 0 ? "▲" : "▼"} {toGujaratiDigits(Math.abs(improvement))}% 
              <span className="font-normal text-[10px] opacity-80">({improvement > 0 ? t.improvementUp : t.improvementDown})</span>
            </div>
          ) : (
            <div className="text-xs text-gray-400 font-medium">{t.noImprovement}</div>
          )}
        </section>

        {/* AI Learning Insights */}
        <section className="bg-gradient-to-tr from-indigo-50/50 via-purple-50/30 to-blue-50/50 rounded-2xl p-5 border border-indigo-100/70 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
          <h2 className="text-md font-bold text-indigo-900 mb-3 flex items-center gap-1.5">
            ✨ <span>{t.insightsTitle}</span>
          </h2>
          <div className="text-indigo-950 text-sm whitespace-pre-line leading-relaxed font-medium">
            {getInsightsDisplay()}
          </div>
        </section>

        {/* Progress Graph */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80">
          <h2 className="text-md font-bold text-gray-800 tracking-tight">{t.progress}</h2>
          <ProgressChart data={history} />
        </section>

        {/* Subject Cards */}
        <section className="space-y-3">
          <h2 className="text-md font-bold text-gray-800 tracking-tight ml-1">{t.subjects}</h2>
          <div className="grid grid-cols-2 gap-3">
            {subjectPerformance.map((sub, i) => (
              <div key={i} className={`rounded-xl p-4 border shadow-sm flex flex-col justify-between transition-transform hover:scale-[1.01] ${getPerformanceColor(sub.percentage)}`}>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm tracking-tight">{sub.subjectName}</h3>
                  <div className="text-[10px] font-medium opacity-60 mt-0.5">
                    {t.obtainedOf}
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xl font-black">{toGujaratiDigits(sub.percentage)}%</span>
                  <span className="text-xs font-semibold opacity-70">
                    {sub.obtained !== null ? toGujaratiDigits(sub.obtained) : "-"} / {toGujaratiDigits(sub.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
