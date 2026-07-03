"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClass, updateClass, deleteClass } from "@/lib/actions/tests.actions"

interface ClassItem {
  id: string
  name: string
}

interface ClassesDashboardProps {
  initialClasses: ClassItem[]
}

export default function ClassesDashboard({ initialClasses }: ClassesDashboardProps) {
  const router = useRouter()
  const [classes, setClasses] = useState<ClassItem[]>(initialClasses)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null)
  const [classNameInput, setClassNameInput] = useState("")
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [deletingClass, setDeletingClass] = useState<ClassItem | null>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. Open modals
  const handleOpenCreate = () => {
    setClassNameInput("")
    setModalMode("create")
    setIsModalOpen(true)
  }

  const handleOpenEdit = (e: React.MouseEvent, cls: ClassItem) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedClass(cls)
    setClassNameInput(cls.name)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const triggerDeleteConfirm = (e: React.MouseEvent, cls: ClassItem) => {
    e.preventDefault()
    e.stopPropagation()
    setDeletingClass(cls)
    setShowConfirmDelete(true)
  }

  // 2. Submit Add/Edit form
  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!classNameInput.trim()) return

    setIsSubmitting(true)
    try {
      if (modalMode === "create") {
        const newCls = await createClass(classNameInput.trim())
        setClasses((prev) => [...prev, newCls])
      } else if (modalMode === "edit" && selectedClass) {
        const updated = await updateClass(selectedClass.id, classNameInput.trim())
        setClasses((prev) =>
          prev.map((c) => (c.id === selectedClass.id ? updated : c))
        )
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error(err)
      alert("Failed to save class details. Verify database connections.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 3. Submit Delete
  const handleDeleteClass = async () => {
    if (!deletingClass) return

    setIsSubmitting(true)
    try {
      await deleteClass(deletingClass.id)
      setClasses((prev) => prev.filter((c) => c.id !== deletingClass.id))
      setShowConfirmDelete(false)
    } catch (err) {
      console.error(err)
      alert("Failed to delete class. Verify database connections.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Classes Panel</h1>
            <p className="text-gray-500 mt-2">Manage standard classes, tests, and student records</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-sm transition-colors text-sm flex items-center gap-2"
            >
              <span>+</span> Add Class
            </button>
            <Link 
              href="/" 
              className="text-sm text-red-600 font-bold hover:text-red-700 bg-red-50/50 hover:bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl transition-colors"
            >
              Logout
            </Link>
          </div>
        </header>

        {classes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
            No classes registered. Click "+ Add Class" to begin.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <div 
                key={cls.id}
                onClick={() => router.push(`/admin/${cls.id}`)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group active:scale-[0.98] flex flex-col justify-between h-40"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">🏫</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleOpenEdit(e, cls)}
                        className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg text-sm font-semibold transition-colors"
                        title="Edit Class Name"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => triggerDeleteConfirm(e, cls)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg text-sm font-semibold transition-colors"
                        title="Delete Class"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                    {cls.name}
                  </h2>
                </div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  View Class Details →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {modalMode === "create" ? "Add New Class" : "Rename Class"}
            </h3>
            
            <form onSubmit={handleSaveClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Class Standard Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Std 8 or Evening Batch"
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white rounded-xl px-4 py-3 text-base text-gray-950 outline-none transition-all placeholder:text-gray-300"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-sm flex items-center justify-center"
                >
                  {isSubmitting ? "Saving..." : "Save Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && deletingClass && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-2xl mb-4">
              ⚠️
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Class?</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Are you sure you want to delete <strong>{deletingClass.name}</strong>? This action will archive the class. All student profiles, exams, and marks associated with this class standard will be locked.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClass}
                disabled={isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-sm flex items-center justify-center"
              >
                {isSubmitting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
