// Test endpoint to verify Aikido security monitoring
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const testParam = searchParams.get('test')
  
  // This will be monitored by Aikido for potential security issues
  return NextResponse.json({ 
    message: 'Security test endpoint working',
    timestamp: new Date().toISOString(),
    testParam: testParam,
    aikidoStatus: 'monitoring'
  })
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Aikido will monitor this for malicious payloads
    return NextResponse.json({ 
      message: 'POST request processed',
      received: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Invalid JSON',
      timestamp: new Date().toISOString()
    }, { status: 400 })
  }
}