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
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-32 h-32 rounded-lg flex items-center justify-center">
                <img 
                  src="/logos/TACO (1).svg" 
                  alt="Logo" 
                  className="w-32 h-32 object-contain"
                />
              </div>
            </div>
            <p className="text-gray-300 mb-6 text-sm">
              La plataforma líder para conectar talento con oportunidades 
              en la industria gastronómica en México.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Resources & Contact - Right Side */}
          <div className="text-right">
            <h3 className="font-semibold text-lg mb-4">Recursos</h3>
            <ul className="space-y-2 mb-6">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>

            <div className="space-y-3">
              <div className="flex items-center justify-end space-x-2 text-sm text-gray-300">
                <Mail className="w-4 h-4" />
                <a href="mailto:sebi@tacoempleos.com.mx" className="hover:text-white transition-colors">
                  sebi@tacoempleos.com.mx
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-800 rounded-xl p-8 mb-12 text-center">
          <h3 className="text-2xl font-bold mb-4">
            ¿Listo para el futuro del empleo en gastronomía?
          </h3>
          <p className="text-gray-300 mb-6">
            Únete a nuestra lista de espera y sé de los primeros en acceder 
            a las mejores oportunidades laborales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={scrollToWaitlist}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              Buscar Trabajo
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

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Taco Empleos. Todos los derechos reservados.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacidad
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Términos
              </Link>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Ayuda
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}