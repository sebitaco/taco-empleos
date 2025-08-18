import { createClient } from '@/lib/supabase/server'
import { requirePermission, Permissions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    // Check authorization
    const authResult = await requirePermission(Permissions.VIEW_WAITLIST, { returnResponse: true })
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    const session = authResult
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const audience = searchParams.get('audience')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sort') || 'created_at'
    const order = searchParams.get('order') || 'desc'
    
    const offset = (page - 1) * limit
    
    let query = supabase
      .from('waitlist')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order(sortBy, { ascending: order === 'asc' })
    
    if (audience && ['employer', 'candidate'].includes(audience)) {
      query = query.eq('audience', audience)
    }
    
    if (search) {
      query = query.or(`email.ilike.%${search}%,city.ilike.%${search}%,company_name.ilike.%${search}%`)
    }
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch waitlist entries' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    // Check authorization
    const authResult = await requirePermission(Permissions.MANAGE_WAITLIST, { returnResponse: true })
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    const session = authResult
    const { ids } = await request.json()
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or empty IDs array' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    const { error } = await supabase
      .from('waitlist')
      .delete()
      .in('id', ids)
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete waitlist entries' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: `Successfully deleted ${ids.length} entries`
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}