'use client'

import { SignIn } from '@clerk/nextjs'
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
        
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 
                'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            }
          }}
          afterSignInUrl={redirectUrl}
          signUpUrl="/sign-up"
        />
        
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