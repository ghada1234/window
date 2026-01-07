// Data backup and recovery utilities
import { getJSON, setJSON, safeStorage } from './storage'

// Create a complete backup of all wellness data
export const createBackup = () => {
  const backup = {
    timestamp: new Date().toISOString(),
    version: '1.0',
    data: {}
  }
  
  // Keys to backup
  const keysToBackup = [
    'users',
    'isLoggedIn',
    'currentUser',
    'wellnessData',
    'nutrition',
    'water',
    'activities',
    'sleep',
    'mood',
    'habits',
    'goals',
    'journal',
    'passwordResetRequests'
  ]
  
  keysToBackup.forEach(key => {
    const value = getJSON(key)
    if (value !== null && value !== undefined) {
      backup.data[key] = value
    }
  })
  
  console.log('📦 Created data backup:', backup)
  return backup
}

// Restore from backup
export const restoreBackup = (backup) => {
  try {
    if (!backup || !backup.data) {
      throw new Error('Invalid backup format')
    }
    
    let restored = 0
    
    // Special handling for activities - merge with existing instead of replacing
    if (backup.data.activities && Array.isArray(backup.data.activities)) {
      const existingActivities = getJSON('activities', [])
      const backupActivities = backup.data.activities
      
      // Format activities to ensure they have the correct structure
      const formattedActivities = backupActivities.map((act, idx) => {
        // If activity already has correct format, use it
        if (act.id && act.name && act.duration !== undefined && act.date) {
          return act
        }
        
        // Otherwise, format it
        return {
          id: act.id || Date.now() + idx,
          name: act.name || act.type || 'Workout',
          duration: typeof act.duration === 'number' ? act.duration : (parseInt(act.duration) || 30),
          calories: typeof act.calories === 'number' ? act.calories : (parseInt(act.calories) || 0),
          date: act.date || new Date().toISOString()
        }
      })
      
      // Merge activities (avoid duplicates based on id)
      const existingIds = new Set(existingActivities.map(a => a.id))
      const newActivities = formattedActivities.filter(a => !existingIds.has(a.id))
      const mergedActivities = [...newActivities, ...existingActivities]
      
      if (setJSON('activities', mergedActivities)) {
        restored++
        console.log(`✓ Restored ${formattedActivities.length} activities (${newActivities.length} new, ${existingActivities.length} existing)`)
      }
      
      // Remove from backup.data so we don't process it again
      delete backup.data.activities
    }
    
    // Restore other data normally
    for (const [key, value] of Object.entries(backup.data)) {
      if (setJSON(key, value)) {
        restored++
      }
    }
    
    console.log(`✓ Restored ${restored} items from backup`)
    return true
  } catch (error) {
    console.error('✗ Error restoring backup:', error)
    return false
  }
}

// Download backup as file
export const downloadBackup = () => {
  const backup = createBackup()
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `wellness-backup-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
  console.log('⬇️ Downloaded backup file')
}

// Auto-save before page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    try {
      const backup = createBackup()
      safeStorage.setItem('autoBackup', JSON.stringify(backup))
      console.log('💾 Auto-backup created before page unload')
    } catch (error) {
      console.error('Auto-backup failed:', error)
    }
  })
  
  // Periodic auto-backup (every 5 minutes)
  setInterval(() => {
    try {
      const backup = createBackup()
      safeStorage.setItem('autoBackup', JSON.stringify(backup))
      console.log('💾 Auto-backup created (periodic)')
    } catch (error) {
      console.error('Periodic auto-backup failed:', error)
    }
  }, 5 * 60 * 1000) // 5 minutes
}

