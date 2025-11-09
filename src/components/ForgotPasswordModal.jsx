import { useState } from 'react'
import { X, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { resetPassword } from '../utils/firebaseAuth'
import { useTranslation } from 'react-i18next'
import './AuthModal.css'

const ForgotPasswordModal = ({ onClose, onSwitchToSignIn }) => {
  const { t } = useTranslation()
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
      const result = await resetPassword(email)

      if (result.success) {
        setIsSuccess(true)
      } else {
        // Always show success to prevent email enumeration
        setIsSuccess(true)
      }
    } catch (err) {
      // Always show success to prevent email enumeration
      setIsSuccess(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitOld = async (e) => {
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
      // OLD CODE - Using Resend
      const userExists = false // Simulated check

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
          const subject = 'Reset your password for Find Your Inner Peace'
          const message = `Hello,

Follow this link to reset your Find Your Inner Peace password for your ${email} account.

${resetLink}

This link will expire in 1 hour.

If you didn't ask to reset your password, you can ignore this email.

Thanks,

Your Find Your Inner Peace Team`
          
          const htmlMessage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f9fafb;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .email-header h1 {
      color: #ffffff;
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }
    .email-body {
      padding: 40px 30px;
    }
    .email-body p {
      margin: 0 0 16px 0;
      color: #4b5563;
      font-size: 15px;
    }
    .email-body p:first-child {
      color: #1f2937;
      font-size: 16px;
    }
    .email-info {
      background-color: #f3f4f6;
      border-left: 4px solid #6366f1;
      padding: 16px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .email-info p {
      margin: 0;
      color: #374151;
      font-size: 14px;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .reset-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      transition: transform 0.2s;
    }
    .reset-button:hover {
      transform: translateY(-2px);
    }
    .expiry-warning {
      background-color: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 8px;
      padding: 12px 16px;
      margin: 24px 0;
      text-align: center;
    }
    .expiry-warning p {
      margin: 0;
      color: #92400e;
      font-size: 14px;
      font-weight: 600;
    }
    .link-fallback {
      margin: 24px 0;
      padding: 16px;
      background-color: #f9fafb;
      border-radius: 6px;
    }
    .link-fallback p {
      margin: 0 0 8px 0;
      font-size: 13px;
      color: #6b7280;
    }
    .link-fallback a {
      color: #6366f1;
      word-break: break-all;
      font-size: 13px;
    }
    .email-footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .email-footer p {
      margin: 0 0 8px 0;
      color: #6b7280;
      font-size: 14px;
    }
    .app-name {
      color: #6366f1;
      font-weight: 600;
    }
    .security-note {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      font-size: 13px;
      color: #9ca3af;
    }
    @media only screen and (max-width: 600px) {
      .email-body { padding: 24px 20px; }
      .email-header { padding: 30px 20px; }
      .email-footer { padding: 24px 20px; }
      .reset-button { padding: 12px 24px; font-size: 15px; }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>🔐 Password Reset Request</h1>
    </div>
    
    <div class="email-body">
      <p>Hello,</p>
      
      <p>Follow this link to reset your <span class="app-name">Find Your Inner Peace</span> password for your <strong>${email}</strong> account.</p>
      
      <div class="button-container">
        <a href="${resetLink}" class="reset-button">Reset Password</a>
      </div>
      
      <div class="expiry-warning">
        <p>⏰ This link will expire in 1 hour</p>
      </div>
      
      <div class="email-info">
        <p><strong>Security Notice:</strong></p>
        <p>If you didn't ask to reset your password, you can safely ignore this email. Your password will not be changed.</p>
      </div>
      
      <div class="link-fallback">
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <a href="${resetLink}">${resetLink}</a>
      </div>
      
      <div class="security-note">
        <p>This is an automated message from Find Your Inner Peace. Please do not reply to this email.</p>
      </div>
    </div>
    
    <div class="email-footer">
      <p><strong class="app-name">Find Your Inner Peace</strong></p>
      <p>Your Personal Wellness Companion 🧘‍♀️</p>
      <p style="margin-top: 16px; font-size: 12px;">
        © ${new Date().getFullYear()} Find Your Inner Peace. All rights reserved.
      </p>
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
            <h2 className="modal-title">{t('auth.forgotPassword.success.title')}</h2>
            <p className="modal-subtitle">
              {t('auth.forgotPassword.success.message')} <strong>{email}</strong>
            </p>
            <p className="auth-help-text">
              {t('auth.forgotPassword.success.instructions')}
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
                {t('auth.forgotPassword.backToSignIn')}
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
        <h2 className="modal-title">{t('auth.forgotPassword.title')}</h2>
        <p className="modal-subtitle">
          {t('auth.forgotPassword.subtitle')}
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

