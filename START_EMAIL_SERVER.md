# 📧 Email Server Setup - IMPORTANT

## ⚠️ Email Server Required

To send emails via Resend, you need to run the **backend email server**.

---

## 🚀 Quick Start

### Option 1: Run Both (Recommended)
```bash
npm run dev:full
```
This starts:
- Frontend (Vite) on `http://localhost:5173`
- Email API server on `http://localhost:3001`

### Option 2: Run Separately
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Email Server
npm run server
```

---

## ✅ Verify Email Server is Running

You should see:
```
✅ Email API Server running on http://localhost:3001
📧 Resend API configured: Yes
📤 From email: onboarding@resend.dev
```

Test: Open `http://localhost:3001/health` - should show `{"status":"ok"}`

---

## 🧪 Test Emails

Once both servers are running:

1. **Sign up** with real email
2. ✅ Welcome email sent!

Or:

1. Go to **Notifications**
2. Click "Send via Email"
3. ✅ Email sent via Resend!

---

## 🔧 Files Created

- `server.js` - Backend email API
- `.env.server` - Server environment variables
- Updated `package.json` - Added server scripts

---

## 📝 Environment Variables

### Frontend (.env)
```
VITE_RESEND_API_KEY=re_BzqzbHkb_NpdFfyjvzySqWPWMjRf1n4Fw
VITE_API_URL=http://localhost:3001
```

### Backend (.env.server)
```
RESEND_API_KEY=re_BzqzbHkb_NpdFfyjvzySqWPWMjRf1n4Fw
RESEND_FROM_EMAIL=onboarding@resend.dev
PORT=3001
```

---

## ❌ Common Errors

### "Failed to fetch"
**Cause**: Email server not running
**Fix**: Run `npm run server` in separate terminal

### "CORS error"
**Cause**: Server not configured properly
**Fix**: Server already has CORS enabled

### "Resend API error"
**Cause**: Invalid API key
**Fix**: Check RESEND_API_KEY in .env.server

---

## 🚀 Production Deployment

For Vercel/Netlify:
1. Deploy backend separately (Railway, Render, etc.)
2. Update `VITE_API_URL` to your backend URL
3. Set environment variables on hosting platform

---

## 💡 Quick Test

```bash
# Start everything
npm run dev:full

# Wait for both servers to start
# Then test signup with real email
# ✅ Welcome email should arrive!
```
