'use client'

import { ClerkProvider } from '@clerk/nextjs'

export default function ClerkWrapper({ children }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  
  // If no publishable key is provided, just return children without Clerk
  if (!publishableKey) {
    return <>{children}</>
  }
  
  return (
    <ClerkProvider 
      publishableKey={publishableKey}
      appearance={{
        variables: {
          colorPrimary: '#2563eb'
        }
      }}
    >
      {children}
    </ClerkProvider>
  )
}