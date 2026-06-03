import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../../lib/supabaseAdmin'
import { parseScheduleMessages } from '../../../../lib/parseScheduleMessage'
import { parseWithAI } from '../../../../lib/parseWithAI'
import { parseAnnouncementMessage, getDefaultAnnouncementImage } from '../../../../lib/parseAnnouncementMessage'
import { extractGroupMessages, extractAllMessagesDebug, sendGroupTextMessage, sendTextMessage, sendImageMessage, sendTypingIndicator } from '../../../../lib/whatsappService'

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

    for (const msg of allMessages) {
      if (msg.type !== 'text' || !msg.text) {
        console.log(`⏭️ Skipping non-text message: ${msg.type}`)
        continue
      }

      const isGroup = !!(msg.groupId)

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

        const reply = `✅ Tangazo limehifadhiwa!\n\n📢 #${shortId}\n📅 ${announcement.date}\n\n_Tangazo litaonekana kwenye tovuti._`
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
          const baseUrl = (process.env.CALLBACK_URL || '').replace('/api/whatsapp/webhook', '')
          await sendTypingIndicator(msg.from, msg.id)
          await sendTextMessage(msg.from, `Hi there! 👋

I'm a virtual assistant for *MafiaFerry* only. I can't respond to general chat or handle other requests.`)
          await sendImageMessage(msg.from, `${baseUrl}/images/thisisbucca.png`, `For any inquiries or assistance, please contact our human agent *thisisbucca*:

➡️ https://wa.me/255776986840

They'll be happy to help you! 😊`)
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

        const reply = `✅ Ratiba imesasishwa!\n\n🚢 ${parsed.ship_name}\n📅 ${daySw} ${parsed.date}\n📍 ${parsed.route}\n⏰ ${parsed.departure} - ${parsed.arrival}\n⌛ ${parsed.duration}`
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
