export default function MarketInfo() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              El Mercado Laboral de Hostelería en México
            </h2>
            <p className="text-xl text-gray-600">
              Una industria en crecimiento con oportunidades infinitas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Crecimiento Sostenido</h3>
                    <p className="text-sm text-gray-600">+12% anual</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  La industria de alimentos y bebidas en México ha mostrado un crecimiento 
                  constante del 12% anual, siendo uno de los sectores más dinámicos del país.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Alta Demanda de Personal</h3>
                    <p className="text-sm text-gray-600">2.5M+ empleos</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  Con más de 2.5 millones de empleos directos, la hostelería es uno de los 
                  principales generadores de empleo en México, especialmente para jóvenes.
                </p>
              </div>
            </div>

            <div className="prose prose-gray max-w-none">
              <div className="bg-white rounded-xl p-8 shadow-sm border">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  ¿Por qué elegir una carrera en hostelería?
                </h4>
                
                <p className="text-gray-700 mb-4">
                  La industria de alimentos y bebidas ofrece un ambiente dinámico y lleno de 
                  oportunidades de crecimiento. Desde puestos de entrada hasta posiciones 
                  ejecutivas, el sector permite desarrollar habilidades transferibles y 
                  construir una carrera sólida.
                </p>

                <p className="text-gray-700 mb-4">
                  México, siendo un destino turístico mundial, presenta oportunidades únicas 
                  en hotelería de lujo, restaurantes gourmet y cadenas internacionales. 
                  Los profesionales capacitados encuentran excelentes condiciones laborales 
                  y oportunidades de crecimiento.
                </p>

                <p className="text-gray-700 mb-4">
                  La flexibilidad de horarios, la posibilidad de trabajar en diferentes 
                  ciudades y la interacción constante con personas de diversas culturas 
                  hacen de la hostelería una opción atractiva para quienes buscan una 
                  carrera dinámica y enriquecedora.
                </p>

                <p className="text-gray-700">
                  Con programas de capacitación continua y un enfoque creciente en la 
                  profesionalización del sector, nunca ha sido mejor momento para iniciar 
                  o desarrollar una carrera en la industria gastronómica mexicana.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">580K+</div>
              <p className="text-gray-600 text-sm">Restaurantes activos</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">45K+</div>
              <p className="text-gray-600 text-sm">Hoteles registrados</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">$18.5K</div>
              <p className="text-gray-600 text-sm">Salario promedio</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">89%</div>
              <p className="text-gray-600 text-sm">Tasa de empleabilidad</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}