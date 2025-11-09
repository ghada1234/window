import { useState, useMemo } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Heart, TrendingUp, Calendar, Edit2, Trash2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './MoodTracker.css'

const MoodTracker = () => {
  const { t } = useTranslation()
  const { moodLogs, addMoodLog, updateMoodLog, deleteMoodLog } = useWellness()
  const [mood, setMood] = useState('')
  const [energy, setEnergy] = useState('')
  const [factors, setFactors] = useState([])
  const [notes, setNotes] = useState('')
  const [editingMood, setEditingMood] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const moodOptions = [
    { emoji: '😄', label: t('moodTracker.excellent'), value: 'Excellent' },
    { emoji: '😊', label: t('moodTracker.good'), value: 'Good' },
    { emoji: '😐', label: t('moodTracker.okay'), value: 'Okay' },
    { emoji: '😔', label: t('moodTracker.low'), value: 'Low' },
    { emoji: '😢', label: t('moodTracker.poor'), value: 'Poor' }
  ]

  const energyOptions = [
    { emoji: '⚡', label: t('moodTracker.high'), value: 'High' },
    { emoji: '💪', label: t('moodTracker.good'), value: 'Good' },
    { emoji: '😌', label: t('moodTracker.moderate'), value: 'Moderate' },
    { emoji: '😴', label: t('moodTracker.low'), value: 'Low' },
    { emoji: '💤', label: t('moodTracker.exhausted'), value: 'Exhausted' }
  ]

  const moodFactors = [
    { emoji: '💼', label: t('moodTracker.workStress'), id: 'work-stress' },
    { emoji: '👨‍👩‍👧‍👦', label: t('moodTracker.familyTime'), id: 'family-time' },
    { emoji: '😴', label: t('moodTracker.goodSleep'), id: 'good-sleep' },
    { emoji: '👥', label: t('moodTracker.social'), id: 'social' },
    { emoji: '🧘', label: t('moodTracker.relaxed'), id: 'relaxed' },
    { emoji: '😰', label: t('moodTracker.anxious'), id: 'anxious' },
    { emoji: '🙏', label: t('moodTracker.grateful'), id: 'grateful' },
    { emoji: '✅', label: t('moodTracker.productive'), id: 'productive' },
    { emoji: '🎨', label: t('moodTracker.creative'), id: 'creative' },
    { emoji: '😪', label: t('moodTracker.tired'), id: 'tired' },
    { emoji: '🎉', label: t('moodTracker.excited'), id: 'excited' }
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
      if (editingMood) {
        // Update existing mood log
        updateMoodLog(editingMood.id, {
          mood: moodOptions.find(m => m.value === mood)?.label || mood,
          moodEmoji: moodOptions.find(m => m.value === mood)?.emoji || '',
          energy: energyOptions.find(e => e.value === energy)?.label || energy,
          energyEmoji: energyOptions.find(e => e.value === energy)?.emoji || '',
          factors: factors.map(id => moodFactors.find(f => f.id === id)).filter(Boolean),
          notes
        })
        setEditingMood(null)
      } else {
        // Add new mood log
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
      }
      setMood('')
      setEnergy('')
      setFactors([])
      setNotes('')
    }
  }

  const handleEditMood = (moodLog) => {
    setEditingMood(moodLog)
    const moodValue = moodOptions.find(m => m.label === moodLog.mood || m.value === moodLog.mood)?.value || ''
    const energyValue = energyOptions.find(e => e.label === moodLog.energy || e.value === moodLog.energy)?.value || ''
    setMood(moodValue)
    setEnergy(energyValue)
    setFactors(moodLog.factors?.map(f => f.id) || [])
    setNotes(moodLog.notes || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingMood(null)
    setMood('')
    setEnergy('')
    setFactors([])
    setNotes('')
  }

  const handleDeleteMood = (moodId) => {
    deleteMoodLog(moodId)
    setDeleteConfirm(null)
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
          <h1>{t('moodTracker.title')}</h1>
          <p>{t('moodTracker.subtitle')}</p>
        </header>

        <div className="mood-tracker-content">
          {/* Left Side - Form */}
          <div className="mood-form-section">
            <form onSubmit={handleSaveMood} className="mood-form">
              <div className="form-section">
                <label className="form-label">{t('moodTracker.howFeeling')}</label>
                <p className="form-subtitle">{t('moodTracker.rightNowMood')}</p>
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
                <label className="form-label">{t('moodTracker.energyLevel')}</label>
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
                <label className="form-label">{t('moodTracker.whatInfluencing')}</label>
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
                <label className="form-label">{t('moodTracker.anythingOnMind')}</label>
                <p className="form-subtitle">{t('moodTracker.reflectPlaceholder')}</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('moodTracker.reflectPlaceholder')}
                  rows="4"
                  className="notes-textarea"
                />
              </div>

              <div className="form-actions">
                {editingMood && (
                  <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                    {t('common.cancel')}
                  </button>
                )}
                <button type="submit" className="save-mood-btn" disabled={!mood || !energy}>
                  {editingMood ? t('common.update') : t('moodTracker.saveMoodEntry')}
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Charts and Insights */}
          <div className="mood-insights-section">
            {/* Charts */}
            <div className="charts-row">
              <div className="chart-card">
                <h3>{t('moodTracker.moodThisWeek')}</h3>
                {moodLogs.length === 0 ? (
                  <div className="no-data">
                    <p>{t('moodTracker.noDataYet')}</p>
                    <span>{t('moodTracker.logMoodForTrends')}</span>
                  </div>
                ) : (
                  <div className="chart-placeholder">
                    <TrendingUp size={48} />
                    <p>Chart visualization coming soon</p>
                  </div>
                )}
              </div>

              <div className="chart-card">
                <h3>{t('moodTracker.energyThisWeek')}</h3>
                {moodLogs.length === 0 ? (
                  <div className="no-data">
                    <p>{t('moodTracker.noDataYet')}</p>
                    <span>{t('moodTracker.logEnergyForTrends')}</span>
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
              <h3>{t('moodTracker.moodInsights')}</h3>
              <div className="insights-grid">
                <div className="insight-item">
                  <span className="insight-emoji">{insights.avgMoodEmoji}</span>
                  <div>
                    <div className="insight-label">{t('moodTracker.avgMood')}</div>
                    <div className="insight-value">{insights.avgMood}</div>
                  </div>
                </div>
                <div className="insight-item">
                  <Calendar size={24} />
                  <div>
                    <div className="insight-label">{t('moodTracker.topFactor')}</div>
                    <div className="insight-value">{insights.topFactor}</div>
                  </div>
                </div>
                <div className="insight-item">
                  <TrendingUp size={24} />
                  <div>
                    <div className="insight-label">{t('moodTracker.dayStreak')}</div>
                    <div className="insight-value">{insights.dayStreak}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Entries */}
            <div className="recent-entries-card">
              <h3>{t('moodTracker.recentEntries')}</h3>
              {recentEntries.length === 0 ? (
                <div className="no-entries">
                  <p>{t('moodTracker.noEntries')}</p>
                </div>
              ) : (
                <div className="entries-list">
                  {recentEntries.map(entry => (
                    <div key={entry.id} className="entry-item">
                      <div className="entry-main">
                        <div className="entry-mood-energy">
                          <span>{entry.moodEmoji || '😊'} {entry.mood || t('moodTracker.good')} {t('moodTracker.moodLabel')},</span>
                          <span>{entry.energyEmoji || '😌'} {entry.energy || t('moodTracker.moderate')} {t('moodTracker.energyLabel')}</span>
                        </div>
                        <div className="entry-date">{entry.dateString || entry.date}</div>
                        <div className="entry-actions">
                          <button 
                            className="icon-btn edit-btn" 
                            onClick={() => handleEditMood(entry)}
                            title={t('common.edit')}
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            className="icon-btn delete-btn" 
                            onClick={() => setDeleteConfirm(entry.id)}
                            title={t('common.delete')}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
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
                    <button className="load-more-btn">{t('common.loadMore')}</button>
                  )}
                </div>
              )}
            </div>
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
                <button className="delete-confirm-btn" onClick={() => handleDeleteMood(deleteConfirm)}>
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

export default MoodTracker



            {/* Recent Entries */}
            <div className="recent-entries-card">
              <h3>{t('moodTracker.recentEntries')}</h3>
              {recentEntries.length === 0 ? (
                <div className="no-entries">
                  <p>{t('moodTracker.noEntries')}</p>
                </div>
              ) : (
                <div className="entries-list">
                  {recentEntries.map(entry => (
                    <div key={entry.id} className="entry-item">
                      <div className="entry-main">
                        <div className="entry-mood-energy">
                          <span>{entry.moodEmoji || '😊'} {entry.mood || t('moodTracker.good')} {t('moodTracker.moodLabel')},</span>
                          <span>{entry.energyEmoji || '😌'} {entry.energy || t('moodTracker.moderate')} {t('moodTracker.energyLabel')}</span>
                        </div>
                        <div className="entry-date">{entry.dateString || entry.date}</div>
                        <div className="entry-actions">
                          <button 
                            className="icon-btn edit-btn" 
                            onClick={() => handleEditMood(entry)}
                            title={t('common.edit')}
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            className="icon-btn delete-btn" 
                            onClick={() => setDeleteConfirm(entry.id)}
                            title={t('common.delete')}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
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
                    <button className="load-more-btn">{t('common.loadMore')}</button>
                  )}
                </div>
              )}
            </div>
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
                <button className="delete-confirm-btn" onClick={() => handleDeleteMood(deleteConfirm)}>
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

export default MoodTracker


