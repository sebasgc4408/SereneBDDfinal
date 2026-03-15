import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const createAppointment = mutation({
  args: {
    userId: v.id('users'),
    patientName: v.string(),
    patientEmail: v.string(),
    patientPhone: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
  },
  handler: async (ctx, args) => {
    // Inserta la cita con estado inicial "Confirmed"
    // En el futuro, un background job puede procesar esto para inyectarlo en Google Calendar
    // y luego actualizar el campo googleEventId.
    const appointmentId = await ctx.db.insert('appointments', {
      userId: args.userId,
      patientName: args.patientName,
      patientEmail: args.patientEmail,
      patientPhone: args.patientPhone,
      startTime: args.startTime,
      endTime: args.endTime,
      status: 'Confirmed',
    })

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
