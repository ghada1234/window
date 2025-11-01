import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { getJSON, setJSON } from '../utils/storage'
import safeStorage from '../utils/storage'
import './AuthModal.css'

const SignInModal = ({ onClose, onSuccess, onSwitchToSignUp, onSwitchToForgotPassword }) => {
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check user credentials in storage (simulated user database)
      const users = getJSON('users', [])
      const user = users.find(u => u.email === email && u.password === password)

      if (user) {
        // Store user session
        safeStorage.setItem('isLoggedIn', 'true')
        setJSON('currentUser', {
          id: user.id,
          name: user.name,
          email: user.email
        })
        onSuccess()
      } else {
        setError('Invalid email or password. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Sign in error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Sign In</h2>
        <p className="modal-subtitle">Welcome back! Please sign in to your account.</p>
        
        {error && (
          <div className="auth-error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="signin-email">Email</label>
            <input
              id="signin-email"
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
            <label htmlFor="signin-password">Password</label>
            <input
              id="signin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Enter your password"
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
                Forgot password?
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
                <span>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
          <p className="auth-switch">
            Don't have an account?{' '}
            <button 
              type="button" 
              className="auth-link" 
              onClick={onSwitchToSignUp}
              disabled={isLoading}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignInModal


