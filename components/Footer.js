'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist')
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        
        {/* 1. CTA Block - Protagonist */}
        <div className="py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            ¿Listo para el futuro del empleo en gastronomía?
          </h2>
          <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
            Únete a nuestra lista de espera y sé de los primeros en acceder a las mejores oportunidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={scrollToWaitlist}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
            >
              Buscar Empleo
            </Button>
            <Button 
              onClick={scrollToWaitlist}
              variant="outline" 
              size="lg"
              className="border-2 border-gray-400 text-gray-200 hover:bg-gray-700 hover:border-gray-300 hover:text-white font-semibold px-8 py-3 focus:ring-2 focus:ring-gray-400 focus:outline-none transition-all"
            >
              Publicar Empleo
            </Button>
          </div>
        </div>

        {/* 2. Information Block - 3 Columns */}
        <div className="border-t border-gray-700 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Left Column: Logo + Tagline */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-2">
                <img 
                  src="/logos/TACO (1).svg" 
                  alt="TACO logo" 
                  className="w-12 h-12 object-contain mr-3"
                />
                <span className="text-gray-300 text-sm">
                  Conectando talento con oportunidades en gastronomía
                </span>
              </div>
            </div>

            {/* Center Column: Navigation */}
            <div className="text-center">
              <nav className="flex flex-wrap justify-center gap-6">
                <Link 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium focus:outline-none focus:text-white"
                >
                  Empleos
                </Link>
                <Link 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium focus:outline-none focus:text-white"
                >
                  Empresas
                </Link>
                <Link 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium focus:outline-none focus:text-white"
                >
                  Recursos
                </Link>
              </nav>
            </div>

            {/* Right Column: Contact + Social */}
            <div className="text-center md:text-right">
              <div className="flex flex-col md:flex-row md:justify-end items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a 
                    href="mailto:sebi@tacoempleos.com.mx" 
                    className="text-gray-300 hover:text-white transition-colors text-sm focus:outline-none focus:text-white"
                  >
                    sebi@tacoempleos.com.mx
                  </a>
                </div>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:text-white" 
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:text-white" 
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:text-white" 
                    aria-label="X (Twitter)"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:text-white" 
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Legal Section - Single Line */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <div className="mb-3 md:mb-0">
              © 2025 Taco Empleos
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/privacy" 
                className="hover:text-gray-300 transition-colors focus:outline-none focus:text-gray-300"
              >
                Privacidad
              </Link>
              <span className="text-gray-600">•</span>
              <Link 
                href="/terms" 
                className="hover:text-gray-300 transition-colors focus:outline-none focus:text-gray-300"
              >
                Términos
              </Link>
              <span className="text-gray-600">•</span>
              <a 
                href="/sitemap.xml" 
                className="hover:text-gray-300 transition-colors focus:outline-none focus:text-gray-300"
              >
                Sitemap
              </a>
              <span className="text-gray-600">•</span>
              <a 
                href="#" 
                className="hover:text-gray-300 transition-colors focus:outline-none focus:text-gray-300"
              >
                Ayuda
              </a>
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  )
}