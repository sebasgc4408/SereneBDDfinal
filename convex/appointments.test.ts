import { convexTest } from 'convex-test'
import { describe, it, expect, vi } from 'vitest'
import schema from './schema'

const modules = import.meta.glob('./**/*.*s')

describe('Appointments Backend', () => {
  it('should create a new appointment successfully', async () => {
    const t = convexTest(schema, modules)

    const userId = await t.mutation('users:createUser', {
      email: 'therapist@serene.com',
      clerkId: 'user_therapist_1',
    })

    const appointmentId = await t.mutation('appointments:createAppointment', {
      userId,
      patientName: 'Jane Doe',
      patientEmail: 'jane@example.com',
      patientPhone: '555-0000',
      startTime: Date.parse('2026-03-16T10:00:00Z'),
      endTime: Date.parse('2026-03-16T11:00:00Z'),
    })

    expect(appointmentId).toBeDefined()

    const appointments = await t.query('appointments:getAppointmentsForUser', { userId })

    expect(appointments).toHaveLength(1)
    expect(appointments[0].patientName).toBe('Jane Doe')
    expect(appointments[0].status).toBe('Confirmed')
  })

  it('should store whatsappOptIn when provided', async () => {
    const t = convexTest(schema, modules)

    const userId = await t.mutation('users:createUser', {
      email: 'therapist@serene.com',
      clerkId: 'user_therapist_1',
    })

    // Create without phone to avoid triggering scheduler
    await t.mutation('appointments:createAppointment', {
      userId,
      patientName: 'Jane Doe',
      patientEmail: 'jane@example.com',
      startTime: Date.parse('2026-03-16T10:00:00Z'),
      endTime: Date.parse('2026-03-16T11:00:00Z'),
      whatsappOptIn: true,
    })

    const appointments = await t.query('appointments:getAppointmentsForUser', { userId })
    expect(appointments[0].whatsappOptIn).toBe(true)
  })

  it('should schedule WhatsApp confirmation when opt-in and phone provided', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchSpy)

    const t = convexTest(schema, modules)

    const userId = await t.mutation('users:createUser', {
      email: 'therapist@serene.com',
      clerkId: 'user_therapist_1',
    })

    // Insert directly to avoid scheduler, then test the action
    const appointmentId = await t.run(async (ctx) => {
      return ctx.db.insert('appointments', {
        userId,
        patientName: 'Jane Doe',
        patientEmail: 'jane@example.com',
        patientPhone: '+15550001234',
        startTime: Date.parse('2026-03-16T10:00:00Z'),
        endTime: Date.parse('2026-03-16T11:00:00Z'),
        status: 'Confirmed',
        whatsappOptIn: true,
      })
    })

    await t.action('whatsapp:sendWhatsAppConfirmation', { appointmentId })

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const [url, options] = fetchSpy.mock.calls[0]
    expect(url).toContain('api.twilio.com')
    const params = new URLSearchParams(options.body)
    expect(params.get('To')).toBe('whatsapp:+15550001234')
  })

  it('should NOT send WhatsApp confirmation without opt-in', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchSpy)

    const t = convexTest(schema, modules)

    const userId = await t.mutation('users:createUser', {
      email: 'therapist@serene.com',
      clerkId: 'user_therapist_1',
    })

    const appointmentId = await t.run(async (ctx) => {
      return ctx.db.insert('appointments', {
        userId,
        patientName: 'Jane Doe',
        patientEmail: 'jane@example.com',
        patientPhone: '+15550001234',
        startTime: Date.parse('2026-03-16T10:00:00Z'),
        endTime: Date.parse('2026-03-16T11:00:00Z'),
        status: 'Confirmed',
        whatsappOptIn: false,
      })
    })

    await t.action('whatsapp:sendWhatsAppConfirmation', { appointmentId })

    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
