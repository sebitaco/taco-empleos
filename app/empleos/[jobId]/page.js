import { notFound } from 'next/navigation'
import JobDetailView from '@/components/JobDetailView'
import JobDetailClientWrapper from '@/components/JobDetailClientWrapper'

async function getJob(jobId) {
  try {
    // For development, we'll use the static data first
    // Later this will be replaced with actual database call
    const jobs = [
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
        facebookUrl: "https://facebook.com/example-job-post-1"
      },
      // Add more jobs as needed for testing
    ]
    
    const job = jobs.find(j => j.id === jobId)
    return job || null
  } catch (error) {
    console.error('Error fetching job:', error)
    return null
  }
}

export async function generateMetadata({ params }) {
  const job = await getJob(params.jobId)
  
  if (!job) {
    return {
      title: 'Trabajo no encontrado | TacoEmpleos',
    }
  }

  return {
    title: `${job.title} - ${job.location} | TacoEmpleos`,
    description: `Trabajo de ${job.title} en ${job.location}. Salario: ${job.salary}. Encuentra más oportunidades laborales en TacoEmpleos.`,
    openGraph: {
      title: `${job.title} - ${job.location}`,
      description: `Salario: ${job.salary}. ${job.tags.slice(0, 3).join(', ')}`,
      type: 'website',
    },
  }
}

export default async function JobDetailPage({ params }) {
  const job = await getJob(params.jobId)

  if (!job) {
    notFound()
  }

  return <JobDetailClientWrapper job={job} jobId={params.jobId} />
}