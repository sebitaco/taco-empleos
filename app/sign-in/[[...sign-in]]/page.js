'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowLeft } from 'lucide-react'

// Safe Clerk import
function getClerkComponent() {
  try {
    const { SignIn } = require('@clerk/nextjs')
    return SignIn
  } catch {
    return null
  }
}

export default function Page() {
  const [isClerkAvailable, setIsClerkAvailable] = useState(false)
  const [SignIn, setSignIn] = useState(null)

  useEffect(() => {
    // Check if Clerk is available and has API keys
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    if (publishableKey && publishableKey !== 'pk_test_temp') {
      const ClerkSignIn = getClerkComponent()
      if (ClerkSignIn) {
        setSignIn(() => ClerkSignIn)
        setIsClerkAvailable(true)
      }
    }
  }, [])

  // If Clerk is not available, show setup message
  if (!isClerkAvailable) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">
              ¡Próximamente!
            </h2>
            <p className="mt-2 text-gray-600">
              El sistema de registro se está configurando
            </p>
          </div>
          
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="space-y-4">
              <p className="text-gray-700">
                Estamos preparando el sistema de registro para que puedas acceder a todas las posiciones de trabajo.
              </p>
              <p className="text-sm text-gray-500">
                Por favor regresa pronto o contacta al equipo para más información.
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/">
              <Button variant="outline" className="inline-flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Render Clerk SignIn if available
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Inicia sesión
          </h2>
          <p className="mt-2 text-gray-600">
            Accede a tu cuenta de Taco Empleos
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {SignIn && (
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 
                    'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
                  card: 'shadow-none',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden'
                }
              }}
              redirectUrl="/"
              signUpUrl="/sign-up"
            />
          )}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <a href="/sign-up" className="text-blue-600 hover:underline">
              Regístrate gratis
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}