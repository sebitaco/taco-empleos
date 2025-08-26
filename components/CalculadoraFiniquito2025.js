'use client';

import { useState, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronUp, Info, Calculator, Calendar, DollarSign, AlertCircle, Settings } from 'lucide-react';

/**
 * Configuración de constantes oficiales para finiquitos 2025
 */
export const FINIQUITO_2025 = {
  SALARIO_MINIMO_GENERAL_DIARIO: 278.80,      // vigente 2025
  UMA_DIARIA: 113.14,                         // vigente desde 01-feb-2025
  UMA_MENSUAL: 3439.46,                       // útil para referencias, no para exenciones
  FACTOR_MENSUALIZACION: 30.4,                // para estimar "mensual"
  FACTOR_DIARIO: 30,                          // divisor estándar mensual → diario
  EXENTO_AGUINALDO_UMA: 30,                   // tope exento = 30 × UMA DIARIA
  EXENTO_PRIMA_VACACIONAL_UMA: 15,            // tope exento = 15 × UMA DIARIA
  EXENTO_INDEMNIZACIONES_UMA_POR_ANIO: 90,    // por año de servicio
  TOPE_PA_SALARIO_MINIMO_VECES: 2             // prima de antigüedad tope 2×SMG
};

/**
 * Tabla ISR 2025 - Tarifas mensuales
 */
const ISR_TABLA_2025 = [
  { li: 0.01, ls: 746.04, cuota: 0.00, porcentaje: 1.92 },
  { li: 746.05, ls: 6332.05, cuota: 14.32, porcentaje: 6.40 },
  { li: 6332.06, ls: 11128.01, cuota: 371.83, porcentaje: 10.88 },
  { li: 11128.02, ls: 12935.82, cuota: 893.63, porcentaje: 16.00 },
  { li: 12935.83, ls: 15487.71, cuota: 1182.88, porcentaje: 21.36 },
  { li: 15487.72, ls: 31236.49, cuota: 1727.83, porcentaje: 23.52 },
  { li: 31236.50, ls: 49233.00, cuota: 5432.92, porcentaje: 30.00 },
  { li: 49233.01, ls: 93993.90, cuota: 10831.87, porcentaje: 32.00 },
  { li: 93993.91, ls: 125325.20, cuota: 25135.60, porcentaje: 34.00 },
  { li: 125325.21, ls: Infinity, cuota: 35788.35, porcentaje: 35.00 }
];

/**
 * Calcula días entre dos fechas (inclusivo)
 * @param {string} fechaInicio - Fecha en formato YYYY-MM-DD
 * @param {string} fechaFin - Fecha en formato YYYY-MM-DD
 * @returns {number} Número de días incluyendo extremos
 */
