'use client'

import { useState, useEffect, useCallback } from 'react'

// Safe Clerk hook - returns default values if Clerk is not available
function useAuthSafe() {
  try {
    const { useAuth } = require('@clerk/nextjs')
    return useAuth()
  } catch {
    return { isSignedIn: false }
  }
}

const STORAGE_KEY = 'taco_empleos_job_views'
const MAX_FREE_VIEWS = 3

export function useJobViews() {
  const { isSignedIn } = useAuthSafe()
  const [viewData, setViewData] = useState({
    viewedJobs: [],
    viewCount: 0,
    hasReachedLimit: false
  })

  // Load view data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          setViewData(parsed)
        }
      } catch (error) {
        console.error('Error loading view data:', error)
      }
    }
  }, [])

  // Save view data to localStorage
  const saveViewData = useCallback((data) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        setViewData(data)
      } catch (error) {
        console.error('Error saving view data:', error)
      }
    }
  }, [])

  // Record a job view
  const recordView = useCallback((jobId) => {
    // If user is signed in, no limits apply
    if (isSignedIn) {
      return true
    }

    const jobIdString = String(jobId)
    
    // If this job was already viewed, don't count it again
    if (viewData.viewedJobs.includes(jobIdString)) {
      return true
    }

    // Check if adding this view would exceed the limit
    const newViewCount = viewData.viewCount + 1
    const hasReachedLimit = newViewCount > MAX_FREE_VIEWS

    if (hasReachedLimit) {
      // Don't record the view, return false to trigger registration gate
      return false
    }

    // Record the view
    const newViewedJobs = [...viewData.viewedJobs, jobIdString]
    const newViewData = {
      viewedJobs: newViewedJobs,
      viewCount: newViewCount,
      hasReachedLimit: newViewCount >= MAX_FREE_VIEWS
    }

    saveViewData(newViewData)
    return true
  }, [viewData, isSignedIn, saveViewData])

  // Reset view count (called after successful registration)
  const resetViews = useCallback(() => {
    const resetData = {
      viewedJobs: [],
      viewCount: 0,
      hasReachedLimit: false
    }
    saveViewData(resetData)
  }, [saveViewData])

  // Check if a specific job has been viewed
  const hasViewedJob = useCallback((jobId) => {
    return viewData.viewedJobs.includes(String(jobId))
  }, [viewData.viewedJobs])

  // Get remaining free views
  const getRemainingViews = useCallback(() => {
    if (isSignedIn) return Infinity
    return Math.max(0, MAX_FREE_VIEWS - viewData.viewCount)
  }, [viewData.viewCount, isSignedIn])

  return {
    viewCount: viewData.viewCount,
    viewedJobs: viewData.viewedJobs,
    hasReachedLimit: viewData.hasReachedLimit && !isSignedIn,
    recordView,
    resetViews,
    hasViewedJob,
    getRemainingViews,
    isSignedIn
  }
}