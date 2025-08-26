'use client'

import { useState, useEffect } from 'react'
import { useJobViews } from '@/lib/hooks/useJobViews'
import JobDetailView from '@/components/JobDetailView'
import RegistrationGateModal from '@/components/RegistrationGateModal'

export default function JobDetailClientWrapper({ job, jobId }) {
  const { recordView, hasReachedLimit, isSignedIn, resetViews } = useJobViews()
  const [showRegistrationGate, setShowRegistrationGate] = useState(false)
  const [canViewJob, setCanViewJob] = useState(false)

  useEffect(() => {
    // Check if user can view this job
    const canView = recordView(jobId)
    
    if (!canView && !isSignedIn) {
      // User has reached limit and is not signed in - show registration gate
      setShowRegistrationGate(true)
      setCanViewJob(false)
    } else {
      // User can view the job
      setCanViewJob(true)
    }
  }, [jobId, recordView, isSignedIn])

  const handleRegistrationComplete = () => {
    // Reset view count since user is now registered
    resetViews()
    setShowRegistrationGate(false)
    setCanViewJob(true)
  }

  const handleModalClose = () => {
    // User closed the modal without registering - redirect to home
    window.history.back()
  }

  // Show registration gate if needed
  if (showRegistrationGate) {
    return (
      <RegistrationGateModal
        isOpen={showRegistrationGate}
        onClose={handleModalClose}
        targetJob={job}
        onRegistrationComplete={handleRegistrationComplete}
      />
    )
  }

  // Show job detail if user can view it
  if (canViewJob) {
    return <JobDetailView job={job} />
  }

  // Loading state while checking permissions
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
}