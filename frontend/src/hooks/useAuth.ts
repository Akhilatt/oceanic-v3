import { useState, useCallback } from 'react'
import type { User } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem('oc_user') ?? 'null') }
    catch { return null }
  })
  const login = useCallback((u: User) => { setUser(u); localStorage.setItem('oc_user', JSON.stringify(u)) }, [])
  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('oc_token'); localStorage.removeItem('oc_refresh'); localStorage.removeItem('oc_user')
  }, [])
  return { user, login, logout }
}
