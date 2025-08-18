import { 
  createSession, 
  UserRoles, 
  Permissions,
  requirePermission,
  requireRole 
} from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { action, role } = await request.json()
    
    switch (action) {
      case 'create_test_session':
        // Create a test session (only for development/testing)
        if (process.env.NODE_ENV !== 'production') {
          const testUser = {
            id: 'test-user-123',
            email: 'test@example.com',
            role: role || UserRoles.ADMIN,
            companyId: role === UserRoles.EMPLOYER ? 'test-company-123' : null
          }
          
          await createSession(testUser)
          
          return NextResponse.json({
            message: 'Test session created',
            user: testUser
          })
        }
        
        return NextResponse.json(
          { error: 'Test sessions only available in development' },
          { status: 403 }
        )
        
      case 'test_admin_access':
        const adminResult = await requireRole(UserRoles.ADMIN, { returnResponse: true })
        if (adminResult instanceof NextResponse) {
          return adminResult
        }
        
        return NextResponse.json({
          message: 'Admin access granted',
          session: adminResult
        })
        
      case 'test_waitlist_permission':
        const waitlistResult = await requirePermission(Permissions.VIEW_WAITLIST, { returnResponse: true })
        if (waitlistResult instanceof NextResponse) {
          return waitlistResult
        }
        
        return NextResponse.json({
          message: 'Waitlist permission granted',
          session: waitlistResult
        })
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
    
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json(
      { error: 'Test failed' },
      { status: 500 }
    )
  }
}