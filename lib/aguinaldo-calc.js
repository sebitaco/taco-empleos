// Calculadora de Aguinaldo con ISR 2025 - México
// Implementa artículos 93, 96 LISR y artículo 174 RLISR

// Constantes fiscales 2025
export const FISCAL_CONSTANTS_2025 = {
  // UMA (Unidad de Medida y Actualización) vigente 2025
  UMA_DIARIA: 113.62, // INEGI 2025
  UMA_MENSUAL: 3408.6, // UMA diaria × 30
  UMA_ANUAL: 41503.2, // UMA diaria × 365
  
  // Límite exención aguinaldo (30 UMA)
  LIMITE_EXENTO_AGUINALDO: 113.62 * 30, // $3,408.60
  
  // Salarios mínimos (vigentes desde 01-ene-2025)
  SALARIO_MINIMO_GENERAL: 374.89,
  SALARIO_MINIMO_FRONTERA: 562.34,
  
  // Factores para cálculo ISR anual
  FACTOR_ANUAL: 365,
  FACTOR_MENSUAL: 30.4167 // Promedio días por mes
}

// Tabla de ISR Artículo 96 LISR - Tarifas para aguinaldo 2025
export const TABLA_ISR_ARTICULO_96 = [
  { desde: 0.01, hasta: 5952.84, cuotaFija: 0, excedente: 0.0192 },
  { desde: 5952.85, hasta: 50524.92, cuotaFija: 114.29, excedente: 0.064 },
  { desde: 50524.93, hasta: 88793.04, cuotaFija: 2966.91, excedente: 0.1088 },
  { desde: 88793.05, hasta: 103218.00, cuotaFija: 7130.48, excedente: 0.16 },
  { desde: 103218.01, hasta: 123580.20, cuotaFija: 9438.6, excedente: 0.2136 },
  { desde: 123580.21, hasta: 249243.48, cuotaFija: 13787.32, excedente: 0.2352 },
  { desde: 249243.49, hasta: 392841.96, cuotaFija: 43321.44, excedente: 0.30 },
  { desde: 392841.97, hasta: Infinity, cuotaFija: 86400.9, excedente: 0.32 }
]

// Tabla de subsidio al empleo mensual 2025
export const TABLA_SUBSIDIO_EMPLEO = [
  { desde: 0.01, hasta: 1768.96, subsidio: 407.02 },
  { desde: 1768.97, hasta: 2653.38, subsidio: 406.83 },
  { desde: 2653.39, hasta: 3472.84, subsidio: 406.62 },
  { desde: 3472.85, hasta: 3537.87, subsidio: 392.77 },
  { desde: 3537.88, hasta: 4446.15, subsidio: 382.46 },
  { desde: 4446.16, hasta: 4717.18, subsidio: 354.23 },
  { desde: 4717.19, hasta: 5335.42, subsidio: 324.87 },
  { desde: 5335.43, hasta: 6224.67, subsidio: 294.63 },
  { desde: 6224.68, hasta: 7113.90, subsidio: 253.54 },
  { desde: 7113.91, hasta: 7382.33, subsidio: 217.61 },
  { desde: 7382.34, hasta: Infinity, subsidio: 0 }
]

/**
 * Calcula el aguinaldo proporcional según artículo 87 LFT
 * @param {number} sueldoMensual - Sueldo mensual bruto
 * @param {number} diasAguinaldo - Días de aguinaldo (mínimo 15)
 * @param {Date} fechaIngreso - Fecha de ingreso del trabajador
 * @param {Date} fechaCorte - Fecha de corte (default: 31 dic del año actual)
 * @returns {object} Cálculo detallado del aguinaldo
 */
export function calcularAguinaldoBase(sueldoMensual, diasAguinaldo = 15, fechaIngreso = null, fechaCorte = null) {
  if (!fechaCorte) {
    fechaCorte = new Date(new Date().getFullYear(), 11, 31) // 31 dic año actual
  }
  
  const salarioDiario = sueldoMensual / FISCAL_CONSTANTS_2025.FACTOR_MENSUAL
  
  let diasTrabajados = 365
  let factorProporcional = 1
  
  if (fechaIngreso) {
    const inicioAno = new Date(fechaCorte.getFullYear(), 0, 1)
    const fechaIngresoAjustada = fechaIngreso > inicioAno ? fechaIngreso : inicioAno
    
    const diffTime = fechaCorte.getTime() - fechaIngresoAjustada.getTime()
    diasTrabajados = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
    factorProporcional = diasTrabajados / 365
  }
  
  const aguinaldoBruto = salarioDiario * diasAguinaldo * factorProporcional
  
  return {
    salarioDiario,
    diasTrabajados,
    factorProporcional,
    aguinaldoBruto,
    esCompleto: diasTrabajados >= 365
  }
}

