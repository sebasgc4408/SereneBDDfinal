import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .unique()
  },
})

export const createUser = mutation({
  args: {
    email: v.string(),
    clerkId: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('users', {
      email: args.email,
      clerkId: args.clerkId,
      name: args.name,
      integrationStatus: 'Pending',
    })
  },
})
