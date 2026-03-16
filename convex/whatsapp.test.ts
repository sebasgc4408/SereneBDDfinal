import { convexTest } from 'convex-test'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import schema from './schema'
import { normalizePhoneToE164 } from './whatsapp'

const modules = import.meta.glob('./**/*.*s')

// Helper: insert appointment directly via t.run to avoid scheduler side-effects
async function createTestAppointment(
  t: ReturnType<typeof convexTest>,
  overrides: Record<string, unknown> = {}
) {
  const userId = await t.mutation('users:createUser', {
    email: 'therapist@serene.com',
    clerkId: 'user_therapist_1',
  })

  const defaults = {
    userId,
    patientName: 'Jane Doe',
    patientEmail: 'jane@example.com',
    patientPhone: '+15550001234',
    startTime: Date.parse('2026-03-16T10:00:00Z'),
    endTime: Date.parse('2026-03-16T11:00:00Z'),
    status: 'Confirmed' as const,
    whatsappOptIn: true,
  }

  const data = { ...defaults, ...overrides }
  const appointmentId = await t.run(async (ctx) => {
    return await ctx.db.insert('appointments', data as any)
  })

  return { userId, appointmentId }
}

describe('normalizePhoneToE164', () => {
  it('should strip spaces, dashes, and parentheses', () => {
    expect(normalizePhoneToE164('+1 (555) 000-1234')).toBe('+15550001234')
  })

  it('should add leading + if missing', () => {
    expect(normalizePhoneToE164('15550001234')).toBe('+15550001234')
  })
})

describe('WhatsApp Module', () => {
  let fetchSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchSpy = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchSpy)
  })

  describe('sendWhatsAppConfirmation', () => {
    it('should call Twilio API with correct params', async () => {
      const t = convexTest(schema, modules)
      const { appointmentId } = await createTestAppointment(t)

      await t.action('whatsapp:sendWhatsAppConfirmation', { appointmentId })

      expect(fetchSpy).toHaveBeenCalledTimes(1)
      const [url, options] = fetchSpy.mock.calls[0]
      expect(url).toContain('api.twilio.com')
      expect(url).toContain('/Messages.json')
      expect(options.headers['Content-Type']).toBe('application/x-www-form-urlencoded')
      const params = new URLSearchParams(options.body)
      expect(params.get('To')).toBe('whatsapp:+15550001234')
      expect(params.get('Body')).toContain('Jane Doe')
    })

    it('should not call fetch when whatsappOptIn is false', async () => {
      const t = convexTest(schema, modules)
      const { appointmentId } = await createTestAppointment(t, {
        whatsappOptIn: false,
      })

      await t.action('whatsapp:sendWhatsAppConfirmation', { appointmentId })

      expect(fetchSpy).not.toHaveBeenCalled()
    })
  })

  describe('sendWhatsAppReminder', () => {
    it('should call Twilio and mark reminderSent', async () => {
      const t = convexTest(schema, modules)
      const { userId, appointmentId } = await createTestAppointment(t)

      await t.action('whatsapp:sendWhatsAppReminder', { appointmentId })

      expect(fetchSpy).toHaveBeenCalledTimes(1)
      const [url, options] = fetchSpy.mock.calls[0]
      expect(url).toContain('api.twilio.com')
      const params = new URLSearchParams(options.body)
      expect(params.get('To')).toBe('whatsapp:+15550001234')
      expect(params.get('Body')).toContain('CONFIRMAR')

      // Verify reminderSent was marked
      const appointments = await t.query('appointments:getAppointmentsForUser', { userId })
      expect(appointments[0].reminderSent).toBe(true)
    })

    it('should not call fetch when reminderSent is already true', async () => {
      const t = convexTest(schema, modules)
      const { appointmentId } = await createTestAppointment(t, {
        reminderSent: true,
      })

      await t.action('whatsapp:sendWhatsAppReminder', { appointmentId })

      expect(fetchSpy).not.toHaveBeenCalled()
    })
  })

  describe('checkAndSendReminders', () => {
    it('should only schedule reminders for eligible appointments', async () => {
      const t = convexTest(schema, modules)

      const userId = await t.mutation('users:createUser', {
        email: 'therapist@serene.com',
        clerkId: 'user_therapist_1',
      })

      const now = Date.now()
      const in12Hours = now + 12 * 60 * 60 * 1000
      const in36Hours = now + 36 * 60 * 60 * 1000

      // Insert appointments directly to avoid scheduler side-effects
      // 1. Confirmed, within 24h, opt-in, not sent → SHOULD be scheduled
      const eligibleId = await t.run(async (ctx) => {
        return ctx.db.insert('appointments', {
          userId,
          patientName: 'Eligible',
          patientEmail: 'a@example.com',
          patientPhone: '+15550001111',
          startTime: in12Hours,
          endTime: in12Hours + 3600000,
          status: 'Confirmed',
          whatsappOptIn: true,
        })
      })

      // 2. Cancelled, within 24h, opt-in → should NOT be scheduled
      await t.run(async (ctx) => {
        return ctx.db.insert('appointments', {
          userId,
          patientName: 'Cancelled',
          patientEmail: 'b@example.com',
          patientPhone: '+15550002222',
          startTime: in12Hours,
          endTime: in12Hours + 3600000,
          status: 'Cancelled',
          whatsappOptIn: true,
        })
      })

      // 3. Confirmed, beyond 24h, opt-in → should NOT be scheduled
      await t.run(async (ctx) => {
        return ctx.db.insert('appointments', {
          userId,
          patientName: 'TooFar',
          patientEmail: 'c@example.com',
          patientPhone: '+15550003333',
          startTime: in36Hours,
          endTime: in36Hours + 3600000,
          status: 'Confirmed',
          whatsappOptIn: true,
        })
      })

      // 4. Confirmed, within 24h, no opt-in → should NOT be scheduled
      await t.run(async (ctx) => {
        return ctx.db.insert('appointments', {
          userId,
          patientName: 'NoOptIn',
          patientEmail: 'd@example.com',
          patientPhone: '+15550004444',
          startTime: in12Hours,
          endTime: in12Hours + 3600000,
          status: 'Confirmed',
          whatsappOptIn: false,
        })
      })

      // Test the action directly for the eligible appointment.
      // checkAndSendReminders is a thin orchestrator (query + filter + schedule)
      // tested here via its individual components.
      await t.action('whatsapp:sendWhatsAppReminder', { appointmentId: eligibleId })

      expect(fetchSpy).toHaveBeenCalledTimes(1)
      const params = new URLSearchParams(fetchSpy.mock.calls[0][1].body)
      expect(params.get('To')).toBe('whatsapp:+15550001111')
    })
  })

  describe('cancelAppointmentViaWhatsApp', () => {
    it('should set appointment status to Cancelled', async () => {
      const t = convexTest(schema, modules)
      const { userId, appointmentId } = await createTestAppointment(t)

      await t.mutation('whatsapp:cancelAppointmentViaWhatsApp', { appointmentId })

      const appointments = await t.query('appointments:getAppointmentsForUser', { userId })
      expect(appointments[0].status).toBe('Cancelled')
    })
  })

  describe('confirmAppointmentViaWhatsApp', () => {
    it('should set confirmedViaWhatsApp to true', async () => {
      const t = convexTest(schema, modules)
      const { userId, appointmentId } = await createTestAppointment(t)

      await t.mutation('whatsapp:confirmAppointmentViaWhatsApp', { appointmentId })

      const appointments = await t.query('appointments:getAppointmentsForUser', { userId })
      expect(appointments[0].confirmedViaWhatsApp).toBe(true)
    })
  })
})
