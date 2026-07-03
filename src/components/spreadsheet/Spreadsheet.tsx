"use client"

import { useState, useRef, useEffect } from "react"
import { updateMark } from "@/lib/actions/marks.actions"

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
  const [editingCell, setEditingCell] = useState<{ studentId: string; subjectId: string } | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Auto-focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingCell])

  const getMark = (studentId: string, subjectId: string) => {
    return marks.find((m) => m.student_id === studentId && m.subject_id === subjectId)
  }

  const handleCellClick = (studentId: string, subjectId: string) => {
    const mark = getMark(studentId, subjectId)
    setEditValue(mark?.obtained !== null && mark?.obtained !== undefined ? mark.obtained.toString() : "")
    setEditingCell({ studentId, subjectId })
  }

  const handleSave = async () => {
    if (!editingCell) return

    setIsSaving(true)
    const { studentId, subjectId } = editingCell
    const obtained = editValue === "" ? null : parseFloat(editValue)
    const total = totals[subjectId]

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
          newMarks[index] = { ...newMarks[index], obtained }
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
                <th key={subject.id} className="p-4 border-b border-r font-medium text-gray-600 min-w-[120px]">
                  {subject.name}
                  <div className="text-xs text-gray-400 font-normal">Out of {totals[subject.id]}</div>
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
                          <div className="absolute inset-0 z-30 bg-white shadow-xl rounded-lg p-3 m-1 border flex flex-col gap-2">
                            <div className="flex gap-2 items-center">
                              <span className="text-sm font-medium text-gray-500">Obtained:</span>
                              <input
                                ref={inputRef}
                                type="number"
                                inputMode="decimal"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full bg-gray-100 p-2 rounded outline-none text-lg font-medium"
                                disabled={isSaving}
                              />
                            </div>
                            <div className="flex gap-2 justify-end mt-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingCell(null)
                                }}
                                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded"
                                disabled={isSaving}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSave()
                                }}
                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded font-medium"
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
                            <span className="text-gray-400 text-sm ml-1">/ {totals[subject.id]}</span>
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
