/**
 * Domain-specific configuration
 * Allows different settings based on domain
 */

// Custom domain where subscription is disabled
const CUSTOM_DOMAIN = 'find-your-inner-peace.com'

/**
 * Check if app is running on custom domain
 * @returns {boolean} True if on custom domain
 */
export const isCustomDomain = () => {
  const hostname = window.location.hostname
  return hostname === CUSTOM_DOMAIN || hostname === `www.${CUSTOM_DOMAIN}`
}

/**
 * Check if subscription features should be enabled
 * @returns {boolean} True if subscription features are enabled
 */
export const isSubscriptionEnabled = () => {
  // Disable subscription on custom domain
  if (isCustomDomain()) {
    console.log('🎁 Custom domain detected - subscription features disabled (all features free!)')
    return false
  }
  
  // Enable subscription on Vercel URLs
  return true
}

/**
 * Check if user should have full access
 * On custom domain, everyone gets full access
 * On Vercel URLs, subscription rules apply
 * @returns {boolean} True if user has full access
 */
export const hasFullAccess = () => {
  // Custom domain = free access for everyone
  if (isCustomDomain()) {
    return true
  }
  
  // Vercel URLs require subscription check
  return false
}

/**
 * Get app mode based on domain
 * @returns {string} 'free' or 'subscription'
 */
export const getAppMode = () => {
  return isCustomDomain() ? 'free' : 'subscription'
}

/**
 * Should show trial countdown?
 * @returns {boolean}
 */
export const shouldShowTrialCountdown = () => {
  return isSubscriptionEnabled()
}

/**
 * Should show subscription menu items?
 * @returns {boolean}
 */
export const shouldShowSubscriptionMenu = () => {
  return isSubscriptionEnabled()
}

/**
 * Should apply subscription gate?
 * @returns {boolean}
 */
export const shouldApplySubscriptionGate = () => {
  return isSubscriptionEnabled()
}

/**
 * Get welcome message based on domain
 * @returns {string}
 */
export const getWelcomeMessage = () => {
  if (isCustomDomain()) {
    return 'Welcome! All features are completely free on this domain. Enjoy!'
  }
  return 'Welcome! Start your 7-day free trial today.'
}

export default {
  isCustomDomain,
  isSubscriptionEnabled,
  hasFullAccess,
  getAppMode,
  shouldShowTrialCountdown,
  shouldShowSubscriptionMenu,
  shouldApplySubscriptionGate,
  getWelcomeMessage
}