/**
 * Calcula ISR mensual normal usando tabla del artículo 96
 * @param {number} ingresoMensual - Ingreso mensual gravable
 * @returns {object} Cálculo ISR mensual
 */
export function calcularISRMensual(ingresoMensual) {
  const ingresoAnual = ingresoMensual * 12
  
  // Buscar tarifa correspondiente
  const tarifa = TABLA_ISR_ARTICULO_96.find(t => 
    ingresoAnual >= t.desde && ingresoAnual <= t.hasta
  )
  
  if (!tarifa) {
    throw new Error('Ingreso fuera de rango de tabla ISR')
  }
  
  const excedenteLimite = Math.max(0, ingresoAnual - tarifa.desde + 0.01)
  const impuestoExcedente = excedenteLimite * tarifa.excedente
  const isrAnual = tarifa.cuotaFija + impuestoExcedente
  const isrMensual = isrAnual / 12
  
  // Subsidio al empleo
  const subsidio = calcularSubsidioEmpleo(ingresoMensual)
  const isrFinal = Math.max(0, isrMensual - subsidio.montoSubsidio)
  
  return {
    ingresoMensual,
    ingresoAnual,
    tarifa,
    excedenteLimite,
    impuestoExcedente,
    isrAnual,
    isrMensual,
    subsidio,
    isrFinal,
    netoMensual: ingresoMensual - isrFinal
  }
}

/**
 * Calcula subsidio al empleo según tabla vigente
 * @param {number} ingresoMensual - Ingreso mensual gravable
 * @returns {object} Cálculo del subsidio
 */
export function calcularSubsidioEmpleo(ingresoMensual) {
  const tarifa = TABLA_SUBSIDIO_EMPLEO.find(t => 
    ingresoMensual >= t.desde && ingresoMensual <= t.hasta
  )
  
  const aplicaSubsidio = ingresoMensual <= 7382.33
  const montoSubsidio = aplicaSubsidio && tarifa ? tarifa.subsidio : 0
  
  return {
    aplicaSubsidio,
    montoSubsidio,
    tarifa
  }
}

/**
 * Calcula ISR del aguinaldo usando método diferencial (artículo 96 LISR)
 * @param {number} sueldoMensual - Sueldo mensual regular
 * @param {number} aguinaldoBruto - Aguinaldo bruto calculado
 * @param {boolean} pagarJuntoNomina - Si se paga junto con nómina de diciembre
 * @returns {object} Cálculo completo ISR aguinaldo
 */
export function calcularISRDeAguinaldo(sueldoMensual, aguinaldoBruto, pagarJuntoNomina = false) {
  // 1. Determinar parte exenta (30 UMA)
  const limiteExento = FISCAL_CONSTANTS_2025.LIMITE_EXENTO_AGUINALDO
  const parteExenta = Math.min(aguinaldoBruto, limiteExento)
  const parteGravada = Math.max(0, aguinaldoBruto - limiteExento)
  
  if (parteGravada <= 0) {
    return {
      aguinaldoBruto,
      parteExenta,
      parteGravada: 0,
      isrAguinaldo: 0,
      aguinaldoNeto: aguinaldoBruto,
      limiteExento,
      metodoDiferencial: null
    }
  }
  
  // 2. Método diferencial (artículo 96 LISR)
  // ISR del mes + aguinaldo
  const ingresoConAguinaldo = sueldoMensual + parteGravada
  const isrConAguinaldo = calcularISRMensual(ingresoConAguinaldo)
  
  // ISR del mes sin aguinaldo
  const isrSinAguinaldo = calcularISRMensual(sueldoMensual)
  
  // Diferencia = ISR a retener del aguinaldo
  const isrAguinaldo = Math.max(0, isrConAguinaldo.isrFinal - isrSinAguinaldo.isrFinal)
  
  const aguinaldoNeto = aguinaldoBruto - isrAguinaldo
  
  return {
    aguinaldoBruto,
    parteExenta,
    parteGravada,
    isrAguinaldo,
    aguinaldoNeto,
    limiteExento,
    metodoDiferencial: {
      ingresoSinAguinaldo: sueldoMensual,
      ingresoConAguinaldo,
      isrSinAguinaldo: isrSinAguinaldo.isrFinal,
      isrConAguinaldo: isrConAguinaldo.isrFinal,
      diferencia: isrAguinaldo,
      calculoSinAguinaldo: isrSinAguinaldo,
      calculoConAguinaldo: isrConAguinaldo
    }
  }
}

/**
 * Cálculo completo de aguinaldo con todos los componentes
 * @param {object} params - Parámetros de entrada
 * @returns {object} Resultado completo
 */
