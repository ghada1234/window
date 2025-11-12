# 📧 Email Service Setup Guide

## Error: "No email service configured"

This error means you need to set up an email service to send notifications from your wellness app.

---

## 🎯 Quick Fix

You need to add email service credentials to your `.env` file:

### Option 1: Resend (Recommended - Modern & Reliable)

1. **Get Resend API Key:**
   - Go to: https://resend.com
   - Sign up for free account
   - Create an API key
   - Copy the key

2. **Add to `.env` file:**
   ```env
   VITE_RESEND_API_KEY=re_your_api_key_here
   VITE_RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

3. **Start the backend server:**
   ```bash
   npm run server
   ```

### Option 2: EmailJS (Alternative - Browser-based)

1. **Get EmailJS credentials:**
   - Go to: https://www.emailjs.com/
   - Sign up for free
   - Create email service
   - Copy: Service ID, Template ID, Public Key

2. **Add to `.env` file:**
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

---

## 📋 Complete Setup Instructions

### Resend Setup (Recommended)

#### Step 1: Create Resend Account

1. Visit: https://resend.com
2. Click "Sign Up" (free tier: 100 emails/day)
3. Verify your email address

#### Step 2: Get API Key

1. Go to Dashboard → API Keys
2. Click "Create API Key"
3. Name it: "Wellness App"
4. Copy the API key (starts with `re_`)

#### Step 3: Verify Domain (Optional but recommended)

1. Go to Dashboard → Domains
2. Add your domain
3. Add DNS records (for production)
4. For development, use: `onboarding@resend.dev`

#### Step 4: Update `.env` File

Create/update `.env` in your project root:

```bash
cd /Users/ghadaalani/Desktop/project/window

# Create .env file
cat > .env << 'EOF'
# Gemini AI API Key (already set)
VITE_GEMINI_API_KEY=AIzaSyBdkHYvL7WgmNM_sjvSe7SycQj8DT4ezBA

# Resend Email Service
VITE_RESEND_API_KEY=re_your_actual_api_key_here
VITE_RESEND_FROM_EMAIL=noreply@yourdomain.com

# Backend API URL (for local development)
VITE_API_URL=http://localhost:3001
EOF
```

#### Step 5: Start Backend Server

The backend server handles email sending:

```bash
# In one terminal, start the dev server
npm run dev

# In another terminal, start the email server
npm run server
```

Or start both at once:

```bash
npm run dev:full
```

#### Step 6: Test Email Service

1. Open your app
2. Go to **Profile** page
3. Scroll to **Email Notification Settings**
4. Click **"Send Test Email"**
5. Check your inbox!

---

### EmailJS Setup (Alternative)

#### Step 1: Create EmailJS Account

1. Visit: https://www.emailjs.com/
2. Sign up (free tier: 200 emails/month)
3. Verify your email

#### Step 2: Add Email Service

1. Go to **Email Services** → **Add New Service**
2. Choose your email provider (Gmail, Outlook, etc.)
3. Connect your email account
4. Copy the **Service ID**

#### Step 3: Create Email Template

1. Go to **Email Templates** → **Create New Template**
2. Use this template:

```html
Subject: {{subject}}

Hi there,

{{message}}

---
{{app_name}}
Your Wellness Journey Companion
```

3. Save and copy the **Template ID**

#### Step 4: Get Public Key

1. Go to **Account** → **General**
2. Find **Public Key** (starts with letters/numbers)
3. Copy it

#### Step 5: Update `.env` File

```bash
cd /Users/ghadaalani/Desktop/project/window

# Add to .env
echo "VITE_EMAILJS_SERVICE_ID=service_xxxxxxx" >> .env
echo "VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx" >> .env
echo "VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxx" >> .env
```

#### Step 6: Restart Dev Server

```bash
npm run dev
```

---

## 🧪 Testing Your Setup

### Test 1: Check Configuration

In browser console (F12 → Console):

```javascript
// Check if email service is configured
console.log('Resend configured:', !!import.meta.env.VITE_RESEND_API_KEY)
console.log('EmailJS configured:', !!import.meta.env.VITE_EMAILJS_SERVICE_ID)
```

### Test 2: Send Test Email

1. **Via Profile Page:**
   - Go to **Profile** → **Email Settings**
   - Enter your email address
   - Click "Send Test Email"
   - Check your inbox (and spam folder)

2. **Via Notifications Page:**
   - Go to **Notifications**
   - Click any notification
   - Click the email icon (✉️)
   - Email should be sent

### Test 3: Welcome Email

When a new user signs up, they should receive a welcome email automatically.

---

## 🔧 Troubleshooting

### Error: "Email server not running"

**Problem:** Backend server (for Resend) is not running

**Solution:**
```bash
# Start the email server
npm run server

