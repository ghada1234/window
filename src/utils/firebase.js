import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken as getMessagingToken, onMessage as onMessagingMessage, isSupported } from 'firebase/messaging';

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
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize messaging only if supported
let messaging = null;
isSupported().then(supported => {
  if (supported) {
    messaging = getMessaging(app);
  }
}).catch(err => {
  console.log('Firebase Messaging not supported:', err);
});

export { messaging };
export { getMessagingToken as getToken, onMessagingMessage as onMessage };
export default app;
