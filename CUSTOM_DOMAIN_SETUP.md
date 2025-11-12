# 🌐 Custom Domain Setup Guide

## Your Domain
**Domain:** find-your-inner-peace.com  
**Registrar:** Vercel  
**Expiration:** October 20, 2026  
**Status:** ✅ Active

---

## ⚠️ Current Issue

The domain `find-your-inner-peace.com` is **already assigned to another project**.

---

## 🔧 Solution: Reassign Domain

### Option 1: Via Vercel Dashboard (Recommended)

**Step 1: Go to Vercel Dashboard**
1. Visit: https://vercel.com/ghada-rabees-projects
2. Find the OLD project that has `find-your-inner-peace.com`
3. Go to Settings → Domains
4. Remove the domain

**Step 2: Assign to New Project**
1. Go to: https://vercel.com/ghada-rabees-projects/window
2. Click Settings → Domains
3. Click "Add Domain"
4. Enter: `find-your-inner-peace.com`
5. Click "Add"

**Step 3: Add www Subdomain (Optional)**
1. Also add: `www.find-your-inner-peace.com`
2. Vercel will redirect www → main domain automatically

### Option 2: Via CLI

**Step 1: Find Current Project**
```bash
vercel projects ls
```

**Step 2: Remove from Old Project**
```bash
# Go to old project directory
cd /path/to/old/project

# Remove domain
vercel domains rm find-your-inner-peace.com
```

**Step 3: Add to New Project**
```bash
# Go to new project (window)
cd /Users/ghadaalani/Desktop/project/window

# Add domain
vercel domains add find-your-inner-peace.com
```

---

## 🎯 Quick Fix (Easiest Method)

1. **Open Vercel Dashboard:** https://vercel.com/ghada-rabees-projects/window/settings/domains

2. **Click "Add Domain"**

3. **Enter:** `find-your-inner-peace.com`

4. **Click "Add"**

5. **If domain is on another project:**
   - Vercel will ask: "Transfer domain to this project?"
   - Click "Transfer" or "Yes"
   - Domain will be reassigned automatically!

6. **Done!** Your app will be live at:
   - https://find-your-inner-peace.com
   - https://www.find-your-inner-peace.com

---

## 🚀 After Domain is Added

### DNS Propagation

**Time:** Usually 5-60 minutes (can take up to 24 hours)

**Check Status:**
```bash
# Check if domain is working
curl -I https://find-your-inner-peace.com

# Or open in browser
open https://find-your-inner-peace.com
```

### SSL Certificate

Vercel automatically provides:
- ✅ Free SSL certificate (HTTPS)
- ✅ Auto-renewal
- ✅ Secure connection
- ✅ No configuration needed

---

## 🔍 Verify Domain Setup

### Check Current Deployment

```bash
vercel ls
```

Should show:
```
window
├─ Production: find-your-inner-peace.com
├─ Vercel URL: window-xxx.vercel.app
└─ Status: Ready
```

### Test Domain

**After DNS propagation:**
1. Visit: https://find-your-inner-peace.com
2. Should show your wellness app
3. All features should work
4. SSL should be active (padlock icon)

---

## 📱 Update Links

### After Domain is Active

Update these:
1. **iOS Installation:** Tell users to visit `find-your-inner-peace.com`
2. **Email Links:** Update to use custom domain
3. **Social Media:** Share custom domain
4. **Documentation:** Update any hardcoded URLs

### Firebase Configuration (If Needed)

If using Firebase Auth with custom domain:
1. Go to Firebase Console
2. Authentication → Settings
3. Authorized Domains → Add `find-your-inner-peace.com`

---

## 🎨 Branding URLs

Once domain is active, your URLs will be:

**Main Pages:**
- https://find-your-inner-peace.com (Landing)
- https://find-your-inner-peace.com/dashboard
- https://find-your-inner-peace.com/body/nutrition
- https://find-your-inner-peace.com/subscription

**Auth Pages:**
- https://find-your-inner-peace.com/landing
- Sign in/up via modals

**Much cleaner than:**
- ~~https://window-xxx.vercel.app~~

---

## 🔄 Current Deployment URLs

**While waiting for custom domain:**

**Primary:**
- https://window-jxcb9bhov-ghada-rabees-projects.vercel.app

**All Vercel URLs will continue to work even after custom domain is added.**

---

## 📊 Domain Management

### Via Vercel Dashboard

**View Domains:**
https://vercel.com/ghada-rabees-projects/window/settings/domains

**Manage DNS:**
https://vercel.com/ghada-rabees-projects/domains/find-your-inner-peace.com

### Via CLI

```bash
# List all domains
vercel domains ls

# Add domain to project
vercel domains add find-your-inner-peace.com

# Remove domain from project  
vercel domains rm find-your-inner-peace.com

# Inspect domain
vercel domains inspect find-your-inner-peace.com
```

---

## ⚡ Quick Setup Steps

**Do this now:**

1. **Open:** https://vercel.com/ghada-rabees-projects/window/settings/domains

2. **Click:** "Add Domain"

3. **Enter:** `find-your-inner-peace.com`

4. **Click:** Add (or Transfer if asked)

5. **Wait:** 5-60 minutes for DNS

6. **Visit:** https://find-your-inner-peace.com

7. **Done!** 🎉

---

## 🎯 After Domain is Live

### Update Environment

You may want to update any hardcoded URLs:

```env
# .env
VITE_APP_URL=https://find-your-inner-peace.com
```

### Update Documentation

Replace Vercel URLs with:
- `https://find-your-inner-peace.com`

### Share With Users

Your app is now at a professional domain:
- ✅ Easy to remember
- ✅ Professional branding
- ✅ SSL secured
- ✅ SEO friendly

---

## 🆘 Troubleshooting

### Domain Not Working After 1 Hour?

**Check:**
1. DNS propagation status: https://dnschecker.org
2. Vercel deployment logs: `vercel logs --prod`
3. Domain configuration in Vercel dashboard

**Common Issues:**
- DNS still propagating (wait 24h max)
- Domain on wrong project (transfer it)
- SSL certificate generating (automatic, wait 10 min)

### "Domain Already Assigned" Error

**Solution:**
1. Go to Vercel dashboard
2. Find the old project with this domain
3. Remove domain from old project
4. Add domain to "window" project
5. Or use "Transfer" option when adding

---

## 📧 Contact Support

If issues persist:
- Vercel Support: https://vercel.com/support
- Check deployment logs
- Verify domain ownership

---

## ✅ Success Indicators

Domain is ready when:
- ✅ https://find-your-inner-peace.com loads your app
- ✅ HTTPS (padlock) shows in browser
- ✅ All pages work correctly
- ✅ No certificate warnings
- ✅ Fast loading times

---

**Your custom domain is ready to use!**  
**Just add it via Vercel dashboard in 2 clicks!** 🚀

