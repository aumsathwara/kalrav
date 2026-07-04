"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { createAdminClient } from "../supabase/server"

export async function processOcrImage(testId: string, imageBase64: string) {
  try {
    const supabase = createAdminClient()

    // 1. Get test details to find class_id
    const { data: test, error: testError } = await supabase
      .from("tests")
      .select("class_id")
      .eq("id", testId)
      .single()

    if (testError || !test) throw new Error("Test not found")

    // 2. Get students in this class
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("id, name")
      .eq("class_id", test.class_id)
      .neq("status", "archived")

    // 3. Get subjects in this class
    const { data: subjects, error: subjectsError } = await supabase
      .from("subjects")
      .select("id, name")
      .eq("class_id", test.class_id)
      .eq("archived", false)

    if (studentsError || subjectsError) {
      throw new Error("Failed to load students or subjects for OCR mapping")
    }

    const studentsList = students?.map(s => `- ID: "${s.id}", Name: "${s.name}"`).join("\n") || ""
    const subjectsList = subjects?.map(s => `- ID: "${s.id}", Name: "${s.name}"`).join("\n") || ""

    // 4. Set up Gemini Client
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === "mock-gemini-key") {
      console.warn("No real GEMINI_API_KEY found, using mock parser")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate some mock marks
      const mockResult = []
      for (const s of students || []) {
        for (const sub of subjects || []) {
          mockResult.push({
            student_id: s.id,
            subject_id: sub.id,
            obtained: Math.floor(Math.random() * 20) + 10,
            total: 30
          })
        }
      }
      return { success: true, marks: mockResult }
    }

    const genAI = new GoogleGenerativeAI(apiKey)

    // Extract mime type and base64 data
    const match = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/)
    if (!match) throw new Error("Invalid image format")
    const mimeType = match[1]
    const base64Data = match[2]

    const prompt = `
You are an expert grading assistant. Your task is to extract handwritten student test scores from the provided image.
Match the names and subjects in the image as closely as possible to the lists below.

Available Students:
${studentsList}

Available Subjects:
${subjectsList}

Instructions:
1. Extract the scores for each student for each subject.
2. Return ONLY a valid JSON object matching the output format below. No markdown, no "json" wrappers, no other text.
3. If a student/subject combination doesn't exist, omit it. If a score is unreadable or empty, set obtained to -1.

Output format MUST be EXACTLY:
{
  "marks": [
    { "student_id": "UUID", "subject_id": "UUID", "obtained": number }
  ]
}
`

    let responseText = ""
    let retries = 3
    let delay = 1000
    const modelsToTry = [
      "gemini-2.0-flash",
      "gemini-2.5-flash"
    ]
    let modelIndex = 0

    while (retries > 0 && modelIndex < modelsToTry.length) {
      const currentModelName = modelsToTry[modelIndex]
      try {
        console.log(`[OCR] Requesting transcription using native Gemini: ${currentModelName}`)

        const model = genAI.getGenerativeModel({
          model: currentModelName,
          generationConfig: {
            responseMimeType: "application/json"
          }
        })

        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          }
        ])

        responseText = result.response.text() || ""
        if (responseText) {
          console.log(`[OCR] Success with native Gemini model: ${currentModelName}`)
          break
        }
      } catch (apiError: any) {
        console.warn(`[OCR] Model ${currentModelName} failed. Error:`, apiError)

        const isRateLimit = apiError?.status === 429 ||
          apiError?.message?.includes("429") ||
          apiError?.message?.includes("ResourceHasExhausted") ||
          apiError?.message?.includes("quota")

        if (isRateLimit && modelIndex < modelsToTry.length - 1) {
          console.warn(`[OCR] Rate-limited on ${currentModelName}. Falling back to next model...`)
          modelIndex++
          retries = 3
          await new Promise((resolve) => setTimeout(resolve, 500))
          continue
        }

        retries--
        if (retries === 0 && modelIndex === modelsToTry.length - 1) throw apiError
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay *= 2
      }
    }

    if (!responseText) {
      throw new Error("No response received from Gemini API")
    }

    // Clean response text just in case model wrapped it in markdown json block
    const cleanedText = responseText.replace(/^```json\s*/i, "").replace(/```$/, "").trim()
    const parsedData = JSON.parse(cleanedText)
    const parsedMarks = (parsedData.marks || []).map((m: any) => ({
      ...m,
      obtained: m.obtained === -1 ? null : m.obtained // Convert fallback -1 to null
    }))

    return { success: true, marks: parsedMarks }

  } catch (error) {
    console.error("OCR Image processing failed:", error)
    throw new Error("OCR Processing failed")
  }
}
