import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, ArrowRight } from 'lucide-react'

const articles = [
  {
    id: 1,
    title: "Cómo destacar en una entrevista para mesero",
    excerpt: "Tips esenciales para impresionar a los reclutadores y conseguir el trabajo de tus sueños en el sector gastronómico.",
    image: "🎯",
    category: "Consejos",
    readTime: "5 min",
    date: "Hace 2 días"
  },
  {
    id: 2,
    title: "Tendencias salariales en hostelería 2024",
    excerpt: "Análisis completo de los salarios actuales en restaurantes, hoteles y cafeterías en las principales ciudades de México.",
    image: "📊",
    category: "Tendencias",
    readTime: "8 min",
    date: "Hace 1 semana"
  },
  {
    id: 3,
    title: "Certificaciones que aumentan tu valor",
    excerpt: "Descubre qué certificaciones y cursos pueden impulsar tu carrera en la industria de alimentos y bebidas.",
    image: "🏆",
    category: "Desarrollo",
    readTime: "6 min",
    date: "Hace 3 días"
  },
  {
    id: 4,
    title: "Guía completa del barista profesional",
    excerpt: "Todo lo que necesitas saber para convertirte en un barista experto, desde técnicas básicas hasta latte art avanzado.",
    image: "☕",
    category: "Guías",
    readTime: "12 min",
    date: "Hace 5 días"
  },
  {
    id: 5,
    title: "Derechos laborales en restaurantes",
    excerpt: "Conoce tus derechos como trabajador del sector gastronómico en México y cómo protegerte.",
    image: "⚖️",
    category: "Legal",
    readTime: "7 min",
    date: "Hace 1 semana"
  },
  {
    id: 6,
    title: "Cómo negociar un aumento de sueldo",
    excerpt: "Estrategias efectivas para negociar mejores condiciones laborales y salarios en la industria hotelera.",
    image: "💰",
    category: "Consejos",
    readTime: "9 min",
    date: "Hace 4 días"
  }
]

export default function Articles() {
  return (
    <section id="resources" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Recursos y Consejos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Impulsa tu carrera con nuestros artículos especializados. 
            Desde consejos de entrevistas hasta tendencias de la industria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center text-2xl">
                    {article.image}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                </div>

                <h3 className="font-semibold text-gray-900 mb-3 text-lg leading-tight">
                  {article.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {article.readTime}
                    </div>
                    <span>{article.date}</span>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-primary hover:text-primary/80"
                  disabled
                >
                  Leer más
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" disabled>
            Ver todos los artículos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}