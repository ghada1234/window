// Simple Express server for Resend email API
// This allows the frontend to send emails without CORS issues

import express from 'express'
import cors from 'cors'
import { Resend } from 'resend'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Find Your Inner Peace Email API' })
})

// Send email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body

    // Validate input
    if (!to || !subject) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject'
      })
    }

    // Send email via Resend
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: [to],
      subject: subject,
      text: text || '',
      html: html || text
    })

    console.log('✅ Email sent:', { to, subject, id: data.id })

    res.json({
      success: true,
      id: data.id,
      message: 'Email sent successfully'
    })

  } catch (error) {
    console.error('❌ Email error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email'
    })
  }
})

// Send welcome email endpoint
app.post('/api/send-welcome-email', async (req, res) => {
  try {
    const { email, name } = req.body

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email, name'
      })
    }

    const html = `
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
      <p class="welcome-text">Hi <strong>${name}</strong>,</p>
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

    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: [email],
      subject: '🎉 Welcome to Find Your Inner Peace!',
      html: html
    })

    console.log('✅ Welcome email sent:', { email, id: data.id })

    res.json({
      success: true,
      id: data.id,
      message: 'Welcome email sent successfully'
    })

  } catch (error) {
    console.error('❌ Welcome email error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send welcome email'
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Email API Server running on http://localhost:${PORT}`)
  console.log(`📧 Resend API configured: ${process.env.RESEND_API_KEY ? 'Yes' : 'No'}`)
  console.log(`📤 From email: ${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}\n`)
})

