import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
})

const SYSTEM_PROMPT = `You are a ferry schedule parser for MV Kilindoni. Extract schedule information from WhatsApp messages.

RULES:
- Ship name is always "MV Kilindoni"
- Duration is always "5 hours"
- Route format: "Origin - Destination"
- Days in English (Monday, Tuesday, etc.)
- Dates in YYYY-MM-DD format
- Times in HH:MM 24-hour format
- Origin from "Kuondoka/Kutoka" keyword
- If destination not specified, use defaults: Mafia Island → Nyamisati, Nyamisati → Mafia Island, Dar es Salaam → Mafia Island
- Place names: mafia/mafia island → "Mafia Island", nyamisati → "Nyamisati", dar/dar es salaam → "Dar es salaam"
- Swahili times: add 6 hours (saa mbili = 08:00, saa nane usiku = 02:00)
- Extract general notes/disclaimers from the message and put them in every schedule's notes field
- A message can contain multiple schedules (outbound + return)

NOTES RECOGNITION:
- Only include weather-related notes/disclaimers in the notes field (e.g. "Mabadiliko ya ratiba yanaweza kutokea wakati wowote kutokana na hali ya hewa")
- Ignore other non-schedule text like "kupakia magari", "kushusha magari", summary lines ("Mv Kilindoni itaondoka..."), separators, etc.
- If no weather disclaimer exists, leave notes field empty
- DO NOT create schedules from loading info or general text

Return ONLY a JSON object with this exact structure, no markdown:
{"schedules":[{"ship_name":"MV Kilindoni","route":"Mafia Island - Nyamisati","days":"Tuesday","date":"2026-06-02","departure":"15:30","arrival":"20:30","duration":"5 hours","notes":"any notes"}]}`

function extractJSON(raw) {
  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
  const parsed = JSON.parse(cleaned)
  return parsed.schedules || []
}

async function tryGemini(text) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: `Parse this ferry schedule message:\n\n${text}` }] }],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.1,
    },
  })
  return extractJSON(response.text)
}

async function tryOpenRouter(text) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://mafiaferry.com',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Parse this ferry schedule message:\n\n${text}` },
      ],
      temperature: 0.1,
    }),
  })

  if (!res.ok) {
    throw new Error(`OpenRouter ${res.status}: ${await res.text()}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('OpenRouter: empty response')

  return extractJSON(content)
}

export async function parseWithAI(text) {
  if (!text || typeof text !== 'string') return []

  const errors = []

  try {
    const result = await tryGemini(text)
    if (result.length > 0) {
      console.log('✅ Gemini parsing succeeded')
      return result
    }
  } catch (err) {
    console.warn('⚠️ Gemini failed:', err.message)
    errors.push({ provider: 'gemini', error: err.message })
  }

  try {
    const result = await tryOpenRouter(text)
    if (result.length > 0) {
      console.log('✅ OpenRouter parsing succeeded')
      return result
    }
  } catch (err) {
    console.warn('⚠️ OpenRouter failed:', err.message)
    errors.push({ provider: 'openrouter', error: err.message })
  }

  console.error('❌ Both AI providers failed:', errors)
  return []
}
