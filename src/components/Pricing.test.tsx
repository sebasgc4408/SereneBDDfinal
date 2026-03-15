import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Pricing from './Pricing'

describe('Pricing Component', () => {
  it('should render a transparent and premium pricing structure', () => {
    render(<Pricing />)
    
    // Debería mostrar la promesa de transparencia
    expect(screen.getByText(/Simple, transparent pricing/i)).toBeInTheDocument()
    
    // Debería mostrar el precio
    expect(screen.getByText(/\$29/i)).toBeInTheDocument()
    
    // Debería listar los beneficios clave
    expect(screen.getByText(/Unlimited appointments/i)).toBeInTheDocument()
    expect(screen.getByText(/Automated patient intake/i)).toBeInTheDocument()
    
    // Debería tener un CTA claro
    expect(screen.getByRole('button', { name: /Start your 14-day free trial/i })).toBeInTheDocument()
  })
})
