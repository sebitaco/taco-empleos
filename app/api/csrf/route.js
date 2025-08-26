import { NextResponse } from 'next/server'
import { getCSRFToken } from '@/lib/csrf'
import { withErrorHandler } from '@/lib/errorHandler'

async function handleGET() {
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
}

// Export wrapped handler
export const GET = withErrorHandler(handleGET)