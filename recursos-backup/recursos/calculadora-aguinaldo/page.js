import AguinaldoCalculator from '@/components/AguinaldoCalculator'

export const metadata = {
  title: 'Calculadora de Aguinaldo con ISR 2025 - México | Taco Empleos',
  description: 'Calcula tu aguinaldo neto considerando el ISR según el artículo 96 de la LISR. Incluye método diferencial, exención de 30 UMA y subsidio al empleo.',
  keywords: 'aguinaldo, ISR, calculadora, impuesto, México, nómina, artículo 96, UMA, subsidio empleo'
}

export default function AguinaldoCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Calculadora de Aguinaldo con ISR 2025
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calcula tu aguinaldo neto aplicando correctamente el ISR según el método diferencial del artículo 96 de la LISR, 
            considerando la exención de 30 UMA y el subsidio al empleo.
          </p>
        </div>
        
        <AguinaldoCalculator />
      </div>
    </div>
  )
}