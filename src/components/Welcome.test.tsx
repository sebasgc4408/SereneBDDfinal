import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Welcome from './Welcome'

vi.mock('@clerk/nextjs', () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('Welcome Component', () => {
  it('should render the welcome message', () => {
    render(<Welcome />)
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument()
  })
})
