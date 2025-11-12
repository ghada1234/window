# 🤖 Gemini API Setup Instructions

## Your Gemini API Keys

You have two Gemini API keys available:

1. **Nutrition Key:** `AIzaSyBdkHYvL7WgmNM_sjvSe7SycQj8DT4ezBA`
2. **Alternative Key:** `AIzaSyBvQp3u6iUZYy8-gdCTJFnqOsY1MkmrF-k`

## How to Add Your API Key

### Step 1: Create .env File

In your project root directory (`/Users/ghadaalani/Desktop/project/window/`), create a file named `.env`:

```bash
# In your terminal:
cd /Users/ghadaalani/Desktop/project/window
touch .env
```

### Step 2: Add Your API Key

Open the `.env` file and add:

```env
VITE_GEMINI_API_KEY=AIzaSyBdkHYvL7WgmNM_sjvSe7SycQj8DT4ezBA
```

**Or use the alternative key:**

```env
VITE_GEMINI_API_KEY=AIzaSyBvQp3u6iUZYy8-gdCTJFnqOsY1MkmrF-k
```

### Step 3: Restart Development Server

If your development server is running, restart it:

```bash
# Press Ctrl+C to stop the server, then:
npm run dev
```

## What Features Use Gemini API?

Your wellness app uses Gemini AI for:

### 1. 📸 **Food Image Analysis**
- Take a photo of your meal
- AI automatically detects food items
- Provides nutritional information (calories, protein, carbs, fat, etc.)

### 2. 🏷️ **Nutrition Label Scanner**
- Scan nutrition labels with your camera
- AI extracts exact nutritional values
- Automatically logs to your nutrition tracker

### 3. 💬 **AI Wellness Chat**
- Ask questions about your wellness journey
- Get personalized recommendations
- AI analyzes your activity, sleep, mood data

### 4. 📊 **Wellness Insights**
- AI generates personalized insights from your data
- Identifies correlations (e.g., sleep ↔ mood)
- Provides predictions and recommendations

### 5. 🍎 **Food Suggestions**
- AI-powered food search
- Smart autocomplete
- Contextual food recommendations

## Testing the API

### Test 1: Nutrition Image Analysis

1. Go to **Nutrition** page in your app
2. Click **"Scan Food"** or **"Upload Image"**
3. Take/upload a photo of food
4. AI should analyze and return nutritional info

### Test 2: AI Chat

1. Go to **AI Wellness Hub**
2. Type a question like: "How can I improve my sleep?"
3. AI should respond with personalized advice

### Test 3: Check Configuration

In your browser console (F12 → Console):

```javascript
// Check if API key is loaded
console.log('Gemini configured:', !!import.meta.env.VITE_GEMINI_API_KEY)
```

## Troubleshooting

### ❌ "Gemini API key not configured"

**Solution:**
1. Verify `.env` file exists in project root
2. Ensure the variable name is exactly: `VITE_GEMINI_API_KEY`
3. No spaces around the `=` sign
4. Restart the development server

### ❌ "Failed to analyze image"

**Possible causes:**
1. API key is invalid or expired
2. API quota exceeded
3. Network connection issues

**Solution:**
1. Try the alternative API key
2. Check API key permissions at [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Verify API is enabled for Gemini 2.5 Flash

### ❌ "Model not found"

**Solution:**
- The app uses `gemini-2.5-flash` and `gemini-2.5-flash-preview-05-20`
- Make sure these models are enabled for your API key
- Go to [Google AI Studio](https://aistudio.google.com/)

## API Key Management

### Security Best Practices

✅ **DO:**
- Keep API keys in `.env` file (already in `.gitignore`)
- Use different keys for development and production
- Set up API key restrictions in Google Cloud Console

❌ **DON'T:**
- Commit `.env` file to Git
- Share API keys publicly
- Hardcode keys in source code

### For Production Deployment

When deploying to Vercel/Netlify, add the environment variable:

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add: `VITE_GEMINI_API_KEY` = `your_api_key`
3. Redeploy

**Netlify:**
1. Site Settings → Environment Variables
2. Add: `VITE_GEMINI_API_KEY` = `your_api_key`
3. Trigger new deploy

## API Quota & Limits

### Gemini 2.5 Flash (Free Tier)

- **Requests per minute:** 15
- **Requests per day:** 1,500
- **Tokens per minute:** 1 million

### If You Exceed Limits

The app will gracefully fallback to:
- Manual nutrition entry
- Basic food database search
- Generic wellness recommendations

## Monitoring Usage

Check your API usage:
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click on your API key
3. View usage statistics

## API Models Used

Your app uses these Gemini models:

1. **gemini-2.5-flash** (primary)
   - Fast, efficient
   - Supports text + images
   - Best for nutrition analysis

2. **gemini-2.5-flash-preview-05-20** (fallback)
   - Preview version
   - Used if primary model fails

## Getting New API Keys

If you need additional API keys:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"**
3. Select your Google Cloud project
4. Copy the new key
5. Update your `.env` file

## Support

If you continue to have issues:

1. Check the browser console for detailed error messages
2. Verify API key is active at Google AI Studio
3. Test API key with a simple curl command:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

---

**Last Updated:** November 10, 2025  
**API Version:** Gemini 2.5 Flash  
**Status:** Ready to use

