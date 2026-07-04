"use client"

import { useState, useRef, useEffect } from "react"
import { updateMark, updateSubjectTotalMarks } from "@/lib/actions/marks.actions"

type Subject = { id: string; name: string }
type Student = { id: string; name: string; emoji: string }
type Mark = { student_id: string; subject_id: string; obtained: number | null; total: number }

interface SpreadsheetProps {
  testId: string
  subjects: Subject[]
  students: Student[]
  initialMarks: Mark[]
  totals: Record<string, number>
}

export default function Spreadsheet({ testId, subjects, students, initialMarks, totals }: SpreadsheetProps) {
  const [marks, setMarks] = useState<Mark[]>(initialMarks)
  const [localTotals, setLocalTotals] = useState<Record<string, number>>(totals)
  const [editingCell, setEditingCell] = useState<{ studentId: string; subjectId: string } | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [editTotalValue, setEditTotalValue] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
 
  // Auto-focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingCell])
 
  // Synchronize local states when props update from the server (e.g. after OCR batch save)
  useEffect(() => {
    setMarks(initialMarks)
  }, [initialMarks])
 
  useEffect(() => {
    setLocalTotals(totals)
  }, [totals])
 
  const getMark = (studentId: string, subjectId: string) => {
    return marks.find((m) => m.student_id === studentId && m.subject_id === subjectId)
  }
 
  const handleCellClick = (studentId: string, subjectId: string) => {
    const mark = getMark(studentId, subjectId)
    setEditValue(mark?.obtained !== null && mark?.obtained !== undefined ? mark.obtained.toString() : "")
    setEditTotalValue(mark?.total !== null && mark?.total !== undefined ? mark.total.toString() : (localTotals[subjectId] || 30).toString())
    setEditingCell({ studentId, subjectId })
  }
 
  const handleSave = async () => {
    if (!editingCell) return
 
    setIsSaving(true)
    const { studentId, subjectId } = editingCell
    const obtained = editValue === "" ? null : parseFloat(editValue)
    const total = parseFloat(editTotalValue)

    if (isNaN(total) || total <= 0) {
      alert("Total marks must be a positive number")
      setIsSaving(false)
      return
    }
 
    if (obtained !== null && obtained > total) {
      alert("Obtained cannot exceed Total")
      setIsSaving(false)
      return
    }
 
    try {
      await updateMark(testId, studentId, subjectId, obtained, total)
      
      setMarks((prev) => {
        const index = prev.findIndex((m) => m.student_id === studentId && m.subject_id === subjectId)
        if (index >= 0) {
          const newMarks = [...prev]
          newMarks[index] = { ...newMarks[index], obtained, total }
          return newMarks
        } else {
          return [...prev, { student_id: studentId, subject_id: subjectId, obtained, total }]
        }
      })
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (error) {
      console.error("Failed to save mark", error)
      alert("Failed to save. Try again.")
    } finally {
      setIsSaving(false)
      setEditingCell(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      setEditingCell(null)
    }
  }

  const handleEditTotal = async (subjectId: string, subjectName: string, currentTotal: number) => {
    const val = prompt(`Set total marks for ${subjectName} in this test:`, currentTotal.toString())
    if (val === null) return
    const parsed = parseFloat(val)
    if (isNaN(parsed) || parsed <= 0) {
      alert("Please enter a valid positive number.")
      return
    }

    try {
      await updateSubjectTotalMarks(testId, subjectId, parsed)
      
      // Update localTotals state
      setLocalTotals((prev) => ({
        ...prev,
        [subjectId]: parsed
      }))

      // Update local marks array totals
      setMarks((prev) => prev.map((m) => m.subject_id === subjectId ? { ...m, total: parsed } : m))
      
      alert("Total marks updated successfully. ✓")
    } catch (err) {
      console.error(err)
      alert("Failed to update total marks. Verify database connections.")
    }
  }

  return (
    <div className="relative w-full overflow-hidden flex flex-col h-full bg-white text-black">
      {saveSuccess && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow z-50 animate-fade-in-out">
          Saved ✓
        </div>
      )}

      <div className="overflow-auto border rounded-xl flex-1 relative">
        <table className="w-full text-left border-collapse min-w-max">
          <thead className="sticky top-0 bg-gray-50 shadow-sm z-20">
            <tr>
              <th className="sticky left-0 bg-gray-50 p-4 border-b border-r font-medium text-gray-600 w-48 shadow-[1px_0_0_0_#e5e7eb]">
                Student
              </th>
              {subjects.map((subject) => (
                <th key={subject.id} className="p-4 border-b border-r font-medium text-gray-600 min-w-[155px] group/header relative select-none">
                  <div className="flex items-center justify-between gap-1">
                    <span>{subject.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditTotal(subject.id, subject.name, localTotals[subject.id] || 100)
                      }}
                      className="opacity-0 group-hover/header:opacity-100 text-[10px] text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded transition-all font-bold ml-2"
                      title="Edit total marks"
                    >
                      ✏️ Edit Total
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 font-normal mt-0.5">Out of {localTotals[subject.id] || 100}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="sticky left-0 bg-white p-4 border-b border-r font-bold shadow-[1px_0_0_0_#e5e7eb] z-10 flex items-center gap-2">
                  <span className="text-xl">{student.emoji}</span>
                  <span>{student.name}</span>
                </td>
                {subjects.map((subject) => {
                  const mark = getMark(student.id, subject.id)
                  const isEditing = editingCell?.studentId === student.id && editingCell?.subjectId === subject.id

                  return (
                    <td
                      key={subject.id}
                      className="p-0 border-b border-r relative cursor-pointer active:bg-blue-50 transition-colors"
                      onClick={() => !isEditing && handleCellClick(student.id, subject.id)}
                    >
                      <div className="w-full h-full p-4 min-h-[64px] flex items-center justify-center">
                        {isEditing ? (
                          <div 
                            className="absolute z-30 bg-white shadow-2xl rounded-2xl p-3 border flex flex-col gap-2.5 min-w-[190px] -left-4 -top-14 text-black text-left"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-gray-500">Obtained:</span>
                              <input
                                ref={inputRef}
                                type="number"
                                inputMode="decimal"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-20 bg-gray-100 p-1.5 rounded outline-none text-sm font-bold text-right"
                                disabled={isSaving}
                              />
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-gray-500">Total:</span>
                              <input
                                type="number"
                                inputMode="decimal"
                                value={editTotalValue}
                                onChange={(e) => setEditTotalValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-20 bg-gray-100 p-1.5 rounded outline-none text-sm font-bold text-right"
                                disabled={isSaving}
                              />
                            </div>
                            <div className="flex gap-2 justify-end mt-0.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingCell(null)
                                }}
                                className="px-2.5 py-1 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 rounded font-semibold transition-colors"
                                disabled={isSaving}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSave()
                                }}
                                className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition-colors"
                                disabled={isSaving}
                              >
                                {isSaving ? "..." : "Save"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-lg text-gray-800">
                            {mark?.obtained !== null && mark?.obtained !== undefined ? (
                              <span className="font-medium">{mark.obtained}</span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                            <span className="text-gray-400 text-sm ml-1">/ {mark?.total !== undefined && mark?.total !== null ? mark.total : (localTotals[subject.id] || 30)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
