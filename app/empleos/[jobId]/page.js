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
        facebookUrl: "https://facebook.com/example-job-post-2"
      },
      {
        id: '3',
        title: "Hostess",
        location: "Monterrey, México",
        salary: "$9,600 MXN",
        isNew: true,
        tags: ["Prestaciones de ley", "Capacitaciones", "Uniforme sin costo"],
        bodyContent: `Restaurante de alta cocina busca hostess para recepción de clientes en Monterrey.

**Responsabilidades:**
• Recibir y dar la bienvenida a los clientes
• Gestionar reservaciones y lista de espera
• Coordinar con el equipo de servicio
• Mantener la zona de recepción organizada

**Requisitos:**
• Experiencia en atención al cliente
• Excelente presentación personal
• Habilidades de comunicación
• Disponibilidad de fines de semana

**Ofrecemos:**
• Salario competitivo de $9,600 MXN
• Prestaciones de ley
• Capacitaciones continuas
• Uniforme sin costo
• Ambiente profesional`,
        facebookUrl: "https://facebook.com/example-job-post-3"
      },
      {
        id: '4',
        title: "Cocinero A",
        location: "Ciudad de México, México",
        salary: "$12,000 MXN",
        featured: true,
        tags: ["Experiencia mínima 2 años", "Comedor incluido", "Crecimiento interno"],
        bodyContent: `Restaurante italiano busca cocinero A con experiencia en cocina mediterránea.

**Responsabilidades:**
• Preparar platillos según recetas establecidas
• Mantener estándares de calidad y presentación
• Supervisar preparación de ingredientes
• Colaborar con el chef ejecutivo

**Requisitos:**
• Mínimo 2 años de experiencia en cocina
• Conocimiento de técnicas culinarias
• Capacidad para trabajar bajo presión
• Disponibilidad de horarios rotativos

**Ofrecemos:**
• Sueldo de $12,000 MXN mensuales
• Comedor incluido
• Oportunidades de crecimiento interno
• Capacitación especializada
• Prestaciones superiores`,
        facebookUrl: "https://facebook.com/example-job-post-4"
      },
      {
        id: '5',
        title: "Cocinero B",
        location: "Tijuana, México",
        salary: "$10,000 MXN",
        tags: ["Prestaciones de ley", "Capacitaciones"],
        bodyContent: `Se busca cocinero B para cocina de restaurante familiar en Tijuana.

**Responsabilidades:**
• Preparar y cocinar alimentos
• Mantener limpieza en estación de trabajo
• Asistir al cocinero A en preparaciones
• Inventario de ingredientes

**Requisitos:**
• Experiencia básica en cocina
• Conocimiento de normas de higiene
• Disponibilidad de horarios
• Trabajo en equipo

**Ofrecemos:**
• Salario de $10,000 MXN mensuales
• Prestaciones de ley
• Capacitaciones constantes
• Comedor incluido
• Ambiente familiar`,
        facebookUrl: "https://facebook.com/example-job-post-5"
      },
      {
        id: '6',
        title: "Ayudante de cocina",
        location: "Puebla, México",
        salary: "$8,800 MXN",
        tags: ["Sin experiencia", "Comedor incluido", "Uniforme sin costo"],
        bodyContent: `Oportunidad para ayudante de cocina sin experiencia en restaurante de Puebla.

**Responsabilidades:**
• Preparar ingredientes básicos
• Lavar y desinfectar utensilios
• Mantener orden en cocina
• Apoyo general al equipo

**Requisitos:**
• Sin experiencia necesaria
• Ganas de aprender
• Disponibilidad completa
• Buena actitud

**Ofrecemos:**
• Sueldo inicial de $8,800 MXN
• Comedor incluido
• Uniforme sin costo
• Capacitación completa
• Oportunidad de crecimiento`,
        facebookUrl: "https://facebook.com/example-job-post-6"
      },
      {
        id: '7',
        title: "Bartender",
        location: "Playa del Carmen, México",
        salary: "$9,100 MXN",
        tags: ["Turno nocturno", "Propinas diarias", "Transporte nocturno"],
        bodyContent: `Bar de playa busca bartender con experiencia en coctelería tropical.

**Responsabilidades:**
• Preparar cócteles y bebidas
• Atender clientes en la barra
• Mantener inventario de licores
• Crear ambiente festivo

**Requisitos:**
• Experiencia en coctelería
• Conocimiento de bebidas tropicales
• Inglés básico (turismo)
• Disponibilidad nocturna

**Ofrecemos:**
• Salario base de $9,100 MXN
• Propinas diarias excelentes
• Transporte nocturno
• Ambiente playero
• Temporada alta con bonos`,
        facebookUrl: "https://facebook.com/example-job-post-7"
      },
      {
        id: '8',
        title: "Cajero",
        location: "Querétaro, México",
        salary: "$8,400 MXN",
        tags: ["Prestaciones de ley", "Capacitaciones"],
        bodyContent: `Restaurante familiar busca cajero responsable en Querétaro.

**Responsabilidades:**
• Manejar caja registradora
• Procesar pagos y cambios
• Atender clientes en mostrador
• Cuadre de caja diario

**Requisitos:**
• Experiencia en manejo de dinero
• Habilidades matemáticas básicas
• Honestidad comprobable
• Atención al detalle

**Ofrecemos:**
• Salario de $8,400 MXN mensuales
• Prestaciones de ley
• Capacitación en sistemas
• Horarios matutinos
• Ambiente tranquilo`,
        facebookUrl: "https://facebook.com/example-job-post-8"
      },
      {
        id: '9',
        title: "Lavaloza",
        location: "Cancún, México",
        salary: "$8,600 MXN",
        isNew: true,
        tags: ["Sin experiencia", "Comedor incluido"],
        bodyContent: `Hotel resort busca lavaloza para restaurante principal en Cancún.

**Responsabilidades:**
• Lavar platos, vasos y utensilios
• Mantener limpia área de lavado
• Clasificar vajilla y cristalería
• Apoyo en limpieza general

**Requisitos:**
• Sin experiencia necesaria
• Disponibilidad completa
• Resistencia física
• Trabajo en equipo

**Ofrecemos:**
• Sueldo de $8,600 MXN mensuales
• Comedor incluido
• Prestaciones hoteleras
• Ambiente resort
• Oportunidades de crecimiento`,
        facebookUrl: "https://facebook.com/example-job-post-9"
      },
      {
        id: '10',
        title: "Gerente de restaurante",
        location: "Ciudad de México, México",
        salary: "$17,000 MXN",
        featured: true,
        tags: ["Prestaciones superiores", "Crecimiento interno"],
        bodyContent: `Cadena de restaurantes busca gerente con experiencia en administración gastronómica.

**Responsabilidades:**
• Supervisar operaciones diarias
• Gestionar personal de servicio
• Control de inventarios y costos
• Atención a clientes VIP

**Requisitos:**
• Experiencia gerencial mínima 3 años
• Licenciatura en administración
• Liderazgo de equipos
• Conocimiento de sistemas POS

**Ofrecemos:**
• Salario de $17,000 MXN mensuales
• Prestaciones superiores
• Bonos por resultados
• Oportunidades de crecimiento
• Capacitación ejecutiva`,
        facebookUrl: "https://facebook.com/example-job-post-10"
      },
      {
        id: '11',
        title: "Encargado de turno",
        location: "León, México",
        salary: "$13,000 MXN",
        tags: ["Experiencia mínima 2 años", "Capacitaciones", "Prestaciones de ley"],
        bodyContent: `Restaurante de comida rápida busca encargado de turno en León.

**Responsabilidades:**
• Supervisar personal de turno
• Garantizar calidad del servicio
• Manejo de efectivo
• Reportes de ventas

**Requisitos:**
• 2 años de experiencia en supervisión
• Conocimiento de fast food
• Habilidades de liderazgo
• Disponibilidad de horarios

**Ofrecemos:**
• Sueldo de $13,000 MXN mensuales
• Capacitaciones constantes
• Prestaciones de ley
• Bonos de productividad
• Plan de carrera`,
        facebookUrl: "https://facebook.com/example-job-post-11"
      },
      {
        id: '12',
        title: "Panadero",
        location: "Oaxaca, México",
        salary: "$11,000 MXN",
        tags: ["Turno matutino", "Comedor incluido"],
        bodyContent: `Panadería artesanal busca panadero con experiencia en panes tradicionales.

**Responsabilidades:**
• Preparar masas y panes
• Horneado y control de temperatura
• Decoración de productos
• Control de calidad

**Requisitos:**
• Experiencia en panadería
• Conocimiento de recetas tradicionales
• Disponibilidad matutina (4:00 AM)
• Creatividad culinaria

**Ofrecemos:**
• Salario de $11,000 MXN mensuales
• Turno matutino estable
• Comedor incluido
• Producto para casa
• Ambiente artesanal`,
        facebookUrl: "https://facebook.com/example-job-post-12"
      },
      {
        id: '13',
        title: "Barback",
        location: "Puerto Vallarta, México",
        salary: "$8,200 MXN",
        tags: ["Sin experiencia", "Transporte nocturno", "Uniforme sin costo"],
        bodyContent: `Bar nocturno en zona hotelera busca barback para apoyo en barra.

**Responsabilidades:**
• Abastecer barra con ingredientes
• Limpiar y organizar área de bar
• Lavar cristalería
• Apoyo general al bartender

**Requisitos:**
• Sin experiencia necesaria
• Disponibilidad nocturna
• Buena condición física
• Actitud de servicio

**Ofrecemos:**
• Salario de $8,200 MXN mensuales
• Transporte nocturno incluido
• Uniforme sin costo
• Propinas adicionales
• Ambiente de playa`,
        facebookUrl: "https://facebook.com/example-job-post-13"
      },
      {
        id: '14',
        title: "Chef Ejecutivo",
        location: "Ciudad de México, México",
        salary: "$25,000 MXN",
        featured: true,
        tags: ["Prestaciones superiores", "Capacitaciones", "Crecimiento interno"],
        bodyContent: `Restaurante de alta cocina busca chef ejecutivo para liderar equipo culinario.

**Responsabilidades:**
• Dirigir equipo de cocina
• Crear y desarrollar menús
• Control de costos y calidad
• Capacitación de personal

**Requisitos:**
• Título en gastronomía
• Mínimo 5 años de experiencia ejecutiva
• Liderazgo comprobado
• Creatividad culinaria

**Ofrecemos:**
• Salario ejecutivo de $25,000 MXN
• Prestaciones superiores completas
• Capacitaciones internacionales
• Participación en utilidades
• Reconocimiento gastronómico`,
        facebookUrl: "https://facebook.com/example-job-post-14"
      },
      {
        id: '15',
        title: "Repartidor",
        location: "Guadalajara, México",
        salary: "$8,700 MXN",
        isNew: true,
        tags: ["Licencia vigente", "Propinas diarias"],
        bodyContent: `Servicio de delivery busca repartidor con motocicleta propia en Guadalajara.

**Responsabilidades:**
• Entregar pedidos a domicilio
• Mantener calidad de alimentos
• Atención cordial a clientes
• Reporte de entregas

**Requisitos:**
• Licencia de manejo vigente
• Motocicleta propia
• Conocimiento de la ciudad
• Disponibilidad completa

**Ofrecemos:**
• Salario base de $8,700 MXN
• Propinas diarias excelentes
• Gasolina incluida
• Seguro de motocicleta
• Bonos por puntualidad`,
        facebookUrl: "https://facebook.com/example-job-post-15"
      }
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