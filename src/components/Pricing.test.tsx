import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Pricing from './Pricing'

describe('Pricing Component', () => {
  it('should render a transparent and premium pricing structure', () => {
    render(<Pricing />)
    
    // Debería mostrar la promesa de valor
    expect(screen.getByText(/Your time belongs to your patients/i)).toBeInTheDocument()
    
    // Debería mostrar el precio base
    expect(screen.getByText(/24/i)).toBeInTheDocument()
    
    // Debería listar los beneficios clave
    expect(screen.getByText(/Zero-friction booking/i)).toBeInTheDocument()
    expect(screen.getByText(/Automated patient intake/i)).toBeInTheDocument()
    
    // Debería tener un CTA claro
    expect(screen.getByRole('button', { name: /Start your 14-day free trial/i })).toBeInTheDocument()
  })
})
