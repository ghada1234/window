# 🔄 Transfer Domain to Current Project

## Your Current Deployment
**URL:** https://window-7lpe-l3yb6z8s7-ghada-rabees-projects.vercel.app  
**Domain to Add:** find-your-inner-peace.com

---

## ✅ Step-by-Step Domain Transfer

### Method 1: Vercel Dashboard (Easiest)

**Step 1: Find the Old Project**

1. Go to: https://vercel.com/ghada-rabees-projects
2. Look for projects that might have `find-your-inner-peace.com`
3. Common names: "find-your-inner-peace", "wellness-app", "inner-peace", etc.

**Step 2: Remove Domain from Old Project**

1. Click on the OLD project
2. Go to **Settings** → **Domains**
3. Find `find-your-inner-peace.com`
4. Click the **3 dots (⋮)** next to the domain
5. Click **"Remove Domain"**
6. Confirm removal

**Step 3: Add Domain to Current Project**

1. Go to: https://vercel.com/ghada-rabees-projects/window/settings/domains
2. Click **"Add Domain"** button
3. Type: `find-your-inner-peace.com`
4. Click **"Add"**
5. Vercel will configure DNS automatically

**Step 4: Add www Subdomain (Optional)**

1. Click **"Add Domain"** again
2. Type: `www.find-your-inner-peace.com`
3. Click **"Add"**
4. Vercel will redirect www → main domain

---

## 🎯 Alternative: Let Vercel Transfer It

If you can't find the old project:

1. Go to: https://vercel.com/ghada-rabees-projects/window/settings/domains
2. Click **"Add Domain"**
3. Enter: `find-your-inner-peace.com`
4. Vercel will say: "Domain is assigned to another project"
5. Look for **"Transfer"** or **"Remove from other project"** button
6. Click it
7. Confirm the transfer
8. Done!

---

## 🔍 Find Which Project Has Your Domain

### Option 1: Check All Projects

Visit each project and check Settings → Domains:
- https://vercel.com/ghada-rabees-projects

### Option 2: Via CLI

```bash
# List all your projects
vercel projects ls

# For each project, check its domains
# You'll need to go to the dashboard or check each one
```

---

## ⚡ Quick Commands Reference

```bash
# Go to your current project
cd /Users/ghadaalani/Desktop/project/window

# List current deployments
vercel ls

# Check domain status
vercel domains ls

# Deploy again (uses current domain setup)
vercel --prod

# View project in browser
vercel open
```

---

## 🌐 What Your URLs Will Be

### After Domain is Added

**Primary Domain:**
```
https://find-your-inner-peace.com
```

**With www:**
```
https://www.find-your-inner-peace.com
→ Redirects to: https://find-your-inner-peace.com
```

**Vercel URLs (still work):**
```
https://window-7lpe-l3yb6z8s7-ghada-rabees-projects.vercel.app
https://window-jxcb9bhov-ghada-rabees-projects.vercel.app
```

All URLs point to the same app!

---

## 📋 Checklist

- [ ] Find old project with domain
- [ ] Remove domain from old project
- [ ] Add domain to "window" project
- [ ] Wait for DNS propagation (5-60 min)
- [ ] Test https://find-your-inner-peace.com
- [ ] Verify HTTPS certificate works
- [ ] Add www subdomain (optional)
- [ ] Update Firebase authorized domains
- [ ] Share new domain with users!

---

## 🎯 Exact Steps for Vercel Dashboard

**1. Remove from Old Project:**

```
Vercel Dashboard
  → Your Projects
  → [Find the old project]
  → Settings
  → Domains
  → find-your-inner-peace.com
  → ⋮ (three dots)
  → Remove Domain
  → Confirm
```

**2. Add to Window Project:**

```
https://vercel.com/ghada-rabees-projects/window/settings/domains
  → Add Domain
  → Type: find-your-inner-peace.com
  → Add
  → Wait for DNS
  → Done! ✅
```

---

## 🔐 SSL Certificate

Vercel automatically provides:
- ✅ Free Let's Encrypt SSL
- ✅ Auto-renewal (never expires)
- ✅ HTTPS enforced
- ✅ Secure connection
- ✅ Valid certificate
- ✅ No configuration needed

Certificate usually ready in: **1-10 minutes**

---

## 📱 Update iOS Instructions

After domain is active, update the iOS PWA installation URL:

**Old:**
```
https://window-xxx.vercel.app
```

**New:**
```
https://find-your-inner-peace.com
```

Much cleaner and easier to remember!

---

## 🎉 Benefits of Custom Domain

1. **Professional:** Looks more trustworthy
2. **Memorable:** Easy for users to remember
3. **Branding:** Builds your brand identity
4. **SEO:** Better for search engines
5. **Marketing:** Easier to share and promote

---

## ⏱️ Timeline

**Immediate (0-5 min):**
- Add domain in Vercel dashboard

**Short (5-60 min):**
- DNS propagation
- SSL certificate generation

**Complete (1 hour):**
- Domain fully active
- HTTPS working
- Ready to share!

---

## 📞 Need Help?

**If domain won't transfer:**
- Email Vercel support: support@vercel.com
- Or use live chat in Vercel dashboard
- They can manually transfer it

**Vercel Support is usually very fast (< 1 hour response)**

---

## 🚀 After Setup

Once your domain is live:

1. **Test everything:**
   - https://find-your-inner-peace.com
   - Sign up → See free trial
   - Search food → See AI results
   - Complete profile → See personalized goals
   - iPhone → Install PWA

2. **Share with users:**
   - Social media
   - Email
   - Word of mouth

3. **Monitor:**
   - Check analytics
   - Track sign-ups
   - Monitor trial conversions

---

**Your app is ready to go live on:**
**🌐 https://find-your-inner-peace.com**

**Just add the domain in Vercel dashboard!** ⚡

