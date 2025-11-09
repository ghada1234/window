import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Monitor, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './InstallPrompt.css'

const InstallPrompt = () => {
  const { t } = useTranslation()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(iOS)

    // Listen for beforeinstallprompt event (Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Check if user has dismissed the prompt before
      const dismissed = localStorage.getItem('installPromptDismissed')
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000) // Show after 3 seconds
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        setShowIOSInstructions(true)
      }
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
      setIsInstalled(true)
    } else {
      console.log('User dismissed the install prompt')
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('installPromptDismissed', 'true')
  }

  const handleShowInstallButton = () => {
    setShowPrompt(true)
  }

  if (isInstalled) {
    return (
      <div className="install-success-badge">
        <Check size={16} />
        <span>{t('install.installed')}</span>
      </div>
    )
  }

  return (
    <>
      {/* Floating Install Button */}
      {!showPrompt && (deferredPrompt || isIOS) && (
        <button className="floating-install-btn" onClick={handleShowInstallButton}>
          <Download size={20} />
          <span>{t('install.installApp')}</span>
        </button>
      )}

      {/* Install Prompt Banner */}
      {showPrompt && (
        <div className="install-prompt-banner">
          <div className="install-prompt-content">
            <div className="install-icon">
              {isIOS ? <Smartphone size={32} /> : <Monitor size={32} />}
            </div>
            <div className="install-text">
              <h3>{t('install.title')}</h3>
              <p>{t('install.description')}</p>
            </div>
            <div className="install-actions">
              <button className="install-btn" onClick={handleInstallClick}>
                <Download size={18} />
                {t('install.installNow')}
              </button>
              <button className="dismiss-btn" onClick={handleDismiss}>
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Installation Instructions Modal */}
      {showIOSInstructions && (
        <div className="modal-overlay" onClick={() => setShowIOSInstructions(false)}>
          <div className="ios-instructions-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('install.iosTitle')}</h2>
              <button className="close-btn" onClick={() => setShowIOSInstructions(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="ios-steps">
              <div className="ios-step">
                <div className="step-number">1</div>
                <p>{t('install.iosStep1')}</p>
                <div className="ios-icon">📱 👇 <strong>{t('install.shareIcon')}</strong></div>
              </div>
              <div className="ios-step">
                <div className="step-number">2</div>
                <p>{t('install.iosStep2')}</p>
                <div className="ios-icon">➕ <strong>{t('install.addToHomeScreen')}</strong></div>
              </div>
              <div className="ios-step">
                <div className="step-number">3</div>
                <p>{t('install.iosStep3')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default InstallPrompt

