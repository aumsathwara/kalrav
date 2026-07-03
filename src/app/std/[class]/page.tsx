import Link from "next/link"

export default async function StudentSelectionPage({ params }: { params: Promise<{ class: string }> }) {
  const { class: classId } = await params

  // Mock data for MVP
  const students = [
    { id: "s1", name: "Vrutti", emoji: "😀" },
    { id: "s2", name: "Mansi", emoji: "😀" },
    { id: "s3", name: "Kevan", emoji: "🤓" },
    { id: "s4", name: "Dev", emoji: "😊" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white p-5 shadow-sm sticky top-0 z-10 flex items-center gap-3">
        <Link href="/" className="text-gray-500 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-xl font-bold text-gray-900 capitalize">{classId.replace('-', ' ')}</h1>
      </header>

      <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full">
        <div className="flex flex-col gap-3">
          {students.map((student) => (
            <Link key={student.id} href={`/student/${student.id}`}>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-blue-200 transition-colors cursor-pointer active:scale-[0.98]">
                <span className="text-3xl bg-gray-50 rounded-full w-14 h-14 flex items-center justify-center">{student.emoji}</span>
                <span className="text-lg font-bold text-gray-800">{student.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
