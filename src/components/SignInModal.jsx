import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { signIn, signInWithGoogle } from '../utils/firebaseAuth'
import { trackUserActivity } from '../utils/userStats'
import { useTranslation } from 'react-i18next'
import './AuthModal.css'

const SignInModal = ({ onClose, onSuccess, onSwitchToSignUp, onSwitchToForgotPassword }) => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn(email, password)

      if (result.success) {
        console.log('✅ Signed in as:', result.user.email)
        // Track user sign-in
        trackUserActivity(result.user.uid, 'sign_in')
        onSuccess()
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Sign in error:', err)
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
        console.log('✅ Signed in with Google:', result.user.email)
        // Track Google sign-in
        trackUserActivity(result.user.uid, 'google_sign_in')
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
        <h2 className="modal-title">{t('auth.signIn.title')}</h2>
        <p className="modal-subtitle">{t('auth.signIn.subtitle')}</p>
        
        {error && (
          <div className="auth-error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="signin-email">{t('auth.signIn.email')}</label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder={t('auth.signIn.emailPlaceholder')}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="signin-password">{t('auth.signIn.password')}</label>
            <input
              id="signin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder={t('auth.signIn.passwordPlaceholder')}
              required
              disabled={isLoading}
            />
            {onSwitchToForgotPassword && (
              <button
                type="button"
                className="forgot-password-link"
                onClick={onSwitchToForgotPassword}
                disabled={isLoading}
              >
                {t('auth.signIn.forgotPassword')}
              </button>
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
                <span>{t('auth.signIn.signing')}</span>
              </>
            ) : (
              t('auth.signIn.button')
            )}
          </button>

          <div className="auth-divider">
            <span>{t('auth.signIn.or')}</span>
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
            {t('auth.signIn.continueWithGoogle')}
          </button>

          <p className="auth-switch">
            {t('auth.signIn.noAccount')}{' '}
            <button 
              type="button" 
              className="auth-link" 
              onClick={onSwitchToSignUp}
              disabled={isLoading}
            >
              {t('auth.signIn.signUpLink')}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignInModal
