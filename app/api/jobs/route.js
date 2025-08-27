import { NextResponse } from 'next/server'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { jobs } from '@/lib/db/schema'
import { desc, count, eq, sql } from 'drizzle-orm'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

const client = postgres(connectionString)
const db = drizzle(client)

// Static jobs data (temporary until database is fully populated)
const staticJobs = [
  {
    id: '1',
    title: "Mesero",
    location: "Ciudad de México, México",
    salary: "$9,200 MXN",
    featured: true,
    tags: ["Propinas diarias", "Comedor incluido", "Uniforme sin costo"],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: "Garrotero",
    location: "Guadalajara, México",
    salary: "$8,300 MXN",
    tags: ["Comedor incluido", "Descanso entre semana"],
    createdAt: new Date('2024-01-14')
  },
  {
    id: '3',
    title: "Hostess",
    location: "Monterrey, México",
    salary: "$9,600 MXN",
    isNew: true,
    tags: ["Prestaciones de ley", "Capacitaciones", "Uniforme sin costo"],
    createdAt: new Date('2024-01-13')
  },
  {
    id: '4',
    title: "Cocinero A",
    location: "Ciudad de México, México",
    salary: "$12,000 MXN",
    featured: true,
    tags: ["Experiencia mínima 2 años", "Comedor incluido", "Crecimiento interno"],
    createdAt: new Date('2024-01-12')
  },
  {
    id: '5',
    title: "Cocinero B",
    location: "Tijuana, México",
    salary: "$10,000 MXN",
    tags: ["Prestaciones de ley", "Capacitaciones"],
    createdAt: new Date('2024-01-11')
  },
  {
    id: '6',
    title: "Ayudante de cocina",
    location: "Puebla, México",
    salary: "$8,800 MXN",
    tags: ["Sin experiencia", "Comedor incluido", "Uniforme sin costo"],
    createdAt: new Date('2024-01-10')
  },
  {
    id: '7',
    title: "Bartender",
    location: "Playa del Carmen, México",
    salary: "$9,100 MXN",
    tags: ["Turno nocturno", "Propinas diarias", "Transporte nocturno"],
    createdAt: new Date('2024-01-09')
  },
  {
    id: '8',
    title: "Cajero",
    location: "Querétaro, México",
    salary: "$8,400 MXN",
    tags: ["Prestaciones de ley", "Capacitaciones"],
    createdAt: new Date('2024-01-08')
  },
  {
    id: '9',
    title: "Lavaloza",
    location: "Cancún, México",
    salary: "$8,600 MXN",
    isNew: true,
    tags: ["Sin experiencia", "Comedor incluido"],
    createdAt: new Date('2024-01-07')
  },
  {
    id: '10',
    title: "Gerente de restaurante",
    location: "Ciudad de México, México",
    salary: "$17,000 MXN",
    featured: true,
    tags: ["Prestaciones superiores", "Crecimiento interno"],
    createdAt: new Date('2024-01-06')
  },
  {
    id: '11',
    title: "Encargado de turno",
    location: "León, México",
    salary: "$13,000 MXN",
    tags: ["Experiencia mínima 2 años", "Capacitaciones", "Prestaciones de ley"],
    createdAt: new Date('2024-01-05')
  },
  {
    id: '12',
    title: "Panadero",
    location: "Oaxaca, México",
    salary: "$11,000 MXN",
    tags: ["Turno matutino", "Comedor incluido"],
    createdAt: new Date('2024-01-04')
  },
  {
    id: '13',
    title: "Barback",
    location: "Puerto Vallarta, México",
    salary: "$8,200 MXN",
    tags: ["Sin experiencia", "Transporte nocturno", "Uniforme sin costo"],
    createdAt: new Date('2024-01-03')
  },
  {
    id: '14',
    title: "Chef Ejecutivo",
    location: "Ciudad de México, México",
    salary: "$25,000 MXN",
    featured: true,
    tags: ["Prestaciones superiores", "Capacitaciones", "Crecimiento interno"],
    createdAt: new Date('2024-01-02')
  },
  {
    id: '15',
    title: "Repartidor",
    location: "Guadalajara, México",
    salary: "$8,700 MXN",
    isNew: true,
    tags: ["Licencia vigente", "Propinas diarias"],
    createdAt: new Date('2024-01-01')
  }
]

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const location = searchParams.get('location')
    const search = searchParams.get('search')

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }

    let jobsData = []
    let total = 0

    try {
      // Try to fetch from database first
      let query = db.select().from(jobs).where(eq(jobs.isActive, true))

      // Apply search filter if provided
      if (search) {
        query = query.where(
          // Use OR condition for title and location search
          sql`${jobs.title} ILIKE ${`%${search}%`} OR ${jobs.location} ILIKE ${`%${search}%`}`
        )
      }

      // Apply location filter if provided
      if (location) {
        query = query.where(sql`${jobs.location} ILIKE ${`%${location}%`}`)
      }

      // Get total count for pagination
      const countQuery = await db.select({ count: count() }).from(jobs).where(eq(jobs.isActive, true))
      total = countQuery[0]?.count || 0

      if (total > 0) {
        // Fetch paginated results from database
        const offset = (page - 1) * limit
        const dbJobs = await query
          .orderBy(desc(jobs.createdAt))
          .limit(limit)
          .offset(offset)

        // Transform database results to match expected format
        jobsData = dbJobs.map(job => ({
          id: job.id,
          title: job.title,
          location: job.location,
          salary: job.salary,
          featured: job.featured,
          isNew: job.isNew,
          tags: job.tags || [],
          createdAt: job.createdAt
        }))
      }
    } catch (dbError) {
      console.error('Database error, falling back to static data:', dbError)
      // Fall back to static data if database fails
      total = 0
    }

    // If no data from database, use static data
    if (total === 0) {
      let filteredJobs = [...staticJobs]

      // Apply filters to static data
      if (location) {
        filteredJobs = filteredJobs.filter(job => 
          job.location.toLowerCase().includes(location.toLowerCase())
        )
      }

      if (search) {
        filteredJobs = filteredJobs.filter(job =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.location.toLowerCase().includes(search.toLowerCase())
        )
      }

      // Sort by creation date (newest first)
      filteredJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      // Calculate pagination for static data
      total = filteredJobs.length
      const offset = (page - 1) * limit
      jobsData = filteredJobs.slice(offset, offset + limit)
    }

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      jobs: jobsData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}