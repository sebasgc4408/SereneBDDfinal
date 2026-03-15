import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BookingConfirmation from './BookingConfirmation'

describe('BookingConfirmation Component', () => {
  it('should render the reassuring summary correctly', () => {
    render(
      <BookingConfirmation 
        patientName="Jane Doe" 
        date="Mon 16" 
        time="10:00 AM" 
        psychologistName="Dr. Sarah" 
      />
    )
    
    // Debería mostrar un mensaje claro de confirmación
    expect(screen.getByText(/Your session is confirmed/i)).toBeInTheDocument()
    
    // Debería resumir los datos de la cita
    expect(screen.getByText(/Mon 16/i)).toBeInTheDocument()
    expect(screen.getByText(/10:00 AM/i)).toBeInTheDocument()
    expect(screen.getByText(/Dr. Sarah/i)).toBeInTheDocument()
    
    // Debería informar sobre el correo electrónico enviado
    expect(screen.getByText(/We've sent a calendar invitation/i)).toBeInTheDocument()
  })
})
