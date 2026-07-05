import ClassDashboardContent from "@/components/class/ClassDashboardContent"
import { getTestsByClass, getSubjectsByClass } from "@/lib/actions/tests.actions"
import { getStudentsByClass } from "@/lib/actions/student.actions"
import { createAdminClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminTestListPage({ params }: { params: Promise<{ class: string }> }) {
  const { class: classId } = await params

  // 1. Fetch live tests, students, subjects, and class details in parallel
  const supabase = createAdminClient()
  const [tests, students, subjects, classRes] = await Promise.all([
    getTestsByClass(classId),
    getStudentsByClass(classId),
    getSubjectsByClass(classId),
    supabase
      .from("classes")
      .select("name")
      .eq("id", classId)
      .single()
  ])

  let className = ""
  if (classRes.data) {
    className = classRes.data.name
  } else {
    // Fallback based on mock UUIDs
    className = classId === "00000000-0000-0000-0000-000000000005" ? "Std 5" 
              : classId === "00000000-0000-0000-0000-000000000006" ? "Std 6" 
              : classId === "00000000-0000-0000-0000-000000000007" ? "Std 7" 
              : ""
  }

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
      className={className}
      initialTests={formattedTests}
      initialStudents={students}
      initialSubjects={subjects}
    />
  )
}
