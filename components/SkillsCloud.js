'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

const SPECIALTIES = [
  "Mesero", "Cocinero", "Barista", "Hostess", "Lavaloza", "Chef", "Bartender", 
  "Cajero", "Gerente", "Ayudante", "Recepcionista", "Capitán", "Sommelier", 
  "Panadero", "Pastelero", "Steward", "Garrotero", "Expeditador", "Lavatrastes", 
  "Cocinero de Preparación", "Cocinero de Línea", "Parrillero", "Salsero", "Garde Manger", "Tournant", 
  "Commis", "Maître", "Conserje", "Valet", "Ama de Llaves"
]

// Lightweight slugify function
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with dash
    .replace(/-+/g, '-') // Collapse multiple dashes
    .replace(/^-|-$/g, '') // Remove leading/trailing dashes
}

export default function SkillsCloud() {
  return (
    <section className="px-4 py-16 md:py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-6xl text-center">
        <h1 className="text-3xl/tight md:text-5xl font-bold tracking-tight text-slate-900">
          Restaurantes en México<br />
          buscan estas especialidades
        </h1>
        <p className="mt-3 text-slate-600 md:text-lg">
          Explora oportunidades por rol y experiencia.
        </p>

        <div 
          className="mt-10 md:mt-12 flex flex-wrap justify-center gap-3 md:gap-4"
          role="list"
          aria-label="Especialidades"
        >
          {SPECIALTIES.map((specialty) => (
            <Link
              key={specialty}
              href={`/empleos?especialidad=${slugify(specialty)}`}
              role="listitem"
              className="rounded-full px-3.5 md:px-4 py-2 text-sm md:text-base font-medium bg-blue-50 text-slate-700 ring-1 ring-inset ring-blue-200 shadow-sm transition hover:bg-white hover:ring-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              {specialty}
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Button 
            asChild
            variant="default" 
            className="h-11 px-6"
          >
            <Link href="/empleos">Ver todos los empleos</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}