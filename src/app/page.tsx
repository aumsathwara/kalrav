import Link from "next/link"

export default function LandingPage() {
  const classes = [
    { id: "std-5", name: "Std 5" },
    { id: "std-6", name: "Std 6" },
    { id: "std-7", name: "Std 7" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-6 pb-2 text-center mt-12">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Kalrav Classes</h1>
        <p className="text-gray-500 mt-2">Track student progress easily</p>
      </header>

      <main className="flex-1 px-4 py-8 max-w-md mx-auto w-full flex flex-col gap-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-center gap-4">
          <button className="flex-1 py-2 font-medium text-blue-600 bg-blue-50 rounded-lg">English</button>
          <button className="flex-1 py-2 font-medium text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">ગુજરાતી</button>
        </div>

        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">Select Standard</h2>
          <div className="flex flex-col gap-3">
            {classes.map((cls) => (
              <Link key={cls.id} href={`/std/${cls.id}`}>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-blue-200 transition-colors cursor-pointer active:scale-[0.98]">
                  <span className="text-lg font-bold text-gray-800">{cls.name}</span>
                  <span className="text-gray-400">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="p-6 text-center text-sm text-gray-400">
        <Link href="/admin">Admin Login</Link>
      </footer>
    </div>
  )
}
