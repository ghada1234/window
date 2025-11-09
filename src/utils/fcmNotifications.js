import { messaging, getToken, onMessage } from './firebase';

// Your VAPID key from Firebase Console
// Go to: Project Settings > Cloud Messaging > Web Push certificates > Generate key pair
const VAPID_KEY = 'BB-SUHcjxWwYZrriDgWwpNtTewt5aiyxwVjaCcflxVqw13T0Lytdt-dB_MeP9ZOw5CLOm7qXTiPTxCdD7w8MjtY';

/**
 * Request notification permission from the user
 * @returns {Promise<string>} Permission status: 'granted', 'denied', or 'default'
 */
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    throw error;
  }
};

/**
 * Get FCM registration token
 * @returns {Promise<string|null>} FCM token or null if unavailable
 */
export const getFCMToken = async () => {
  try {
    if (!messaging) {
      console.error('Firebase messaging is not initialized');
      return null;
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      console.error('Service Worker is not supported');
      return null;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('Service Worker registered:', registration);

    // Request permission first
    const permission = await requestNotificationPermission();
    
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }

    // Get FCM token
    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (currentToken) {
      console.log('FCM Token obtained:', currentToken);
      // Save token to localStorage for reference
      localStorage.setItem('fcm_token', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

/**
 * Get stored FCM token from localStorage
 * @returns {string|null} Stored token or null
 */
export const getStoredToken = () => {
  return localStorage.getItem('fcm_token');
};

/**
 * Send token to your backend server
 * @param {string} token - FCM token
 * @param {object} userData - Additional user data
 */
export const sendTokenToServer = async (token, userData = {}) => {
  try {
    // TODO: Replace with your actual backend endpoint
    const response = await fetch('/api/save-fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        ...userData,
        timestamp: new Date().toISOString()
      })
    });

    if (response.ok) {
      console.log('Token sent to server successfully');
      return true;
    } else {
      console.error('Failed to send token to server');
      return false;
    }
  } catch (error) {
    console.error('Error sending token to server:', error);
    return false;
  }
};

/**
 * Set up foreground message listener
 * @param {Function} callback - Callback function to handle messages
 */
export const setupForegroundMessageListener = (callback) => {
  if (!messaging) {
    console.error('Firebase messaging is not initialized');
    return;
  }

  onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    
    // Show notification even when app is in foreground
    if (payload.notification) {
      const { title, body } = payload.notification;
      
      // Display browser notification
      if (Notification.permission === 'granted') {
        new Notification(title || 'Wellness Reminder', {
          body: body || 'You have a new notification',
          icon: '/sun.jpg',
          badge: '/sun.jpg',
          tag: 'wellness-notification',
          data: payload.data
        });
      }
      
      // Call custom callback if provided
      if (callback) {
        callback(payload);
      }
    }
  });
};

/**
 * Check if notifications are supported
 * @returns {boolean} True if supported
 */
export const areNotificationsSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

/**
 * Get current notification permission status
 * @returns {string} Permission status
 */
export const getNotificationPermissionStatus = () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

/**
 * Initialize FCM and set up listeners
 * @param {Function} messageCallback - Callback for foreground messages
 * @returns {Promise<string|null>} FCM token or null
 */
export const initializeFCM = async (messageCallback) => {
  try {
    if (!areNotificationsSupported()) {
      console.log('Notifications are not supported in this browser');
      return null;
    }

    // Set up foreground message listener
    setupForegroundMessageListener(messageCallback);

    // Get and return token
    const token = await getFCMToken();
    return token;
  } catch (error) {
    console.error('Error initializing FCM:', error);
    return null;
  }
};

/**
 * Delete FCM token
 */
export const deleteFCMToken = () => {
  localStorage.removeItem('fcm_token');
  console.log('FCM token deleted from storage');
};

/**
 * Schedule a local notification (requires service worker)
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {number} delay - Delay in milliseconds
 */
export const scheduleLocalNotification = (title, body, delay = 0) => {
  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted');
    return;
  }

  setTimeout(() => {
    new Notification(title, {
      body,
      icon: '/sun.jpg',
      badge: '/sun.jpg',
      tag: 'wellness-reminder'
    });
  }, delay);
};

export default {
  requestNotificationPermission,
  getFCMToken,
  getStoredToken,
  sendTokenToServer,
  setupForegroundMessageListener,
  areNotificationsSupported,
  getNotificationPermissionStatus,
  initializeFCM,
  deleteFCMToken,
  scheduleLocalNotification
};








