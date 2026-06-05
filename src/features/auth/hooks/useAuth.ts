import { useAuthStore } from '../store/authStore'
import { loginWithCredentials } from '../services/authService'

export function useAuth() {
  const { token, user, setSession, clearSession } = useAuthStore()

  function login(email: string, password: string) {
    const newToken = loginWithCredentials(email, password)
    setSession(newToken, { email, role: 'admin' })
  }

  function logout() {
    clearSession()
  }

  return { isAuthenticated: !!token, user, login, logout }
}
