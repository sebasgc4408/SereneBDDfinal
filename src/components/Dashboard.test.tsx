import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Dashboard from './Dashboard'

// Mock de Clerk
vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: { firstName: 'Dr. Sarah' },
    isLoaded: true,
  }),
  UserButton: () => <div>UserMenu</div>,
}))

describe('Dashboard Component', () => {
  it('should render the dashboard structure and upcoming appointments', () => {
    render(<Dashboard />)
    
    // Debería tener un saludo personalizado
    expect(screen.getByText(/Good morning, Dr. Sarah/i)).toBeInTheDocument()
    
    // Debería tener la sección de citas próximas
    expect(screen.getByText(/Upcoming Appointments/i)).toBeInTheDocument()
    
    // Debería tener un estado de integración visible
    expect(screen.getByText(/Calendar Sync/i)).toBeInTheDocument()
  })
})
