# EmailJS Setup Guide

This application uses EmailJS to send real email notifications directly from the frontend without requiring a backend server.

## Step 1: Sign Up for EmailJS

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account (free tier includes 200 emails/month)

## Step 2: Create an Email Service

1. After logging in, go to **Email Services** in the dashboard
2. Click **Add New Service**
3. Choose an email provider (Gmail, Outlook, etc.) or use EmailJS's built-in service
4. Follow the setup instructions for your chosen provider
5. After setup, you'll get a **Service ID** - copy this

## Step 3: Create an Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use this template structure:

**Template Settings:**
- **Template Name**: Wellness Notification
- **Subject**: `{{subject}}`

**Template Content (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #6366f1;">Find Your Inner Peace</h1>
    <div style="margin: 20px 0;">
      <h2>{{subject}}</h2>
      <div style="white-space: pre-wrap;">{{message}}</div>
    </div>
    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
      <p>Find Your Inner Peace - Your Wellness Journey Companion</p>
      <p>This email was sent to {{to_email}}</p>
    </div>
  </div>
</body>
</html>
```

**Template Variables:**
The template should include these variables:
- `{{to_email}}` - Recipient email address
- `{{to_name}}` - Recipient name
- `{{subject}}` - Email subject
- `{{message}}` - Email message content
- `{{html_message}}` - HTML formatted message (optional, if you want to use it)

4. Save the template and copy the **Template ID**

## Step 4: Get Your Public Key

1. Go to **Account** → **General** in the EmailJS dashboard
2. Find your **Public Key** and copy it

## Step 5: Configure in Your Application

1. Open or create the `.env` file in your project root directory
2. Add the following variables:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

**Important:** 
- Replace `your_service_id_here`, `your_template_id_here`, and `your_public_key_here` with your actual values
- Do NOT commit the `.env` file to version control (it should already be in `.gitignore`)

## Step 6: Restart Development Server

1. Stop your development server (Ctrl+C)
2. Restart it with:
   ```bash
   npm run dev
   ```

## Step 7: Test Email Notifications

1. Go to **Profile** → **Email Preferences**
2. Set your email address
3. Enable email notifications
4. Click **Send Test Email** to verify it works

## Troubleshooting

### Emails going to Spam

To reduce spam issues:
1. **Use a verified email sender** - Use an email address that's been verified with EmailJS
2. **Avoid spam trigger words** - The app formats emails properly, but make sure your template doesn't include spam trigger words
3. **Set up SPF/DKIM** - Configure proper email authentication with your email provider
4. **Warm up your email** - If using a new email address, gradually increase email volume
5. **Use a custom domain** - Using a verified domain email address helps with deliverability

### "EmailJS not configured" Error

- Make sure all three environment variables are set in your `.env` file
- Verify variable names start with `VITE_` (required for Vite)
- Restart the development server after adding/changing `.env` variables
- Check that there are no extra spaces or quotes in your `.env` file

### Email Not Sending

- Check the browser console for error messages
- Verify your Service ID, Template ID, and Public Key are correct
- Make sure your EmailJS account hasn't exceeded the monthly email limit
- Check that email notifications are enabled in Profile → Email Preferences
- Verify the recipient email address is valid

### Template Variables Not Working

- Make sure your EmailJS template includes all the variables used: `{{to_email}}`, `{{subject}}`, `{{message}}`
- Variable names are case-sensitive
- Test your template in the EmailJS dashboard first

## Alternative: Using a Backend Service

If you prefer using a backend email service (like SendGrid, AWS SES, or Nodemailer), you'll need to:
1. Create a backend API endpoint
2. Update `sendEmailNotification` in `src/utils/emailNotifications.js` to call your API
3. Handle email sending on the server side

For production applications, a backend service is recommended for better security and deliverability.

