import { NextResponse } from 'next/server'
import { createSession, getSession, destroySession } from '@/lib/auth'
import { setCSRFToken, getCSRFToken, validateCSRFToken } from '@/lib/csrf'

export async function GET(request) {
  // Only allow in development for testing
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Test endpoint not available in production' },
      { status: 403 }
    )
  }

  try {
    // Test 1: Create a test session
    const testUser = {
      id: 'test-user-' + Date.now(),
      email: 'test@example.com',
      role: 'candidate',
      companyId: null
    }
    
    const sessionToken = await createSession(testUser)
    
    // Test 2: Set CSRF token
    const csrfToken = await setCSRFToken()
    
    // Test 3: Verify session can be retrieved
    const session = await getSession()
    
    // Test 4: Get CSRF token
    const retrievedCsrfToken = await getCSRFToken()
    
    // Check security configuration
    const securityChecks = {
      jwt_secret_configured: process.env.JWT_SECRET && !process.env.JWT_SECRET.includes('change-in-production'),
      csrf_secret_configured: process.env.CSRF_SECRET && !process.env.CSRF_SECRET.includes('change-in-production'),
      session_created: !!sessionToken,
      session_retrieved: !!session && session.userId === testUser.id,
      csrf_token_set: !!csrfToken,
      csrf_token_retrieved: !!retrievedCsrfToken,
      environment: process.env.NODE_ENV,
      cookie_prefix_in_prod: process.env.NODE_ENV === 'production' ? '__Host-' : 'standard'
    }
    
    const response = NextResponse.json({
      message: 'Cookie security test successful',
      timestamp: new Date().toISOString(),
      tests: {
        session: {
          created: securityChecks.session_created,
          retrieved: securityChecks.session_retrieved,
          user_id: session?.userId,
          role: session?.role
        },
        csrf: {
          token_set: securityChecks.csrf_token_set,
          token_retrieved: securityChecks.csrf_token_retrieved
        },
        security: {
          jwt_configured: securityChecks.jwt_secret_configured,
          csrf_configured: securityChecks.csrf_secret_configured,
          environment: securityChecks.environment,
          cookie_prefix: securityChecks.cookie_prefix_in_prod
        }
      },
      success: Object.values(securityChecks).every(check => 
        typeof check === 'boolean' ? check : true
      )
    })
    
    // Check response headers
    response.headers.set('X-Test-Complete', 'true')
    
    return response
    
  } catch (error) {
    console.error('Cookie test error:', error)
    return NextResponse.json(
      { 
        error: 'Cookie test failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  // Clear test cookies
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Test endpoint not available in production' },
      { status: 403 }
    )
  }
  
  try {
    await destroySession()
    
    return NextResponse.json({
      message: 'Test session cleared',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to clear session', message: error.message },
      { status: 500 }
    )
  }
}