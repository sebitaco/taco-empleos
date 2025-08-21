'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log critical application errors
    const errorInfo = {
      timestamp: new Date().toISOString(),
      message: error.message,
      type: 'GLOBAL_ERROR'
    }

    console.error('Global Application Error:', errorInfo)

    // In production, send to monitoring service immediately
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Example: Sentry.captureException(error, { level: 'fatal' })
    }
  }, [error])

  return (
    <html lang="es">
      <body className="bg-gray-50">
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Error crítico
              </h1>
              
              <p className="text-gray-600 mb-6">
                Ha ocurrido un error crítico en la aplicación. Por favor recarga la página.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={reset}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Recargar Aplicación
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Ir al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}