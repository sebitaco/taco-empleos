'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  hasPermission: () => false,
  hasRole: () => false,
  canAccess: () => false
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    checkAuth()
  }, [])
  
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }
  
  const login = async (credentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.message }
      }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  }
  
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout failed:', error)
    }
    
    setUser(null)
  }
  
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false
  }
  
  const hasRole = (role) => {
    if (Array.isArray(role)) {
      return role.includes(user?.role)
    }
    return user?.role === role
  }
  
  const canAccess = (resource, ownerId) => {
    if (user?.role === 'admin') {
      return true
    }
    
    if (resource === 'job') {
      if (hasPermission('edit_any_job')) {
        return true
      }
      if (hasPermission('edit_own_job') && user?.userId === ownerId) {
        return true
      }
    }
    
    if (resource === 'company') {
      if (hasPermission('manage_company') && user?.companyId === ownerId) {
        return true
      }
    }
    
    return false
  }
  
  const value = {
    user,
    isLoading,
    login,
    logout,
    hasPermission,
    hasRole,
    canAccess
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function RequireAuth({ children, fallback = null, permission = null, role = null }) {
  const { user, isLoading, hasPermission, hasRole } = useAuth()
  
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  if (!user) {
    return fallback || <div>Please log in to access this content.</div>
  }
  
  if (permission && !hasPermission(permission)) {
    return fallback || <div>You don't have permission to view this content.</div>
  }
  
  if (role && !hasRole(role)) {
    return fallback || <div>You don't have the required role to view this content.</div>
  }
  
  return children
}

export function ProtectedRoute({ children, ...authProps }) {
  return (
    <RequireAuth {...authProps}>
      {children}
    </RequireAuth>
  )
}

export function ConditionalRender({ 
  children, 
  permission = null, 
  role = null, 
  fallback = null,
  showWhenLoggedOut = false 
}) {
  const { user, hasPermission, hasRole } = useAuth()
  
  if (showWhenLoggedOut && !user) {
    return children
  }
  
  if (!showWhenLoggedOut && !user) {
    return fallback
  }
  
  if (permission && !hasPermission(permission)) {
    return fallback
  }
  
  if (role && !hasRole(role)) {
    return fallback
  }
  
  return children
}