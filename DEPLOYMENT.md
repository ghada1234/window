# Deployment Guide for Find Your Inner Peace

## Build Status
✅ Production build completed successfully!

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd /Users/ghadaalani/Desktop/window
   vercel
   ```

3. **Configure Domain**:
   - In Vercel dashboard, go to your project
   - Go to Settings → Domains
   - Add `find-your-inner-peace.com` and `www.find-your-inner-peace.com`
   - Update your domain's DNS records as instructed

4. **Set Environment Variables**:
   - Go to Settings → Environment Variables
   - Add:
     - `VITE_GEMINI_API_KEY` (for AI features)
     - `VITE_EMAILJS_SERVICE_ID` (for email notifications)
     - `VITE_EMAILJS_TEMPLATE_ID` (for email notifications)
     - `VITE_EMAILJS_PUBLIC_KEY` (for email notifications)

### Option 2: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

3. **Configure Domain & Environment Variables** in Netlify dashboard

### Option 3: Traditional Web Hosting (cPanel, FTP, etc.)

If you have access to your web server via FTP/cPanel:

1. **Upload the `dist` folder contents** to your web root (usually `public_html` or `www`)

2. **Ensure proper file permissions**:
   - Files: 644
   - Folders: 755

3. **Create/Update `.htaccess` file** in the web root (see `.htaccess` file included)

4. **Configure Environment Variables**:
   - Set environment variables on your hosting platform
   - Or use a config file (see below for alternatives)

### Option 4: GitHub Pages

1. **Push your code to GitHub**

2. **Install GitHub Pages plugin**:
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Update `package.json`**:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

## Environment Variables for Production

Make sure to set these environment variables in your hosting platform:

### Required for AI Features:
- `VITE_GEMINI_API_KEY` - Your Google Gemini API key

### Required for Email Notifications:
- `VITE_EMAILJS_SERVICE_ID` - EmailJS Service ID
- `VITE_EMAILJS_TEMPLATE_ID` - EmailJS Template ID
- `VITE_EMAILJS_PUBLIC_KEY` - EmailJS Public Key

**Important**: Never commit `.env` files to version control!

## Post-Deployment Checklist

- [ ] Test all features (AI analysis, email notifications)
- [ ] Verify environment variables are set correctly
- [ ] Check that all routes work (try navigating to different pages)
- [ ] Test on mobile devices
- [ ] Verify email notifications work
- [ ] Check browser console for any errors
- [ ] Test Gemini AI features with your API key
- [ ] Verify images load correctly (`sun.jpg` in public folder)

## Troubleshooting

### Routes not working (404 errors)
- Ensure your server is configured for SPA (Single Page Application) routing
- Use the provided `.htaccess` file for Apache servers
- For Nginx, see nginx configuration below

### Environment variables not working
- Make sure variables start with `VITE_` prefix
- Restart your server/hosting service after adding variables
- Check that variables are set in production environment, not just development

### Images not loading
- Ensure `public/sun.jpg` is uploaded to your server
- Check file paths are correct (case-sensitive on some servers)

## Server Configuration Examples

### Apache (.htaccess) - Included in project

### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name find-your-inner-peace.com www.find-your-inner-peace.com;
    
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Node.js Express Server (if needed):
```javascript
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

