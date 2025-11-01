import { useState } from 'react'
import { X, AlertCircle, CheckCircle } from 'lucide-react'
import { getJSON, setJSON } from '../utils/storage'
import safeStorage from '../utils/storage'
import './AuthModal.css'

const SignUpModal = ({ onClose, onSuccess, onSwitchToSignIn }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validatePassword = (pwd) => {
    // At least 8 characters, one letter and one number
    return pwd.length >= 8 && /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd)
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
      setError('Password must be at least 8 characters long and contain both letters and numbers')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check if user already exists
      const users = getJSON('users', [])
      const userExists = users.some(u => u.email === email)

      if (userExists) {
        setError('An account with this email already exists')
        setIsLoading(false)
        return
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString()
      }

      users.push(newUser)
      setJSON('users', users)

      // Auto sign in after sign up
      safeStorage.setItem('isLoggedIn', 'true')
      setJSON('currentUser', {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      })

      // Send welcome email (async, don't wait)
      try {
        const { sendWelcomeEmail } = await import('../utils/resendNotifications')
        sendWelcomeEmail(newUser.email, newUser.name).catch(err => {
          console.log('Welcome email failed (non-critical):', err)
        })
      } catch (e) {
        // Resend not configured, skip
      }

      onSuccess()
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Sign up error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Sign Up</h2>
        <p className="modal-subtitle">Create your account to start your wellness journey.</p>
        
        {error && (
          <div className="auth-error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="Enter your full name"
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Create a password (min. 8 chars, letters & numbers)"
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
                    Password must be at least 8 characters with letters and numbers
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="signup-confirm">Confirm Password</label>
            <input
              id="signup-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setError('')
              }}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
            />
            {confirmPassword && password === confirmPassword && (
              <div className="password-hint">
                <span className="password-valid">
                  <CheckCircle size={14} />
                  Passwords match
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
                <span>Creating account...</span>
              </>
            ) : (
              'Sign Up'
            )}
          </button>
          <p className="auth-switch">
            Already have an account?{' '}
            <button 
              type="button" 
              className="auth-link" 
              onClick={onSwitchToSignIn}
              disabled={isLoading}
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignUpModal


