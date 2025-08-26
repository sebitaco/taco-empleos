'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Sparkles, MapPin, DollarSign, Users } from 'lucide-react'
// Safe Clerk hooks - return default values if Clerk is not available
function useSignUpSafe() {
  try {
    const { useSignUp } = require('@clerk/nextjs')
    return useSignUp()
  } catch {
    return { signUp: null, isLoaded: true, setActive: () => {} }
  }
}

function useUserSafe() {
  try {
    const { useUser } = require('@clerk/nextjs')
    return useUser()
  } catch {
    return { user: null }
  }
}
import { useRouter } from 'next/navigation'

export default function RegistrationGateModal({ isOpen, onClose, targetJob, onRegistrationComplete }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signUp, isLoaded, setActive } = useSignUpSafe()
  const { user } = useUserSafe()
  const router = useRouter()

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isSubmitting, onClose])

  // Redirect to Clerk sign-up page
  const handleSignUp = () => {
    setIsSubmitting(true)
    
    // Store the target job in localStorage so we can redirect back after signup
    if (targetJob) {
      localStorage.setItem('post_signup_redirect', `/empleos/${targetJob.id}`)
      localStorage.setItem('post_signup_job', JSON.stringify(targetJob))
    }
    
    // Redirect to Clerk sign-up page
    router.push('/sign-up')
  }

  const handleSignIn = () => {
    setIsSubmitting(true)
    
    // Store the target job in localStorage so we can redirect back after signin
    if (targetJob) {
      localStorage.setItem('post_signup_redirect', `/empleos/${targetJob.id}`)
      localStorage.setItem('post_signup_job', JSON.stringify(targetJob))
    }
    
    // Redirect to Clerk sign-in page
    router.push('/sign-in')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!isSubmitting ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Sparkles className="w-6 h-6 text-blue-500 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">
              ¡Registrate gratis!
            </h2>
          </div>
          {!isSubmitting && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Target Job Preview */}
          {targetJob && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {targetJob.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{targetJob.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-green-600 font-semibold">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>{targetJob.salary}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 text-gray-700 mb-6">
            <p className="text-lg font-medium text-gray-900">
              Regístrate para ver {targetJob ? 'esta posición' : 'más empleos'} + acceso ilimitado
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span>
                    <strong>Acceso ilimitado</strong> a todas las ofertas de trabajo
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span>
                    <strong>Alertas personalizadas</strong> de nuevos empleos en tu ciudad
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span>
                    <strong>Guía salarial gratis</strong> para el sector hostelería
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-2" />
              <span>Únete a +50,000 profesionales de la hostelería</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={handleSignUp}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Redirigiendo...
              </>
            ) : (
              'Crear cuenta gratis'
            )}
          </Button>
          
          <Button
            onClick={handleSignIn}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Ya tengo cuenta - Iniciar sesión
          </Button>
          
          <p className="text-xs text-center text-gray-500">
            Registro 100% gratuito • No spam • Cancela cuando quieras
          </p>
        </div>
      </div>
    </div>
  )
}