import { useState, useMemo } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Moon, Coffee, Smartphone, UtensilsCrossed, Wine, Thermometer, Volume2, Bed, Book, Watch, TrendingUp, BarChart3 } from 'lucide-react'
import './SleepTracker.css'

const SleepTracker = () => {
  const { sleepLogs, addSleepLog } = useWellness()
  const [bedtime, setBedtime] = useState('10:30 PM')
  const [wakeTime, setWakeTime] = useState('06:30 AM')
  const [quality, setQuality] = useState('')
  const [factors, setFactors] = useState([])
  const [notes, setNotes] = useState('')

  const sleepFactors = [
    { id: 'caffeine', icon: Coffee, label: 'Caffeine Late', emoji: '☕️' },
    { id: 'screen', icon: Smartphone, label: 'Screen Time', emoji: '📱' },
    { id: 'meal', icon: UtensilsCrossed, label: 'Heavy Meal', emoji: '🍔' },
    { id: 'alcohol', icon: Wine, label: 'Alcohol', emoji: '🍷' },
    { id: 'temp', icon: Thermometer, label: 'Room Temp', emoji: '🌡️' },
    { id: 'noise', icon: Volume2, label: 'Noise', emoji: '🔊' },
    { id: 'bed', icon: Bed, label: 'Comfy Bed', emoji: '🛏️' },
    { id: 'reading', icon: Book, label: 'Reading', emoji: '📚' }
  ]

  const qualities = [
    { emoji: '✨', label: 'Excellent', value: 'Excellent' },
    { emoji: '😊', label: 'Good', value: 'Good' },
    { emoji: '🙂', label: 'Fair', value: 'Fair' },
    { emoji: '😕', label: 'Poor', value: 'Poor' },
    { emoji: '😫', label: 'Terrible', value: 'Terrible' }
  ]

  const toggleFactor = (id) => {
    setFactors(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id)
        : [...prev, id]
    )
  }

  const handleSaveSleep = (e) => {
    e.preventDefault()
    if (bedtime && wakeTime && quality) {
      // Calculate duration
      const bed = new Date(`2000-01-01 ${bedtime}`)
      const wake = new Date(`2000-01-02 ${wakeTime}`)
      if (wake < bed) wake.setDate(wake.getDate() + 1)
      const diff = (wake - bed) / (1000 * 60 * 60)
      
      const qualityObj = qualities.find(q => q.value === quality || q.label === quality)
      const log = {
        id: Date.now(),
        bedtime,
        wakeTime,
        duration: `${diff.toFixed(2)} hours`,
        durationHours: diff.toFixed(2),
        quality: qualityObj?.label || quality,
        qualityEmoji: qualityObj?.emoji || '',
        factors,
        notes,
        date: new Date().toISOString(),
        dateString: new Date().toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      }
      addSleepLog(log)
      setBedtime('10:30 PM')
      setWakeTime('06:30 AM')
      setQuality('')
      setFactors([])
      setNotes('')
    }
  }

  // Calculate sleep insights
  const sleepInsights = useMemo(() => {
    if (sleepLogs.length === 0) {
      return { avgSleep: 'N/A', avgQuality: 'N/A', daysTracked: 0 }
    }

    const avgSleepHours = sleepLogs.reduce((sum, log) => {
      const hours = parseFloat(log.durationHours || log.duration?.replace(' hours', '') || '0')
      return sum + hours
    }, 0) / sleepLogs.length

    const qualityMap = { 'Excellent': 5, 'Good': 4, 'Fair': 3, 'Poor': 2, 'Terrible': 1 }
    const avgQualityValue = sleepLogs.reduce((sum, log) => {
      const qualityKey = log.quality || 'Fair'
      return sum + (qualityMap[qualityKey] || 3)
    }, 0) / sleepLogs.length

    const avgQualityLabel = Object.keys(qualityMap).find(key => 
      qualityMap[key] === Math.round(avgQualityValue)
    ) || 'Fair'

    const uniqueDays = new Set(sleepLogs.map(log => {
      const date = new Date(log.date || log.dateString)
      return date.toDateString()
    })).size

    return {
      avgSleep: avgSleepHours.toFixed(1),
      avgQuality: avgQualityLabel,
      daysTracked: uniqueDays
    }
  }, [sleepLogs])

  // Get this week's sleep data for chart
  const getThisWeekSleep = () => {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      weekDates.push({
        date: date.toDateString(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
      })
    }

    return weekDates.map(day => {
      const daySleep = sleepLogs.find(log => {
        const logDate = new Date(log.date || log.dateString).toDateString()
        return logDate === day.date
      })
      return {
        ...day,
        hours: daySleep ? parseFloat(daySleep.durationHours || daySleep.duration?.replace(' hours', '') || '0') : 0
      }
    })
  }

  const weekData = getThisWeekSleep()
  const maxHours = Math.max(...weekData.map(d => d.hours), 8)

  return (
    <div className="sleep-tracker-page">
      <div className="sleep-tracker-container">
        <header className="page-header">
          <h1>Sleep Tracker</h1>
          <p>Monitor your sleep patterns to improve your rest and energy levels.</p>
        </header>

        <div className="sleep-content">
          <div className="sleep-log-form">
            <h2>Log Last Night's Sleep</h2>
            <form onSubmit={handleSaveSleep} className="sleep-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Bedtime</label>
                  <input
                    type="text"
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    placeholder="10:30 PM"
                  />
                </div>

                <div className="form-group">
                  <label>Wake Time</label>
                  <input
                    type="text"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    placeholder="06:30 AM"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>How was your sleep quality?</label>
                <div className="quality-buttons">
                  {qualities.map((q) => (
                    <button
                      key={q.value}
                      type="button"
                      className={`quality-btn ${quality === q.value ? 'active' : ''}`}
                      onClick={() => setQuality(q.value)}
                    >
                      <span className="quality-emoji">{q.emoji}</span>
                      <span className="quality-label">{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>What factors may have affected your sleep?</label>
                <div className="factors-grid">
                  {sleepFactors.map((factor) => {
                    const isSelected = factors.includes(factor.id)
                    return (
                      <button
                        key={factor.id}
                        type="button"
                        className={`factor-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => toggleFactor(factor.id)}
                      >
                        <span className="factor-emoji">{factor.emoji}</span>
                        <span className="factor-label">{factor.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="form-group">
                <label>Additional Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any dreams, thoughts, or interruptions?"
                  rows={3}
                />
              </div>

              <button type="submit" className="save-sleep-btn">Save Sleep Data</button>
            </form>
          </div>

          <div className="sleep-log-history">
            <h2>Sleep Log</h2>
            <p className="section-subtitle">Your recent sleep logs.</p>
            <div className="logs-list">
              {sleepLogs.length === 0 ? (
                <div className="no-sleep-logs">
                  <Moon size={48} />
                  <p>No sleep logs yet. Start tracking your sleep!</p>
                </div>
              ) : (
                <>
                  {[...sleepLogs].sort((a, b) => new Date(b.date || b.dateString) - new Date(a.date || a.dateString)).slice(0, 10).map((log) => (
                    <div key={log.id} className="sleep-log-item">
                      <div className="sleep-main-info">
                        <div className="sleep-duration-large">{log.durationHours || log.duration?.replace(' hours', '') || '0'} hours</div>
                        <div className="sleep-quality-badge">
                          <span className="quality-emoji-small">{log.qualityEmoji || ''}</span>
                          <span className="sleep-quality-text">{log.quality} sleep</span>
                          <span className="sleep-date">on {new Date(log.date || log.dateString).toLocaleString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                          })}</span>
                        </div>
                      </div>
                      <div className="sleep-time-info">
                        Bedtime: {log.bedtime} - Wake Time: {log.wakeTime}
                      </div>
                    </div>
                  ))}
                  {sleepLogs.length > 10 && (
                    <button className="load-more-btn">Load More</button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sleep Patterns This Week */}
        <div className="sleep-patterns-section">
          <h2>Sleep Patterns This Week</h2>
          <p className="section-subtitle">Your sleep goal is 8 hours per night.</p>
          <div className="sleep-chart-card">
            <div className="sleep-chart">
              {weekData.map((day, index) => (
                <div key={index} className="chart-day">
                  <div className="chart-bar-container">
                    <div 
                      className="chart-bar-sleep" 
                      style={{ height: `${(day.hours / maxHours) * 100}%` }}
                    ></div>
                  </div>
                  <span className="chart-day-label">{day.dayName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sleep Insights */}
        <div className="sleep-insights-section">
          <h2>Sleep Insights</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-value">{sleepInsights.avgSleep}</div>
              <div className="insight-label">Avg. Sleep</div>
            </div>
            <div className="insight-card">
              <div className="insight-value">{sleepInsights.avgQuality}</div>
              <div className="insight-label">Avg. Quality</div>
            </div>
            <div className="insight-card">
              <div className="insight-value">{sleepInsights.daysTracked}</div>
              <div className="insight-label">Days Tracked</div>
            </div>
          </div>
        </div>

        {/* Sleep Improvement Tips */}
        <div className="sleep-tips">
          <h2>Sleep Improvement Tips</h2>
          <p className="section-subtitle">Simple habits for more restful nights.</p>
          <div className="tips-grid">
            {[
              { title: 'Avoid Caffeine & Heavy Meals', desc: 'Avoid stimulants like caffeine or large meals close to bedtime.' },
              { title: 'Create a Relaxing Routine', desc: 'Wind down with a book, soft music, or a warm bath.' },
              { title: 'Limit Screen Time', desc: 'The blue light from screens can disrupt your sleep cycle.' },
              { title: 'Optimize Your Environment', desc: 'Keep your bedroom dark, quiet, and cool.' }
            ].map((tip, index) => (
              <div key={index} className="tip-card">
                <h3>{tip.title}</h3>
                <p>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SleepTracker

