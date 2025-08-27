'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Turnstile } from '@marsidev/react-turnstile'
import { trackEvent } from '@/components/Analytics'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
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

export default function JobPostingForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    city: '',
    consent: false,
    restaurantName: '',
    contactName: '',
    contactPhone: '',
    position: '',
    salary: '',
    description: ''
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

    // Basic required field validation with trimming
    if (!formData.email?.trim()) newErrors.email = 'El email es requerido'
    if (!formData.city?.trim()) newErrors.city = 'La colonia es requerida'
    if (!formData.consent) newErrors.consent = 'Debes aceptar la política de privacidad'
    if (!formData.restaurantName?.trim()) newErrors.restaurantName = 'El nombre del restaurante es requerido'
    if (!formData.contactName?.trim()) newErrors.contactName = 'El nombre de contacto es requerido'
    if (!formData.contactPhone?.trim()) newErrors.contactPhone = 'El teléfono de contacto es requerido'
    if (!formData.position?.trim()) newErrors.position = 'El puesto es requerido'
    if (!formData.description?.trim()) newErrors.description = 'La descripción del puesto es requerida'
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) newErrors.turnstile = 'Por favor completa la verificación de seguridad'

    // XSS validation for all text inputs
    const fieldsToValidate = [
      { field: 'email', name: 'El email' },
      { field: 'city', name: 'La ciudad' },
      { field: 'restaurantName', name: 'El nombre del restaurante' },
      { field: 'contactName', name: 'El nombre de contacto' },
      { field: 'contactPhone', name: 'El teléfono' },
      { field: 'position', name: 'El puesto' },
      { field: 'salary', name: 'El salario' },
      { field: 'description', name: 'La descripción' }
    ]
    
    fieldsToValidate.forEach(({ field, name }) => {
      if (formData[field] && hasXSSPattern(formData[field])) {
        newErrors[field] = `${name} contiene caracteres no válidos`
      }
    })

    // Debug logging
    console.log('Form validation check:', {
      formData,
      newErrors,
      turnstileToken
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
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
      const response = await fetch('/api/job-posting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify({
          email: formData.email?.trim(),
          city: formData.city?.trim(),
          consent: formData.consent,
          restaurantName: formData.restaurantName?.trim(),
          contactName: formData.contactName?.trim(),
          contactPhone: formData.contactPhone?.trim(),
          position: formData.position?.trim(),
          salary: formData.salary?.trim(),
          description: formData.description?.trim(),
          turnstileToken
        }),
      })

      if (response.ok) {
        // Track successful job posting submission
        trackEvent('job_posting_submit', {
          city: sanitizeCity(formData.city),
          position: formData.position
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
    // Handle different value types - boolean for checkboxes, string for inputs
    let sanitizedValue = value
    
    if (typeof value === 'string') {
      // Use minimal sanitization during typing to prevent validation issues
      // Only remove the most dangerous patterns
      sanitizedValue = value.replace(/<script[\s\S]*?>/gi, '').replace(/javascript:/gi, '').replace(/<iframe[\s\S]*?>/gi, '')
    }
    // For boolean values (checkboxes), no sanitization needed

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
              Publica tu Vacante <span className="text-blue-200 text-2xl font-normal">Sin Costo</span>
            </h2>
            <p className="text-lg text-blue-100">
              Comparte los detalles de tu vacante y la revisaremos en las próximas horas para publicarla.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="restaurantName">Nombre del Restaurante *</Label>
                    <Input
                      id="restaurantName"
                      placeholder="Restaurante El Buen Sabor"
                      value={formData.restaurantName}
                      onChange={(e) => updateFormData('restaurantName', e.target.value)}
                      className={errors.restaurantName ? 'border-red-500' : ''}
                    />
                    {errors.restaurantName && (
                      <p className="text-red-500 text-sm">{errors.restaurantName}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">
                        Nombre de Contacto *
                        <br />
                        <span className="text-xs text-gray-500 font-normal">(Privado - no se incluye en la publicación)</span>
                      </Label>
                      <Input
                        id="contactName"
                        placeholder="Juan Pérez"
                        value={formData.contactName}
                        onChange={(e) => updateFormData('contactName', e.target.value)}
                        className={errors.contactName ? 'border-red-500' : ''}
                      />
                      {errors.contactName && (
                        <p className="text-red-500 text-sm">{errors.contactName}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">
                        Teléfono de Contacto *
                        <br />
                        <span className="text-xs text-gray-500 font-normal">(Privado - no se incluye en la publicación)</span>
                      </Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="55 1234 5678"
                        value={formData.contactPhone}
                        onChange={(e) => updateFormData('contactPhone', e.target.value)}
                        className={errors.contactPhone ? 'border-red-500' : ''}
                      />
                      {errors.contactPhone && (
                        <p className="text-red-500 text-sm">{errors.contactPhone}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Correo electrónico * 
                      <span className="text-xs text-gray-500 font-normal ml-2">(Privado - no se incluye en la publicación)</span>
                    </Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                      autoComplete="off"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Puesto que Buscas *</Label>
                    <Input
                      id="position"
                      placeholder="Mesero, Cocinero, Barista..."
                      value={formData.position}
                      onChange={(e) => updateFormData('position', e.target.value)}
                      className={errors.position ? 'border-red-500' : ''}
                    />
                    {errors.position && (
                      <p className="text-red-500 text-sm">{errors.position}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    Colonia *
                  </span>
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Ej: Roma Norte, Condesa, Polanco..."
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm">{errors.city}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary">Salario (Opcional)</Label>
                <Input
                  id="salary"
                  placeholder="Ej: $8,000 - $12,000 MXN mensuales"
                  value={formData.salary}
                  onChange={(e) => updateFormData('salary', e.target.value)}
                />
                <p className="text-sm text-gray-500">Este campo es opcional y nos ayuda a ofrecer mejores oportunidades</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción del Puesto *</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Describe las responsabilidades, horarios, experiencia requerida..."
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>



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
                disabled={isSubmitting || isRateLimited}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
  'PUBLICAR VACANTE →'
                )}
              </Button>

              <p className="text-sm text-gray-600 text-center">
                Revisaremos tu vacante en las próximas horas y te notificaremos cuando esté publicada ✨
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}