import { createOpenAI } from "@ai-sdk/openai"


const openAI = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const aiModel = openAI('gpt-5-nano')

