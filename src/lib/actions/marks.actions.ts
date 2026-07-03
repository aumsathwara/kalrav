"use server"

import { createAdminClient } from "../supabase/server"

export async function updateMark(testId: string, studentId: string, subjectId: string, obtained: number | null, total: number) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("marks")
    .upsert({
      test_id: testId,
      student_id: studentId,
      subject_id: subjectId,
      obtained,
      total,
      updated_at: new Date().toISOString()
    }, { onConflict: "test_id,student_id,subject_id" })

  if (error) {
    console.error("Error upserting mark", error)
    throw new Error("Failed to update mark")
  }

  return { success: true }
}

export async function updateMarksBatch(
  testId: string,
  marksList: { student_id: string; subject_id: string; obtained: number | null; total: number }[]
) {
  const supabase = createAdminClient()

  const rows = marksList.map((m) => ({
    test_id: testId,
    student_id: m.student_id,
    subject_id: m.subject_id,
    obtained: m.obtained,
    total: m.total,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase.from("marks").upsert(rows, {
    onConflict: "test_id,student_id,subject_id",
  })

  if (error) {
    console.error("Error batch upserting marks:", error)
    throw new Error("Failed to batch update marks")
  }

  return { success: true }
}

export async function updateSubjectTotalMarks(testId: string, subjectId: string, total: number) {
  const supabase = createAdminClient()
  
  // 1. Get test and class details
  const { data: test } = await supabase.from("tests").select("class_id").eq("id", testId).single()
  if (!test) throw new Error("Test not found")

  // 2. Fetch all students in the class
  const { data: students } = await supabase.from("students").select("id").eq("class_id", test.class_id).neq("status", "archived")
  
  // 3. Fetch existing marks for this test and subject
  const { data: existingMarks } = await supabase
    .from("marks")
    .select("student_id, obtained")
    .eq("test_id", testId)
    .eq("subject_id", subjectId)

  const existingMap = new Map((existingMarks || []).map(m => [m.student_id, m.obtained]))

  // 4. Prepare upsert rows
  const rows = (students || []).map((s) => ({
    test_id: testId,
    student_id: s.id,
    subject_id: subjectId,
    obtained: existingMap.has(s.id) ? existingMap.get(s.id) : null,
    total,
    updated_at: new Date().toISOString()
  }))

  const { error } = await supabase.from("marks").upsert(rows, {
    onConflict: "test_id,student_id,subject_id"
  })

  if (error) {
    console.error("Error updating subject total:", error)
    throw new Error("Failed to update subject total")
  }

  return { success: true }
}

