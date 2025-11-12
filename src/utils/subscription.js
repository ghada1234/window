import { getJSON, setJSON } from './storage'

/**
 * Subscription management utilities
 */

// Initialize trial on first signup
export const initializeTrial = (userId) => {
  const subscription = getJSON('subscription', null)
  
  if (!subscription) {
    const trialEndDate = new Date()
    trialEndDate.setDate(trialEndDate.getDate() + 7) // 7 days trial
    
    const newSubscription = {
      userId,
      plan: 'trial',
      status: 'active',
      trialStartDate: new Date().toISOString(),
      trialEndDate: trialEndDate.toISOString(),
      createdAt: new Date().toISOString()
    }
    
    setJSON('subscription', newSubscription)
    return newSubscription
  }
  
  return subscription
}

// Check if trial is active
export const isTrialActive = () => {
  const subscription = getJSON('subscription', null)
  
  if (!subscription || subscription.plan !== 'trial') {
    return false
  }
  
  const now = new Date()
  const trialEnd = new Date(subscription.trialEndDate)
  
  return now < trialEnd && subscription.status === 'active'
}

// Get days remaining in trial
export const getTrialDaysRemaining = () => {
  const subscription = getJSON('subscription', null)
  
  if (!subscription || subscription.plan !== 'trial') {
    return 0
  }
  
  const now = new Date()
  const trialEnd = new Date(subscription.trialEndDate)
  const daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24))
  
  return Math.max(0, daysRemaining)
}

// Check if subscription is active (trial or paid)
export const hasActiveSubscription = () => {
  const subscription = getJSON('subscription', null)
  
  if (!subscription) return false
  
  // Check trial
  if (subscription.plan === 'trial') {
    return isTrialActive()
  }
  
  // Check paid subscription
  if (['weekly', 'monthly', 'yearly'].includes(subscription.plan)) {
    if (subscription.status !== 'active') return false
    
    // Check if subscription has expired
    if (subscription.expiryDate) {
      const now = new Date()
      const expiry = new Date(subscription.expiryDate)
      return now < expiry
    }
    
    return true
  }
  
  return false
}

// Activate paid subscription
export const activatePaidSubscription = (plan, paymentId = null) => {
  const subscription = getJSON('subscription', {})
  
  const durations = {
    weekly: 7,
    monthly: 30,
    yearly: 365
  }
  
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + durations[plan])
  
  const updatedSubscription = {
    ...subscription,
    plan,
    status: 'active',
    activatedAt: new Date().toISOString(),
    expiryDate: expiryDate.toISOString(),
    paymentId,
    autoRenew: true
  }
  
  setJSON('subscription', updatedSubscription)
  return updatedSubscription
}

// Get subscription details
export const getSubscriptionDetails = (autoInitializeTrial = true) => {
  let subscription = getJSON('subscription', null)
  
  // If no subscription exists and autoInitialize is true, create a trial
  if (!subscription && autoInitializeTrial) {
    console.log('🎁 No subscription found, automatically starting 7-day trial')
    // Auto-initialize trial for new users
    const trialEndDate = new Date()
    trialEndDate.setDate(trialEndDate.getDate() + 7)
    
    subscription = {
      userId: 'auto-trial',
      plan: 'trial',
      status: 'active',
      trialStartDate: new Date().toISOString(),
      trialEndDate: trialEndDate.toISOString(),
      createdAt: new Date().toISOString()
    }
    
    setJSON('subscription', subscription)
    console.log('✅ 7-day trial auto-initialized')
  }
  
  if (!subscription) {
    return {
      plan: 'none',
      status: 'inactive',
      daysRemaining: 0,
      isActive: false,
      isTrial: false
    }
  }
  
  const isTrial = subscription.plan === 'trial'
  const isActive = hasActiveSubscription()
  
  let daysRemaining = 0
  if (isTrial) {
    daysRemaining = getTrialDaysRemaining()
  } else if (subscription.expiryDate) {
    const now = new Date()
    const expiry = new Date(subscription.expiryDate)
    daysRemaining = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
  }
  
  return {
    ...subscription,
    daysRemaining: Math.max(0, daysRemaining),
    isActive,
    isTrial
  }
}

// Cancel subscription
export const cancelSubscription = () => {
  const subscription = getJSON('subscription', {})
  const updatedSubscription = {
    ...subscription,
    status: 'cancelled',
    cancelledAt: new Date().toISOString(),
    autoRenew: false
  }
  setJSON('subscription', updatedSubscription)
  return updatedSubscription
}

// Ensure user has trial access (for existing users without subscription)
export const ensureTrialAccess = () => {
  const subscription = getJSON('subscription', null)
  
  // If no subscription exists, auto-initialize trial
  if (!subscription) {
    const trialEndDate = new Date()
    trialEndDate.setDate(trialEndDate.getDate() + 7)
    
    const newTrial = {
      userId: 'auto-trial',
      plan: 'trial',
      status: 'active',
      trialStartDate: new Date().toISOString(),
      trialEndDate: trialEndDate.toISOString(),
      createdAt: new Date().toISOString()
    }
    
    setJSON('subscription', newTrial)
    console.log('✅ Auto-initialized 7-day trial for user')
    return newTrial
  }
  
  return subscription
}
