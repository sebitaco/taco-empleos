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
<header className="border-b bg-white sticky top-0 z-50">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      <Link href="/" className="flex items-center">
        {/* keep wrapper height ≤ header height */}
        <div className="flex items-center justify-start">
          <img
            src="/logos/Running Fest (5).svg"
            alt="Tacoempleos"
            className="h-14 w-64 object-contain"
          />
        </div>
      </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#jobs" className="text-gray-600 hover:text-primary transition-colors">
              Empleos
            </Link>
            <Link href="#companies" className="text-gray-600 hover:text-primary transition-colors">
              Empresas
            </Link>
            <Link href="#resources" className="text-gray-600 hover:text-primary transition-colors">
              Recursos
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
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
    </header>
  )
}