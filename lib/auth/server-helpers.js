import { redirect } from 'next/navigation'
import { getSession, hasPermission, UserRoles } from './index'

export async function protectPage(options = {}) {
  const {
    requireAuth = true,
    requireRole = null,
    requirePermissions = null,
    redirectTo = '/login'
  } = options
  
  if (!requireAuth) {
    return null
  }
  
  const session = await getSession()
  
  if (!session) {
    redirect(`${redirectTo}?from=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || '')}`)
  }
  
  if (requireRole) {
    const allowedRoles = Array.isArray(requireRole) ? requireRole : [requireRole]
    if (!allowedRoles.includes(session.role) && session.role !== UserRoles.ADMIN) {
      redirect('/403')
    }
  }
  
  if (requirePermissions) {
    const requiredPermissions = Array.isArray(requirePermissions) 
      ? requirePermissions 
      : [requirePermissions]
    
    const missingPermissions = requiredPermissions.filter(
      permission => !hasPermission(session, permission)
    )
    
    if (missingPermissions.length > 0) {
      redirect('/403')
    }
  }
  
  return session
}

export async function getAuthenticatedUser() {
  return await getSession()
}

export async function requireAuthenticatedUser() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  return session
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session || session.role !== UserRoles.ADMIN) {
    redirect('/403')
  }
  return session
}

export async function requireEmployer() {
  const session = await getSession()
  if (!session || (session.role !== UserRoles.EMPLOYER && session.role !== UserRoles.ADMIN)) {
    redirect('/403')
  }
  return session
}

export function withAuth(handler, options = {}) {
  return async (request, context) => {
    try {
      const session = await protectPage(options)
      
      const response = await handler(request, {
        ...context,
        session
      })
      
      return response
    } catch (error) {
      if (error.message === 'NEXT_REDIRECT') {
        throw error
      }
      
      console.error('Auth wrapper error:', error)
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}

export function createProtectedApiHandler(handler, options = {}) {
  return async (request, context) => {
    try {
      const {
        requireAuth = true,
        requireRole = null,
        requirePermissions = null
      } = options
      
      if (!requireAuth) {
        return handler(request, context)
      }
      
      const session = await getSession()
      
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
      
      if (requireRole) {
        const allowedRoles = Array.isArray(requireRole) ? requireRole : [requireRole]
        if (!allowedRoles.includes(session.role) && session.role !== UserRoles.ADMIN) {
          return new Response(
            JSON.stringify({ error: 'Insufficient permissions' }),
            { 
              status: 403,
              headers: { 'Content-Type': 'application/json' }
            }
          )
        }
      }
      
      if (requirePermissions) {
        const requiredPermissions = Array.isArray(requirePermissions) 
          ? requirePermissions 
          : [requirePermissions]
        
        const missingPermissions = requiredPermissions.filter(
          permission => !hasPermission(session, permission)
        )
        
        if (missingPermissions.length > 0) {
          return new Response(
            JSON.stringify({ 
              error: `Missing permissions: ${missingPermissions.join(', ')}` 
            }),
            { 
              status: 403,
              headers: { 'Content-Type': 'application/json' }
            }
          )
        }
      }
      
      return handler(request, {
        ...context,
        session
      })
      
    } catch (error) {
      console.error('Protected API handler error:', error)
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }
}