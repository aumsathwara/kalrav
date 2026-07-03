import ClassDashboardContent from "@/components/class/ClassDashboardContent"
import { getTestsByClass, getSubjectsByClass } from "@/lib/actions/tests.actions"
import { getStudentsByClass } from "@/lib/actions/student.actions"
import { createAdminClient } from "@/lib/supabase/server"

export default async function AdminTestListPage({ params }: { params: Promise<{ class: string }> }) {
  const { class: classId } = await params

  // 1. Fetch live tests, students & subjects for this standard class
  const tests = await getTestsByClass(classId)
  const students = await getStudentsByClass(classId)
  const subjects = await getSubjectsByClass(classId)

  // 2. Fetch class name dynamically from DB
  let className = ""
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from("classes")
      .select("name")
      .eq("id", classId)
      .single()
    if (data) {
      className = data.name
    }
  } catch (err) {
    console.warn("Failed to fetch class name from DB: ", err)
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
