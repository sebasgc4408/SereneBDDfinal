import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const createBookingRequest = mutation({
  args: {
    psychologistId: v.id('users'),
    patientName: v.string(),
    patientEmail: v.string(),
    patientPhone: v.optional(v.string()),
    requestedDate: v.number(),
    requestedTime: v.string(),
    channel: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('bookingRequests', {
      ...args,
      status: 'pending',
      createdAt: Date.now(),
    })
  },
})

export const updateRequestStatus = mutation({
  args: {
    requestId: v.id('bookingRequests'),
    status: v.string(),
    appointmentId: v.optional(v.id('appointments')),
  },
  handler: async (ctx, args) => {
    const patch: { status: string; appointmentId?: typeof args.appointmentId } = {
      status: args.status,
    }
    if (args.appointmentId) patch.appointmentId = args.appointmentId
    await ctx.db.patch(args.requestId, patch)
  },
})

export const getRequestsByChannel = query({
  args: { psychologistId: v.id('users') },
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query('bookingRequests')
      .withIndex('by_psychologist', (q) =>
        q.eq('psychologistId', args.psychologistId)
      )
      .collect()

    const byChannel: Record<string, number> = {}
    for (const request of requests) {
      byChannel[request.channel] = (byChannel[request.channel] ?? 0) + 1
    }
    return byChannel
  },
})

export const getRequestsForPsychologist = query({
  args: { psychologistId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('bookingRequests')
      .withIndex('by_psychologist', (q) =>
        q.eq('psychologistId', args.psychologistId)
      )
      .collect()
  },
})
