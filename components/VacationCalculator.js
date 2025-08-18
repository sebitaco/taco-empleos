'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

const VACATION_DAYS = {
  1: 12, 2: 14, 3: 16, 4: 18, 5: 20,
  6: 22, 7: 22, 8: 22, 9: 22, 10: 22,
  11: 24, 12: 24, 13: 24, 14: 24, 15: 24,
  16: 26, 17: 26, 18: 26, 19: 26, 20: 26,
  21: 28, 22: 28, 23: 28, 24: 28, 25: 28,
  26: 30, 27: 30, 28: 30, 29: 30, 30: 30,
  31: 32, 32: 32, 33: 32, 34: 32, 35: 32
}

export default function VacationCalculator() {
  const [monthlySalary, setMonthlySalary] = useState('')
  const [yearsOfService, setYearsOfService] = useState('')
  const [daysToTake, setDaysToTake] = useState('')
  const [primePercentage, setPrimePercentage] = useState('25')
  const [results, setResults] = useState(null)

  const calculateVacation = () => {
    if (!monthlySalary || !yearsOfService || !daysToTake) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    const years = parseInt(yearsOfService)
    const salary = parseFloat(monthlySalary)
    const days = parseInt(daysToTake)
    const primeRate = parseFloat(primePercentage) / 100

    // Get vacation days according to law
    const maxVacationDays = years <= 35 ? VACATION_DAYS[years] : 32
    
    if (days > maxVacationDays) {
      alert(`Con ${years} años de antigüedad, corresponden máximo ${maxVacationDays} días de vacaciones`)
      return
    }

    // Calculate daily salary (Article 89 LFT)
    const dailySalary = salary / 30

    // Calculate vacation pay
    const vacationPay = dailySalary * days

    // Calculate vacation bonus (prima vacacional)
    const vacationBonus = vacationPay * primeRate

    // Total amount
    const totalAmount = vacationPay + vacationBonus

    setResults({
      dailySalary,
      maxVacationDays,
      vacationPay,
      vacationBonus,
      totalAmount,
      primeRate: primeRate * 100
    })
  }

  const resetCalculator = () => {
    setMonthlySalary('')
    setYearsOfService('')
    setDaysToTake('')
    setPrimePercentage('25')
    setResults(null)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 mb-12">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Calculadora de Vacaciones y Prima Vacacional 2025
        </h2>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Monthly Salary */}
            <div>
              <Label htmlFor="monthly-salary" className="text-sm font-medium text-gray-700 mb-2 block">
                Salario mensual *
              </Label>
              <Input
                id="monthly-salary"
                type="number"
                placeholder="15000"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Years of Service */}
            <div>
              <Label htmlFor="years-service" className="text-sm font-medium text-gray-700 mb-2 block">
                Años de antigüedad *
              </Label>
              <Input
                id="years-service"
                type="number"
                min="1"
                max="35"
                placeholder="3"
                value={yearsOfService}
                onChange={(e) => setYearsOfService(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Days to Take */}
            <div>
              <Label htmlFor="days-take" className="text-sm font-medium text-gray-700 mb-2 block">
                Días a tomar *
              </Label>
              <Input
                id="days-take"
                type="number"
                min="1"
                placeholder="10"
                value={daysToTake}
                onChange={(e) => setDaysToTake(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Prime Percentage */}
            <div>
              <Label htmlFor="prime-percentage" className="text-sm font-medium text-gray-700 mb-2 block">
                Prima vacacional (%)
              </Label>
              <select
                id="prime-percentage"
                value={primePercentage}
                onChange={(e) => setPrimePercentage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="25">25% (Mínimo legal)</option>
                <option value="30">30%</option>
                <option value="35">35%</option>
                <option value="40">40%</option>
                <option value="50">50%</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button 
              onClick={calculateVacation}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Calcular Vacaciones
            </Button>
            <Button 
              onClick={resetCalculator}
              variant="outline"
              className="flex-1"
            >
              Limpiar
            </Button>
          </div>

          {/* Results */}
          {results && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resultados del cálculo:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salario diario:</span>
                    <span className="font-medium">{formatCurrency(results.dailySalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Días disponibles:</span>
                    <span className="font-medium">{results.maxVacationDays} días</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pago por vacaciones:</span>
                    <span className="font-medium">{formatCurrency(results.vacationPay)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prima vacacional ({results.primeRate}%):</span>
                    <span className="font-medium">{formatCurrency(results.vacationBonus)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-900 font-semibold">Total a recibir:</span>
                    <span className="font-bold text-green-600 text-lg">{formatCurrency(results.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-xs text-blue-700">
                  💡 <strong>Recuerda:</strong> Al menos 12 días deben tomarse de forma continua. 
                  Este cálculo se basa en el artículo 89 de la LFT (salario mensual ÷ 30 días).
                </p>
              </div>
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          * Campos obligatorios. Los cálculos se basan en la Ley Federal del Trabajo (reforma 2023).
        </p>
      </div>
    </div>
  )
}