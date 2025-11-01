import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Phone, Sparkles, Apple, Moon, Activity, Droplet, Heart, BookOpen, FileText, Brain, Shield, CheckCircle, Clock, Camera, ScanLine, Search, Mic, BarChart3, Target, Users, User, Bell, LogOut } from 'lucide-react'
import SignInModal from './SignInModal'
import SignUpModal from './SignUpModal'
import ForgotPasswordModal from './ForgotPasswordModal'
import safeStorage from '../utils/storage'
import './LandingPage.css'

const LandingPage = () => {
  const navigate = useNavigate()
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationCount, setNotificationCount] = useState(2)

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = safeStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)
  }, [])

  const handleLogout = () => {
    safeStorage.removeItem('isLoggedIn')
    safeStorage.removeItem('currentUser')
    setIsLoggedIn(false)
    setShowNotifications(false)
    // Navigate to landing page
    window.location.href = '/landing'
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
    // Modals already set isLoggedIn in storage
    navigate('/dashboard')
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
    {
      icon: Sparkles,
      title: 'AI Hub',
      subtitle: 'Your personal wellness assistant',
      description: 'Get personalized wellness summaries, 5 tailored recommendations, and AI-powered insights based on your data patterns.',
      features: ['Personalized Recommendations', 'Wellness Summary', 'AI Assistant']
    },
    {
      icon: Apple,
      title: 'AI Nutrition Tracker',
      subtitle: 'Smart food analysis and tracking',
      description: 'Analyze food photos, scan nutrition labels, search food database, and track your daily nutrition with AI.',
      features: ['Photo Analysis', 'Label Scanning', 'Food Database', 'Macro Tracking']
    },
    {
      icon: Brain,
      title: 'Meditation & Mindfulness',
      subtitle: 'Guided sessions with vocal instructions',
      description: 'Access guided meditation sessions, breathing exercises, and mindfulness practices with vocal guidance.',
      features: ['Guided Meditation', 'Breathing Exercises', 'Vocal Instructions']
    },
    {
      icon: Moon,
      title: 'Sleep Analysis',
      subtitle: 'Comprehensive sleep monitoring',
      description: 'Track sleep quality, duration, and patterns. Get insights to improve your rest and recovery.',
      features: ['Sleep Quality', 'Duration Tracking', 'Pattern Analysis']
    },
    {
      icon: Activity,
      title: 'Activity Tracking',
      subtitle: 'Monitor your daily activities',
      description: 'Log various activities, track calories burned, and visualize your weekly activity patterns with charts.',
      features: ['Activity Logging', 'Calorie Tracking', 'Weekly Charts']
    },
    {
      icon: Droplet,
      title: 'Water Intake Tracking',
      subtitle: 'Stay hydrated with smart logging',
      description: 'Track daily water intake with quick-add buttons, custom amounts, and comprehensive history with offline sync.',
      features: ['Quick Add', 'Custom Amounts', 'Offline Sync']
    },
    {
      icon: Heart,
      title: 'Mood Tracking',
      subtitle: 'Monitor emotional well-being',
      description: 'Log daily moods, emotions, and triggers to identify patterns and improve your mental health.',
      features: ['Emotion Logging', 'Pattern Analysis', 'Trigger Tracking']
    },
    {
      icon: BookOpen,
      title: 'Digital Journal',
      subtitle: 'Reflect and document your journey',
      description: 'Write daily reflections, gratitude entries, and thoughts. Organize entries with tags and search functionality.',
      features: ['Daily Reflections', 'Gratitude Entries', 'Tag Organization']
    },
    {
      icon: Heart,
      title: 'Self Love & Care',
      subtitle: 'Nurture your relationship with yourself',
      description: 'Practice self-compassion, positive affirmations, and self-care activities to build a healthier relationship with yourself.',
      features: ['Affirmations', 'Self-Care Activities', 'Compassion Practice']
    },
    {
      icon: Target,
      title: 'Habits & Goals',
      subtitle: 'Build lasting wellness habits',
      description: 'Create and track daily habits, set wellness goals, and build consistency with streak tracking and progress monitoring.',
      features: ['Habit Tracking', 'Goal Setting', 'Streak Tracking']
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Create Your Profile',
      description: 'Set up your personal information including age, weight, height, activity level, and wellness goals.',
      benefits: ['Personalized recommendations', 'Accurate nutrition calculations', 'Nutrition tracking & analysis']
    },
    {
      number: '2',
      title: 'Explore AI-Powered Features',
      description: 'Use our AI Hub for personalized recommendations, nutrition analysis, and wellness insights.',
      benefits: ['Food photo analysis', 'Nutrition label scanning']
    },
    {
      number: '3',
      title: 'Track Your Wellness',
      description: 'Log your meals, water intake, activities, sleep, and mood to get comprehensive insights.',
      benefits: ['Nutrition tracking', 'Water intake monitoring', 'Activity and sleep logs']
    },
    {
      number: '4',
      title: 'Practice Mindfulness',
      description: 'Engage with meditation sessions, breathing exercises, and journaling for mental wellness.',
      benefits: ['Guided meditation', 'Breathing exercises', 'Journaling and reflection']
    }
  ]

  const pricingFeatures = [
    'Full access to all wellness features and tools',
    'Unlimited meditation sessions (5-60 min)',
    'AI-powered nutrition analysis',
    'Food photo recognition & analysis',
    'Advanced breathing & mindfulness exercises',
    'Mood tracking & mental wellness tools',
    'Sleep analysis & activity tracking',
    'AI Hub with personalized insights',
    'Digital journaling & self-love practices',
    'Community support & regular updates'
  ]

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-container">
          <div className="logo" onClick={() => navigate('/dashboard')}>
            <img src="/sun.jpg" alt="Find Your Inner Peace" className="logo-icon-img" />
            <span className="logo-text">Find Your Inner Peace</span>
          </div>
          <nav className="header-nav">
            {isLoggedIn ? (
              <>
                <button 
                  className="nav-icon-btn notification-btn" 
                  onClick={handleNotificationsClick}
                  title="Notifications"
                >
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="notification-badge">{notificationCount}</span>
                  )}
                </button>
                <button 
                  className="nav-icon-btn profile-btn" 
                  onClick={handleProfileClick}
                  title="Profile"
                >
                  <User size={20} />
                </button>
                <button 
                  className="nav-link logout-btn" 
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <button className="nav-link" onClick={handleSignIn}>Sign In</button>
                <button className="nav-button" onClick={handleSignUp}>Sign Up</button>
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
                    <strong>Goal Achieved!</strong>
                    <p>You completed your daily water intake goal</p>
                  </div>
                </div>
                <div className="notification-item-dropdown">
                  <div className="notification-dot"></div>
                  <div>
                    <strong>Reminder</strong>
                    <p>Time for your evening meditation session</p>
                  </div>
                </div>
              </div>
              <div className="notifications-footer">
                <button onClick={() => navigate('/notifications')}>View All</button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">Find Your Inner Peace</h1>
          <p className="hero-subtitle">Your Comprehensive Wellness & Meditation Platform</p>
          <p className="hero-description">
            Track your mood, meditate, and discover AI-powered insights for a healthier, happier you.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleSignUp}>
              Start Your Journey
            </button>
            <button className="btn-secondary" onClick={handleSignIn}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Comprehensive Wellness Features */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">Comprehensive Wellness Features</h2>
          <p className="section-subtitle">
            Discover our complete suite of AI-powered wellness tools designed to help you achieve optimal health and inner peace.
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
                      <h3 className="feature-title-large">{feature.title}</h3>
                      <p className="feature-subtitle-small">{feature.subtitle}</p>
                    </div>
                  </div>
                  <p className="feature-description-large">{feature.description}</p>
                  <div className="feature-list">
                    {feature.features.map((feat, i) => (
                      <span key={i} className="feature-tag">{feat}</span>
                    ))}
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
          <h2 className="section-title">Advanced AI-Powered Features</h2>
          <p className="section-subtitle">
            Our platform leverages cutting-edge AI technology to provide personalized insights and recommendations tailored to your unique wellness journey.
          </p>
          <div className="ai-features-grid">
            <div className="ai-feature-card">
              <h3>Smart Food Analysis</h3>
              <p>Take a photo of your meal and get instant nutritional analysis, portion size estimation, and macro breakdown.</p>
            </div>
            <div className="ai-feature-card">
              <h3>Personalized Goals</h3>
              <p>Get customized nutrition targets, macro recommendations, and wellness goals based on your unique profile and objectives.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Get started with our comprehensive wellness platform in just a few simple steps.</p>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                <ul className="step-benefits">
                  {step.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="quick-start-cta">
            <h3>Quick Start Guide</h3>
            <p>New to wellness tracking? Follow our quick start guide to get the most out of your journey.</p>
            <button className="btn-primary" onClick={handleSignUp}>
              Start Your Journey
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="section-container">
          <h2 className="section-title">Complete Wellness Platform</h2>
          <p className="section-subtitle">
            Access all our AI-powered wellness features, meditation sessions, and personalized insights for just 25.67 AED per month.
          </p>
          
          <div className="pricing-info">
            <div className="pricing-badge" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
              <span className="badge-text">25.67 AED/MONTH</span>
            </div>
            <p className="pricing-note">
              Full access to all wellness features including AI-powered nutrition analysis, unlimited meditation sessions, personalized insights, and priority support. Cancel anytime.
            </p>
          </div>

          <div className="pricing-card">
            <div className="pricing-header">
              <span className="pricing-badge-free" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white' }}>Monthly Subscription Required</span>
              <h3 className="pricing-title">Full Access</h3>
              <div className="pricing-price">
                <span className="price-amount">25.67 AED</span>
                <span className="price-period">/month</span>
              </div>
            </div>
            
            <ul className="pricing-features-list">
              {pricingFeatures.map((feature, index) => (
                <li key={index} className="pricing-feature">
                  <CheckCircle size={20} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="pricing-footer">
              <p className="pricing-note-small">All features include secure data encryption, regular updates, and access to our supportive community.</p>
              <div className="pricing-highlights">
                <span>💳 Secure UAE Payment (Ziina)</span>
                <span>🔒 256-bit Encryption</span>
                <span>📧 Priority Support</span>
              </div>
              <button className="btn-pricing" onClick={handleSignUp}>
                Subscribe Now - 25.67 AED/Month
              </button>
            </div>
          </div>

          <div className="money-back-guarantee">
            <h3>Money-Back Guarantee</h3>
            <p>
              <strong>100% Money Refundable</strong> if you're dissatisfied with our service.
            </p>
            <p>
              We stand behind our wellness platform. If you're not completely satisfied, contact us for a full refund—no questions asked.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-links">
              <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/info/about') }}>About</a>
              <span className="footer-separator">•</span>
              <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/info/contact') }}>Contact</a>
              <span className="footer-separator">•</span>
              <a href="#" className="footer-link">Privacy Policy</a>
              <span className="footer-separator">•</span>
              <a href="#" className="footer-link">Terms of Service</a>
            </div>
            <p className="copyright">© 2024 Find Your Inner Peace. All rights reserved.</p>
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

