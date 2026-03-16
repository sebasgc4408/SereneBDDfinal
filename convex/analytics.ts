import { query } from './_generated/server'
import { v } from 'convex/values'

export const getKpis = query({
  args: { psychologistId: v.id('users') },
  handler: async (ctx, args) => {
    const appointments = await ctx.db
      .query('appointments')
      .withIndex('by_user', (q) => q.eq('userId', args.psychologistId))
      .collect()

    const total = appointments.length
    const completed = appointments.filter((a) => a.status === 'Completed').length
    const cancelled = appointments.filter((a) => a.status === 'Cancelled').length
    const noShows = appointments.filter((a) => a.noShow === true).length
    const confirmed = appointments.filter((a) => a.status === 'Confirmed').length

    return {
      totalAppointments: total,
      completedSessions: completed,
      cancelledAppointments: cancelled,
      noShows,
      upcomingConfirmed: confirmed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      noShowRate: total > 0 ? Math.round((noShows / total) * 100) : 0,
    }
  },
})

export const getConversionRate = query({
  args: { psychologistId: v.id('users') },
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query('bookingRequests')
      .withIndex('by_psychologist', (q) =>
        q.eq('psychologistId', args.psychologistId)
      )
      .collect()
    const total = requests.length
    const approved = requests.filter((r) => r.status === 'approved').length

    return {
      totalRequests: total,
      approvedRequests: approved,
      conversionRate: total > 0 ? Math.round((approved / total) * 100) : 0,
    }
  },
})

export const getWeeklyDashboard = query({
  args: {
    psychologistId: v.id('users'),
    weekStart: v.number(),
  },
  handler: async (ctx, args) => {
    const weekEnd = args.weekStart + 7 * 24 * 60 * 60 * 1000

    const appointments = await ctx.db
      .query('appointments')
      .withIndex('by_user', (q) => q.eq('userId', args.psychologistId))
      .filter((q) =>
        q.and(
          q.gte(q.field('startTime'), args.weekStart),
          q.lt(q.field('startTime'), weekEnd)
        )
      )
      .collect()

    return {
      totalThisWeek: appointments.length,
      confirmedThisWeek: appointments.filter((a) => a.status === 'Confirmed').length,
      completedThisWeek: appointments.filter((a) => a.status === 'Completed').length,
      cancelledThisWeek: appointments.filter((a) => a.status === 'Cancelled').length,
    }
  },
})
