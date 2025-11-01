# Gemini AI Setup Guide

This application uses Google Gemini AI for food photo analysis and nutrition label scanning.

## Getting Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## Setting Up the API Key

1. Create a `.env` file in the root directory of the project (same level as `package.json`)
2. Add the following line to the `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Replace `your_actual_api_key_here` with your actual API key from Google AI Studio
4. Save the file
5. Restart the development server:
   ```bash
   npm run dev
   ```

## Features

Once configured, you can:
- **Upload food photos**: Take or upload a photo of your food to get instant AI-powered nutritional analysis
- **Scan nutrition labels**: Upload a photo of a nutrition label to extract all nutritional information automatically

## Security Note

⚠️ **Never commit your `.env` file to version control!** It's already in `.gitignore` by default, but always double-check that your API key is not exposed in your repository.

## Troubleshooting

- **"Gemini API key not configured"**: Make sure your `.env` file exists and has the correct variable name `VITE_GEMINI_API_KEY`
- **"Failed to analyze image"**: Check your API key is valid and you have internet connection
- **Rate limits**: Google Gemini API has rate limits. If you hit them, wait a few minutes before trying again


