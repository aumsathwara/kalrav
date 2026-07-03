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

