import { getCurrentUser } from './firebaseAuth'

// Admin users to exclude from analytics
const ADMIN_EMAILS = [
  'ghadaabdulaziz1@gmail.com'
]

// Cache for excluded state (to avoid repeated checks)
let excludedState = null
let lastCheckedEmail = null

/**
 * Check if current user should be excluded from analytics tracking
 * @returns {boolean} true if user should be excluded, false otherwise
 */
export const shouldExcludeFromAnalytics = () => {
  try {
    const user = getCurrentUser()
    if (!user || !user.email) {
      // If no user, don't exclude (allow tracking)
      excludedState = false
      return false
    }
    
    // Use cached result if checking same email
    if (lastCheckedEmail === user.email && excludedState !== null) {
      return excludedState
    }
    
    // Check if user email is in admin list
    const isAdmin = ADMIN_EMAILS.some(adminEmail => 
      user.email.toLowerCase() === adminEmail.toLowerCase()
    )
    
    // Cache the result
    excludedState = isAdmin
    lastCheckedEmail = user.email
    
    if (isAdmin) {
      console.log('🚫 Analytics excluded for admin user:', user.email)
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error checking analytics exclusion:', error)
    return false
  }
}

/**
 * Reset the exclusion cache (useful when user logs out/in)
 */
export const resetAnalyticsCache = () => {
  excludedState = null
  lastCheckedEmail = null
}

/**
 * Check if analytics tracking should be enabled
 * @returns {boolean} true if tracking should be enabled, false if excluded
 */
export const isAnalyticsEnabled = () => {
  return !shouldExcludeFromAnalytics()
}

export default {
  shouldExcludeFromAnalytics,
  isAnalyticsEnabled,
  resetAnalyticsCache
}

