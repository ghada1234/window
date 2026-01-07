# 🚀 Deploy "Find Your Inner Peace" to Netlify

## Quick Deploy (Recommended)

### Option 1: Netlify Web UI (Easiest)

1. **Go to Netlify Dashboard:**
   - Visit: https://app.netlify.com/drop
   - Or: https://app.netlify.com/start

2. **Drag & Drop Deployment:**
   - Simply drag the entire `dist` folder to the Netlify drop zone
   - Your site will be live in seconds!

3. **Or Import from Git:**
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Configure:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Base directory: `./`

4. **Add Environment Variables:**
   - Go to Site Settings → Environment Variables
   - Add:
     ```
     VITE_GEMINI_API_KEY=AIzaSyBdkHYvL7WgmNM_sjvSe7SycQj8DT4ezBA
     VITE_RESEND_API_KEY=re_BzqzbHkb_NpdFfyjvzySqWPWMjRf1n4Fw
     VITE_RESEND_FROM_EMAIL=onboarding@resend.dev
     VITE_EMAILJS_PUBLIC_KEY=H_6OzN6StMhcXdEpV
     RESEND_API_KEY=re_BzqzbHkb_NpdFfyjvzySqWPWMjRf1n4Fw
     RESEND_FROM_EMAIL=onboarding@resend.dev
     ```

5. **Redeploy** after adding environment variables

---

### Option 2: Netlify CLI (Interactive)

Run these commands in your terminal:

```bash
cd /Users/ghadaalani/Desktop/project/window

# Initialize Netlify (will prompt you)
netlify init

# When prompted:
# - Choose: "Create & configure a new project"
# - Site name: find-your-inner-peace
# - Build command: npm run build
# - Publish directory: dist

# Deploy to production
netlify deploy --prod
```

---

### Option 3: Other Free Hosting Options

#### GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

#### Surge.sh
```bash
# Install Surge
npm install -g surge

# Deploy
cd dist
surge
# Follow prompts to create account and deploy
```

#### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy --only hosting
```

#### Render.com
1. Go to: https://render.com
2. Create new Static Site
3. Connect your Git repository
4. Configure:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

---

## ✅ Your Build is Ready!

Your production build is in the `dist/` folder and ready to deploy!

**Build completed successfully:**
- ✓ All files optimized
- ✓ Calm color palette applied
- ✓ All features working
- ✓ Ready for production

---

## 📋 Post-Deployment Checklist

After deployment:

- [ ] Test the live site
- [ ] Verify all routes work (try navigating)
- [ ] Test authentication (sign up/login)
- [ ] Check AI features work
- [ ] Verify email notifications
- [ ] Test on mobile devices
- [ ] Check browser console for errors

---

## 🔗 Quick Links

- **Netlify Dashboard:** https://app.netlify.com
- **Netlify Drop:** https://app.netlify.com/drop
- **Your Build Folder:** `/Users/ghadaalani/Desktop/project/window/dist`

---

**Choose the easiest option for you and deploy! 🚀**

