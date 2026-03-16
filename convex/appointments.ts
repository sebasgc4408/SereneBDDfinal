import { query, mutation } from './_generated/server'
import { internal } from './_generated/api'
import { v } from 'convex/values'

export const createAppointment = mutation({
  args: {
    userId: v.id('users'),
    patientName: v.string(),
    patientEmail: v.string(),
    patientPhone: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    whatsappOptIn: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const appointmentId = await ctx.db.insert('appointments', {
      userId: args.userId,
      patientName: args.patientName,
      patientEmail: args.patientEmail,
      patientPhone: args.patientPhone,
      startTime: args.startTime,
      endTime: args.endTime,
      status: 'Confirmed',
      whatsappOptIn: args.whatsappOptIn,
    })

    if (args.whatsappOptIn && args.patientPhone) {
      await ctx.scheduler.runAfter(0, internal.whatsapp.sendWhatsAppConfirmation, {
        appointmentId,
      })
    }

    return appointmentId
  },
})

export const getAppointmentsForUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('appointments')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect()
  },
})
