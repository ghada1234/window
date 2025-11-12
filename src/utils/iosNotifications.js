/**
 * iOS-specific notification utilities
 * iOS Safari has limited push notification support and requires PWA installation
 */

/**
 * Detect if the user is on iOS
 * @returns {boolean} True if iOS device
 */
export const isIOS = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

/**
 * Detect if the user is on iOS Safari (not standalone PWA)
 * @returns {boolean} True if iOS Safari browser
 */
export const isIOSSafari = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
  return isIOS && isSafari;
};

/**
 * Check if app is running as standalone (PWA) on iOS
 * @returns {boolean} True if running as PWA
 */
export const isIOSPWA = () => {
  return isIOS() && (window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches);
};

/**
 * Check if iOS device supports push notifications
 * iOS 16.4+ supports push notifications for installed PWAs
 * @returns {boolean} True if supported
 */
export const isIOSPushSupported = () => {
  if (!isIOS()) return true; // Not iOS, assume supported
  
  // Check if running as PWA
  if (!isIOSPWA()) return false;
  
  // Check iOS version (16.4+)
  const match = navigator.userAgent.match(/OS (\d+)_(\d+)/);
  if (match) {
    const majorVersion = parseInt(match[1], 10);
    const minorVersion = parseInt(match[2], 10);
    // iOS 16.4 or higher
    return majorVersion > 16 || (majorVersion === 16 && minorVersion >= 4);
  }
  
  return false;
};

/**
 * Get iOS version
 * @returns {object} { major, minor, patch } or null
 */
export const getIOSVersion = () => {
  if (!isIOS()) return null;
  
  const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
  if (match) {
    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: match[3] ? parseInt(match[3], 10) : 0
    };
  }
  return null;
};

/**
 * Request notification permission on iOS
 * @returns {Promise<string>} Permission status
 */
export const requestIOSNotificationPermission = async () => {
  try {
    if (!('Notification' in window)) {
      console.log('Notifications not supported on this device');
      return 'unsupported';
    }
    
    // On iOS, we need to be more careful with permission requests
    const permission = await Notification.requestPermission();
    console.log('iOS Notification permission:', permission);
    
    // Store permission status
    localStorage.setItem('ios_notification_permission', permission);
    
    return permission;
  } catch (error) {
    console.error('Error requesting iOS notification permission:', error);
    return 'denied';
  }
};

/**
 * Show a local notification on iOS
 * @param {string} title - Notification title
 * @param {object} options - Notification options
 * @returns {Notification|null} Notification instance or null
 */
export const showIOSNotification = (title, options = {}) => {
  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted');
    return null;
  }
  
  try {
    const defaultOptions = {
      icon: '/sun.jpg',
      badge: '/sun.jpg',
      tag: 'wellness-notification',
      requireInteraction: false,
      ...options
    };
    
    const notification = new Notification(title, defaultOptions);
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
    
    // Handle click
    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.onClick) {
        options.onClick();
      }
    };
    
    return notification;
  } catch (error) {
    console.error('Error showing iOS notification:', error);
    return null;
  }
};

/**
 * Schedule a local notification on iOS
 * @param {string} title - Notification title
 * @param {object} options - Notification options
 * @param {number} delay - Delay in milliseconds
 */
export const scheduleIOSNotification = (title, options = {}, delay = 0) => {
  setTimeout(() => {
    showIOSNotification(title, options);
  }, delay);
};

/**
 * Get installation instructions for iOS
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {object} Installation instructions
 */
export const getIOSInstallInstructions = (language = 'en') => {
  const instructions = {
    en: {
      title: 'Install App for Notifications',
      steps: [
        '1. Tap the Share button (⎗) at the bottom of Safari',
        '2. Scroll down and tap "Add to Home Screen"',
        '3. Tap "Add" in the top right corner',
        '4. Open the app from your home screen',
        '5. Enable notifications when prompted'
      ],
      note: 'Notifications only work when the app is installed on your home screen.'
    },
    ar: {
      title: 'تثبيت التطبيق للحصول على الإشعارات',
      steps: [
        '١. اضغط على زر المشاركة (⎗) في أسفل Safari',
        '٢. قم بالتمرير لأسفل واضغط على "إضافة إلى الشاشة الرئيسية"',
        '٣. اضغط على "إضافة" في الزاوية العلوية اليمنى',
        '٤. افتح التطبيق من شاشتك الرئيسية',
        '٥. قم بتفعيل الإشعارات عند الطلب'
      ],
      note: 'تعمل الإشعارات فقط عند تثبيت التطبيق على شاشتك الرئيسية.'
    }
  };
  
  return instructions[language] || instructions.en;
};

/**
 * Check if user needs to install PWA for notifications
 * @returns {object} { needsInstall, reason, canUseNotifications }
 */
export const checkIOSNotificationCompatibility = () => {
  if (!isIOS()) {
    return {
      needsInstall: false,
      reason: 'not-ios',
      canUseNotifications: true
    };
  }
  
  if (isIOSPWA()) {
    return {
      needsInstall: false,
      reason: 'already-installed',
      canUseNotifications: true
    };
  }
  
  if (isIOSSafari()) {
    return {
      needsInstall: true,
      reason: 'ios-safari-requires-pwa',
      canUseNotifications: false,
      message: 'Please install the app to your home screen to enable notifications.'
    };
  }
  
  return {
    needsInstall: false,
    reason: 'unknown',
    canUseNotifications: 'Notification' in window
  };
};

/**
 * Show test notification for iOS
 * @param {string} language - Language code
 */
export const showIOSTestNotification = (language = 'en') => {
  const messages = {
    en: {
      title: 'Test Notification',
      body: 'This is a test notification from your wellness app!'
    },
    ar: {
      title: 'إشعار تجريبي',
      body: 'هذا إشعار تجريبي من تطبيق العافية الخاص بك!'
    }
  };
  
  const msg = messages[language] || messages.en;
  return showIOSNotification(msg.title, { body: msg.body });
};

export default {
  isIOS,
  isIOSSafari,
  isIOSPWA,
  isIOSPushSupported,
  getIOSVersion,
  requestIOSNotificationPermission,
  showIOSNotification,
  scheduleIOSNotification,
  getIOSInstallInstructions,
  checkIOSNotificationCompatibility,
  showIOSTestNotification
};

