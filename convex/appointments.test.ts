import { convexTest } from 'convex-test'
import { describe, it, expect } from 'vitest'
import schema from './schema'

describe('Appointments Backend', () => {
  it('should create a new appointment successfully', async () => {
    const t = convexTest(schema, import.meta.glob('./**/*.*s'))
    
    // 1. Create a mock psychologist user
    const userId = await t.mutation('users:createUser', { 
      email: 'therapist@serene.com', 
      clerkId: 'user_therapist_1' 
    })

    // 2. Patient creates an appointment (this function doesn't exist yet)
    const appointmentId = await t.mutation('appointments:createAppointment', {
      userId,
      patientName: 'Jane Doe',
      patientEmail: 'jane@example.com',
      patientPhone: '555-0000',
      startTime: Date.parse('2026-03-16T10:00:00Z'),
      endTime: Date.parse('2026-03-16T11:00:00Z'),
    })

    expect(appointmentId).toBeDefined()

    // 3. Verify it was stored correctly
    const appointments = await t.query('appointments:getAppointmentsForUser', { userId })
    
    expect(appointments).toHaveLength(1)
    expect(appointments[0].patientName).toBe('Jane Doe')
    expect(appointments[0].status).toBe('Confirmed')
  })
})
