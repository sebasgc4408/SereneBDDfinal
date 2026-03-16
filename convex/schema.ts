import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    email: v.string(),
    clerkId: v.string(),
    name: v.optional(v.string()),
    integrationStatus: v.optional(v.string()), // e.g. "Connected", "Pending"
    timezone: v.optional(v.string()),
    publicSlug: v.optional(v.string()),
    googleRefreshToken: v.optional(v.string()),
    whatsappEnabled: v.optional(v.boolean()),
  })
    .index('by_email', ['email'])
    .index('by_clerk_id', ['clerkId'])
    .index('by_slug', ['publicSlug']),

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
    whatsappOptIn: v.optional(v.boolean()),
    reminderSent: v.optional(v.boolean()),
    confirmedViaWhatsApp: v.optional(v.boolean()),
    noShow: v.optional(v.boolean()),
    completedAt: v.optional(v.number()),
    cancelledAt: v.optional(v.number()),
    cancelReason: v.optional(v.string()),
    patientId: v.optional(v.id('patients')),
    channel: v.optional(v.string()),
  })
    .index('by_user', ['userId'])
    .index('by_status_and_time', ['status', 'startTime']),

  patients: defineTable({
    psychologistId: v.id('users'),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
    npsScore: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_psychologist', ['psychologistId'])
    .index('by_email', ['email']),

  availability: defineTable({
    psychologistId: v.id('users'),
    dayOfWeek: v.number(), // 0 = Sunday ... 6 = Saturday
    startTime: v.string(), // "09:00"
    endTime: v.string(), // "17:00"
    isActive: v.boolean(),
    slotDurationMinutes: v.optional(v.number()),
    breakMinutes: v.optional(v.number()),
  })
    .index('by_psychologist', ['psychologistId'])
    .index('by_psychologist_and_day', ['psychologistId', 'dayOfWeek']),

  bookingRequests: defineTable({
    psychologistId: v.id('users'),
    patientEmail: v.string(),
    patientName: v.string(),
    patientPhone: v.optional(v.string()),
    requestedDate: v.number(),
    requestedTime: v.string(),
    status: v.string(), // "pending", "approved", "rejected", "expired"
    channel: v.string(), // "web", "whatsapp", "manual"
    createdAt: v.number(),
    appointmentId: v.optional(v.id('appointments')),
  })
    .index('by_psychologist', ['psychologistId'])
    .index('by_status', ['status']),

  followUps: defineTable({
    appointmentId: v.id('appointments'),
    psychologistId: v.id('users'),
    patientId: v.optional(v.id('patients')),
    notes: v.optional(v.string()),
    followUpDate: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_appointment', ['appointmentId'])
    .index('by_psychologist', ['psychologistId']),
})
