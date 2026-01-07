import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Phone, Sparkles, Apple, Moon, Activity, Droplet, Heart, BookOpen, FileText, Brain, Shield, CheckCircle, Clock, Camera, ScanLine, Search, Mic, BarChart3, Target, Users, User, Bell, LogOut } from 'lucide-react'
import SignInModal from './SignInModal'
import SignUpModal from './SignUpModal'
import ForgotPasswordModal from './ForgotPasswordModal'
import { onAuthChange, signOut as logout } from '../utils/firebaseAuth'
import LanguageSwitcher from './LanguageSwitcher/LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import './LandingPage.css'

const LandingPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(2)

  useEffect(() => {
    // Check if user is logged in using Firebase Auth
    const unsubscribe = onAuthChange((user) => {
      setIsLoggedIn(!!user)
      // If user is logged in and on landing page, redirect to dashboard
      if (user && (window.location.pathname === '/landing' || window.location.pathname === '/')) {
        console.log('✅ User logged in, redirecting to dashboard')
        navigate('/dashboard', { replace: true })
      }
    })

    return () => unsubscribe()
  }, [navigate])

  const handleLogout = async () => {
    try {
      await logout()
    setIsLoggedIn(false)
    setShowNotifications(false)
    // Navigate to landing page
      navigate('/landing')
    } catch (error) {
      console.error('Logout error:', error)
      // Still navigate to landing even if logout fails
      navigate('/landing')
    }
  }

  const handleSignIn = () => {
    setShowSignIn(true)
  }

  const handleSignUp = () => {
    setShowSignUp(true)
  }

  const handleAuthSuccess = () => {
    setShowSignIn(false)
    setShowSignUp(false)
    setShowForgotPassword(false)
    setIsLoggedIn(true)
    // Wait a bit for auth state to propagate before navigating
    setTimeout(() => {
    navigate('/dashboard')
    }, 300)
  }

  const handleProfileClick = () => {
    navigate('/profile')
  }

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications) {
      setNotificationCount(0)
    }
  }

  const mainFeatures = [
    { icon: Sparkles, key: 'aiHub' },
    { icon: Apple, key: 'nutrition' },
    { icon: Brain, key: 'meditation' },
    { icon: Moon, key: 'sleep' },
    { icon: Activity, key: 'activity' },
    { icon: Droplet, key: 'water' },
    { icon: Heart, key: 'mood' },
    { icon: BookOpen, key: 'journal' },
    { icon: Heart, key: 'selfLove' },
    { icon: Target, key: 'habits' }
  ]

  const steps = [
    { number: '1', key: 'step1' },
    { number: '2', key: 'step2' },
    { number: '3', key: 'step3' },
    { number: '4', key: 'step4' }
  ]

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-container">
          <div className="logo" onClick={() => isLoggedIn ? navigate('/dashboard') : navigate('/landing')} style={{ cursor: 'pointer' }}>
            <img src="/sun.jpg" alt={t('app.name')} className="logo-icon-img" />
            <span className="logo-text">{t('app.name')}</span>
          </div>
          <nav className="header-nav">
            <LanguageSwitcher />
            {isLoggedIn ? (
              <>
                <button 
                  className="nav-icon-btn notification-btn" 
                  onClick={handleNotificationsClick}
                  title={t('nav.notifications')}
                >
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="notification-badge">{notificationCount}</span>
                  )}
                </button>
                <button 
                  className="nav-icon-btn profile-btn" 
                  onClick={handleProfileClick}
                  title={t('nav.profile')}
                >
                  <User size={20} />
                </button>
                <button 
                  className="nav-link logout-btn" 
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <>
                <button className="nav-link" onClick={handleSignIn}>{t('nav.signIn')}</button>
                <button className="nav-button" onClick={handleSignUp}>{t('nav.signUp')}</button>
              </>
            )}
          </nav>
          
          {/* Notifications Dropdown */}
          {showNotifications && isLoggedIn && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notifications</h3>
                <button onClick={() => setShowNotifications(false)}>×</button>
              </div>
              <div className="notifications-items">
                <div className="notification-item-dropdown">
                  <div className="notification-dot"></div>
                  <div>
                    <strong>{t('landing.notificationDropdown.goalAchieved')}</strong>
                    <p>{t('landing.notificationDropdown.goalMessage')}</p>
                  </div>
                </div>
                <div className="notification-item-dropdown">
                  <div className="notification-dot"></div>
                  <div>
                    <strong>{t('landing.notificationDropdown.reminder')}</strong>
                    <p>{t('landing.notificationDropdown.reminderMessage')}</p>
                  </div>
                </div>
              </div>
              <div className="notifications-footer">
                <button onClick={() => navigate('/notifications')}>{t('nav.viewAll')}</button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">{t('landing.hero.title')}</h1>
          <p className="hero-subtitle">{t('landing.hero.subtitle')}</p>
          <p className="hero-description">
            {t('landing.hero.description')}
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleSignUp}>
              {t('landing.hero.ctaSignUp')}
            </button>
            <button className="btn-secondary" onClick={handleSignIn}>
              {t('landing.hero.ctaSignIn')}
            </button>
          </div>
        </div>
      </section>

      {/* Comprehensive Wellness Features */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">{t('landing.sections.comprehensiveFeatures.title')}</h2>
          <p className="section-subtitle">
            {t('landing.sections.comprehensiveFeatures.subtitle')}
          </p>
          <div className="features-grid-large">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="feature-card-large">
                  <div className="feature-header">
                    <div className="feature-icon-large">
                      <Icon size={32} />
                    </div>
                    <div>
                      <h3 className="feature-title-large">{t(`landing.mainFeatures.${feature.key}.title`)}</h3>
                      <p className="feature-subtitle-small">{t(`landing.mainFeatures.${feature.key}.subtitle`)}</p>
                    </div>
                  </div>
                  <p className="feature-description-large">{t(`landing.mainFeatures.${feature.key}.description`)}</p>
                  <div className="feature-list">
                    {[1, 2, 3, 4].map((num) => {
                      const featureKey = `landing.mainFeatures.${feature.key}.feature${num}`;
                      const hasFeature = t(featureKey, { defaultValue: '' });
                      return hasFeature ? <span key={num} className="feature-tag">{hasFeature}</span> : null;
                    }).filter(Boolean)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Advanced AI Features */}
      <section className="ai-features-section">
        <div className="section-container">
          <h2 className="section-title">{t('landing.sections.aiFeatures.title')}</h2>
          <p className="section-subtitle">
            {t('landing.sections.aiFeatures.subtitle')}
          </p>
          <div className="ai-features-grid">
            <div className="ai-feature-card">
              <h3>{t('landing.aiFeatures.title1')}</h3>
              <p>{t('landing.aiFeatures.desc1')}</p>
            </div>
            <div className="ai-feature-card">
              <h3>{t('landing.aiFeatures.title2')}</h3>
              <p>{t('landing.aiFeatures.desc2')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-container">
          <h2 className="section-title">{t('landing.howItWorks.title')}</h2>
          <p className="section-subtitle">{t('landing.howItWorks.subtitle')}</p>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{t(`landing.steps.${step.key}.number`)}</div>
                <h3 className="step-title">{t(`landing.steps.${step.key}.title`)}</h3>
                <p className="step-description">{t(`landing.steps.${step.key}.description`)}</p>
                <ul className="step-benefits">
                  {[1, 2, 3].map((num) => {
                    const benefitKey = `landing.steps.${step.key}.benefit${num}`;
                    const benefit = t(benefitKey, { defaultValue: '' });
                    return benefit ? <li key={num}>{benefit}</li> : null;
                  }).filter(Boolean)}
                </ul>
              </div>
            ))}
          </div>
          <div className="quick-start-cta">
            <h3>{t('landing.quickStart.title')}</h3>
            <p>{t('landing.quickStart.subtitle')}</p>
            <button className="btn-primary" onClick={handleSignUp}>
              {t('landing.quickStart.cta')}
            </button>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-links">
              <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/info/about') }}>{t('landing.footer.about')}</a>
              <span className="footer-separator">•</span>
              <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/info/contact') }}>{t('landing.footer.contact')}</a>
              <span className="footer-separator">•</span>
              <a href="#" className="footer-link">{t('landing.footer.privacy')}</a>
              <span className="footer-separator">•</span>
              <a href="#" className="footer-link">{t('landing.footer.terms')}</a>
            </div>
            <p className="copyright">{t('landing.footer.copyright')}</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showSignIn && (
        <SignInModal 
          onClose={() => setShowSignIn(false)}
          onSuccess={handleAuthSuccess}
          onSwitchToSignUp={() => {
            setShowSignIn(false)
            setShowSignUp(true)
          }}
          onSwitchToForgotPassword={() => {
            setShowSignIn(false)
            setShowForgotPassword(true)
          }}
        />
      )}
      {showSignUp && (
        <SignUpModal 
          onClose={() => setShowSignUp(false)}
          onSuccess={handleAuthSuccess}
          onSwitchToSignIn={() => {
            setShowSignUp(false)
            setShowSignIn(true)
          }}
        />
      )}
      {showForgotPassword && (
        <ForgotPasswordModal 
          onClose={() => setShowForgotPassword(false)}
          onSwitchToSignIn={() => {
            setShowForgotPassword(false)
            setShowSignIn(true)
          }}
        />
      )}
    </div>
  )
}

export default LandingPage

