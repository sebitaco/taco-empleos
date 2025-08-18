'use client'

const skills = [
  { name: "Mesero", count: 156, popular: true },
  { name: "Cocinero", count: 89, popular: true },
  { name: "Barista", count: 67, popular: true },
  { name: "Hostess", count: 45, popular: false },
  { name: "Lavaloza", count: 78, popular: false },
  { name: "Chef", count: 34, popular: true },
  { name: "Bartender", count: 52, popular: true },
  { name: "Cajero", count: 91, popular: false },
  { name: "Gerente", count: 23, popular: true },
  { name: "Ayudante", count: 112, popular: false },
  { name: "Recepcionista", count: 38, popular: false },
  { name: "Capitán", count: 19, popular: false },
  { name: "Sommelier", count: 8, popular: false },
  { name: "Panadero", count: 27, popular: false },
  { name: "Pastelero", count: 21, popular: false },
  { name: "Steward", count: 43, popular: false },
  { name: "Runner", count: 56, popular: false },
  { name: "Expediter", count: 15, popular: false },
  { name: "Dishwasher", count: 73, popular: false },
  { name: "Prep Cook", count: 41, popular: false },
  { name: "Line Cook", count: 62, popular: false },
  { name: "Grill Cook", count: 29, popular: false },
  { name: "Saucier", count: 12, popular: false },
  { name: "Garde Manger", count: 9, popular: false },
  { name: "Tournant", count: 7, popular: false },
  { name: "Commis", count: 18, popular: false },
  { name: "Maître", count: 14, popular: false },
  { name: "Concierge", count: 16, popular: false },
  { name: "Valet", count: 22, popular: false },
  { name: "Housekeeper", count: 85, popular: false }
]

export default function SkillsCloud() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explora por Especialidad
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra oportunidades según tu experiencia y habilidades. 
            Desde puestos de entrada hasta posiciones de liderazgo.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill, index) => (
              <button
                key={skill.name}
                disabled
className={`
                  inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  hover:scale-105 hover:shadow-md cursor-pointer
                  ${skill.popular 
                    ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary'
                  }
                  ${skill.count > 100 ? 'text-base px-6 py-3' : ''}
                  ${skill.count > 80 ? 'font-semibold' : ''}
                `}
              >
                {skill.name}
              </button>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="flex items-center justify-center space-x-6 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-gray-600">Más demandados</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white border border-gray-200 rounded-full"></div>
                <span className="text-gray-600">Disponibles</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}