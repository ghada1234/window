// Safe localStorage wrapper that handles incognito mode and storage restrictions

// In-memory fallback storage (only used if both localStorage and sessionStorage fail)
const memoryStorage = new Map()

// Check if localStorage is available and working
const isLocalStorageAvailable = () => {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

// Check if sessionStorage is available and working
const isSessionStorageAvailable = () => {
  try {
    const test = '__storage_test__'
    sessionStorage.setItem(test, test)
    sessionStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

const localStorageAvailable = isLocalStorageAvailable()
const sessionStorageAvailable = isSessionStorageAvailable()

// Safe storage wrapper
export const safeStorage = {
  getItem: (key) => {
    // Try localStorage first (persists forever)
    if (localStorageAvailable) {
      try {
        return localStorage.getItem(key)
      } catch (e) {
        console.warn(`localStorage.getItem failed for key "${key}":`, e)
      }
    }
    
    // Fallback to sessionStorage (persists during tab session, works in incognito)
    if (sessionStorageAvailable) {
      try {
        return sessionStorage.getItem(key)
      } catch (e) {
        console.warn(`sessionStorage.getItem failed for key "${key}":`, e)
      }
    }
    
    // Last resort: memory storage (cleared on refresh)
    return memoryStorage.get(key) || null
  },

  setItem: (key, value) => {
    let success = false
    
    // Try localStorage first
    if (localStorageAvailable) {
      try {
        localStorage.setItem(key, value)
        success = true
      } catch (e) {
        console.warn(`localStorage.setItem failed for key "${key}":`, e)
      }
    }
    
    // Fallback to sessionStorage (works in incognito mode)
    if (!success && sessionStorageAvailable) {
      try {
        sessionStorage.setItem(key, value)
        success = true
      } catch (e) {
        console.warn(`sessionStorage.setItem failed for key "${key}":`, e)
      }
    }
    
    // Last resort: memory storage
    if (!success) {
      memoryStorage.set(key, value)
    }
    
    return success
  },

  removeItem: (key) => {
    if (localStorageAvailable) {
      try {
        localStorage.removeItem(key)
      } catch (e) {
        console.warn(`localStorage.removeItem failed for key "${key}":`, e)
      }
    }
    
    if (sessionStorageAvailable) {
      try {
        sessionStorage.removeItem(key)
      } catch (e) {
        console.warn(`sessionStorage.removeItem failed for key "${key}":`, e)
      }
    }
    
    memoryStorage.delete(key)
  },

  clear: () => {
    if (localStorageAvailable) {
      try {
        localStorage.clear()
      } catch (e) {
        console.warn('localStorage.clear failed:', e)
      }
    }
    
    if (sessionStorageAvailable) {
      try {
        sessionStorage.clear()
      } catch (e) {
        console.warn('sessionStorage.clear failed:', e)
      }
    }
    
    memoryStorage.clear()
  },

  isPersistent: () => localStorageAvailable,
  
  // Get storage type (for debugging/info)
  getStorageType: () => {
    if (localStorageAvailable) {
      return 'localStorage (permanent)'
    }
    if (sessionStorageAvailable) {
      return 'sessionStorage (tab session)'
    }
    return 'memory (page session only)'
  }
}

// Warn user if not using localStorage
if (!localStorageAvailable) {
  const storageType = sessionStorageAvailable ? 'sessionStorage (tab session)' : 'memory (page session only)'
  console.warn(`⚠️ localStorage is not available. Using ${storageType} instead. Data will ${sessionStorageAvailable ? 'persist during this tab session but will be lost when you close the tab' : 'only persist until you refresh the page'}.`)
  
  // Show a user-friendly warning in the console and optionally in UI
  if (typeof window !== 'undefined') {
    const warningMessage = sessionStorageAvailable 
      ? 'You are in incognito/private mode. Your data will be saved during this tab session but will be lost when you close the tab.'
      : 'Storage is severely restricted. Data will only last until you refresh this page.'
    
    // Store the warning to show it in UI if needed
    window.__storageWarning = warningMessage
  }
}

// Export convenience functions for JSON
export const getJSON = (key, defaultValue = null) => {
  try {
    const item = safeStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (e) {
    console.warn(`Failed to parse JSON for key "${key}":`, e)
    return defaultValue
  }
}

export const setJSON = (key, value) => {
  try {
    const json = JSON.stringify(value)
    return safeStorage.setItem(key, json)
  } catch (e) {
    console.warn(`Failed to stringify JSON for key "${key}":`, e)
    return false
  }
}

export default safeStorage

