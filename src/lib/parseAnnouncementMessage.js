const DEFAULT_ANNOUNCEMENT_IMAGE = 'https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/announcements/announcyy.png'

export function parseAnnouncementMessage(text) {
  if (!text || typeof text !== 'string') return null

  const lines = text.trim().split('\n')
  const firstLine = lines[0]?.trim().toUpperCase() || ''

  if (!firstLine.startsWith('*TANGAZO')) return null

  const dateMatch = text.match(/(\d{2})[\/-](\d{2})[\/-](\d{4})/)
  if (!dateMatch) return null

  const [, day, month, year] = dateMatch
  const parsedDate = `${year}-${month}-${day}`

  const title = text
    .replace(/\*{1,2}/g, '')
    .replace(/_{1,2}/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return { title, date: parsedDate }
}

export function getDefaultAnnouncementImage() {
  return DEFAULT_ANNOUNCEMENT_IMAGE
}
