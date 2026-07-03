import ClassDashboardContent from "@/components/class/ClassDashboardContent"
import { getTestsByClass } from "@/lib/actions/tests.actions"
import { getStudentsByClass } from "@/lib/actions/student.actions"

export default async function AdminTestListPage({ params }: { params: Promise<{ class: string }> }) {
  const { class: classId } = await params

  // 1. Fetch live tests & students for this standard standard
  const tests = await getTestsByClass(classId)
  const students = await getStudentsByClass(classId)

  // Map tests array parameters to fit UI interface
  const formattedTests = tests.map(t => ({
    id: t.id,
    name: t.name,
    test_date: t.test_date,
    status: t.status
  }))

  return (
    <ClassDashboardContent
      classId={classId}
      className={classId === "c1" ? "Std 5" : classId === "c2" ? "Std 6" : classId === "c3" ? "Std 7" : undefined}
      initialTests={formattedTests}
      initialStudents={students}
    />
  )
}
