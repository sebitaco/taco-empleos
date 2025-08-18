import { createClient } from '@/lib/supabase/server'
import { requirePermission, Permissions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    // Check authorization
    const authResult = await requirePermission(Permissions.EXPORT_WAITLIST, { returnResponse: true })
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    const session = authResult
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const format = searchParams.get('format') || 'csv'
    const audience = searchParams.get('audience')
    
    let query = supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (audience && ['employer', 'candidate'].includes(audience)) {
      query = query.eq('audience', audience)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch waitlist data' },
        { status: 500 }
      )
    }
    
    if (format === 'csv') {
      const csv = convertToCSV(data)
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="waitlist-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }
    
    if (format === 'json') {
      return new NextResponse(JSON.stringify(data, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="waitlist-export-${new Date().toISOString().split('T')[0]}.json"`
        }
      })
    }
    
    return NextResponse.json(
      { error: 'Unsupported format. Use csv or json.' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function convertToCSV(data) {
  if (data.length === 0) return ''
  
  const headers = [
    'ID',
    'Audience',
    'Email',
    'City',
    'Company Name',
    'Needs',
    'Role',
    'Experience Years',
    'Preferred City',
    'Source',
    'Consent',
    'Created At'
  ]
  
  const csvRows = [headers.join(',')]
  
  for (const row of data) {
    const values = [
      row.id,
      row.audience,
      row.email,
      row.city,
      row.company_name || '',
      (row.needs || '').replace(/,/g, ';'),
      row.role || '',
      row.experience_years || '',
      row.preferred_city || '',
      row.source || '',
      row.consent,
      row.created_at
    ]
    
    csvRows.push(values.map(value => 
      typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value
    ).join(','))
  }
  
  return csvRows.join('\n')
}