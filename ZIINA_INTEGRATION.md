# Ziina Payment Integration Guide

## Overview
This app now includes a subscription system with **Ziina payment gateway** (UAE) for 25.67 AED/month.

---

## 🎯 Current Setup

### Subscription Plans
- **Free Plan**: 0 AED - Basic features
- **Premium Plan**: 25.67 AED/month - Full access

### Features Available
- ✅ Subscription management page (`/subscription`)
- ✅ Plan comparison UI
- ✅ Payment modal
- ✅ Subscription status tracking
- ⚠️ **Demo mode** - Real payment integration needed

---

## 🔧 How to Integrate Real Ziina Payments

### Step 1: Get Ziina API Credentials

1. **Sign up at Ziina**
   - Go to: https://ziina.com/business
   - Create a business account
   - Complete KYC verification

2. **Get API Keys**
   - Login to Ziina dashboard
   - Navigate to **Settings → API Keys**
   - Copy your:
     - API Key (Production)
     - API Secret (Production)
     - Webhook Secret

3. **Add to `.env` file**
```bash
# Ziina Payment Gateway
VITE_ZIINA_API_KEY=your_api_key_here
VITE_ZIINA_SECRET=your_api_secret_here
VITE_ZIINA_WEBHOOK_SECRET=your_webhook_secret_here
```

---

### Step 2: Backend Setup (Required)

**⚠️ Important**: Payment processing must be done server-side for security.

Create a backend API (Node.js example):

```javascript
// backend/routes/payment.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const ZIINA_API_URL = 'https://api.ziina.com/v1';
const ZIINA_API_KEY = process.env.ZIINA_API_KEY;

// Create payment link
router.post('/create-payment', async (req, res) => {
  try {
    const { amount, currency, customerId, plan } = req.body;

    const response = await axios.post(
      `${ZIINA_API_URL}/payment-links`,
      {
        amount: amount,
        currency: currency,
        description: `Premium Subscription - ${plan}`,
        customer_reference: customerId,
        redirect_url: `${process.env.APP_URL}/subscription/success`,
        cancel_url: `${process.env.APP_URL}/subscription`,
        metadata: {
          plan: plan,
          type: 'subscription'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${ZIINA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      paymentUrl: response.data.payment_url,
      paymentId: response.data.id
    });
  } catch (error) {
    console.error('Ziina payment error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Webhook to handle payment confirmation
router.post('/webhook/ziina', async (req, res) => {
  const signature = req.headers['x-ziina-signature'];
  
  // Verify webhook signature
  const isValid = verifyZiinaSignature(req.body, signature);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { event, data } = req.body;

  if (event === 'payment.success') {
    // Update user subscription in database
    const { customer_reference, metadata } = data;
    
    // TODO: Update user subscription status
    // await updateUserSubscription(customer_reference, metadata.plan);
    
    console.log(`Payment successful for customer: ${customer_reference}`);
  }

  res.json({ received: true });
});

module.exports = router;
```

---

### Step 3: Update Frontend (`Subscription.jsx`)

Replace the demo payment logic with real API call:

```javascript
const handleZiinaPayment = async () => {
  setIsProcessing(true)
  setError('')
  
  try {
    // Call your backend to create Ziina payment link
    const response = await fetch('/api/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 25.67,
        currency: 'AED',
        plan: 'premium',
        customerId: getCurrentUserId() // Get from auth context
      })
    })
    
    const { success, paymentUrl, error } = await response.json()
    
    if (success) {
      // Redirect to Ziina payment page
      window.location.href = paymentUrl
    } else {
      setError(error || 'Payment failed. Please try again.')
    }
    
  } catch (err) {
    setError('Payment failed. Please try again.')
    console.error('Payment error:', err)
  } finally {
    setIsProcessing(false)
  }
}
```

---

### Step 4: Success/Cancel Pages

Create payment result pages:

**Success Page** (`/subscription/success`):
```jsx
// src/components/SubscriptionSuccess.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

const SubscriptionSuccess = () => {
  const navigate = useNavigate()
  
  useEffect(() => {
    // Verify payment status with backend
    verifyPaymentStatus()
    
    // Redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard')
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="payment-result">
      <CheckCircle size={64} color="#10b981" />
      <h1>Welcome to Premium! 🎉</h1>
      <p>Your subscription is now active.</p>
    </div>
  )
}
```

---

### Step 5: Webhook Configuration

1. **In Ziina Dashboard**:
   - Go to **Settings → Webhooks**
   - Add webhook URL: `https://yourdomain.com/api/webhook/ziina`
   - Select events: `payment.success`, `payment.failed`

2. **Verify webhook signature** (security):
```javascript
const crypto = require('crypto');

function verifyZiinaSignature(payload, signature) {
  const hash = crypto
    .createHmac('sha256', process.env.ZIINA_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return hash === signature;
}
```

---

## 📋 Testing

### Test Mode
1. Use Ziina test API keys
2. Test card: `4111 1111 1111 1111`
3. Any future expiry date
4. Any CVV

### Production Mode
1. Switch to production API keys
2. Complete Ziina business verification
3. Test with real small amount
4. Set up monitoring

---

## 🔐 Security Checklist

- ✅ Never expose API keys in frontend
- ✅ Always process payments server-side
- ✅ Verify webhook signatures
- ✅ Use HTTPS in production
- ✅ Validate all inputs
- ✅ Log payment attempts
- ✅ Handle errors gracefully
- ✅ PCI compliance (Ziina handles this)

---

## 💡 Additional Features to Add

### 1. Subscription Management
- Cancel subscription
- View billing history
- Update payment method
- Download invoices

### 2. Email Notifications
- Payment successful
- Payment failed
- Subscription renewal reminder
- Subscription cancelled

### 3. Analytics
- Track conversion rate
- Monitor failed payments
- Subscription churn rate

---

## 📞 Support

### Ziina Resources
- Documentation: https://docs.ziina.com
- Dashboard: https://dashboard.ziina.com
- Support: support@ziina.com

### Implementation Help
If you need help implementing real Ziina payments, you'll need:
1. Backend server (Node.js, Python, PHP, etc.)
2. Database to store subscription status
3. Webhook endpoint for payment confirmations

---

## 🚀 Current Demo Features

The app currently includes:
- ✅ Beautiful subscription UI
- ✅ Free vs Premium comparison
- ✅ Payment modal with Ziina branding
- ✅ Subscription status tracking (local)
- ✅ Plan switching

**To enable real payments**: Follow steps above to integrate Ziina API.

