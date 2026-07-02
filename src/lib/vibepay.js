const BASE_URL = process.env.VIBEPAY_BASE_URL || 'https://xinvo.online/v1'
const SECRET_KEY = process.env.VIBEPAY_SECRET_KEY

async function vibepayRequest(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`VibePay ${endpoint} failed: ${res.status} ${err}`)
  }
  return res.json()
}

export async function createOrder({ buyer_email, buyer_name, buyer_phone, amount, reference }) {
  return vibepayRequest('/payment/create_order', {
    buyer_email: buyer_email || 'customer@example.com',
    buyer_name: buyer_name || 'Customer',
    buyer_phone,
    amount,
    currency: 'TZS',
    reference,
  })
}

export async function checkOrderStatus(orderId) {
  return vibepayRequest('/payment/order_status', { order_id: orderId })
}

export function verifyWebhook(signature) {
  return signature === process.env.VIBEPAY_WEBHOOK_TOKEN
}

export const pendingOrders = new Map()