function diasEntre(fechaInicio, fechaFin) {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const diferencia = fin.getTime() - inicio.getTime();
  return Math.floor(diferencia / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Convierte días totales a años de antigüedad
 * @param {number} diasTotales - Total de días trabajados
 * @returns {number} Años de antigüedad
 */
function antiguedadAnios(diasTotales) {
  return Math.floor(diasTotales / 365);
}

/**
 * Calcula días transcurridos en el año de salida
 * @param {string} fechaSalida - Fecha de salida YYYY-MM-DD
 * @returns {number} Días transcurridos desde inicio de año
 */
function diasTranscurridosAnioSalida(fechaSalida) {
  const salida = new Date(fechaSalida);
  const inicioAnio = new Date(salida.getFullYear(), 0, 1);
  return diasEntre(inicioAnio.toISOString().split('T')[0], fechaSalida);
}

/**
 * Calcula aguinaldo proporcional
 * @param {number} salarioDiario - Salario diario base
 * @param {number} diasAnio - Días trabajados en el año
 * @param {number} diasAguinaldoAnual - Días de aguinaldo por año
 * @returns {number} Monto de aguinaldo proporcional
 */
function calcularAguinaldoProporcional(salarioDiario, diasAnio, diasAguinaldoAnual) {
  return (diasAguinaldoAnual / 365) * diasAnio * salarioDiario;
}

/**
 * Calcula vacaciones proporcionales
 * @param {number} salarioDiario - Salario diario base
 * @param {number} diasAnio - Días trabajados en el año
 * @param {number} diasVacacionesAnuales - Días de vacaciones por año
 * @returns {number} Monto de vacaciones proporcionales
 */
function calcularVacacionesProporcionales(salarioDiario, diasAnio, diasVacacionesAnuales) {
  return (diasVacacionesAnuales / 365) * diasAnio * salarioDiario;
}

/**
 * Calcula prima vacacional
 * @param {number} montoVacaciones - Monto de vacaciones
 * @param {number} porcentaje - Porcentaje de prima vacacional
 * @returns {number} Monto de prima vacacional
 */
function calcularPrimaVacacional(montoVacaciones, porcentaje) {
  return montoVacaciones * (porcentaje / 100);
}

/**
 * Calcula prima de antigüedad
 * @param {number} salarioDiario - Salario diario base
 * @param {number} anios - Años de antigüedad
 * @param {string} tipoTerminacion - Tipo de terminación laboral
 * @returns {number} Monto de prima de antigüedad
 */
function calcularPrimaAntiguedad(salarioDiario, anios, tipoTerminacion) {
  // Tope de salario para PA
  const salarioTope = Math.min(salarioDiario, FINIQUITO_2025.TOPE_PA_SALARIO_MINIMO_VECES * FINIQUITO_2025.SALARIO_MINIMO_GENERAL_DIARIO);
  
  // Verificar si aplica prima de antigüedad
  const aplicaPA = (
    (tipoTerminacion === 'RENUNCIA' && anios >= 15) ||
    ['DESPIDO_JUSTIFICADO', 'DESPIDO_INJUSTIFICADO', 'MUTUO_ACUERDO'].includes(tipoTerminacion)
  );
  
  return aplicaPA ? 12 * anios * salarioTope : 0;
}

/**
 * Calcula indemnizaciones por despido injustificado
 * @param {number} sdi - Salario diario integrado o base
 * @param {number} anios - Años de antigüedad
 * @param {string} tipoTerminacion - Tipo de terminación
 * @returns {object} Objeto con indemnizaciones
 */
function calcularIndemnizaciones(sdi, anios, tipoTerminacion) {
  if (tipoTerminacion !== 'DESPIDO_INJUSTIFICADO') {
    return { tresMeses: 0, veinteDias: 0 };
  }
  
  return {
    tresMeses: 90 * sdi,
    veinteDias: 20 * anios * sdi
  };
}

/**
 * Calcula ISR mensual según tabla 2025
 * @param {number} ingresoMensual - Ingreso mensual gravable
 * @returns {number} ISR calculado
 */
function calcularISRMensual(ingresoMensual) {
  if (ingresoMensual <= 0) return 0;
  
  const rango = ISR_TABLA_2025.find(r => ingresoMensual >= r.li && ingresoMensual <= r.ls);
  if (!rango) return 0;
  
  const excedente = ingresoMensual - rango.li + 0.01;
  const impuestoMarginal = excedente * (rango.porcentaje / 100);
  
  return rango.cuota + impuestoMarginal;
}

/*
 * PRUEBAS RÁPIDAS DE VALIDACIÓN:
 * 
 * Test A: salarioMensual=20,000 → salarioDiario=666.67
 * - Sin indemnizaciones, resultados deben coincidir con versión diaria cuando daily=666.67
 * - Aguinaldo proporcional y vacaciones calculados sobre 666.67
 * 
 * Test B: salarioMensualIntegrado=24,000 → SDI=800
 * - Con DESPIDO_INJUSTIFICADO, indemnizaciones deben usar 800 diario (no 666.67)
 * - 3 meses = 90 * 800 = 72,000; 20 días/año = 20 * años * 800
 * 
 * Test C: tipo=DESPIDO_INJUSTIFICADO sin SMI/SDI
 * - Mostrar disclaimer SDI explicando cálculo con base
 * - En RENUNCIA no mostrar disclaimer bajo ninguna circunstancia
 */

/**
 * Componente principal - Calculadora de Liquidación Laboral 2025
 */
export default function CalculadoraFiniquito2025() {
  // Estados principales - ahora con salario mensual
  const [salarioMensual, setSalarioMensual] = useState('');
  const [salarioMensualIntegrado, setSalarioMensualIntegrado] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [diasPendientes, setDiasPendientes] = useState('0');
  const [diasAguinaldoAnual, setDiasAguinaldoAnual] = useState('15');
  const [diasVacacionesAnual, setDiasVacacionesAnual] = useState('12');
  const [primaVacacionalPorcentaje, setPrimaVacacionalPorcentaje] = useState('25');
  const [tipoTerminacion, setTipoTerminacion] = useState('RENUNCIA');
  const [ultimoSalarioMensual, setUltimoSalarioMensual] = useState('');
  
  // Overrides avanzados
  const [mostrarAvanzado, setMostrarAvanzado] = useState(false);
  const [overrideSalarioDiario, setOverrideSalarioDiario] = useState('');
  const [overrideSDI, setOverrideSDI] = useState('');
  
  // Estados de UI
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [popoverActivo, setPopoverActivo] = useState(null);

  // Cálculos principales con lógica monthly-first
  const calculos = useMemo(() => {
    // Parsear entradas
    const salMensual = parseFloat(salarioMensual) || 0;
    const salMensualInt = parseFloat(salarioMensualIntegrado) || 0;
    const diasPend = parseInt(diasPendientes) || 0;
    const diasAguinaldo = parseInt(diasAguinaldoAnual) || 15;
    const diasVacaciones = parseInt(diasVacacionesAnual) || 12;
    const primaPorcentaje = parseFloat(primaVacacionalPorcentaje) || 25;
    
    // Derivar salarios diarios
    const salarioDiarioCalculado = salMensual / FINIQUITO_2025.FACTOR_DIARIO;
    const sdiCalculado = salMensualInt ? salMensualInt / FINIQUITO_2025.FACTOR_DIARIO : salarioDiarioCalculado;
    
    // Aplicar overrides si existen
    const salDiario = parseFloat(overrideSalarioDiario) || salarioDiarioCalculado;
    const salDiarioInt = parseFloat(overrideSDI) || sdiCalculado;
    
    // Validaciones básicas
    if (!salMensual || !fechaIngreso || !fechaSalida) {
      return {
        valido: false,
        mensaje: 'Ingresa tu salario mensual y fechas laborales'
      };
    }
    
    if (new Date(fechaSalida) < new Date(fechaIngreso)) {
      return {
        valido: false,
        mensaje: 'Verifica las fechas: la salida debe ser posterior al ingreso'
      };
    }
    
    // Verificar si está por debajo del mínimo
    const salarioMinimoMensual = FINIQUITO_2025.SALARIO_MINIMO_GENERAL_DIARIO * FINIQUITO_2025.FACTOR_MENSUALIZACION;
    const bajoPorDebajoDeLey = salMensual < salarioMinimoMensual;
    
    // Validación especial para despido injustificado
    const requiereSDI = tipoTerminacion === 'DESPIDO_INJUSTIFICADO';
    const tieneSDIReal = salMensualInt > 0 || parseFloat(overrideSDI) > 0;
    
    // Cálculos de tiempo
    const diasTotales = diasEntre(fechaIngreso, fechaSalida);
    const anios = antiguedadAnios(diasTotales);
    const diasEnAnioSalida = diasTranscurridosAnioSalida(fechaSalida);
    
    // Conceptos del finiquito
    const sueldosPendientes = salDiario * diasPend;
    const aguinaldoProporcional = calcularAguinaldoProporcional(salDiario, diasEnAnioSalida, diasAguinaldo);
    const vacacionesProporcionales = calcularVacacionesProporcionales(salDiario, diasEnAnioSalida, diasVacaciones);
    const primaVacacional = calcularPrimaVacacional(vacacionesProporcionales, primaPorcentaje);
    const primaAntiguedad = calcularPrimaAntiguedad(salDiario, anios, tipoTerminacion);
    
    // Para indemnizaciones, usar SDI si está disponible, sino salario base
    const salarioParaIndemnizacion = requiereSDI ? salDiarioInt : salDiario;
    const indemnizaciones = calcularIndemnizaciones(salarioParaIndemnizacion, anios, tipoTerminacion);
    
    // Subtotal
    const subtotal = sueldosPendientes + aguinaldoProporcional + vacacionesProporcionales + 
                    primaVacacional + primaAntiguedad + indemnizaciones.tresMeses + indemnizaciones.veinteDias;
    
    // Exenciones (usando UMA DIARIA)
    const exentoAguinaldo = Math.min(aguinaldoProporcional, FINIQUITO_2025.UMA_DIARIA * FINIQUITO_2025.EXENTO_AGUINALDO_UMA);
    const exentoPrimaVac = Math.min(primaVacacional, FINIQUITO_2025.UMA_DIARIA * FINIQUITO_2025.EXENTO_PRIMA_VACACIONAL_UMA);
    const totalIndemnizaciones = indemnizaciones.tresMeses + indemnizaciones.veinteDias;
    const exentoIndemnizaciones = Math.min(totalIndemnizaciones, FINIQUITO_2025.UMA_DIARIA * FINIQUITO_2025.EXENTO_INDEMNIZACIONES_UMA_POR_ANIO * anios);
    
    const totalExento = exentoAguinaldo + exentoPrimaVac + exentoIndemnizaciones;
    const gravable = Math.max(0, subtotal - totalExento);
    
    // Cálculo de ISR
    const ultimoMensual = parseFloat(ultimoSalarioMensual) || salMensual;
    let isr = 0;
    let metodoISR = '';
    
    if (gravable > ultimoMensual) {
      // Método de tasa efectiva
      const isrUltimoMensual = calcularISRMensual(ultimoMensual);
      const tasaEfectiva = isrUltimoMensual / ultimoMensual;
      isr = gravable * tasaEfectiva;
      metodoISR = 'Tasa efectiva sobre último ordinario';
    } else {
      // Método de tarifa directa
      isr = calcularISRMensual(gravable);
      metodoISR = 'Aplicación directa de tarifa';
    }
    
    const neto = subtotal - isr;
    
    return {
      valido: true,
      diasTotales,
      anios,
      diasEnAnioSalida,
      salarioDiarioCalculado,
      sdiCalculado,
      salDiario,
      salDiarioInt,
      bajoPorDebajoDeLey,
      requiereSDI,
      tieneSDIReal,
      conceptos: {
        sueldosPendientes,
        aguinaldoProporcional,
        vacacionesProporcionales,
        primaVacacional,
        primaAntiguedad,
        indemnizacionTresMeses: indemnizaciones.tresMeses,
        indemnizacionVeinteDias: indemnizaciones.veinteDias
      },
      subtotal,
      exenciones: {
        aguinaldo: exentoAguinaldo,
        primaVacacional: exentoPrimaVac,
        indemnizaciones: exentoIndemnizaciones,
        total: totalExento
      },
      gravable,
      isr,
      metodoISR,
      ultimoMensual,
      neto
    };
  }, [salarioMensual, salarioMensualIntegrado, fechaIngreso, fechaSalida, diasPendientes, 
      diasAguinaldoAnual, diasVacacionesAnual, primaVacacionalPorcentaje, tipoTerminacion, 
      ultimoSalarioMensual, overrideSalarioDiario, overrideSDI]);

  const formatearMoneda = useCallback((cantidad) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(cantidad);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Estimador de Liquidación Laboral 2025
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Conoce tu finiquito aproximado con las reglas fiscales y laborales actuales
        </p>
      </div>

      <div className="md:grid md:grid-cols-[1.2fr_0.8fr] md:gap-8">
        {/* Panel de entrada */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Información salarial
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="salario-mensual" className="block text-sm font-medium text-gray-700 mb-1">
                  Salario mensual bruto *
                </label>
                <input
                  id="salario-mensual"
                  type="number"
                  min="0"
                  step="0.01"
                  value={salarioMensual}
                  onChange={(e) => setSalarioMensual(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="15000.00"
                />
                {calculos.salarioDiarioCalculado > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Equivalente diario: {formatearMoneda(calculos.salarioDiarioCalculado)} (mensual ÷ 30)
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="smi" className="block text-sm font-medium text-gray-700 mb-1">
                  Salario mensual integrado (opcional)
                  <span className="text-xs text-gray-500 ml-1">Para mayor precisión</span>
                </label>
                <input
                  id="smi"
                  type="number"
                  min="0"
                  step="0.01"
                  value={salarioMensualIntegrado}
                  onChange={(e) => setSalarioMensualIntegrado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Incluye prestaciones variables"
                />
                {calculos.sdiCalculado > 0 && salarioMensualIntegrado && (
                  <p className="text-xs text-gray-500 mt-1">
                    SDI diario estimado: {formatearMoneda(calculos.sdiCalculado)}
                  </p>
                )}
              </div>

              {/* Warning si está por debajo del mínimo */}
              {calculos.bajoPorDebajoDeLey && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-800">
                    Tu salario está por debajo del mínimo general 2025 ({formatearMoneda(FINIQUITO_2025.SALARIO_MINIMO_GENERAL_DIARIO * FINIQUITO_2025.FACTOR_MENSUALIZACION)} mensuales).
                    El cálculo continuará pero revisa tu situación laboral.
                  </p>
                </div>
              )}
            </div>

            {/* Accordion de configuración avanzada */}
            <div className="mt-4">
              <button
                onClick={() => setMostrarAvanzado(!mostrarAvanzado)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                aria-expanded={mostrarAvanzado}
              >
                <Settings className="h-4 w-4" />
                <span>Configuración avanzada</span>
                {mostrarAvanzado ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
              
              {mostrarAvanzado && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
                  <div>
                    <label htmlFor="override-diario" className="block text-xs font-medium text-gray-700 mb-1">
                      Sobrescribir salario diario
                    </label>
                    <input
                      id="override-diario"
                      type="number"
                      min="0"
                      step="0.01"
                      value={overrideSalarioDiario}
                      onChange={(e) => setOverrideSalarioDiario(e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      placeholder={`Calculado: ${calculos.salarioDiarioCalculado.toFixed(2)}`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="override-sdi" className="block text-xs font-medium text-gray-700 mb-1">
                      Sobrescribir SDI diario
                    </label>
                    <input
                      id="override-sdi"
                      type="number"
                      min="0"
                      step="0.01"
                      value={overrideSDI}
                      onChange={(e) => setOverrideSDI(e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      placeholder={`Calculado: ${calculos.sdiCalculado.toFixed(2)}`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="ultimo-mensual" className="block text-xs font-medium text-gray-700 mb-1">
                      Último salario mensual ordinario
                    </label>
                    <input
                      id="ultimo-mensual"
                      type="number"
                      min="0"
                      step="0.01"
                      value={ultimoSalarioMensual}
                      onChange={(e) => setUltimoSalarioMensual(e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      placeholder="Para cálculo de ISR"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Fechas y tipo de salida
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fecha-ingreso" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de ingreso *
                </label>
                <input
                  id="fecha-ingreso"
                  type="date"
                  value={fechaIngreso}
                  onChange={(e) => setFechaIngreso(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="fecha-salida" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de salida *
                </label>
                <input
                  id="fecha-salida"
                  type="date"
                  value={fechaSalida}
                  onChange={(e) => setFechaSalida(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="tipo-terminacion" className="block text-sm font-medium text-gray-700 mb-1">
                Razón de la separación laboral
              </label>
              <select
                id="tipo-terminacion"
                value={tipoTerminacion}
                onChange={(e) => setTipoTerminacion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="RENUNCIA">Renuncia voluntaria</option>
                <option value="DESPIDO_JUSTIFICADO">Terminación con causa justificada</option>
                <option value="DESPIDO_INJUSTIFICADO">Terminación sin causa justificada</option>
                <option value="MUTUO_ACUERDO">Convenio de terminación</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Prestaciones y días laborados
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dias-pendientes" className="block text-sm font-medium text-gray-700 mb-1">
                  Días trabajados sin pagar
                </label>
                <input
                  id="dias-pendientes"
                  type="number"
                  min="0"
                  value={diasPendientes}
                  onChange={(e) => setDiasPendientes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="dias-aguinaldo" className="block text-sm font-medium text-gray-700 mb-1">
                  Días de aguinaldo anuales
                </label>
                <input
                  id="dias-aguinaldo"
                  type="number"
                  min="15"
                  value={diasAguinaldoAnual}
                  onChange={(e) => setDiasAguinaldoAnual(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="dias-vacaciones" className="block text-sm font-medium text-gray-700 mb-1">
                  Días de vacaciones anuales
                </label>
                <input
                  id="dias-vacaciones"
                  type="number"
                  min="12"
                  value={diasVacacionesAnual}
                  onChange={(e) => setDiasVacacionesAnual(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="prima-vacacional" className="block text-sm font-medium text-gray-700 mb-1">
                  Prima vacacional (%)
                </label>
                <input
                  id="prima-vacacional"
                  type="number"
                  min="25"
                  value={primaVacacionalPorcentaje}
                  onChange={(e) => setPrimaVacacionalPorcentaje(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Panel de resultados */}
        <div className="mt-6 md:mt-0">
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 md:sticky md:top-4">
            {!calculos.valido ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Completa tus datos
                </h3>
                <p className="text-gray-600 text-sm">
                  {calculos.mensaje}
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Monto neto estimado
                  </h3>
                  <div className="text-4xl font-bold text-green-600">
                    {formatearMoneda(calculos.neto)}
                  </div>
                  <div className="text-sm text-gray-600 mt-2 flex justify-center gap-3 flex-wrap">
                    <span>Subtotal {formatearMoneda(calculos.subtotal)}</span>
                    <span>•</span>
                    <span>Exento {formatearMoneda(calculos.exenciones.total)}</span>
                    <span>•</span>
                    <span>Gravable {formatearMoneda(calculos.gravable)}</span>
                    <span>•</span>
                    <span>ISR {formatearMoneda(calculos.isr)}</span>
                  </div>
                </div>

                {/* Desglose por concepto */}
                <div className="space-y-3 mb-6">
                  {calculos.conceptos.sueldosPendientes > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Salarios pendientes</span>
                      <span className="text-right">{formatearMoneda(calculos.conceptos.sueldosPendientes)}</span>
                    </div>
                  )}
                  
                  {calculos.conceptos.aguinaldoProporcional > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Aguinaldo proporcional</span>
                      <span className="text-right">{formatearMoneda(calculos.conceptos.aguinaldoProporcional)}</span>
                    </div>
                  )}
                  
                  {calculos.conceptos.vacacionesProporcionales > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Vacaciones proporcionales</span>
                      <span className="text-right">{formatearMoneda(calculos.conceptos.vacacionesProporcionales)}</span>
                    </div>
                  )}
                  
                  {calculos.conceptos.primaVacacional > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Prima vacacional</span>
                      <span className="text-right">{formatearMoneda(calculos.conceptos.primaVacacional)}</span>
                    </div>
                  )}
                  
                  {calculos.conceptos.primaAntiguedad > 0 && (
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="font-medium">Prima de antigüedad</span>
                      <span className="text-right">{formatearMoneda(calculos.conceptos.primaAntiguedad)}</span>
                    </div>
                  )}
                  
                  {calculos.conceptos.indemnizacionTresMeses > 0 && (
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Indemnización constitucional</span>
                      <span className="text-right">{formatearMoneda(calculos.conceptos.indemnizacionTresMeses)}</span>
                    </div>
                  )}
                  
                  {calculos.conceptos.indemnizacionVeinteDias > 0 && (
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Prima de antigüedad (20 días/año)</span>
                      <span className="text-right">{formatearMoneda(calculos.conceptos.indemnizacionVeinteDias)}</span>
                    </div>
                  )}
                </div>

                {/* Disclaimer SDI - SOLO para despido injustificado sin SDI */}
                {calculos.requiereSDI && !calculos.tieneSDIReal && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800">
                      <strong>Nota sobre indemnizaciones:</strong> La ley requiere calcular con el salario diario integrado (SDI). 
                      Como no proporcionaste un salario mensual integrado, usamos tu salario base. 
                      El monto real podría ser mayor si tu SDI incluye prestaciones adicionales.
                    </p>
                  </div>
                )}

                {/* Botón para mostrar detalles */}
                <button
                  onClick={() => setMostrarDetalles(!mostrarDetalles)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <span>Cómo se calculó</span>
                  {mostrarDetalles ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {/* Detalles del cálculo */}
                {mostrarDetalles && (
                  <div className="mt-4 space-y-4 text-sm">
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Datos procesados</h4>
                      <div className="space-y-1 text-gray-600">
                        <div>Salario mensual: {formatearMoneda(parseFloat(salarioMensual) || 0)}</div>
                        <div>Salario diario usado: {formatearMoneda(calculos.salDiario)}</div>
                        {calculos.requiereSDI && (
                          <div>SDI diario usado: {formatearMoneda(calculos.salDiarioInt)}</div>
                        )}
                        <div>Días laborados totales: {calculos.diasTotales.toLocaleString()}</div>
                        <div>Antigüedad: {calculos.anios} años completos</div>
                        <div>Días en {new Date(fechaSalida).getFullYear()}: {calculos.diasEnAnioSalida}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Exenciones fiscales (UMA: ${FINIQUITO_2025.UMA_DIARIA}/día)</h4>
                      <div className="space-y-1 text-gray-600">
                        <div>Aguinaldo exento: {formatearMoneda(calculos.exenciones.aguinaldo)} (tope: 30 UMA)</div>
                        <div>Prima vacacional exenta: {formatearMoneda(calculos.exenciones.primaVacacional)} (tope: 15 UMA)</div>
                        {calculos.exenciones.indemnizaciones > 0 && (
                          <div>Indemnizaciones exentas: {formatearMoneda(calculos.exenciones.indemnizaciones)} (tope: 90 UMA × años)</div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Retención de ISR</h4>
                      <div className="text-gray-600">
                        <div>Método aplicado: {calculos.metodoISR}</div>
                        <div>Base mensual de referencia: {formatearMoneda(calculos.ultimoMensual)}</div>
                        <div>Monto gravable: {formatearMoneda(calculos.gravable)}</div>
                        <div>ISR calculado: {formatearMoneda(calculos.isr)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chips informativos */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button 
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200 transition-colors flex items-center gap-1"
                    onClick={() => setPopoverActivo(popoverActivo === 'prestaciones' ? null : 'prestaciones')}
                  >
                    <Info className="h-3 w-3" />
                    Prestaciones de ley
                  </button>
                  <button 
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200 transition-colors flex items-center gap-1"
                    onClick={() => setPopoverActivo(popoverActivo === 'exenciones' ? null : 'exenciones')}
                  >
                    <Info className="h-3 w-3" />
                    Beneficios fiscales
                  </button>
                  <button 
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs hover:bg-purple-200 transition-colors flex items-center gap-1"
                    onClick={() => setPopoverActivo(popoverActivo === 'antiguedad' ? null : 'antiguedad')}
                  >
                    <Info className="h-3 w-3" />
                    Antigüedad: {calculos.anios} años
                  </button>
                </div>

                {/* Popovers informativos */}
                {popoverActivo === 'prestaciones' && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                    Ajusta los días de aguinaldo y vacaciones según tu contrato colectivo o individual si tienes prestaciones superiores a la ley.
                  </div>
                )}
                
                {popoverActivo === 'exenciones' && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800">
                    Las exenciones 2025 se calculan con UMA diaria ($113.14). Los límites son: aguinaldo 30 UMA, prima vacacional 15 UMA, indemnizaciones 90 UMA por año trabajado.
                  </div>
                )}
                
                {popoverActivo === 'antiguedad' && (
                  <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-800">
                    Tu antigüedad de {calculos.anios} años determina tu derecho a prima de antigüedad {calculos.anios >= 15 ? '(aplica por tener 15+ años)' : '(requiere 15+ años en renuncia)'} y el cálculo de indemnizaciones.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer microcopy */}
      <div className="mt-8 text-center text-xs text-gray-500">
        Estimación informativa con base en reglas vigentes 2025; consulta con un especialista laboral o tu departamento de recursos humanos para confirmar montos exactos.
      </div>
    </div>
  );
}