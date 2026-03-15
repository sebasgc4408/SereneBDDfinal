import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Pricing from './Pricing'

describe('Pricing Component', () => {
  it('should render a transparent and premium pricing structure', () => {
    render(<Pricing />)
    
    // Debería mostrar la promesa de valor en la columna izquierda
    expect(screen.getByText(/Invest in your practice/i)).toBeInTheDocument()
    
    // Debería mostrar el precio base
    expect(screen.getByText(/24/i)).toBeInTheDocument()
    
    // Debería listar los beneficios clave (ahora más compactos)
    expect(screen.getByText(/Zero-friction patient booking/i)).toBeInTheDocument()
    expect(screen.getByText(/Automated reminders & intake/i)).toBeInTheDocument()
    
    // Debería tener un CTA claro
    expect(screen.getByRole('button', { name: /Start your 14-day free trial/i })).toBeInTheDocument()
  })
})
