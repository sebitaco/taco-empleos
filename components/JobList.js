import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, DollarSign, Filter } from 'lucide-react'

const jobs = [
  {
    id: 1,
    title: "Mesero",
    company: "",
    logo: "",
    location: "Ciudad de México, México",
    salary: "$9,200 MXN",
    featured: true,
    tags: ["Propinas diarias", "Comedor incluido", "Uniforme sin costo"]
  },
  {
    id: 2,
    title: "Garrotero",
    company: "",
    logo: "",
    location: "Guadalajara, México",
    salary: "$8,300 MXN",
    tags: ["Comedor incluido", "Descanso entre semana"]
  },
  {
    id: 3,
    title: "Hostess",
    company: "",
    logo: "",
    location: "Monterrey, México",
    salary: "$9,600 MXN",
    isNew: true,
    tags: ["Prestaciones de ley", "Capacitaciones", "Uniforme sin costo"]
  },
  {
    id: 4,
    title: "Cocinero A",
    company: "",
    logo: "",
    location: "Ciudad de México, México",
    salary: "$12,000 MXN",
    featured: true,
    tags: ["Experiencia mínima 2 años", "Comedor incluido", "Crecimiento interno"]
  },
  {
    id: 5,
    title: "Cocinero B",
    company: "",
    logo: "",
    location: "Tijuana, México",
    salary: "$10,000 MXN",
    tags: ["Prestaciones de ley", "Capacitaciones"]
  },
  {
    id: 6,
    title: "Ayudante de cocina",
    company: "",
    logo: "",
    location: "Puebla, México",
    salary: "$8,800 MXN",
    tags: ["Sin experiencia", "Comedor incluido", "Uniforme sin costo"]
  },
  {
    id: 7,
    title: "Bartender",
    company: "",
    logo: "",
    location: "Playa del Carmen, México",
    salary: "$9,100 MXN",
    tags: ["Turno nocturno", "Propinas diarias", "Transporte nocturno"]
  },
  {
    id: 8,
    title: "Cajero",
    company: "",
    logo: "",
    location: "Querétaro, México",
    salary: "$8,400 MXN",
    tags: ["Prestaciones de ley", "Capacitaciones"]
  },
  {
    id: 9,
    title: "Lavaloza",
    company: "",
    logo: "",
    location: "Cancún, México",
    salary: "$8,600 MXN",
    isNew: true,
    tags: ["Sin experiencia", "Comedor incluido"]
  },
  {
    id: 10,
    title: "Gerente de restaurante",
    company: "",
    logo: "",
    location: "Ciudad de México, México",
    salary: "$17,000 MXN",
    featured: true,
    tags: ["Prestaciones superiores", "Crecimiento interno"]
  },
  {
    id: 11,
    title: "Encargado de turno",
    company: "",
    logo: "",
    location: "León, México",
    salary: "$13,000 MXN",
    tags: ["Experiencia mínima 2 años", "Capacitaciones", "Prestaciones de ley"]
  },
  {
    id: 12,
    title: "Panadero",
    company: "",
    logo: "",
    location: "Oaxaca, México",
    salary: "$11,000 MXN",
    tags: ["Turno matutino", "Comedor incluido"]
  },
  {
    id: 13,
    title: "Barback",
    company: "",
    logo: "",
    location: "Puerto Vallarta, México",
    salary: "$8,200 MXN",
    tags: ["Sin experiencia", "Transporte nocturno", "Uniforme sin costo"]
  },
  {
    id: 14,
    title: "Chef Ejecutivo",
    company: "",
    logo: "",
    location: "Ciudad de México, México",
    salary: "$25,000 MXN",
    featured: true,
    tags: ["Prestaciones superiores", "Capacitaciones", "Crecimiento interno"]
  },
  {
    id: 15,
    title: "Repartidor",
    company: "",
    logo: "",
    location: "Guadalajara, México",
    salary: "$8,700 MXN",
    isNew: true,
    tags: ["Licencia vigente", "Propinas diarias"]
  }
]

export default function JobList() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Stats bar */}
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 mb-2 py-3 border-t border-b border-gray-200">
          <span>Restaurantes que contratan vía TacoEmpleos</span>
        </div>

        {/* Company logos */}
        <div className="flex items-center justify-center gap-8 mb-4 py-2">
          <div className="relative h-16 w-40 opacity-60 hover:opacity-100 transition-opacity">
            <img 
              src="/logos/EL BIFE.svg" 
              alt="EL BIFE" 
              className="h-full w-full object-fill filter grayscale hover:grayscale-0 transition-all"
            />
          </div>
          <div className="relative h-16 w-40 opacity-60 hover:opacity-100 transition-opacity">
            <img 
              src="/logos/Running Fest.svg" 
              alt="Running Fest" 
              className="h-full w-full object-fill filter grayscale hover:grayscale-0 transition-all"
            />
          </div>
          <div className="relative h-16 w-40 opacity-60 hover:opacity-100 transition-opacity">
            <img 
              src="/logos/Running Fest (1).svg" 
              alt="Running Fest 1" 
              className="h-full w-full object-fill filter grayscale hover:grayscale-0 transition-all"
            />
          </div>
          <div className="relative h-16 w-40 opacity-60 hover:opacity-100 transition-opacity">
            <img 
              src="/logos/Running Fest (2).svg" 
              alt="Running Fest 2" 
              className="h-full w-full object-fill filter grayscale hover:grayscale-0 transition-all"
            />
          </div>
          <div className="relative h-16 w-40 opacity-60 hover:opacity-100 transition-opacity">
            <img 
              src="/logos/Running Fest (3).svg" 
              alt="Running Fest 3" 
              className="h-full w-full object-fill filter grayscale hover:grayscale-0 transition-all"
            />
          </div>
        </div>

        {/* Job listings - display only first 10 jobs */}
        <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
          {jobs.slice(0, 10).map((job, index) => (
            <Link
              key={job.id}
              href={`/empleos/${job.id}`}
              className={`relative bg-white block ${index !== 9 ? 'border-b border-gray-200' : ''} hover:shadow-md hover:bg-gray-50 transition-all duration-200 cursor-pointer`}
            >

              <div className="flex flex-col sm:flex-row sm:items-start p-4 sm:p-6">
                {/* Job details - left side */}
                <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                  {/* Position Name - Most prominent */}
                  <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight">
                    {job.title}
                  </h3>
                  
                  {/* Company Name - Second hierarchy */}
                  <div className="text-base font-medium text-gray-700 mb-1">
                    {job.company || 'Empresa confidencial'}
                  </div>
                  
                  {/* Location - Third hierarchy */}
                  <div className="text-sm text-gray-600 mb-2">
                    {job.location}
                  </div>
                  
                  {/* Tags - Limited to 3 on homepage */}
                  <div className="flex flex-wrap gap-1">
                    {job.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge 
                        key={tagIndex}
                        variant="outline"
                        className="text-xs px-2 py-1 bg-white border-blue-200 text-blue-700 hover:bg-blue-50 flex-shrink-0"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {job.tags.length > 3 && (
                      <Badge 
                        variant="outline"
                        className="text-xs px-2 py-1 bg-white border-gray-200 text-gray-600 flex-shrink-0"
                      >
                        +{job.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Right side - salary */}
                <div className="flex flex-col sm:items-end sm:ml-6 flex-shrink-0">
                  <div className="text-xl font-bold text-green-600 mb-1">
                    {job.salary}
                  </div>
                  <div className="text-xs text-gray-500">
                    mensual
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Ver Más Empleos CTA Button */}
        <div className="text-center mt-6">
          <Link href="/trabajos">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors">
              Ver Más Empleos →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}