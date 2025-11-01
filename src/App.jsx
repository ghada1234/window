import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import safeStorage from './utils/storage'
import { initGA, trackPageView } from './utils/googleAnalytics'
import { WellnessProvider } from './context/WellnessContext'
import LandingPage from './components/LandingPage'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Nutrition from './components/Nutrition'
import WaterLog from './components/WaterLog'
import ActivityTracker from './components/ActivityTracker'
import SleepTracker from './components/SleepTracker'
import MindPractices from './components/MindPractices'
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
import Subscription from './components/Subscription'
import PaymentSuccess from './components/PaymentSuccess'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import ResetPassword from './components/ResetPassword'
import WebAnalytics from './components/WebAnalytics'
import WellnessReport from './components/WellnessReport'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './App.css'

// Protected Route wrapper - redirects to landing if not logged in
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = safeStorage.getItem('isLoggedIn') === 'true'
  
  if (!isLoggedIn) {
    return <Navigate to="/landing" replace />
  }
  
  return children
}

// Analytics tracker component
const AnalyticsTracker = () => {
  const location = useLocation()
  
  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search, document.title)
  }, [location])
  
  return null
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Initialize Google Analytics on mount
  useEffect(() => {
    const gaId = import.meta.env.VITE_GA4_MEASUREMENT_ID
    if (gaId) {
      initGA(gaId)
    }
  }, [])

  return (
    <WellnessProvider>
      <Router>
        <AnalyticsTracker />
        <StorageWarning />
        <PWAInstallPrompt />
        <Analytics />
        <SpeedInsights />
        <Routes>
          {/* Landing page - default route */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/" element={<LandingPage />} />
          
          {/* Payment success page - accessible without login */}
          <Route path="/payment/success" element={<PaymentSuccess />} />
          
          {/* Password reset page - accessible without login */}
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected routes - require login */}
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="app">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/mind/practices" element={<MindPractices />} />
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
                    <Route path="/subscription" element={<Subscription />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/info/about" element={<About />} />
                    <Route path="/info/contact" element={<Contact />} />
                    <Route path="/analytics" element={<WebAnalytics />} />
                    <Route path="/wellness-report" element={<WellnessReport />} />
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

