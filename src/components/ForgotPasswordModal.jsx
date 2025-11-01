import { useState } from 'react'
import { X, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { getJSON, setJSON } from '../utils/storage'
import './AuthModal.css'

const ForgotPasswordModal = ({ onClose, onSwitchToSignIn }) => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Check if email exists in storage (simulated user database)
      const users = getJSON('users', [])
      const userExists = users.some(user => user.email === email)

      if (userExists) {
        // In a real app, this would send a password reset email
        // For now, we'll store the reset request in storage
        const resetRequests = getJSON('passwordResetRequests', [])
        resetRequests.push({
          email,
          token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          timestamp: new Date().toISOString(),
          used: false
        })
        setJSON('passwordResetRequests', resetRequests)

        setIsSuccess(true)
        console.log(`Password reset email would be sent to: ${email}`)
      } else {
        // For security, we still show success even if email doesn't exist
        // This prevents email enumeration attacks
        setIsSuccess(true)
        console.log(`Password reset requested for: ${email} (user not found)`)
      }
    } catch (error) {
      setError('Failed to send password reset email. Please try again.')
      console.error('Password reset error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="modal-overlay">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="auth-success-state">
            <CheckCircle size={48} color="#10b981" />
            <h2 className="modal-title">Check Your Email</h2>
            <p className="modal-subtitle">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="auth-help-text">
              Please check your inbox and click the link to reset your password. 
              If you don't see the email, check your spam folder.
            </p>
            <div className="auth-success-actions">
              <button 
                type="button" 
                className="btn-auth-submit"
                onClick={() => {
                  setIsSuccess(false)
                  setEmail('')
                  onSwitchToSignIn()
                }}
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="auth-icon-wrapper">
          <Mail size={32} color="#6366f1" />
        </div>
        <h2 className="modal-title">Forgot Password</h2>
        <p className="modal-subtitle">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {error && (
          <div className="auth-error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reset-email">Email Address</label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="Enter your email address"
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-auth-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner-small"></div>
                <span>Sending...</span>
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>

          <p className="auth-switch">
            Remember your password?{' '}
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

export default ForgotPasswordModal

