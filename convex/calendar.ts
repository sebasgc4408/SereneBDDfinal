import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const syncEvents = mutation({
  args: {
    userId: v.id('users'),
    events: v.array(v.object({
      googleEventId: v.string(),
      title: v.string(),
      startTime: v.number(),
      endTime: v.number()
    }))
  },
  handler: async (ctx, args) => {
    // 1. Delete existing events for the user to keep the cache fresh
    const existingEvents = await ctx.db
      .query('calendarEvents')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect()
    
    for (const event of existingEvents) {
      await ctx.db.delete(event._id)
    }

    // 2. Insert new events
    for (const event of args.events) {
      await ctx.db.insert('calendarEvents', {
        userId: args.userId,
        googleEventId: event.googleEventId,
        title: event.title,
        startTime: event.startTime,
        endTime: event.endTime
      })
    }
    
    return { success: true, count: args.events.length }
  }
})

export const getUserEvents = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('calendarEvents')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect()
  }
})
