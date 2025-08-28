'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Search, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react'

function TrabajosContent() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [selectedPosition, setSelectedPosition] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentPage = parseInt(searchParams.get('page') || '1')

  const fetchJobs = async (page = 1, position = '', location = '') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })
      
      if (position) params.append('search', position)
      if (location) params.append('location', location)

      const response = await fetch(`/api/jobs?${params}`)
      const data = await response.json()
      
      setJobs(data.jobs)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const position = searchParams.get('search') || ''
    const location = searchParams.get('location') || ''
    
    setSelectedPosition(position || 'all')
    setSelectedLocation(location || 'all')
    
    fetchJobs(currentPage, position, location)
  }, [searchParams, currentPage])

  const handlePositionFilter = (position) => {
    const filterPosition = position === 'all' ? '' : position
    setSelectedPosition(position)
    updateFilters({ search: filterPosition, location: selectedLocation === 'all' ? '' : selectedLocation, page: 1 })
  }

  const handleLocationFilter = (location) => {
    const filterLocation = location === 'all' ? '' : location
    const filterPosition = selectedPosition === 'all' ? '' : selectedPosition
    setSelectedLocation(location)
    updateFilters({ search: filterPosition, location: filterLocation, page: 1 })
  }

  const updateFilters = ({ search, location, page }) => {
    const params = new URLSearchParams()
    
    if (search) params.append('search', search)
    if (location) params.append('location', location)
    if (page > 1) params.append('page', page.toString())
    
    const queryString = params.toString()
    router.push(`/trabajos${queryString ? `?${queryString}` : ''}`)
  }

  const goToPage = (page) => {
    const filterLocation = selectedLocation === 'all' ? '' : selectedLocation
    const filterPosition = selectedPosition === 'all' ? '' : selectedPosition
    updateFilters({ 
      search: filterPosition, 
      location: filterLocation, 
      page 
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600">Inicio</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Trabajos</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Encuentra tu trabajo ideal
          </h1>
          <p className="text-gray-600">
            {pagination?.total || 0} oportunidades laborales en el sector gastronómico
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-6">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
              {((selectedPosition && selectedPosition !== 'all') || (selectedLocation && selectedLocation !== 'all')) && (
                <Badge variant="secondary" className="ml-2">
                  {(selectedPosition && selectedPosition !== 'all' ? 1 : 0) + (selectedLocation && selectedLocation !== 'all' ? 1 : 0)}
                </Badge>
              )}
            </div>
            {showFilters ? <X className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg border p-6 lg:sticky lg:top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filtros</h3>
                <button 
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Position Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de trabajo
                </label>
                <Select value={selectedPosition} onValueChange={handlePositionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los puestos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los puestos</SelectItem>
                    <SelectItem value="mesero">Mesero</SelectItem>
                    <SelectItem value="garrotero">Garrotero</SelectItem>
                    <SelectItem value="hostess">Hostess</SelectItem>
                    <SelectItem value="cocinero">Cocinero</SelectItem>
                    <SelectItem value="ayudante">Ayudante de cocina</SelectItem>
                    <SelectItem value="bartender">Bartender</SelectItem>
                    <SelectItem value="cajero">Cajero</SelectItem>
                    <SelectItem value="lavaloza">Lavaloza</SelectItem>
                    <SelectItem value="gerente">Gerente</SelectItem>
                    <SelectItem value="encargado">Encargado de turno</SelectItem>
                    <SelectItem value="panadero">Panadero</SelectItem>
                    <SelectItem value="barback">Barback</SelectItem>
                    <SelectItem value="chef">Chef Ejecutivo</SelectItem>
                    <SelectItem value="repartidor">Repartidor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación
                </label>
                <Select value={selectedLocation} onValueChange={handleLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las ciudades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las ciudades</SelectItem>
                    <SelectItem value="Ciudad de México">Ciudad de México</SelectItem>
                    <SelectItem value="Guadalajara">Guadalajara</SelectItem>
                    <SelectItem value="Monterrey">Monterrey</SelectItem>
                    <SelectItem value="Cancún">Cancún</SelectItem>
                    <SelectItem value="Playa del Carmen">Playa del Carmen</SelectItem>
                    <SelectItem value="Puerto Vallarta">Puerto Vallarta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              {((selectedPosition && selectedPosition !== 'all') || (selectedLocation && selectedLocation !== 'all')) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSelectedPosition('all')
                    setSelectedLocation('all')
                    updateFilters({ search: '', location: '', page: 1 })
                    setShowFilters(false) // Auto-close on mobile after clearing
                  }}
                  className="w-full"
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded mb-2 w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4 w-1/4"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                          <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-lg border p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron trabajos
                </h3>
                <p className="text-gray-600">
                  Intenta ajustar tus filtros para encontrar más oportunidades
                </p>
              </div>
            ) : (
              <>
                {/* Jobs Grid */}
                <div className="space-y-4 mb-8">
                  {jobs.map((job, index) => (
                    <Link
                      key={job.id}
                      href={`/empleos/${job.id}`}
                      className="block bg-white rounded-lg border hover:shadow-lg hover:border-blue-200 transition-all duration-200"
                    >
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1">
                            {/* Position Name - Most prominent */}
                            <div className="flex items-start gap-3 mb-3">
                              <h3 className="text-2xl font-bold text-gray-900 hover:text-blue-600 leading-tight">
                                {job.title}
                              </h3>
                              {job.featured && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 mt-1">
                                  Destacado
                                </Badge>
                              )}
                              {job.isNew && (
                                <Badge className="bg-green-100 text-green-800 border-green-200 mt-1">
                                  Nuevo
                                </Badge>
                              )}
                            </div>
                            
                            {/* Company Name - Second hierarchy */}
                            <div className="text-lg font-medium text-gray-700 mb-2">
                              {job.company || 'Empresa confidencial'}
                            </div>
                            
                            {/* Location - Third hierarchy */}
                            <div className="flex items-center gap-1 text-gray-600 mb-3">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                              {job.tags?.slice(0, 3).map((tag, tagIndex) => (
                                <Badge 
                                  key={tagIndex}
                                  variant="outline"
                                  className="text-xs bg-blue-50 border-blue-200 text-blue-700"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {job.tags?.length > 3 && (
                                <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-600">
                                  +{job.tags.length - 3} más
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right sm:ml-6 flex-shrink-0">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                              {job.salary}
                            </div>
                            <div className="text-sm text-gray-500">
                              mensual
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center bg-white rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                      </Button>
                      
                      {/* Page Numbers */}
                      <div className="hidden sm:flex items-center gap-1">
                        {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                          const pageNum = Math.max(1, currentPage - 2) + i
                          if (pageNum > pagination.totalPages) return null
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => goToPage(pageNum)}
                              className="min-w-[40px]"
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mailing List Subscription Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recibe alertas de trabajo semanales
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Únete a 11,000 gastronómicos que reciben las mejores ofertas de trabajo cada semana
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  className="flex h-10 w-full border bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 px-4 py-3 text-base border-gray-300 rounded-lg"
                  placeholder="📧 Tu correo electrónico"
                />
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap">
                  Suscribirme
                </Button>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              Sin spam. Solo empleos relevantes. Cancela cuando quieras.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TrabajosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <TrabajosContent />
    </Suspense>
  )
}