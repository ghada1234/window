# Quick Deployment Guide

## ✅ Build Complete!

Your production build is ready in the `dist/` folder.

## Deployment Options

### 🚀 Option 1: Vercel (Easiest - Recommended)

```bash
# Install Vercel CLI (one-time)
npm i -g vercel

# Deploy
cd /Users/ghadaalani/Desktop/window
vercel
```

Follow the prompts:
1. Login to Vercel (or create account)
2. Link to existing project or create new one
3. Vercel will auto-detect your project
4. **Add your domain**: In Vercel dashboard → Settings → Domains → Add `find-your-inner-peace.com`
5. **Set Environment Variables** in Vercel dashboard:
   - `VITE_GEMINI_API_KEY`
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`

### 🌐 Option 2: Traditional Web Hosting (cPanel/FTP)

1. **Upload everything in the `dist/` folder** to your web root:
   - `dist/index.html` → `public_html/index.html` (or `www/index.html`)
   - `dist/assets/` → `public_html/assets/`
   - `dist/sun.jpg` → `public_html/sun.jpg`
   - `dist/.htaccess` → `public_html/.htaccess`

2. **Set Environment Variables** on your hosting platform (check your hosting provider's documentation for how to set environment variables)

### 📦 Option 3: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login and deploy
netlify login
netlify deploy --prod --dir=dist
```

Then configure domain and environment variables in Netlify dashboard.

## ⚙️ Environment Variables Required

Make sure these are set in your hosting platform:

```
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## 📋 Pre-Deployment Checklist

- [x] Build completed successfully
- [x] `.htaccess` file created for Apache servers
- [x] `vercel.json` configured for Vercel
- [x] `netlify.toml` configured for Netlify
- [ ] Environment variables set in hosting platform
- [ ] Domain configured (DNS records updated)
- [ ] SSL certificate installed (HTTPS)

## 🧪 Test After Deployment

1. Visit https://www.find-your-inner-peace.com/
2. Test AI features (Gemini API)
3. Test email notifications (EmailJS)
4. Check all routes work correctly
5. Test on mobile devices
6. Verify images load (`sun.jpg`)

## 📞 Need Help?

See `DEPLOYMENT.md` for detailed instructions and troubleshooting.

