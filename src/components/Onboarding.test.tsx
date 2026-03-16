import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Onboarding from './Onboarding'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}))

vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      fullName: 'Dr. Sarah',
      externalAccounts: [],
      createExternalAccount: vi.fn(),
    },
    isLoaded: true,
    isSignedIn: true,
  }),
}))

vi.mock('@/hooks/useStoreUser', () => ({
  useStoreUser: () => ({
    _id: 'user_1',
    integrationStatus: 'Pending',
    publicSlug: undefined,
    email: 'therapist@serene.com',
  }),
}))

vi.mock('convex/react', () => ({
  useMutation: () => vi.fn(),
  useQuery: () => [],
}))

describe('Onboarding Component', () => {
  it('should render the Google Calendar connection intent', () => {
    render(<Onboarding />)

    expect(screen.getByText(/Serene needs read-only access/i)).toBeInTheDocument()
    const connectButton = screen.getByRole('button', { name: /Authenticate Google/i })
    expect(connectButton).toBeInTheDocument()
  })
})
