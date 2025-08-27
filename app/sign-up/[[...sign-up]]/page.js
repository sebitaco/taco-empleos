'use client'

import { SignUp } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function Page() {
  const [redirectUrl, setRedirectUrl] = useState('/')
  
  useEffect(() => {
    // Check if there's a stored redirect URL from the registration gate
    const storedRedirect = localStorage.getItem('post_signup_redirect')
    if (storedRedirect) {
      setRedirectUrl(storedRedirect)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Únete a Taco Empleos
          </h2>
          <p className="mt-2 text-gray-600">
            Accede a miles de ofertas de trabajo en restaurantes
          </p>
        </div>
        
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
                card: 'shadow-lg',
                rootBox: 'mx-auto'
              }
            }}
            fallbackRedirectUrl={redirectUrl}
            signInUrl="/sign-in"
          />
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <a href="/sign-in" className="text-blue-600 hover:underline">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}