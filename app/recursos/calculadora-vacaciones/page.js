import VacationCalculator from '@/components/VacationCalculator'

export const metadata = {
  title: 'Calculadora de Vacaciones y Prima Vacacional 2025 México | Taco Empleos',
  description: 'Calcula tus días de vacaciones y prima vacacional según la Ley Federal del Trabajo 2025. Herramienta gratuita con tabla de antigüedad actualizada.',
  keywords: 'calculadora vacaciones 2025 México, prima vacacional 25%, días de vacaciones LFT, calculadora prima vacacional, vacaciones por antigüedad México',
  openGraph: {
    title: 'Calculadora de Vacaciones y Prima Vacacional 2025 - México',
    description: 'Calcula fácilmente tus vacaciones y prima vacacional según la reforma 2023 de la LFT',
    type: 'website',
  },
};

export default function CalculadoraVacacionesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Calculadora de Vacaciones y Prima Vacacional 2025 (México)
        </h1>

        {/* Interactive Vacation Calculator */}
        <VacationCalculator />

        {/* Legal Context Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Marco Legal de Vacaciones en México (Reforma 2023)
          </h2>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              La Ley Federal del Trabajo establece derechos mínimos de vacaciones que todo trabajador debe conocer. 
              Con la reforma de 2023, México actualizó significativamente estos beneficios.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3">Artículos clave de la LFT:</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Artículo 76 LFT:</strong> Define los días mínimos de vacaciones según tu antigüedad laboral.</li>
                <li><strong>Artículo 80 LFT:</strong> Establece la prima vacacional mínima del 25% sobre el pago de vacaciones.</li>
                <li><strong>Artículo 89 LFT:</strong> Determina cómo calcular el salario diario para estos pagos.</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Puntos importantes:</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Los días establecidos son <strong>mínimos legales</strong>. Tu patrón puede otorgar más días, nunca menos.</li>
                <li>Al menos <strong>12 días deben disfrutarse de forma continua</strong> en el primer período vacacional.</li>
                <li>La prima vacacional es un pago adicional del 25% mínimo sobre los días de vacaciones que tomes.</li>
              </ul>
            </div>

            <div className="overflow-x-auto mb-6">
              <h3 className="text-lg font-semibold mb-3">Tabla de días de vacaciones por antigüedad (2025):</h3>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Años de antigüedad</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Días de vacaciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">1 año</td>
                    <td className="border border-gray-300 px-4 py-2">12 días</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">2 años</td>
                    <td className="border border-gray-300 px-4 py-2">14 días</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">3 años</td>
                    <td className="border border-gray-300 px-4 py-2">16 días</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">4 años</td>
                    <td className="border border-gray-300 px-4 py-2">18 días</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">5 años</td>
                    <td className="border border-gray-300 px-4 py-2">20 días</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">6 a 10 años</td>
                    <td className="border border-gray-300 px-4 py-2">22 días</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">11 a 15 años</td>
                    <td className="border border-gray-300 px-4 py-2">24 días</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">16 a 20 años</td>
                    <td className="border border-gray-300 px-4 py-2">26 días</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">21 a 25 años</td>
                    <td className="border border-gray-300 px-4 py-2">28 días</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">26 a 30 años</td>
                    <td className="border border-gray-300 px-4 py-2">30 días</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">31 a 35 años</td>
                    <td className="border border-gray-300 px-4 py-2">32 días</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-sm">
                <strong>Nota legal:</strong> Información basada en los artículos 76, 80 y 89 de la Ley Federal del Trabajo (reforma 2023). 
                Esta guía es únicamente informativa y no constituye asesoría legal.
              </p>
            </div>
          </div>
        </section>

        {/* Calculation Steps Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            ¿Cómo calcular tus vacaciones y prima vacacional?
          </h2>
          
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4">
              Sigue estos pasos para calcular correctamente tu pago de vacaciones:
            </p>

            <ol className="space-y-4 list-decimal list-inside">
              <li>
                <strong>Obtén tu salario diario:</strong>
                <div className="ml-6 mt-2 p-3 bg-gray-100 rounded font-mono text-sm">
                  Salario diario = Salario mensual ÷ 30
                </div>
                <span className="text-sm text-gray-600 ml-6">(Base legal: artículo 89 LFT)</span>
              </li>
              
              <li>
                <strong>Determina tus días de vacaciones</strong> según tu antigüedad (consulta la tabla anterior).
              </li>
              
              <li>
                <strong>Calcula el pago por vacaciones:</strong>
                <div className="ml-6 mt-2 p-3 bg-gray-100 rounded font-mono text-sm">
                  Pago vacaciones = Salario diario × Días que vas a tomar
                </div>
              </li>
              
              <li>
                <strong>Calcula la prima vacacional:</strong>
                <div className="ml-6 mt-2 p-3 bg-gray-100 rounded font-mono text-sm">
                  Prima vacacional = Pago vacaciones × 0.25
                </div>
                <span className="text-sm text-gray-600 ml-6">(Mínimo legal 25%)</span>
              </li>
              
              <li>
                <strong>Total a recibir:</strong>
                <div className="ml-6 mt-2 p-3 bg-gray-100 rounded font-mono text-sm">
                  Total = Pago vacaciones + Prima vacacional
                </div>
              </li>
            </ol>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold mb-3">Ejemplo práctico:</h3>
              <ul className="space-y-2">
                <li>• Salario mensual: $15,000</li>
                <li>• Antigüedad: 3 años (16 días de vacaciones)</li>
                <li>• Días a tomar: 10 días</li>
              </ul>
              
              <div className="mt-4 space-y-2">
                <p><strong>Cálculo:</strong></p>
                <p>1. Salario diario: $15,000 ÷ 30 = <strong>$500</strong></p>
                <p>2. Pago por 10 días de vacaciones: $500 × 10 = <strong>$5,000</strong></p>
                <p>3. Prima vacacional (25%): $5,000 × 0.25 = <strong>$1,250</strong></p>
                <p className="text-lg font-semibold">Total a recibir: $6,250</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              <strong>Nota práctica:</strong> Si tu salario varía mensualmente, usa el promedio de los últimos 30 días para estimar tu salario diario.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Preguntas Frecuentes sobre Vacaciones en México
          </h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-lg mb-2">
                ¿Cuántos días de vacaciones corresponden por ley en 2025?
              </h3>
              <p className="text-gray-700">
                Según la reforma 2023 de la LFT, corresponden mínimo 12 días desde el primer año de trabajo. 
                Los días aumentan gradualmente con la antigüedad hasta llegar a 32 días después de 31 años.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-lg mb-2">
                ¿Cómo se calcula la prima vacacional en México?
              </h3>
              <p className="text-gray-700">
                La prima vacacional es un pago adicional mínimo del 25% sobre el salario correspondiente a los días de vacaciones que tomes. 
                Se calcula multiplicando el pago de tus vacaciones por 0.25 o el porcentaje que otorgue tu empresa si es mayor.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-lg mb-2">
                ¿La empresa puede pagarme las vacaciones en lugar de que las tome?
              </h3>
              <p className="text-gray-700">
                No. La ley establece que las vacaciones deben disfrutarse, no pueden ser compensadas con dinero excepto cuando termina la relación laboral. 
                El objetivo es garantizar el descanso del trabajador.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-lg mb-2">
                ¿Puedo tomar mis vacaciones en partes?
              </h3>
              <p className="text-gray-700">
                Sí, pero al menos 12 días deben tomarse de forma continua. 
                Los días restantes pueden fraccionarse de común acuerdo entre trabajador y patrón.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-lg mb-2">
                ¿Qué pasa si mi patrón no respeta mis días de vacaciones?
              </h3>
              <p className="text-gray-700">
                Puedes presentar una queja ante la Procuraduría Federal de la Defensa del Trabajo (PROFEDET) o ante la Junta de Conciliación y Arbitraje. 
                El patrón puede recibir multas por no cumplir con la ley.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-lg mb-2">
                ¿La prima vacacional siempre es 25% o puede ser mayor?
              </h3>
              <p className="text-gray-700">
                El 25% es el mínimo legal. Muchas empresas otorgan porcentajes mayores como parte de sus prestaciones superiores a la ley. 
                Verifica tu contrato colectivo o individual para conocer el porcentaje exacto.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-lg mb-2">
                ¿Cómo convierto salario mensual a salario diario para este cálculo?
              </h3>
              <p className="text-gray-700">
                Divide tu salario mensual entre 30, según establece el artículo 89 de la LFT. 
                Esta es la base legal para todos los cálculos de prestaciones, incluyendo vacaciones y prima vacacional.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-lg mb-2">
                ¿Las vacaciones cuentan como días hábiles o naturales?
              </h3>
              <p className="text-gray-700">
                Las vacaciones se cuentan en días hábiles (laborables). No incluyen domingos ni días de descanso obligatorio, 
                salvo que por la naturaleza del trabajo se labore esos días normalmente.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-lg mb-2">
                ¿Desde cuándo tengo derecho a vacaciones?
              </h3>
              <p className="text-gray-700">
                Tienes derecho a vacaciones después de cumplir un año de servicios continuos con el mismo patrón. 
                Sin embargo, puedes acordar con tu empleador tomar días proporcionales antes de cumplir el año.
              </p>
            </div>
          </div>
        </section>

        {/* Common Mistakes Section */}
        <section className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Errores comunes al calcular vacaciones
          </h3>
          
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✗</span>
              <span>Confundir salario diario con salario diario integrado (SDI). Para vacaciones usa el salario diario simple.</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✗</span>
              <span>Usar 15 o 31 días para convertir el salario mensual en lugar de 30 días como marca la ley.</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✗</span>
              <span>Olvidar que el 25% de prima vacacional es el mínimo. Tu empresa puede otorgar más.</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">✗</span>
              <span>No considerar que las vacaciones prescriben después de un año de generadas.</span>
            </li>
          </ul>
        </section>

        {/* Internal Links Placeholder */}
        <section className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Recursos relacionados
          </h3>
          <ul className="space-y-2 text-blue-600">
            <li>
              <a href="#" className="hover:underline">
                → Guía completa de Prestaciones de Ley en México
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                → Tabla completa de Vacaciones por Antigüedad 2025
              </a>
            </li>
          </ul>
        </section>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Cuántos días de vacaciones corresponden por ley en 2025?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Según la reforma 2023 de la LFT, corresponden mínimo 12 días desde el primer año de trabajo. Los días aumentan gradualmente con la antigüedad hasta llegar a 32 días después de 31 años."
                }
              },
              {
                "@type": "Question",
                "name": "¿Cómo se calcula la prima vacacional en México?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "La prima vacacional es un pago adicional mínimo del 25% sobre el salario correspondiente a los días de vacaciones que tomes. Se calcula multiplicando el pago de tus vacaciones por 0.25 o el porcentaje que otorgue tu empresa si es mayor."
                }
              },
              {
                "@type": "Question",
                "name": "¿La empresa puede pagarme las vacaciones en lugar de que las tome?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. La ley establece que las vacaciones deben disfrutarse, no pueden ser compensadas con dinero excepto cuando termina la relación laboral. El objetivo es garantizar el descanso del trabajador."
                }
              },
              {
                "@type": "Question",
                "name": "¿Puedo tomar mis vacaciones en partes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sí, pero al menos 12 días deben tomarse de forma continua. Los días restantes pueden fraccionarse de común acuerdo entre trabajador y patrón."
                }
              },
              {
                "@type": "Question",
                "name": "¿Qué pasa si mi patrón no respeta mis días de vacaciones?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Puedes presentar una queja ante la Procuraduría Federal de la Defensa del Trabajo (PROFEDET) o ante la Junta de Conciliación y Arbitraje. El patrón puede recibir multas por no cumplir con la ley."
                }
              },
              {
                "@type": "Question",
                "name": "¿La prima vacacional siempre es 25% o puede ser mayor?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "El 25% es el mínimo legal. Muchas empresas otorgan porcentajes mayores como parte de sus prestaciones superiores a la ley. Verifica tu contrato colectivo o individual para conocer el porcentaje exacto."
                }
              },
              {
                "@type": "Question",
                "name": "¿Cómo convierto salario mensual a salario diario para este cálculo?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Divide tu salario mensual entre 30, según establece el artículo 89 de la LFT. Esta es la base legal para todos los cálculos de prestaciones, incluyendo vacaciones y prima vacacional."
                }
              },
              {
                "@type": "Question",
                "name": "¿Las vacaciones cuentan como días hábiles o naturales?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Las vacaciones se cuentan en días hábiles (laborables). No incluyen domingos ni días de descanso obligatorio, salvo que por la naturaleza del trabajo se labore esos días normalmente."
                }
              },
              {
                "@type": "Question",
                "name": "¿Desde cuándo tengo derecho a vacaciones?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Tienes derecho a vacaciones después de cumplir un año de servicios continuos con el mismo patrón. Sin embargo, puedes acordar con tu empleador tomar días proporcionales antes de cumplir el año."
                }
              }
            ]
          })
        }}
      />
    </main>
  );
}