import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { onAuthChange } from './utils/firebaseAuth'
import { initGA, trackPageView } from './utils/googleAnalytics'
import { isAnalyticsEnabled } from './utils/analyticsFilter'
import { WellnessProvider } from './context/WellnessContext'
import LandingPage from './components/LandingPage'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Nutrition from './components/Nutrition'
import WaterLog from './components/WaterLog'
import ActivityTracker from './components/ActivityTracker'
import SleepTracker from './components/SleepTracker'
// import MindPractices from './components/MindPractices' - Removed
import Journal from './components/Journal'
import AIWellnessHub from './components/AIWellnessHub'
import HabitsGoals from './components/HabitsGoals'
import Hobbies from './components/Hobbies'
import WhatsAppGroups from './components/WhatsAppGroups'
import SelfLoveCare from './components/SelfLoveCare'
import MoodTracker from './components/MoodTracker'
import EmotionInsights from './components/EmotionInsights'
import Profile from './components/Profile'
import Notifications from './components/Notifications'
import PersonalInformation from './components/PersonalInformation'
import About from './components/About'
import Contact from './components/Contact'
import StorageWarning from './components/StorageWarning'
import ResetPassword from './components/ResetPassword'
import WellnessReport from './components/WellnessReport'
import WearableSync from './components/WearableSync'
import OAuthCallback from './components/OAuthCallback'
import NotificationPrompt from './components/NotificationPrompt/NotificationPrompt'
import VoiceJournal from './components/VoiceJournal'
import CBTTherapy from './components/CBTTherapy'
import SocialFeed from './components/SocialFeed'
import ConditionalAnalytics from './components/ConditionalAnalytics'
import './App.css'

// Protected Route wrapper - redirects to landing if not logged in
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    console.log('🔐 Starting auth check...')
    let timeoutId
    
    const unsubscribe = onAuthChange((currentUser) => {
      console.log('🔐 Auth state changed:', currentUser ? 'Logged in' : 'Not logged in')
      if (currentUser) {
        console.log('✅ User email:', currentUser.email)
      }
      setUser(currentUser)
      setLoading(false)
      setAuthChecked(true)
      
      // Clear timeout since we got auth response
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    })

    // Set a timeout to prevent infinite loading (2 seconds for mobile)
    timeoutId = setTimeout(() => {
      console.warn('⚠️ Auth check timeout - finishing loading state')
      setLoading(false)
      setAuthChecked(true)
    }, 2000)

    return () => {
      unsubscribe()
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #7FB3A8',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ fontSize: '16px', color: '#7FB3A8' }}>Loading...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }
  
  if (!user) {
    console.log('❌ No user found, redirecting to landing')
    return <Navigate to="/landing" replace />
  }
  
  return children
}

// Analytics tracker component
const AnalyticsTracker = () => {
  const location = useLocation()
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    // Listen for auth changes to check if user is admin
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser)
    })
    
    return () => unsubscribe()
  }, [])
  
  useEffect(() => {
    // Reset cache and check if analytics should be enabled
    if (user || !user) { // Check on every location change
      // Only track if analytics is enabled (not admin user)
      if (isAnalyticsEnabled()) {
        trackPageView(location.pathname + location.search, document.title)
      }
    }
  }, [location, user])
  
  return null
}

function App() {
  // Log app initialization for debugging
  console.log('🚀 App initializing...')
  console.log('📱 User agent:', navigator.userAgent)
  console.log('🌐 Window size:', window.innerWidth, 'x', window.innerHeight)
  console.log('📍 Location:', window.location.href)
  
  // Start with sidebar closed on mobile, open on desktop
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return window.innerWidth > 768
  })

  // Initialize Google Analytics on mount (only if not admin)
  useEffect(() => {
    if (isAnalyticsEnabled()) {
      const gaId = import.meta.env.VITE_GA4_MEASUREMENT_ID
      if (gaId) {
        initGA(gaId)
      }
    } else {
      console.log('🚫 Analytics disabled for admin user')
    }
  }, [])

  // Handle window resize to auto-close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [sidebarOpen])

  return (
    <WellnessProvider>
      <Router>
        <AnalyticsTracker />
        <StorageWarning />
        {/* <PWAInstallPrompt /> */} {/* REMOVED - No PWA */}
        <ConditionalAnalytics />
        <Routes>
          {/* Landing page - default route */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/" element={<LandingPage />} />
          
          {/* Password reset page - accessible without login */}
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* OAuth callback - accessible without login */}
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          
          {/* Protected routes - require login */}
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="app">
                  <NotificationPrompt />
                <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/mind/journal" element={<Journal />} />
                    <Route path="/mind/emotions" element={<EmotionInsights />} />
                    <Route path="/body/nutrition" element={<Nutrition />} />
                    <Route path="/body/water" element={<WaterLog />} />
                    <Route path="/body/activity" element={<ActivityTracker />} />
                    <Route path="/body/sleep" element={<SleepTracker />} />
                    <Route path="/ai-hub" element={<AIWellnessHub />} />
                    <Route path="/habits-goals" element={<HabitsGoals />} />
                    <Route path="/community/hobbies" element={<Hobbies />} />
                    <Route path="/community/whatsapp-groups" element={<WhatsAppGroups />} />
                    <Route path="/wellness/self-love" element={<SelfLoveCare />} />
                    <Route path="/wellness/mood" element={<MoodTracker />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/personal-info" element={<PersonalInformation />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/info/about" element={<About />} />
                    <Route path="/info/contact" element={<Contact />} />
                    <Route path="/wellness-report" element={<WellnessReport />} />
                    <Route path="/wearable-sync" element={<WearableSync />} />
                    <Route path="/mind/voice-journal" element={<VoiceJournal />} />
                    <Route path="/mind/cbt-therapy" element={<CBTTherapy />} />
                    <Route path="/community/social" element={<SocialFeed />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </WellnessProvider>
  )
}

export default App



