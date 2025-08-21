/**
 * Cookie Security Audit Utilities
 * For development and testing purposes
 */

import { auditCookieSecurity, validateCookieConfig } from './cookie-security.js'

/**
 * Audit cookies in development mode
 */
export function auditApplicationCookies() {
  if (process.env.NODE_ENV === 'production') {
    console.warn('Cookie audit should not run in production')
    return
  }

  console.log('🔒 Cookie Security Audit')
  console.log('========================')

  // Expected application cookies with their security requirements
  const expectedCookies = {
    'session-token': {
      httpOnly: true,
      secure: false, // Will be true in production
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      required: true,
      securityLevel: 'highest'
    },
    '__Host-session-token': {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      required: false, // Only in production
      securityLevel: 'highest'
    },
    'csrf-token': {
      httpOnly: true,
      secure: false, // Will be true in production
      sameSite: 'strict',
      path: '/',
      maxAge: 3600,
      required: true,
      securityLevel: 'highest'
    },
    '__Host-csrf-token': {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 3600,
      required: false, // Only in production
      securityLevel: 'highest'
    }
  }

  let totalIssues = 0

  Object.entries(expectedCookies).forEach(([name, expectedConfig]) => {
    console.log(`\n📋 Auditing: ${name}`)
    
    const validation = validateCookieConfig(name, expectedConfig)
    
    if (validation.errors.length > 0) {
      console.log('❌ Errors:')
      validation.errors.forEach(error => {
        console.log(`   • ${error}`)
        totalIssues++
      })
    }
    
    if (validation.warnings.length > 0) {
      console.log('⚠️  Warnings:')
      validation.warnings.forEach(warning => {
        console.log(`   • ${warning}`)
      })
    }
    
    if (validation.errors.length === 0 && validation.warnings.length === 0) {
      console.log('✅ Configuration valid')
    }

    // Security recommendations
    console.log('🛡️  Security Analysis:')
    if (name.startsWith('__Host-')) {
      console.log('   • Using __Host- prefix for maximum security')
    } else if (name.startsWith('__Secure-')) {
      console.log('   • Using __Secure- prefix for enhanced security')
    } else if (process.env.NODE_ENV === 'production') {
      console.log('   ⚠️  Consider using cookie prefixes in production')
    }

    if (expectedConfig.sameSite === 'strict') {
      console.log('   • Using SameSite=strict for CSRF protection')
    }

    if (expectedConfig.httpOnly) {
      console.log('   • HttpOnly flag prevents XSS access')
    }
  })

  console.log('\n📊 Audit Summary')
  console.log('================')
  console.log(`Total critical issues: ${totalIssues}`)
  
  if (totalIssues === 0) {
    console.log('✅ All cookie configurations pass security audit')
  } else {
    console.log('❌ Cookie security issues detected - please review')
  }

  // Environment-specific recommendations
  if (process.env.NODE_ENV === 'development') {
    console.log('\n💡 Development Recommendations:')
    console.log('   • Test with FORCE_SECURE_COOKIES=true to simulate production')
    console.log('   • Use HTTPS in development when testing cookie security')
    console.log('   • Verify cookie prefixes work correctly in production')
  }

  return totalIssues === 0
}

/**
 * Runtime cookie security check for API routes
 */
export function performRuntimeCookieCheck(request) {
  const cookies = {}
  
  // Extract cookies from request headers
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.trim().split('=')
      if (name && rest.length > 0) {
        cookies[name] = rest.join('=')
      }
    })
  }

  const securityIssues = []

  // Check for secure cookie transmission
  const isHttps = request.url.startsWith('https://')
  const hasSecureCookies = Object.keys(cookies).some(name => 
    name.startsWith('__Host-') || name.startsWith('__Secure-')
  )

  if (!isHttps && hasSecureCookies) {
    securityIssues.push('Secure cookies transmitted over HTTP')
  }

  // Check for suspicious cookie patterns
  Object.keys(cookies).forEach(name => {
    if (name.includes('<script>') || name.includes('javascript:')) {
      securityIssues.push(`Potentially malicious cookie name: ${name}`)
    }
    
    if (cookies[name].length > 4096) {
      securityIssues.push(`Cookie value too large: ${name}`)
    }
  })

  return {
    isSecure: securityIssues.length === 0,
    issues: securityIssues,
    cookieCount: Object.keys(cookies).length
  }
}

/**
 * Generate security report for monitoring
 */
export function generateCookieSecurityReport() {
  const report = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    securityLevel: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    cookieConfiguration: {
      prefixesEnabled: process.env.NODE_ENV === 'production',
      forceSecure: process.env.FORCE_SECURE_COOKIES === 'true',
      strictSameSite: process.env.STRICT_SAME_SITE === 'true',
      domainRestriction: process.env.COOKIE_DOMAIN || 'none'
    },
    recommendations: []
  }

  // Add recommendations based on current configuration
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('change-in-production')) {
      report.recommendations.push('Update JWT_SECRET for production')
    }
    if (!process.env.CSRF_SECRET || process.env.CSRF_SECRET.includes('change-in-production')) {
      report.recommendations.push('Update CSRF_SECRET for production')
    }
  }

  if (!process.env.FORCE_SECURE_COOKIES && process.env.NODE_ENV === 'development') {
    report.recommendations.push('Consider testing with FORCE_SECURE_COOKIES=true')
  }

  return report
}