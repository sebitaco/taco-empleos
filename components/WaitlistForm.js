'use client'

import { useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { trackEvent } from '@/components/Analytics'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, Briefcase, Mail, MapPin, Heart } from 'lucide-react'

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
  const [audience, setAudience] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    city: '',
    source: '',
    consent: false,
    // Employer fields
    companyName: '',
    needs: '',
    // Candidate fields
    role: '',
    experienceYears: '',
    preferredCity: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [turnstileToken, setTurnstileToken] = useState('')

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) newErrors.email = 'El email es requerido'
    if (!formData.city) newErrors.city = 'La ciudad es requerida'
    if (!formData.consent) newErrors.consent = 'Debes aceptar la política de privacidad'
    if (!turnstileToken) newErrors.turnstile = 'Por favor completa la verificación de seguridad'

    if (audience === 'employer') {
      if (!formData.companyName) newErrors.companyName = 'El nombre de la empresa es requerido'
    } else if (audience === 'candidate') {
      if (!formData.role) newErrors.role = 'El rol de interés es requerido'
      if (!formData.experienceYears) newErrors.experienceYears = 'Los años de experiencia son requeridos'
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

    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          audience,
          turnstileToken
        }),
      })

      if (response.ok) {
        // Track successful signup
        trackEvent('waitlist_submit', {
          audience,
          city: formData.city
        })
        window.location.href = '/thanks'
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.error || 'Error al enviar el formulario' })
      }
    } catch (error) {
      setErrors({ submit: 'Error de conexión. Intenta nuevamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
                  <Select value={formData.city} onValueChange={(value) => updateFormData('city', value)}>
                    <SelectTrigger className={errors.city ? 'border-red-500' : ''}>
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
                    <Label htmlFor="needs">¿Qué tipo de personal necesitas?</Label>
                    <Input
                      id="needs"
                      placeholder="Meseros, cocineros, bartender..."
                      value={formData.needs}
                      onChange={(e) => updateFormData('needs', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {audience === 'candidate' && (
                <div className="space-y-6 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Información profesional</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="role">Rol de interés *</Label>
                      <Select value={formData.role} onValueChange={(value) => updateFormData('role', value)}>
                        <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.role && (
                        <p className="text-red-500 text-sm">{errors.role}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Años de experiencia *</Label>
                      <Select value={formData.experienceYears} onValueChange={(value) => updateFormData('experienceYears', value)}>
                        <SelectTrigger className={errors.experienceYears ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecciona experiencia" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceYears.map((exp) => (
                            <SelectItem key={exp} value={exp}>
                              {exp}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.experienceYears && (
                        <p className="text-red-500 text-sm">{errors.experienceYears}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredCity">Ciudad preferida para trabajar</Label>
                    <Select value={formData.preferredCity} onValueChange={(value) => updateFormData('preferredCity', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Opcional - selecciona ciudad" />
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
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="source">¿Cómo supiste de nosotros?</Label>
                <Select value={formData.source} onValueChange={(value) => updateFormData('source', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Opcional - selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                className="w-full"
                disabled={isSubmitting || !audience}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Unirse a la Lista de Espera
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                No spam, solo te contactaremos cuando lancemos la plataforma.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}