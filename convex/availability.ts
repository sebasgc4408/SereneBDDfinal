import { formatInTimeZone, fromZonedTime } from 'date-fns-tz'
import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const createAvailability = mutation({
  args: {
    psychologistId: v.id('users'),
    dayOfWeek: v.number(),
    startTime: v.string(),
    endTime: v.string(),
    slotDurationMinutes: v.optional(v.number()),
    breakMinutes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('availability', {
      ...args,
      isActive: true,
      slotDurationMinutes: args.slotDurationMinutes ?? 50,
      breakMinutes: args.breakMinutes ?? 10,
    })
  },
})

export const deactivateAvailability = mutation({
  args: { availabilityId: v.id('availability') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.availabilityId, { isActive: false })
  },
})

export const getAvailability = query({
  args: { psychologistId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('availability')
      .withIndex('by_psychologist', (q) =>
        q.eq('psychologistId', args.psychologistId)
      )
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect()
  },
})

export const getAvailableSlots = query({
  args: {
    psychologistId: v.id('users'),
    date: v.number(), // Any timestamp within the target day
  },
  handler: async (ctx, args) => {
    const psychologist = await ctx.db.get(args.psychologistId)
    if (!psychologist) return []

    const timezone = psychologist.timezone ?? 'America/Bogota'
    const dayKey = formatInTimeZone(args.date, timezone, 'yyyy-MM-dd')
    const isoDayOfWeek = Number(formatInTimeZone(args.date, timezone, 'i')) // 1..7, Monday = 1
    const dayOfWeek = isoDayOfWeek % 7 // 0..6, Sunday = 0

    const rules = await ctx.db
      .query('availability')
      .withIndex('by_psychologist_and_day', (q) =>
        q.eq('psychologistId', args.psychologistId).eq('dayOfWeek', dayOfWeek)
      )
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect()

    if (rules.length === 0) return []

    const dayStart = fromZonedTime(`${dayKey}T00:00:00`, timezone).getTime()
    const dayEnd = fromZonedTime(`${dayKey}T23:59:59`, timezone).getTime() + 999

    const calendarEvents = await ctx.db
      .query('calendarEvents')
      .withIndex('by_user', (q) => q.eq('userId', args.psychologistId))
      .collect()
    const busyCalendarBlocks = calendarEvents
      .filter((event) => dayStart < event.endTime && dayEnd > event.startTime)
      .map((event) => ({ start: event.startTime, end: event.endTime }))

    const existingAppointments = await ctx.db
      .query('appointments')
      .withIndex('by_user', (q) => q.eq('userId', args.psychologistId))
      .collect()
    const busyAppointmentBlocks = existingAppointments
      .filter(
        (appointment) =>
          appointment.status !== 'Cancelled' &&
          dayStart < appointment.endTime &&
          dayEnd > appointment.startTime
      )
      .map((appointment) => ({
        start: appointment.startTime,
        end: appointment.endTime,
      }))

    const busyBlocks = [...busyCalendarBlocks, ...busyAppointmentBlocks]
    const allSlots: { startTime: number; endTime: number }[] = []

    for (const rule of rules) {
      const slotDuration = rule.slotDurationMinutes ?? 50
      const breakDuration = rule.breakMinutes ?? 10

      const ruleStart = fromZonedTime(
        `${dayKey}T${rule.startTime}:00`,
        timezone
      ).getTime()
      const ruleEnd = fromZonedTime(
        `${dayKey}T${rule.endTime}:00`,
        timezone
      ).getTime()

      let cursor = ruleStart
      while (cursor + slotDuration * 60_000 <= ruleEnd) {
        allSlots.push({
          startTime: cursor,
          endTime: cursor + slotDuration * 60_000,
        })
        cursor += (slotDuration + breakDuration) * 60_000
      }
    }

    const available = allSlots.filter(
      (slot) =>
        !busyBlocks.some(
          (busy) => slot.startTime < busy.end && slot.endTime > busy.start
        )
    )

    return available.sort((a, b) => a.startTime - b.startTime)
  },
})
