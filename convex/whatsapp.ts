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

    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN

    const recipientPhone = normalizePhoneToE164(appointment.patientPhone)

    await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: recipientPhone,
        type: 'template',
        template: {
          name: 'appointment_confirmation',
          language: { code: 'en' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: appointment.patientName },
                {
                  type: 'text',
                  text: new Date(appointment.startTime).toLocaleString(),
                },
              ],
            },
          ],
        },
      }),
    })
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

    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN

    const recipientPhone = normalizePhoneToE164(appointment.patientPhone)

    const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: recipientPhone,
        type: 'template',
        template: {
          name: 'appointment_reminder',
          language: { code: 'en' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: appointment.patientName },
                {
                  type: 'text',
                  text: new Date(appointment.startTime).toLocaleString(),
                },
              ],
            },
          ],
        },
      }),
    })

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
