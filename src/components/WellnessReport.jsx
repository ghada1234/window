import { useState } from 'react'
import { useWellness } from '../context/WellnessContext'
import { FileText, Activity, Moon, Apple, Heart, Download, Share2 } from 'lucide-react'
import './WellnessReport.css'

const WellnessReport = () => {
  const { activities, sleepLogs, nutrition, moodLogs } = useWellness()
  const [period, setPeriod] = useState('weekly') // 'daily', 'weekly', 'monthly', 'yearly'

  // Calculate daily stats
  const getDailyStats = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const dayActivities = activities.filter(a => {
      const activityDate = new Date(a.date || Date.now())
      return activityDate >= today && activityDate < tomorrow
    })

    const daySleep = sleepLogs.find(s => {
      const sleepDate = new Date(s.date || Date.now())
      return sleepDate >= today && sleepDate < tomorrow
    })

    const dayMood = moodLogs.find(m => {
      const moodDate = new Date(m.date || Date.now())
      return moodDate >= today && moodDate < tomorrow
    })

    const totalActivity = dayActivities.reduce((sum, a) => sum + (a.duration || 0), 0)
    const totalCalories = dayActivities.reduce((sum, a) => sum + (a.calories || 0), 0)
    const avgCalories = dayActivities.length > 0 ? Math.round(totalCalories / dayActivities.length) : 0
    
    const sleepHours = daySleep ? parseFloat(daySleep.duration?.replace(' hours', '') || '0') : 0
    const quality = daySleep 
      ? (() => {
          const qualityMap = { 'Excellent': 5, 'Good': 4, 'Fair': 3, 'Poor': 2 }
          return qualityMap[daySleep.quality] || 3
        })()
      : 0

    const currentMood = dayMood?.mood || 'Okay'

    return {
      totalActivity,
      totalCalories,
      avgCalories,
      avgMood: currentMood,
      avgSleep: sleepHours.toFixed(1),
      avgQuality: quality.toFixed(1),
      activeDays: dayActivities.length > 0 ? 1 : 0
    }
  }

  // Calculate weekly stats
  const getWeeklyStats = () => {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay()) // Start of week (Sunday)
    
    const weekActivities = activities.filter(a => {
      const activityDate = new Date(a.date || Date.now())
      return activityDate >= weekStart
    })

    const weekSleep = sleepLogs.filter(s => {
      const sleepDate = new Date(s.date || Date.now())
      return sleepDate >= weekStart
    })

    const weekMoods = moodLogs.filter(m => {
      const moodDate = new Date(m.date || Date.now())
      return moodDate >= weekStart
    })

    const totalActivity = weekActivities.reduce((sum, a) => sum + (a.duration || 0), 0)
    const totalCalories = weekActivities.reduce((sum, a) => sum + (a.calories || 0), 0)
    const avgCalories = weekActivities.length > 0 ? Math.round(totalCalories / weekActivities.length) : 0
    
    const avgSleepHours = weekSleep.length > 0 
      ? (weekSleep.reduce((sum, s) => {
          const hours = parseFloat(s.duration?.replace(' hours', '') || '0')
          return sum + hours
        }, 0) / weekSleep.length).toFixed(1)
      : 0

    const avgQuality = weekSleep.length > 0 
      ? (weekSleep.reduce((sum, s) => {
          const qualityMap = { 'Excellent': 5, 'Good': 4, 'Fair': 3, 'Poor': 2 }
          return sum + (qualityMap[s.quality] || 3)
        }, 0) / weekSleep.length).toFixed(1)
      : 0

    const activeDays = new Set(weekActivities.map(a => {
      const date = new Date(a.date || Date.now())
      return date.toDateString()
    })).size

    const avgMood = weekMoods.length > 0 
      ? weekMoods[Math.floor(weekMoods.length / 2)]?.mood || 'Okay'
      : 'Okay'

    return {
      totalActivity,
      totalCalories,
      avgCalories,
      avgMood,
      avgSleep: avgSleepHours,
      avgQuality,
      activeDays
    }
  }

  const stats = period === 'daily' ? getDailyStats() : getWeeklyStats()

  // Generate chart data based on period
  const getChartDays = () => {
    const today = new Date()
    const days = []
    
    if (period === 'daily') {
      // Show hourly data for today
      for (let i = 0; i < 24; i++) {
        days.push({
          hour: i,
          label: `${i}:00`,
          fullDate: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })
      }
      return days
    }
    
    // For weekly, show last 7 days
    if (period === 'weekly') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(today.getDate() - i)
        days.push({
          date: date,
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })
      }
      return days
    }
    
    // For monthly, show last 30 days grouped by week
    if (period === 'monthly') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(today.getDate() - i)
        days.push({
          date: date,
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })
      }
      return days
    }
    
    // For yearly, show last 12 months
    if (period === 'yearly') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today)
        date.setMonth(date.getMonth() - i)
        days.push({
          date: date,
          dayName: date.toLocaleDateString('en-US', { month: 'short' }),
          fullDate: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        })
      }
      return days
    }
    
    return days
  }

  const chartDays = getChartDays()

  const getActivityData = () => {
    if (period === 'daily') {
      // For daily, return today's total activity
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayActivities = activities.filter(a => {
        const activityDate = new Date(a.date || Date.now())
        return activityDate >= today
      })
      const total = todayActivities.reduce((sum, a) => sum + (a.duration || 0), 0)
      return chartDays.map(() => total / chartDays.length) // Distribute across hours
    }
    
    return chartDays.map(day => {
      const dayActivities = activities.filter(a => {
        const activityDate = new Date(a.date || Date.now())
        if (period === 'weekly' || period === 'monthly') {
          return activityDate.toDateString() === day.date.toDateString()
        }
        if (period === 'yearly') {
          const activityMonth = activityDate.getMonth()
          const activityYear = activityDate.getFullYear()
          return activityMonth === day.date.getMonth() && activityYear === day.date.getFullYear()
        }
        return false
      })
      return dayActivities.reduce((sum, a) => sum + (a.duration || 0), 0)
    })
  }

  const getSleepData = () => {
    if (period === 'daily') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const daySleep = sleepLogs.find(s => {
        const sleepDate = new Date(s.date || Date.now())
        return sleepDate >= today
      })
      const hours = daySleep ? parseFloat(daySleep.duration?.replace(' hours', '') || '0') : 0
      return chartDays.map(() => hours / chartDays.length) // Distribute across hours
    }
    
    return chartDays.map(day => {
      const daySleep = sleepLogs.find(s => {
        const sleepDate = new Date(s.date || Date.now())
        if (period === 'weekly' || period === 'monthly') {
          return sleepDate.toDateString() === day.date.toDateString()
        }
        if (period === 'yearly') {
          const sleepMonth = sleepDate.getMonth()
          const sleepYear = sleepDate.getFullYear()
          return sleepMonth === day.date.getMonth() && sleepYear === day.date.getFullYear()
        }
        return false
      })
      if (daySleep) {
        return parseFloat(daySleep.duration?.replace(' hours', '') || '0')
      }
      return 0
    })
  }

  const getNutritionData = () => {
    if (period === 'daily') {
      return chartDays.map(() => nutrition.calories / chartDays.length)
    }
    
    return chartDays.map(() => nutrition.calories) // Simplified - would need per-day nutrition tracking
  }

  const getMoodData = () => {
    const moodMap = { '😄 Excellent': 5, '😊 Good': 4, '😐 Okay': 3, '😔 Low': 2, '😢 Poor': 1, 'Great': 5, 'Moderate': 3, 'High': 5, 'Low': 2 }
    if (period === 'daily') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const dayMood = moodLogs.find(m => {
        const moodDate = new Date(m.date || Date.now())
        return moodDate >= today
      })
      const moodValue = dayMood ? (moodMap[dayMood.mood] || Object.values(moodMap).find(v => v === dayMood.mood) || 3) : 3
      return chartDays.map(() => moodValue)
    }
    
    return chartDays.map(day => {
      const dayMood = moodLogs.find(m => {
        const moodDate = new Date(m.date || Date.now())
        if (period === 'weekly' || period === 'monthly') {
          return moodDate.toDateString() === day.date.toDateString()
        }
        if (period === 'yearly') {
          const moodMonth = moodDate.getMonth()
          const moodYear = moodDate.getFullYear()
          return moodMonth === day.date.getMonth() && moodYear === day.date.getFullYear()
        }
        return false
      })
      return dayMood ? (moodMap[dayMood.mood] || Object.values(moodMap).find(v => v === dayMood.mood) || 3) : 3
    })
  }

  const activityData = getActivityData()
  const sleepData = getSleepData()
  const nutritionData = getNutritionData()
  const moodData = getMoodData()

  const maxActivity = Math.max(...activityData, 1)
  const maxSleep = Math.max(...sleepData, 8)
  const maxNutrition = Math.max(...nutritionData, 2000)
  const maxMood = 5

  const handleExportPDF = () => {
    alert('Exporting PDF report...')
    // PDF export functionality would go here
  }

  const handleShareWhatsApp = () => {
    const text = `My Wellness Report:\nActivity: ${stats.totalActivity} min\nCalories: ${stats.totalCalories}\nSleep: ${stats.avgSleep}h\nMood: ${stats.avgMood}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <div className="wellness-report-page">
      <div className="wellness-report-container">
        <header className="page-header">
          <h1>Wellness Report</h1>
          <p>An overview of your activity, sleep, nutrition, and mood data.</p>
        </header>

        <div className="report-controls">
        <button 
          className={`period-btn ${period === 'daily' ? 'active' : ''}`}
          onClick={() => setPeriod('daily')}
        >
          Daily
        </button>
        <button 
          className={`period-btn ${period === 'weekly' ? 'active' : ''}`}
          onClick={() => setPeriod('weekly')}
        >
          Weekly
        </button>
        <button 
          className={`period-btn ${period === 'monthly' ? 'active' : ''}`}
          onClick={() => setPeriod('monthly')}
        >
          Monthly
        </button>
        <button 
          className={`period-btn ${period === 'yearly' ? 'active' : ''}`}
          onClick={() => setPeriod('yearly')}
        >
          Yearly
        </button>
      </div>

      {/* Daily/Weekly Summary */}
      <section className="weekly-summary">
        <h2>{period === 'daily' ? 'Daily Summary' : period === 'weekly' ? 'Weekly Summary' : period === 'monthly' ? 'Monthly Summary' : 'Yearly Summary'}</h2>
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-label">{period === 'daily' ? 'Today\'s Activity' : 'Total Activity'}</div>
            <div className="summary-value">{stats.totalActivity} min</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">{period === 'daily' ? 'Today\'s Calories' : 'Total Calories'}</div>
            <div className="summary-value">{stats.totalCalories}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Avg. Calories</div>
            <div className="summary-value">{stats.avgCalories}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">{period === 'daily' ? 'Current Mood' : 'Avg. Mood'}</div>
            <div className="summary-value">{stats.avgMood}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">{period === 'daily' ? 'Sleep Duration' : 'Avg. Sleep'}</div>
            <div className="summary-value">{stats.avgSleep} h</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">{period === 'daily' ? 'Sleep Quality' : 'Avg. Quality'}</div>
            <div className="summary-value">{stats.avgQuality}/5</div>
          </div>
          {period !== 'daily' && (
            <div className="summary-card">
              <div className="summary-label">Active Days</div>
              <div className="summary-value">{stats.activeDays} Days</div>
            </div>
          )}
        </div>
      </section>

      {/* Charts */}
      <section className="charts-section">
        {/* Activity Chart */}
        <div className="chart-card">
          <h3>Activity</h3>
          <div className="chart-container">
            <div className="chart-bars">
              {chartDays.map((day, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bar" style={{ height: `${maxActivity > 0 ? (activityData[index] / maxActivity) * 100 : 0}%` }}></div>
                  <span className="chart-label">
                    {period === 'daily' ? day.label : period === 'yearly' ? day.dayName : day.dayName}
                  </span>
                </div>
              ))}
            </div>
            <div className="chart-axis-label">Minutes</div>
          </div>
        </div>

        {/* Sleep Chart */}
        <div className="chart-card">
          <h3>Sleep</h3>
          <div className="chart-container">
            <div className="chart-bars">
              {chartDays.map((day, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bar" style={{ height: `${maxSleep > 0 ? (sleepData[index] / maxSleep) * 100 : 0}%` }}></div>
                  <span className="chart-label">
                    {period === 'daily' ? day.label : period === 'yearly' ? day.dayName : day.fullDate}
                  </span>
                </div>
              ))}
            </div>
            <div className="chart-axis-label">Hours</div>
          </div>
        </div>

        {/* Nutrition Chart */}
        <div className="chart-card">
          <h3>Nutrition</h3>
          <div className="chart-container">
            <div className="chart-bars">
              {chartDays.map((day, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bar" style={{ height: `${maxNutrition > 0 ? (nutritionData[index] / maxNutrition) * 100 : 0}%` }}></div>
                  <span className="chart-label">
                    {period === 'daily' ? day.label : period === 'yearly' ? day.dayName : day.dayName}
                  </span>
                </div>
              ))}
            </div>
            <div className="chart-axis-label">Calories</div>
          </div>
        </div>

        {/* Mood Chart */}
        <div className="chart-card">
          <h3>Mood</h3>
          <div className="chart-container">
            <div className="chart-bars">
              {chartDays.map((day, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bar" style={{ height: `${maxMood > 0 ? (moodData[index] / maxMood) * 100 : 0}%` }}></div>
                  <span className="chart-label">
                    {period === 'daily' ? day.label : period === 'yearly' ? day.dayName : day.dayName}
                  </span>
                </div>
              ))}
            </div>
            <div className="chart-axis-label">Mood</div>
          </div>
        </div>
      </section>

      {/* Health Profile */}
      <section className="health-profile">
        <h2>Health Profile</h2>
        <div className="health-profile-card">
          <h3>Health Conditions</h3>
          <p>No health conditions listed. You can add them on your personal information page to get more personalized insights.</p>
        </div>
      </section>

      {/* Logs */}
      <section className="logs-section">
        <h2>Logs</h2>
        <div className="logs-grid">
          <a href="/body/activity" className="log-card">
            <Activity size={24} />
            <span>Activity Log</span>
          </a>
          <a href="/body/sleep" className="log-card">
            <Moon size={24} />
            <span>Sleep Log</span>
          </a>
          <a href="/body/nutrition" className="log-card">
            <Apple size={24} />
            <span>Nutrition Log</span>
          </a>
          <a href="/wellness/mood" className="log-card">
            <Heart size={24} />
            <span>Mood Log</span>
          </a>
        </div>
      </section>

      {/* Export & Share */}
      <section className="export-section">
        <h2>Export & Share</h2>
        <div className="export-actions">
          <button className="export-btn" onClick={handleExportPDF}>
            <Download size={20} />
            <span>Export Full PDF Report</span>
          </button>
          <button className="share-btn" onClick={handleShareWhatsApp}>
            <Share2 size={20} />
            <span>Share to WhatsApp</span>
          </button>
        </div>
      </section>
      </div>
    </div>
  )
}

export default WellnessReport

