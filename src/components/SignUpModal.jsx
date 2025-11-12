import { useState } from 'react'
import { X, AlertCircle, CheckCircle } from 'lucide-react'
import { signUp, signInWithGoogle } from '../utils/firebaseAuth'
import { trackSignUp, trackUserActivity } from '../utils/userStats'
// import { initializeTrial } from '../utils/subscription' // REMOVED - No trial needed
import { useTranslation } from 'react-i18next'
import './AuthModal.css'

const SignUpModal = ({ onClose, onSuccess, onSwitchToSignIn }) => {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validatePassword = (pwd) => {
    // At least 6 characters (Firebase requirement)
    return pwd.length >= 6
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const result = await signUp(email, password, name.trim())

      if (result.success) {
        console.log('✅ Account created:', result.user.email)
        // Track new user sign-up
        trackSignUp(result.user.uid, result.user.email, 'email')
        trackUserActivity(result.user.uid, 'sign_up')
        // No trial needed - all features are free!
        console.log('✅ All features unlocked (free app)')
        // Show welcome message or send welcome email
        onSuccess()
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Sign up error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signInWithGoogle()

      if (result.success) {
        console.log('✅ Signed up with Google:', result.user.email)
        // Track Google sign-up
        trackSignUp(result.user.uid, result.user.email, 'google')
        trackUserActivity(result.user.uid, 'google_sign_up')
        // No trial needed - all features are free!
        console.log('✅ All features unlocked (free app)')
        onSuccess()
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Google sign-in failed. Please try again.')
      console.error('Google sign-in error:', err)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{t('auth.signUp.title')}</h2>
        <p className="modal-subtitle">{t('auth.signUp.subtitle')}</p>
        
        {/* Free Forever Banner - All Features Free */}
        <div className="trial-banner" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
          <div className="trial-badge">
            <span className="trial-icon">🎁</span>
            <span className="trial-text">100% Free</span>
          </div>
          <p className="trial-description">
            All features are completely free. No credit card, no subscription, just wellness!
          </p>
        </div>
        
        {error && (
          <div className="auth-error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="signup-name">{t('auth.signUp.name')}</label>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder={t('auth.signUp.namePlaceholder')}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-email">{t('auth.signUp.email')}</label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder={t('auth.signUp.emailPlaceholder')}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">{t('auth.signUp.password')}</label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder={t('auth.signUp.passwordPlaceholder')}
              required
              disabled={isLoading}
            />
            {password && (
              <div className="password-hint">
                {validatePassword(password) ? (
                  <span className="password-valid">
                    <CheckCircle size={14} />
                    Password strength: Good
                  </span>
                ) : (
                  <span className="password-weak">
                    Password must be at least 6 characters
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="signup-confirm">{t('auth.signUp.confirmPassword')}</label>
            <input
              id="signup-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setError('')
              }}
              placeholder={t('auth.signUp.confirmPasswordPlaceholder')}
              required
              disabled={isLoading}
            />
            {confirmPassword && password === confirmPassword && (
              <div className="password-hint">
                <span className="password-valid">
                  <CheckCircle size={14} />
                  {t('auth.signUp.passwordMatch')}
                </span>
              </div>
            )}
          </div>
          <button 
            type="submit" 
            className="btn-auth-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner-small"></div>
                <span>{t('auth.signUp.creating')}</span>
              </>
            ) : (
              t('auth.signUp.button')
            )}
          </button>

          <div className="auth-divider">
            <span>{t('auth.signUp.or')}</span>
          </div>

          <button
            type="button"
            className="btn-google-signin"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
              <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
            </svg>
            {t('auth.signUp.continueWithGoogle')}
          </button>

          <p className="auth-switch">
            {t('auth.signUp.haveAccount')}{' '}
            <button 
              type="button" 
              className="auth-link" 
              onClick={onSwitchToSignIn}
              disabled={isLoading}
            >
              {t('auth.signUp.signInLink')}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignUpModal


