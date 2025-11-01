import { useState } from 'react'
import { Bell, Check, X, Info, AlertCircle, CheckCircle, Clock, Mail, Send } from 'lucide-react'
import { sendNotificationEmail, getEmailPreferences, getUserEmail, isEmailJSConfigured } from '../utils/emailNotifications'
import { sendWellnessNotification, isResendConfigured } from '../utils/resendNotifications'
import './Notifications.css'

const Notifications = () => {
  const [notifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Goal Achieved!',
      message: 'You completed your daily water intake goal',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Reminder',
      message: 'Time for your evening meditation session',
      time: '5 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Low Activity',
      message: 'You haven\'t logged any activity today',
      time: '1 day ago',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Mood Insights',
      message: 'Your weekly mood report is ready',
      time: '2 days ago',
      read: true
    }
  ])

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
      alert('Please set your email address in Profile > Email Preferences')
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
        alert('No email service configured. Please set up Resend or EmailJS in your .env file.')
        setSendingEmails(prev => ({ ...prev, [notification.id]: false }))
        return
      }
      
      if (result.success) {
        alert(`✅ Email sent successfully to ${email}${resendConfigured ? ' via Resend' : ' via EmailJS'}`)
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
      alert('Please set your email address in Profile > Email Preferences')
      return
    }

    if (!confirm(`Send all notifications to ${email}?`)) {
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
          alert('No email service configured. Please set up Resend in your .env file.')
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
      alert(`✅ Successfully sent ${successCount} email(s) to ${email} via ${serviceName}!`)
    } else {
      alert(`Sent ${successCount} email(s) successfully via ${serviceName}. ${failCount} failed.`)
    }
  }

  return (
    <div className="notifications-page">
      <header className="page-header">
        <div>
          <h1><Bell size={32} /> Notifications</h1>
          <p>Stay updated with your wellness journey</p>
          {!emailjsConfigured && (
            <div style={{ 
              marginTop: '10px', 
              padding: '10px', 
              background: '#fef3c7', 
              border: '1px solid #f59e0b', 
              borderRadius: '6px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} color="#f59e0b" />
              <span style={{ color: '#92400e' }}>
                EmailJS not configured. <a href="/profile" style={{ color: '#d97706', textDecoration: 'underline' }}>Configure in Profile → Email Preferences</a>
              </span>
            </div>
          )}
        </div>
        {notifications.length > 0 && emailjsConfigured && (
          <button 
            className="send-all-emails-btn"
            onClick={handleSendAllEmails}
            title={`Send all notifications to ${userEmail || 'your email'}`}
          >
            <Send size={18} />
            <span>Send All via Email</span>
          </button>
        )}
      </header>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <Bell size={48} />
            <p>No notifications</p>
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
                    <button className="mark-read-btn" title="Mark as read">
                      <Check size={18} />
                    </button>
                  )}
                  <button className="delete-btn" title="Delete">
                    <X size={18} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Notifications

