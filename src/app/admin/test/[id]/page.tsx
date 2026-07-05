import AdminTestSpreadsheetClient from "@/components/test/AdminTestSpreadsheetClient"
import { getTestSpreadsheetData } from "@/lib/actions/tests.actions"

export default async function AdminTestSpreadsheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { test, students, subjects, marks, notes, totals } = await getTestSpreadsheetData(id)

  return (
    <AdminTestSpreadsheetClient
      test={test}
      students={students}
      subjects={subjects}
      initialMarks={marks}
      initialNotes={notes || []}
      totals={totals}
    />
  )
}