# Or use combined command
npm run dev:full
```

### Error: "Resend API key not configured"

**Problem:** API key not in `.env` file

**Solution:**
1. Check `.env` file exists in project root
2. Variable name is exactly: `VITE_RESEND_API_KEY`
3. Restart dev server after adding key

### Error: "EmailJS not configured"

**Problem:** Missing EmailJS credentials

**Solution:**
Add all three required variables:
```env
VITE_EMAILJS_SERVICE_ID=service_xxx
VITE_EMAILJS_TEMPLATE_ID=template_xxx
VITE_EMAILJS_PUBLIC_KEY=xxxxx
```

### Emails Not Receiving

**Possible Causes:**
1. Check spam/junk folder
2. Verify email address is correct
3. For Resend: Domain not verified (use `onboarding@resend.dev` for testing)
4. For EmailJS: Service not connected properly
5. API quota exceeded (check dashboard)

### CORS Errors (EmailJS)

EmailJS works in browser, but Resend needs backend:

**Resend:** Use backend server (`npm run server`)  
**EmailJS:** Works directly from browser (no server needed)

---

## 🚀 Production Deployment

### For Vercel/Netlify

Add environment variables in dashboard:

**Resend:**
- `VITE_RESEND_API_KEY` = your_api_key
- `VITE_RESEND_FROM_EMAIL` = noreply@yourdomain.com
- `VITE_API_URL` = your_deployed_backend_url

**EmailJS:**
- `VITE_EMAILJS_SERVICE_ID` = service_id
- `VITE_EMAILJS_TEMPLATE_ID` = template_id
- `VITE_EMAILJS_PUBLIC_KEY` = public_key

### Backend Server Deployment

For Resend, you need to deploy the backend:

**Option 1: Deploy with your app**
- Backend is in `server.js`
- Add to `vercel.json` or `netlify.toml`

**Option 2: Separate deployment**
- Deploy `server.js` to Railway, Render, or Heroku
- Update `VITE_API_URL` to deployed URL

---

## 📊 Email Features in Your App

### What Emails Are Sent?

1. **Welcome Email** - When user signs up
2. **Wellness Notifications** - Daily reminders
3. **Goal Achievements** - When goals are completed
4. **Weekly Reports** - Summary of wellness progress
5. **Mood Insights** - AI-generated insights
6. **Activity Reminders** - Stay active notifications

### Email Preferences

Users can control:
- Enable/disable email notifications
- Choose notification types
- Set frequency (immediate, daily, weekly)
- Test email sending

Managed in: **Profile → Email Notification Settings**

---

## 💰 Pricing Comparison

### Resend (Recommended)
- **Free Tier:** 3,000 emails/month, 100 emails/day
- **Paid:** Starts at $20/month for 50,000 emails
- **Best For:** Production apps, high volume

### EmailJS
- **Free Tier:** 200 emails/month
- **Paid:** Starts at $15/month for 1,000 emails
- **Best For:** Small apps, testing, demos

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep API keys in `.env` file (already in `.gitignore`)
- Use environment variables in production
- Rotate API keys periodically
- Use verified domains for production

### ❌ DON'T:
- Commit `.env` to Git
- Share API keys publicly
- Hardcode keys in source code
- Use the same key for dev and production

---

## 📝 Quick Commands Reference

```bash
# Create .env file
touch .env

# Start development server
npm run dev

# Start email backend server (for Resend)
npm run server

# Start both dev + email server
npm run dev:full

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

---

## ✅ Verification Checklist

- [ ] `.env` file created in project root
- [ ] Email service API key added
- [ ] Backend server running (if using Resend)
- [ ] Dev server restarted after adding keys
- [ ] Test email sent successfully
- [ ] Email received in inbox
- [ ] Production environment variables set
- [ ] Backend deployed (if using Resend)

---

## 🆘 Still Having Issues?

1. **Check Console Logs:**
   - Open browser DevTools (F12)
   - Look for email-related errors
   - Check Network tab for API calls

2. **Verify Environment Variables:**
   ```bash
   # In your terminal
   echo $VITE_RESEND_API_KEY
   # Or check in browser console
   console.log(import.meta.env.VITE_RESEND_API_KEY)
   ```

3. **Check Backend Server:**
   ```bash
   # Should be running on port 3001
   curl http://localhost:3001/api/health
   ```

4. **Review Documentation:**
   - Resend: https://resend.com/docs
   - EmailJS: https://www.emailjs.com/docs/

---

**Last Updated:** November 10, 2025  
**Status:** Ready to configure  
**Recommended:** Resend for production, EmailJS for quick testing

