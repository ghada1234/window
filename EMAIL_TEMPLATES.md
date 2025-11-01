# 📧 Email Templates - Find Your Inner Peace

## Overview

All email notifications sent by the app use professional, branded templates with consistent styling.

---

## 🔐 Password Reset Email

### **Sender Information:**
- **From:** `noreply@yourdomain.com` (configure in `.env`)
- **Reply-to:** None (automated message)
- **Subject:** `Reset your password for Find Your Inner Peace`

### **Email Content:**

```
Hello,

Follow this link to reset your Find Your Inner Peace password 
for your user@email.com account.

[Reset Password Button]

⏰ This link will expire in 1 hour

Security Notice:
If you didn't ask to reset your password, you can safely 
ignore this email. Your password will not be changed.

If the button doesn't work, copy and paste this link:
https://your-app.com/reset-password?token=xxx&email=xxx

Thanks,
Your Find Your Inner Peace Team
```

### **Features:**
- ✅ Professional Firebase-style design
- ✅ Clear call-to-action button
- ✅ Expiry warning (1 hour)
- ✅ Security notice
- ✅ Fallback link for email clients without button support
- ✅ Responsive design (mobile & desktop)
- ✅ Brand colors (purple gradient)

---

## 👋 Welcome Email

### **Sender Information:**
- **From:** `noreply@yourdomain.com`
- **Subject:** `Welcome to Find Your Inner Peace! 🧘‍♀️`

### **Email Content:**

```
Welcome to Find Your Inner Peace!

Hi [Name],

Thank you for joining our wellness community! We're excited 
to help you on your journey to better health and mindfulness.

Getting Started:
• Track your nutrition with AI-powered analysis
• Log your water intake daily
• Monitor your sleep and mood
• Access personalized wellness recommendations

[Get Started Button]

Need help? Visit our Help Center or contact support.

Best regards,
The Find Your Inner Peace Team
```

### **Sent When:**
- User completes sign up
- Account is successfully created

---

## 💳 Subscription Confirmation

### **Sender Information:**
- **From:** `noreply@yourdomain.com`
- **Subject:** `Subscription Confirmed - Find Your Inner Peace Premium`

### **Email Content:**

```
Premium Subscription Activated!

Hi [Name],

Your premium subscription is now active! 🎉

Subscription Details:
• Plan: Monthly Subscription
• Amount: 25.67 AED/month
• Next billing: [Date]
• Status: Active

Premium Benefits:
✅ AI-powered nutrition analysis
✅ Unlimited food scanning
✅ Advanced wellness insights
✅ Personalized recommendations
✅ Priority support

[Manage Subscription Button]

Questions? Contact our support team anytime.

Best regards,
The Find Your Inner Peace Team
```

### **Sent When:**
- Payment is successful
- Subscription status changes

---

## 📊 Wellness Report Email (Optional)

### **Sender Information:**
- **From:** `noreply@yourdomain.com`
- **Subject:** `Your Weekly Wellness Report is Ready!`

### **Email Content:**

```
Your Wellness Report is Ready!

Hi [Name],

Your weekly wellness report has been generated with your 
latest health insights and recommendations.

This Week's Highlights:
• Overall Score: 85/100 (Excellent!)
• Best Category: Sleep (92/100)
• Focus Area: Hydration (68/100)

[View Full Report Button]

Keep up the great work on your wellness journey!

Best regards,
The Find Your Inner Peace Team
```

### **Sent When:**
- Weekly/Monthly (if enabled)
- User requests report generation

---

## 🔔 Reminder Emails

### **Water Reminder:**
```
Subject: 💧 Time to Hydrate!

Hi [Name],

It's been a while since your last water log. 
Remember to stay hydrated throughout the day!

Daily Goal: 2000ml
Current: [Amount]ml

[Log Water Now Button]
```

### **Meditation Reminder:**
```
Subject: 🧘‍♀️ Your Daily Mindfulness Moment

Hi [Name],

Take a few minutes for yourself today. 
Your mind and body will thank you!

[Start Meditation Button]
```

---

## 📧 Email Template Structure

### **HTML Email Components:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Email Title]</title>
  <style>
    /* Responsive email styles */
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header with brand gradient -->
    <div class="email-header">
      <h1>[Email Title]</h1>
    </div>
    
    <!-- Main content -->
    <div class="email-body">
      <p>Hello,</p>
      <p>[Main message]</p>
      
      <!-- Call to action button -->
      <div class="button-container">
        <a href="[Link]" class="action-button">
          [Button Text]
        </a>
      </div>
      
      <!-- Important notices -->
      <div class="email-info">
        <p>[Important information]</p>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="email-footer">
      <p><strong>Find Your Inner Peace</strong></p>
      <p>Your Personal Wellness Companion 🧘‍♀️</p>
      <p>© 2025 Find Your Inner Peace. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

---

## 🎨 Email Design Guidelines

### **Colors:**
- **Primary Gradient:** `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Text Primary:** `#1f2937`
- **Text Secondary:** `#6b7280`
- **Background:** `#f9fafb`
- **Accent:** `#6366f1`

### **Typography:**
- **Font Family:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Header Size:** `24px` (bold)
- **Body Size:** `15px`
- **Small Text:** `13px`

### **Button Styles:**
- **Background:** Purple gradient
- **Text:** White, 16px, bold
- **Padding:** `14px 32px`
- **Border Radius:** `8px`
- **Hover:** Slight lift effect

### **Responsive Breakpoints:**
- **Mobile:** `max-width: 600px`
- **Padding adjustments:** Reduce to `20px`
- **Button size:** Slightly smaller on mobile

---

## ⚙️ Configuration

### **Environment Variables:**

```bash
# Resend Configuration
VITE_RESEND_FROM_EMAIL=noreply@findyourinnerpeace.com
RESEND_FROM_EMAIL=noreply@findyourinnerpeace.com

# App Configuration
VITE_APP_NAME=Find Your Inner Peace
VITE_APP_URL=https://window-5vstwrp2f-ghada-rabees-projects.vercel.app
VITE_SUPPORT_EMAIL=support@findyourinnerpeace.com
```

### **Email Service Setup:**

1. **Resend Dashboard:**
   - Add verified domain
   - Configure DNS records (SPF, DKIM)
   - Set sender email

2. **Vercel Environment:**
   - Add all email variables
   - Deploy serverless functions
   - Test email delivery

---

## 📝 Email Best Practices

### **Content:**
- ✅ Keep subject lines under 50 characters
- ✅ Use clear, action-oriented CTAs
- ✅ Include both button and text links
- ✅ Add unsubscribe option (for marketing emails)
- ✅ Personalize with user's name
- ✅ Keep emails scannable with short paragraphs

### **Design:**
- ✅ Mobile-first responsive design
- ✅ Max width: 600px for desktop
- ✅ Use web-safe fonts
- ✅ Test in multiple email clients
- ✅ Include alt text for images
- ✅ Use inline CSS for compatibility

### **Deliverability:**
- ✅ Authenticate with SPF, DKIM, DMARC
- ✅ Use reputable email service (Resend)
- ✅ Avoid spam trigger words
- ✅ Include physical address in footer
- ✅ Monitor bounce and complaint rates
- ✅ Warm up new sending domain gradually

---

## 🧪 Testing Emails

### **Local Testing:**
```bash
# Start development server
npm run dev

# Test password reset flow
1. Go to /landing
2. Click "Forgot Password"
3. Enter email
4. Check console for email content
```

### **Production Testing:**
```bash
# After deployment
1. Use real email address
2. Trigger password reset
3. Check inbox and spam folder
4. Verify link works
5. Test responsive design on mobile
```

### **Email Testing Tools:**
- **Litmus:** Test across email clients
- **Email on Acid:** Spam score testing
- **Mail-Tester:** Deliverability check
- **Resend Logs:** Check delivery status

---

## 📊 Email Analytics

### **Track These Metrics:**
- **Delivery Rate:** % successfully delivered
- **Open Rate:** % of emails opened
- **Click Rate:** % clicking links/buttons
- **Bounce Rate:** % failed deliveries
- **Complaint Rate:** % marked as spam

### **Access Analytics:**
1. **Resend Dashboard:** Real-time delivery logs
2. **Google Analytics:** Track button clicks
3. **Custom Events:** Log email interactions

---

## 🔒 Security & Privacy

### **Best Practices:**
- ✅ Never include passwords in emails
- ✅ Use secure HTTPS links only
- ✅ Set token expiration (1 hour for resets)
- ✅ Rate limit email sending
- ✅ Validate email addresses
- ✅ Log all email activities
- ✅ Comply with GDPR/CAN-SPAM

### **Password Reset Security:**
- ✅ One-time use tokens
- ✅ Time-limited links (1 hour)
- ✅ Secure random token generation
- ✅ HTTPS-only reset pages
- ✅ No sensitive data in email

---

## 📞 Support Contact

For email delivery issues:
- **Support:** `support@findyourinnerpeace.com`
- **Technical:** Check Resend logs
- **DNS/Domain:** Verify domain records

---

## ✅ Email Checklist

Before sending emails in production:

- [ ] Domain verified in Resend
- [ ] SPF record added to DNS
- [ ] DKIM configured
- [ ] DMARC policy set
- [ ] Environment variables configured
- [ ] Test emails sent successfully
- [ ] Mobile responsive verified
- [ ] Links tested and working
- [ ] Unsubscribe option added (marketing)
- [ ] Privacy policy linked
- [ ] Physical address in footer (if required)
- [ ] Analytics tracking configured

---

**📧 Professional, branded emails for a better user experience!**

