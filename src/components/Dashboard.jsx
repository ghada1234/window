import { useWellness } from '../context/WellnessContext'
import StatsCard from './StatsCard'
import WaterIntake from './WaterIntake'
import DailyGoals from './DailyGoals'
import RecentLogs from './RecentLogs'
import RecentActivity from './RecentActivity'
import MoodLogger from './MoodLogger'
import './Dashboard.css'

const Dashboard = () => {
  const { getDailyStats } = useWellness()
  const stats = getDailyStats()

  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date().toLocaleDateString('en-US', options)
  }

  const dashboardStats = [
    { label: 'Last Sleep', value: stats.sleep || '8.25h', icon: '😴' },
    { label: 'Last Nutrition', value: stats.calories.toString(), subtitle: 'Calories consumed', icon: '🍎' },
    { label: 'Last Activity', value: stats.activity || '0 min', subtitle: 'Workout time', icon: '💪' },
    { label: 'Last Mood', value: stats.mood || 'Good', subtitle: "How you're feeling", icon: '😊' }
  ]

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome Back!</h1>
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

