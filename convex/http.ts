import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import { internal } from './_generated/api'

const http = httpRouter()

// POST: Incoming WhatsApp messages from Twilio
// Twilio sends form-encoded POST. No GET verification needed.
http.route({
  path: '/whatsapp-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    // TODO: Verify X-Twilio-Signature (HMAC-SHA1) in production
    try {
      const text = await request.text()
      const params = new URLSearchParams(text)

      // Patient replied with text body (CONFIRMAR / CANCELAR)
      const body = (params.get('Body') ?? '').trim().toUpperCase()
      // ButtonPayload is set when using Twilio Content Templates with quick-reply buttons
      const buttonPayload = (params.get('ButtonPayload') ?? '').trim()

      const payload = buttonPayload || body

      if (!payload) {
        return new Response('OK', { status: 200 })
      }

      // Expected format: "confirm_{appointmentId}" or "cancel_{appointmentId}"
      // Also accept plain text replies: "CONFIRMAR" or "CANCELAR" (without appointmentId — future)
      const [action, ...idParts] = payload.split('_')
      const appointmentId = idParts.join('_')

      if (appointmentId) {
        if (action.toLowerCase() === 'cancel' || action === 'CANCELAR') {
          await ctx.runMutation(internal.whatsapp.cancelAppointmentViaWhatsApp, {
            appointmentId: appointmentId as any,
          })
        } else if (action.toLowerCase() === 'confirm' || action === 'CONFIRMAR') {
          await ctx.runMutation(internal.whatsapp.confirmAppointmentViaWhatsApp, {
            appointmentId: appointmentId as any,
          })
        }
      }
    } catch {
      // Swallow parse errors — always return 200 to Twilio
    }

    return new Response('OK', { status: 200 })
  }),
})

export default http
