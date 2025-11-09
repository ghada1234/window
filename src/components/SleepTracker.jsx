import { useState, useMemo } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Moon, Coffee, Smartphone, UtensilsCrossed, Wine, Thermometer, Volume2, Bed, Book, Watch, TrendingUp, BarChart3, Edit2, Trash2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './SleepTracker.css'

const SleepTracker = () => {
  const { t, i18n } = useTranslation()
  const { sleepLogs, addSleepLog, updateSleepLog, deleteSleepLog } = useWellness()
  const [bedtime, setBedtime] = useState('10:30 PM')
  const [wakeTime, setWakeTime] = useState('06:30 AM')
  const [quality, setQuality] = useState('')
  const [factors, setFactors] = useState([])
  const [notes, setNotes] = useState('')
  const [editingSleepLog, setEditingSleepLog] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const sleepFactors = [
    { id: 'caffeine', icon: Coffee, label: t('sleepTracker.caffeineLate'), emoji: '☕️' },
    { id: 'screen', icon: Smartphone, label: t('sleepTracker.screenTime'), emoji: '📱' },
    { id: 'meal', icon: UtensilsCrossed, label: t('sleepTracker.heavyMeal'), emoji: '🍔' },
    { id: 'alcohol', icon: Wine, label: t('sleepTracker.alcohol'), emoji: '🍷' },
    { id: 'temp', icon: Thermometer, label: t('sleepTracker.roomTemp'), emoji: '🌡️' },
    { id: 'noise', icon: Volume2, label: t('sleepTracker.noise'), emoji: '🔊' },
    { id: 'bed', icon: Bed, label: t('sleepTracker.comfyBed'), emoji: '🛏️' },
    { id: 'reading', icon: Book, label: t('sleepTracker.reading'), emoji: '📚' }
  ]

  const qualities = [
    { emoji: '✨', label: t('sleepTracker.excellent'), value: 'Excellent' },
    { emoji: '😊', label: t('sleepTracker.good'), value: 'Good' },
    { emoji: '🙂', label: t('sleepTracker.fair'), value: 'Fair' },
    { emoji: '😕', label: t('sleepTracker.poor'), value: 'Poor' },
    { emoji: '😫', label: t('sleepTracker.terrible'), value: 'Terrible' }
  ]

  const toggleFactor = (id) => {
    setFactors(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id)
        : [...prev, id]
    )
  }

  // Helper function to translate quality labels
  const getTranslatedQuality = (quality) => {
    const qualityMap = {
      'Excellent': t('sleepTracker.excellent'),
      'Good': t('sleepTracker.good'),
      'Fair': t('sleepTracker.fair'),
      'Poor': t('sleepTracker.poor'),
      'Terrible': t('sleepTracker.terrible')
    }
    return qualityMap[quality] || quality
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
      
      if (editingSleepLog) {
        // Update existing sleep log
        updateSleepLog(editingSleepLog.id, {
          bedtime,
          wakeTime,
          duration: `${diff.toFixed(2)} hours`,
          durationHours: diff.toFixed(2),
          quality: qualityObj?.label || quality,
          qualityEmoji: qualityObj?.emoji || '',
          factors,
          notes
        })
        setEditingSleepLog(null)
      } else {
        // Add new sleep log
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
      }
      setBedtime('10:30 PM')
      setWakeTime('06:30 AM')
      setQuality('')
      setFactors([])
      setNotes('')
    }
  }

  const handleEditSleepLog = (log) => {
    setEditingSleepLog(log)
    setBedtime(log.bedtime)
    setWakeTime(log.wakeTime)
    setQuality(log.quality)
    setFactors(log.factors || [])
    setNotes(log.notes || '')
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingSleepLog(null)
    setBedtime('10:30 PM')
    setWakeTime('06:30 AM')
    setQuality('')
    setFactors([])
    setNotes('')
  }

  const handleDeleteSleepLog = (logId) => {
    deleteSleepLog(logId)
    setDeleteConfirm(null)
  }

  // Calculate sleep insights
  const sleepInsights = useMemo(() => {
    if (sleepLogs.length === 0) {
      return { avgSleep: t('sleepTracker.na'), avgQuality: t('sleepTracker.na'), daysTracked: 0 }
    }

    const avgSleepHours = sleepLogs.reduce((sum, log) => {
      const hours = parseFloat(log.durationHours || log.duration?.replace(' hours', '') || '0')
      return sum + hours
    }, 0) / sleepLogs.length

    const qualityMap = { 'Excellent': 5, 'Good': 4, 'Fair': 3, 'Poor': 2, 'Terrible': 1 }
    const avgQualityValue = sleepLogs.reduce((sum, log) => {
      const qualityKey = log.quality || t('sleepTracker.fair')
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
  }, [sleepLogs, t])

  // Get this week's sleep data for chart
  const weekData = useMemo(() => {
    const today = new Date()
    const locale = i18n.language === 'ar' ? 'ar-AE' : 'en-US'
    const weekDates = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (6 - i)) // Last 7 days
      return {
        date: date.toDateString(),
        dayName: date.toLocaleDateString(locale, { weekday: 'short' })
      }
    })

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
  }, [sleepLogs, i18n.language])

  const maxHours = Math.max(...weekData.map(d => d.hours), 8)

  return (
    <div className="sleep-tracker-page">
      <div className="sleep-tracker-container">
        <header className="page-header">
          <h1>{t('sleepTracker.title')}</h1>
          <p>{t('sleepTracker.subtitle')}</p>
        </header>

        <div className="sleep-content">
          <div className="sleep-log-form">
            <h2>{editingSleepLog ? `${t('common.edit')} ${t('sleepTracker.sleepLog')}` : t('sleepTracker.logLastNight')}</h2>
            <form onSubmit={handleSaveSleep} className="sleep-form">
              <div className="form-row">
                <div className="form-group">
                  <label>{t('sleepTracker.bedtime')}</label>
                  <input
                    type="text"
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    placeholder="10:30 PM"
                  />
                </div>

                <div className="form-group">
                  <label>{t('sleepTracker.wakeTime')}</label>
                  <input
                    type="text"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    placeholder="06:30 AM"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t('sleepTracker.sleepQuality')}</label>
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
                <label>{t('sleepTracker.sleepFactors')}</label>
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
                <label>{t('sleepTracker.additionalNotes')}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('sleepTracker.notesPlaceholder')}
                  rows={3}
                />
              </div>

              <div className="form-actions">
                {editingSleepLog && (
                  <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                    {t('common.cancel')}
                  </button>
                )}
                <button type="submit" className="save-sleep-btn">
                  {editingSleepLog ? t('common.update') : t('sleepTracker.saveSleepData')}
                </button>
              </div>
            </form>
          </div>

          <div className="sleep-log-history">
            <h2>{t('sleepTracker.sleepLog')}</h2>
            <p className="section-subtitle">{t('sleepTracker.recentLogs')}</p>
            <div className="logs-list">
              {sleepLogs.length === 0 ? (
                <div className="no-sleep-logs">
                  <Moon size={48} />
                  <p>{t('sleepTracker.noLogs')}</p>
                </div>
              ) : (
                <>
                  {[...sleepLogs].sort((a, b) => new Date(b.date || b.dateString) - new Date(a.date || a.dateString)).slice(0, 10).map((log) => (
                    <div key={log.id} className="sleep-log-item">
                      <div className="sleep-main-info">
                        <div className="sleep-duration-large">{log.durationHours || log.duration?.replace(' hours', '') || '0'} {t('sleepTracker.hours')}</div>
                        <div className="sleep-quality-badge">
                          <span className="quality-emoji-small">{log.qualityEmoji || ''}</span>
                          <span className="sleep-quality-text">{getTranslatedQuality(log.quality)} {t('sleepTracker.sleep')}</span>
                          <span className="sleep-date">{t('sleepTracker.on')} {new Date(log.date || log.dateString).toLocaleString(i18n.language === 'ar' ? 'ar-AE' : 'en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                          })}</span>
                        </div>
                        <div className="sleep-actions">
                          <button 
                            className="icon-btn edit-btn" 
                            onClick={() => handleEditSleepLog(log)}
                            title={t('common.edit')}
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            className="icon-btn delete-btn" 
                            onClick={() => setDeleteConfirm(log.id)}
                            title={t('common.delete')}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="sleep-time-info">
                        {t('sleepTracker.bedtimeLabel')}: {log.bedtime} - {t('sleepTracker.wakeTimeLabel')}: {log.wakeTime}
                      </div>
                    </div>
                  ))}
                  {sleepLogs.length > 10 && (
                    <button className="load-more-btn">{t('common.loadMore')}</button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sleep Patterns This Week */}
        <div className="sleep-patterns-section">
          <h2>{t('sleepTracker.sleepPatternsWeek')}</h2>
          <p className="section-subtitle">{t('sleepTracker.sleepGoal')}</p>
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
          <h2>{t('sleepTracker.sleepInsights')}</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-value">{sleepInsights.avgSleep}</div>
              <div className="insight-label">{t('sleepTracker.avgSleep')}</div>
            </div>
            <div className="insight-card">
              <div className="insight-value">{getTranslatedQuality(sleepInsights.avgQuality)}</div>
              <div className="insight-label">{t('sleepTracker.avgQuality')}</div>
            </div>
            <div className="insight-card">
              <div className="insight-value">{sleepInsights.daysTracked}</div>
              <div className="insight-label">{t('sleepTracker.daysTracked')}</div>
            </div>
          </div>
        </div>

        {/* Sleep Improvement Tips */}
        <div className="sleep-tips">
          <h2>{t('sleepTracker.improvementTips')}</h2>
          <p className="section-subtitle">{t('sleepTracker.tipsSubtitle')}</p>
          <div className="tips-grid">
            {[
              { title: t('sleepTracker.tip1Title'), desc: t('sleepTracker.tip1Desc') },
              { title: t('sleepTracker.tip2Title'), desc: t('sleepTracker.tip2Desc') },
              { title: t('sleepTracker.tip3Title'), desc: t('sleepTracker.tip3Desc') },
              { title: t('sleepTracker.tip4Title'), desc: t('sleepTracker.tip4Desc') }
            ].map((tip, index) => (
              <div key={index} className="tip-card">
                <h3>{tip.title}</h3>
                <p>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{t('common.confirmDelete')}</h2>
                <button className="close-btn" onClick={() => setDeleteConfirm(null)}>
                  <X size={24} />
                </button>
              </div>
              <p className="delete-message">{t('common.deleteMessage')}</p>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setDeleteConfirm(null)}>
                  {t('common.cancel')}
                </button>
                <button className="delete-confirm-btn" onClick={() => handleDeleteSleepLog(deleteConfirm)}>
                  <Trash2 size={18} />
                  {t('common.delete')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SleepTracker


                        {t('sleepTracker.bedtimeLabel')}: {log.bedtime} - {t('sleepTracker.wakeTimeLabel')}: {log.wakeTime}
                      </div>
                    </div>
                  ))}
                  {sleepLogs.length > 10 && (
                    <button className="load-more-btn">{t('common.loadMore')}</button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sleep Patterns This Week */}
        <div className="sleep-patterns-section">
          <h2>{t('sleepTracker.sleepPatternsWeek')}</h2>
          <p className="section-subtitle">{t('sleepTracker.sleepGoal')}</p>
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
          <h2>{t('sleepTracker.sleepInsights')}</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-value">{sleepInsights.avgSleep}</div>
              <div className="insight-label">{t('sleepTracker.avgSleep')}</div>
            </div>
            <div className="insight-card">
              <div className="insight-value">{getTranslatedQuality(sleepInsights.avgQuality)}</div>
              <div className="insight-label">{t('sleepTracker.avgQuality')}</div>
            </div>
            <div className="insight-card">
              <div className="insight-value">{sleepInsights.daysTracked}</div>
              <div className="insight-label">{t('sleepTracker.daysTracked')}</div>
            </div>
          </div>
        </div>

        {/* Sleep Improvement Tips */}
        <div className="sleep-tips">
          <h2>{t('sleepTracker.improvementTips')}</h2>
          <p className="section-subtitle">{t('sleepTracker.tipsSubtitle')}</p>
          <div className="tips-grid">
            {[
              { title: t('sleepTracker.tip1Title'), desc: t('sleepTracker.tip1Desc') },
              { title: t('sleepTracker.tip2Title'), desc: t('sleepTracker.tip2Desc') },
              { title: t('sleepTracker.tip3Title'), desc: t('sleepTracker.tip3Desc') },
              { title: t('sleepTracker.tip4Title'), desc: t('sleepTracker.tip4Desc') }
            ].map((tip, index) => (
              <div key={index} className="tip-card">
                <h3>{tip.title}</h3>
                <p>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{t('common.confirmDelete')}</h2>
                <button className="close-btn" onClick={() => setDeleteConfirm(null)}>
                  <X size={24} />
                </button>
              </div>
              <p className="delete-message">{t('common.deleteMessage')}</p>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setDeleteConfirm(null)}>
                  {t('common.cancel')}
                </button>
                <button className="delete-confirm-btn" onClick={() => handleDeleteSleepLog(deleteConfirm)}>
                  <Trash2 size={18} />
                  {t('common.delete')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SleepTracker

