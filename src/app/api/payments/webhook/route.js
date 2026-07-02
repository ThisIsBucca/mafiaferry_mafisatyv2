import { NextResponse } from 'next/server'
import { verifyWebhook, pendingOrders } from '../../../../lib/vibepay'
import { sendTextMessage } from '../../../../lib/whatsappService'

export async function POST(request) {
  try {
    const signature = request.headers.get('x-vibe-signature')
    if (!verifyWebhook(signature)) {
      return NextResponse.json({ status: 'error', message: 'Invalid signature' }, { status: 401 })
    }

    const body = await request.json()
    const { order_id, payment_status, amount } = body.data || body

    if (payment_status === 'SUCCESS' && order_id) {
      const pending = pendingOrders.get(order_id)
      if (pending) {
        await sendTextMessage(
          pending.phone,
          `✓ Malipo ya TZS ${(pending.amount || amount).toLocaleString()} yamethibitishwa! Tiketi ya MV Kilindoni imehifadhiwa. Asante!`
        )
        pendingOrders.delete(order_id)
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('VibePay webhook error:', err)
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 })
  }
}
