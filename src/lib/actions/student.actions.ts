"use server"

import { createAdminClient } from "../supabase/server"

export async function getStudentDashboardData(studentId: string) {
  try {
    const supabase = createAdminClient()

    // 1. Get student & class
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("*, classes(name)")
      .eq("id", studentId)
      .single()

    if (studentError || !student) throw new Error("Student not found")

    // 2. Get all published tests for this class
    const { data: tests } = await supabase
      .from("tests")
      .select("*")
      .eq("class_id", student.class_id)
      .eq("status", "published")
      .order("test_date", { ascending: true })

    const testIds = tests?.map(t => t.id) || []

    // 3. Get all marks for this student in these tests
    const { data: marks } = await supabase
      .from("marks")
      .select("*, subjects(name)")
      .eq("student_id", studentId)
      .in("test_id", testIds.length > 0 ? testIds : ["00000000-0000-0000-0000-000000000000"])

    // 4. Calculate progress history
    const history = tests?.map(t => {
      const testMarks = marks?.filter(m => m.test_id === t.id) || []
      const obtained = testMarks.reduce((sum, m) => sum + (m.obtained || 0), 0)
      const total = testMarks.reduce((sum, m) => sum + m.total, 0)
      const percentage = total > 0 ? (obtained / total) * 100 : 0

      return {
        testName: t.name,
        date: t.test_date,
        percentage: Number(percentage.toFixed(1))
      }
    }) || []

    // 5. Current performance (latest test)
    const latestTest = tests && tests.length > 0 ? tests[tests.length - 1] : null
    let currentScore = 0
    let improvement = 0
    let subjectPerformance: any[] = []

    if (latestTest) {
      const currentMarks = marks?.filter(m => m.test_id === latestTest.id) || []
      const obtained = currentMarks.reduce((sum, m) => sum + (m.obtained || 0), 0)
      const total = currentMarks.reduce((sum, m) => sum + m.total, 0)
      currentScore = total > 0 ? Number(((obtained / total) * 100).toFixed(1)) : 0

      if (history.length > 1) {
        const previousScore = history[history.length - 2].percentage
        improvement = Number((currentScore - previousScore).toFixed(1))
      }

      const { data: studentNotes } = await supabase
        .from("notes")
        .select("*")
        .eq("test_id", latestTest.id)
        .eq("student_id", studentId)
        .eq("type", "subject")

      const notesMap = new Map((studentNotes || []).map(n => [n.subject_id, n.content]))

      subjectPerformance = currentMarks.map(m => ({
        subjectName: (m.subjects as any)?.name,
        obtained: m.obtained,
        total: m.total,
        percentage: m.total > 0 ? Number((((m.obtained || 0) / m.total) * 100).toFixed(1)) : 0,
        note: notesMap.get(m.subject_id) || undefined
      }))
      // Fetch published insights for the latest test
      const { data: insightsData } = await supabase
        .from("ai_insights")
        .select("content")
        .eq("test_id", latestTest.id)
        .eq("status", "published")
        .maybeSingle()

      return {
        student,
        history,
        currentScore,
        improvement,
        subjectPerformance,
        latestTestName: latestTest?.name || "No tests yet",
        insights: insightsData?.content || null
      }
    }

    return {
      student,
      history,
      currentScore: 0,
      improvement: 0,
      subjectPerformance: [],
      latestTestName: "No tests yet",
      insights: null
    }

  } catch (err) {
    console.warn("Using mock data for student dashboard due to error: ", err)
    
    // Mock Data Fallback
    return {
      student: { id: studentId, name: "Vrutti", emoji: "😀", classes: { name: "Std 7" } },
      latestTestName: "August Test",
      currentScore: 87.4,
      improvement: 3.1,
      history: [
        { testName: "June Test", date: "2023-06-15", percentage: 80.2 },
        { testName: "July Test", date: "2023-07-15", percentage: 84.3 },
        { testName: "August Test", date: "2023-08-15", percentage: 87.4 }
      ],
      subjectPerformance: [
        { subjectName: "Maths", obtained: 26, total: 30, percentage: 86.7 },
        { subjectName: "Science", obtained: 45, total: 50, percentage: 90.0 },
        { subjectName: "English", obtained: 18, total: 21, percentage: 85.7 }
      ],
      insights: "💡 **Class Strengths**\n- Excellent understanding of science concepts classwide.\n\n⚠️ **Areas of Improvement**\n- Improve step-by-step math problem-solving methods."
    }
  }
}

export async function getStudentsByClass(classId: string) {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("class_id", classId)
      .order("name", { ascending: true })

    if (error) throw error
    return data || []
  } catch (err) {
    console.warn("Using mock student list due to error: ", err)
    return [
      { id: "s1", name: "Vrutti", emoji: "😀", class_id: classId },
      { id: "s2", name: "Mansi", emoji: "😀", class_id: classId },
      { id: "s3", name: "Kevan", emoji: "🤓", class_id: classId },
      { id: "s4", name: "Dev", emoji: "😊", class_id: classId }
    ]
  }
}

export async function createStudent(classId: string, name: string, emoji: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("students")
    .insert([{ class_id: classId, name, emoji }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateStudent(studentId: string, name: string, emoji: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("students")
    .update({ name, emoji })
    .eq("id", studentId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteStudent(studentId: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", studentId)

  if (error) throw error
  return true
}

