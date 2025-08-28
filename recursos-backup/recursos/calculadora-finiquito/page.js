import CalculadoraFiniquito2025 from '../../../components/CalculadoraFiniquito2025';

export const metadata = {
  title: 'Calculadora de Finiquito México 2025 | Taco Empleos',
  description: 'Calcula tu liquidación laboral con las reglas y exenciones vigentes en 2025. Herramienta gratuita y precisa para empleados en México.',
  keywords: 'finiquito, liquidación laboral, cálculo finiquito, indemnización, aguinaldo, vacaciones, prima antigüedad, ISR 2025',
};

export default function CalculadoraFiniquitoPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <CalculadoraFiniquito2025 />
    </main>
  );
}