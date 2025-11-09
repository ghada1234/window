import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Crown, Clock, Sparkles, Lock } from 'lucide-react'
import { getSubscriptionDetails } from '../utils/subscription'
import { getCurrentUser } from '../utils/firebaseAuth'
import { useTranslation } from 'react-i18next'
import './SubscriptionGate.css'

const ADMIN_EMAIL = 'ghadaabdulaziz1@gmail.com'

const SubscriptionGate = ({ children }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [subscriptionDetails, setSubscriptionDetails] = useState(null)
  const [showGate, setShowGate] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is admin
    const user = getCurrentUser()
    const adminAccess = user?.email === ADMIN_EMAIL
    setIsAdmin(adminAccess)

    // Admin always has full access
    if (adminAccess) {
      console.log('👑 Admin access granted to:', user.email)
      setShowGate(false)
      return
    }

    const details = getSubscriptionDetails()
    setSubscriptionDetails(details)

    // Allow access to subscription page itself
    if (location.pathname === '/subscription') {
      setShowGate(false)
      return
    }

    // Check if user has active subscription (trial or paid)
    if (!details.isActive) {
      setShowGate(true)
    } else {
      setShowGate(false)
    }
  }, [location.pathname])

  // Loading state
  if (!subscriptionDetails && !isAdmin) {
    return <div className="loading-gate">Loading...</div>
  }

  // Admin badge (optional visual indicator)
  if (isAdmin && location.pathname !== '/subscription') {
    return (
      <>
        <div className="admin-badge">
          <Crown size={16} />
          <span>Admin Access</span>
        </div>
        {children}
      </>
    )
  }

  // Show subscription gate if no active subscription
  if (showGate) {
    return (
      <div className="subscription-gate-overlay">
        <div className="subscription-gate-modal">
          <div className="gate-icon">
            <Lock size={64} />
          </div>
          
          <h1>{t('subscriptionGate.title')}</h1>
          
          {subscriptionDetails.isTrial && subscriptionDetails.daysRemaining === 0 ? (
            <>
              <p className="gate-message">{t('subscriptionGate.trialExpiredMessage')}</p>
              <div className="trial-summary">
                <Clock size={20} />
                <span>{t('subscriptionGate.trialPeriod')}: 7 {t('subscriptionGate.days')}</span>
              </div>
            </>
          ) : (
            <>
              <p className="gate-message">{t('subscriptionGate.subscriptionRequired')}</p>
            </>
          )}

          <div className="gate-benefits">
            <h3>{t('subscriptionGate.unlockFeatures')}</h3>
            <ul>
              <li>
                <Sparkles size={18} />
                <span>{t('subscriptionGate.benefit1')}</span>
              </li>
              <li>
                <Sparkles size={18} />
                <span>{t('subscriptionGate.benefit2')}</span>
              </li>
              <li>
                <Sparkles size={18} />
                <span>{t('subscriptionGate.benefit3')}</span>
              </li>
              <li>
                <Sparkles size={18} />
                <span>{t('subscriptionGate.benefit4')}</span>
              </li>
            </ul>
          </div>

          <button className="subscribe-now-btn" onClick={() => navigate('/subscription')}>
            <Crown size={20} />
            {t('subscriptionGate.viewPlans')}
          </button>

          <p className="gate-note">{t('subscriptionGate.startingFrom')}</p>
        </div>
      </div>
    )
  }

  // Show content if subscription is active
  return children
}

export default SubscriptionGate

