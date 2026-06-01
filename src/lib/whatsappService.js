const API_VERSION = 'v22.0'
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`

async function sendWhatsAppRequest(endpoint, body) {
  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_ID

  if (!token || !phoneId) {
    console.error('Missing WhatsApp credentials')
    return null
  }

  try {
    const res = await fetch(`${BASE_URL}/${phoneId}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    return await res.json()
  } catch (err) {
    console.error('WhatsApp API error:', err)
    return null
  }
}

export async function sendTextMessage(to, text) {
  return sendWhatsAppRequest('messages', {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: { body: text },
  })
}

export async function sendTypingIndicator(to, messageId) {
  if (messageId) {
    return sendWhatsAppRequest('messages', {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
      typing_indicator: { type: 'text' },
    })
  }

  return sendWhatsAppRequest('messages', {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'typing_indicator',
    typing_indicator: { type: 'text' },
  })
}

export async function sendImageMessage(to, imageUrl, caption) {
  return sendWhatsAppRequest('messages', {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'image',
    image: { link: imageUrl, caption },
  })
}

export async function sendGroupTextMessage(groupId, text) {
  return sendWhatsAppRequest('messages', {
    messaging_product: 'whatsapp',
    recipient_type: 'group',
    to: groupId,
    type: 'text',
    text: { body: text },
  })
}

export function extractGroupMessages(body) {
  const messages = []

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value
      if (!value || value.messaging_product !== 'whatsapp') continue

      for (const msg of value.messages || []) {
        const context = msg.context || {}
        const groupId = msg.group_id || context.group_id || null
        const groupSubject = context.subject || null

        if (!groupId) continue

        messages.push({
          id: msg.id,
          from: msg.from,
          timestamp: msg.timestamp,
          type: msg.type,
          text: msg.text?.body || '',
          groupId,
          groupSubject,
        })
      }
    }
  }

  return messages
}

export function extractAllMessagesDebug(body) {
  const messages = []
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value
      if (!value || value.messaging_product !== 'whatsapp') continue
      for (const msg of value.messages || []) {
        const context = msg.context || {}
        messages.push({
          id: msg.id,
          from: msg.from,
          timestamp: msg.timestamp,
          type: msg.type,
          text: msg.text?.body || '',
          groupId: msg.group_id || context.group_id || null,
          groupSubject: context.subject || null,
          rawKeys: Object.keys(msg),
          contextKeys: Object.keys(context),
        })
      }
    }
  }
  return messages
}
