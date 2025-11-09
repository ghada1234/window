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
  const stats = getDailyStats()

  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    const locale = i18n.language === 'ar' ? 'ar-AE' : 'en-US'
    return new Date().toLocaleDateString(locale, options)
  }

  const dashboardStats = [
    { label: t('dashboard.lastSleep'), value: stats.sleep || '8.25h', icon: '😴' },
    { label: t('dashboard.lastNutrition'), value: stats.calories.toString(), subtitle: t('dashboard.caloriesConsumed'), icon: '🍎' },
    { label: t('dashboard.lastActivity'), value: stats.activity || '0 min', subtitle: t('dashboard.workoutTime'), icon: '💪' },
    { label: t('dashboard.lastMood'), value: stats.mood || t('dashboard.good'), subtitle: t('dashboard.howFeeling'), icon: '😊' }
  ]

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{t('dashboard.welcome')}</h1>
        <p className="dashboard-date">{getCurrentDate()}</p>
      </header>

      <div className="stats-grid">
        {dashboardStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="dashboard-content">
        <div className="dashboard-left">
          <WaterIntake />
          <DailyGoals />
        </div>
        <div className="dashboard-right">
          <RecentLogs />
          <RecentActivity />
        </div>
      </div>

      <div className="dashboard-actions">
        <MoodLogger />
      </div>
    </div>
  )
}

export default Dashboard


export default Dashboard

