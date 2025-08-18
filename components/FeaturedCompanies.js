import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const companies = [
  {
    id: 1,
    name: "Grupo Pujol",
    logo: "🍽️",
    description: "Red de restaurantes de alta gastronomía",
    openRoles: 8,
    category: "Fine Dining"
  },
  {
    id: 2,
    name: "Starbucks México",
    logo: "☕",
    description: "Cafeterías premium en todo el país",
    openRoles: 45,
    category: "Cafeterías"
  },
  {
    id: 3,
    name: "Grupo Rosetta",
    logo: "🥘",
    description: "Restaurantes conceptuales únicos",
    openRoles: 12,
    category: "Casual Dining"
  },
  {
    id: 4,
    name: "Hilton Hotels",
    logo: "🏨",
    description: "Cadena hotelera internacional",
    openRoles: 32,
    category: "Hotelería"
  },
  {
    id: 5,
    name: "Grupo Alsea",
    logo: "🍔",
    description: "McDonald's, Burger King, Domino's",
    openRoles: 156,
    category: "Quick Service"
  },
  {
    id: 6,
    name: "Casa de Toño",
    logo: "🌮",
    description: "Comida mexicana tradicional",
    openRoles: 28,
    category: "Casual Dining"
  },
  {
    id: 7,
    name: "Liverpool Restaurantes",
    logo: "🛍️",
    description: "Restaurantes en centros comerciales",
    openRoles: 19,
    category: "Retail Dining"
  },
  {
    id: 8,
    name: "Marriott México",
    logo: "🌟",
    description: "Hoteles de lujo y resorts",
    openRoles: 67,
    category: "Hotelería"
  },
  {
    id: 9,
    name: "Hard Rock Cafe",
    logo: "🎸",
    description: "Restaurante temático con música",
    openRoles: 15,
    category: "Themed Dining"
  },
  {
    id: 10,
    name: "Grupo Gigante",
    logo: "🛒",
    description: "Supermercados y restaurantes",
    openRoles: 89,
    category: "Retail"
  },
  {
    id: 11,
    name: "Presidente InterContinental",
    logo: "👑",
    description: "Hotel de lujo en Polanco",
    openRoles: 24,
    category: "Luxury Hotels"
  },
  {
    id: 12,
    name: "Vips Restaurants",
    logo: "🥞",
    description: "Restaurantes familiares 24/7",
    openRoles: 73,
    category: "Family Dining"
  }
]

export default function FeaturedCompanies() {
  return (
    <section id="companies" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Empresas Destacadas
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Las mejores empresas de hostelería en México están contratando. 
            Descubre oportunidades en restaurantes, hoteles y cafeterías líderes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                  {company.logo}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {company.name}
                  </h3>
                  <p className="text-xs text-gray-500">{company.category}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {company.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-semibold text-primary">{company.openRoles}</span>
                  <span className="text-gray-500 ml-1">empleos</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled
                  className="text-primary hover:text-primary/80"
                >
                  Ver roles
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" disabled>
            Ver todas las empresas
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}