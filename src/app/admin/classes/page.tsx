import Link from "next/link"

export default function AdminClassesPage() {
  // Mock data for MVP
  const classes = [
    { id: "c1", name: "Std 5", students: 12 },
    { id: "c2", name: "Std 6", students: 18 },
    { id: "c3", name: "Std 7", students: 24 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Select Class</h1>
            <p className="text-gray-500 mt-2">Choose a class to manage tests and marks</p>
          </div>
          <Link href="/" className="text-sm text-red-600 font-bold hover:text-red-700 bg-red-50/50 hover:bg-red-50 border border-red-100 px-3 py-2 rounded-xl transition-colors">
            Logout
          </Link>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <Link key={cls.id} href={`/admin/${cls.id}`}>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]">
                <h2 className="text-2xl font-bold text-gray-900">{cls.name}</h2>
                <p className="text-gray-500 mt-2">{cls.students} Students</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
