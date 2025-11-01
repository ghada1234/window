import { useState, useEffect } from 'react'
import { Check, X, CreditCard, Shield, Zap, Crown, AlertCircle } from 'lucide-react'
import { getJSON, setJSON } from '../utils/storage'
import './Subscription.css'

const Subscription = () => {
  const [currentPlan, setCurrentPlan] = useState('free')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // Load current subscription status
    const subscription = getJSON('subscription', { plan: 'none', status: 'inactive' })
    setCurrentPlan(subscription.plan)
  }, [])

  const plans = {
    monthly: {
      name: 'Monthly Subscription',
      price: '25.67',
      currency: 'AED',
      period: 'month',
      features: [
        'Unlimited AI wellness insights',
        'Advanced nutrition analysis with AI',
        'AI food photo analyzer',
        'Nutrition label scanner',
        'Personalized meal recommendations',
        'Email notifications & reminders',
        'Advanced analytics & reports',
        'Priority support',
        'Export data feature',
        'Custom goals & habits tracker',
        'Sleep quality analysis',
        'Mood pattern insights',
        'Guided meditation sessions',
        'Journal & emotion tracking',
        'Community access',
        'WhatsApp group features',
        'Offline PWA access'
      ],
      limitations: [],
      badge: 'Full Access',
      color: '#6366f1',
      popular: true
    }
  }

  const handleSubscribe = async (planType) => {
    // Show payment modal for subscription
    setShowPaymentModal(true)
  }

  const handleZiinaPayment = () => {
    // Redirect to your actual Ziina payment link
    const ziinaPaymentUrl = 'https://pay.ziina.com/FindYourInnerPe/r-Kv6hmpJ'
    
    // Open in new tab
    window.open(ziinaPaymentUrl, '_blank')
    
    // Show message to user
    setShowPaymentModal(false)
    setSuccess('✅ Payment window opened! Complete your payment in the new tab. Once done, refresh this page.')
    
    // Note: In production, you would:
    // 1. Generate a unique payment link per user/transaction
    // 2. Use webhooks to verify payment completion
    // 3. Automatically update subscription status
  }

  return (
    <div className="subscription-page">
      <header className="page-header">
        <Crown size={32} color="#6366f1" />
        <div>
          <h1>Monthly Subscription</h1>
          <p>Full access to all wellness features for 25.67 AED/month</p>
        </div>
      </header>

      {success && (
        <div className="success-banner">
          <Check size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="subscription-content">
        <div className="plans-grid">
          {Object.entries(plans).map(([key, plan]) => (
            <div 
              key={key} 
              className={`plan-card ${plan.popular ? 'popular' : ''} ${currentPlan === key ? 'current' : ''}`}
              style={{ borderColor: currentPlan === key ? plan.color : '#e5e7eb' }}
            >
              {plan.badge && (
                <div className="plan-badge" style={{ background: plan.color }}>
                  {plan.badge}
                </div>
              )}
              
              {currentPlan === key && (
                <div className="current-plan-badge">
                  <Check size={16} />
                  Current Plan
                </div>
              )}

              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="currency">{plan.currency}</span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">/{plan.period}</span>
                </div>
              </div>

              <div className="plan-features">
                <h4>What's included:</h4>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index} className="feature-included">
                      <Check size={18} color={plan.color} />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="feature-excluded">
                      <X size={18} color="#9ca3af" />
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`plan-button ${currentPlan === 'monthly' ? 'current-plan-btn' : ''}`}
                style={{ 
                  background: currentPlan === 'monthly' ? '#10b981' : plan.color,
                  opacity: currentPlan === 'monthly' ? 0.7 : 1
                }}
                onClick={() => handleSubscribe(key)}
                disabled={currentPlan === 'monthly'}
              >
                {currentPlan === 'monthly' ? (
                  <>
                    <Check size={20} />
                    Active Subscription
                  </>
                ) : (
                  <>
                    <Crown size={20} />
                    Subscribe Now
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Security Info */}
        <div className="payment-security">
          <Shield size={24} color="#10b981" />
          <div>
            <h4>Secure Payment with Ziina</h4>
            <p>Your payment is processed securely through Ziina, a trusted UAE payment gateway. All transactions are encrypted and protected.</p>
          </div>
        </div>

        {/* Subscription Info */}
        <div className="subscription-info-card">
          <h3>💎 Why Subscribe?</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon">🤖</div>
              <h4>AI-Powered Features</h4>
              <p>Get personalized wellness insights, nutrition analysis from photos, and smart recommendations</p>
            </div>
            <div className="info-item">
              <div className="info-icon">📊</div>
              <h4>Advanced Analytics</h4>
              <p>Track your progress with detailed reports, charts, and trend analysis</p>
            </div>
            <div className="info-item">
              <div className="info-icon">📧</div>
              <h4>Email Reminders</h4>
              <p>Never miss a wellness goal with automated email notifications and reminders</p>
            </div>
            <div className="info-item">
              <div className="info-icon">🧘</div>
              <h4>Complete Wellness Suite</h4>
              <p>Access all features: meditation, nutrition, sleep, mood, journal, and more</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="subscription-faq">
          <h3>Frequently Asked Questions</h3>
          
          <div className="faq-item">
            <h4>Can I cancel anytime?</h4>
            <p>Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
          </div>

          <div className="faq-item">
            <h4>What payment methods do you accept?</h4>
            <p>We accept all major credit/debit cards and digital wallets through Ziina payment gateway (UAE-based).</p>
          </div>

          <div className="faq-item">
            <h4>Will I be charged automatically?</h4>
            <p>Yes, your subscription will auto-renew every month for 25.67 AED. You'll receive a reminder 3 days before each billing date.</p>
          </div>

          <div className="faq-item">
            <h4>What happens if I don't subscribe?</h4>
            <p>The app requires an active subscription to access all wellness features. Subscribe now to start your journey!</p>
          </div>

          <div className="faq-item">
            <h4>Is my payment secure?</h4>
            <p>Absolutely! All payments are processed through Ziina, a trusted UAE payment gateway with bank-level encryption.</p>
          </div>
        </div>
      </div>

      {/* Ziina Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPaymentModal(false)}>
              <X size={24} />
            </button>
            
            <div className="payment-modal-header">
              <CreditCard size={48} color="#6366f1" />
              <h2>Complete Your Subscription</h2>
              <p>Secure payment powered by Ziina</p>
            </div>

            <div className="payment-summary">
              <div className="summary-row">
                <span>Monthly Subscription</span>
                <span className="summary-amount">25.67 AED</span>
              </div>
              <div className="summary-row">
                <span>Full access to all features</span>
                <span className="summary-tag">Unlimited</span>
              </div>
              <div className="summary-row total">
                <span>Total Monthly</span>
                <span className="summary-amount">25.67 AED</span>
              </div>
            </div>

            <div className="payment-info">
              <Zap size={20} color="#f59e0b" />
              <p>Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AE', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>

            <button
              className="ziina-payment-button"
              onClick={handleZiinaPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="spinner-small"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Shield size={20} />
                  <span>Pay 25.67 AED with Ziina</span>
                </>
              )}
            </button>

            <div className="payment-security-note">
              <Shield size={16} color="#10b981" />
              <span>Secured by Ziina • 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Subscription

