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
      {/* CTA Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            ¿Listo para el futuro del empleo en gastronomía?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a nuestra lista de espera y sé de los primeros en acceder a las mejores oportunidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={scrollToWaitlist}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              Buscar Empleo
            </Button>
            <Button 
              onClick={scrollToWaitlist}
              variant="outline" 
              size="lg"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Publicar Empleo
            </Button>
          </div>
        </div>

        {/* Footer Info Section */}
        <div className="border-t border-gray-800 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Logo and Tagline */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-4">
                <img 
                  src="/logos/TACO (1).svg" 
                  alt="TACO logo" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <p className="text-gray-300 text-sm">
                Conectando talento con oportunidades en gastronomía
              </p>
            </div>

            {/* Navigation Links */}
            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Empleos
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Empresas
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Recursos
                </Link>
              </div>
            </div>

            {/* Contact and Social */}
            <div className="text-center lg:text-right">
              <div className="mb-4">
                <div className="flex items-center justify-center lg:justify-end space-x-2 text-sm text-gray-300 mb-4">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:sebi@tacoempleos.com.mx" className="hover:text-white transition-colors">
                    sebi@tacoempleos.com.mx
                  </a>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="X (Twitter)">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright and Legal Links */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-4 md:mb-0">
              © 2025 Taco Empleos — 
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacidad
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                Términos
              </Link>
              <span className="text-gray-600">|</span>
              <a href="/sitemap.xml" className="hover:text-white transition-colors">
                Sitemap
              </a>
              <span className="text-gray-600">|</span>
              <a href="#" className="hover:text-white transition-colors">
                Ayuda
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}