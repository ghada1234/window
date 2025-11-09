import { auth } from './firebase'
import { getJSON, setJSON } from './storage'

/**
 * Get user statistics from Firebase and local storage
 */

// Track user activity
export const trackUserActivity = (userId, activityType) => {
  const activities = getJSON('userActivities', [])
  activities.push({
    userId,
    type: activityType,
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString()
  })
  // Keep only last 1000 activities
  setJSON('userActivities', activities.slice(-1000))
}

// Get total registered users count
export const getTotalUsers = () => {
  try {
    // In production with Firebase Admin SDK, you'd use:
    // const listUsersResult = await admin.auth().listUsers()
    // return listUsersResult.users.length
    
    // For now, we'll track locally + Firebase Auth current user
    const registeredUsers = getJSON('registeredUsersCount', 0)
    return registeredUsers
  } catch (error) {
    console.error('Error getting total users:', error)
    return 0
  }
}

// Increment user count on new registration
export const incrementUserCount = () => {
  const current = getJSON('registeredUsersCount', 0)
  setJSON('registeredUsersCount', current + 1)
}

// Get active users (last 7 days)
export const getActiveUsers = () => {
  const activities = getJSON('userActivities', [])
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const recentActivities = activities.filter(a => 
    new Date(a.timestamp) >= sevenDaysAgo
  )
  
  const uniqueUsers = new Set(recentActivities.map(a => a.userId))
  return uniqueUsers.size
}

// Get user sign-ups per day (last 30 days)
export const getSignUpsPerDay = () => {
  const signUps = getJSON('userSignUps', [])
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const recentSignUps = signUps.filter(s => 
    new Date(s.date) >= thirtyDaysAgo
  )
  
  // Group by date
  const byDate = {}
  recentSignUps.forEach(signup => {
    const date = new Date(signup.date).toLocaleDateString()
    byDate[date] = (byDate[date] || 0) + 1
  })
  
  return byDate
}

// Track new user sign-up
export const trackSignUp = (userId, email, method = 'email') => {
  const signUps = getJSON('userSignUps', [])
  signUps.push({
    userId,
    email,
    method,
    date: new Date().toISOString(),
    country: 'Unknown' // Would be detected via IP geolocation in production
  })
  setJSON('userSignUps', signUps)
  incrementUserCount()
}

// Get users by country
export const getUsersByCountry = () => {
  const signUps = getJSON('userSignUps', [])
  const byCountry = {}
  
  signUps.forEach(signup => {
    const country = signup.country || 'Unknown'
    byCountry[country] = (byCountry[country] || 0) + 1
  })
  
  return byCountry
}

// Get current user info
export const getCurrentUserInfo = () => {
  const user = auth.currentUser
  if (!user) return null
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    createdAt: user.metadata.creationTime,
    lastSignIn: user.metadata.lastSignInTime
  }
}

// Get user engagement score
export const getUserEngagementScore = (userId) => {
  const activities = getJSON('userActivities', [])
  const userActivities = activities.filter(a => a.userId === userId)
  
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const recentActivities = userActivities.filter(a => 
    new Date(a.timestamp) >= thirtyDaysAgo
  )
  
  return recentActivities.length
}

// Get most active users
export const getMostActiveUsers = (limit = 10) => {
  const activities = getJSON('userActivities', [])
  const signUps = getJSON('userSignUps', [])
  
  // Count activities per user
  const userActivityCount = {}
  activities.forEach(a => {
    userActivityCount[a.userId] = (userActivityCount[a.userId] || 0) + 1
  })
  
  // Sort by activity count
  const sorted = Object.entries(userActivityCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
  
  // Get user details
  return sorted.map(([userId, count]) => {
    const userSignUp = signUps.find(s => s.userId === userId)
    return {
      userId,
      email: userSignUp?.email || 'Unknown',
      activityCount: count,
      country: userSignUp?.country || 'Unknown'
    }
  })
}

// Get growth rate
export const getGrowthRate = () => {
  const signUps = getJSON('userSignUps', [])
  
  const now = new Date()
  const thisWeek = signUps.filter(s => {
    const signUpDate = new Date(s.date)
    const daysDiff = (now - signUpDate) / (1000 * 60 * 60 * 24)
    return daysDiff <= 7
  }).length
  
  const lastWeek = signUps.filter(s => {
    const signUpDate = new Date(s.date)
    const daysDiff = (now - signUpDate) / (1000 * 60 * 60 * 24)
    return daysDiff > 7 && daysDiff <= 14
  }).length
  
  if (lastWeek === 0) return 0
  return ((thisWeek - lastWeek) / lastWeek * 100).toFixed(1)
}

// Initialize with Google Analytics data
export const initializeUserStats = () => {
  // If no data exists, set initial count from GA
  const current = getJSON('registeredUsersCount', 0)
  if (current === 0) {
    // Set to 304 based on GA data
    setJSON('registeredUsersCount', 304)
  }
}


