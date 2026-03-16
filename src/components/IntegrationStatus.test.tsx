import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import IntegrationStatus from './IntegrationStatus'

describe('IntegrationStatus Component', () => {
  it('should render integrations with disconnected defaults', () => {
    render(<IntegrationStatus />)

    expect(screen.getByText(/Google Calendar/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Not Connected/i)).toHaveLength(2)
    expect(screen.getByText(/Privacy & Permissions/i)).toBeInTheDocument()
  })

  it('should show WhatsApp as active and allow disconnect action', () => {
    const onDisconnectWhatsApp = vi.fn()
    render(
      <IntegrationStatus
        calendarConnected
        whatsappConnected
        onDisconnectWhatsApp={onDisconnectWhatsApp}
      />
    )

    const button = screen.getByRole('button', { name: /Disconnect WhatsApp/i })
    fireEvent.click(button)
    expect(onDisconnectWhatsApp).toHaveBeenCalledTimes(1)
  })

  it('should reveal privacy copy when accordion is opened', () => {
    render(<IntegrationStatus />)
    fireEvent.click(screen.getByRole('button', { name: /WhatsApp Privacy/i }))

    expect(
      screen.getByText(/only send clinical reminders and confirmations/i)
    ).toBeInTheDocument()
  })
})
