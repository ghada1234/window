import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { getJSON, setJSON } from '../utils/storage'
import './AuthModal.css'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState(true)

  useEffect(() => {
    // Verify token on load
    if (!token || !email) {
      setTokenValid(false)
      setError('Invalid or missing reset link')
      return
    }

    // Check if token exists and is valid
    const resetRequests = getJSON('passwordResetRequests', [])
    const request = resetRequests.find(r => 
      r.token === token && 
      r.email === email && 
      !r.used
    )

    if (!request) {
      setTokenValid(false)
      setError('This reset link is invalid or has already been used')
      return
    }

    // Check if token is expired (valid for 1 hour)
    const tokenAge = Date.now() - new Date(request.timestamp).getTime()
    const oneHour = 60 * 60 * 1000
    
    if (tokenAge > oneHour) {
      setTokenValid(false)
      setError('This reset link has expired. Please request a new one.')
    }
  }, [token, email])

  const validatePassword = (pwd) => {
    return pwd.length >= 8 && /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!password || !confirmPassword) {
      setError('Please fill in all fields')
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
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Get users and update password
      const users = getJSON('users', [])
      const userIndex = users.findIndex(u => u.email === email)

      if (userIndex === -1) {
        setError('User not found')
        setIsLoading(false)
        return
      }

      // Update password
      users[userIndex].password = password
      users[userIndex].passwordUpdatedAt = new Date().toISOString()
      setJSON('users', users)

      // Mark token as used
      const resetRequests = getJSON('passwordResetRequests', [])
      const updatedRequests = resetRequests.map(r => 
        r.token === token ? { ...r, used: true } : r
      )
      setJSON('passwordResetRequests', updatedRequests)

      setIsSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/landing')
      }, 3000)

    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Password reset error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!tokenValid) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="auth-error-state">
            <AlertCircle size={64} color="#ef4444" />
            <h2>Invalid Reset Link</h2>
            <p>{error}</p>
            <button 
              className="btn-auth-submit"
              onClick={() => navigate('/landing')}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="auth-success-state">
            <CheckCircle size={64} color="#10b981" />
            <h2>Password Reset Successful!</h2>
            <p>Your password has been updated successfully.</p>
            <p className="auth-help-text">
              Redirecting to sign in page in 3 seconds...
            </p>
            <button 
              className="btn-auth-submit"
              onClick={() => navigate('/landing')}
            >
              Sign In Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="auth-icon-wrapper">
          <Lock size={48} color="#6366f1" />
        </div>
        
        <h2 className="modal-title">Reset Your Password</h2>
        <p className="modal-subtitle">
          Enter your new password for <strong>{email}</strong>
        </p>

        {error && (
          <div className="auth-error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="Enter new password (min. 8 chars, letters & numbers)"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
              </button>
            </div>
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
            <label htmlFor="confirm-password">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setError('')
                }}
                placeholder="Confirm your new password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showConfirmPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
              </button>
            </div>
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
                <span>Resetting Password...</span>
              </>
            ) : (
              'Reset Password'
            )}
          </button>

          <p className="auth-switch">
            Remember your password?{' '}
            <button 
              type="button" 
              className="auth-link" 
              onClick={() => navigate('/landing')}
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

export default ResetPassword

