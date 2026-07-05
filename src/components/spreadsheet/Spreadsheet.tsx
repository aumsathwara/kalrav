"use client"

import { useState, useRef, useEffect } from "react"
import { updateMark, updateSubjectTotalMarks, updateMarkNote, deleteMark } from "@/lib/actions/marks.actions"

type Subject = { id: string; name: string }
type Student = { id: string; name: string; emoji: string }
type Mark = { student_id: string; subject_id: string; obtained: number | null; total: number }
type Note = { id?: string; student_id: string; subject_id: string; content: string; type: string }

interface SpreadsheetProps {
  testId: string
  subjects: Subject[]
  students: Student[]
  marks: Mark[]
  setMarks: React.Dispatch<React.SetStateAction<Mark[]>>
  notes: Note[]
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
  totals: Record<string, number>
}

export default function Spreadsheet({ 
  testId, 
  subjects, 
  students, 
  marks, 
  setMarks, 
  notes, 
  setNotes, 
  totals 
}: SpreadsheetProps) {
  const [localTotals, setLocalTotals] = useState<Record<string, number>>(totals)
  const [editingCell, setEditingCell] = useState<{ studentId: string; subjectId: string } | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [editTotalValue, setEditTotalValue] = useState<string>("")
  const [editNoteValue, setEditNoteValue] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
 
  // Auto-focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingCell])
 
  useEffect(() => {
    setLocalTotals(totals)
  }, [totals])
 
  const getMark = (studentId: string, subjectId: string) => {
    return marks.find((m) => m.student_id === studentId && m.subject_id === subjectId)
  }

  const getNote = (studentId: string, subjectId: string) => {
    return notes.find((n) => n.student_id === studentId && n.subject_id === subjectId && n.type === "subject")
  }
 
  const handleCellClick = (studentId: string, subjectId: string) => {
    const mark = getMark(studentId, subjectId)
    const note = getNote(studentId, subjectId)
    setEditValue(mark?.obtained !== null && mark?.obtained !== undefined ? mark.obtained.toString() : "")
    setEditTotalValue(mark?.total !== null && mark?.total !== undefined ? mark.total.toString() : (localTotals[subjectId] || 30).toString())
    setEditNoteValue(note?.content || "")
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
      if (obtained === null) {
        await deleteMark(testId, studentId, subjectId)
        
        // Remove mark from local state
        setMarks((prev) => prev.filter((m) => !(m.student_id === studentId && m.subject_id === subjectId)))
        
        // Remove note from local state
        setNotes((prev) => prev.filter((n) => !(n.student_id === studentId && n.subject_id === subjectId && n.type === "subject")))
      } else {
        await updateMark(testId, studentId, subjectId, obtained, total)
        await updateMarkNote(testId, studentId, subjectId, editNoteValue)
        
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

        setNotes((prev) => {
          const index = prev.findIndex((n) => n.student_id === studentId && n.subject_id === subjectId && n.type === "subject")
          if (index >= 0) {
            const newNotes = [...prev]
            if (editNoteValue.trim() === "") {
              newNotes.splice(index, 1)
            } else {
              newNotes[index] = { ...newNotes[index], content: editNoteValue.trim() }
            }
            return newNotes
          } else if (editNoteValue.trim() !== "") {
            return [...prev, { student_id: studentId, subject_id: subjectId, content: editNoteValue.trim(), type: "subject" }]
          }
          return prev
        })
      }
      
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

  const handleDelete = async () => {
    if (!editingCell) return

    setIsSaving(true)
    const { studentId, subjectId } = editingCell

    try {
      await deleteMark(testId, studentId, subjectId)

      // Remove mark from local state
      setMarks((prev) => prev.filter((m) => !(m.student_id === studentId && m.subject_id === subjectId)))
      
      // Remove note from local state
      setNotes((prev) => prev.filter((n) => !(n.student_id === studentId && n.subject_id === subjectId && n.type === "subject")))

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (error) {
      console.error("Failed to delete mark", error)
      alert("Failed to delete marks. Try again.")
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

      {/* Mobile Stacked Card View */}
      <div className="block md:hidden flex-1 overflow-y-auto space-y-4 p-4">
        {students.map((student) => (
          <div key={student.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
              <span className="text-2xl">{student.emoji}</span>
              <span className="font-bold text-gray-800 text-base">{student.name}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {subjects.map((subject) => {
                const mark = getMark(student.id, subject.id)
                const note = getNote(student.id, subject.id)
                return (
                  <div 
                    key={subject.id} 
                    onClick={() => handleCellClick(student.id, subject.id)}
                    className="flex flex-col p-2.5 bg-gray-50 hover:bg-blue-50/50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-blue-100 justify-between gap-1"
                  >
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{subject.name}</span>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm font-black text-gray-800">
                          {mark?.obtained !== null && mark?.obtained !== undefined ? (
                            <span>{mark.obtained}</span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                          <span className="text-gray-400 text-xs font-semibold ml-1">/ {mark?.total !== undefined && mark?.total !== null ? mark.total : (localTotals[subject.id] || 30)}</span>
                        </div>
                        <span className="text-gray-400 text-xs">✏️</span>
                      </div>
                    </div>
                    {note?.content && (
                      <div className="text-[10px] text-gray-500 italic truncate mt-1 pt-1 border-t border-gray-200/50" title={note.content}>
                        📝 {note.content}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Spreadsheet Table View */}
      <div className="hidden md:block overflow-auto border rounded-xl flex-1 relative">
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
                  const note = getNote(student.id, subject.id)
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
                            className="absolute z-30 bg-white shadow-2xl rounded-2xl p-3.5 border flex flex-col gap-2.5 min-w-[230px] -left-8 -top-32 text-black text-left"
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
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-semibold text-gray-500">Note for Parents:</span>
                              <input
                                type="text"
                                value={editNoteValue}
                                onChange={(e) => setEditNoteValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Add note..."
                                className="w-full bg-gray-100 p-1.5 rounded outline-none text-xs text-gray-700 font-medium"
                                disabled={isSaving}
                              />
                            </div>
                            <div className="flex gap-1.5 justify-between mt-1 items-center">
                              {getMark(editingCell.studentId, editingCell.subjectId) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (confirm("Are you sure you want to delete this mark? Student will be marked absent.")) {
                                      handleDelete()
                                    }
                                  }}
                                  className="px-2 py-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded font-semibold transition-colors"
                                  disabled={isSaving}
                                  title="Mark student absent by deleting score"
                                >
                                  Delete
                                </button>
                              )}
                              <div className="flex gap-1.5 ml-auto">
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
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <div className="text-lg text-gray-800">
                              {mark?.obtained !== null && mark?.obtained !== undefined ? (
                                <span className="font-medium">{mark.obtained}</span>
                              ) : (
                                <span className="text-gray-300">-</span>
                              )}
                              <span className="text-gray-400 text-sm ml-1">/ {mark?.total !== undefined && mark?.total !== null ? mark.total : (localTotals[subject.id] || 30)}</span>
                            </div>
                            {note?.content && (
                              <div className="text-[10px] text-gray-500 italic mt-0.5 max-w-[130px] truncate" title={note.content}>
                                📝 {note.content}
                              </div>
                            )}
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

      {/* Mobile Center Edit Modal Overlay */}
      {editingCell && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in md:hidden"
          onClick={() => setEditingCell(null)}
        >
          <div 
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4 text-black"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-1.5">
                ✏️ Edit Marks
              </h3>
              <p className="text-xs text-gray-400 font-semibold mt-1">
                Student: <span className="font-bold text-gray-700">{students.find(s => s.id === editingCell.studentId)?.name}</span>
                <br />
                Subject: <span className="font-bold text-gray-700">{subjects.find(sub => sub.id === editingCell.subjectId)?.name}</span>
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-gray-600">Obtained:</span>
                <input
                  ref={inputRef}
                  type="number"
                  inputMode="decimal"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-24 bg-gray-50 border border-gray-200 p-2 rounded-xl outline-none text-md font-bold text-right focus:border-blue-500 transition-colors"
                  disabled={isSaving}
                  placeholder="-"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-gray-600">Total Marks:</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={editTotalValue}
                  onChange={(e) => setEditTotalValue(e.target.value)}
                  className="w-24 bg-gray-50 border border-gray-200 p-2 rounded-xl outline-none text-md font-bold text-right focus:border-blue-500 transition-colors"
                  disabled={isSaving}
                />
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-xs font-bold text-gray-500">Note for Parents:</span>
                <input
                  type="text"
                  value={editNoteValue}
                  onChange={(e) => setEditNoteValue(e.target.value)}
                  placeholder="Needs practice / Great job!..."
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none text-sm font-semibold focus:border-blue-500 transition-colors"
                  disabled={isSaving}
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-between mt-3 items-center">
              {getMark(editingCell.studentId, editingCell.subjectId) && (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this mark? Student will be marked absent.")) {
                      handleDelete()
                    }
                  }}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl text-sm transition-colors"
                  disabled={isSaving}
                >
                  Delete
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setEditingCell(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-blue-200"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save ✓"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
