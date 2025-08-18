export const metadata = {
  title: 'Política de Privacidad - Taco Empleos',
  description: 'Política de privacidad de Taco Empleos.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Política de Privacidad
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Última actualización: {new Date().toLocaleDateString('es-MX')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Información que Recopilamos
            </h2>
            <p className="text-gray-700 mb-4">
              Recopilamos únicamente la información necesaria para proporcionarte 
              nuestros servicios:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Dirección de correo electrónico</li>
              <li>Ciudad de residencia o ubicación laboral</li>
              <li>Información profesional básica (para candidatos y empleadores)</li>
              <li>Preferencias de trabajo y experiencia laboral</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Uso de la Información
            </h2>
            <p className="text-gray-700 mb-4">
              Utilizamos tu información para:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Conectar candidatos con oportunidades laborales relevantes</li>
              <li>Notificarte sobre el lanzamiento de nuestra plataforma</li>
              <li>Mejorar nuestros servicios</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Protección de Datos
            </h2>
            <p className="text-gray-700 mb-4">
              Implementamos medidas de seguridad técnicas y organizativas 
              apropiadas para proteger tu información personal contra acceso 
              no autorizado, alteración, divulgación o destrucción.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Tus Derechos
            </h2>
            <p className="text-gray-700 mb-4">
              Tienes derecho a:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Acceder a tu información personal</li>
              <li>Rectificar datos inexactos</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Oponerte al procesamiento de tus datos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Contacto
            </h2>
            <p className="text-gray-700">
              Para cualquier consulta sobre esta política de privacidad, 
              contáctanos en: privacy@tacoempleados.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}