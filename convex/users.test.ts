import { convexTest } from 'convex-test'
import { describe, it, expect } from 'vitest'
import schema from './schema'

describe('Users Backend', () => {
  it('should return a user if it exists', async () => {
    const t = convexTest(schema, import.meta.glob('./**/*.*s'))
    
    // Seed data
    await t.mutation('users:createUser', { 
      email: 'test@example.com', 
      clerkId: 'user_123',
      name: 'Test User'
    })

    const user = await t.query('users:getUser', { email: 'test@example.com' })
    expect(user).toBeDefined()
    expect(user.email).toBe('test@example.com')
  })
})
