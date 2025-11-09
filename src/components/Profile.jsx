import { useState, useEffect, useRef } from 'react'
import { User, Mail, Calendar, Target, Award, Settings, LogOut, Bell, CheckCircle, AlertCircle, Camera, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getEmailPreferences, saveEmailPreferences, isEmailJSConfigured } from '../utils/emailNotifications'
import { isResendConfigured } from '../utils/resendNotifications'
import { signOut as logout, getCurrentUser } from '../utils/firebaseAuth'
import { getJSON, setJSON } from '../utils/storage'
import './Profile.css'

const Profile = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  
  // Achievement mapping for translation
  const achievementMap = {
    'First Week Complete': 'firstWeek',
    'Meditation Master': 'meditationMaster',
    'Nutrition Expert': 'nutritionExpert'
  }
  
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
  const [profileImage, setProfileImage] = useState(null)
  const [showImageOptions, setShowImageOptions] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    // Load profile image from localStorage
    const savedImage = getJSON('profileImage', null)
    setProfileImage(savedImage)
    
    // Close image options when clicking outside
    const handleClickOutside = (event) => {
      if (showImageOptions && !event.target.closest('.profile-avatar-container')) {
        setShowImageOptions(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showImageOptions])

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(t('profile.invalidImageType'))
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t('profile.imageTooLarge'))
        return
      }

      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Image = reader.result
        setProfileImage(base64Image)
        setJSON('profileImage', base64Image)
        setShowImageOptions(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    setJSON('profileImage', null)
    setShowImageOptions(false)
  }

  const handleChangeImage = () => {
    fileInputRef.current?.click()
    setShowImageOptions(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      console.log('✅ Logged out successfully')
      navigate('/landing')
    } catch (error) {
      console.error('Logout error:', error)
      // Still navigate to landing even if logout fails
    navigate('/landing')
    }
  }

  return (
    <div className="profile-page">
      <header className="page-header">
        <h1>{t('profile.title')}</h1>
        <p>{t('profile.subtitle')}</p>
      </header>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-container">
            <div className="profile-avatar" onClick={() => setShowImageOptions(true)}>
              {profileImage ? (
                <img src={profileImage} alt={t('profile.profilePicture')} className="profile-image" />
              ) : (
            <User size={48} />
              )}
              <div className="avatar-overlay">
                <Camera size={24} />
              </div>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            
            {showImageOptions && (
              <div className="image-options-menu">
                <button className="option-btn" onClick={handleChangeImage}>
                  <Camera size={16} />
                  {profileImage ? t('profile.changePhoto') : t('profile.uploadPhoto')}
                </button>
                {profileImage && (
                  <button className="option-btn remove" onClick={handleRemoveImage}>
                    <X size={16} />
                    {t('profile.removePhoto')}
                  </button>
                )}
                <button className="option-btn cancel" onClick={() => setShowImageOptions(false)}>
                  {t('common.cancel')}
                </button>
              </div>
            )}
          </div>
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <div className="profile-stats">
            <div className="stat-item">
              <Calendar size={20} />
              <span>{t('profile.memberSince')} {new Date(user.memberSince).toLocaleDateString(i18n.language === 'ar' ? 'ar-AE' : 'en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="stat-item">
              <Target size={20} />
              <span>{user.goalsCompleted} {t('profile.goalsCompleted')}</span>
            </div>
            <div className="stat-item">
              <Award size={20} />
              <span>{user.currentStreak} {t('profile.currentStreak')}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>{t('profile.settings')}</h3>
          <div className="settings-list">
            <button 
              className="settings-item"
              onClick={() => navigate('/profile/personal-info')}
            >
              <User size={20} />
              <span>{t('profile.personalInformation')}</span>
            </button>
            <button className="settings-item">
              <Settings size={20} />
              <span>{t('profile.accountSettings')}</span>
            </button>
            <button 
              className="settings-item"
              onClick={() => setShowEmailSettings(!showEmailSettings)}
            >
              <Mail size={20} />
              <span>{t('profile.emailPreferences')}</span>
              {showEmailSettings ? ' ▼' : ' ▶'}
            </button>
            <button className="settings-item">
              <Target size={20} />
              <span>{t('profile.goalsPreferences')}</span>
            </button>
          </div>

          {/* Email Notification Settings */}
          {showEmailSettings && (
            <div className="email-settings-card">
              <h4>{t('profile.emailSettings.title')}</h4>
              
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
                    <strong style={{ color: '#065f46', fontSize: '15px' }}>{t('profile.emailSettings.resendActive')}</strong>
                    <p style={{ color: '#047857', fontSize: '13px', margin: '5px 0 0 0' }}>
                      {t('profile.emailSettings.resendDesc')}
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
                    <strong style={{ color: '#1e40af', fontSize: '15px' }}>{t('profile.emailSettings.emailjsConfigured')}</strong>
                    <p style={{ color: '#1e3a8a', fontSize: '13px', margin: '5px 0 0 0' }}>
                      {t('profile.emailSettings.emailjsDesc')}
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
                    <strong style={{ color: '#92400e' }}>{t('profile.emailSettings.noServiceConfigured')}</strong>
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
                    <span>{t('profile.emailSettings.enableEmailNotifications')}</span>
                </label>
              </div>

              <div className="email-setting-item">
                <label>{t('profile.emailSettings.emailAddress')}</label>
                <input
                  type="email"
                  value={emailPrefs.email || user.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder={t('profile.emailSettings.emailPlaceholder')}
                  className="email-input"
                />
              </div>

              <div className="email-setting-item">
                <label>{t('profile.emailSettings.notificationFrequency')}</label>
                <select
                  value={emailPrefs.frequency}
                  onChange={(e) => handleEmailPreferenceChange('frequency', e.target.value)}
                  className="email-select"
                >
                  <option value="immediate">{t('profile.emailSettings.frequencies.immediate')}</option>
                  <option value="daily">{t('profile.emailSettings.frequencies.daily')}</option>
                  <option value="weekly">{t('profile.emailSettings.frequencies.weekly')}</option>
                </select>
              </div>

              <div className="email-types-section">
                <label>{t('profile.emailSettings.notificationTypes')}</label>
                <div className="email-types-grid">
                  <label className="email-type-toggle">
                    <input
                      type="checkbox"
                      checked={emailPrefs.types.goal}
                      onChange={(e) => handleNotificationTypeChange('goal', e.target.checked)}
                    />
                    <span>{t('profile.emailSettings.types.goalAchievements')}</span>
                  </label>
                  <label className="email-type-toggle">
                    <input
                      type="checkbox"
                      checked={emailPrefs.types.reminder}
                      onChange={(e) => handleNotificationTypeChange('reminder', e.target.checked)}
                    />
                    <span>{t('profile.emailSettings.types.reminders')}</span>
                  </label>
                  <label className="email-type-toggle">
                    <input
                      type="checkbox"
                      checked={emailPrefs.types.achievement}
                      onChange={(e) => handleNotificationTypeChange('achievement', e.target.checked)}
                    />
                    <span>{t('profile.emailSettings.types.achievements')}</span>
                  </label>
                  <label className="email-type-toggle">
                    <input
                      type="checkbox"
                      checked={emailPrefs.types.report}
                      onChange={(e) => handleNotificationTypeChange('report', e.target.checked)}
                    />
                    <span>{t('profile.emailSettings.types.reports')}</span>
                  </label>
                  <label className="email-type-toggle">
                    <input
                      type="checkbox"
                      checked={emailPrefs.types.insight}
                      onChange={(e) => handleNotificationTypeChange('insight', e.target.checked)}
                    />
                    <span>{t('profile.emailSettings.types.insights')}</span>
                  </label>
                  <label className="email-type-toggle">
                    <input
                      type="checkbox"
                      checked={emailPrefs.types.warning}
                      onChange={(e) => handleNotificationTypeChange('warning', e.target.checked)}
                    />
                    <span>{t('profile.emailSettings.types.warnings')}</span>
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
          <h3>{t('profile.achievements')}</h3>
          <div className="achievements-list">
            {user.achievements.map((achievement, index) => {
              // Translate achievements using mapping
              const achievementKey = achievementMap[achievement]
              const translatedAchievement = achievementKey 
                ? t(`profile.achievementsList.${achievementKey}`)
                : achievement
              return (
              <div key={index} className="achievement-badge">
                <Award size={20} />
                  <span>{translatedAchievement}</span>
              </div>
              )
            })}
          </div>
        </div>

        <div className="profile-actions">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>{t('profile.logout')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile

