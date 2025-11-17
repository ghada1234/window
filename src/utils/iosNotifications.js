// Minimal iOS detection and stubs to satisfy NotificationSettings imports

export const isIOS = () => {
  if (typeof navigator === 'undefined') return false
  return /iP(hone|od|ad)/.test(navigator.platform) || /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export const isIOSSafari = () => {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua)
  return isIOS() && isSafari
}

export const isIOSPWA = () => {
  if (typeof window === 'undefined') return false
  return isIOS() && (window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true)
}

export const requestIOSPermission = async () => {
  // iOS web push requires installed PWA + APNs key; here we just mirror Notification API
  if (typeof Notification === 'undefined') {
    return { granted: false, reason: 'Notifications not supported' }
  }
  const status = await Notification.requestPermission()
  return { granted: status === 'granted' }
}

// Backward-compatible aliases used by NotificationSettings.jsx
export const checkIOSNotificationCompatibility = () => {
  return {
    isIOS: isIOS(),
    isIOSSafari: isIOSSafari(),
    isIOSPWA: isIOSPWA()
  }
}

export const requestIOSNotificationPermission = async () => {
  return requestIOSPermission()
}

export const showIOSTestNotification = async (title = 'Test', body = 'iOS notification test') => {
  if (typeof Notification === 'undefined') return { sent: false, reason: 'Notifications not supported' }
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return { sent: false, reason: 'Permission not granted' }
  try {
    new Notification(title, { body })
    return { sent: true }
  } catch {
    return { sent: false, reason: 'Notification blocked' }
  }
}

export const showIOSInstructions = () => {
  // No-op stub: in the app UI, instructions are rendered by components
  return {
    title: 'Enable Notifications on iOS',
    steps: [
      'Add to Home Screen for better notification support',
      'Then enable notifications in Settings > Notifications'
    ]
  }
}

export const getIOSInstallInstructions = () => showIOSInstructions()


