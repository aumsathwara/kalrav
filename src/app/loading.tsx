export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-4">
      <div className="space-y-4 text-center">
        {/* Sleek animated gradient spinner */}
        <div className="relative w-14 h-14 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-500 font-bold text-sm tracking-wide animate-pulse uppercase">
          Loading...
        </p>
      </div>
    </div>
  )
}
