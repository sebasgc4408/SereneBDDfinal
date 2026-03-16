import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BookingPage from './BookingPage'

const mockUseQuery = vi.fn()

vi.mock('convex/react', () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
  useMutation: () => vi.fn(),
}))

describe('BookingPage Component', () => {
  beforeEach(() => {
    mockUseQuery.mockReset()
    mockUseQuery.mockImplementation((_ref: unknown, args: unknown) => {
      if (args === 'skip') return undefined
      if (typeof args === 'object' && args && 'slug' in (args as Record<string, unknown>)) {
        return {
          _id: 'user_1',
          name: 'Dr. Sarah',
          timezone: 'America/Bogota',
        }
      }
      return []
    })
  })

  it('should render the distraction-free booking interface', () => {
    render(<BookingPage slug="dr-sarah" />)

    expect(screen.getByText(/Book a session with Dr. Sarah/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Select a date/i })).toBeInTheDocument()
    expect(screen.getByText(/All slots shown are in/i)).toBeInTheDocument()
  })
})
