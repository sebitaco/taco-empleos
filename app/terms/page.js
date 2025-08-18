export const metadata = {
  title: 'Términos y Condiciones - Taco Empleos',
  description: 'Términos y condiciones de uso de Taco Empleos.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Términos y Condiciones
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Última actualización: {new Date().toLocaleDateString('es-MX')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Aceptación de los Términos
            </h2>
            <p className="text-gray-700 mb-4">
              Al registrarte en nuestra lista de espera, aceptas estos términos 
              y condiciones en su totalidad.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Descripción del Servicio
            </h2>
            <p className="text-gray-700 mb-4">
              Taco Empleos es una plataforma de empleos especializada en la 
              industria de alimentos y bebidas en México. Conectamos candidatos 
              calificados con oportunidades laborales relevantes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Lista de Espera
            </h2>
            <p className="text-gray-700 mb-4">
              La lista de espera te permite ser notificado cuando nuestra 
              plataforma esté disponible. No garantizamos fechas específicas 
              de lanzamiento ni acceso prioritario.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Uso Aceptable
            </h2>
            <p className="text-gray-700 mb-4">
              Te comprometes a:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Proporcionar información veraz y actualizada</li>
              <li>No utilizar nuestro servicio para fines ilegales</li>
              <li>Respetar los derechos de otros usuarios</li>
              <li>No intentar comprometer la seguridad de nuestra plataforma</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Limitación de Responsabilidad
            </h2>
            <p className="text-gray-700 mb-4">
              Taco Empleos no será responsable de daños directos, indirectos, 
              incidentales o consecuentes que puedan surgir del uso de nuestro 
              servicio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Modificaciones
            </h2>
            <p className="text-gray-700 mb-4">
              Nos reservamos el derecho de modificar estos términos en cualquier 
              momento. Los cambios serán efectivos inmediatamente después de su 
              publicación.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Contacto
            </h2>
            <p className="text-gray-700">
              Para consultas sobre estos términos, contáctanos en: 
              legal@tacoempleados.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}