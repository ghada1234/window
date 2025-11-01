import { useState, useMemo } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Heart, TrendingUp, Calendar } from 'lucide-react'
import './MoodTracker.css'

const MoodTracker = () => {
  const { moodLogs, addMoodLog } = useWellness()
  const [mood, setMood] = useState('')
  const [energy, setEnergy] = useState('')
  const [factors, setFactors] = useState([])
  const [notes, setNotes] = useState('')

  const moodOptions = [
    { emoji: '😄', label: 'Excellent', value: 'Excellent' },
    { emoji: '😊', label: 'Good', value: 'Good' },
    { emoji: '😐', label: 'Okay', value: 'Okay' },
    { emoji: '😔', label: 'Low', value: 'Low' },
    { emoji: '😢', label: 'Poor', value: 'Poor' }
  ]

  const energyOptions = [
    { emoji: '⚡', label: 'High', value: 'High' },
    { emoji: '💪', label: 'Good', value: 'Good' },
    { emoji: '😌', label: 'Moderate', value: 'Moderate' },
    { emoji: '😴', label: 'Low', value: 'Low' },
    { emoji: '💤', label: 'Exhausted', value: 'Exhausted' }
  ]

  const moodFactors = [
    { emoji: '💼', label: 'Work Stress', id: 'work-stress' },
    { emoji: '👨‍👩‍👧‍👦', label: 'Family Time', id: 'family-time' },
    { emoji: '😴', label: 'Good Sleep', id: 'good-sleep' },
    { emoji: '👥', label: 'Social', id: 'social' },
    { emoji: '🧘', label: 'Relaxed', id: 'relaxed' },
    { emoji: '😰', label: 'Anxious', id: 'anxious' },
    { emoji: '🙏', label: 'Grateful', id: 'grateful' },
    { emoji: '✅', label: 'Productive', id: 'productive' },
    { emoji: '🎨', label: 'Creative', id: 'creative' },
    { emoji: '😪', label: 'Tired', id: 'tired' },
    { emoji: '🎉', label: 'Excited', id: 'excited' }
  ]

  const toggleFactor = (factorId) => {
    setFactors(prev => 
      prev.includes(factorId) 
        ? prev.filter(id => id !== factorId)
        : [...prev, factorId]
    )
  }

  const handleSaveMood = (e) => {
    e.preventDefault()
    if (mood && energy) {
      const moodEntry = {
        id: Date.now(),
        mood: moodOptions.find(m => m.value === mood)?.label || mood,
        moodEmoji: moodOptions.find(m => m.value === mood)?.emoji || '',
        energy: energyOptions.find(e => e.value === energy)?.label || energy,
        energyEmoji: energyOptions.find(e => e.value === energy)?.emoji || '',
        factors: factors.map(id => moodFactors.find(f => f.id === id)).filter(Boolean),
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
      addMoodLog(moodEntry)
      setMood('')
      setEnergy('')
      setFactors([])
      setNotes('')
    }
  }

  // Calculate insights
  const insights = useMemo(() => {
    if (moodLogs.length === 0) {
      return { avgMood: 'N/A', topFactor: '0', dayStreak: 0 }
    }

    const moodValues = { 'Excellent': 5, 'Good': 4, 'Okay': 3, 'Low': 2, 'Poor': 1 }
    const avgMoodValue = moodLogs.reduce((sum, log) => {
      const moodKey = typeof log.mood === 'string' ? log.mood : log.mood?.label || 'Okay'
      return sum + (moodValues[moodKey] || 3)
    }, 0) / moodLogs.length

    const avgMoodLabel = Object.keys(moodValues).find(key => 
      moodValues[key] === Math.round(avgMoodValue)
    ) || 'Okay'

    // Count factors
    const factorCounts = {}
    moodLogs.forEach(log => {
      const logFactors = log.factors || []
      logFactors.forEach(factor => {
        const factorId = typeof factor === 'string' ? factor : factor.id
        factorCounts[factorId] = (factorCounts[factorId] || 0) + 1
      })
    })

    const topFactorId = Object.keys(factorCounts).reduce((a, b) => 
      factorCounts[a] > factorCounts[b] ? a : b, '0'
    )

    // Calculate streak
    const sortedLogs = [...moodLogs].sort((a, b) => 
      new Date(b.date || b.dateString) - new Date(a.date || a.dateString)
    )
    let streak = 0
    const today = new Date().toDateString()
    for (let i = 0; i < sortedLogs.length; i++) {
      const logDate = new Date(sortedLogs[i].date || sortedLogs[i].dateString).toDateString()
      const expectedDate = new Date(today)
      expectedDate.setDate(expectedDate.getDate() - i)
      if (logDate === expectedDate.toDateString()) {
        streak++
      } else {
        break
      }
    }

    const topFactor = moodFactors.find(f => f.id === topFactorId)

    return {
      avgMood: avgMoodLabel,
      avgMoodEmoji: moodOptions.find(m => m.label === avgMoodLabel)?.emoji || '😊',
      topFactor: topFactor ? `${topFactor.emoji} ${topFactor.label}` : '0',
      dayStreak: streak
    }
  }, [moodLogs])

  // Get recent entries
  const recentEntries = useMemo(() => {
    return [...moodLogs].sort((a, b) => 
      new Date(b.date || b.dateString) - new Date(a.date || a.dateString)
    ).slice(0, 10)
  }, [moodLogs])

  return (
    <div className="mood-tracker-page">
      <div className="mood-tracker-container">
        <header className="page-header">
          <h1>Mood Tracker</h1>
          <p>Check in with your emotions to understand your mental landscape.</p>
        </header>

        <div className="mood-tracker-content">
          {/* Left Side - Form */}
          <div className="mood-form-section">
            <form onSubmit={handleSaveMood} className="mood-form">
              <div className="form-section">
                <label className="form-label">How are you feeling?</label>
                <p className="form-subtitle">Right now, my mood is...</p>
                <div className="mood-grid">
                  {moodOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      className={`mood-btn ${mood === option.value ? 'selected' : ''}`}
                      onClick={() => setMood(option.value)}
                    >
                      <span className="mood-emoji">{option.emoji}</span>
                      <span className="mood-label">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label className="form-label">My energy level is...</label>
                <div className="energy-grid">
                  {energyOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      className={`energy-btn ${energy === option.value ? 'selected' : ''}`}
                      onClick={() => setEnergy(option.value)}
                    >
                      <span className="energy-emoji">{option.emoji}</span>
                      <span className="energy-label">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label className="form-label">What might be influencing your mood?</label>
                <div className="factors-grid">
                  {moodFactors.map(factor => (
                    <button
                      key={factor.id}
                      type="button"
                      className={`factor-btn ${factors.includes(factor.id) ? 'selected' : ''}`}
                      onClick={() => toggleFactor(factor.id)}
                    >
                      <span>{factor.emoji}</span>
                      <span>{factor.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label className="form-label">Anything on your mind?</label>
                <p className="form-subtitle">Reflect on your feelings, triggers, and thoughts...</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Reflect on your feelings, triggers, and thoughts..."
                  rows="4"
                  className="notes-textarea"
                />
              </div>

              <button type="submit" className="save-mood-btn" disabled={!mood || !energy}>
                Save Mood Entry
              </button>
            </form>
          </div>

          {/* Right Side - Charts and Insights */}
          <div className="mood-insights-section">
            {/* Charts */}
            <div className="charts-row">
              <div className="chart-card">
                <h3>Mood This Week</h3>
                {moodLogs.length === 0 ? (
                  <div className="no-data">
                    <p>No Data Yet</p>
                    <span>Log your mood for a few days to see trends.</span>
                  </div>
                ) : (
                  <div className="chart-placeholder">
                    <TrendingUp size={48} />
                    <p>Chart visualization coming soon</p>
                  </div>
                )}
              </div>

              <div className="chart-card">
                <h3>Energy This Week</h3>
                {moodLogs.length === 0 ? (
                  <div className="no-data">
                    <p>No Data Yet</p>
                    <span>Log your energy levels to see trends.</span>
                  </div>
                ) : (
                  <div className="chart-placeholder">
                    <TrendingUp size={48} />
                    <p>Chart visualization coming soon</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mood Insights */}
            <div className="insights-card">
              <h3>Mood Insights</h3>
              <div className="insights-grid">
                <div className="insight-item">
                  <span className="insight-emoji">{insights.avgMoodEmoji}</span>
                  <div>
                    <div className="insight-label">Avg. Mood</div>
                    <div className="insight-value">{insights.avgMood}</div>
                  </div>
                </div>
                <div className="insight-item">
                  <Calendar size={24} />
                  <div>
                    <div className="insight-label">Top Factor</div>
                    <div className="insight-value">{insights.topFactor}</div>
                  </div>
                </div>
                <div className="insight-item">
                  <TrendingUp size={24} />
                  <div>
                    <div className="insight-label">Day Streak</div>
                    <div className="insight-value">{insights.dayStreak}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Entries */}
            <div className="recent-entries-card">
              <h3>Recent Mood Entries</h3>
              {recentEntries.length === 0 ? (
                <div className="no-entries">
                  <p>No mood entries yet. Start tracking your mood!</p>
                </div>
              ) : (
                <div className="entries-list">
                  {recentEntries.map(entry => (
                    <div key={entry.id} className="entry-item">
                      <div className="entry-main">
                        <div className="entry-mood-energy">
                          <span>{entry.moodEmoji || '😊'} {entry.mood || 'Good'} mood,</span>
                          <span>{entry.energyEmoji || '😌'} {entry.energy || 'Moderate'} energy</span>
                        </div>
                        <div className="entry-date">{entry.dateString || entry.date}</div>
                      </div>
                      {entry.factors && entry.factors.length > 0 && (
                        <div className="entry-factors">
                          {entry.factors.map((factor, idx) => {
                            const factorData = typeof factor === 'object' ? factor : moodFactors.find(f => f.id === factor)
                            return factorData ? (
                              <span key={idx} className="factor-tag">
                                {factorData.emoji} {factorData.label}
                              </span>
                            ) : null
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                  {recentEntries.length >= 10 && (
                    <button className="load-more-btn">Load More</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoodTracker


