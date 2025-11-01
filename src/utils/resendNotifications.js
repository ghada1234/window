// Resend Email Notification Service
// Resend is a modern email API for developers
// Docs: https://resend.com/docs

import { getJSON } from './storage'

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || ''
const FROM_EMAIL = import.meta.env.VITE_RESEND_FROM_EMAIL || 'onboarding@resend.dev'

// Check if Resend is configured
export const isResendConfigured = () => {
  return !!RESEND_API_KEY
}

/**
 * Send email notification using Resend (via backend)
 * @param {string} toEmail - Recipient email
 * @param {string} subject - Email subject
 * @param {string} message - Email message (plain text)
 * @param {string} htmlMessage - Email message (HTML)
 * @returns {Promise<object>} Result with success status
 */
export const sendResendEmail = async (toEmail, subject, message, htmlMessage = null) => {
  if (!isResendConfigured()) {
    console.warn('Resend API key not configured')
    return {
      success: false,
      error: 'Resend API key not configured. Please set VITE_RESEND_API_KEY in your .env file.'
    }
  }

  try {
    // Call our backend API instead of Resend directly (avoids CORS issues)
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    
    const response = await fetch(`${API_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: toEmail,
        subject: subject,
        text: message,
        html: htmlMessage || formatEmailHTML(subject, message)
      })
    })

    const data = await response.json()

    if (response.ok && data.success) {
      console.log('✅ Email sent successfully via Resend:', data)
      return {
        success: true,
        id: data.id,
        message: 'Email sent successfully'
      }
    } else {
      console.error('❌ Resend API error:', data)
      return {
        success: false,
        error: data.error || 'Failed to send email'
      }
    }
  } catch (error) {
    console.error('❌ Failed to send email via Resend:', error)
    
    // Check if backend server is running
    if (error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Email server not running. Please start it with: npm run server'
      }
    }
    
    return {
      success: false,
      error: error.message || 'Network error'
    }
  }
}

/**
 * Format email as HTML
 */
const formatEmailHTML = (subject, message) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f5;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #1f2937;
      margin: 0 0 20px 0;
      font-size: 22px;
    }
    .content p {
      color: #4b5563;
      margin: 0 0 15px 0;
      white-space: pre-wrap;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      color: #6b7280;
      font-size: 14px;
      margin: 5px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 8px;
      margin: 20px 0;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Find Your Inner Peace</h1>
    </div>
    <div class="content">
      <h2>${subject}</h2>
      <p>${message}</p>
    </div>
    <div class="footer">
      <p><strong>Find Your Inner Peace</strong></p>
      <p>Your Wellness Journey Companion</p>
      <p style="margin-top: 15px; font-size: 12px;">
        This email was sent by Find Your Inner Peace wellness app.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

/**
 * Send wellness notification email
 */
export const sendWellnessNotification = async (notification, recipientEmail = null) => {
  const preferences = getEmailPreferences()
  const toEmail = recipientEmail || preferences.email
  
  if (!toEmail) {
    return {
      success: false,
      reason: 'No email address provided'
    }
  }

  const subject = notification.title || 'Wellness Notification'
  const message = notification.message || notification.description || ''
  
  // Create rich HTML email
  const htmlMessage = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f5;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
    }
    .notification-badge {
      background: ${getNotificationColor(notification.type)};
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      display: inline-block;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin: 10px 0;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #1f2937;
      margin: 0 0 20px 0;
    }
    .content p {
      color: #4b5563;
      margin: 0 0 15px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff !important;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      margin: 25px 0;
      font-weight: 600;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      color: #6b7280;
      font-size: 14px;
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>🧘‍♀️ Find Your Inner Peace</h1>
      <div class="notification-badge">${notification.type || 'Notification'}</div>
    </div>
    <div class="content">
      <h2>${subject}</h2>
      <p>${message}</p>
      ${notification.action ? `<a href="${notification.action}" class="cta-button">View Details</a>` : ''}
    </div>
    <div class="footer">
      <p><strong>Find Your Inner Peace</strong></p>
      <p>Your Wellness Journey Companion</p>
      <p style="margin-top: 15px; font-size: 12px;">
        You received this email because you enabled notifications in your wellness app.
      </p>
    </div>
  </div>
</body>
</html>
  `

  return await sendResendEmail(toEmail, subject, message, htmlMessage)
}

/**
 * Get notification type color
 */
const getNotificationColor = (type) => {
  const colors = {
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
    error: '#ef4444',
    goal: '#8b5cf6',
    reminder: '#f59e0b',
    achievement: '#10b981'
  }
  return colors[type] || '#6366f1'
}

/**
 * Get email preferences from storage
 */
export const getEmailPreferences = () => {
  const saved = getJSON('emailPreferences')
  if (saved) {
    return saved
  }
  
  return {
    enabled: true,
    email: '',
    types: {
      goal: true,
      reminder: true,
      achievement: true,
      report: true,
      insight: true,
      warning: true
    },
    frequency: 'immediate'
  }
}

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (userEmail, userName) => {
  if (!isResendConfigured()) {
    return { success: false, error: 'Resend not configured' }
  }

  try {
    // Call backend API for welcome email
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    
    const response = await fetch(`${API_URL}/api/send-welcome-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userEmail,
        name: userName
      })
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return {
      success: false,
      error: 'Email server not running. Start with: npm run server'
    }
  }
}

// Legacy function for reference
const sendWelcomeEmailOld = async (userEmail, userName) => {
  const subject = '🎉 Welcome to Find Your Inner Peace!'
  const message = `Hi ${userName},\n\nWelcome to your wellness journey! We're excited to have you here.\n\nFind Your Inner Peace is your personal wellness companion, helping you track nutrition, meditation, sleep, and more.\n\nGet started by exploring the dashboard and setting up your first wellness goal!\n\nBest regards,\nFind Your Inner Peace Team`
  
  const htmlMessage = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f4f4f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 32px; }
    .content { padding: 40px 30px; }
    .welcome-text { font-size: 18px; color: #1f2937; margin-bottom: 20px; }
    .features { background: #f9fafb; padding: 25px; border-radius: 12px; margin: 25px 0; }
    .feature { display: flex; align-items: start; margin: 15px 0; }
    .feature-icon { font-size: 24px; margin-right: 15px; }
    .feature-text { color: #4b5563; }
    .cta { text-align: center; margin: 30px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: 600; }
    .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧘‍♀️ Welcome to Find Your Inner Peace!</h1>
    </div>
    <div class="content">
      <p class="welcome-text">Hi <strong>${userName}</strong>,</p>
      <p>We're thrilled to have you join us on your wellness journey!</p>
      
      <div class="features">
        <h3 style="margin-top: 0; color: #1f2937;">What you can do:</h3>
        <div class="feature">
          <span class="feature-icon">🍎</span>
          <span class="feature-text"><strong>AI Nutrition Tracking</strong> - Analyze food photos and track your nutrition</span>
        </div>
        <div class="feature">
          <span class="feature-icon">🧠</span>
          <span class="feature-text"><strong>Meditation & Mindfulness</strong> - Guided sessions with vocal instructions</span>
        </div>
        <div class="feature">
          <span class="feature-icon">😊</span>
          <span class="feature-text"><strong>Mood & Sleep Tracking</strong> - Monitor your wellbeing patterns</span>
        </div>
        <div class="feature">
          <span class="feature-icon">✨</span>
          <span class="feature-text"><strong>AI Wellness Insights</strong> - Personalized recommendations</span>
        </div>
      </div>
      
      <div class="cta">
        <a href="${window.location.origin}/dashboard" class="button">Start Your Journey →</a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        Need help? We're here for you! Explore the app and discover all the features designed to support your wellness goals.
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
  
  return await sendResendEmail(userEmail, subject, message, htmlMessage)
}

export default {
  sendResendEmail,
  sendWellnessNotification,
  sendWelcomeEmail,
  isResendConfigured,
  getEmailPreferences
}

