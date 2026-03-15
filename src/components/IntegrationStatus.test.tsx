import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import IntegrationStatus from './IntegrationStatus'

describe('IntegrationStatus Component', () => {
  it('should render the active integration and permission clarity cards', () => {
    render(<IntegrationStatus />)
    
    // Should show Google Calendar is connected
    expect(screen.getByText(/Google Calendar/i)).toBeInTheDocument()
    expect(screen.getByText(/Active/i)).toBeInTheDocument()
    
    // Should explain the active permissions in the collapsible section
    expect(screen.getByText(/Privacy & Permissions/i)).toBeInTheDocument()
    expect(screen.getByText(/Read-only access/i)).toBeInTheDocument()
  })
})
