import { NextResponse } from 'next/server'
import { getCSRFToken } from '@/lib/csrf'

export async function GET() {
  try {
    const token = await getCSRFToken()
    
    return NextResponse.json(
      { token },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    )
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}