import Link from "next/link"
import { getStudentsByClass } from "@/lib/actions/student.actions"
import { createAdminClient } from "@/lib/supabase/server"
import { ClassTestDashboard } from "@/components/test/ClassTestDashboard"
import { translateClassNameToGujarati } from "@/lib/utils"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function StudentOrTestPage({ params }: { params: Promise<{ class: string }> }) {
  const { class: id } = await params
  const supabase = createAdminClient()

  // 1. Attempt to resolve "id" as a test ID
  const { data: test } = await supabase
    .from("tests")
    .select("*, classes(name)")
    .eq("id", id)
    .maybeSingle()

  if (test) {
    // 2. We found a test! Fetch students, subjects and marks for this test in parallel
    const [studentsRes, subjectsRes, marksRes] = await Promise.all([
      supabase
        .from("students")
        .select("id, name, emoji")
        .eq("class_id", test.class_id)
        .neq("status", "archived"),
      supabase
        .from("subjects")
        .select("id, name")
        .eq("class_id", test.class_id)
        .eq("archived", false),
      supabase
        .from("marks")
        .select("student_id, subject_id, obtained, total")
        .eq("test_id", test.id)
    ])

    const students = studentsRes.data
    const subjects = subjectsRes.data
    const marks = marksRes.data

    // Render the Class Test Results Dashboard component
    return (
      <ClassTestDashboard
        test={test}
        students={students || []}
        subjects={subjects || []}
        marks={marks || []}
      />
    )
  }

  // 3. Fallback: Treat "id" as a Class ID (Original StudentSelectionPage behavior)
  const students = await getStudentsByClass(id)

  let className = ""
  try {
    const { data } = await supabase
      .from("classes")
      .select("name")
      .eq("id", id)
      .single()
    if (data) {
      className = data.name
    }
  } catch (err) {
    console.warn("Failed to fetch class name from DB: ", err)
    className = id === "00000000-0000-0000-0000-000000000005" ? "Std 5" 
              : id === "00000000-0000-0000-0000-000000000006" ? "Std 6" 
              : id === "00000000-0000-0000-0000-000000000007" ? "Std 7" 
              : id.replace("-", " ")
  }

  const displayName = `${className} / ${translateClassNameToGujarati(className)}`

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white p-5 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 capitalize">{displayName}</h1>
        </div>
        <img src="/logo.jpeg" alt="Kalrav Classes Logo" className="w-9 h-9 rounded-full object-cover shadow-sm border border-gray-100" />
      </header>

      <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full">
        {students.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No students registered in this class standard.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {students.map((student) => (
              <Link key={student.id} href={`/student/${student.id}`}>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-blue-200 transition-colors cursor-pointer active:scale-[0.98]">
                  <span className="text-3xl bg-gray-50 rounded-full w-14 h-14 flex items-center justify-center border border-gray-100 shadow-inner">
                    {student.emoji}
                  </span>
                  <span className="text-lg font-bold text-gray-800">{student.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
