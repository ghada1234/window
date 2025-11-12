# 📱 iOS Notifications Setup Guide

## Overview

This guide explains how notifications work on iOS devices (iPhone/iPad) and how to enable them for the Find Your Inner Peace wellness app.

## Important iOS Limitations

### Why Notifications Don't Work in Safari

iOS Safari has **strict limitations** for push notifications:

1. **FCM (Firebase Cloud Messaging) is NOT supported** on iOS Safari
2. **Web Push notifications require PWA installation** (iOS 16.4+)
3. **Notifications only work when the app is installed to the home screen**

### What We've Implemented

✅ **iOS Detection** - Automatically detects iPhone/iPad devices  
✅ **PWA Installation Prompts** - Guides users to install the app  
✅ **Local Notifications** - Works once app is installed as PWA  
✅ **Bilingual Instructions** - English and Arabic support  
✅ **Graceful Fallbacks** - Clear messaging about iOS requirements  

## How to Enable Notifications on iPhone

### Step 1: Install the App (Required!)

**On your iPhone in Safari:**

1. Open the app in Safari browser
2. Tap the **Share button** (⎗) at the bottom of Safari
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"** in the top right corner
5. The app icon will appear on your home screen

### Step 2: Enable Notifications

1. Open the app from your **home screen** (not Safari!)
2. When prompted, tap **"Enable Notifications"**
3. In the system popup, tap **"Allow"**
4. Done! You'll now receive wellness reminders

## iOS Version Requirements

| iOS Version | Notification Support |
|-------------|---------------------|
| iOS 16.4+ | ✅ Full support (PWA only) |
| iOS 16.0-16.3 | ⚠️ Limited support |
| iOS 15 and below | ❌ Not supported |

## Features That Work on iOS

### ✅ Working Features

- **Local Notifications** - Reminders set within the app
- **Scheduled Notifications** - Meditation and wellness reminders
- **Test Notifications** - Send test notifications to verify setup
- **Permission Management** - Enable/disable in iOS Settings

### ❌ Not Available on iOS

- **Firebase Cloud Messaging (FCM)** - iOS doesn't support FCM
- **Background Sync** - Limited by iOS PWA restrictions
- **Push from Server** - Requires native iOS app

## Technical Implementation

### Files Created

1. **`src/utils/iosNotifications.js`**
   - iOS device detection
   - PWA installation check
   - Permission handling
   - Local notification utilities

2. **`src/components/NotificationPrompt/NotificationPrompt.jsx`** (Updated)
   - iOS-specific installation instructions
   - Smart detection and prompts
   - Bilingual support

3. **`src/components/NotificationSettings/NotificationSettings.jsx`** (Updated)
   - iOS compatibility warnings
   - Hide FCM-specific features on iOS
   - iOS test notifications

### Key Functions

```javascript
// Detect iOS device
isIOS() // Returns true on iPhone/iPad

// Check if running as PWA
isIOSPWA() // Returns true if installed to home screen

// Request notification permission
requestIOSNotificationPermission() // iOS-safe permission request

// Show local notification
showIOSNotification(title, options) // Display notification

// Get installation instructions
getIOSInstallInstructions(language) // Get localized steps
```

## User Experience Flow

### Scenario 1: iPhone User in Safari Browser

1. User visits app in Safari
2. After 5 seconds, sees prompt: "Install app to enable notifications"
3. Clicks "Show Instructions"
4. Sees step-by-step guide to install PWA
5. User installs app to home screen
6. Opens app from home screen
7. Notification prompt appears
8. User enables notifications → Success! ✅

### Scenario 2: iPhone User with PWA Installed

1. User opens app from home screen (already installed)
2. After 5 seconds, sees prompt: "Enable Notifications"
3. Clicks "Enable"
4. iOS permission dialog appears
5. User taps "Allow" → Notifications enabled! ✅

### Scenario 3: Android/Desktop User

1. Standard notification flow
2. FCM token generated
3. Full push notification support
4. No installation required

## Troubleshooting

### Problem: "Notifications not showing on iPhone"

**Solution:**
- ✅ Ensure app is installed to home screen (not running in Safari)
- ✅ Check iOS version (16.4+ required)
- ✅ Verify permissions: Settings > [App Name] > Notifications
- ✅ Open app from home screen, not Safari

### Problem: "Enable Notifications button doesn't work"

**Solution:**
- If in Safari browser: Install app to home screen first
- If already installed: Check iOS Settings > Notifications
- Try: Settings > Safari > Clear History and Website Data (then reinstall)

### Problem: "Notification permission is blocked"

**Solution:**
1. Go to iPhone Settings
2. Scroll down to find your app
3. Tap "Notifications"
4. Enable "Allow Notifications"
5. Reopen the app

## Testing Notifications

### In the App

1. Go to **Notifications** page (bell icon in sidebar)
2. Click on **Push Notifications** tab
3. Click **"Send Test Notification"**
4. You should see a notification appear

### Expected Behavior

- **iOS Safari (browser):** Warning message to install PWA
- **iOS PWA (installed):** Test notification appears ✅
- **Android/Desktop:** Test notification appears ✅

## Developer Notes

### iOS Notification API

```javascript
// Check if notifications are supported
if ('Notification' in window) {
  // Request permission (iOS PWA only)
  const permission = await Notification.requestPermission()
  
  if (permission === 'granted') {
    // Create notification
    new Notification('Title', {
      body: 'Message',
      icon: '/icon.png',
      badge: '/badge.png'
    })
  }
}
```

### iOS PWA Detection

```javascript
// Method 1: navigator.standalone (Safari specific)
const isIOSPWA = window.navigator.standalone === true

// Method 2: display-mode media query
const isStandalone = window.matchMedia('(display-mode: standalone)').matches

// Combined check
const isInstalledPWA = isIOSPWA || isStandalone
```

## Deployment Checklist

- [x] iOS detection utility implemented
- [x] PWA manifest configured
- [x] iOS-specific meta tags in HTML
- [x] Installation instructions (EN/AR)
- [x] Notification prompt updated
- [x] Settings page updated
- [x] Local notification support
- [x] Permission handling
- [x] Test notification feature
- [x] Error messages and fallbacks

## Resources

- [Apple PWA Documentation](https://developer.apple.com/documentation/webkit/progressive_web_apps)
- [iOS Web Push Notifications](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)
- [iOS 16.4 Release Notes](https://developer.apple.com/documentation/safari-release-notes/safari-16_4-release-notes)

## Support

If notifications still don't work after following this guide:

1. Check iOS version (Settings > General > About)
2. Verify app is installed to home screen
3. Clear Safari cache and reinstall
4. Contact support with device details

---

**Last Updated:** November 10, 2025  
**iOS Support:** iOS 16.4+  
**Tested On:** iPhone 12, iPhone 14 Pro, iPad Air

