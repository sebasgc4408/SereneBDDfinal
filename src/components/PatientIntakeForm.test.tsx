import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PatientIntakeForm from './PatientIntakeForm'

describe('PatientIntakeForm Component', () => {
  it('should render the patient intake form correctly', () => {
    const mockOnSubmit = vi.fn()
    render(<PatientIntakeForm selectedTime="10:00 AM" selectedDate="Mon 16" onSubmit={mockOnSubmit} />)
    
    // Debería mostrar la fecha seleccionada
    expect(screen.getByText(/Mon 16/i)).toBeInTheDocument()
    expect(screen.getByText(/10:00 AM/i)).toBeInTheDocument()

    // Debería pedir los datos básicos
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument()

    // Botón para confirmar
    expect(screen.getByRole('button', { name: /Confirm Booking/i })).toBeInTheDocument()
  })
})
