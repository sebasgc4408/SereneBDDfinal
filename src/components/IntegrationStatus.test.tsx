import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import IntegrationStatus from './IntegrationStatus'

describe('IntegrationStatus Component', () => {
  it('should render the active integration and permission clarity cards', () => {
    render(<IntegrationStatus />)

    expect(screen.getByText(/Google Calendar/i)).toBeInTheDocument()
    expect(screen.getByText(/Active/i)).toBeInTheDocument()
    expect(screen.getByText(/Privacy & Permissions/i)).toBeInTheDocument()
    expect(screen.getByText(/Read-only access/i)).toBeInTheDocument()
  })

  it('should render the WhatsApp integration card', () => {
    render(<IntegrationStatus />)

    expect(screen.getByText(/WhatsApp Reminders/i)).toBeInTheDocument()
    expect(screen.getByText(/Not Connected/i)).toBeInTheDocument()
  })

  it('should show WhatsApp as active when connected', () => {
    render(<IntegrationStatus whatsappConnected={true} />)

    expect(screen.getByText(/WhatsApp Reminders/i)).toBeInTheDocument()
    expect(screen.getByText(/Disconnect WhatsApp/i)).toBeInTheDocument()
  })

  it('should render WhatsApp privacy section', () => {
    render(<IntegrationStatus />)

    expect(screen.getByText(/WhatsApp Privacy/i)).toBeInTheDocument()
    expect(screen.getByText(/We never send promotional messages/i)).toBeInTheDocument()
    expect(screen.getByText(/Meta's encrypted infrastructure/i)).toBeInTheDocument()
  })
})
