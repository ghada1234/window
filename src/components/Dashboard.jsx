import { useWellness } from '../context/WellnessContext'
import { useTranslation } from 'react-i18next'
import StatsCard from './StatsCard'
import WaterIntake from './WaterIntake'
import DailyGoals from './DailyGoals'
import RecentLogs from './RecentLogs'
import RecentActivity from './RecentActivity'
import MoodLogger from './MoodLogger'
import './Dashboard.css'

const Dashboard = () => {
  const { getDailyStats } = useWellness()
  const { t, i18n } = useTranslation()
  
  console.log('📊 Dashboard rendering...')
  
  let stats
  try {
    stats = getDailyStats()
    console.log('📊 Dashboard stats:', stats)
  } catch (error) {
    console.error('❌ Error getting stats:', error)
    stats = { sleep: '0h', calories: 0, activity: '0 min', mood: 'Good' }
  }

  const getCurrentDate = () => {
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      const locale = i18n.language === 'ar' ? 'ar-AE' : 'en-US'
      return new Date().toLocaleDateString(locale, options)
    } catch (error) {
      console.error('❌ Error getting date:', error)
      return new Date().toLocaleDateString()
    }
  }

  const dashboardStats = [
    { label: t('dashboard.lastSleep'), value: stats.sleep || '8h', icon: '😴' },
    { label: t('dashboard.lastNutrition'), value: stats.calories?.toString() || '0', subtitle: t('dashboard.caloriesConsumed'), icon: '🍎' },
    { label: t('dashboard.lastActivity'), value: stats.activity || '0 min', subtitle: t('dashboard.workoutTime'), icon: '💪' },
    { label: t('dashboard.lastMood'), value: stats.mood || t('dashboard.good'), subtitle: t('dashboard.howFeeling'), icon: '😊' }
  ]

  return (
    <div className="dashboard" style={{ minHeight: '100vh', padding: '1rem' }}>
      <header className="dashboard-header" style={{ marginBottom: '2rem', background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
          {t('dashboard.welcome')}
        </h1>
        <p className="dashboard-date" style={{ color: '#6b7280', fontSize: '1rem' }}>
          {getCurrentDate()}
        </p>
      </header>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {dashboardStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="dashboard-content" style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 1024 ? '1fr 1fr' : '1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="dashboard-left" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <WaterIntake />
          <DailyGoals />
        </div>
        <div className="dashboard-right" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <RecentLogs />
          <RecentActivity />
        </div>
      </div>

      <div className="dashboard-actions" style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: '2rem', marginTop: '2rem' }}>
        <MoodLogger />
      </div>
    </div>
  )
}

export default Dashboard

