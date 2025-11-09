import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from './firebase'

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName
      }
    }
  } catch (error) {
    console.error('Sign in error:', error)
    return {
      success: false,
      error: getErrorMessage(error.code)
    }
  }
}

// Sign up with email and password
export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName || userCredential.user.displayName
      }
    }
  } catch (error) {
    console.error('Sign up error:', error)
    return {
      success: false,
      error: getErrorMessage(error.code)
    }
  }
}

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      }
    }
  } catch (error) {
    console.error('Google sign in error:', error)
    return {
      success: false,
      error: getErrorMessage(error.code)
    }
  }
}

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
    return { success: true }
  } catch (error) {
    console.error('Sign out error:', error)
    return {
      success: false,
      error: getErrorMessage(error.code)
    }
  }
}

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true }
  } catch (error) {
    console.error('Password reset error:', error)
    return {
      success: false,
      error: getErrorMessage(error.code)
    }
  }
}

// Get current user
export const getCurrentUser = () => {
  const user = auth.currentUser
  if (user) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
  }
  return null
}

// Listen to auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      })
    } else {
      callback(null)
    }
  })
}

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Invalid email address'
    case 'auth/user-disabled':
      return 'This account has been disabled'
    case 'auth/user-not-found':
      return 'No account found with this email'
    case 'auth/wrong-password':
      return 'Incorrect password'
    case 'auth/email-already-in-use':
      return 'Email already in use'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters'
    case 'auth/popup-closed-by-user':
      return 'Sign in cancelled'
    case 'auth/cancelled-popup-request':
      return 'Sign in cancelled'
    default:
      return 'An error occurred. Please try again.'
  }
}

export default {
  signIn,
  signUp,
  signInWithGoogle,
  signOut,
  resetPassword,
  getCurrentUser,
  onAuthChange
}
