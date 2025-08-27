'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Turnstile } from '@marsidev/react-turnstile'
import { trackEvent } from '@/components/Analytics'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, Briefcase, Mail, MapPin, Heart } from 'lucide-react'
import { 
  sanitizeEmail, 
  sanitizeCity, 
  sanitizeCompanyName, 
  sanitizeRole, 
  sanitizeGeneralText,
  hasXSSPattern,
  sanitizeErrorMessage
} from '@/lib/security'

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

const experienceYears = [
  "Sin experiencia", "Menos de 1 año", "1-2 años", "3-5 años", 
  "6-10 años", "Más de 10 años"
]

const sources = [
  "Redes sociales", "Búsqueda en Google", "Recomendación de amigo",
  "Anuncio publicitario", "Blog o artículo", "Otro"
]

export default function WaitlistForm() {
  const router = useRouter()
  const [audience, setAudience] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    city: '',
    consent: false,
    // Employer fields
    companyName: '',
    needs: '',
    // Candidate fields
    role: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [turnstileToken, setTurnstileToken] = useState('')
  const [csrfToken, setCSRFToken] = useState('')
  const [isRateLimited, setIsRateLimited] = useState(false)
  
  // Fetch CSRF token and check rate limit status on component mount
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
    
    // Check if user is still rate limited
    const checkRateLimit = () => {
      const retryAfter = localStorage.getItem('waitlist_retry_after')
      if (retryAfter) {
        const retryTime = parseInt(retryAfter)
        if (Date.now() < retryTime) {
          setIsRateLimited(true)
          const remainingTime = Math.ceil((retryTime - Date.now()) / 1000 / 60)
          setErrors({ 
            submit: `Por favor espera ${remainingTime} minuto${remainingTime > 1 ? 's' : ''} antes de intentar nuevamente.` 
          })
          
          // Set a timeout to clear the rate limit
          setTimeout(() => {
            setIsRateLimited(false)
            setErrors({})
            localStorage.removeItem('waitlist_retry_after')
          }, retryTime - Date.now())
        } else {
          localStorage.removeItem('waitlist_retry_after')
        }
      }
    }
    
    fetchCSRFToken()
    checkRateLimit()
  }, [])

  const validateForm = () => {
    const newErrors = {}

    // Basic required field validation
    if (!formData.email) newErrors.email = 'El email es requerido'
    if (!formData.city) newErrors.city = 'La ciudad es requerida'
    if (!formData.consent) newErrors.consent = 'Debes aceptar la política de privacidad'
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) newErrors.turnstile = 'Por favor completa la verificación de seguridad'

    // XSS validation for all text inputs
    if (formData.email && hasXSSPattern(formData.email)) {
      newErrors.email = 'El email contiene caracteres no válidos'
    }
    
    if (formData.city && hasXSSPattern(formData.city)) {
      newErrors.city = 'La ciudad contiene caracteres no válidos'
    }

    if (formData.companyName && hasXSSPattern(formData.companyName)) {
      newErrors.companyName = 'El nombre de la empresa contiene caracteres no válidos'
    }

    if (formData.role && hasXSSPattern(formData.role)) {
      newErrors.role = 'El puesto contiene caracteres no válidos'
    }

    if (formData.needs && hasXSSPattern(formData.needs)) {
      newErrors.needs = 'La descripción contiene caracteres no válidos'
    }

    if (audience === 'employer') {
      if (!formData.companyName) newErrors.companyName = 'El nombre de la empresa es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!audience) {
      setErrors({ audience: 'Selecciona si eres empleador o candidato' })
      return
    }
    
    if (!csrfToken) {
      setErrors({ submit: 'Error de seguridad. Por favor recarga la página.' })
      return
    }
    
    // Prevent submission if rate limited
    if (isRateLimited) {
      return
    }

    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify({
          email: formData.email,
          city: formData.city,
          consent: formData.consent,
          companyName: formData.companyName,
          needs: formData.needs,
          role: formData.role,
          audience,
          turnstileToken
        }),
      })

      if (response.ok) {
        // Track successful signup with sanitized data
        trackEvent('waitlist_submit', {
          audience: audience,
          city: sanitizeCity(formData.city)
        })
        router.push('/thanks')
      } else {
        const errorData = await response.json()
        let errorMessage = sanitizeErrorMessage(errorData.error || 'Error al enviar el formulario')
        
        // Handle rate limit errors specifically
        if (response.status === 429 && errorData.retryAfter) {
          // Store retry time in localStorage for better UX
          const retryTime = Date.now() + (errorData.retryAfter * 1000)
          localStorage.setItem('waitlist_retry_after', retryTime.toString())
        }
        
        setErrors({ submit: errorMessage })
      }
    } catch (error) {
      setErrors({ submit: 'Error de conexión. Intenta nuevamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field, value) => {
    let sanitizedValue = value

    // Sanitize input based on field type
    switch (field) {
      case 'email':
        sanitizedValue = sanitizeEmail(value)
        break
      case 'city':
        sanitizedValue = sanitizeCity(value)
        break
      case 'companyName':
        sanitizedValue = sanitizeCompanyName(value)
        break
      case 'role':
        sanitizedValue = sanitizeRole(value)
        break
      case 'needs':
        sanitizedValue = sanitizeGeneralText(value)
        break
      default:
        // For other fields, just trim
        sanitizedValue = typeof value === 'string' ? value.trim() : value
    }

    setFormData(prev => ({ ...prev, [field]: sanitizedValue }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <section id="waitlist" className="py-16 bg-gradient-to-r from-primary to-blue-600">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Únete a la Lista de Espera
            </h2>
            <p className="text-lg text-blue-100">
              Sé de los primeros en acceder a Taco Empleos cuando lancemos. 
              Te notificaremos apenas esté disponible.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-base font-medium text-gray-900 mb-4 block">
                  ¿Qué eres?
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAudience('candidate')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      audience === 'candidate'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-medium">Busco Trabajo</div>
                    <div className="text-sm text-gray-500">Candidato</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAudience('employer')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      audience === 'employer'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Briefcase className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="font-medium">Busco Personal</div>
                    <div className="text-sm text-gray-500">Empleador</div>
                  </button>
                </div>
                {errors.audience && (
                  <p className="text-red-500 text-sm mt-2">{errors.audience}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Correo electrónico *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Ciudad *
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Ej: Ciudad de México, Guadalajara..."
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm">{errors.city}</p>
                  )}
                </div>
              </div>

              {audience === 'employer' && (
                <div className="space-y-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Información de la empresa</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nombre de la empresa *</Label>
                    <Input
                      id="companyName"
                      placeholder="Restaurante El Buen Sabor"
                      value={formData.companyName}
                      onChange={(e) => updateFormData('companyName', e.target.value)}
                      className={errors.companyName ? 'border-red-500' : ''}
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-sm">{errors.companyName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="needs">¿Qué tipo de personal necesitas? (Opcional)</Label>
                    <Input
                      id="needs"
                      placeholder="Ej: Meseros, cocineros, bartender..."
                      value={formData.needs}
                      onChange={(e) => updateFormData('needs', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {audience === 'candidate' && (
                <div className="space-y-6 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Información profesional</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">¿Qué posición buscas? (Opcional)</Label>
                    <Input
                      id="role"
                      type="text"
                      placeholder="Ej: Mesero, cocinero, barista..."
                      value={formData.role}
                      onChange={(e) => updateFormData('role', e.target.value)}
                    />
                  </div>
                </div>
              )}


              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) => updateFormData('consent', checked)}
                  className={errors.consent ? 'border-red-500' : ''}
                />
                <div className="space-y-1">
                  <Label htmlFor="consent" className="text-sm font-normal">
                    Acepto la{' '}
                    <a href="/privacy" className="text-primary hover:underline">
                      política de privacidad
                    </a>{' '}
                    y{' '}
                    <a href="/terms" className="text-primary hover:underline">
                      términos y condiciones
                    </a>
                    . *
                  </Label>
                  {errors.consent && (
                    <p className="text-red-500 text-sm">{errors.consent}</p>
                  )}
                </div>
              </div>

              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <div className="space-y-2">
                  <Label>Verificación de seguridad *</Label>
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                    onSuccess={setTurnstileToken}
                    onError={() => setTurnstileToken('')}
                    onExpire={() => setTurnstileToken('')}
                    options={{
                      theme: 'light',
                      size: 'normal'
                    }}
                  />
                  {errors.turnstile && (
                    <p className="text-red-500 text-sm">{errors.turnstile}</p>
                  )}
                </div>
              )}

              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold uppercase tracking-wider"
                disabled={isSubmitting || !audience || isRateLimited}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  'SIGN UP →'
                )}
              </Button>

              <p className="text-sm text-gray-600 text-center">
                Únete a 11,000 profesionales gastronómicos ✨
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}