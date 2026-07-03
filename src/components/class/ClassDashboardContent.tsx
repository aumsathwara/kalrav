"use client"

import { useState } from "react"
import Link from "next/link"
import { createStudent, updateStudent, deleteStudent } from "@/lib/actions/student.actions"

interface Student {
  id: string
  name: string
  emoji: string
  class_id: string
}

interface Test {
  id: string
  name: string
  test_date: string
  status: string
}

interface ClassDashboardContentProps {
  classId: string
  className?: string
  initialTests: Test[]
  initialStudents: Student[]
}

const EMOJI_OPTIONS = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "☺️",
  "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗",
  "😋", "😛", "😝", "😜", "🤪", "🧐", "🤓", "😎", "🥸", "🤩",
  "🥳", "😏", "🤠", "🦁", "🐨", "🐼", "🦖", "🚀", "🎨"
]

export default function ClassDashboardContent({
  classId,
  className = "",
  initialTests,
  initialStudents
}: ClassDashboardContentProps) {
  const [activeTab, setActiveTab] = useState<"tests" | "students">("tests")
  const [students, setStudents] = useState<Student[]>(initialStudents)
  
  // Student Modal state
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null)
  const [studentName, setStudentName] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState("😀")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Deletion state
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null)

  // 1. Open create student modal
  const handleOpenCreate = () => {
    setModalMode("create")
    setStudentName("")
    setSelectedEmoji("😀")
    setEditingStudentId(null)
    setShowStudentModal(true)
  }

  // 2. Open edit student modal
  const handleOpenEdit = (student: Student) => {
    setModalMode("edit")
    setStudentName(student.name)
    setSelectedEmoji(student.emoji)
    setEditingStudentId(student.id)
    setShowStudentModal(true)
  }

  // 3. Handle save (create or update)
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentName.trim()) return

    setIsSubmitting(true)
    try {
      if (modalMode === "create") {
        const newStudent = await createStudent(classId, studentName.trim(), selectedEmoji)
        setStudents((prev) => [...prev, newStudent].sort((a, b) => a.name.localeCompare(b.name)))
        alert("Student added successfully! ✓")
      } else if (modalMode === "edit" && editingStudentId) {
        const updated = await updateStudent(editingStudentId, studentName.trim(), selectedEmoji)
        setStudents((prev) =>
          prev.map((s) => (s.id === editingStudentId ? updated : s)).sort((a, b) => a.name.localeCompare(b.name))
        )
        alert("Student updated successfully! ✓")
      }
      setShowStudentModal(false)
    } catch (err) {
      console.error(err)
      alert("Failed to save student details. Please verify database connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 4. WhatsApp Share Student Dashboard
  const handleShareWhatsApp = (student: Student) => {
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    const shareUrl = `${origin}/student/${student.id}`
    const text = encodeURIComponent(
      `📚 *Kalrav Classes Progress Report*\n\nDear Parent, view the detailed academic progress report, performance charts, and teacher notes for *${student.name}* here:\n${shareUrl}\n\n_Kalrav Classes Tuition Progress Tracker_`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank")
  }

  // 5. Handle Delete Confirmation
  const triggerDeleteConfirm = (student: Student) => {
    setDeletingStudent(student)
    setShowConfirmDelete(true)
  }

  const handleDelete = async () => {
    if (!deletingStudent) return

    setIsSubmitting(true)
    try {
      await deleteStudent(deletingStudent.id)
      setStudents((prev) => prev.filter((s) => s.id !== deletingStudent.id))
      alert("Student deleted successfully. ✓")
      setShowConfirmDelete(false)
      setDeletingStudent(null)
    } catch (err) {
      console.error(err)
      alert("Failed to delete student. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation / Header */}
        <header className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <Link href="/admin/classes" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-flex items-center gap-1 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              <span>Back to Classes</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight capitalize">
              {className || classId.replace("-", " ")}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage tests and students for this standard</p>
          </div>
          
          <div className="flex gap-2">
            {activeTab === "tests" ? (
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-sm transition-colors text-sm flex items-center gap-2">
                <span>+</span> New Test
              </button>
            ) : (
              <button
                onClick={handleOpenCreate}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold shadow-sm transition-colors text-sm flex items-center gap-2"
              >
                <span>+</span> Add Student
              </button>
            )}
          </div>
        </header>

        {/* Custom Tab Switcher */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("tests")}
            className={`py-2.5 px-4 font-bold text-sm border-b-2 transition-all ${
              activeTab === "tests"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            📝 Tests ({initialTests.length})
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`py-2.5 px-4 font-bold text-sm border-b-2 transition-all ${
              activeTab === "students"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            👥 Students ({students.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "tests" ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {initialTests.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No tests registered for this class yet.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {initialTests.map((test) => (
                  <li key={test.id}>
                    <Link href={`/admin/test/${test.id}`} className="block hover:bg-gray-50 transition-colors p-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{test.name}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">{test.test_date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            test.status === "Published" || test.status === "published"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
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
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {students.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No students registered in this class. Click &quot;+ Add Student&quot; to begin.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {students.map((student) => (
                  <li key={student.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl bg-gray-50 rounded-full w-12 h-12 flex items-center justify-center border border-gray-100 shadow-inner">
                        {student.emoji}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{student.name}</h3>
                        <p className="text-xs text-gray-400">ID: {student.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShareWhatsApp(student)}
                        className="text-gray-500 hover:text-green-600 hover:bg-green-50 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
                      >
                        📢 <span>Share</span>
                      </button>
                      <button
                        onClick={() => handleOpenEdit(student)}
                        className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => triggerDeleteConfirm(student)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Modal: Add/Edit Student */}
        {showStudentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-extrabold text-gray-900">
                  {modalMode === "create" ? "Add New Student" : "Edit Student Information"}
                </h2>
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>
              
              <form onSubmit={handleSaveStudent}>
                <div className="p-6 space-y-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Student Name</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Vrutti Patel"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    />
                  </div>

                  {/* Selected Emoji Display */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                      Selected Avatar: <span className="text-2xl ml-1">{selectedEmoji}</span>
                    </label>
                    
                    {/* Emoji Palette */}
                    <div className="border rounded-xl p-3 bg-gray-50 max-h-40 overflow-y-auto grid grid-cols-8 gap-2">
                      {EMOJI_OPTIONS.map((emoji, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedEmoji(emoji)}
                          className={`text-2xl p-1.5 hover:bg-white rounded-lg transition-colors flex items-center justify-center ${
                            selectedEmoji === emoji ? "bg-white ring-2 ring-purple-600 scale-110" : ""
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowStudentModal(false)}
                    className="border bg-white text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save Details"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Confirm Deletion */}
        {showConfirmDelete && deletingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up p-6">
              <h2 className="text-xl font-extrabold text-red-600 mb-2">Delete Student?</h2>
              <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to delete **{deletingStudent.name}** {deletingStudent.emoji}? This action will permanently remove this student and all their test marks.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="border bg-white text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
