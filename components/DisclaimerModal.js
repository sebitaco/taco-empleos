'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, X } from 'lucide-react'
import { useFacebookRedirects } from '@/lib/hooks/useJobViews'
import RegistrationGateModal from '@/components/RegistrationGateModal'

export default function DisclaimerModal({ isOpen, onAccept, onCancel, job }) {
  const { canRedirectToFacebook, recordFacebookRedirect, resetRedirects } = useFacebookRedirects()
  const [showRegistrationGate, setShowRegistrationGate] = useState(false)

  // Handle acceptance - check if user can redirect or needs to register
  const handleAccept = () => {
    if (!job) {
      onAccept()
      return
    }

    // Check if user can redirect to Facebook
    if (canRedirectToFacebook(job.id)) {
      // Record the redirect and proceed to Facebook
      recordFacebookRedirect(job.id)
      onAccept()
    } else {
      // Show registration gate instead
      setShowRegistrationGate(true)
    }
  }

  const handleRegistrationComplete = () => {
    // Reset redirect count since user is now registered
    resetRedirects()
    setShowRegistrationGate(false)
    // Proceed to Facebook
    onAccept()
  }

  const handleRegistrationCancel = () => {
    setShowRegistrationGate(false)
    // Close the disclaimer modal as well
    onCancel()
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !showRegistrationGate) {
        onCancel()
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
  }, [isOpen, showRegistrationGate, onCancel])

  if (!isOpen) return null

  return (
    <>
      {/* Only show disclaimer if registration gate is not showing */}
      {!showRegistrationGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">
              Aviso Importante
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4 text-gray-700">
            <p className="text-sm leading-relaxed">
              Antes de continuar a la publicación original, por favor ten en cuenta lo siguiente:
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span>
                    <strong>No conocemos la empresa</strong> detrás de esta publicación de Facebook.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span>
                    <strong>Por favor verifica la autenticidad</strong> de la oferta de trabajo antes de proporcionar información personal.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span>
                    <strong>Taco Empleos no ha verificado</strong> esta posición de trabajo ni la legitimidad del empleador.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold mb-2">Exención de Responsabilidad:</p>
                  <p>
                    Al continuar, entiendo y acepto que <strong>Taco Empleos no tiene ninguna responsabilidad</strong> sobre 
                    esta oferta de trabajo, su autenticidad, o cualquier consecuencia derivada de mi participación en el 
                    proceso de selección. Procedo bajo mi propio riesgo y responsabilidad.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <strong>Recomendación:</strong> Siempre verifica la identidad del empleador, no proporciones información financiera personal, y desconfía de ofertas que parezcan demasiado buenas para ser verdad.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAccept}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Entiendo, continuar
          </Button>
        </div>
      </div>
    </div>
  )}

      {/* Registration Gate Modal - Higher z-index to appear above disclaimer */}
      <RegistrationGateModal 
        isOpen={showRegistrationGate}
        onClose={handleRegistrationCancel}
        targetJob={job}
        onRegistrationComplete={handleRegistrationComplete}
      />
    </>
  )
}