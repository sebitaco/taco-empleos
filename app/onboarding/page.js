'use client'

import { useState, useEffect } from 'react'

// Safe Clerk hook - returns default values if Clerk is not available
function useUserSafe() {
  try {
    const { useUser } = require('@clerk/nextjs')
    return useUser()
  } catch {
    return { user: null, isLoaded: true }
  }
}
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Briefcase, CheckCircle } from 'lucide-react'

const cities = [
  "Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Tijuana", 
  "León", "Juárez", "Torreón", "Querétaro", "San Luis Potosí",
  "Mérida", "Mexicali", "Aguascalientes", "Cuernavaca", "Saltillo",
  "Hermosillo", "Culiacán", "Xalapa", "Oaxaca", "Tampico",
  "Veracruz", "Pachuca", "Tlaxcala", "Cancún", "Playa del Carmen"
]

const roles = [
  "Mesero/a", "Cocinero/a", "Barista", "Chef", "Bartender",
  "Hostess/Host", "Capitán de meseros", "Lavaloza", "Ayudante de cocina",
  "Gerente de restaurante", "Supervisor de turno", "Panadero/a",
  "Pastelero/a", "Sommelier", "Recepcionista", "Concierge",
  "Housekeeper", "Steward", "Runner", "Otro"
]

const experienceLevels = [
  "Sin experiencia", "Menos de 1 año", "1-2 años", "3-5 años", 
  "6-10 años", "Más de 10 años"
]

export default function OnboardingPage() {
  const { user, isLoaded } = useUserSafe()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    city: '',
    roleInterest: '',
    experienceLevel: ''
  })

  useEffect(() => {
    // Redirect if not signed in
    if (isLoaded && !user) {
      router.push('/sign-up')
    }
  }, [user, isLoaded, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user || !formData.city || !formData.roleInterest) {
      return
    }

    setIsSubmitting(true)

    try {
      // Update user metadata
      await user.update({
        publicMetadata: {
          city: formData.city,
          roleInterest: formData.roleInterest,
          experienceLevel: formData.experienceLevel || 'Sin experiencia',
          registrationSource: 'onboarding',
          onboardingCompleted: true
        }
      })

      // Check if there's a post-signup redirect
      const redirectUrl = localStorage.getItem('post_signup_redirect')
      if (redirectUrl) {
        localStorage.removeItem('post_signup_redirect')
        localStorage.removeItem('post_signup_job')
        router.push(redirectUrl)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Error updating user metadata:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido a Taco Empleos!
          </h2>
          <p className="mt-2 text-gray-600">
            Cuéntanos sobre ti para personalizar tu experiencia
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="city" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                ¿En qué ciudad buscas trabajo? *
              </Label>
              <Select value={formData.city} onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu ciudad" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="roleInterest" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 mr-2" />
                ¿Qué tipo de trabajo te interesa? *
              </Label>
              <Select value={formData.roleInterest} onValueChange={(value) => setFormData(prev => ({ ...prev, roleInterest: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una posición" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="experienceLevel" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                ¿Cuánta experiencia tienes?
              </Label>
              <Select value={formData.experienceLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu nivel de experiencia" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              disabled={isSubmitting || !formData.city || !formData.roleInterest}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                'Completar registro'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}