import { query, mutation } from './_generated/server'
import { internal } from './_generated/api'
import { v } from 'convex/values'

async function hasTimeConflict(
  ctx: {
    db: {
      query: (table: 'appointments' | 'calendarEvents') => any
    }
  },
  userId: string,
  startTime: number,
  endTime: number
) {
  const existingAppointments = await ctx.db
    .query('appointments')
    .withIndex('by_user', (q: any) => q.eq('userId', userId as any))
    .collect()

  const appointmentConflict = existingAppointments.some(
    (appointment: any) =>
      appointment.status !== 'Cancelled' &&
      startTime < appointment.endTime &&
      endTime > appointment.startTime
  )

  if (appointmentConflict) return true

  const calendarEvents = await ctx.db
    .query('calendarEvents')
    .withIndex('by_user', (q: any) => q.eq('userId', userId as any))
    .collect()

  return calendarEvents.some(
    (event: any) => startTime < event.endTime && endTime > event.startTime
  )
}

export const createAppointment = mutation({
  args: {
    userId: v.id('users'),
    patientName: v.string(),
    patientEmail: v.string(),
    patientPhone: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    whatsappOptIn: v.optional(v.boolean()),
    channel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const conflict = await hasTimeConflict(
      ctx,
      args.userId,
      args.startTime,
      args.endTime
    )
    if (conflict) {
      throw new Error('Selected slot is no longer available')
    }

    const appointmentId = await ctx.db.insert('appointments', {
      userId: args.userId,
      patientName: args.patientName,
      patientEmail: args.patientEmail,
      patientPhone: args.patientPhone,
      startTime: args.startTime,
      endTime: args.endTime,
      status: 'Confirmed',
      whatsappOptIn: args.whatsappOptIn,
      reminderSent: false,
      confirmedViaWhatsApp: false,
      channel: args.channel ?? 'web',
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
    const appointments = await ctx.db
      .query('appointments')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect()
    return appointments.sort((a, b) => a.startTime - b.startTime)
  },
})

export const getAppointmentById = query({
  args: { appointmentId: v.id('appointments') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.appointmentId)
  },
})

export const getAppointmentsWithDetails = query({
  args: {
    userId: v.id('users'),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const appointments = await ctx.db
      .query('appointments')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect()

    return appointments.filter((appointment) => {
      if (args.startDate !== undefined && appointment.startTime < args.startDate) {
        return false
      }
      if (args.endDate !== undefined && appointment.startTime > args.endDate) {
        return false
      }
      return true
    })
  },
})

export const cancelAppointment = mutation({
  args: {
    appointmentId: v.id('appointments'),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.appointmentId, {
      status: 'Cancelled',
      cancelledAt: Date.now(),
      cancelReason: args.reason,
    })
  },
})

export const markNoShow = mutation({
  args: { appointmentId: v.id('appointments') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.appointmentId, {
      noShow: true,
      status: 'No Show',
    })
  },
})

export const markCompleted = mutation({
  args: { appointmentId: v.id('appointments') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.appointmentId, {
      status: 'Completed',
      completedAt: Date.now(),
    })
  },
})

export const updateGoogleEventId = mutation({
  args: {
    appointmentId: v.id('appointments'),
    googleEventId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.appointmentId, {
      googleEventId: args.googleEventId,
    })
  },
})
