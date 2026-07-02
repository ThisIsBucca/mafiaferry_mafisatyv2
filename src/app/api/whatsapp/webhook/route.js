import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../../lib/supabaseAdmin'
import { parseScheduleMessages } from '../../../../lib/parseScheduleMessage'
import { parseWithAI } from '../../../../lib/parseWithAI'
import { parseAnnouncementMessage, getDefaultAnnouncementImage } from '../../../../lib/parseAnnouncementMessage'
import { extractGroupMessages, extractAllMessagesDebug, sendGroupTextMessage, sendTextMessage, sendImageMessage, sendTypingIndicator, sendInteractiveButtons, sendInteractiveList } from '../../../../lib/whatsappService'
import { createOrder, pendingOrders } from '../../../../lib/vibepay'

const ticketConversations = new Map()

const FERRY_FARE = 16000
const FERRY_SHIP = 'MV Kilindoni'
const FERRY_ROUTE = 'Nyamisati → Kilindoni'

async function handleTicketFlow(msg) {
  const conv = ticketConversations.get(msg.from)

  if (conv.step === 'passengers') {
    const count = parseInt(msg.text)
    if (isNaN(count) || count < 1 || count > 20) {
      await sendTextMessage(msg.from, 'Tafadhali tumia namba halali (1-20). Idadi ya abiria?')
      return
    }
    const total = count * FERRY_FARE
    ticketConversations.set(msg.from, { step: 'phone', passengers: count, total, schedule: conv.schedule })
    await sendTextMessage(msg.from, `Jumla: TZS ${total.toLocaleString()} (${count} × ${FERRY_FARE.toLocaleString()})\nTuma namba yako ya simu kwa malipo.\nMfano: 0712345678`)
    return
  }

  if (conv.step === 'phone') {
    let phone = msg.text.replace(/[^0-9]/g, '')
    if (phone.startsWith('0')) phone = '255' + phone.slice(1)
    else if (phone.startsWith('7')) phone = '255' + phone
    if (!phone.startsWith('255') || phone.length < 10) {
      await sendTextMessage(msg.from, 'Namba si sahihi. Tuma namba halali ya Tanzania.\nMfano: 0712345678')
      return
    }

    const reference = `wa_${phone}_${Date.now()}`
    const amount = conv.total

    try {
      const result = await createOrder({
        buyer_phone: phone,
        buyer_name: msg.from,
        amount,
        reference,
      })
      console.log('VibePay createOrder response:', JSON.stringify(result))

      if (result.status === 'success' && result.data?.order_id) {
        pendingOrders.set(result.data.order_id, {
          phone: msg.from,
          amount,
          reference,
          passengers: conv.passengers,
          schedule: conv.schedule,
        })
        ticketConversations.delete(msg.from)

        const daySw = conv.schedule ? {
          Monday: 'Jumatatu', Tuesday: 'Jumanne', Wednesday: 'Jumatano',
          Thursday: 'Alhamisi', Friday: 'Ijumaa', Saturday: 'Jumamosi', Sunday: 'Jumapili',
        }[conv.schedule.days] : ''

        const scheduleInfo = conv.schedule
          ? `\n${conv.schedule.ship}\n${daySw} ${conv.schedule.date}\n${conv.schedule.route}`
          : ''

        await sendTextMessage(msg.from, `✓ Ombi la malipo limetumwa kwa ${msg.text}.${scheduleInfo}\nAngalia skrini ya simu yako na fuata maagizo ya USSD.`)
      } else {
        await sendTextMessage(msg.from, '❌ Hitilafu wakati wa kutuma ombi la malipo. Tafadhali jaribu tena.')
        ticketConversations.delete(msg.from)
      }
    } catch (err) {
      console.error('Payment error:', err)
      await sendTextMessage(msg.from, '❌ Hitilafu ya kiufundi. Tafadhali jaribu tena baadaye.')
      ticketConversations.delete(msg.from)
    }
  }
}

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  console.log('🔐 Webhook GET:', { mode, token, challenge })

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse('Forbidden', { status: 403 })
}

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('📩 RAW WEBHOOK PAYLOAD:', JSON.stringify(body, null, 2))

    const allMessages = extractAllMessagesDebug(body)
    console.log(`📨 Total messages received: ${allMessages.length}`)

    for (const msg of allMessages) {
      console.log('💬 MESSAGE DETAILS:', {
        from: msg.from,
        type: msg.type,
        text: msg.text,
        groupId: msg.groupId,
        groupSubject: msg.groupSubject,
        rawKeys: msg.rawKeys,
        contextKeys: msg.contextKeys,
      })
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      const today = new Date().toISOString().split('T')[0]
      const { data: deleted, error: delErr } = await supabaseAdmin
        .from('announcements')
        .delete()
        .lt('date', today)

      if (delErr) {
        console.error('❌ Failed to cleanup expired announcements:', delErr)
      } else if (deleted && deleted.length > 0) {
        console.log(`🗑️ Cleaned up ${deleted.length} expired announcement(s)`)
      }
    }

    for (const msg of allMessages) {
      const isGroup = !!(msg.groupId)

      if (msg.type === 'interactive' && (msg.interactive?.button_reply || msg.interactive?.list_reply)) {
        const reply = msg.interactive.button_reply || msg.interactive.list_reply
        const buttonId = reply.id
        console.log(`🔘 Interactive reply: ${buttonId}`)

        const supabaseAdmin = getSupabaseAdmin()

        if (buttonId === 'view_schedule') {
          if (!supabaseAdmin) {
            await sendTextMessage(msg.from, '❌ Samahani, kuna tatizo la kiufundi.')
            continue
          }
          const { data: schedules } = await supabaseAdmin
            .from('schedules')
            .select('*')
            .order('created_at', { ascending: true })

          if (!schedules || schedules.length === 0) {
            await sendTextMessage(msg.from, '❌ Hakuna ratiba kwa sasa.')
            continue
          }

          const dayMap = {
            Monday: 'Jumatatu', Tuesday: 'Jumanne', Wednesday: 'Jumatano',
            Thursday: 'Alhamisi', Friday: 'Ijumaa', Saturday: 'Jumamosi', Sunday: 'Jumapili',
          }
          const routes = [...new Set(schedules.map(s => s.route))]
          const sections = routes.map(route => ({
            title: route,
            rows: schedules.filter(s => s.route === route).map(s => ({
              id: `schedule_${s.id}`,
              title: `${dayMap[s.days]} ${s.departure}`,
              description: `${s.date} - Kuondoka ${s.departure} (${s.duration})`,
            })),
          }))

          await sendInteractiveList(msg.from, 'Chagua ratiba unayotaka kuona:', 'Chagua', sections)
        } else if (buttonId.startsWith('schedule_')) {
          const id = buttonId.replace('schedule_', '')
          if (!supabaseAdmin) {
            await sendTextMessage(msg.from, '❌ Samahani, kuna tatizo la kiufundi.')
            continue
          }
          const { data: schedule } = await supabaseAdmin
            .from('schedules')
            .select('*')
            .eq('id', id)
            .single()

          if (!schedule) {
            await sendTextMessage(msg.from, '❌ Ratiba haijapatikana.')
            continue
          }

          const daySw = {
            Monday: 'Jumatatu', Tuesday: 'Jumanne', Wednesday: 'Jumatano',
            Thursday: 'Alhamisi', Friday: 'Ijumaa', Saturday: 'Jumamosi', Sunday: 'Jumapili',
          }[schedule.days]

          const baseUrl = (process.env.CALLBACK_URL || 'https://mafiaferry.vercel.app').replace('/api/whatsapp/webhook', '')
          if (schedule.ship_name.toLowerCase().includes('kilindoni')) {
            await sendImageMessage(msg.from, `${baseUrl}/images/mvkilindoni.jpg`, 'MV Kilindoni')
            await new Promise(r => setTimeout(r, 500))
          }
          await sendTextMessage(msg.from, `${schedule.ship_name}\n${daySw} ${schedule.date}\n${schedule.route}\nInaondoka: ${schedule.departure}\nMuda: ${schedule.duration}`)
        } else if (buttonId === 'contact_us') {
          await sendTextMessage(msg.from, `Wasiliana Nasi\n\n1. Philox\n   Tel: 255688883219\n   wa.me/255688883219\n\n2. Bucca\n   Tel: 255776986840\n   wa.me/255776986840`)
        } else if (buttonId === 'buy_ticket') {
          if (!supabaseAdmin) {
            await sendTextMessage(msg.from, '❌ Samahani, kuna tatizo la kiufundi.')
            continue
          }
          const { data: schedules } = await supabaseAdmin
            .from('schedules')
            .select('*')
            .order('created_at', { ascending: true })

          if (!schedules || schedules.length === 0) {
            await sendTextMessage(msg.from, '❌ Hakuna ratiba kwa sasa.')
            continue
          }

          const dayMap = {
            Monday: 'Jumatatu', Tuesday: 'Jumanne', Wednesday: 'Jumatano',
            Thursday: 'Alhamisi', Friday: 'Ijumaa', Saturday: 'Jumamosi', Sunday: 'Jumapili',
          }
          const routes = [...new Set(schedules.map(s => s.route))]
          const sections = routes.map(route => ({
            title: route,
            rows: schedules.filter(s => s.route === route).map(s => ({
              id: `buy_schedule_${s.id}`,
              title: `${dayMap[s.days]} ${s.departure}`,
              description: `${s.date} - Kuondoka ${s.departure} (${s.duration})`,
            })),
          }))

          await sendInteractiveList(msg.from, 'Chagua siku ya safari:', 'Chagua', sections)
        } else if (buttonId.startsWith('buy_schedule_')) {
          const scheduleId = buttonId.replace('buy_schedule_', '')
          if (!supabaseAdmin) {
            await sendTextMessage(msg.from, '❌ Samahani, kuna tatizo la kiufundi.')
            continue
          }
          const { data: schedule } = await supabaseAdmin
            .from('schedules')
            .select('*')
            .eq('id', scheduleId)
            .single()

          if (!schedule) {
            await sendTextMessage(msg.from, '❌ Ratiba haijapatikana.')
            continue
          }

          ticketConversations.set(msg.from, {
            step: 'passengers',
            schedule: {
              id: schedule.id,
              ship: schedule.ship_name,
              route: schedule.route,
              date: schedule.date,
              days: schedule.days,
              departure: schedule.departure,
            },
          })

          const daySw = {
            Monday: 'Jumatatu', Tuesday: 'Jumanne', Wednesday: 'Jumatano',
            Thursday: 'Alhamisi', Friday: 'Ijumaa', Saturday: 'Jumamosi', Sunday: 'Jumapili',
          }[schedule.days]

          await sendTextMessage(msg.from, `Umechagua:\n${schedule.ship_name}\n${daySw} ${schedule.date}\n${schedule.route}\nInaondoka: ${schedule.departure}\n\nIdadi ya abiria? (Tuma namba 1-20)`)
        }
        continue
      }

      if (msg.type !== 'text' || !msg.text) {
        console.log(`⏭️ Skipping non-text message: ${msg.type}`)
        continue
      }

      if (!isGroup && ticketConversations.has(msg.from)) {
        await handleTicketFlow(msg)
        continue
      }

      const announcement = parseAnnouncementMessage(msg.text)
      if (announcement) {
        console.log('📢 Detected TANGAZO announcement:', JSON.stringify(announcement, null, 2))

        const supabaseAdmin = getSupabaseAdmin()
        if (!supabaseAdmin) {
          console.error('❌ Supabase admin not initialized')
          if (isGroup) await sendGroupTextMessage(msg.groupId, '❌ Samahani, kuna tatizo la kiufundi. Tafadhali jaribu tena baadaye.')
          continue
        }

        const { data: existing } = await supabaseAdmin
          .from('announcements')
          .select('id, short_id')
          .eq('title', announcement.title)
          .maybeSingle()

        let shortId
        if (existing) {
          const { error } = await supabaseAdmin
            .from('announcements')
            .update({
              title: announcement.title,
              image_url: getDefaultAnnouncementImage(),
              date: announcement.date,
            })
            .eq('id', existing.id)

          if (error) {
            console.error('❌ Failed to update announcement:', error)
            if (isGroup) await sendGroupTextMessage(msg.groupId, '❌ Hitilafu wakati wa kusasisha tangazo.')
            continue
          }
          shortId = existing.short_id
        } else {
          const { data: inserted, error } = await supabaseAdmin
            .from('announcements')
            .insert({
              title: announcement.title,
              image_url: getDefaultAnnouncementImage(),
              date: announcement.date,
            })
            .select('short_id')
            .single()

          if (error) {
            console.error('❌ Failed to insert announcement:', error)
            if (isGroup) await sendGroupTextMessage(msg.groupId, '❌ Hitilafu wakati wa kuhifadhi tangazo.')
            continue
          }
          shortId = inserted.short_id
        }

        const reply = `Tangazo limehifadhiwa\n\n#${shortId}\n${announcement.date}\n\n_Tangazo litaonekana kwenye tovuti._`
        console.log('📤 Reply:', reply)
        if (isGroup) await sendGroupTextMessage(msg.groupId, reply)
        else await sendTextMessage(msg.from, reply)
        continue
      }

      let parsedSchedules = await parseWithAI(msg.text)

      if (parsedSchedules.length === 0) {
        console.log('⚠️ AI parsing returned nothing, falling back to regex parser')
        parsedSchedules = parseScheduleMessages(msg.text)
      }

      if (parsedSchedules.length === 0) {
        console.log('❌ Failed to parse any schedule from message:', msg.text)
        if (isGroup) {
          await sendGroupTextMessage(msg.groupId, '❌ Samahani, siwezi kuchambua ujumbe huu. Tumia muundo: siku tarehe kuondoka mahali saa (ratiba moja kwa mstari)')
        } else {
          const baseUrl = (process.env.CALLBACK_URL || 'https://mafiaferry.vercel.app').replace('/api/whatsapp/webhook', '')
          await sendImageMessage(msg.from, `${baseUrl}/mafia_ferry.png`, 'MafiaFerry')
          await new Promise(r => setTimeout(r, 500))
          await sendInteractiveButtons(msg.from, 'Habari! Mimi ni msaidizi wa MafiaFerry. Chagua moja kati ya huduma zifuatazo:', [
            { id: 'view_schedule', title: 'Angalia Ratiba' },
            { id: 'buy_ticket', title: 'Nunua Tiketi' },
            { id: 'contact_us', title: 'Wasiliana Nasi' },
          ])
        }
        continue
      }

      for (const parsed of parsedSchedules) {
        console.log('✅ Parsed schedule:', JSON.stringify(parsed, null, 2))

        const supabaseAdmin = getSupabaseAdmin()
        if (!supabaseAdmin) {
          console.error('❌ Supabase admin not initialized')
          continue
        }
        const { data: existing } = await supabaseAdmin
          .from('schedules')
          .select('id')
          .eq('ship_name', parsed.ship_name)
          .eq('route', parsed.route)
          .eq('days', parsed.days)
          .maybeSingle()

        if (existing) {
          console.log(`🔄 Updating existing schedule: ${existing.id}`)
          const { error } = await supabaseAdmin
            .from('schedules')
            .update(parsed)
            .eq('id', existing.id)

          if (error) {
            console.error('Update error:', error)
            const errMsg = '❌ Hitilafu wakati wa kusasisha ratiba.'
            if (isGroup) await sendGroupTextMessage(msg.groupId, errMsg)
            else await sendTextMessage(msg.from, errMsg)
            continue
          }
        } else {
          console.log('➕ Inserting new schedule')
          const { error } = await supabaseAdmin
            .from('schedules')
            .insert(parsed)

          if (error) {
            console.error('Insert error:', error)
            const errMsg = '❌ Hitilafu wakati wa kuongeza ratiba.'
            if (isGroup) await sendGroupTextMessage(msg.groupId, errMsg)
            else await sendTextMessage(msg.from, errMsg)
            continue
          }
        }

        const daySw = {
          Monday: 'Jumatatu',
          Tuesday: 'Jumanne',
          Wednesday: 'Jumatano',
          Thursday: 'Alhamisi',
          Friday: 'Ijumaa',
          Saturday: 'Jumamosi',
          Sunday: 'Jumapili',
        }[parsed.days]

        const reply = `Ratiba imesasishwa\n\n${parsed.ship_name}\n${daySw} ${parsed.date}\n${parsed.route}\nInaondoka: ${parsed.departure}\nMuda: ${parsed.duration}`
        console.log('📤 Reply:', reply)
        if (isGroup) await sendGroupTextMessage(msg.groupId, reply)
        else await sendTextMessage(msg.from, reply)
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('💥 Webhook error:', err)
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 })
  }
}
