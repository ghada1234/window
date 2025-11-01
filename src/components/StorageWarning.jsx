import { useState, useEffect } from 'react'
import { AlertCircle, X } from 'lucide-react'
import safeStorage from '../utils/storage'
import './StorageWarning.css'

const StorageWarning = () => {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    // Check if storage is persistent (localStorage available)
    // Show warning if using memory storage (incognito mode)
    if (!safeStorage.isPersistent()) {
      // Check if user has dismissed the warning before
      const dismissed = safeStorage.getItem('storageWarningDismissed')
      if (!dismissed) {
        setShowWarning(true)
      }
    }
  }, [])

  const handleDismiss = () => {
    setShowWarning(false)
    // Store dismissal preference (will only persist if localStorage becomes available)
    safeStorage.setItem('storageWarningDismissed', 'true')
  }

  if (!showWarning) return null

  return (
    <div className="storage-warning">
      <div className="storage-warning-content">
        <AlertCircle size={20} />
        <div className="storage-warning-text">
          <strong>Incognito/Private Mode Detected:</strong> Your data will be saved during this tab session (including page refreshes), 
          but will be permanently lost when you close this tab. 
          For permanent data storage, please use a regular browser window.
        </div>
        <button 
          className="storage-warning-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss warning"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

export default StorageWarning

