'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trackEvent } from '@/components/Analytics'
import { MapPin, Search } from 'lucide-react'
import Image from 'next/image'

export default function HeroSearch() {
  const scrollToWaitlist = () => {
    trackEvent('cta_click', { section: 'hero' })
    const waitlistSection = document.getElementById('waitlist')
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="bg-white py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            La bolsa de trabajo <br className="hidden sm:block" />
            <span className="text-primary">gastronómica</span> de México
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Tacoempleos conecta a trabajadores gastronómicos con restaurantes, bares y cafés
          </p>
          <Button 
            onClick={scrollToWaitlist}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Únete a la Lista de Espera
          </Button>
        </div>
      </div>
    </section>
  )
}