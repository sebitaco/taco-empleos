import { NextResponse } from 'next/server'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { jobs } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

const client = postgres(connectionString)
const db = drizzle(client)

export async function GET(request, { params }) {
  try {
    const { jobId } = params

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // For now, return static data until we have actual job data in the database
    // Later this will be replaced with actual database query:
    // const job = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1)
    
    const staticJobs = [
      {
        id: '1',
        title: "Mesero",
        location: "Ciudad de México, México",
        salary: "$9,200 MXN",
        featured: true,
        tags: ["Propinas diarias", "Comedor incluido", "Uniforme sin costo"],
        bodyContent: `Se busca mesero con experiencia para restaurante establecido en zona céntrica de la Ciudad de México.

**Responsabilidades:**
• Atender a los clientes de manera profesional y cordial
• Tomar órdenes y servir alimentos y bebidas
• Mantener las mesas limpias y ordenadas
• Colaborar con el equipo de cocina y administración

**Requisitos:**
• Experiencia mínima de 6 meses en posiciones similares
• Excelente actitud de servicio al cliente
• Disponibilidad de horarios rotativos
• Presentación impecable

**Ofrecemos:**
• Sueldo competitivo de $9,200 MXN mensuales
• Propinas diarias
• Comedor incluido
• Uniforme sin costo
• Prestaciones de ley
• Ambiente de trabajo agradable`,
        facebookUrl: "https://facebook.com/example-job-post-1",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: "Garrotero",
        location: "Guadalajara, México",
        salary: "$8,300 MXN",
        tags: ["Comedor incluido", "Descanso entre semana"],
        bodyContent: `Buscamos garrotero responsable para unirse a nuestro equipo en Guadalajara.

**Responsabilidades:**
• Limpiar y preparar mesas para los clientes
• Asistir a los meseros en el servicio
• Mantener el orden y limpieza del área de trabajo
• Colaborar en tareas generales del restaurante

**Requisitos:**
• No se requiere experiencia previa
• Actitud positiva y ganas de aprender
• Disponibilidad de horarios
• Responsabilidad y puntualidad

**Ofrecemos:**
• Sueldo de $8,300 MXN mensuales
• Comedor incluido
• Descanso entre semana
• Capacitación completa
• Oportunidades de crecimiento`,
        facebookUrl: "https://facebook.com/example-job-post-2",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    const job = staticJobs.find(j => j.id === jobId)

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    if (!job.isActive) {
      return NextResponse.json(
        { error: 'Job is no longer active' },
        { status: 410 }
      )
    }

    return NextResponse.json(job)

  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}