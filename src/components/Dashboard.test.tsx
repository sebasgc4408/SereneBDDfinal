import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Dashboard from './Dashboard'

const mockUseQuery = vi.fn()

vi.mock('convex/react', () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
  useMutation: () => vi.fn(),
}))

vi.mock('@/hooks/useStoreUser', () => ({
  useStoreUser: () => ({
    _id: 'user_1',
    integrationStatus: 'Connected',
    timezone: 'America/Bogota',
    publicSlug: 'dr-sarah',
  }),
}))

vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: { firstName: 'Dr. Sarah' },
    isLoaded: true,
  }),
  UserButton: () => <div>UserMenu</div>,
}))

describe('Dashboard Component', () => {
  beforeEach(() => {
    mockUseQuery.mockReset()
    mockUseQuery.mockReturnValue([])
    global.fetch = vi.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch
  })

  it('should render dashboard with real-data sections', () => {
    mockUseQuery
      .mockReturnValueOnce([]) // appointments
      .mockReturnValueOnce({
        totalAppointments: 0,
        completionRate: 0,
        noShowRate: 0,
      }) // kpis
      .mockReturnValueOnce({
        whatsappConnected: false,
      }) // whatsapp integration status

    render(<Dashboard />)

    expect(screen.getByText(/Good morning, Dr. Sarah/i)).toBeInTheDocument()
    expect(screen.getByText(/Appointments/i)).toBeInTheDocument()
    expect(screen.getByText(/Quick Actions/i)).toBeInTheDocument()
    expect(screen.getByText(/Integrations/i)).toBeInTheDocument()
  })
})
