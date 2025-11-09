import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import './NotificationPrompt.css'

const NotificationPrompt = () => {
  const [show, setShow] = useState(false)
  const [permission, setPermission] = useState(Notification.permission)

  useEffect(() => {
    if (permission === 'default') {
      // Show prompt after 5 seconds if permission hasn't been granted
      const timer = setTimeout(() => {
        setShow(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [permission])

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      setShow(false)
    } catch (error) {
      console.error('Notification permission error:', error)
    }
  }

  const dismiss = () => {
    setShow(false)
    localStorage.setItem('notificationPromptDismissed', 'true')
  }

  if (!show || permission !== 'default') {
    return null
  }

  return (
    <div className="notification-prompt">
      <div className="notification-prompt-content">
        <Bell size={24} />
        <div>
          <h4>Enable Notifications</h4>
          <p>Stay updated with your wellness progress</p>
        </div>
        <div className="notification-prompt-actions">
          <button className="btn-enable" onClick={requestPermission}>
            Enable
          </button>
          <button className="btn-dismiss" onClick={dismiss}>
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationPrompt
