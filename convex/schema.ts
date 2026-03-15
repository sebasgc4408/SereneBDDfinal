import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    email: v.string(),
    clerkId: v.string(),
    name: v.optional(v.string()),
    integrationStatus: v.optional(v.string()), // e.g. "Connected", "Pending"
  }).index('by_email', ['email']),
})
