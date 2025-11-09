/**
 * Health API Integrations
 * Connects to various health platforms for automatic data sync
 */

// ==================== GOOGLE FIT API ====================

/**
 * Initialize Google Fit OAuth
 * Scopes: fitness.activity.read, fitness.sleep.read, fitness.body.read
 */
export const connectGoogleFit = async () => {
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_FIT_CLIENT_ID
  
  if (!CLIENT_ID) {
    console.error('Google Fit Client ID not configured')
    return { success: false, error: 'API not configured. Add VITE_GOOGLE_FIT_CLIENT_ID to .env' }
  }

  try {
    // Google OAuth 2.0 endpoint
    const SCOPES = [
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.sleep.read',
      'https://www.googleapis.com/auth/fitness.body.read',
      'https://www.googleapis.com/auth/fitness.location.read'
    ].join(' ')

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${CLIENT_ID}&` +
      `redirect_uri=${window.location.origin}/oauth/callback&` +
      `response_type=token&` +
      `scope=${encodeURIComponent(SCOPES)}&` +
      `state=google_fit`

    // Open OAuth popup
    const popup = window.open(authUrl, 'GoogleFitAuth', 'width=500,height=600')
    
    return new Promise((resolve) => {
      // Listen for OAuth callback
      window.addEventListener('message', function handler(event) {
        if (event.data.type === 'oauth_success' && event.data.state === 'google_fit') {
          window.removeEventListener('message', handler)
          popup?.close()
          resolve({ success: true, accessToken: event.data.accessToken })
        }
      })
    })
  } catch (error) {
    console.error('Google Fit connection error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Fetch Google Fit data
 */
export const fetchGoogleFitData = async (accessToken, startDate, endDate) => {
  try {
    const startTime = new Date(startDate).getTime()
    const endTime = new Date(endDate).getTime()
    
    // Fetch activity data
    const activityResponse = await fetch(
      `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aggregateBy: [
            { dataTypeName: 'com.google.step_count.delta' },
            { dataTypeName: 'com.google.calories.expended' },
            { dataTypeName: 'com.google.heart_rate.bpm' }
          ],
          bucketByTime: { durationMillis: 86400000 }, // 1 day
          startTimeMillis: startTime,
          endTimeMillis: endTime
        })
      }
    )

    const activityData = await activityResponse.json()
    
    // Fetch sleep data
    const sleepResponse = await fetch(
      `https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=${new Date(startTime).toISOString()}&endTime=${new Date(endTime).toISOString()}&activityType=72`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    )

    const sleepData = await sleepResponse.json()

    return {
      success: true,
      data: {
        activities: parseGoogleFitActivities(activityData),
        sleep: parseGoogleFitSleep(sleepData),
        steps: extractTotalSteps(activityData)
      }
    }
  } catch (error) {
    console.error('Error fetching Google Fit data:', error)
    return { success: false, error: error.message }
  }
}

const parseGoogleFitActivities = (data) => {
  // Parse Google Fit activity data into our format
  return []
}

const parseGoogleFitSleep = (data) => {
  // Parse Google Fit sleep sessions into our format
  return []
}

const extractTotalSteps = (data) => {
  // Extract total steps from Google Fit data
  return 0
}

// ==================== APPLE HEALTH (Web) ====================

/**
 * Note: Apple Health doesn't have a public web API
 * Users must export data manually from the Health app
 */
export const connectAppleHealth = () => {
  return {
    success: false,
    message: 'Apple Health requires manual export. Please export from the Health app and upload the XML file.',
    instructions: [
      '1. Open Health app on iPhone',
      '2. Tap profile icon (top right)',
      '3. Scroll down → "Export All Health Data"',
      '4. Save the ZIP file',
      '5. Extract export.xml',
      '6. Upload here using "Import Data File"'
    ]
  }
}

// ==================== FITBIT API ====================

export const connectFitbit = async () => {
  const CLIENT_ID = import.meta.env.VITE_FITBIT_CLIENT_ID
  
  if (!CLIENT_ID) {
    return { success: false, error: 'Fitbit Client ID not configured' }
  }

  const authUrl = `https://www.fitbit.com/oauth2/authorize?` +
    `response_type=token&` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${window.location.origin}/oauth/callback&` +
    `scope=activity%20sleep%20heartrate%20weight&` +
    `state=fitbit`

  const popup = window.open(authUrl, 'FitbitAuth', 'width=500,height=600')
  
  return new Promise((resolve) => {
    window.addEventListener('message', function handler(event) {
      if (event.data.type === 'oauth_success' && event.data.state === 'fitbit') {
        window.removeEventListener('message', handler)
        popup?.close()
        resolve({ success: true, accessToken: event.data.accessToken })
      }
    })
  })
}

// ==================== SAMSUNG HEALTH ====================

export const connectSamsungHealth = () => {
  return {
    success: false,
    message: 'Samsung Health Web SDK requires Samsung developer account and app registration.',
    requiresSetup: true
  }
}

// ==================== GARMIN ====================

export const connectGarmin = async () => {
  const API_KEY = import.meta.env.VITE_GARMIN_API_KEY
  
  if (!API_KEY) {
    return { success: false, error: 'Garmin API credentials not configured' }
  }

  return {
    success: false,
    message: 'Garmin Connect API requires OAuth 1.0a setup',
    requiresSetup: true
  }
}

// ==================== WHOOP ====================

export const connectWhoop = async () => {
  return {
    success: false,
    message: 'WHOOP API requires application approval from WHOOP',
    requiresSetup: true
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if any health API is configured
 */
export const isHealthApiConfigured = () => {
  return !!(
    import.meta.env.VITE_GOOGLE_FIT_CLIENT_ID ||
    import.meta.env.VITE_FITBIT_CLIENT_ID ||
    import.meta.env.VITE_GARMIN_API_KEY
  )
}

/**
 * Get configured health platforms
 */
export const getConfiguredPlatforms = () => {
  const platforms = []
  
  if (import.meta.env.VITE_GOOGLE_FIT_CLIENT_ID) {
    platforms.push({ name: 'Google Fit', id: 'google-fit' })
  }
  if (import.meta.env.VITE_FITBIT_CLIENT_ID) {
    platforms.push({ name: 'Fitbit', id: 'fitbit' })
  }
  if (import.meta.env.VITE_GARMIN_API_KEY) {
    platforms.push({ name: 'Garmin', id: 'garmin' })
  }
  
  return platforms
}

export default {
  connectGoogleFit,
  connectAppleHealth,
  connectFitbit,
  connectSamsungHealth,
  connectGarmin,
  connectWhoop,
  isHealthApiConfigured,
  getConfiguredPlatforms,
  fetchGoogleFitData
}


