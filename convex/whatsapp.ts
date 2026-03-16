import { internalQuery, internalMutation, internalAction } from './_generated/server'
import { internal } from './_generated/api'
import { v } from 'convex/values'

/**
 * Normalizes a phone number string to E.164 format.
 * Strips spaces, dashes, parentheses. Ensures leading '+'.
 */
export function normalizePhoneToE164(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)]/g, '')
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned
  }
  return cleaned
}

/** Build Twilio Basic Auth header from env vars */
function twilioAuthHeader(): string {
  const accountSid = process.env.TWILIO_ACCOUNT_SID ?? ''
  const authToken = process.env.TWILIO_AUTH_TOKEN ?? ''
  return 'Basic ' + btoa(`${accountSid}:${authToken}`)
}

/** Send a WhatsApp message via Twilio Messages API */
async function sendTwilioMessage(to: string, body: string): Promise<Response> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID ?? ''
  const from = process.env.TWILIO_WHATSAPP_FROM ?? '' // e.g. "whatsapp:+14155238886"

  const params = new URLSearchParams({
    From: from,
    To: `whatsapp:${to}`,
    Body: body,
  })

  return fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: twilioAuthHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    }
  )
}

export const getAppointmentById = internalQuery({
  args: { appointmentId: v.id('appointments') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.appointmentId)
  },
})

export const sendWhatsAppConfirmation = internalAction({
  args: { appointmentId: v.id('appointments') },
  handler: async (ctx, args) => {
    const appointment = await ctx.runQuery(internal.whatsapp.getAppointmentById, {
      appointmentId: args.appointmentId,
    })

    if (!appointment) return
    if (!appointment.whatsappOptIn) return
    if (!appointment.patientPhone) return

    const phone = normalizePhoneToE164(appointment.patientPhone)
    const date = new Date(appointment.startTime).toLocaleString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    })

    const message =
      `Hola ${appointment.patientName}, tu cita ha sido confirmada para el ${date}. ` +
      `Te enviaremos un recordatorio 24 horas antes. ` +
      `Para cancelar responde CANCELAR.`

    await sendTwilioMessage(phone, message)
  },
})

export const sendWhatsAppReminder = internalAction({
  args: { appointmentId: v.id('appointments') },
  handler: async (ctx, args) => {
    const appointment = await ctx.runQuery(internal.whatsapp.getAppointmentById, {
      appointmentId: args.appointmentId,
    })

    if (!appointment) return
    if (!appointment.whatsappOptIn) return
    if (!appointment.patientPhone) return
    if (appointment.reminderSent) return

    const phone = normalizePhoneToE164(appointment.patientPhone)
    const date = new Date(appointment.startTime).toLocaleString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    })

    const message =
      `Hola ${appointment.patientName}, te recordamos que tienes una cita mañana ${date}. ` +
      `Para confirmar responde CONFIRMAR, para cancelar responde CANCELAR.`

    const response = await sendTwilioMessage(phone, message)

    if (response.ok) {
      await ctx.runMutation(internal.whatsapp.markReminderSent, {
        appointmentId: args.appointmentId,
      })
    }
  },
})

export const markReminderSent = internalMutation({
  args: { appointmentId: v.id('appointments') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.appointmentId, { reminderSent: true })
  },
})

export const checkAndSendReminders = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()
    const twentyFourHoursFromNow = now + 24 * 60 * 60 * 1000

    const upcomingAppointments = await ctx.db
      .query('appointments')
      .withIndex('by_status_and_time', (q) =>
        q.eq('status', 'Confirmed').gte('startTime', now).lte('startTime', twentyFourHoursFromNow)
      )
      .collect()

    for (const appointment of upcomingAppointments) {
      if (appointment.whatsappOptIn === true && appointment.reminderSent !== true) {
        await ctx.scheduler.runAfter(0, internal.whatsapp.sendWhatsAppReminder, {
          appointmentId: appointment._id,
        })
      }
    }
  },
})

export const cancelAppointmentViaWhatsApp = internalMutation({
  args: { appointmentId: v.id('appointments') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.appointmentId, { status: 'Cancelled' })
  },
})

export const confirmAppointmentViaWhatsApp = internalMutation({
  args: { appointmentId: v.id('appointments') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.appointmentId, { confirmedViaWhatsApp: true })
  },
})
