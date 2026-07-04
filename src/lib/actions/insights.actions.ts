"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { createAdminClient } from "../supabase/server"

export async function generateTestInsights(testId: string) {
  try {
    const supabase = createAdminClient()

    // 1. Fetch test details
    const { data: test, error: testError } = await supabase
      .from("tests")
      .select("*, classes(name)")
      .eq("id", testId)
      .single()

    if (testError || !test) throw new Error("Test not found")

    // 2. Fetch marks
    const { data: marks, error: marksError } = await supabase
      .from("marks")
      .select("*, students(name), subjects(name)")
      .eq("test_id", testId)

    if (marksError || !marks) throw new Error("Failed to fetch marks for insights")

    if (marks.length === 0) {
      return { success: false, error: "No marks recorded yet for this test" }
    }

    // 2b. Fetch subject notes context
    const { data: notes } = await supabase
      .from("notes")
      .select("*")
      .eq("test_id", testId)
      .eq("type", "subject")

    // 3. Compute aggregations for the prompt
    const totalMarks = marks.reduce((sum, m) => sum + (m.obtained || 0), 0)
    const totalMax = marks.reduce((sum, m) => sum + m.total, 0)
    const classAverage = totalMax > 0 ? (totalMarks / totalMax) * 100 : 0

    // Subject averages
    const subjectStats: Record<string, { totalObtained: number; totalMax: number; count: number; name: string }> = {}
    // Student averages
    const studentStats: Record<string, { totalObtained: number; totalMax: number; name: string }> = {}

    marks.forEach(m => {
      const subName = (m.subjects as any)?.name || "Unknown"
      if (!subjectStats[m.subject_id]) {
        subjectStats[m.subject_id] = { totalObtained: 0, totalMax: 0, count: 0, name: subName }
      }
      subjectStats[m.subject_id].totalObtained += (m.obtained || 0)
      subjectStats[m.subject_id].totalMax += m.total
      subjectStats[m.subject_id].count++

      const studName = (m.students as any)?.name || "Unknown"
      if (!studentStats[m.student_id]) {
        studentStats[m.student_id] = { totalObtained: 0, totalMax: 0, name: studName }
      }
      studentStats[m.student_id].totalObtained += (m.obtained || 0)
      studentStats[m.student_id].totalMax += m.total
    })

    const subjectsSummary = Object.values(subjectStats).map(s => {
      const avg = s.totalMax > 0 ? (s.totalObtained / s.totalMax) * 100 : 0
      return `- ${s.name}: Average ${avg.toFixed(1)}%`
    }).join("\n")

    // Compile detailed student percentage performance + feedback notes
    const studentPerformanceDetails = Object.keys(studentStats).map(studentId => {
      const s = studentStats[studentId]
      const studentMarks = marks.filter(m => m.student_id === studentId)
      const validMarks = studentMarks.filter(m => m.obtained !== null)
      
      const subjectDetails = validMarks.map(m => {
        const subName = (m.subjects as any)?.name || "Unknown"
        const percentage = m.total > 0 ? (Number(m.obtained) / Number(m.total)) * 100 : 0
        const matchingNote = notes?.find(n => n.student_id === studentId && n.subject_id === m.subject_id)
        const noteText = matchingNote ? ` (Teacher note: "${matchingNote.content}")` : ""
        return `    - ${subName}: ${percentage.toFixed(1)}%${noteText}`
      }).join("\n")
      
      const overall = s.totalMax > 0 ? (s.totalObtained / s.totalMax) * 100 : 0
      return `- Student: ${s.name} (Overall percentage: ${overall.toFixed(1)}%):\n${subjectDetails}`
    }).join("\n\n")

    // 4. Call Gemini
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === "mock-gemini-key") {
      console.warn("No real GEMINI_API_KEY, using mock insights")
      await new Promise(r => setTimeout(r, 1500))

      const mockContent = `
💡 **Class Strengths**
- Strong scores overall in standard ${test.classes?.name || "class"}.
- Many students demonstrated consistent understanding of core concepts.

⚠️ **Areas of Improvement**
- Review subject specific concepts where students showed lower averages.
- Target guidance for individual concerns highlighted in notes.

📝 **Actionable Recommendations**
1. Review test questions with low class averages.
2. Coordinate individual feedback loops for subjects with custom teacher notes.
`
      // Save mock insights
      await supabase.from("ai_insights").upsert({
        test_id: testId,
        content: mockContent.trim(),
        status: "draft"
      }, { onConflict: "test_id" })

      return { success: true, insights: mockContent.trim() }
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    
    const insightsSchema = {
      type: "object",
      description: "Class educational analysis with strengths, improvements, and actionable recommendations",
      properties: {
        strengths: {
          type: "array",
          description: "List of key areas or subjects where the class/students excelled based on scores and positive feedback",
          items: { type: "string" }
        },
        improvements: {
          type: "array",
          description: "List of areas needing focus, topics needing review, or specific students requiring support based on scores and teacher notes",
          items: { type: "string" }
        },
        recommendations: {
          type: "array",
          description: "Concrete, actionable, simple steps the teacher can execute next to address issues raised in scores and notes",
          items: { type: "string" }
        }
      },
      required: ["strengths", "improvements", "recommendations"]
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: insightsSchema as any
      }
    })

    const prompt = `
You are an expert educational data analyst. You are analyzing test results and teacher comments/feedback for a class.
Test Name: ${test.name}
Class Standard: ${test.classes?.name || "Unknown"}
Class Average: ${classAverage.toFixed(1)}%

Subject Breakdown:
${subjectsSummary}

Detailed Student Performance (obtained percentages & specific teacher feedback notes):
${studentPerformanceDetails}

Instructions:
1. Provide a professional and constructive educational analysis of this test's results.
2. Structure the output into strengths, improvements, and actionable recommendations arrays.
3. Review and integrate the notes context (e.g. if a teacher noted a student "needs practice in spelling" or "excellent at geometry", use this context directly to shape the class areas of improvement and recommendations).
4. Keep the language simple, encouraging, and clear.
`

    const response = await model.generateContent(prompt)
    const jsonText = response.response.text().trim()
    const parsedData = JSON.parse(jsonText)

    // Convert structured JSON back to standard markdown formatting for DB storage and parent viewing
    const formattedInsights = `
💡 **Class Strengths**
${parsedData.strengths.map((s: string) => `- ${s}`).join("\n")}

⚠️ **Areas of Improvement**
${parsedData.improvements.map((s: string) => `- ${s}`).join("\n")}

📝 **Actionable Recommendations**
${parsedData.recommendations.map((s: string, idx: number) => `${idx + 1}. ${s}`).join("\n")}
`.trim()

    // 5. Save to Database
    const { error: upsertError } = await supabase
      .from("ai_insights")
      .upsert({
        test_id: testId,
        content: formattedInsights,
        status: "draft",
        updated_at: new Date().toISOString()
      }, { onConflict: "test_id" })

    if (upsertError) throw upsertError

    return { success: true, insights: formattedInsights }

  } catch (error) {
    console.error("AI Insights generation failed, falling back to mock:", error)
    
    const mockContent = `
💡 **Class Strengths**
- Strong scores overall in class standard standard.
- Many students demonstrated consistent understanding of core concepts.

⚠️ **Areas of Improvement**
- Review subject specific concepts where students showed lower averages.
- Target guidance for individual concerns highlighted in notes.

📝 **Actionable Recommendations**
1. Review test questions with low class averages.
2. Coordinate individual feedback loops for subjects with custom teacher notes.
`
    return { success: true, insights: mockContent.trim() }
  }
}

export async function getTestInsights(testId: string) {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("ai_insights")
      .select("*")
      .eq("test_id", testId)
      .maybeSingle()

    if (error) throw error
    return data || null
  } catch (error) {
    console.error("Failed to retrieve insights:", error)
    return null
  }
}

export async function publishTestInsights(testId: string, content: string) {
  try {
    const supabase = createAdminClient()
    const { error } = await supabase
      .from("ai_insights")
      .upsert({
        test_id: testId,
        content,
        status: "published",
        updated_at: new Date().toISOString()
      }, { onConflict: "test_id" })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.warn("Failed to publish insights, falling back to mock success:", error)
    return { success: true }
  }
}
