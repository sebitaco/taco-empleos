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
          <div className="relative h-26 w-40 opacity-60 hover:opacity-100 transition-opacity">
            <img 
              src="/logos/Running Fest (1).svg" 
              alt="Running Fest 1" 
              className="h-full w-full object-fill filter grayscale hover:grayscale-0 transition-all"
            />
          </div>
          <div className="relative h-24 w-42 opacity-60 hover:opacity-100 transition-opacity">
            <img 
              src="/logos/Running Fest (2).svg" 
              alt="Running Fest 2" 
              className="h-full w-full object-fill filter grayscale hover:grayscale-0 transition-all"
            />
          </div>
          <div className="relative h-20 w-40 opacity-60 hover:opacity-100 transition-opacity">
            <img 
              src="/logos/Running Fest (3).svg" 
              alt="Running Fest 3" 
              className="h-full w-full object-fill filter grayscale hover:grayscale-0 transition-all"
            />
          </div>
        </div>

        {/* Job listings */}
        <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
          {jobs.map((job, index) => (
            <div
              key={job.id}
              className={`relative bg-white ${index !== jobs.length - 1 ? 'border-b border-gray-200' : ''} hover:shadow-sm transition-all duration-200`}
            >

              <div className="flex items-center p-6 pr-20">
                {/* Job details - left side */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {job.title}
                  </h3>
                  <div className="text-sm text-gray-600 mb-1">
                    {job.location}
                  </div>
                </div>

                {/* Right side - salary and tags */}
                <div className="flex flex-col items-end space-y-2 ml-6">
                  <div className="text-lg font-bold text-green-600">
                    {job.salary}
                  </div>
                  
                  {/* Tags - stacked rows */}
                  <div className="flex flex-col items-end space-y-1">
                    <div className="flex flex-wrap gap-1 justify-end">
                      {job.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge 
                          key={tagIndex}
                          variant="outline"
                          className="text-xs px-2 py-1 bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {job.tags.length > 3 && (
                      <div className="flex flex-wrap gap-1 justify-end">
                        {job.tags.slice(3).map((tag, tagIndex) => (
                          <Badge 
                            key={tagIndex + 3}
                            variant="outline"
                            className="text-xs px-2 py-1 bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}