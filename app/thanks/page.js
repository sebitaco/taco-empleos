import Link from 'next/link'

export const metadata = {
  title: 'Gracias - Taco Empleos',
  description: 'Gracias por unirte a la lista de espera de Taco Empleos.',
}

export default function ThanksPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-16 w-16 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Gracias por registrarte!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Te hemos agregado a nuestra lista de espera. Serás de los primeros en 
          enterarte cuando lancemos Taco Empleos.
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}