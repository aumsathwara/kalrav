import Link from "next/link"

export default async function AdminTestListPage({ params }: { params: Promise<{ class: string }> }) {
  const { class: classId } = await params
  
  // Mock data for MVP
  const tests = [
    { id: "t1", name: "June Test", date: "2023-06-15", status: "Published" },
    { id: "t2", name: "July Test", date: "2023-07-15", status: "Published" },
    { id: "t3", name: "August Test", date: "2023-08-15", status: "Draft" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <Link href="/admin/classes" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block">← Back to Classes</Link>
            <h1 className="text-3xl font-bold text-gray-900">Tests</h1>
            <p className="text-gray-500 mt-1">Manage tests for class {classId}</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm transition-colors flex items-center gap-2">
            <span>+</span> New Test
          </button>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {tests.map((test) => (
              <li key={test.id}>
                <Link href={`/admin/test/${test.id}`} className="block hover:bg-gray-50 transition-colors p-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{test.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{test.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        test.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {test.status}
                      </span>
                      <span className="text-gray-400">→</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
