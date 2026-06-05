import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from './LoginForm'
import { useAuthStore } from '../store/authStore'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>() // eslint-disable-line @typescript-eslint/consistent-type-imports
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderForm() {
  return render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>,
  )
}

describe('LoginForm', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession()
    mockNavigate.mockReset()
  })

  it('muestra los campos de email y contraseña', () => {
    renderForm()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
  })

  it('muestra errores de validación si se envía vacío', async () => {
    renderForm()
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => {
      expect(screen.getByText(/introduce un email válido/i)).toBeInTheDocument()
    })
  })

  it('redirige a /events con credenciales correctas', async () => {
    renderForm()
    await userEvent.type(screen.getByLabelText(/email/i), 'admin@gdg-aranjuez.com')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'admin123')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/events', { replace: true })
    })
  })

  it('muestra error de servidor con credenciales incorrectas', async () => {
    renderForm()
    await userEvent.type(screen.getByLabelText(/email/i), 'wrong@email.com')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/email o contraseña incorrectos/i)
    })
  })
})
