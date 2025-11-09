import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAuth } from 'firebase/auth';

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

// Initialize Firebase
let app;
let messaging = null;
let auth = null;

try {
  app = initializeApp(firebaseConfig);
  // Initialize Firebase Cloud Messaging
  messaging = getMessaging(app);
  // Initialize Firebase Authentication
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app, messaging, auth };
export { getToken, onMessage };








import { getAuth } from 'firebase/auth';

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

// Initialize Firebase
let app;
let messaging = null;
let auth = null;

try {
  app = initializeApp(firebaseConfig);
  // Initialize Firebase Cloud Messaging
  messaging = getMessaging(app);
  // Initialize Firebase Authentication
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app, messaging, auth };
export { getToken, onMessage };







