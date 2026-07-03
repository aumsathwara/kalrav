"use client"

import { useState } from "react"
import Link from "next/link"

interface ClassItem {
  id: string
  name: string
}

interface LanguageAndClassListProps {
  initialClasses: ClassItem[]
}

export default function LanguageAndClassList({ initialClasses }: LanguageAndClassListProps) {
  const [lang, setLang] = useState<"en" | "gu">("en")

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-6 pb-2 text-center mt-12">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {lang === "en" ? "Kalrav Classes" : "કલરવ ક્લાસીસ"}
        </h1>
        <p className="text-gray-500 mt-2">
          {lang === "en" ? "Track student progress easily" : "વિદ્યાર્થી પ્રગતિ સરળતાથી ટ્રેક કરો"}
        </p>
      </header>

      <main className="flex-1 px-4 py-8 max-w-md mx-auto w-full flex flex-col gap-8">
        {/* Language Switcher */}
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex justify-center gap-1">
          <button
            onClick={() => setLang("en")}
            className={`flex-1 py-2 font-medium rounded-lg transition-colors ${
              lang === "en" ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang("gu")}
            className={`flex-1 py-2 font-medium rounded-lg transition-colors ${
              lang === "gu" ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            ગુજરાતી
          </button>
        </div>

        {/* Standard Selection */}
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">
            {lang === "en" ? "Select Standard" : "ધોરણ પસંદ કરો"}
          </h2>
          <div className="flex flex-col gap-3">
            {initialClasses.map((cls) => {
              // Gujarati transliteration mapping
              let nameGu = cls.name
              if (cls.name.toLowerCase() === "std 5") nameGu = "ધોરણ ૫"
              else if (cls.name.toLowerCase() === "std 6") nameGu = "ધોરણ ૬"
              else if (cls.name.toLowerCase() === "std 7") nameGu = "ધોરણ ૭"

              return (
                <Link key={cls.id} href={`/std/${cls.id}`}>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-blue-200 transition-colors cursor-pointer active:scale-[0.98]">
                    <span className="text-lg font-bold text-gray-800">
                      {lang === "en" ? cls.name : nameGu}
                    </span>
                    <span className="text-gray-400">→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
      
      <footer className="p-6 text-center text-sm text-gray-400">
        <Link href="/admin" className="hover:text-gray-600 transition-colors">
          {lang === "en" ? "Admin Login" : "એડમિન લોગિન"}
        </Link>
      </footer>
    </div>
  )
}
