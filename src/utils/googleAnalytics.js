import ReactGA from 'react-ga4'
import { isAnalyticsEnabled } from './analyticsFilter'

// Initialize Google Analytics
export const initGA = (measurementId) => {
  // Check if analytics should be disabled for admin users
  if (!isAnalyticsEnabled()) {
    console.log('🚫 Google Analytics disabled for admin user')
    return false
  }
  if (measurementId && measurementId !== 'YOUR_GA4_MEASUREMENT_ID') {
    try {
      ReactGA.initialize(measurementId, {
        gaOptions: {
          siteSpeedSampleRate: 100
        }
      })
      console.log('✅ Google Analytics initialized:', measurementId)
      return true
    } catch (error) {
      console.error('❌ Google Analytics initialization failed:', error)
      return false
    }
  } else {
    console.log('ℹ️ Google Analytics not configured. Add VITE_GA4_MEASUREMENT_ID to .env')
    return false
  }
}

// Track page views
export const trackPageView = (path, title) => {
  // Skip tracking for admin users
  if (!isAnalyticsEnabled()) {
    return
  }
  
  try {
    ReactGA.send({ 
      hitType: 'pageview', 
      page: path,
      title: title || document.title
    })
    console.log('📊 GA Page View:', path)
  } catch (error) {
    console.error('GA tracking error:', error)
  }
}

// Track custom events
export const trackEvent = (category, action, label = '', value = 0) => {
  // Skip tracking for admin users
  if (!isAnalyticsEnabled()) {
    return
  }
  
  try {
    ReactGA.event({
      category,
      action,
      label,
      value
    })
    console.log('📊 GA Event:', { category, action, label })
  } catch (error) {
    console.error('GA event tracking error:', error)
  }
}

// Track user interactions
export const trackUserInteraction = (feature, action) => {
  trackEvent('User Interaction', action, feature)
}

// Track feature usage
export const trackFeatureUsage = (featureName) => {
  trackEvent('Feature Usage', 'Used', featureName)
}

// Track errors
export const trackError = (errorMessage, errorLocation) => {
  trackEvent('Error', errorMessage, errorLocation)
}

// Track user sign up
export const trackSignUp = (method = 'email') => {
  ReactGA.event({
    category: 'User',
    action: 'Sign Up',
    label: method
  })
}

// Track user sign in
export const trackSignIn = (method = 'email') => {
  ReactGA.event({
    category: 'User',
    action: 'Sign In',
    label: method
  })
}

// Track AI feature usage
export const trackAIFeature = (feature, success = true) => {
  ReactGA.event({
    category: 'AI Features',
    action: feature,
    label: success ? 'Success' : 'Failed'
  })
}

export default {
  initGA,
  trackPageView,
  trackEvent,
  trackUserInteraction,
  trackFeatureUsage,
  trackError,
  trackSignUp,
  trackSignIn,
  trackAIFeature
}

