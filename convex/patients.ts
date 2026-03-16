import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const createPatient = mutation({
  args: {
    psychologistId: v.id('users'),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('patients', {
      ...args,
      createdAt: Date.now(),
    })
  },
})

export const getPatientsByPsychologist = query({
  args: { psychologistId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('patients')
      .withIndex('by_psychologist', (q) =>
        q.eq('psychologistId', args.psychologistId)
      )
      .collect()
  },
})

export const getPatientByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('patients')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first()
  },
})

export const getHighNpsPatients = query({
  args: { psychologistId: v.id('users') },
  handler: async (ctx, args) => {
    const patients = await ctx.db
      .query('patients')
      .withIndex('by_psychologist', (q) =>
        q.eq('psychologistId', args.psychologistId)
      )
      .collect()

    return patients.filter(
      (patient) => patient.npsScore !== undefined && patient.npsScore >= 8
    )
  },
})

export const updatePatientNps = mutation({
  args: { patientId: v.id('patients'), npsScore: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.patientId, { npsScore: args.npsScore })
  },
})
