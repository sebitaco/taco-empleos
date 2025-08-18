import { NextResponse } from 'next/server'
import { getSession, hasPermission, UserRoles, Permissions } from './index'
import { validateCSRFToken } from '@/lib/csrf'

export function createAuthMiddleware(config = {}) {
  return async function authMiddleware(request) {
    const { pathname } = request.nextUrl
    const method = request.method
    
    // Apply route-specific authorization rules
    const routeConfig = getRouteConfig(pathname, method, config)
    
    if (!routeConfig) {
      return NextResponse.next()
    }
    
    // Check CSRF for state-changing operations
    if (routeConfig.requireCSRF && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const csrfResult = await validateCSRFToken(request)
      if (!csrfResult.valid) {
        return NextResponse.json(
          { error: csrfResult.error },
          { status: 403 }
        )
      }
    }
    
    // Check authentication
    if (routeConfig.requireAuth || routeConfig.requireRole || routeConfig.requirePermissions) {
      const session = await getSession()
      
      if (!session) {
        return handleUnauthorized(request, 'Authentication required')
      }
      
      // Check role requirement
      if (routeConfig.requireRole) {
        const allowedRoles = Array.isArray(routeConfig.requireRole) 
          ? routeConfig.requireRole 
          : [routeConfig.requireRole]
        
        if (!allowedRoles.includes(session.role) && session.role !== UserRoles.ADMIN) {
          return handleForbidden(request, 'Insufficient role privileges')
        }
      }
      
      // Check permission requirements
      if (routeConfig.requirePermissions) {
        const requiredPermissions = Array.isArray(routeConfig.requirePermissions)
          ? routeConfig.requirePermissions
          : [routeConfig.requirePermissions]
        
        const missingPermissions = requiredPermissions.filter(
          permission => !hasPermission(session, permission)
        )
        
        if (missingPermissions.length > 0) {
          return handleForbidden(
            request, 
            `Missing permissions: ${missingPermissions.join(', ')}`
          )
        }
      }
      
      // Check custom authorization logic
      if (routeConfig.authorize) {
        const authorized = await routeConfig.authorize(request, session)
        if (!authorized) {
          return handleForbidden(request, 'Access denied')
        }
      }
      
      // Add session to request headers for downstream use
      const response = NextResponse.next()
      response.headers.set('x-user-id', session.userId || '')
      response.headers.set('x-user-role', session.role || '')
      response.headers.set('x-user-email', session.email || '')
      
      return response
    }
    
    return NextResponse.next()
  }
}

function getRouteConfig(pathname, method, config) {
  // Check exact match first
  const exactKey = `${method}:${pathname}`
  if (config.routes?.[exactKey]) {
    return config.routes[exactKey]
  }
  
  // Check pattern matches
  for (const [pattern, routeConfig] of Object.entries(config.routes || {})) {
    if (matchesPattern(pathname, method, pattern)) {
      return routeConfig
    }
  }
  
  // Check path prefix matches
  for (const [prefix, prefixConfig] of Object.entries(config.pathPrefixes || {})) {
    if (pathname.startsWith(prefix)) {
      return prefixConfig
    }
  }
  
  return null
}

function matchesPattern(pathname, method, pattern) {
  const [patternMethod, patternPath] = pattern.split(':')
  
  if (patternMethod !== '*' && patternMethod !== method) {
    return false
  }
  
  // Convert route pattern to regex
  const regexPattern = patternPath
    .replace(/\*/g, '.*')
    .replace(/\[([^\]]+)\]/g, '([^/]+)')
  
  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(pathname)
}

function handleUnauthorized(request, message = 'Authentication required') {
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')
  
  if (isApiRoute) {
    return NextResponse.json(
      { error: message },
      { status: 401 }
    )
  }
  
  // Redirect to login page for web routes
  const url = new URL('/login', request.url)
  url.searchParams.set('from', request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

function handleForbidden(request, message = 'Access denied') {
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')
  
  if (isApiRoute) {
    return NextResponse.json(
      { error: message },
      { status: 403 }
    )
  }
  
  // Redirect to error page for web routes
  const url = new URL('/403', request.url)
  return NextResponse.redirect(url)
}

export const defaultAuthConfig = {
  routes: {
    // Admin routes
    'GET:/api/admin/*': {
      requireAuth: true,
      requirePermissions: Permissions.ACCESS_ADMIN
    },
    'POST:/api/admin/*': {
      requireAuth: true,
      requirePermissions: Permissions.ACCESS_ADMIN,
      requireCSRF: true
    },
    'PUT:/api/admin/*': {
      requireAuth: true,
      requirePermissions: Permissions.ACCESS_ADMIN,
      requireCSRF: true
    },
    'DELETE:/api/admin/*': {
      requireAuth: true,
      requirePermissions: Permissions.ACCESS_ADMIN,
      requireCSRF: true
    },
    
    // Waitlist management
    'GET:/api/waitlist/export': {
      requireAuth: true,
      requirePermissions: Permissions.EXPORT_WAITLIST
    },
    'GET:/api/waitlist/manage': {
      requireAuth: true,
      requirePermissions: Permissions.VIEW_WAITLIST
    },
    'DELETE:/api/waitlist/[id]': {
      requireAuth: true,
      requirePermissions: Permissions.MANAGE_WAITLIST,
      requireCSRF: true
    },
    
    // Job management
    'POST:/api/jobs': {
      requireAuth: true,
      requirePermissions: Permissions.CREATE_JOB,
      requireCSRF: true
    },
    'PUT:/api/jobs/[id]': {
      requireAuth: true,
      requireCSRF: true,
      authorize: async (request, session) => {
        // Custom logic to check if user can edit this specific job
        const jobId = request.nextUrl.pathname.split('/').pop()
        // Implement logic to check ownership or admin status
        return true // Placeholder
      }
    },
    'DELETE:/api/jobs/[id]': {
      requireAuth: true,
      requireCSRF: true,
      authorize: async (request, session) => {
        const jobId = request.nextUrl.pathname.split('/').pop()
        // Implement logic to check ownership or admin status
        return true // Placeholder
      }
    }
  },
  
  pathPrefixes: {
    '/admin': {
      requireAuth: true,
      requireRole: UserRoles.ADMIN
    },
    '/dashboard': {
      requireAuth: true
    },
    '/employer': {
      requireAuth: true,
      requireRole: [UserRoles.EMPLOYER, UserRoles.ADMIN]
    }
  }
}