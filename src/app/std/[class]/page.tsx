import Link from "next/link"
import { getStudentsByClass } from "@/lib/actions/student.actions"
import { createAdminClient } from "@/lib/supabase/server"

export default async function StudentSelectionPage({ params }: { params: Promise<{ class: string }> }) {
  const { class: classId } = await params

  // 1. Fetch live students for this class standard
  const students = await getStudentsByClass(classId)

  // 2. Fetch class name dynamically for header
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
    className = classId === "00000000-0000-0000-0000-000000000005" ? "Std 5" 
              : classId === "00000000-0000-0000-0000-000000000006" ? "Std 6" 
              : classId === "00000000-0000-0000-0000-000000000007" ? "Std 7" 
              : classId.replace("-", " ")
  }

  // Translating class name to Gujarati for Gujarai standard view if fallback
  let displayName = className
  if (className.toLowerCase() === "std 5") displayName = "Std 5 / ધોરણ ૫"
  else if (className.toLowerCase() === "std 6") displayName = "Std 6 / ધોરણ ૬"
  else if (className.toLowerCase() === "std 7") displayName = "Std 7 / ધોરણ ૭"

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white p-5 shadow-sm sticky top-0 z-10 flex items-center gap-3">
        <Link href="/" className="text-gray-500 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-xl font-bold text-gray-900 capitalize">{displayName}</h1>
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