export function calcularAguinaldoCompleto({
  sueldoMensual,
  diasAguinaldo = 15,
  fechaIngreso = null,
  pagarJuntoNomina = false
}) {
  // Validaciones básicas
  if (!sueldoMensual || sueldoMensual <= 0) {
    throw new Error('Sueldo mensual debe ser mayor a cero')
  }
  
  if (diasAguinaldo < 15) {
    throw new Error('Días de aguinaldo no pueden ser menores a 15 (artículo 87 LFT)')
  }
  
  // 1. Calcular aguinaldo base
  const aguinaldoBase = calcularAguinaldoBase(sueldoMensual, diasAguinaldo, fechaIngreso)
  
  // 2. Calcular ISR del aguinaldo
  const calculoISR = calcularISRDeAguinaldo(sueldoMensual, aguinaldoBase.aguinaldoBruto, pagarJuntoNomina)
  
  // 3. Cálculo comparativo del mes
  const isrMensualNormal = calcularISRMensual(sueldoMensual)
  const ingresoConAguinaldo = sueldoMensual + calculoISR.parteGravada
  const isrMensualConAguinaldo = calcularISRMensual(ingresoConAguinaldo)
  
  return {
    // Inputs procesados
    inputs: {
      sueldoMensual,
      diasAguinaldo,
      fechaIngreso,
      pagarJuntoNomina
    },
    
    // Cálculo base aguinaldo
    aguinaldoBase,
    
    // Cálculo ISR aguinaldo
    calculoISR,
    
    // Comparación mensual
    comparacionMensual: {
      sinAguinaldo: {
        ingreso: sueldoMensual,
        isr: isrMensualNormal.isrFinal,
        neto: isrMensualNormal.netoMensual,
        subsidio: isrMensualNormal.subsidio
      },
      conAguinaldo: {
        ingreso: ingresoConAguinaldo,
        isr: isrMensualConAguinaldo.isrFinal,
        neto: isrMensualConAguinaldo.netoMensual,
        subsidio: isrMensualConAguinaldo.subsidio,
        diferencia: isrMensualConAguinaldo.isrFinal - isrMensualNormal.isrFinal
      }
    },
    
    // Metadatos útiles
    metadata: {
      fechaCalculo: new Date(),
      esAnoCompleto: aguinaldoBase.esCompleto,
      aplicaSubsidio: isrMensualNormal.subsidio.aplicaSubsidio,
      vigenciaUMA: '2025',
      baseCalculoLegal: 'Art. 87 LFT, Art. 93 y 96 LISR, Art. 174 RLISR'
    }
  }
}

/**
 * Formatea número como moneda mexicana
 * @param {number} amount - Cantidad a formatear
 * @param {number} decimales - Número de decimales (default: 2)
 * @returns {string} Cantidad formateada
 */
export function formatearMoneda(amount, decimales = 2) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0.00'
  }
  
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  }).format(amount)
}

/**
 * Formatea número con separadores de miles
 * @param {number} amount - Cantidad a formatear
 * @param {number} decimales - Número de decimales
 * @returns {string} Número formateado
 */
export function formatearNumero(amount, decimales = 2) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0'
  }
  
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  }).format(amount)
}

/**
 * Parsea string de moneda a número
 * @param {string} currencyString - String con formato de moneda
 * @returns {number} Número parseado
 */
export function parsearMoneda(currencyString) {
  if (!currencyString) return 0
  
  // Remover formato de moneda y convertir a número
  const cleaned = currencyString
    .replace(/[$,]/g, '')
    .replace(/\s/g, '')
    .trim()
  
  const numero = parseFloat(cleaned)
  return isNaN(numero) ? 0 : numero
}

/**
 * Calcula días trabajados en el año para aguinaldo proporcional
 * @param {Date} fechaIngreso - Fecha de ingreso
 * @param {Date} fechaCorte - Fecha de corte (default: 31 dic año actual)
 * @returns {object} Información de días trabajados
 */
export function calcularDiasTrabajados(fechaIngreso, fechaCorte = null) {
  if (!fechaCorte) {
    fechaCorte = new Date(new Date().getFullYear(), 11, 31)
  }
  
  const inicioAno = new Date(fechaCorte.getFullYear(), 0, 1)
  const fechaIngresoAjustada = fechaIngreso > inicioAno ? fechaIngreso : inicioAno
  
  const diffTime = fechaCorte.getTime() - fechaIngresoAjustada.getTime()
  const diasTrabajados = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
  
  const factorProporcional = diasTrabajados / 365
  const esCompleto = diasTrabajados >= 365
  
  return {
    fechaIngreso: fechaIngresoAjustada,
    fechaCorte,
    diasTrabajados,
    factorProporcional,
    esCompleto,
    inicioAno
  }
}