import { convexTest } from 'convex-test'
import { describe, it, expect } from 'vitest'
import schema from './schema'

describe('Calendar Backend', () => {
  it('should sync events and calculate availability correctly', async () => {
    const t = convexTest(schema, import.meta.glob('./**/*.*s'))
    
    // 1. Create a user
    const userId = await t.mutation('users:createUser', { 
      email: 'therapist@serene.com', 
      clerkId: 'user_therapist_1' 
    })

    // 2. Sync events (this function doesn't exist yet, so it will fail)
    await t.mutation('calendar:syncEvents', {
      userId,
      events: [
        {
          googleEventId: 'evt_1',
          title: 'Busy',
          startTime: Date.parse('2026-03-16T10:00:00Z'),
          endTime: Date.parse('2026-03-16T11:00:00Z'),
        }
      ]
    })

    // 3. Fetch events for the user
    const events = await t.query('calendar:getUserEvents', { userId })
    
    expect(events).toHaveLength(1)
    expect(events[0].googleEventId).toBe('evt_1')
  })
})
