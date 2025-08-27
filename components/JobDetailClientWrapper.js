'use client'

import { useEffect, useState } from 'react'
import JobDetailView from '@/components/JobDetailView'
import RegistrationGateModal from '@/components/RegistrationGateModal'
import { useJobDetailViews } from '@/lib/hooks/useJobDetailViews'

export default function JobDetailClientWrapper({ job, jobId }) {
  const { 
    recordJobDetailView, 
    shouldShowAuthModal, 
    resetViews,
    viewCount,
    getRemainingViews
  } = useJobDetailViews()
  
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    // Record the job detail view when component mounts
    recordJobDetailView(jobId)
    
    // Check if we should show auth modal after recording the view
    if (shouldShowAuthModal()) {
      setShowAuthModal(true)
    }
  }, [jobId, recordJobDetailView, shouldShowAuthModal])

  const handleRegistrationComplete = () => {
    // Reset view count since user is now registered
    resetViews()
    setShowAuthModal(false)
  }

  const handleAuthModalClose = () => {
    setShowAuthModal(false)
  }

  return (
    <>
      <JobDetailView job={job} />
      
      {/* Registration Gate Modal - shown when view limit is reached */}
      <RegistrationGateModal 
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
        targetJob={job}
        onRegistrationComplete={handleRegistrationComplete}
        viewCount={viewCount}
        remainingViews={getRemainingViews()}
      />
    </>
  )
}