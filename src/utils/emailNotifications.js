// Email Notification Service using EmailJS
import emailjs from '@emailjs/browser'
import { getJSON, setJSON } from './storage'
import safeStorage from './storage'

// EmailJS Configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

// Check if EmailJS is configured
export const isEmailJSConfigured = () => {
  return !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY)
}

// Initialize EmailJS
const initEmailJS = () => {
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY)
  }
}

// Initialize on module load
if (EMAILJS_PUBLIC_KEY) {
  initEmailJS()
}

export const sendEmailNotification = async (email, subject, message, notificationType = 'info') => {
  // Get user email preferences from localStorage
  const preferences = getEmailPreferences()
  
  // Check if email notifications are enabled for this type
  if (!preferences.enabled || !preferences.types[notificationType]) {
    console.log('Email notifications disabled for this type')
    return { success: false, reason: 'Email notifications disabled' }
  }

  // Check if EmailJS is configured
  if (!isEmailJSConfigured()) {
    console.warn('EmailJS not configured. Emails will be simulated.')
    // Fallback to simulation for demo purposes
    const emailData = {
      to: email,
      subject: subject,
      message: message,
      type: notificationType,
      timestamp: new Date().toISOString()
    }
    const sentEmails = getJSON('sentEmails', [])
    sentEmails.push(emailData)
    setJSON('sentEmails', sentEmails)
    return { success: false, reason: 'EmailJS not configured. Please set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your .env file.' }
  }

  try {
    // Format HTML email to avoid spam filters
    const htmlMessage = formatEmailHTML(email, subject, message, notificationType)
    
    // Prepare template parameters for EmailJS
    const templateParams = {
      to_email: email,
      to_name: email.split('@')[0], // Extract name from email
      subject: subject,
      message: message,
      html_message: htmlMessage,
      notification_type: notificationType,
      app_name: 'Find Your Inner Peace'
    }

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    )

    console.log('Email sent successfully:', response)
    
    // Store email in localStorage for history
    const emailData = {
      to: email,
      subject: subject,
      message: message,
      type: notificationType,
      timestamp: new Date().toISOString(),
      emailjs_response: response.status
    }
    const sentEmails = getJSON('sentEmails', [])
    sentEmails.push(emailData)
    setJSON('sentEmails', sentEmails)
    
    return { success: true, emailData, response }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { 
      success: false, 
      error: error.message || 'Failed to send email. Please check your EmailJS configuration.',
      details: error.text || error
    }
  }
}

// Format email HTML to avoid spam filters
const formatEmailHTML = (email, subject, message, type) => {
  const colors = {
    'goal': '#6366f1',
    'reminder': '#3b82f6',
    'achievement': '#10b981',
    'report': '#8b5cf6',
    'insight': '#f59e0b',
    'warning': '#ef4444',
    'info': '#6366f1'
  }
  
  const color = colors[type] || colors['info']
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="border-bottom: 3px solid ${color}; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: ${color}; margin: 0; font-size: 24px;">Find Your Inner Peace</h1>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 15px;">${subject.replace(' - Find Your Inner Peace', '')}</h2>
          <div style="color: #4b5563; font-size: 16px; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</div>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
          <p style="margin: 0;">Find Your Inner Peace</p>
          <p style="margin: 5px 0 0 0;">Your Wellness Journey Companion</p>
          <p style="margin: 15px 0 0 0; font-size: 12px;">This email was sent to ${email}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export const getEmailPreferences = () => {
  const saved = getJSON('emailPreferences')
  if (saved) {
    return saved
  }
  
  // Default preferences
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
    frequency: 'immediate' // immediate, daily, weekly
  }
}

export const saveEmailPreferences = (preferences) => {
  setJSON('emailPreferences', preferences)
}

// Get user email from preferences
export const getUserEmail = () => {
  const preferences = getEmailPreferences()
  return preferences.email || ''
}

export const sendNotificationEmail = async (notification, userEmail = null) => {
  const preferences = getEmailPreferences()
  
  // Get user email if not provided
  const recipientEmail = userEmail || getUserEmail()
  
  if (!recipientEmail || !recipientEmail.includes('@')) {
    console.warn('Invalid or missing user email')
    return { success: false, reason: 'Invalid email address. Please set your email in Profile > Email Preferences.' }
  }

  if (!preferences.enabled) {
    return { success: false, reason: 'Email notifications are disabled in your profile settings.' }
  }

  // Map notification types
  const typeMap = {
    'success': 'achievement',
    'info': 'reminder',
    'warning': 'warning',
    'goal': 'goal',
    'reminder': 'reminder',
    'achievement': 'achievement',
    'report': 'report',
    'insight': 'insight',
    'warning': 'warning'
  }

  const emailType = typeMap[notification.type] || 'reminder'

  if (!preferences.types[emailType]) {
    return { success: false, reason: `Email notifications for '${emailType}' are disabled in your profile settings.` }
  }

  const subject = `${notification.title} - Find Your Inner Peace`
  const messageBody = `
    ${notification.title}
    
    ${notification.message}
    
    ${notification.time ? `Time: ${notification.time}` : ''}
    
    ---
    Find Your Inner Peace
    Your Wellness Journey Companion
  `

  console.log(`Sending email to: ${recipientEmail}`)
  console.log(`Subject: ${subject}`)
  console.log(`Type: ${emailType}`)

  return await sendEmailNotification(recipientEmail, subject, messageBody, emailType)
}

// Get sent emails history
export const getSentEmails = () => {
  return getJSON('sentEmails', [])
}

// Clear sent emails history
export const clearSentEmails = () => {
  safeStorage.removeItem('sentEmails')
}

