import { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { onAuthChange } from '../utils/firebaseAuth'
import { isAnalyticsEnabled, resetAnalyticsCache } from '../utils/analyticsFilter'

/**
 * Conditional Analytics component that only renders analytics
 * if the current user is not an admin user
 */
const ConditionalAnalytics = () => {
  const [enabled, setEnabled] = useState(true) // Default to enabled until we check

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = onAuthChange((user) => {
      // Reset cache when auth changes
      resetAnalyticsCache()
      
      // Check if analytics should be enabled for this user
      const shouldEnable = isAnalyticsEnabled()
      setEnabled(shouldEnable)
      
      if (!shouldEnable && user) {
        console.log('🚫 Analytics disabled for admin user:', user.email)
      }
    })

    // Initial check
    resetAnalyticsCache()
    const shouldEnable = isAnalyticsEnabled()
    setEnabled(shouldEnable)

    return () => {
      unsubscribe()
    }
  }, [])

  // Only render analytics if enabled
  if (!enabled) {
    return null
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default ConditionalAnalytics


