/**
 * Cookie Security Utilities
 * Provides secure cookie configuration and validation utilities
 */

// Cookie Security Constants
export const COOKIE_PREFIXES = {
  HOST: '__Host-',
  SECURE: '__Secure-'
}

// Security levels for different cookie types
export const COOKIE_SECURITY_LEVELS = {
  HIGHEST: 'highest',     // __Host- prefix, strict sameSite, secure, httpOnly
  HIGH: 'high',           // __Secure- prefix, strict sameSite, secure, httpOnly  
  MEDIUM: 'medium',       // strict sameSite, secure, httpOnly
  BASIC: 'basic'          // lax sameSite, secure in production only
}

/**
 * Generate secure cookie configuration based on security level
 */
export function getSecureCookieConfig(cookieName, securityLevel = COOKIE_SECURITY_LEVELS.HIGH, customOptions = {}) {
  const isProduction = process.env.NODE_ENV === 'production'
  const forceSecure = process.env.FORCE_SECURE_COOKIES === 'true'
  
  const baseConfig = {
    httpOnly: true,
    path: '/',
    secure: isProduction || forceSecure
  }
  
  switch (securityLevel) {
    case COOKIE_SECURITY_LEVELS.HIGHEST:
      return {
        ...baseConfig,
        sameSite: 'strict',
        secure: true, // Always secure for highest level
        // Note: __Host- prefix requires secure=true, path='/', and no domain
        ...customOptions
      }
      
    case COOKIE_SECURITY_LEVELS.HIGH:
      return {
        ...baseConfig,
        sameSite: 'strict',
        // Can include domain for __Secure- prefix
        ...(customOptions.domain && { domain: customOptions.domain }),
        ...customOptions
      }
      
    case COOKIE_SECURITY_LEVELS.MEDIUM:
      return {
        ...baseConfig,
        sameSite: 'strict',
        ...(customOptions.domain && { domain: customOptions.domain }),
        ...customOptions
      }
      
    case COOKIE_SECURITY_LEVELS.BASIC:
      return {
        ...baseConfig,
        sameSite: 'lax',
        ...(customOptions.domain && { domain: customOptions.domain }),
        ...customOptions
      }
      
    default:
      return {
        ...baseConfig,
        sameSite: 'strict',
        ...customOptions
      }
  }
}

/**
 * Get appropriate cookie name with security prefix
 */
export function getSecureCookieName(baseName, securityLevel = COOKIE_SECURITY_LEVELS.HIGH) {
  const isProduction = process.env.NODE_ENV === 'production'
  
  // Only use prefixes in production or when explicitly forced
  if (!isProduction && process.env.FORCE_SECURE_COOKIES !== 'true') {
    return baseName
  }
  
  switch (securityLevel) {
    case COOKIE_SECURITY_LEVELS.HIGHEST:
      return `${COOKIE_PREFIXES.HOST}${baseName}`
    case COOKIE_SECURITY_LEVELS.HIGH:
      return `${COOKIE_PREFIXES.SECURE}${baseName}`
    default:
      return baseName
  }
}

/**
 * Validate cookie security configuration
 */
export function validateCookieConfig(cookieName, config) {
  const warnings = []
  const errors = []
  
  // Check for __Host- prefix requirements
  if (cookieName.startsWith(COOKIE_PREFIXES.HOST)) {
    if (!config.secure) {
      errors.push('__Host- prefixed cookies must have secure=true')
    }
    if (config.path !== '/') {
      errors.push('__Host- prefixed cookies must have path="/"')
    }
    if (config.domain) {
      errors.push('__Host- prefixed cookies cannot have a domain attribute')
    }
  }
  
  // Check for __Secure- prefix requirements
  if (cookieName.startsWith(COOKIE_PREFIXES.SECURE)) {
    if (!config.secure) {
      errors.push('__Secure- prefixed cookies must have secure=true')
    }
  }
  
  // Security recommendations
  if (!config.httpOnly && !config.allowClientAccess) {
    warnings.push('Consider using httpOnly=true for security-sensitive cookies')
  }
  
  if (config.sameSite === 'none' && !config.secure) {
    errors.push('SameSite=None requires Secure=true')
  }
  
  if (config.sameSite === 'lax' && config.sensitive) {
    warnings.push('Consider using SameSite=strict for sensitive cookies')
  }
  
  return { warnings, errors, isValid: errors.length === 0 }
}

/**
 * Cookie consent and tracking utilities
 */
export const CONSENT_COOKIE_NAME = 'cookie-consent'
export const CONSENT_TYPES = {
  NECESSARY: 'necessary',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
  FUNCTIONAL: 'functional'
}

/**
 * Check if user has consented to specific cookie types
 */
export function hasConsentFor(consentCookie, cookieType) {
  if (!consentCookie) return false
  
  try {
    const consent = JSON.parse(consentCookie)
    return consent[cookieType] === true
  } catch {
    return false
  }
}

/**
 * Generate secure cookie options for different use cases
 */
export const COOKIE_PRESETS = {
  SESSION: (customOptions = {}) => getSecureCookieConfig(
    'session',
    COOKIE_SECURITY_LEVELS.HIGHEST,
    { maxAge: 7 * 24 * 60 * 60, ...customOptions }
  ),
  
  CSRF: (customOptions = {}) => getSecureCookieConfig(
    'csrf',
    COOKIE_SECURITY_LEVELS.HIGHEST,
    { maxAge: 60 * 60, ...customOptions }
  ),
  
  PREFERENCE: (customOptions = {}) => getSecureCookieConfig(
    'preference',
    COOKIE_SECURITY_LEVELS.MEDIUM,
    { maxAge: 30 * 24 * 60 * 60, ...customOptions }
  ),
  
  ANALYTICS: (customOptions = {}) => getSecureCookieConfig(
    'analytics',
    COOKIE_SECURITY_LEVELS.BASIC,
    { maxAge: 365 * 24 * 60 * 60, ...customOptions }
  )
}

/**
 * Security audit for existing cookies
 */
export function auditCookieSecurity(cookies) {
  const audit = {
    total: 0,
    secure: 0,
    httpOnly: 0,
    sameSiteStrict: 0,
    withPrefix: 0,
    issues: []
  }
  
  Object.entries(cookies).forEach(([name, config]) => {
    audit.total++
    
    if (config.secure) audit.secure++
    if (config.httpOnly) audit.httpOnly++
    if (config.sameSite === 'strict') audit.sameSiteStrict++
    if (name.startsWith('__Host-') || name.startsWith('__Secure-')) audit.withPrefix++
    
    const validation = validateCookieConfig(name, config)
    if (!validation.isValid) {
      audit.issues.push({ name, errors: validation.errors, warnings: validation.warnings })
    }
  })
  
  return audit
}