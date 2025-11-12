#!/bin/bash

echo "🔧 Setting up Resend Email Service..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    touch .env
fi

# Prompt for Resend API key
echo "📧 Please enter your Resend API key (starts with re_):"
read -r RESEND_KEY

if [ -z "$RESEND_KEY" ]; then
    echo "❌ No API key provided. Exiting..."
    exit 1
fi

# Check if keys already exist in .env
if grep -q "RESEND_API_KEY=" .env; then
    echo "⚠️  Resend keys already exist in .env"
    echo "Would you like to update them? (y/n)"
    read -r UPDATE
    if [ "$UPDATE" != "y" ]; then
        echo "Keeping existing keys..."
    else
        # Remove old keys
        sed -i '' '/RESEND_API_KEY=/d' .env
        sed -i '' '/RESEND_FROM_EMAIL=/d' .env
        sed -i '' '/VITE_RESEND_API_KEY=/d' .env
        sed -i '' '/VITE_RESEND_FROM_EMAIL=/d' .env
        sed -i '' '/VITE_API_URL=/d' .env
    fi
fi

# Add Resend configuration
echo "" >> .env
echo "# Resend Email Service (Backend - no VITE_ prefix)" >> .env
echo "RESEND_API_KEY=$RESEND_KEY" >> .env
echo "RESEND_FROM_EMAIL=onboarding@resend.dev" >> .env
echo "" >> .env
echo "# Resend Email Service (Frontend - with VITE_ prefix)" >> .env
echo "VITE_RESEND_API_KEY=$RESEND_KEY" >> .env
echo "VITE_RESEND_FROM_EMAIL=onboarding@resend.dev" >> .env
echo "VITE_API_URL=http://localhost:3001" >> .env

echo ""
echo "✅ Resend configuration added to .env"
echo ""
echo "📧 Starting email server..."
echo ""

# Kill any existing node servers on port 3001
lsof -ti:3001 | xargs kill -9 2>/dev/null

# Start the server
node server.js &
SERVER_PID=$!

sleep 2

# Check if server is running
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Email server is running on http://localhost:3001"
    echo "   Server PID: $SERVER_PID"
    echo ""
    echo "🎉 Setup complete! You can now:"
    echo "   1. Keep this terminal open (server is running)"
    echo "   2. Open your app and test email notifications"
    echo "   3. Go to Profile → Send Test Email"
    echo ""
    echo "To stop the server later, run: kill $SERVER_PID"
else
    echo "❌ Server failed to start. Please check your Resend API key."
    echo ""
    echo "Debug info:"
    echo "- Check server.js for errors"
    echo "- Verify your API key at: https://resend.com/api-keys"
    exit 1
fi

