"use client"

import { useState } from "react"
import Link from "next/link"
import { createStudent, updateStudent, deleteStudent } from "@/lib/actions/student.actions"
import { createTest, updateTest, deleteTest, createSubject, deleteSubject } from "@/lib/actions/tests.actions"
import { updateSubjectTotalMarks } from "@/lib/actions/marks.actions"

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

interface Subject {
  id: string
  name: string
}

interface ClassDashboardContentProps {
  classId: string
  className?: string
  initialTests: Test[]
  initialStudents: Student[]
  initialSubjects: Subject[]
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
  initialStudents,
  initialSubjects
}: ClassDashboardContentProps) {
  const [activeTab, setActiveTab] = useState<"tests" | "students">("tests")
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [tests, setTests] = useState<Test[]>(initialTests)
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects)
  const [newSubjectName, setNewSubjectName] = useState("")
  const [newSubjectTotal, setNewSubjectTotal] = useState("100")
  const [subjectTotals, setSubjectTotals] = useState<Record<string, number>>({})
  const [isAddingSubject, setIsAddingSubject] = useState(false)
  
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

  // Test Modal state
  const [showTestModal, setShowTestModal] = useState(false)
  const [testModalMode, setTestModalMode] = useState<"create" | "edit">("create")
  const [editingTestId, setEditingTestId] = useState<string | null>(null)
  const [testName, setTestName] = useState("")
  const [testDate, setTestDate] = useState("")
  const [testStatus, setTestStatus] = useState("draft")

  // Test Delete state
  const [showConfirmDeleteTest, setShowConfirmDeleteTest] = useState(false)
  const [deletingTest, setDeletingTest] = useState<Test | null>(null)

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

  // 6. Test Handlers
  const handleOpenCreateTest = () => {
    setTestModalMode("create")
    setTestName("")
    setTestDate(new Date().toISOString().split("T")[0])
    setTestStatus("draft")
    setShowTestModal(true)
  }

  const handleOpenEditTest = (e: React.MouseEvent, test: Test) => {
    e.preventDefault()
    e.stopPropagation()
    setTestModalMode("edit")
    setEditingTestId(test.id)
    setTestName(test.name)
    setTestDate(test.test_date)
    setTestStatus(test.status.toLowerCase())
    setShowTestModal(true)
  }

  const triggerDeleteTestConfirm = (e: React.MouseEvent, test: Test) => {
    e.preventDefault()
    e.stopPropagation()
    setDeletingTest(test)
    setShowConfirmDeleteTest(true)
  }

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!testName.trim()) return

    setIsSubmitting(true)
    try {
      if (testModalMode === "create") {
        const newTest = await createTest(classId, testName.trim(), testDate, testStatus)
        
        // Batch write subject totals for this new test in database
        const promises = subjects.map((sub) => {
          const total = subjectTotals[sub.id] || 100
          return updateSubjectTotalMarks(newTest.id, sub.id, total)
        })
        await Promise.all(promises)

        setTests((prev) => [...prev, {
          id: newTest.id,
          name: newTest.name,
          test_date: newTest.test_date,
          status: newTest.status
        }])
        alert("Test created successfully. ✓")
      } else if (testModalMode === "edit" && editingTestId) {
        const updated = await updateTest(editingTestId, testName.trim(), testDate, testStatus)
        setTests((prev) => prev.map((t) => t.id === editingTestId ? {
          id: updated.id,
          name: updated.name,
          test_date: updated.test_date,
          status: updated.status
        } : t))
        alert("Test updated successfully. ✓")
      }
      setShowTestModal(false)
    } catch (err) {
      console.error(err)
      alert("Failed to save test details. Please verify database connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTest = async () => {
    if (!deletingTest) return

    setIsSubmitting(true)
    try {
      await deleteTest(deletingTest.id)
      setTests((prev) => prev.filter((t) => t.id !== deletingTest.id))
      alert("Test deleted successfully. ✓")
      setShowConfirmDeleteTest(false)
      setDeletingTest(null)
    } catch (err) {
      console.error(err)
      alert("Failed to delete test. Please verify database connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 7. Subject Handlers
  const handleAddSubject = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!newSubjectName.trim()) return
    const total = parseFloat(newSubjectTotal) || 100

    setIsAddingSubject(true)
    try {
      const created = await createSubject(classId, newSubjectName.trim())
      setSubjects((prev) => [...prev, {
        id: created.id,
        name: created.name
      }])
      
      if (testModalMode === "edit" && editingTestId) {
        await updateSubjectTotalMarks(editingTestId, created.id, total)
      } else {
        setSubjectTotals((prev) => ({
          ...prev,
          [created.id]: total
        }))
      }

      setNewSubjectName("")
      setNewSubjectTotal("100")
    } catch (err) {
      console.error(err)
      alert("Failed to add subject. Please verify database connection.")
    } finally {
      setIsAddingSubject(false)
    }
  }

  const handleDeleteSubject = async (e: React.MouseEvent, subjectId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this subject? All marks recorded under this subject will be archived/hidden.")) return

    try {
      await deleteSubject(subjectId)
      setSubjects((prev) => prev.filter((s) => s.id !== subjectId))
    } catch (err) {
      console.error(err)
      alert("Failed to delete subject. Please verify database connection.")
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
              <button
                onClick={handleOpenCreateTest}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-sm transition-colors text-sm flex items-center gap-2"
              >
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
            📝 Tests ({tests.length})
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
            {tests.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No tests registered for this class yet.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {tests.map((test) => (
                  <li key={test.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    {/* Link for navigation wrapping details */}
                    <Link href={`/admin/test/${test.id}`} className="flex-1 min-w-0 pr-4 block group">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{test.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{test.test_date}</p>
                    </Link>

                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                        test.status === "Published" || test.status === "published"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {test.status}
                      </span>

                      {/* CRUD action buttons outside of navigation Link */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleOpenEditTest(e, test)}
                          className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => triggerDeleteTestConfirm(e, test)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      </div>

                      <Link href={`/admin/test/${test.id}`} className="text-gray-400 hover:text-blue-600 transition-colors pr-1">
                        →
                      </Link>
                    </div>
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

        {/* Modal: Add/Edit Test */}
        {showTestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
              <div className="p-6 border-b">
                <h2 className="text-xl font-extrabold text-gray-900">
                  {testModalMode === "create" ? "Create New Test" : "Edit Test Details"}
                </h2>
              </div>
              
              <form onSubmit={handleSaveTest}>
                <div className="p-6 space-y-4">
                  {/* Test Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Test Name</label>
                    <input
                      type="text"
                      required
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      placeholder="e.g. June Monthly Exam"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Test Date */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Test Date</label>
                    <input
                      type="date"
                      required
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Test Status */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Publish Status</label>
                    <select
                      value={testStatus}
                      onChange={(e) => setTestStatus(e.target.value)}
                      className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="draft">Draft (Visible to Admin Only)</option>
                      <option value="published">Published (Visible to Parents)</option>
                    </select>
                  </div>

                  {/* Class Subjects Section */}
                  <div className="border-t pt-4">
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Class Subjects</label>
                    
                    {/* Existing subjects list */}
                    {subjects.length === 0 ? (
                      <p className="text-xs text-gray-400 mb-2">No subjects registered for this class. Add one below!</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {subjects.map((sub) => (
                          <span key={sub.id} className="inline-flex items-center gap-1 bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-750 text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-200 transition-colors">
                            <span>{sub.name}</span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteSubject(e, sub.id)}
                              className="text-gray-400 hover:text-red-700 font-bold ml-1 transition-colors"
                              title="Delete Subject"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Add new subject inline input (2 cell entry format) */}
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Subject Name (e.g. Gujarati)"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        className="flex-1 border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                      <input
                        type="number"
                        placeholder="Total Marks (e.g. 50)"
                        value={newSubjectTotal}
                        onChange={(e) => setNewSubjectTotal(e.target.value)}
                        className="w-28 border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleAddSubject}
                        disabled={isAddingSubject}
                        className="bg-gray-100 hover:bg-gray-250 text-gray-750 px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 transition-all disabled:opacity-50"
                      >
                        {isAddingSubject ? "Adding..." : "+ Add"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowTestModal(false)}
                    className="border bg-white text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save Details"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Confirm Deletion of Test */}
        {showConfirmDeleteTest && deletingTest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up p-6">
              <h2 className="text-xl font-extrabold text-red-600 mb-2">Delete Test?</h2>
              <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to delete <strong>{deletingTest.name}</strong>? This action will archive the test, hiding it from dashboards.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmDeleteTest(false)}
                  className="border bg-white text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTest}
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
