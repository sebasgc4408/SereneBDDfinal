import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    email: v.string(),
    clerkId: v.string(),
    name: v.optional(v.string()),
    integrationStatus: v.optional(v.string()), // e.g. "Connected", "Pending"
  }).index('by_email', ['email']),

  calendarEvents: defineTable({
    userId: v.id('users'),
    googleEventId: v.string(),
    title: v.string(), // "Busy" or patient name (for internal use)
    startTime: v.number(), // Unix timestamp
    endTime: v.number(), // Unix timestamp
  }).index('by_user', ['userId']).index('by_user_and_time', ['userId', 'startTime']),

  appointments: defineTable({
    userId: v.id('users'),
    patientName: v.string(),
    patientEmail: v.string(),
    patientPhone: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    status: v.string(), // "Confirmed", "Cancelled"
    googleEventId: v.optional(v.string()), // Null until successfully synced to Google
  }).index('by_user', ['userId']),
})
