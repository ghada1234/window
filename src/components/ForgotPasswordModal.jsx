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
        // Generate reset token
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        const resetRequests = getJSON('passwordResetRequests', [])
        
        resetRequests.push({
          email,
          token,
          timestamp: new Date().toISOString(),
          used: false
        })
        setJSON('passwordResetRequests', resetRequests)

        // Generate reset link
        const resetLink = `${window.location.origin}/reset-password?token=${token}&email=${encodeURIComponent(email)}`
        
        // Send email with reset link (using Resend)
        try {
          const { sendResendEmail } = await import('../utils/resendNotifications')
          const subject = '🔐 Reset Your Password - Find Your Inner Peace'
          const message = `Hi,\n\nWe received a request to reset your password.\n\nClick the link below to reset your password:\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, you can safely ignore this email.\n\nBest regards,\nFind Your Inner Peace Team`
          
          const htmlMessage = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f4f4f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: 600; margin: 20px 0; }
    .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
    .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; color: #78350f; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Reset Your Password</h1>
    </div>
    <div class="content">
      <p>Hi,</p>
      <p>We received a request to reset your password for Find Your Inner Peace.</p>
      <p style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </p>
      <div class="warning">
        <p style="margin: 0;"><strong>⏰ This link expires in 1 hour</strong></p>
      </div>
      <p style="color: #6b7280; font-size: 14px;">
        If you didn't request this password reset, you can safely ignore this email. Your password will not be changed.
      </p>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
        If the button doesn't work, copy and paste this link:<br>
        <a href="${resetLink}" style="color: #6366f1; word-break: break-all;">${resetLink}</a>
      </p>
    </div>
    <div class="footer">
      <p><strong>Find Your Inner Peace</strong></p>
      <p>Your Personal Wellness Companion</p>
    </div>
  </div>
</body>
</html>
          `
          
          await sendResendEmail(email, subject, message, htmlMessage)
          console.log(`✅ Password reset email sent to: ${email}`)
        } catch (emailError) {
          console.log(`Password reset link generated but email failed: ${emailError.message}`)
          console.log(`Reset link: ${resetLink}`)
        }

        setIsSuccess(true)
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

