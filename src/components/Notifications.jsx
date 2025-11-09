import { useState } from 'react'
import { Bell, Check, X, Info, AlertCircle, CheckCircle, Clock, Mail, Send, Smartphone } from 'lucide-react'
import { sendNotificationEmail, getEmailPreferences, getUserEmail, isEmailJSConfigured } from '../utils/emailNotifications'
import { sendWellnessNotification, isResendConfigured } from '../utils/resendNotifications'
import NotificationSettings from './NotificationSettings/NotificationSettings'
import { useTranslation } from 'react-i18next'
import './Notifications.css'

const Notifications = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('list') // 'list', 'email', 'push'
  
  // Notification keys for translation
  const [notificationKeys] = useState([
    {
      id: 1,
      type: 'success',
      titleKey: 'goalAchieved',
      messageKey: 'waterGoal',
      timeKey: 'hoursAgo',
      timeCount: 2,
      read: false
    },
    {
      id: 2,
      type: 'info',
      titleKey: 'reminder',
      messageKey: 'eveningMeditation',
      timeKey: 'hoursAgo',
      timeCount: 5,
      read: false
    },
    {
      id: 3,
      type: 'warning',
      titleKey: 'lowActivity',
      messageKey: 'noActivity',
      timeKey: 'dayAgo',
      timeCount: 1,
      read: true
    },
    {
      id: 4,
      type: 'success',
      titleKey: 'moodInsights',
      messageKey: 'weeklyReport',
      timeKey: 'daysAgo',
      timeCount: 2,
      read: true
    }
  ])
  
  // Translate notifications
  const notifications = notificationKeys.map(notif => ({
    ...notif,
    title: t(`notifications.types.${notif.titleKey}`),
    message: t(`notifications.messages.${notif.messageKey}`),
    time: t(`notifications.time.${notif.timeKey}`, { count: notif.timeCount })
  }))

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return CheckCircle
      case 'warning':
        return AlertCircle
      case 'info':
      default:
        return Info
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return '#10b981'
      case 'warning':
        return '#f59e0b'
      case 'info':
      default:
        return 'var(--primary-color)'
    }
  }

  const [sendingEmails, setSendingEmails] = useState({})
  const emailPrefs = getEmailPreferences()
  const userEmail = getUserEmail() // Get user email from utility
  const emailjsConfigured = isEmailJSConfigured()
  const resendConfigured = isResendConfigured()

  const handleSendEmail = async (notification) => {
    const email = getUserEmail() // Always get fresh email
    
    if (!email || !email.includes('@')) {
      alert(t('notifications.alerts.setEmail'))
      return
    }

    setSendingEmails(prev => ({ ...prev, [notification.id]: true }))

    try {
      let result
      
      // Try Resend first (preferred), fallback to EmailJS
      if (resendConfigured) {
        result = await sendWellnessNotification(notification, email)
      } else if (emailjsConfigured) {
        result = await sendNotificationEmail(notification, email)
      } else {
        alert(t('notifications.alerts.noServiceConfigured'))
        setSendingEmails(prev => ({ ...prev, [notification.id]: false }))
        return
      }
      
      if (result.success) {
        const service = resendConfigured ? ' via Resend' : ' via EmailJS'
        alert(t('notifications.alerts.emailSentSuccess', { email, service }))
      } else {
        alert(`❌ Failed to send email: ${result.reason || result.error}`)
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`)
    } finally {
      setSendingEmails(prev => ({ ...prev, [notification.id]: false }))
    }
  }

  const handleSendAllEmails = async () => {
    const prefs = getEmailPreferences()
    const email = prefs.email || getUserEmail()
    
    if (!email || !email.includes('@')) {
      alert(t('notifications.alerts.setEmail'))
      return
    }

    if (!confirm(t('notifications.alerts.confirmSendAll', { email }))) {
      return
    }

    const unreadNotifications = notifications.filter(n => !n.read)
    let successCount = 0
    let failCount = 0
    
    for (const notification of unreadNotifications) {
      try {
        let result
        // Try Resend first, fallback to EmailJS
        if (resendConfigured) {
          result = await sendWellnessNotification(notification, email)
        } else if (emailjsConfigured) {
          result = await sendNotificationEmail(notification, email)
        } else {
          alert(t('notifications.alerts.noServiceConfigured'))
          return
        }
        
        if (result.success) {
          successCount++
        } else {
          failCount++
        }
        await new Promise(resolve => setTimeout(resolve, 500)) // Delay between emails
      } catch (error) {
        failCount++
        console.error('Error sending email:', error)
      }
    }

    const serviceName = resendConfigured ? 'Resend' : 'EmailJS'
    if (failCount === 0) {
      alert(t('notifications.alerts.emailSentCount', { count: successCount, email, service: serviceName }))
    } else {
      alert(t('notifications.alerts.emailSentPartial', { success: successCount, service: serviceName, fail: failCount }))
    }
  }

  return (
    <div className="notifications-page">
      <header className="page-header">
        <div>
          <h1><Bell size={32} /> {t('notifications.title')}</h1>
          <p>{t('notifications.subtitle')}</p>
          
          {/* Tab Navigation */}
          <div className="notification-tabs" style={{
            display: 'flex',
            gap: '12px',
            marginTop: '20px',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <button
              className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
              onClick={() => setActiveTab('list')}
              style={{
                padding: '12px 20px',
                background: activeTab === 'list' ? '#667eea' : 'transparent',
                color: activeTab === 'list' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <Bell size={18} />
              {t('notifications.tabs.list')}
            </button>
            <button
              className={`tab-button ${activeTab === 'email' ? 'active' : ''}`}
              onClick={() => setActiveTab('email')}
              style={{
                padding: '12px 20px',
                background: activeTab === 'email' ? '#667eea' : 'transparent',
                color: activeTab === 'email' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <Mail size={18} />
              {t('notifications.tabs.email')}
            </button>
            <button
              className={`tab-button ${activeTab === 'push' ? 'active' : ''}`}
              onClick={() => setActiveTab('push')}
              style={{
                padding: '12px 20px',
                background: activeTab === 'push' ? '#667eea' : 'transparent',
                color: activeTab === 'push' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <Smartphone size={18} />
              {t('notifications.tabs.push')}
            </button>
          </div>
        </div>
        {activeTab === 'list' && notifications.length > 0 && emailjsConfigured && (
          <button 
            className="send-all-emails-btn"
            onClick={handleSendAllEmails}
            title={`Send all notifications to ${userEmail || 'your email'}`}
          >
            <Send size={18} />
            <span>{t('notifications.sendAllEmail')}</span>
          </button>
        )}
      </header>

      {/* Push Notifications Tab */}
      {activeTab === 'push' && (
        <NotificationSettings />
      )}

      {/* Email Settings Tab */}
      {activeTab === 'email' && (
        <div style={{ padding: '20px', background: 'white', borderRadius: '12px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#1a1a1a' }}>
            <Mail size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {t('notifications.emailSettings.title')}
          </h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            {t('notifications.emailSettings.configureIn')} <a href="/profile" style={{ color: '#667eea', textDecoration: 'underline' }}>{t('notifications.emailSettings.profileLink')}</a> {t('notifications.emailSettings.section')}
          </p>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#333' }}>{t('notifications.emailSettings.serviceStatus')}</h3>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: emailjsConfigured || resendConfigured ? '#059669' : '#dc2626' }}>
              {emailjsConfigured || resendConfigured ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {resendConfigured ? t('notifications.emailSettings.resendConfigured') : emailjsConfigured ? t('notifications.emailSettings.emailjsConfigured') : t('notifications.emailSettings.notConfigured')}
            </p>
          </div>
        </div>
      )}

      {/* Notifications List Tab */}
      {activeTab === 'list' && (
        <>
          {!emailjsConfigured && !resendConfigured && (
            <div style={{ 
              marginBottom: '20px',
              padding: '16px', 
              background: '#fef3c7', 
              border: '1px solid #f59e0b', 
              borderRadius: '12px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <AlertCircle size={20} color="#f59e0b" />
              <span style={{ color: '#92400e' }}>
                {t('notifications.emailSettings.notConfiguredWarning')} <a href="/profile" style={{ color: '#d97706', textDecoration: 'underline' }}>{t('notifications.emailSettings.configureLink')}</a>
              </span>
            </div>
          )}
          <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <Bell size={48} />
            <p>{t('notifications.noNotifications')}</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type)
            const color = getNotificationColor(notification.type)
            return (
              <div
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              >
                <div className="notification-icon" style={{ color }}>
                  <Icon size={24} />
                </div>
                <div className="notification-content">
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">
                    <Clock size={14} />
                    {notification.time}
                  </span>
                </div>
                <div className="notification-actions">
                  <button
                    className="send-email-btn"
                    onClick={() => handleSendEmail(notification)}
                    disabled={sendingEmails[notification.id]}
                    title={`Send to ${userEmail || 'your email'}`}
                  >
                    {sendingEmails[notification.id] ? (
                      <div className="spinner-small"></div>
                    ) : (
                      <Mail size={18} />
                    )}
                  </button>
                  {!notification.read && (
                    <button className="mark-read-btn" title={t('notifications.markAsRead')}>
                      <Check size={18} />
                    </button>
                  )}
                  <button className="delete-btn" title={t('notifications.delete')}>
                    <X size={18} />
                  </button>
                </div>
              </div>
            )
          })
        )}
          </div>
        </>
      )}
    </div>
  )
}

export default Notifications

