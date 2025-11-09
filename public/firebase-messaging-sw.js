// Firebase Cloud Messaging Service Worker

// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9cetovv4C_j0_MCCqGf-RmgFMI-12ceI",
  authDomain: "find-a1709.firebaseapp.com",
  projectId: "find-a1709",
  storageBucket: "find-a1709.firebasestorage.app",
  messagingSenderId: "573737393475",
  appId: "1:573737393475:web:b93e37e4c3b7fb863863f6",
  measurementId: "G-LLTC9KQSY8"
};

// Initialize Firebase in service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  // Customize notification
  const notificationTitle = payload.notification?.title || 'Wellness Reminder';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/sun.jpg',
    badge: '/sun.jpg',
    vibrate: [200, 100, 200],
    tag: 'wellness-notification',
    requireInteraction: false,
    data: {
      url: payload.data?.url || '/',
      ...payload.data
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  
  event.notification.close();
  
  // Open the app or focus existing window
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});








// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9cetovv4C_j0_MCCqGf-RmgFMI-12ceI",
  authDomain: "find-a1709.firebaseapp.com",
  projectId: "find-a1709",
  storageBucket: "find-a1709.firebasestorage.app",
  messagingSenderId: "573737393475",
  appId: "1:573737393475:web:b93e37e4c3b7fb863863f6",
  measurementId: "G-LLTC9KQSY8"
};

// Initialize Firebase in service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  // Customize notification
  const notificationTitle = payload.notification?.title || 'Wellness Reminder';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/sun.jpg',
    badge: '/sun.jpg',
    vibrate: [200, 100, 200],
    tag: 'wellness-notification',
    requireInteraction: false,
    data: {
      url: payload.data?.url || '/',
      ...payload.data
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  
  event.notification.close();
  
  // Open the app or focus existing window
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});








// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9cetovv4C_j0_MCCqGf-RmgFMI-12ceI",
  authDomain: "find-a1709.firebaseapp.com",
  projectId: "find-a1709",
  storageBucket: "find-a1709.firebasestorage.app",
  messagingSenderId: "573737393475",
  appId: "1:573737393475:web:b93e37e4c3b7fb863863f6",
  measurementId: "G-LLTC9KQSY8"
};

// Initialize Firebase in service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  // Customize notification
  const notificationTitle = payload.notification?.title || 'Wellness Reminder';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/sun.jpg',
    badge: '/sun.jpg',
    vibrate: [200, 100, 200],
    tag: 'wellness-notification',
    requireInteraction: false,
    data: {
      url: payload.data?.url || '/',
      ...payload.data
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  
  event.notification.close();
  
  // Open the app or focus existing window
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});








// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9cetovv4C_j0_MCCqGf-RmgFMI-12ceI",
  authDomain: "find-a1709.firebaseapp.com",
  projectId: "find-a1709",
  storageBucket: "find-a1709.firebasestorage.app",
  messagingSenderId: "573737393475",
  appId: "1:573737393475:web:b93e37e4c3b7fb863863f6",
  measurementId: "G-LLTC9KQSY8"
};

// Initialize Firebase in service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  // Customize notification
  const notificationTitle = payload.notification?.title || 'Wellness Reminder';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/sun.jpg',
    badge: '/sun.jpg',
    vibrate: [200, 100, 200],
    tag: 'wellness-notification',
    requireInteraction: false,
    data: {
      url: payload.data?.url || '/',
      ...payload.data
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  
  event.notification.close();
  
  // Open the app or focus existing window
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});








// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9cetovv4C_j0_MCCqGf-RmgFMI-12ceI",
  authDomain: "find-a1709.firebaseapp.com",
  projectId: "find-a1709",
  storageBucket: "find-a1709.firebasestorage.app",
  messagingSenderId: "573737393475",
  appId: "1:573737393475:web:b93e37e4c3b7fb863863f6",
  measurementId: "G-LLTC9KQSY8"
};

// Initialize Firebase in service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  // Customize notification
  const notificationTitle = payload.notification?.title || 'Wellness Reminder';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/sun.jpg',
    badge: '/sun.jpg',
    vibrate: [200, 100, 200],
    tag: 'wellness-notification',
    requireInteraction: false,
    data: {
      url: payload.data?.url || '/',
      ...payload.data
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  
  event.notification.close();
  
  // Open the app or focus existing window
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});








// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9cetovv4C_j0_MCCqGf-RmgFMI-12ceI",
  authDomain: "find-a1709.firebaseapp.com",
  projectId: "find-a1709",
  storageBucket: "find-a1709.firebasestorage.app",
  messagingSenderId: "573737393475",
  appId: "1:573737393475:web:b93e37e4c3b7fb863863f6",
  measurementId: "G-LLTC9KQSY8"
};

// Initialize Firebase in service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  // Customize notification
  const notificationTitle = payload.notification?.title || 'Wellness Reminder';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/sun.jpg',
    badge: '/sun.jpg',
    vibrate: [200, 100, 200],
    tag: 'wellness-notification',
    requireInteraction: false,
    data: {
      url: payload.data?.url || '/',
      ...payload.data
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  
  event.notification.close();
  
  // Open the app or focus existing window
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});







