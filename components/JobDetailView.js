'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MapPin, DollarSign, ExternalLink } from 'lucide-react'
import DisclaimerModal from '@/components/DisclaimerModal'

export default function JobDetailView({ job }) {
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  const handleViewOriginalPost = () => {
    setShowDisclaimer(true)
  }

  const handleDisclaimerAccept = () => {
    setShowDisclaimer(false)
    // Open Facebook URL in new tab
    window.open(job.facebookUrl, '_blank', 'noopener,noreferrer')
  }

  const handleDisclaimerCancel = () => {
    setShowDisclaimer(false)
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 max-w-4xl py-4">
            <Link 
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a empleos
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 max-w-4xl py-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Job Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                    {job.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Destacado
                      </Badge>
                    )}
                    {job.isNew && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Nuevo
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{job.location}</span>
                  </div>
                  
                  <div className="flex items-center text-green-600 font-semibold">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="text-lg">{job.salary}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 min-w-0 md:min-w-[200px]">
                  <Button 
                    onClick={handleViewOriginalPost}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver publicación original
                  </Button>
                </div>
              </div>

              {/* Tags */}
              {job.tags && job.tags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="text-xs px-3 py-1 bg-blue-50 border-blue-200 text-blue-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Job Content */}
            <div className="p-6">
              <div className="prose max-w-none">
                {job.bodyContent.split('\n').map((paragraph, index) => {
                  if (paragraph.trim() === '') return <br key={index} />
                  
                  // Handle markdown-style bold text
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h3 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                        {paragraph.slice(2, -2)}
                      </h3>
                    )
                  }
                  
                  // Handle bullet points
                  if (paragraph.startsWith('•')) {
                    return (
                      <li key={index} className="ml-4 text-gray-700 leading-relaxed">
                        {paragraph.slice(1).trim()}
                      </li>
                    )
                  }
                  
                  // Regular paragraphs
                  return (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500 text-center md:text-left">
                  ¿Interesado en esta posición? Haz clic en "Ver publicación original" para aplicar directamente.
                </p>
                <Button 
                  onClick={handleViewOriginalPost}
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Aplicar ahora
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Modal */}
      <DisclaimerModal 
        isOpen={showDisclaimer}
        onAccept={handleDisclaimerAccept}
        onCancel={handleDisclaimerCancel}
        job={job}
      />
    </>
  )
}