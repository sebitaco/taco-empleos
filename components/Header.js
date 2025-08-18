'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
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
              <Link href="/recursos/calculadora-vacaciones" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Recursos
              </Link>
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