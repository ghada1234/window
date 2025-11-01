import { useState, useEffect } from 'react'
import { User, Mail, Calendar, Target, Award, Settings, LogOut, Bell, CheckCircle, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getEmailPreferences, saveEmailPreferences, isEmailJSConfigured } from '../utils/emailNotifications'
import { isResendConfigured } from '../utils/resendNotifications'
import safeStorage from '../utils/storage'
import './Profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const [user] = useState({
    name: 'John Doe',
    email: 'ghadaabdulaziz1@gmail.com',
    memberSince: '2024-01-15',
    goalsCompleted: 12,
    currentStreak: 7,
    achievements: ['First Week Complete', 'Meditation Master', 'Nutrition Expert']
  })

  const [emailPrefs, setEmailPrefs] = useState(getEmailPreferences())
  const [showEmailSettings, setShowEmailSettings] = useState(false)

  useEffect(() => {
    // Update email in preferences if user email exists
    if (user.email && !emailPrefs.email) {
      const updated = { ...emailPrefs, email: user.email }
      setEmailPrefs(updated)
      saveEmailPreferences(updated)
    }
  }, [user.email])

  const handleEmailPreferenceChange = (key, value) => {
    const updated = { ...emailPrefs, [key]: value }
    setEmailPrefs(updated)
    saveEmailPreferences(updated)
  }

  const handleNotificationTypeChange = (type, enabled) => {
    const updated = {
      ...emailPrefs,
      types: {
        ...emailPrefs.types,
        [type]: enabled
      }
    }
    setEmailPrefs(updated)
    saveEmailPreferences(updated)
  }

  const handleEmailChange = (email) => {
    const updated = { ...emailPrefs, email }
    setEmailPrefs(updated)
    saveEmailPreferences(updated)
  }

  const handleLogout = () => {
    safeStorage.removeItem('isLoggedIn')
    navigate('/landing')
  }

  return (
    <div className="profile-page">
      <header className="page-header">
        <h1>Profile</h1>
        <p>Manage your account settings and view your wellness journey</p>
      </header>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <div className="profile-stats">
            <div className="stat-item">
              <Calendar size={20} />
              <span>Member since {new Date(user.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="stat-item">
              <Target size={20} />
              <span>{user.goalsCompleted} Goals Completed</span>
            </div>
            <div className="stat-item">
              <Award size={20} />
              <span>{user.currentStreak} Day Streak</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Settings</h3>
          <div className="settings-list">
            <button 
              className="settings-item"
              onClick={() => navigate('/profile/personal-info')}
            >
              <User size={20} />
              <span>Personal Information</span>
            </button>
            <button className="settings-item">
              <Settings size={20} />
              <span>Account Settings</span>
            </button>
            <button 
              className="settings-item"
              onClick={() => setShowEmailSettings(!showEmailSettings)}
            >
              <Mail size={20} />
              <span>Email Preferences</span>
              {showEmailSettings ? ' ▼' : ' ▶'}
            </button>
            <button className="settings-item">
              <Target size={20} />
              <span>Goals & Preferences</span>
            </button>
          </div>

          {/* Email Notification Settings */}
          {showEmailSettings && (
            <div className="email-settings-card">
              <h4>Email Notification Settings</h4>
              
              {/* Email Service Configuration Status */}
              {isResendConfigured() ? (
                <div style={{ 
                  background: '#d1fae5', 
                  border: '1px solid #10b981', 
                  borderRadius: '8px', 
                  padding: '15px', 
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <CheckCircle size={24} color="#10b981" />
                  <div>
                    <strong style={{ color: '#065f46', fontSize: '15px' }}>✅ Resend Email Service Active</strong>
                    <p style={{ color: '#047857', fontSize: '13px', margin: '5px 0 0 0' }}>
                      Professional email delivery powered by Resend
                    </p>
                  </div>
                </div>
              ) : isEmailJSConfigured() ? (
                <div style={{ 
                  background: '#dbeafe', 
                  border: '1px solid #3b82f6', 
                  borderRadius: '8px', 
                  padding: '15px', 
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <CheckCircle size={24} color="#3b82f6" />
                  <div>
                    <strong style={{ color: '#1e40af', fontSize: '15px' }}>EmailJS Configured</strong>
                    <p style={{ color: '#1e3a8a', fontSize: '13px', margin: '5px 0 0 0' }}>
                      Email delivery via EmailJS
                    </p>
                  </div>
                </div>
              ) : (
                <div className="emailjs-warning" style={{ 
                  background: '#fef3c7', 
                  border: '1px solid #f59e0b', 
                  borderRadius: '8px', 
                  padding: '15px', 
                  marginBottom: '20px' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <AlertCircle size={20} color="#f59e0b" />
                    <strong style={{ color: '#92400e' }}>No Email Service Configured</strong>
                  </div>
                  <p style={{ color: '#78350f', fontSize: '14px', marginBottom: '15px' }}>
                    To send real emails, configure Resend (recommended) or EmailJS:
                  </p>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#92400e', fontSize: '14px' }}>Option 1: Resend (Recommended)</strong>
                    <ol style={{ color: '#78350f', fontSize: '13px', marginLeft: '20px', lineHeight: '1.8', marginTop: '8px' }}>
                      <li>Sign up at <a href="https://resend.com" target="_blank" rel="noopener noreferrer" style={{ color: '#d97706' }}>resend.com</a></li>
                      <li>Get your API key</li>
                      <li>Add to .env:
                        <code style={{ display: 'block', background: '#fff', padding: '8px', marginTop: '5px', borderRadius: '4px', fontSize: '12px' }}>
                          VITE_RESEND_API_KEY=your_api_key
                        </code>
                      </li>
                    </ol>
                  </div>

                  <div>
                    <strong style={{ color: '#92400e', fontSize: '14px' }}>Option 2: EmailJS</strong>
                    <ol style={{ color: '#78350f', fontSize: '13px', marginLeft: '20px', lineHeight: '1.8', marginTop: '8px' }}>
                      <li>Sign up at <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#d97706' }}>emailjs.com</a></li>
                      <li>Create a service and template</li>
                      <li>Add to .env:
                        <code style={{ display: 'block', background: '#fff', padding: '8px', marginTop: '5px', borderRadius: '4px', fontSize: '12px' }}>
                          VITE_EMAILJS_SERVICE_ID=your_service_id<br/>
                          VITE_EMAILJS_TEMPLATE_ID=your_template_id<br/>
                          VITE_EMAILJS_PUBLIC_KEY=your_public_key
                        </code>
                      </li>
                    </ol>
                  </div>
                </div>
              )}
              
              <div className="email-setting-item">
                <label className="email-toggle">
                  <input
                    type="checkbox"
                    checked={emailPrefs.enabled}
                    onChange={(e) => handleEmailPreferenceChange('enabled', e.target.checked)}
                  />
                  <span>Enable Email Notifications</span>
                </label>
              </div>

              <div className="email-setting-item">
                <label>Email Address</label>
                <input
                  type="email"
                  value={emailPrefs.email || user.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="your@email.com"
                  className="email-input"
                />
              </div>

              <div className="email-setting-item">
                <label>Notification Frequency</label>
                <select
                  value={emailPrefs.frequency}
                  onChange={(e) => handleEmailPreferenceChange('frequency', e.target.value)}
                  className="email-select"
                >
                  <option value="immediate">Immediate</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Summary</option>
                </select>
              </div>

              <div className="email-types-section">
                <label>Notification Types</label>
                <div className="email-types-grid">
                  <label className="email-type-toggle">
                    <input
                      type="checkbox"
                      checked={emailPrefs.types.goal}
                      onChange={(e) => handleNotificationTypeChange('goal', e.target.checked)}
                    />
                    <span>Goal Achievements</span>
                  </label>
                  <label className="email-type-toggle">
                    <input
                      type="checkbox"
                      checked={emailPrefs.types.reminder}
                      onChange={(e) => handleNotificationTypeChange('reminder', e.target.checked)}
                    />
                    <span>Reminders</span>
                  </label>
                  <label className="email-type-toggle">
                    <input
                      type="checkbox"
                      checked={emailPrefs.types.achievement}
                      onChange={(e) => handleNotificationTypeChange('achievement', e.target.checked)}
                    />
                    <span>Achievements</span>
                  </label>
                  <label className="email-type-toggle">
                    <input
                      type="checkbox"
                      checked={emailPrefs.types.report}
                      onChange={(e) => handleNotificationTypeChange('report', e.target.checked)}
                    />
                    <span>Reports</span>
                  </label>
                  <label className="email-type-toggle">
                    <input
                      type="checkbox"
                      checked={emailPrefs.types.insight}
                      onChange={(e) => handleNotificationTypeChange('insight', e.target.checked)}
                    />
                    <span>Insights</span>
                  </label>
                  <label className="email-type-toggle">
                    <input
                      type="checkbox"
                      checked={emailPrefs.types.warning}
                      onChange={(e) => handleNotificationTypeChange('warning', e.target.checked)}
                    />
                    <span>Warnings</span>
                  </label>
                </div>
              </div>

              <div className="email-test-section">
                <button
                  className="test-email-btn"
                  onClick={async () => {
                    const targetEmail = emailPrefs.email || user.email
                    
                    if (!targetEmail || !targetEmail.includes('@')) {
                      alert('Please set your email address above')
                      return
                    }
                    
                    // Try Resend first, fallback to EmailJS
                    if (isResendConfigured()) {
                      const { sendWellnessNotification } = await import('../utils/resendNotifications')
                      const result = await sendWellnessNotification(
                        {
                          title: 'Test Email',
                          message: 'This is a test email notification from Find Your Inner Peace. If you received this, your email notifications are working perfectly!',
                          type: 'info',
                          time: 'Just now'
                        },
                        targetEmail
                      )
                      if (result.success) {
                        alert(`✅ Test email sent successfully to ${targetEmail} via Resend!`)
                      } else {
                        alert(`❌ Failed to send: ${result.error || 'Unknown error'}`)
                      }
                    } else if (isEmailJSConfigured()) {
                      const { sendNotificationEmail } = await import('../utils/emailNotifications')
                      const result = await sendNotificationEmail(
                        {
                          title: 'Test Email',
                          message: 'This is a test email notification from Find Your Inner Peace.',
                          type: 'info',
                          time: 'Just now'
                        },
                        targetEmail
                      )
                      if (result.success) {
                        alert(`✅ Test email sent successfully to ${targetEmail} via EmailJS!`)
                      } else {
                        alert(`❌ Failed to send: ${result.reason || result.error}`)
                      }
                    } else {
                      alert('❌ No email service configured. Please set up Resend API key in your .env file.')
                    }
                  }}
                >
                  <Mail size={18} />
                  <span>Send Test Email</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="profile-section">
          <h3>Achievements</h3>
          <div className="achievements-list">
            {user.achievements.map((achievement, index) => (
              <div key={index} className="achievement-badge">
                <Award size={20} />
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-actions">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile

