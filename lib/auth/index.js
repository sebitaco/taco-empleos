import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

const SESSION_COOKIE_NAME = 'session-token'
const SESSION_EXPIRY_SECONDS = 7 * 24 * 60 * 60 // 7 days

export const UserRoles = {
  ADMIN: 'admin',
  EMPLOYER: 'employer',
  CANDIDATE: 'candidate',
  GUEST: 'guest'
}

export const Permissions = {
  // Waitlist permissions
  VIEW_WAITLIST: 'view_waitlist',
  MANAGE_WAITLIST: 'manage_waitlist',
  EXPORT_WAITLIST: 'export_waitlist',
  
  // Job permissions
  CREATE_JOB: 'create_job',
  EDIT_OWN_JOB: 'edit_own_job',
  EDIT_ANY_JOB: 'edit_any_job',
  DELETE_OWN_JOB: 'delete_own_job',
  DELETE_ANY_JOB: 'delete_any_job',
  VIEW_APPLICATIONS: 'view_applications',
  
  // User permissions
  VIEW_USERS: 'view_users',
  MANAGE_USERS: 'manage_users',
  
  // Company permissions
  MANAGE_COMPANY: 'manage_company',
  VIEW_COMPANY_STATS: 'view_company_stats',
  
  // Admin permissions
  ACCESS_ADMIN: 'access_admin',
  SYSTEM_CONFIG: 'system_config'
}

const rolePermissions = {
  [UserRoles.ADMIN]: [
    Permissions.VIEW_WAITLIST,
    Permissions.MANAGE_WAITLIST,
    Permissions.EXPORT_WAITLIST,
    Permissions.CREATE_JOB,
    Permissions.EDIT_ANY_JOB,
    Permissions.DELETE_ANY_JOB,
    Permissions.VIEW_APPLICATIONS,
    Permissions.VIEW_USERS,
    Permissions.MANAGE_USERS,
    Permissions.ACCESS_ADMIN,
    Permissions.SYSTEM_CONFIG
  ],
  [UserRoles.EMPLOYER]: [
    Permissions.CREATE_JOB,
    Permissions.EDIT_OWN_JOB,
    Permissions.DELETE_OWN_JOB,
    Permissions.VIEW_APPLICATIONS,
    Permissions.MANAGE_COMPANY,
    Permissions.VIEW_COMPANY_STATS
  ],
  [UserRoles.CANDIDATE]: [],
  [UserRoles.GUEST]: []
}

export async function createSession(user) {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
    companyId: user.companyId || null,
    permissions: rolePermissions[user.role] || []
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRY_SECONDS}s`)
    .sign(JWT_SECRET)
  
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRY_SECONDS,
    path: '/'
  })
  
  return token
}

export async function getSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)
    
    if (!token?.value) {
      return null
    }
    
    const { payload } = await jwtVerify(token.value, JWT_SECRET)
    return payload
  } catch (error) {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function requireAuth(options = {}) {
  const session = await getSession()
  
  if (!session) {
    if (options.returnResponse) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    throw new Error('Authentication required')
  }
  
  return session
}

export async function requireRole(role, options = {}) {
  const session = await requireAuth(options)
  
  if (session.role !== role && session.role !== UserRoles.ADMIN) {
    if (options.returnResponse) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    throw new Error('Insufficient permissions')
  }
  
  return session
}

export async function requirePermission(permission, options = {}) {
  const session = await requireAuth(options)
  
  if (!session.permissions?.includes(permission)) {
    if (options.returnResponse) {
      return NextResponse.json(
        { error: `Missing required permission: ${permission}` },
        { status: 403 }
      )
    }
    throw new Error(`Missing required permission: ${permission}`)
  }
  
  return session
}

export async function requirePermissions(permissions, options = {}) {
  const session = await requireAuth(options)
  
  const missingPermissions = permissions.filter(
    permission => !session.permissions?.includes(permission)
  )
  
  if (missingPermissions.length > 0) {
    if (options.returnResponse) {
      return NextResponse.json(
        { error: `Missing required permissions: ${missingPermissions.join(', ')}` },
        { status: 403 }
      )
    }
    throw new Error(`Missing required permissions: ${missingPermissions.join(', ')}`)
  }
  
  return session
}

export function hasPermission(session, permission) {
  return session?.permissions?.includes(permission) || false
}

export function hasAnyPermission(session, permissions) {
  return permissions.some(permission => hasPermission(session, permission))
}

export function hasAllPermissions(session, permissions) {
  return permissions.every(permission => hasPermission(session, permission))
}

export function canAccessResource(session, resource, ownerId) {
  if (session.role === UserRoles.ADMIN) {
    return true
  }
  
  if (resource === 'job') {
    if (session.permissions?.includes(Permissions.EDIT_ANY_JOB)) {
      return true
    }
    if (session.permissions?.includes(Permissions.EDIT_OWN_JOB) && session.userId === ownerId) {
      return true
    }
  }
  
  if (resource === 'company') {
    if (session.permissions?.includes(Permissions.MANAGE_COMPANY) && session.companyId === ownerId) {
      return true
    }
  }
  
  return false
}

export async function refreshSession() {
  const session = await getSession()
  
  if (!session) {
    return null
  }
  
  const newToken = await new SignJWT({
    ...session,
    iat: undefined,
    exp: undefined
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRY_SECONDS}s`)
    .sign(JWT_SECRET)
  
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRY_SECONDS,
    path: '/'
  })
  
  return newToken
}