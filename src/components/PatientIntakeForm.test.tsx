import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PatientIntakeForm from './PatientIntakeForm'

describe('PatientIntakeForm Component', () => {
  it('should render the patient intake form correctly', () => {
    const mockOnSubmit = vi.fn()
    render(<PatientIntakeForm selectedTime="10:00 AM" selectedDate="Mon 16" onSubmit={mockOnSubmit} />)

    expect(screen.getByText(/Mon 16/i)).toBeInTheDocument()
    expect(screen.getByText(/10:00 AM/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Confirm Booking/i })).toBeInTheDocument()
  })

  it('should render the WhatsApp opt-in checkbox', () => {
    const mockOnSubmit = vi.fn()
    render(<PatientIntakeForm selectedTime="10:00 AM" selectedDate="Mon 16" onSubmit={mockOnSubmit} />)

    const checkbox = screen.getByLabelText(/Send my booking details and reminders via WhatsApp/i)
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  it('should make phone required when WhatsApp opt-in is checked', () => {
    const mockOnSubmit = vi.fn()
    render(<PatientIntakeForm selectedTime="10:00 AM" selectedDate="Mon 16" onSubmit={mockOnSubmit} />)

    const phoneInput = screen.getByLabelText(/Phone Number/i)
    expect(phoneInput).not.toBeRequired()

    const checkbox = screen.getByLabelText(/Send my booking details and reminders via WhatsApp/i)
    fireEvent.click(checkbox)

    expect(phoneInput).toBeRequired()
    expect(screen.getByText(/\(WhatsApp\)/i)).toBeInTheDocument()
  })

  it('should include whatsappOptIn in onSubmit data', () => {
    const mockOnSubmit = vi.fn()
    render(<PatientIntakeForm selectedTime="10:00 AM" selectedDate="Mon 16" onSubmit={mockOnSubmit} />)

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'jane@example.com' } })

    const checkbox = screen.getByLabelText(/Send my booking details and reminders via WhatsApp/i)
    fireEvent.click(checkbox)

    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '+15550001234' } })

    fireEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }))

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Jane',
      email: 'jane@example.com',
      phone: '+15550001234',
      whatsappOptIn: true,
    })
  })
})
