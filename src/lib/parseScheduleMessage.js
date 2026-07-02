const SWAHILI_DAYS = {
  jumatatu: 'Monday',
  jumanne: 'Tuesday',
  jumatano: 'Wednesday',
  alhamisi: 'Thursday',
  ijumaa: 'Friday',
  jumamosi: 'Saturday',
  jumapili: 'Sunday',
}

const SWAHILI_NUMBERS = {
  moja: 1,
  mbili: 2,
  tatu: 3,
  nne: 4,
  tano: 5,
  sita: 6,
  saba: 7,
  nane: 8,
  tisa: 9,
  kumi: 10,
}

const SPECIAL_NUMBERS = {
  'kumi na moja': 11,
  'kumi na mbili': 12,
  'kumi na tatu': 13,
  'kumi na nne': 14,
  'kumi na tano': 15,
  'kumi na sita': 16,
  'kumi na saba': 17,
  'kumi na nane': 18,
  'kumi na tisa': 19,
  ishirini: 20,
  'ishirini na moja': 21,
  'ishirini na mbili': 22,
  'ishirini na tatu': 23,
  'ishirini na nne': 24,
}

const ORIGIN_MAP = {
  mafia: 'Mafia Island',
  nyamisati: 'Nyamisati',
  dar: 'Dar es salaam',
  'dar es salaam': 'Dar es salaam',
}

const ROUTE_MAP = {
  'Mafia Island-Nyamisati': 'Mafia Island - Nyamisati',
  'Nyamisati-Mafia Island': 'Nyamisati - Mafia Island',
  'Mafia Island-Dar es salaam': 'Mafia Island - Dar es salaam',
  'Dar es salaam-Mafia Island': 'Dar es salaam - Mafia Island',
}

const DEFAULT_DESTINATIONS = {
  'Mafia Island': 'Nyamisati',
  'Nyamisati': 'Mafia Island',
  'Dar es salaam': 'Mafia Island',
}

function parseSwahiliNumber(text) {
  const cleaned = text.toLowerCase().replace(/[^a-z\s]/g, '').trim()

  for (const [phrase, num] of Object.entries(SPECIAL_NUMBERS)) {
    if (cleaned.includes(phrase)) return num
  }

  const parts = cleaned.split(/\s+/)
  for (const part of parts) {
    if (SWAHILI_NUMBERS[part]) return SWAHILI_NUMBERS[part]
  }

  return null
}

function parseSwahiliTime(text) {
  const lower = text.toLowerCase()

  const halfMatch = lower.match(/(\w+(?:\s+\w+)*?)\s*na\s*nusu/)
  if (halfMatch) {
    const num = parseSwahiliNumber(halfMatch[1])
    if (num !== null) {
      const hour = (num + 6) % 24
      return `${String(hour).padStart(2, '0')}:30`
    }
  }

  const num = parseSwahiliNumber(lower)
  if (num !== null) {
    const hour = (num + 6) % 24
    return `${String(hour).padStart(2, '0')}:00`
  }

  return null
}

function parseDateFromText(text) {
  const dateMatch = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (!dateMatch) return null

  let [, day, month, year] = dateMatch
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function parseDayFromText(text) {
  const lower = text.toLowerCase()
  for (const [sw, en] of Object.entries(SWAHILI_DAYS)) {
    if (lower.includes(sw)) return en
  }
  return null
}

function parseOriginFromText(text) {
  const lower = text.toLowerCase()
  const match = lower.match(/(?:kuondoka|kutoka|tokana)(?:\s+bandari\s+ya)?\s+(\w+)/)
  if (!match) return null

  const word = match[1]
  for (const [key, value] of Object.entries(ORIGIN_MAP)) {
    if (word === key || word.startsWith(key)) return value
  }
  return null
}

function parseDestinationFromText(text) {
  const lower = text.toLowerCase()
  const match = lower.match(/(?:kwenda|kuelekea|kw)\s+(\w+(?:\s+\w+)?)/)
  if (!match) return null

  const phrase = match[1].trim()
  for (const [key, value] of Object.entries(ORIGIN_MAP)) {
    if (phrase === key || phrase.includes(key)) return value
  }
  return null
}

function parseDepartureTime(text) {
  const lower = text.toLowerCase()

  const parenMatch = lower.match(/\((\d{1,2}):(\d{2})\s*hrs\)/)
  if (parenMatch) {
    const h = parseInt(parenMatch[1])
    const m = parseInt(parenMatch[2])
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    }
  }

  const saaHhmmMatch = lower.match(/saa\s*(\d{1,2}):(\d{2})(?!\d)/)
  if (saaHhmmMatch) {
    const h = parseInt(saaHhmmMatch[1])
    const m = parseInt(saaHhmmMatch[2])
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    }
  }

  const hhmmMatch = lower.match(/saa\s*(\d{3,4})/)
  if (hhmmMatch) {
    let raw = hhmmMatch[1]
    if (raw.length === 3) raw = '0' + raw
    const h = parseInt(raw.substring(0, 2))
    const m = parseInt(raw.substring(2, 4))
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    }
  }

  return parseSwahiliTime(text)
}

export function parseScheduleMessages(text) {
  if (!text || typeof text !== 'string') return []

  const blocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean)
  const results = []
  const extraNotes = []

  for (const block of blocks) {
    if (block.toLowerCase().includes('kuondoka')) {
      const parsed = parseScheduleMessage(block)
      if (parsed) results.push(parsed)
    } else {
      const cleaned = block.replace(/^[_\-*]+$/, '').trim()
      if (cleaned) extraNotes.push(cleaned)
    }
  }

  if (results.length > 0 && extraNotes.length > 0) {
    const combined = extraNotes.join('\n\n')
    for (const parsed of results) {
      parsed.notes = parsed.notes
        ? parsed.notes + '\n\n---\n\n' + combined
        : combined
    }
  }

  if (results.length === 0) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    for (const line of lines) {
      const parsed = parseScheduleMessage(line)
      if (parsed) results.push(parsed)
    }
  }

  return results
}

export function parseScheduleMessage(text) {
  if (!text || typeof text !== 'string') return null

  const day = parseDayFromText(text)
  const date = parseDateFromText(text)
  const origin = parseOriginFromText(text)
  const destination = parseDestinationFromText(text) || (origin ? DEFAULT_DESTINATIONS[origin] : null)
  const departure = parseDepartureTime(text)

  if (!day || !departure) return null

  const route = origin && destination ? `${origin} - ${destination}` : null

  const departureDate = date || new Date().toISOString().split('T')[0]
  const depParts = departure.split(':').map(Number)
  const depMinutes = depParts[0] * 60 + depParts[1]
  const arrMinutes = depMinutes + 300
  const arrHour = Math.floor(arrMinutes / 60) % 24
  const arrMin = arrMinutes % 60
  const arrival = `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`

  return {
    ship_name: 'MV Kilindoni',
    route,
    days: day,
    date: departureDate,
    departure,
    arrival,
    duration: '5 hours',
    notes: text.trim(),
  }
}
