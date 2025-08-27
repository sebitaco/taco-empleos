'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react'

export default function Footer() {

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        
        {/* Footer with Two Levels */}
        <div className="border-t border-gray-700">
          
          {/* Upper Level: Brand Information */}
          <div className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Logo + Tagline */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start">
                  <img 
                    src="/logos/TACO (1).svg" 
                    alt="TACO logo" 
                    className="w-10 h-10 object-contain mr-3"
                  />
                  <span className="text-gray-300 text-sm">
                    Conectando talento con oportunidades en gastronomía
                  </span>
                </div>
              </div>

              {/* CEO Contact */}
              <div className="text-center">
                <div className="text-gray-300 text-sm">
                  <p className="mb-1">¿Tienes dudas o preguntas?</p>
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Escríbele directo al CEO:</span>
                    <a 
                      href="mailto:sebi@tacoempleos.com.mx" 
                      className="text-white hover:text-orange-300 transition-colors font-medium focus:outline-none focus:text-orange-300"
                    >
                      sebi@tacoempleos.com.mx
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="text-center md:text-right">
                <div className="flex justify-center md:justify-end space-x-4">
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

          {/* Lower Level: Legal */}
          <div className="border-t border-gray-700 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
              <div className="mb-3 md:mb-0">
                © 2025 Taco Empleos
              </div>
              <div className="flex items-center space-x-3">
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
              </div>
            </div>
          </div>

        </div>
        
      </div>
    </footer>
  )
}