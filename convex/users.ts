import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { Doc, Id } from './_generated/dataModel'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function ensureUniqueSlug(
  ctx: { db: { query: (table: 'users') => any } },
  baseSlug: string,
  currentUserId?: Id<'users'>
) {
  let candidate = baseSlug
  let counter = 2

  while (true) {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_slug', (q: any) => q.eq('publicSlug', candidate))
      .unique()
    if (!existing || existing._id === currentUserId) {
      return candidate
    }
    candidate = `${baseSlug}-${counter}`
    counter += 1
  }
}

export const getUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .unique()
  },
})

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .unique()
  },
})

export const getUserBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_slug', (q) => q.eq('publicSlug', args.slug))
      .unique()
  },
})

export const createUser = mutation({
  args: {
    email: v.string(),
    clerkId: v.string(),
    name: v.optional(v.string()),
    userType: v.optional(v.union(v.literal('psychologist'), v.literal('patient'))),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .unique()
    if (existing) return existing._id

    const defaultSlugBase = slugify(args.name ?? args.email.split('@')[0] ?? args.clerkId)
    const uniqueSlug = defaultSlugBase
      ? await ensureUniqueSlug(ctx, defaultSlugBase)
      : undefined

    return await ctx.db.insert('users', {
      email: args.email,
      clerkId: args.clerkId,
      name: args.name,
      userType: args.userType ?? 'psychologist',
      integrationStatus: 'Pending',
      publicSlug: uniqueSlug,
      whatsappEnabled: true,
    })
  },
})

export const updateUser = mutation({
  args: {
    userId: v.id('users'),
    name: v.optional(v.string()),
    timezone: v.optional(v.string()),
    publicSlug: v.optional(v.string()),
    integrationStatus: v.optional(v.string()),
    googleRefreshToken: v.optional(v.string()),
    whatsappEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args
    const current = await ctx.db.get(userId)
    if (!current) {
      throw new Error('User not found')
    }

    const patch: Partial<Doc<'users'>> = {}

    if (updates.name !== undefined) patch.name = updates.name
    if (updates.timezone !== undefined) patch.timezone = updates.timezone
    if (updates.integrationStatus !== undefined) {
      patch.integrationStatus = updates.integrationStatus
    }
    if (updates.googleRefreshToken !== undefined) {
      patch.googleRefreshToken = updates.googleRefreshToken
    }
    if (updates.whatsappEnabled !== undefined) {
      patch.whatsappEnabled = updates.whatsappEnabled
    }

    if (updates.publicSlug !== undefined) {
      const fallback = current.name ?? current.email.split('@')[0] ?? current.clerkId
      const base = slugify(updates.publicSlug || fallback)
      if (base) {
        patch.publicSlug = await ensureUniqueSlug(ctx, base, userId)
      }
    }

    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(userId, patch)
    }
  },
})
