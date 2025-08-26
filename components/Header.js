'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export default function Header() {
  const [recursosDropdownOpen, setRecursosDropdownOpen] = useState(false)

  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist')
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo on the left */}
          <Link href="/" className="flex items-center">
            <img
              src="/logos/TACO (1).svg"
              alt="Tacoempleos"
              className="h-32 w-auto object-contain"
              style={{ height: '150px' }}
            />
          </Link>

          {/* Navigation and actions on the right */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="#jobs" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Empleos
              </Link>
              <Link href="#companies" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Empresas
              </Link>
              {/* Recursos dropdown */}
              <div className="relative">
                <button
                  onClick={() => setRecursosDropdownOpen(!recursosDropdownOpen)}
                  onBlur={(e) => {
                    // Cerrar dropdown si el foco sale del contenedor
                    setTimeout(() => {
                      if (!e.currentTarget.contains(document.activeElement)) {
                        setRecursosDropdownOpen(false)
                      }
                    }, 150)
                  }}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  <span>Recursos</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {recursosDropdownOpen && (
                  <div className="absolute top-full mt-2 left-0 bg-white border rounded-lg shadow-lg py-2 w-64 z-50">
                    <Link
                      href="/recursos/calculadora-vacaciones"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setRecursosDropdownOpen(false)}
                    >
                      📅 Calculadora de Vacaciones
                    </Link>
                    <Link
                      href="/recursos/calculadora-aguinaldo"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setRecursosDropdownOpen(false)}
                    >
                      💰 Calculadora de Aguinaldo ISR
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={scrollToWaitlist}
                className="hidden sm:inline-flex"
              >
                Unirse a la Lista
              </Button>
              <Button
                size="sm"
                onClick={scrollToWaitlist}
              >
                Publicar Empleo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}