/**
 * Feature Access Control
 * Defines which features are free vs premium
 */

// Free features - accessible to everyone without trial/subscription
export const FREE_FEATURES = [
  '/dashboard',              // Basic dashboard
  '/profile',               // Profile page
  '/profile/personal-info', // Personal information
  '/info/about',           // About page
  '/info/contact',         // Contact page
  '/body/water',           // Water intake (basic)
  '/wellness/mood',        // Mood tracker (basic)
  '/analytics',            // Basic analytics
]

// Premium features - require trial or subscription
export const PREMIUM_FEATURES = [
  '/body/nutrition',       // AI nutrition tracking
  '/body/activity',        // Activity tracker
  '/body/sleep',          // Sleep tracker
  '/mind/journal',        // Journal
  '/mind/emotions',       // Emotion insights
  '/mind/voice-journal',  // Voice journal
  '/mind/cbt-therapy',    // CBT therapy
  '/ai-hub',              // AI Wellness Hub
  '/habits-goals',        // Habits & Goals
  '/community/hobbies',   // Hobbies
  '/community/whatsapp-groups', // WhatsApp groups
  '/community/social',    // Social feed
  '/wellness/self-love',  // Self-love & care
  '/subscription',        // Subscription page (accessible but prompts upgrade)
  '/notifications',       // Notifications
  '/wellness-report',     // Wellness report
  '/data-backup',         // Data backup
  '/wearable-sync',       // Wearable sync
  '/user-stats',          // Detailed user stats
]

/**
 * Check if a route is a free feature
 * @param {string} pathname - Current route path
 * @returns {boolean} True if feature is free
 */
export const isFreeFeature = (pathname) => {
  // Exact match
  if (FREE_FEATURES.includes(pathname)) {
    return true
  }
  
  // Check if pathname starts with any free feature
  return FREE_FEATURES.some(feature => pathname.startsWith(feature))
}

/**
 * Check if a route is a premium feature
 * @param {string} pathname - Current route path
 * @returns {boolean} True if feature is premium
 */
export const isPremiumFeature = (pathname) => {
  // Exact match
  if (PREMIUM_FEATURES.includes(pathname)) {
    return true
  }
  
  // Check if pathname starts with any premium feature
  return PREMIUM_FEATURES.some(feature => pathname.startsWith(feature))
}

/**
 * Get feature tier (free, premium, or unknown)
 * @param {string} pathname - Current route path
 * @returns {string} 'free', 'premium', or 'unknown'
 */
export const getFeatureTier = (pathname) => {
  if (isFreeFeature(pathname)) return 'free'
  if (isPremiumFeature(pathname)) return 'premium'
  return 'unknown'
}

/**
 * Get list of features by tier
 * @returns {object} Object with free and premium feature lists
 */
export const getFeaturesByTier = () => {
  return {
    free: [
      {
        name: 'Basic Dashboard',
        path: '/dashboard',
        description: 'View your wellness overview and basic stats',
        icon: '📊'
      },
      {
        name: 'Water Intake',
        path: '/body/water',
        description: 'Track your daily water consumption',
        icon: '💧'
      },
      {
        name: 'Mood Tracker',
        path: '/wellness/mood',
        description: 'Log your daily mood and emotions',
        icon: '😊'
      },
      {
        name: 'Profile Management',
        path: '/profile',
        description: 'Manage your account and settings',
        icon: '👤'
      },
      {
        name: 'Basic Analytics',
        path: '/analytics',
        description: 'View basic usage statistics',
        icon: '📈'
      }
    ],
    premium: [
      {
        name: 'AI Nutrition Tracking',
        path: '/body/nutrition',
        description: 'AI-powered food search, photo analysis, personalized goals',
        icon: '🍎',
        highlight: true
      },
      {
        name: 'Activity Tracker',
        path: '/body/activity',
        description: 'Track workouts and physical activities',
        icon: '🏃'
      },
      {
        name: 'Sleep Analysis',
        path: '/body/sleep',
        description: 'Monitor and analyze your sleep patterns',
        icon: '😴'
      },
      {
        name: 'AI Wellness Hub',
        path: '/ai-hub',
        description: 'AI-powered wellness recommendations and insights',
        icon: '🤖',
        highlight: true
      },
      {
        name: 'Journal & Voice Journal',
        path: '/mind/journal',
        description: 'Express your thoughts with text or voice',
        icon: '📝'
      },
      {
        name: 'Emotion Insights',
        path: '/mind/emotions',
        description: 'Deep emotional analysis and patterns',
        icon: '🧠'
      },
      {
        name: 'CBT Therapy Tools',
        path: '/mind/cbt-therapy',
        description: 'Cognitive behavioral therapy exercises',
        icon: '💭'
      },
      {
        name: 'Habits & Goals',
        path: '/habits-goals',
        description: 'Set and track your wellness goals',
        icon: '🎯'
      },
      {
        name: 'Community Features',
        path: '/community/social',
        description: 'Connect with others on wellness journey',
        icon: '👥'
      },
      {
        name: 'Wellness Reports',
        path: '/wellness-report',
        description: 'Comprehensive wellness analysis reports',
        icon: '📊'
      },
      {
        name: 'Wearable Sync',
        path: '/wearable-sync',
        description: 'Sync data from fitness trackers',
        icon: '⌚'
      }
    ]
  }
}

/**
 * Check if user can access a specific feature
 * @param {string} pathname - Route to check
 * @param {boolean} hasActiveSubscription - User subscription status
 * @returns {boolean} True if user can access
 */
export const canAccessFeature = (pathname, hasActiveSubscription) => {
  // Free features are always accessible
  if (isFreeFeature(pathname)) {
    return true
  }
  
  // Premium features require active subscription (trial or paid)
  if (isPremiumFeature(pathname)) {
    return hasActiveSubscription
  }
  
  // Unknown features default to free access
  return true
}

export default {
  FREE_FEATURES,
  PREMIUM_FEATURES,
  isFreeFeature,
  isPremiumFeature,
  getFeatureTier,
  getFeaturesByTier,
  canAccessFeature
}

