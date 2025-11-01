import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { setJSON } from '../utils/storage'
import './PaymentSuccess.css'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Activate monthly subscription
    const subscription = {
      plan: 'monthly',
      status: 'active',
      subscribedAt: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 25.67,
      currency: 'AED',
      paymentMethod: 'ziina',
      autoRenew: true
    }
    
    setJSON('subscription', subscription)

    // Countdown redirect
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div className="payment-success-page">
      <div className="success-card">
        <div className="success-icon">
          <CheckCircle size={80} color="#10b981" />
        </div>
        
        <h1>Payment Successful! 🎉</h1>
        <p className="success-subtitle">Welcome to Find Your Inner Peace Premium</p>

        <div className="success-details">
          <div className="detail-row">
            <span>Plan</span>
            <strong>Monthly Subscription</strong>
          </div>
          <div className="detail-row">
            <span>Amount Paid</span>
            <strong>25.67 AED</strong>
          </div>
          <div className="detail-row">
            <span>Next Billing</span>
            <strong>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AE', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
          </div>
          <div className="detail-row">
            <span>Payment Method</span>
            <strong>Ziina</strong>
          </div>
        </div>

        <div className="premium-benefits">
          <h3>You now have access to:</h3>
          <ul>
            <li>✨ Unlimited AI wellness insights</li>
            <li>🍎 Advanced nutrition analysis</li>
            <li>📧 Email notifications</li>
            <li>📊 Advanced analytics & reports</li>
            <li>💎 Priority support</li>
          </ul>
        </div>

        <div className="redirect-notice">
          <p>Redirecting to dashboard in <strong>{countdown}</strong> seconds...</p>
        </div>

        <button 
          className="btn-continue"
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard Now
          <ArrowRight size={20} />
        </button>

        <button 
          className="btn-subscription"
          onClick={() => navigate('/subscription')}
        >
          View Subscription Details
        </button>
      </div>
    </div>
  )
}

export default PaymentSuccess

