import { useState, useEffect } from 'react'
import { Bell, X, Download, Smartphone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { 
  isIOS, 
  isIOSSafari, 
  isIOSPWA, 
  checkIOSNotificationCompatibility,
  requestIOSNotificationPermission,
  getIOSInstallInstructions
} from '../../utils/iosNotifications'
import './NotificationPrompt.css'

const NotificationPrompt = () => {
  const { t, i18n } = useTranslation()
  const [show, setShow] = useState(false)
  const [permission, setPermission] = useState('Notification' in window ? Notification.permission : 'unsupported')
  const [iosCompatibility, setIosCompatibility] = useState(null)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)

  useEffect(() => {
    // Check if user dismissed the prompt
    const dismissed = localStorage.getItem('notificationPromptDismissed')
    if (dismissed) return

    // Check iOS compatibility
    const iosCheck = checkIOSNotificationCompatibility()
    setIosCompatibility(iosCheck)

    // Show prompt logic
    if (permission === 'default' || (isIOS() && iosCheck.needsInstall)) {
      const timer = setTimeout(() => {
        setShow(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [permission])

  const requestPermission = async () => {
    try {
      // Check if iOS needs PWA installation first
      if (isIOSSafari()) {
        setShowIOSInstructions(true)
        return
      }

      // For iOS PWA or other platforms
      let result
      if (isIOS()) {
        result = await requestIOSNotificationPermission()
      } else {
        result = await Notification.requestPermission()
      }
      
      setPermission(result)
      if (result === 'granted') {
        setShow(false)
      }
    } catch (error) {
      console.error('Notification permission error:', error)
    }
  }

  const dismiss = () => {
    setShow(false)
    setShowIOSInstructions(false)
    localStorage.setItem('notificationPromptDismissed', 'true')
  }

  if (!show || (!iosCompatibility?.needsInstall && permission !== 'default')) {
    return null
  }

  // iOS Safari - needs installation
  if (isIOSSafari() && showIOSInstructions) {
    const instructions = getIOSInstallInstructions(i18n.language)
    
    return (
      <div className="notification-prompt ios-install-prompt">
        <div className="notification-prompt-content ios-instructions">
          <Smartphone size={24} />
          <div>
            <h4>{instructions.title}</h4>
            <ol className="ios-steps">
              {instructions.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            <p className="ios-note">{instructions.note}</p>
          </div>
          <button className="btn-dismiss" onClick={dismiss} aria-label={t('notificationPrompt.dismiss')}>
            <X size={18} />
          </button>
        </div>
      </div>
    )
  }

  // iOS Safari - show install prompt
  if (isIOSSafari() && iosCompatibility?.needsInstall) {
    return (
      <div className="notification-prompt">
        <div className="notification-prompt-content">
          <Download size={24} />
          <div>
            <h4>{t('notificationPrompt.title')}</h4>
            <p>{t('notificationPrompt.iosInstallRequired')}</p>
          </div>
          <div className="notification-prompt-actions">
            <button className="btn-enable" onClick={requestPermission}>
              {t('notificationPrompt.showInstructions')}
            </button>
            <button className="btn-dismiss" onClick={dismiss} aria-label={t('notificationPrompt.dismiss')}>
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Default notification prompt (for iOS PWA and other platforms)
  return (
    <div className="notification-prompt">
      <div className="notification-prompt-content">
        <Bell size={24} />
        <div>
          <h4>{t('notificationPrompt.title')}</h4>
          <p>{t('notificationPrompt.description')}</p>
        </div>
        <div className="notification-prompt-actions">
          <button className="btn-enable" onClick={requestPermission}>
            {t('notificationPrompt.enable')}
          </button>
          <button className="btn-dismiss" onClick={dismiss} aria-label={t('notificationPrompt.dismiss')}>
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationPrompt