import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Onboarding from './Onboarding'

// Mock Clerk user hook
vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      externalAccounts: [],
      createExternalAccount: vi.fn(),
    },
    isLoaded: true,
    isSignedIn: true,
  }),
}))

describe('Onboarding Component', () => {
  it('should render the Google Calendar connection intent', () => {
    render(<Onboarding />)
    
    // Debería explicar claramente por qué necesitamos acceso
    expect(screen.getByText(/We need access to your calendar/i)).toBeInTheDocument()
    
    // Debería haber un botón claro para conectar
    const connectButton = screen.getByRole('button', { name: /Connect Google Calendar/i })
    expect(connectButton).toBeInTheDocument()
  })
})
