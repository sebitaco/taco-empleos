'use client'

import { Button } from '@/components/ui/button'
import { Users, Target, Zap } from 'lucide-react'

export default function EmployerCTA() {
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist')
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 lg:p-12 text-white">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  ¿Necesitas contratar personal?
                </h2>
                <p className="text-xl text-blue-100 mb-6">
                  Conecta con los mejores profesionales de hostelería en México
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4" />
                    </div>
                    <span className="text-blue-100">
                      Candidatos pre-evaluados y verificados
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-blue-100">
                      Acceso a más de 10,000 profesionales activos
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-blue-100">
                      Contratación hasta 3x más rápida
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={scrollToWaitlist}
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Publicar mi empleo
                </Button>
              </div>

              <div className="hidden lg:block">
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-2">🎯</div>
                      <h3 className="font-semibold text-lg">Panel de Reclutamiento</h3>
                      <p className="text-blue-200 text-sm">Vista previa de la plataforma</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Meseros disponibles</span>
                          <span className="text-xs bg-green-400 text-green-900 px-2 py-1 rounded-full">
                            +15 nuevos
                          </span>
                        </div>
                        <div className="text-2xl font-bold">847</div>
                      </div>
                      
                      <div className="bg-white/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Cocineros activos</span>
                          <span className="text-xs bg-blue-400 text-blue-900 px-2 py-1 rounded-full">
                            Verificados
                          </span>
                        </div>
                        <div className="text-2xl font-bold">532</div>
                      </div>
                      
                      <div className="bg-white/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Tiempo promedio</span>
                          <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full">
                            Contratación
                          </span>
                        </div>
                        <div className="text-2xl font-bold">2.3 días</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}