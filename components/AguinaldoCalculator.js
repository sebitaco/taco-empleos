'use client'

import { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  calcularAguinaldoCompleto, 
  formatearMoneda, 
  formatearNumero, 
  parsearMoneda,
  FISCAL_CONSTANTS_2025 
} from '@/lib/aguinaldo-calc'
import { 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Calendar, 
  Calculator,
  Eye,
  AlertCircle,
  CheckCircle,
  DollarSign
} from 'lucide-react'

const COMPLEXITY_LEVELS = {
  simple: { label: 'Simple', value: 'simple' },
  estandar: { label: 'Estándar', value: 'estandar' },
  experto: { label: 'Experto', value: 'experto' }
}

export default function AguinaldoCalculator() {
  // Inputs principales
  const [sueldoMensual, setSueldoMensual] = useState('')
  const [diasAguinaldo, setDiasAguinaldo] = useState(15)
  const [fechaIngreso, setFechaIngreso] = useState('')
  const [pagarJuntoNomina, setPagarJuntoNomina] = useState(false)
  
  // UI state
  const [complexityLevel, setComplexityLevel] = useState('estandar')
  const [accordionOpen, setAccordionOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(null)
  const [activePopover, setActivePopover] = useState(null)

  // Parsing y validación de inputs
  const sueldoParsed = useMemo(() => {
    const parsed = parsearMoneda(sueldoMensual) || 0
    return parsed > 0 ? Math.min(parsed, 999999) : 0 // Límite máximo razonable
  }, [sueldoMensual])

  const fechaIngresoParsed = useMemo(() => {
    if (!fechaIngreso) return null
    const fecha = new Date(fechaIngreso)
    return isNaN(fecha.getTime()) ? null : fecha
  }, [fechaIngreso])

  // Cálculo principal (memoizado para performance)
  const calculoCompleto = useMemo(() => {
    if (sueldoParsed <= 0) return null
    
    try {
      return calcularAguinaldoCompleto({
        sueldoMensual: sueldoParsed,
        diasAguinaldo,
        fechaIngreso: fechaIngresoParsed,
        pagarJuntoNomina
      })
    } catch (error) {
      console.error('Error en cálculo:', error)
      return null
    }
  }, [sueldoParsed, diasAguinaldo, fechaIngresoParsed, pagarJuntoNomina])

  // Formatear input de sueldo con separadores de miles
  const handleSueldoChange = useCallback((e) => {
    const value = e.target.value
    const numero = parsearMoneda(value)
    
    if (numero === 0 && value !== '') {
      setSueldoMensual(value) // Mantener valor mientras escriben
    } else {
      setSueldoMensual(formatearNumero(numero, 0))
    }
  }, [])

  // Banderas inteligentes
  const banderasInteligentes = useMemo(() => {
    if (!calculoCompleto) return []
    
    const banderas = []
    const hoy = new Date()
    const esEnero2025 = hoy.getFullYear() === 2025 && hoy.getMonth() === 0
    const esPagoTardio = hoy > new Date(2025, 1, 1) // después 01-feb-2025
    
    if (esEnero2025) {
      banderas.push({
        tipo: 'info',
        icono: Calendar,
        mensaje: 'Cálculo para enero 2025 - aguinaldo vigente'
      })
    }
    
    if (esPagoTardio) {
      banderas.push({
        tipo: 'warning',
        icono: AlertCircle,
        mensaje: 'Pago después del 01-feb: puede generar recargos'
      })
    }
    
    if (calculoCompleto.comparacionMensual.sinAguinaldo.subsidio.aplicaSubsidio) {
      banderas.push({
        tipo: 'success',
        icono: CheckCircle,
        mensaje: 'Aplica subsidio al empleo - menor carga fiscal'
      })
    }
    
    return banderas
  }, [calculoCompleto])

  const toggleAccordion = () => setAccordionOpen(!accordionOpen)
  
  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId)
  }

  const togglePopover = (popoverId) => {
    setActivePopover(activePopover === popoverId ? null : popoverId)
  }

  return (
    <div className="space-y-6">
      {/* Inputs principales */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {sueldoParsed <= 0 && sueldoMensual && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-amber-700">
              Ingresa un sueldo mensual válido para ver los cálculos
            </span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sueldo mensual */}
          <div>
            <Label htmlFor="sueldo-mensual" className="text-sm font-medium text-gray-700 mb-2 block">
              Sueldo mensual bruto *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="sueldo-mensual"
                type="text"
                placeholder="15,000"
                value={sueldoMensual}
                onChange={handleSueldoChange}
                className="pl-8 text-right"
              />
            </div>
          </div>

          {/* Días de aguinaldo */}
          <div>
            <Label htmlFor="dias-aguinaldo" className="text-sm font-medium text-gray-700 mb-2 block">
              Días de aguinaldo
            </Label>
            <Input
              id="dias-aguinaldo"
              type="number"
              min="15"
              max="365"
              value={diasAguinaldo}
              onChange={(e) => setDiasAguinaldo(parseInt(e.target.value) || 15)}
              className="text-right"
            />
          </div>

          {/* Fecha de ingreso */}
          <div>
            <Label htmlFor="fecha-ingreso" className="text-sm font-medium text-gray-700 mb-2 block">
              Fecha de contratación (opcional)
            </Label>
            <Input
              id="fecha-ingreso"
              type="date"
              value={fechaIngreso}
              onChange={(e) => setFechaIngreso(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Pagar junto con nómina */}
          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="pagar-junto-nomina"
              checked={pagarJuntoNomina}
              onCheckedChange={setPagarJuntoNomina}
            />
            <Label htmlFor="pagar-junto-nomina" className="text-sm text-gray-700">
              Pagar junto con nómina de diciembre
            </Label>
          </div>
        </div>
      </div>

      {/* Banderas inteligentes */}
      {banderasInteligentes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {banderasInteligentes.map((bandera, index) => {
            const Icon = bandera.icono
            const colorClasses = {
              info: 'bg-blue-50 text-blue-700 border-blue-200',
              warning: 'bg-amber-50 text-amber-700 border-amber-200',
              success: 'bg-green-50 text-green-700 border-green-200'
            }
            
            return (
              <div key={index} className={`flex items-center space-x-2 px-3 py-2 rounded-full border text-sm ${colorClasses[bandera.tipo]}`}>
                <Icon className="w-4 h-4" />
                <span>{bandera.mensaje}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Resultado principal (Capa 1) */}
      {calculoCompleto && (
        <div className="bg-white rounded-lg shadow-sm border lg:sticky lg:top-4 lg:z-10" data-result-summary>
          <div className="p-6 text-center">
            <div className="mb-2">
              <div className="text-3xl font-bold text-green-600">
                {formatearMoneda(calculoCompleto.calculoISR.aguinaldoNeto)}
              </div>
              <div className="text-lg font-medium text-gray-900">
                Aguinaldo neto estimado
              </div>
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                Bruto {formatearMoneda(calculoCompleto.calculoISR.aguinaldoBruto)} – 
                ISR {formatearMoneda(calculoCompleto.calculoISR.isrAguinaldo)} 
                (exento {formatearMoneda(calculoCompleto.calculoISR.parteExenta)})
              </div>
            </div>
          </div>

          {/* Chips de factores (Capa 2) */}
          <div className="px-6 pb-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {/* Chip: Exento 30 UMA */}
              <div className="relative">
                <button
                  onClick={() => togglePopover('exento')}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setActivePopover(null)
                  }}
                  aria-expanded={activePopover === 'exento'}
                  aria-describedby={activePopover === 'exento' ? 'popover-exento' : undefined}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span>Exento 30 UMA</span>
                  <Info className="w-3 h-3" />
                </button>
                
                {activePopover === 'exento' && (
                  <div 
                    id="popover-exento"
                    role="tooltip"
                    className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg p-3 w-64 z-10"
                  >
                    <div className="text-xs text-gray-700 space-y-1">
                      <p><strong>30 UMA = {formatearMoneda(FISCAL_CONSTANTS_2025.LIMITE_EXENTO_AGUINALDO)}</strong></p>
                      <p>Parte del aguinaldo exenta de ISR según artículo 93 fracción XXVIII LISR.</p>
                      <p>UMA 2025: ${FISCAL_CONSTANTS_2025.UMA_DIARIA}/día</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Chip: Gravado */}
              <div className="relative">
                <button
                  onClick={() => togglePopover('gravado')}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs hover:bg-orange-100 transition-colors"
                >
                  <span>Gravado {formatearMoneda(calculoCompleto.calculoISR.parteGravada)}</span>
                  <Info className="w-3 h-3" />
                </button>
                
                {activePopover === 'gravado' && (
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg p-3 w-64 z-10">
                    <div className="text-xs text-gray-700 space-y-1">
                      <p><strong>Parte gravada del aguinaldo</strong></p>
                      <p>Excedente de {formatearMoneda(FISCAL_CONSTANTS_2025.LIMITE_EXENTO_AGUINALDO)} sujeto a ISR.</p>
                      <p>Esta cantidad se suma al ingreso mensual para calcular el ISR diferencial.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Chip: Método diferencial */}
              <div className="relative">
                <button
                  onClick={() => togglePopover('metodo')}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs hover:bg-purple-100 transition-colors"
                >
                  <span>Método diferencial</span>
                  <Info className="w-3 h-3" />
                </button>
                
                {activePopover === 'metodo' && (
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg p-3 w-64 z-10">
                    <div className="text-xs text-gray-700 space-y-1">
                      <p><strong>Artículo 96 LISR</strong></p>
                      <p>Se calcula ISR del mes normal vs mes + aguinaldo.</p>
                      <p>La diferencia es el ISR a retener del aguinaldo.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Chip: Subsidio */}
              <div className="relative">
                <button
                  onClick={() => togglePopover('subsidio')}
                  className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition-colors ${
                    calculoCompleto.comparacionMensual.sinAguinaldo.subsidio.aplicaSubsidio
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>
                    Subsidio: {calculoCompleto.comparacionMensual.sinAguinaldo.subsidio.aplicaSubsidio ? 'aplica' : 'no aplica'}
                  </span>
                  <Info className="w-3 h-3" />
                </button>
                
                {activePopover === 'subsidio' && (
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg p-3 w-64 z-10">
                    <div className="text-xs text-gray-700 space-y-1">
                      <p><strong>Subsidio al empleo</strong></p>
                      <p>Aplica para ingresos ≤ $7,382.33 mensuales.</p>
                      <p>Reduce el ISR mensual según tabla de subsidios.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result Cards */}
      {calculoCompleto && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Resultado neto */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Resultado neto</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Neto</span>
                <span className="font-semibold text-green-600">
                  {formatearMoneda(calculoCompleto.calculoISR.aguinaldoNeto)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bruto</span>
                <span className="font-medium">
                  {formatearMoneda(calculoCompleto.calculoISR.aguinaldoBruto)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Exento</span>
                <span className="font-medium text-blue-600">
                  {formatearMoneda(calculoCompleto.calculoISR.parteExenta)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gravado</span>
                <span className="font-medium">
                  {formatearMoneda(calculoCompleto.calculoISR.parteGravada)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">ISR aguinaldo</span>
                <span className="font-medium text-red-600">
                  {formatearMoneda(calculoCompleto.calculoISR.isrAguinaldo)}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Comparación del mes */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Comparación del mes</h3>
            </div>
            
            <div className="space-y-4">
              {/* Sin aguinaldo */}
              <div>
                <div className="text-xs font-medium text-gray-500 mb-2">Sin aguinaldo</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ingreso</span>
                    <span>{formatearMoneda(calculoCompleto.comparacionMensual.sinAguinaldo.ingreso)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ISR</span>
                    <span>{formatearMoneda(calculoCompleto.comparacionMensual.sinAguinaldo.isr)}</span>
                  </div>
                </div>
              </div>

              {/* Con aguinaldo */}
              <div className="border-t pt-3">
                <div className="text-xs font-medium text-gray-500 mb-2">Con aguinaldo</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ingreso</span>
                    <span>{formatearMoneda(calculoCompleto.comparacionMensual.conAguinaldo.ingreso)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ISR</span>
                    <span>{formatearMoneda(calculoCompleto.comparacionMensual.conAguinaldo.isr)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-red-600">
                    <span>Diferencia</span>
                    <span>+{formatearMoneda(calculoCompleto.comparacionMensual.conAguinaldo.diferencia)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Inspector fiscal (solo Estándar/Experto) */}
          {(complexityLevel === 'estandar' || complexityLevel === 'experto') && calculoCompleto.calculoISR.metodoDiferencial && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Inspector fiscal</h3>
              </div>
              
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <div className="text-gray-500 mb-1">Tarifa aplicada:</div>
                  <div className="bg-gray-50 p-2 rounded">
                    {formatearMoneda(calculoCompleto.calculoISR.metodoDiferencial.calculoConAguinaldo.tarifa.desde)} - {
                      calculoCompleto.calculoISR.metodoDiferencial.calculoConAguinaldo.tarifa.hasta === Infinity 
                        ? 'en adelante' 
                        : formatearMoneda(calculoCompleto.calculoISR.metodoDiferencial.calculoConAguinaldo.tarifa.hasta)
                    }
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-500 mb-1">Fórmula aplicada:</div>
                  <div className="bg-gray-50 p-2 rounded space-y-1">
                    <div>Cuota fija: {formatearMoneda(calculoCompleto.calculoISR.metodoDiferencial.calculoConAguinaldo.tarifa.cuotaFija)}</div>
                    <div>Excedente: {formatearMoneda(calculoCompleto.calculoISR.metodoDiferencial.calculoConAguinaldo.excedenteLimite)}</div>
                    <div>Tasa: {(calculoCompleto.calculoISR.metodoDiferencial.calculoConAguinaldo.tarifa.excedente * 100).toFixed(2)}%</div>
                    <div>Subsidio: {formatearMoneda(calculoCompleto.calculoISR.metodoDiferencial.calculoConAguinaldo.subsidio.montoSubsidio)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slider de complejidad */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Nivel de detalle:</span>
          <div className="flex items-center space-x-1">
            {Object.entries(COMPLEXITY_LEVELS).map(([key, level]) => (
              <button
                key={key}
                onClick={() => setComplexityLevel(level.value)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  complexityLevel === level.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accordion "Ver cómo se calculó" (Capa 3) */}
      {calculoCompleto && (complexityLevel === 'estandar' || complexityLevel === 'experto') && (
        <div className="bg-white rounded-lg shadow-sm border">
          <button
            onClick={toggleAccordion}
            aria-expanded={accordionOpen}
            aria-controls="calculation-details"
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="font-medium text-gray-900">Ver cómo se calculó</span>
            {accordionOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {accordionOpen && (
            <div id="calculation-details" className="border-t" role="region" aria-label="Detalles del cálculo">
              {/* Botón "Volver a resultados" para móvil */}
              <div className="p-4 border-b bg-gray-50 lg:hidden">
                <Button
                  onClick={() => {
                    setAccordionOpen(false)
                    document.querySelector('[data-result-summary]')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  ← Volver a resultados
                </Button>
              </div>
              
              {/* Sección 1: Entradas y supuestos */}
              <div className="border-b">
                <button
                  onClick={() => toggleSection('entradas')}
                  className="w-full px-6 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium">1. Entradas y supuestos</span>
                  {activeSection === 'entradas' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                {activeSection === 'entradas' && (
                  <div className="px-6 pb-4 text-sm space-y-2">
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded">
                      <div>
                        <div className="text-gray-500">Sueldo mensual:</div>
                        <div className="font-medium">{formatearMoneda(sueldoParsed)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Días aguinaldo:</div>
                        <div className="font-medium">{diasAguinaldo} días</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Fecha ingreso:</div>
                        <div className="font-medium">
                          {fechaIngresoParsed ? fechaIngresoParsed.toLocaleDateString('es-MX') : 'Año completo'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Junto con nómina:</div>
                        <div className="font-medium">{pagarJuntoNomina ? 'Sí' : 'No'}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sección 2: Aguinaldo */}
              <div className="border-b">
                <button
                  onClick={() => toggleSection('aguinaldo')}
                  className="w-full px-6 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium">2. Cálculo del aguinaldo</span>
                  {activeSection === 'aguinaldo' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                {activeSection === 'aguinaldo' && (
                  <div className="px-6 pb-4 text-sm space-y-3">
                    <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                      <div>Salario diario = {formatearMoneda(sueldoParsed)} ÷ 30.4167 = {formatearMoneda(calculoCompleto.aguinaldoBase.salarioDiario)}</div>
                      <div>Factor proporcional = {calculoCompleto.aguinaldoBase.diasTrabajados} ÷ 365 = {calculoCompleto.aguinaldoBase.factorProporcional.toFixed(4)}</div>
                      <div>Aguinaldo = {formatearMoneda(calculoCompleto.aguinaldoBase.salarioDiario)} × {diasAguinaldo} × {calculoCompleto.aguinaldoBase.factorProporcional.toFixed(4)}</div>
                      <div className="font-bold">= {formatearMoneda(calculoCompleto.calculoISR.aguinaldoBruto)}</div>
                    </div>
                    
                    <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded">
                      <strong>Base legal:</strong> Artículo 87 LFT - Aguinaldo equivalente a 15 días de salario como mínimo.
                    </div>
                  </div>
                )}
              </div>

              {/* Sección 3: Exento vs gravado */}
              <div className="border-b">
                <button
                  onClick={() => toggleSection('exencion')}
                  className="w-full px-6 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium">3. Exención vs parte gravada</span>
                  {activeSection === 'exencion' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                {activeSection === 'exencion' && (
                  <div className="px-6 pb-4 text-sm space-y-3">
                    <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                      <div>Límite exento (30 UMA) = {FISCAL_CONSTANTS_2025.UMA_DIARIA} × 30 = {formatearMoneda(FISCAL_CONSTANTS_2025.LIMITE_EXENTO_AGUINALDO)}</div>
                      <div>Parte exenta = min({formatearMoneda(calculoCompleto.calculoISR.aguinaldoBruto)}, {formatearMoneda(FISCAL_CONSTANTS_2025.LIMITE_EXENTO_AGUINALDO)}) = {formatearMoneda(calculoCompleto.calculoISR.parteExenta)}</div>
                      <div>Parte gravada = {formatearMoneda(calculoCompleto.calculoISR.aguinaldoBruto)} - {formatearMoneda(calculoCompleto.calculoISR.parteExenta)} = {formatearMoneda(calculoCompleto.calculoISR.parteGravada)}</div>
                    </div>
                    
                    <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded">
                      <strong>Base legal:</strong> Artículo 93 fracción XXVIII LISR - Exención hasta 30 veces la UMA vigente.
                    </div>
                  </div>
                )}
              </div>

              {/* Sección 4: ISR del aguinaldo */}
              {calculoCompleto.calculoISR.parteGravada > 0 && (
                <div className="border-b">
                  <button
                    onClick={() => toggleSection('isr')}
                    className="w-full px-6 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium">4. ISR del aguinaldo (método diferencial)</span>
                    {activeSection === 'isr' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  {activeSection === 'isr' && (
                    <div className="px-6 pb-4 text-sm space-y-3">
                      <div className="bg-gray-50 p-3 rounded font-mono text-xs space-y-1">
                        <div>ISR mes normal = {formatearMoneda(calculoCompleto.calculoISR.metodoDiferencial.isrSinAguinaldo)}</div>
                        <div>ISR mes + aguinaldo = {formatearMoneda(calculoCompleto.calculoISR.metodoDiferencial.isrConAguinaldo)}</div>
                        <div className="font-bold">ISR del aguinaldo = {formatearMoneda(calculoCompleto.calculoISR.metodoDiferencial.isrConAguinaldo)} - {formatearMoneda(calculoCompleto.calculoISR.metodoDiferencial.isrSinAguinaldo)} = {formatearMoneda(calculoCompleto.calculoISR.isrAguinaldo)}</div>
                      </div>
                      
                      <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded">
                        <strong>Base legal:</strong> Artículo 96 LISR - Método diferencial para calcular ISR de gratificaciones anuales.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sección 5: Comparación final */}
              <div>
                <button
                  onClick={() => toggleSection('comparacion')}
                  className="w-full px-6 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium">5. Comparación e impacto fiscal</span>
                  {activeSection === 'comparacion' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                {activeSection === 'comparacion' && (
                  <div className="px-6 pb-4 text-sm space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-3 rounded">
                        <div className="text-green-700 font-medium mb-2">Ingreso adicional neto</div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatearMoneda(calculoCompleto.calculoISR.aguinaldoNeto)}
                        </div>
                      </div>
                      
                      <div className="bg-red-50 p-3 rounded">
                        <div className="text-red-700 font-medium mb-2">ISR adicional</div>
                        <div className="text-2xl font-bold text-red-600">
                          {formatearMoneda(calculoCompleto.calculoISR.isrAguinaldo)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      Tasa efectiva de ISR sobre aguinaldo: {
                        calculoCompleto.calculoISR.aguinaldoBruto > 0 
                          ? ((calculoCompleto.calculoISR.isrAguinaldo / calculoCompleto.calculoISR.aguinaldoBruto) * 100).toFixed(2)
                          : '0.00'
                      }%
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Click fuera para cerrar popovers */}
      {activePopover && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setActivePopover(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setActivePopover(null)
            }
          }}
          aria-label="Cerrar información adicional"
        />
      )}

      {/* Disclaimer legal */}
      <div className="text-center">
        <div className="max-w-2xl mx-auto bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-800 space-y-1">
              <p className="font-medium">
                Este cálculo puede contener errores y es solo una estimación.
              </p>
              <p>
                Consulta un contador profesional para el cálculo preciso de tu aguinaldo e ISR.
              </p>
              <p className="text-amber-700">
                Cálculo informativo con base en LISR (art. 93 y 96), RLISR (art. 174) y UMA vigente. Verifica con nómina.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}