import { useState, useEffect } from 'react'
import { Check, X, CreditCard, Shield, Zap, Crown, AlertCircle, Calendar, Gift, Sparkles } from 'lucide-react'
import { getJSON, setJSON } from '../utils/storage'
import { getSubscriptionDetails, activatePaidSubscription } from '../utils/subscription'
import { useTranslation } from 'react-i18next'
import './Subscription.css'

const Subscription = () => {
  const { t, i18n } = useTranslation()
  const [subscriptionDetails, setSubscriptionDetails] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const details = getSubscriptionDetails()
    setSubscriptionDetails(details)
  }, [])

  const plans = {
    weekly: {
      name: t('subscription.weeklyPlan'),
      price: '10',
      currency: t('subscription.currency'),
      period: t('subscription.perWeek'),
      savings: null,
      badge: null,
      color: '#3b82f6',
      popular: false
    },
    monthly: {
      name: t('subscription.monthlyPlan'),
      price: '25.67',
      currency: t('subscription.currency'),
      period: t('subscription.perMonth'),
      savings: t('subscription.save15'),
      badge: t('subscription.popular'),
      color: '#6366f1',
      popular: true
    },
    yearly: {
      name: t('subscription.yearlyPlan'),
      price: '257',
      currency: t('subscription.currency'),
      period: t('subscription.perYear'),
      savings: t('subscription.save30'),
      badge: t('subscription.bestValue'),
      color: '#10b981',
      popular: false
    }
  }

  const features = t('subscription.features', { returnObjects: true })

  const handleSubscribe = async (planType) => {
    setSelectedPlan(planType)
    setShowPaymentModal(true)
  }

  const handleZiinaPayment = () => {
    const paymentUrls = {
      weekly: 'https://pay.ziina.com/FindYourInnerPe/weekly',
      monthly: 'https://pay.ziina.com/FindYourInnerPe/r-Kv6hmpJ',
      yearly: 'https://pay.ziina.com/FindYourInnerPe/yearly'
    }
    
    const ziinaPaymentUrl = paymentUrls[selectedPlan] || paymentUrls.monthly
    window.open(ziinaPaymentUrl, '_blank')
    
    setShowPaymentModal(false)
    setSuccess(t('subscription.paymentModal.successMessage'))
    
    setTimeout(() => {
      activatePaidSubscription(selectedPlan)
      setSubscriptionDetails(getSubscriptionDetails())
    }, 2000)
  }

  return (
    <div className="subscription-page">
      <header className="page-header">
        <Crown size={32} color="#6366f1" />
        <div>
          <h1>{t('subscription.title')}</h1>
          <p>{t('subscription.subtitle')}</p>
        </div>
      </header>

      {subscriptionDetails?.isTrial && subscriptionDetails.isActive && (
        <div className="trial-banner">
          <Gift size={24} />
          <div className="trial-info">
            <h3>{t('subscription.trialActive')}</h3>
            <p>{t('subscription.trialDaysRemaining', { days: subscriptionDetails.daysRemaining })}</p>
          </div>
        </div>
      )}

      {subscriptionDetails?.isTrial && !subscriptionDetails.isActive && subscriptionDetails.daysRemaining === 0 && (
        <div className="trial-expired-banner">
          <AlertCircle size={24} />
          <div className="trial-info">
            <h3>{t('subscription.trialExpired')}</h3>
            <p>{t('subscription.subscribeToContinue')}</p>
          </div>
        </div>
      )}

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
              className={`plan-card ${plan.popular ? 'popular' : ''} ${subscriptionDetails?.plan === key ? 'current' : ''}`}
              style={{ borderColor: subscriptionDetails?.plan === key ? plan.color : '#e5e7eb' }}
            >
              {plan.badge && (
                <div className="plan-badge" style={{ background: plan.color }}>
                  {plan.badge}
                </div>
              )}
              
              {subscriptionDetails?.plan === key && subscriptionDetails.isActive && (
                <div className="current-plan-badge">
                  <Check size={16} />
                  {t('subscription.currentPlan')}
                </div>
              )}

              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="currency">{plan.currency}</span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                {plan.savings && (
                  <div className="savings-badge">{plan.savings}</div>
                )}
              </div>

              <div className="plan-features">
                <h4>{t('subscription.whatsIncluded')}</h4>
                <ul>
                  {features.map((feature, index) => (
                    <li key={index} className="feature-included">
                      <Check size={18} color={plan.color} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`plan-button ${subscriptionDetails?.plan === key && subscriptionDetails.isActive ? 'current-plan-btn' : ''}`}
                style={{ 
                  background: subscriptionDetails?.plan === key && subscriptionDetails.isActive ? '#10b981' : plan.color,
                  opacity: subscriptionDetails?.plan === key && subscriptionDetails.isActive ? 0.7 : 1
                }}
                onClick={() => handleSubscribe(key)}
                disabled={subscriptionDetails?.plan === key && subscriptionDetails.isActive}
              >
                {subscriptionDetails?.plan === key && subscriptionDetails.isActive ? (
                  <>
                    <Check size={20} />
                    {t('subscription.activeSubscription')}
                  </>
                ) : (
                  <>
                    <Crown size={20} />
                    {t('subscription.subscribeNow')}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="payment-security">
          <Shield size={24} color="#10b981" />
          <div>
            <h4>{t('subscription.securePayment')}</h4>
            <p>{t('subscription.securePaymentDesc')}</p>
          </div>
        </div>

        <div className="subscription-info-card">
          <h3>{t('subscription.whySubscribe')}</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon">🤖</div>
              <h4>{t('subscription.benefits.aiPowered.title')}</h4>
              <p>{t('subscription.benefits.aiPowered.description')}</p>
            </div>
            <div className="info-item">
              <div className="info-icon">📊</div>
              <h4>{t('subscription.benefits.analytics.title')}</h4>
              <p>{t('subscription.benefits.analytics.description')}</p>
            </div>
            <div className="info-item">
              <div className="info-icon">📧</div>
              <h4>{t('subscription.benefits.emailReminders.title')}</h4>
              <p>{t('subscription.benefits.emailReminders.description')}</p>
            </div>
            <div className="info-item">
              <div className="info-icon">🧘</div>
              <h4>{t('subscription.benefits.completeSuite.title')}</h4>
              <p>{t('subscription.benefits.completeSuite.description')}</p>
            </div>
          </div>
        </div>

        <div className="subscription-faq">
          <h3>{t('subscription.faqTitle')}</h3>
          
          <div className="faq-item">
            <h4>{t('subscription.faqs.trial.question')}</h4>
            <p>{t('subscription.faqs.trial.answer')}</p>
          </div>

          <div className="faq-item">
            <h4>{t('subscription.faqs.cancelAnytime.question')}</h4>
            <p>{t('subscription.faqs.cancelAnytime.answer')}</p>
          </div>

          <div className="faq-item">
            <h4>{t('subscription.faqs.paymentMethods.question')}</h4>
            <p>{t('subscription.faqs.paymentMethods.answer')}</p>
          </div>

          <div className="faq-item">
            <h4>{t('subscription.faqs.autoCharge.question')}</h4>
            <p>{t('subscription.faqs.autoCharge.answer')}</p>
          </div>

          <div className="faq-item">
            <h4>{t('subscription.faqs.paymentSecure.question')}</h4>
            <p>{t('subscription.faqs.paymentSecure.answer')}</p>
          </div>
        </div>
      </div>

      {showPaymentModal && selectedPlan && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPaymentModal(false)}>
              <X size={24} />
            </button>
            
            <div className="payment-modal-header">
              <CreditCard size={48} color="#6366f1" />
              <h2>{t('subscription.paymentModal.title')}</h2>
              <p>{t('subscription.paymentModal.subtitle')}</p>
            </div>

            <div className="payment-summary">
              <div className="summary-row">
                <span>{plans[selectedPlan].name}</span>
                <span className="summary-amount">{plans[selectedPlan].price} {plans[selectedPlan].currency}</span>
              </div>
              <div className="summary-row">
                <span>{t('subscription.paymentModal.fullAccessUnlimited')}</span>
                <span className="summary-tag">{t('subscription.paymentModal.unlimited')}</span>
              </div>
              <div className="summary-row total">
                <span>{t('subscription.paymentModal.totalDue')}</span>
                <span className="summary-amount">{plans[selectedPlan].price} {plans[selectedPlan].currency}</span>
              </div>
            </div>

            <div className="payment-info">
              <Calendar size={20} color="#f59e0b" />
              <p>{t('subscription.paymentModal.autoRenew', { period: plans[selectedPlan].period })}</p>
            </div>

            <button
              className="ziina-payment-button"
              onClick={handleZiinaPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="spinner-small"></div>
                  <span>{t('subscription.paymentModal.processing')}</span>
                </>
              ) : (
                <>
                  <Shield size={20} />
                  <span>{t('subscription.paymentModal.payWithZiina')}</span>
                </>
              )}
            </button>

            <div className="payment-security-note">
              <Shield size={16} color="#10b981" />
              <span>{t('subscription.paymentModal.securedByZiina')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Subscription
