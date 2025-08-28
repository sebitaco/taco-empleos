'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trackEvent } from '@/components/Analytics'
import { MapPin, Search, TrendingUp, Heart } from 'lucide-react'
import Image from 'next/image'

// 8 most common gastronomy positions
const positions = [
  'Mesero/a',
  'Cocinero/a', 
  'Barista',
  'Bartender',
  'Hostess/Host',
  'Ayudante de cocina',
  'Lavaloza',
  'Chef'
]

export default function HeroSearch() {
  const [email, setEmail] = useState('')
  const [position, setPosition] = useState('')
  const [showPositionDropdown, setShowPositionDropdown] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [csrfToken, setCSRFToken] = useState('')

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch('/api/csrf')
        if (response.ok) {
          const data = await response.json()
          setCSRFToken(data.token)
        } else {
          console.error('Failed to fetch CSRF token')
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error)
      }
    }
    
    fetchCSRFToken()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('Por favor ingresa tu email')
      return
    }
    
    if (!position) {
      setError('Por favor selecciona una posición')
      return
    }
    
    if (!csrfToken) {
      setError('Error de seguridad. Por favor recarga la página.')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      // Track the signup
      trackEvent('hero_email_signup', { 
        section: 'hero'
      })

      // For now, we'll save to the waitlist API with minimal data
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify({
          email: email,
          // Only send what the user actually provided
          role: position || null, // Position if selected, null if not
          // Set minimal required fields for database
          city: 'CDMX', // Default to CDMX since this is CDMX job board
          audience: 'candidate', // This is always candidate signup
          consent: true, // Implicit by submitting
          // Empty employer fields
          companyName: null,
          needs: null,
          turnstileToken: ''
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setEmail('') // Clear the email field
        setPosition('') // Clear the position field
        setShowPositionDropdown(false) // Hide dropdown
      } else {
        setError('Error al registrarte. Por favor intenta de nuevo.')
      }
    } catch (error) {
      setError('Error de conexión. Por favor intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="bg-white py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            La bolsa de trabajo <br className="hidden sm:block" />
            <span className="text-primary">gastronómica</span> de CDMX
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Tacoempleos conecta a trabajadores gastronómicos con restaurantes, bares y cafés
          </p>
          
          {/* Email Subscription Form */}
          <div className="max-w-xl mx-auto">
            {success ? (
              /* Success Message */
              <div className="text-center space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white fill-current" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-green-800 mb-2">
                    ¡Te has unido a la mejor lista de empleo gastronómico!
                  </h3>
                  <p className="text-green-700">
                    Ahora recibirás las mejores vacantes de restaurantes, bares y cafés directamente en tu correo.
                  </p>
                </div>
                <Button 
                  onClick={() => setSuccess(false)}
                  variant="outline"
                  className="mt-4"
                >
                  Registrar otro correo
                </Button>
              </div>
            ) : (
              /* Email Form */
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="📧 Recibe las mejores vacantes por correo"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        // Show position dropdown when user starts typing email
                        if (e.target.value.length > 0 && !showPositionDropdown) {
                          setShowPositionDropdown(true)
                        }
                      }}
                      className="flex-1 px-4 py-3 text-base border-gray-300 rounded-lg"
                      disabled={isSubmitting}
                    />
                    <Button 
                      type="submit"
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Registrando...' : 'Regístrate'}
                    </Button>
                  </div>

                  {/* Position Dropdown - appears when user starts typing email */}
                  {showPositionDropdown && (
                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                      <label className="block text-sm font-medium text-gray-700">
                        ¿Qué posición te interesa? <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        disabled={isSubmitting}
                      >
                        <option value="">Selecciona una posición</option>
                        {positions.map((pos) => (
                          <option key={pos} value={pos}>
                            {pos}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                </form>

                {/* Social Proof Section */}
                <div className="mt-8 flex items-center justify-center">
                  <p className="text-sm text-gray-600 flex items-center">
                    Únete a 11,000 gastronómicos que reciben alertas de trabajo semanales
                    <TrendingUp className="w-5 h-5 ml-2 text-green-500" />
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}