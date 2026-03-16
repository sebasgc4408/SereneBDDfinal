import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const createFollowUp = mutation({
  args: {
    appointmentId: v.id('appointments'),
    psychologistId: v.id('users'),
    patientId: v.optional(v.id('patients')),
    notes: v.optional(v.string()),
    followUpDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('followUps', {
      ...args,
      createdAt: Date.now(),
    })
  },
})

export const getFollowUpsForPsychologist = query({
  args: { psychologistId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('followUps')
      .withIndex('by_psychologist', (q) =>
        q.eq('psychologistId', args.psychologistId)
      )
      .collect()
  },
})
