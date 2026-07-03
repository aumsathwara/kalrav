"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [pin, setPin] = useState("")
  const [error, setError] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === "120968") {
      router.push("/admin/classes")
    } else {
      setError(true)
      setTimeout(() => setError(false), 500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h1>
        <p className="text-gray-500 mb-8">Enter your 6-digit PIN to continue</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className={`w-full text-center tracking-[1em] text-2xl p-4 border rounded-xl outline-none transition-colors ${
                error ? "border-red-500 animate-shake" : "border-gray-300 focus:border-blue-500"
              }`}
              placeholder="••••••"
              required
            />
            {error && <p className="text-red-500 text-sm mt-2 font-medium">Incorrect PIN. Please try again.</p>}
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
