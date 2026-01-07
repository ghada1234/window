# 🌐 Deploy to Custom Domain - Complete Guide

## Your Domain: `find-your-inner-peace.com`

Since your Vercel account is suspended, here are alternative ways to deploy to your domain:

---

## Option 1: GitHub Pages with Custom Domain (Free)

### Step 1: Add CNAME File
✅ **Already created:** `public/CNAME` with your domain

### Step 2: Deploy to GitHub Pages
```bash
npm run deploy
```

### Step 3: Configure Domain in GitHub
1. Go to: https://github.com/ghada1234/window/settings/pages
2. Under "Custom domain", enter: `find-your-inner-peace.com`
3. Check "Enforce HTTPS"
4. Click "Save"

### Step 4: Configure DNS at Your Domain Registrar
Go to where you purchased your domain (GoDaddy, Namecheap, Cloudflare, etc.) and add:

**CNAME Record:**
- Type: `CNAME`
- Name: `@` (or leave blank for root domain)
- Value: `ghada1234.github.io`
- TTL: `3600` (or default)

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `ghada1234.github.io`
- TTL: `3600`

**Wait 24-48 hours** for DNS propagation.

---

## Option 2: Netlify with Custom Domain (Free)

### Step 1: Deploy to Netlify
1. Go to: https://app.netlify.com/drop
2. Drag and drop your `dist` folder
3. Your site will get a Netlify URL

### Step 2: Add Custom Domain
1. Go to Site Settings → Domain management
2. Click "Add custom domain"
3. Enter: `find-your-inner-peace.com`
4. Netlify will show you DNS records to add

### Step 3: Configure DNS
At your domain registrar, add the DNS records Netlify provides (usually A records or CNAME).

---

## Option 3: Cloudflare Pages (Free)

### Step 1: Connect Repository
1. Go to: https://dash.cloudflare.com
2. Pages → Create a project
3. Connect your GitHub repository: `ghada1234/window`

### Step 2: Configure Build
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

### Step 3: Add Custom Domain
1. Go to your project → Custom domains
2. Add: `find-your-inner-peace.com`
3. Cloudflare will auto-configure DNS if domain is on Cloudflare

---

## Option 4: Render.com (Free)

### Step 1: Create Static Site
1. Go to: https://render.com
2. New → Static Site
3. Connect GitHub repository

### Step 2: Configure
- Build Command: `npm run build`
- Publish Directory: `dist`

### Step 3: Add Custom Domain
1. Settings → Custom Domains
2. Add: `find-your-inner-peace.com`
3. Follow DNS instructions

---

## Option 5: Traditional Web Hosting (cPanel/FTP)

If you have traditional web hosting:

### Step 1: Upload Files
1. Connect via FTP or use cPanel File Manager
2. Upload all contents of `dist` folder to:
   - `public_html/` (or `www/` or `htdocs/`)

### Step 2: Configure Domain
- Your hosting provider should already have your domain configured
- Point domain to the uploaded files

### Step 3: Add .htaccess (if Apache)
Create `.htaccess` in web root:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🔧 DNS Configuration Guide

### For Root Domain (`find-your-inner-peace.com`)

**Option A: A Records (for most hosting)**
```
Type: A
Name: @
Value: [IP address from hosting provider]
TTL: 3600
```

**Option B: CNAME (for GitHub Pages, Netlify, etc.)**
```
Type: CNAME
Name: @
Value: [hosting provider's CNAME]
TTL: 3600
```

### For WWW Subdomain (`www.find-your-inner-peace.com`)

**CNAME Record:**
```
Type: CNAME
Name: www
Value: [hosting provider's CNAME]
TTL: 3600
```

---

## ⚙️ Environment Variables

After deployment, add these environment variables in your hosting platform:

```
VITE_GEMINI_API_KEY=AIzaSyBdkHYvL7WgmNM_sjvSe7SycQj8DT4ezBA
VITE_RESEND_API_KEY=re_BzqzbHkb_NpdFfyjvzySqWPWMjRf1n4Fw
VITE_RESEND_FROM_EMAIL=onboarding@resend.dev
VITE_EMAILJS_PUBLIC_KEY=H_6OzN6StMhcXdEpV
RESEND_API_KEY=re_BzqzbHkb_NpdFfyjvzySqWPWMjRf1n4Fw
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**Note:** For static hosting (GitHub Pages, Netlify), you may need to set these at build time or use a backend service.

---

## ✅ Recommended: GitHub Pages (Easiest)

Since you already have:
- ✅ Code on GitHub
- ✅ `gh-pages` installed
- ✅ CNAME file created
- ✅ Build working

**Just run:**
```bash
npm run deploy
```

Then configure DNS as shown in Option 1 above.

---

## 🧪 Testing After Deployment

1. **Check DNS propagation:**
   - Use: https://dnschecker.org
   - Enter: `find-your-inner-peace.com`

2. **Test HTTPS:**
   - Visit: `https://find-your-inner-peace.com`
   - Should show green lock icon

3. **Test all routes:**
   - Navigate through your app
   - Test authentication
   - Test all features

---

## 📋 Quick Checklist

- [ ] Choose hosting platform
- [ ] Deploy your app
- [ ] Add custom domain in hosting platform
- [ ] Configure DNS at domain registrar
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Test domain access
- [ ] Set up environment variables
- [ ] Test all features

---

## 🔗 Quick Links

- **GitHub Repository:** https://github.com/ghada1234/window
- **GitHub Pages Settings:** https://github.com/ghada1234/window/settings/pages
- **Netlify:** https://app.netlify.com
- **Cloudflare Pages:** https://dash.cloudflare.com
- **Render:** https://render.com

---

**Choose the option that works best for you! 🚀**

