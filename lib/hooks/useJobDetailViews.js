'use client'

import { useState, useEffect, useCallback } from 'react'

// Safe Clerk hook - returns default values if Clerk is not available
function useAuthSafe() {
  // Check if we're in a browser environment and if Clerk is available
  if (typeof window !== 'undefined') {
    try {
      const { useAuth } = require('@clerk/nextjs')
      return useAuth()
    } catch {
      // Fallback if Clerk is not available
      return { isSignedIn: false }
    }
  }
  // Server-side fallback
  return { isSignedIn: false }
}

const STORAGE_KEY = 'taco_empleos_job_views'
const MAX_FREE_VIEWS = 3

export function useJobDetailViews() {
  const { isSignedIn } = useAuthSafe()
  const [viewData, setViewData] = useState({
    viewedJobs: [],
    viewCount: 0,
    hasReachedLimit: false
  })

  // Load view data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed && typeof parsed === 'object') {
            setViewData({
              viewedJobs: parsed.viewedJobs || [],
              viewCount: parsed.viewCount || 0,
              hasReachedLimit: parsed.hasReachedLimit || false
            })
          }
        }
      } catch (error) {
        console.error('Error loading view data:', error)
        // Reset to default state if localStorage is corrupted
        setViewData({
          viewedJobs: [],
          viewCount: 0,
          hasReachedLimit: false
        })
      }
    }
  }, [])

  // Save view data to localStorage
  const saveViewData = useCallback((data) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        setViewData(data)
      } catch (error) {
        console.error('Error saving view data:', error)
        // Still update state even if localStorage fails
        setViewData(data)
      }
    } else {
      // If localStorage is not available, still update state
      setViewData(data)
    }
  }, [])

  // Check if user can view job details (before navigation)
  const canViewJobDetail = useCallback(() => {
    // If user is signed in, no limits apply
    if (isSignedIn) {
      return true
    }

    // Check if they've reached the limit
    return viewData.viewCount < MAX_FREE_VIEWS
  }, [viewData, isSignedIn])

  // Record a job detail view (call this when user navigates to job detail)
  const recordJobDetailView = useCallback((jobId) => {
    // If user is signed in, no limits apply - but we still track for analytics
    if (isSignedIn) {
      return true
    }

    const jobIdString = String(jobId)
    
    // Only count unique job views to prevent spam
    if (viewData.viewedJobs.includes(jobIdString)) {
      return true
    }

    // Record the view
    const newViewedJobs = [...viewData.viewedJobs, jobIdString]
    const newViewCount = viewData.viewCount + 1
    const newViewData = {
      viewedJobs: newViewedJobs,
      viewCount: newViewCount,
      hasReachedLimit: newViewCount >= MAX_FREE_VIEWS
    }

    saveViewData(newViewData)
    return true
  }, [viewData, isSignedIn, saveViewData])

  // Check if auth modal should be shown (after recording the view)
  const shouldShowAuthModal = useCallback(() => {
    // Never show modal if user is already signed in
    if (isSignedIn) {
      return false
    }

    // Show modal if they've reached the limit
    return viewData.hasReachedLimit
  }, [viewData.hasReachedLimit, isSignedIn])

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
    canViewJobDetail,
    recordJobDetailView,
    shouldShowAuthModal,
    resetViews,
    hasViewedJob,
    getRemainingViews,
    isSignedIn
  }
}