// Your VAPID key from Firebase Console
// Go to: Project Settings > Cloud Messaging > Web Push certificates > Generate key pair
const VAPID_KEY = 'BB-SUHcjxWwYZrriDgWwpNtTewt5aiyxwVjaCcflxVqw13T0Lytdt-dB_MeP9ZOw5CLOm7qXTiPTxCdD7w8MjtY';

/**
 * Request notification permission from the user
 * @returns {Promise<string>} Permission status: 'granted', 'denied', or 'default'
 */
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    throw error;
  }
};

/**
 * Get FCM registration token
 * @returns {Promise<string|null>} FCM token or null if unavailable
 */
export const getFCMToken = async () => {
  try {
    if (!messaging) {
      console.error('Firebase messaging is not initialized');
      return null;
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      console.error('Service Worker is not supported');
      return null;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('Service Worker registered:', registration);

    // Request permission first
    const permission = await requestNotificationPermission();
    
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }

    // Get FCM token
    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (currentToken) {
      console.log('FCM Token obtained:', currentToken);
      // Save token to localStorage for reference
      localStorage.setItem('fcm_token', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

/**
 * Get stored FCM token from localStorage
 * @returns {string|null} Stored token or null
 */
export const getStoredToken = () => {
  return localStorage.getItem('fcm_token');
};

/**
 * Send token to your backend server
 * @param {string} token - FCM token
 * @param {object} userData - Additional user data
 */
export const sendTokenToServer = async (token, userData = {}) => {
  try {
    // TODO: Replace with your actual backend endpoint
    const response = await fetch('/api/save-fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        ...userData,
        timestamp: new Date().toISOString()
      })
    });

    if (response.ok) {
      console.log('Token sent to server successfully');
      return true;
    } else {
      console.error('Failed to send token to server');
      return false;
    }
  } catch (error) {
    console.error('Error sending token to server:', error);
    return false;
  }
};

/**
 * Set up foreground message listener
 * @param {Function} callback - Callback function to handle messages
 */
export const setupForegroundMessageListener = (callback) => {
  if (!messaging) {
    console.error('Firebase messaging is not initialized');
    return;
  }

  onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    
    // Show notification even when app is in foreground
    if (payload.notification) {
      const { title, body } = payload.notification;
      
      // Display browser notification
      if (Notification.permission === 'granted') {
        new Notification(title || 'Wellness Reminder', {
          body: body || 'You have a new notification',
          icon: '/sun.jpg',
          badge: '/sun.jpg',
          tag: 'wellness-notification',
          data: payload.data
        });
      }
      
      // Call custom callback if provided
      if (callback) {
        callback(payload);
      }
    }
  });
};

/**
 * Check if notifications are supported
 * @returns {boolean} True if supported
 */
export const areNotificationsSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

/**
 * Get current notification permission status
 * @returns {string} Permission status
 */
export const getNotificationPermissionStatus = () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

/**
 * Initialize FCM and set up listeners
 * @param {Function} messageCallback - Callback for foreground messages
 * @returns {Promise<string|null>} FCM token or null
 */
export const initializeFCM = async (messageCallback) => {
  try {
    if (!areNotificationsSupported()) {
      console.log('Notifications are not supported in this browser');
      return null;
    }

    // Set up foreground message listener
    setupForegroundMessageListener(messageCallback);

    // Get and return token
    const token = await getFCMToken();
    return token;
  } catch (error) {
    console.error('Error initializing FCM:', error);
    return null;
  }
};

/**
 * Delete FCM token
 */
export const deleteFCMToken = () => {
  localStorage.removeItem('fcm_token');
  console.log('FCM token deleted from storage');
};

/**
 * Schedule a local notification (requires service worker)
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {number} delay - Delay in milliseconds
 */
export const scheduleLocalNotification = (title, body, delay = 0) => {
  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted');
    return;
  }

  setTimeout(() => {
    new Notification(title, {
      body,
      icon: '/sun.jpg',
      badge: '/sun.jpg',
      tag: 'wellness-reminder'
    });
  }, delay);
};

export default {
  requestNotificationPermission,
  getFCMToken,
  getStoredToken,
  sendTokenToServer,
  setupForegroundMessageListener,
  areNotificationsSupported,
  getNotificationPermissionStatus,
  initializeFCM,
  deleteFCMToken,
  scheduleLocalNotification
};







