import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://localhost:3000',
    'X-Title': 'OpenClaw Chat',
  },
})
