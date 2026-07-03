import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Tuition Progress Tracker",
  description: "Track student test progress with analytics and AI insights.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50/50 text-gray-900">
        {children}
      </body>
    </html>
  )
}
