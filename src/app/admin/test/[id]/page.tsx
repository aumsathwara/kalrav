import Spreadsheet from "@/components/spreadsheet/Spreadsheet"
import { AdminTestHeader } from "@/components/test/AdminTestHeader"
import { getTestSpreadsheetData } from "@/lib/actions/tests.actions"

export default async function AdminTestSpreadsheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { test, students, subjects, marks, notes, totals } = await getTestSpreadsheetData(id)

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
        initialMarks={marks}
      />

      <main className="flex-1 overflow-hidden p-2 sm:p-4">
        <Spreadsheet 
          testId={test.id} 
          subjects={subjects} 
          students={students} 
          initialMarks={marks} 
          initialNotes={notes || []}
          totals={totals} 
        />
      </main>
    </div>
  )
}
