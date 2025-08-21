'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error to monitoring service in production
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    const errorInfo = {
      timestamp: new Date().toISOString(),
      message: error.message,
      // Only include stack trace in development
      ...(isDevelopment && { stack: error.stack })
    }

    console.error('App Router Error:', errorInfo)

    // In production, send to monitoring service
    if (!isDevelopment && typeof window !== 'undefined') {
      // Example: Sentry.captureException(error)
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Algo salió mal
          </h2>
          
          <p className="text-gray-600 mb-6">
            Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Intentar Nuevamente
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
  )
}