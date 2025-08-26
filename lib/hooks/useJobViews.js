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

const STORAGE_KEY = 'taco_empleos_facebook_redirects'
const MAX_FREE_REDIRECTS = 3

export function useFacebookRedirects() {
  const { isSignedIn } = useAuthSafe()
  const [redirectData, setRedirectData] = useState({
    redirectedJobs: [],
    redirectCount: 0,
    hasReachedLimit: false
  })

  // Load redirect data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed && typeof parsed === 'object') {
            setRedirectData({
              redirectedJobs: parsed.redirectedJobs || [],
              redirectCount: parsed.redirectCount || 0,
              hasReachedLimit: parsed.hasReachedLimit || false
            })
          }
        }
      } catch (error) {
        console.error('Error loading redirect data:', error)
        // Reset to default state if localStorage is corrupted
        setRedirectData({
          redirectedJobs: [],
          redirectCount: 0,
          hasReachedLimit: false
        })
      }
    }
  }, [])

  // Save redirect data to localStorage
  const saveRedirectData = useCallback((data) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        setRedirectData(data)
      } catch (error) {
        console.error('Error saving redirect data:', error)
        // Still update state even if localStorage fails
        setRedirectData(data)
      }
    } else {
      // If localStorage is not available, still update state
      setRedirectData(data)
    }
  }, [])

  // Check if user can redirect to Facebook
  const canRedirectToFacebook = useCallback((jobId) => {
    // If user is signed in, no limits apply
    if (isSignedIn) {
      return true
    }

    const jobIdString = String(jobId)
    
    // If this job was already redirected to, don't count it again
    if (redirectData.redirectedJobs.includes(jobIdString)) {
      return true
    }

    // Check if adding this redirect would exceed the limit
    const newRedirectCount = redirectData.redirectCount + 1
    return newRedirectCount <= MAX_FREE_REDIRECTS
  }, [redirectData, isSignedIn])

  // Record a Facebook redirect
  const recordFacebookRedirect = useCallback((jobId) => {
    // If user is signed in, no limits apply
    if (isSignedIn) {
      return true
    }

    const jobIdString = String(jobId)
    
    // If this job was already redirected to, don't count it again
    if (redirectData.redirectedJobs.includes(jobIdString)) {
      return true
    }

    // Record the redirect
    const newRedirectedJobs = [...redirectData.redirectedJobs, jobIdString]
    const newRedirectCount = redirectData.redirectCount + 1
    const newRedirectData = {
      redirectedJobs: newRedirectedJobs,
      redirectCount: newRedirectCount,
      hasReachedLimit: newRedirectCount >= MAX_FREE_REDIRECTS
    }

    saveRedirectData(newRedirectData)
    return true
  }, [redirectData, isSignedIn, saveRedirectData])

  // Reset redirect count (called after successful registration)
  const resetRedirects = useCallback(() => {
    const resetData = {
      redirectedJobs: [],
      redirectCount: 0,
      hasReachedLimit: false
    }
    saveRedirectData(resetData)
  }, [saveRedirectData])

  // Check if a specific job has been redirected
  const hasRedirectedJob = useCallback((jobId) => {
    return redirectData.redirectedJobs.includes(String(jobId))
  }, [redirectData.redirectedJobs])

  // Get remaining free redirects
  const getRemainingRedirects = useCallback(() => {
    if (isSignedIn) return Infinity
    return Math.max(0, MAX_FREE_REDIRECTS - redirectData.redirectCount)
  }, [redirectData.redirectCount, isSignedIn])

  return {
    redirectCount: redirectData.redirectCount,
    redirectedJobs: redirectData.redirectedJobs,
    hasReachedLimit: redirectData.hasReachedLimit && !isSignedIn,
    canRedirectToFacebook,
    recordFacebookRedirect,
    resetRedirects,
    hasRedirectedJob,
    getRemainingRedirects,
    isSignedIn
  }
}