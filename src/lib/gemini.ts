import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) throw new Error("GEMINI_API_KEY env var is required")

const genAI = new GoogleGenerativeAI(apiKey)

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function generateWithGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const result = await model.generateContent(prompt)
      return result.response.text()
    } catch (err: any) {
      const status = err?.status || err?.response?.status
      if (status === 429 || err?.message?.includes("429") || err?.message?.includes("RESOURCE_EXHAUSTED")) {
        const wait = Math.min(1000 * 2 ** attempt + Math.random() * 1000, 30000)
        await delay(wait)
        continue
      }
      throw err
    }
  }

  throw new Error("Gemini rate limit: all 5 retries exhausted")
}
