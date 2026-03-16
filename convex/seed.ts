import { mutation } from './_generated/server'

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const existingDemo = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', 'demo@serene.com'))
      .unique()
    if (existingDemo) {
      return { psychologistId: existingDemo._id, patientIds: [] }
    }

    const psychologistId = await ctx.db.insert('users', {
      email: 'demo@serene.com',
      clerkId: 'demo_clerk_id',
      name: 'Dra. María García',
      integrationStatus: 'Connected',
      publicSlug: 'dra-garcia',
      timezone: 'America/Bogota',
      whatsappEnabled: true,
    })

    for (let day = 1; day <= 5; day += 1) {
      await ctx.db.insert('availability', {
        psychologistId,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
        slotDurationMinutes: 50,
        breakMinutes: 10,
      })
    }

    const patientData = [
      { name: 'Ana Martínez', email: 'ana@example.com', phone: '+573001234567' },
      {
        name: 'Carlos López',
        email: 'carlos@example.com',
        phone: '+573009876543',
      },
      { name: 'Isabella Rodríguez', email: 'isabella@example.com' },
    ]

    const patientIds = []
    for (const patient of patientData) {
      const id = await ctx.db.insert('patients', {
        psychologistId,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        createdAt: Date.now(),
      })
      patientIds.push(id)
    }

    const now = Date.now()
    const tomorrow = now + 86_400_000

    await ctx.db.insert('appointments', {
      userId: psychologistId,
      patientName: 'Ana Martínez',
      patientEmail: 'ana@example.com',
      patientPhone: '+573001234567',
      patientId: patientIds[0],
      startTime: tomorrow + 9 * 3_600_000,
      endTime: tomorrow + 9 * 3_600_000 + 3_000_000,
      status: 'Confirmed',
      whatsappOptIn: true,
      channel: 'web',
    })

    await ctx.db.insert('appointments', {
      userId: psychologistId,
      patientName: 'Carlos López',
      patientEmail: 'carlos@example.com',
      startTime: tomorrow + 11 * 3_600_000,
      endTime: tomorrow + 11 * 3_600_000 + 3_000_000,
      status: 'Confirmed',
      channel: 'web',
    })

    return { psychologistId, patientIds }
  },
})
