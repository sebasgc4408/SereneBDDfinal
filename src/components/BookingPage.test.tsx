import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BookingPage from './BookingPage'

describe('BookingPage Component', () => {
  it('should render the distraction-free booking interface', () => {
    render(<BookingPage psychologistName="Dr. Sarah" />)
    
    // Debería mostrar claramente a quién están agendando
    expect(screen.getByText(/Book a session with Dr. Sarah/i)).toBeInTheDocument()
    
    // Debería haber una sección clara para seleccionar la fecha/hora
    expect(screen.getByRole('heading', { name: /Select a date/i })).toBeInTheDocument()
    
    // No debería haber distracciones (ej. sin menús de navegación complejos)
    // Buscamos un texto de apoyo que transmita calma
    expect(screen.getByText(/Take your time/i)).toBeInTheDocument()
  })
})
