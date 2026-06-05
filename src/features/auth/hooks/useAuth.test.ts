import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from './useAuth'
import { useAuthStore } from '../store/authStore'

describe('useAuth', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession()
  })

  it('starts unauthenticated', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('authenticates with valid credentials', () => {
    const { result } = renderHook(() => useAuth())
    act(() => {
      result.current.login('admin@gdg-aranjuez.com', 'admin123')
    })
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user?.email).toBe('admin@gdg-aranjuez.com')
  })

  it('throws on invalid credentials', () => {
    const { result } = renderHook(() => useAuth())
    expect(() => {
      act(() => {
        result.current.login('wrong@email.com', 'wrongpass')
      })
    }).toThrow('Credenciales incorrectas')
  })

  it('clears session on logout', () => {
    const { result } = renderHook(() => useAuth())
    act(() => {
      result.current.login('admin@gdg-aranjuez.com', 'admin123')
    })
    act(() => {
      result.current.logout()
    })
    expect(result.current.isAuthenticated).toBe(false)
  })
})
