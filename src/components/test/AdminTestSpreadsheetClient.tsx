"use client"

import { useState } from "react"
import { AdminTestHeader } from "@/components/test/AdminTestHeader"
import Spreadsheet from "@/components/spreadsheet/Spreadsheet"

interface Mark {
  student_id: string
  subject_id: string
  obtained: number | null
  total: number
}

interface Note {
  student_id: string
  subject_id: string
  content: string
  type: string
}

interface AdminTestSpreadsheetClientProps {
  test: any
  students: any[]
  subjects: any[]
  initialMarks: Mark[]
  initialNotes: Note[]
  totals: Record<string, number>
}

export default function AdminTestSpreadsheetClient({
  test,
  students,
  subjects,
  initialMarks,
  initialNotes,
  totals
}: AdminTestSpreadsheetClientProps) {
  const [marks, setMarks] = useState<Mark[]>(initialMarks)
  const [notes, setNotes] = useState<Note[]>(initialNotes)

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AdminTestHeader 
        testId={test.id}
        classId={test.class_id}
        testName={test.name} 
        className={test.classes?.name} 
        testDate={test.test_date} 
        students={students}
        subjects={subjects}
        marks={marks}
        setMarks={setMarks}
      />

      <main className="flex-1 overflow-hidden p-2 sm:p-4">
        <Spreadsheet 
          testId={test.id} 
          subjects={subjects} 
          students={students} 
          marks={marks}
          setMarks={setMarks}
          notes={notes}
          setNotes={setNotes}
          totals={totals} 
        />
      </main>
    </div>
  )
}
