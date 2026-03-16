import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import { internal } from './_generated/api'

const http = httpRouter()

// GET: Meta webhook verification
http.route({
  path: '/whatsapp-webhook',
  method: 'GET',
  handler: httpAction(async (_, request) => {
    const url = new URL(request.url)
    const mode = url.searchParams.get('hub.mode')
    const token = url.searchParams.get('hub.verify_token')
    const challenge = url.searchParams.get('hub.challenge')

    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN

    if (mode === 'subscribe' && token === verifyToken) {
      return new Response(challenge, { status: 200 })
    }

    return new Response('Forbidden', { status: 403 })
  }),
})

// POST: Incoming WhatsApp messages (button replies)
http.route({
  path: '/whatsapp-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    // TODO: Verify X-Hub-Signature-256 (HMAC-SHA256) in production
    const body = await request.json()

    try {
      const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
      if (!message || message.type !== 'interactive') {
        return new Response('OK', { status: 200 })
      }

      const buttonReplyId = message.interactive?.button_reply?.id
      if (!buttonReplyId) {
        return new Response('OK', { status: 200 })
      }

      // Expected format: "confirm_{appointmentId}" or "cancel_{appointmentId}"
      const [action, ...idParts] = buttonReplyId.split('_')
      const appointmentId = idParts.join('_')

      if (!appointmentId) {
        return new Response('OK', { status: 200 })
      }

      if (action === 'cancel') {
        await ctx.runMutation(internal.whatsapp.cancelAppointmentViaWhatsApp, {
          appointmentId: appointmentId as any,
        })
      } else if (action === 'confirm') {
        await ctx.runMutation(internal.whatsapp.confirmAppointmentViaWhatsApp, {
          appointmentId: appointmentId as any,
        })
      }
    } catch {
      // Swallow parse errors — Meta sends various payload shapes
    }

    return new Response('OK', { status: 200 })
  }),
})

export default http
