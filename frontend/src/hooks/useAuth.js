import { useCallback, useMemo } from 'react'
import { useAuthStore } from '../store/authStore'
import { logout as logoutApi } from '../api/authApi'
import toast from 'react-hot-toast'

export function useAuth() {
  const { user, role, isAuthenticated, clearAuth } = useAuthStore((state) => state)

  const logout = useCallback(async () => {
    try {
      await logoutApi()
      clearAuth()
      toast.success('Logged out')
    } catch {
      clearAuth()
    }
  }, [clearAuth])

  const hasRole = useCallback((targetRole) => role === targetRole, [role])

  return useMemo(() => ({ user, role, isAuthenticated, logout, hasRole }), [user, role, isAuthenticated, logout, hasRole])
}
