import { useState, useEffect, useMemo } from 'react'
import { useWellness } from '../context/WellnessContext'
import { useNavigate } from 'react-router-dom'
import { Activity, Plus, Clock, Watch, TrendingUp, X, Play, Pause, RotateCcw, BarChart3, Calendar, Flame, Edit2, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './ActivityTracker.css'

const ActivityTracker = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { activities, addActivity, updateActivity, deleteActivity } = useWellness()
  const [showLogForm, setShowLogForm] = useState(false)
  const [activityName, setActivityName] = useState('')
  const [duration, setDuration] = useState('')
  const [calories, setCalories] = useState('')
  const [visibleCount, setVisibleCount] = useState(10)
  
  // Edit state
  const [editingActivity, setEditingActivity] = useState(null)
  
  // Timer state
  const [showTimer, setShowTimer] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  
  // Insights state
  const [showInsights, setShowInsights] = useState(false)
  
  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const locale = i18n.language?.startsWith('ar') ? 'ar-AE' : 'en-US'

  const formatActivityDate = (value) => {
    if (!value) return ''

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      // Attempt to parse legacy string dates
      const fallbackDate = new Date(Date.parse(value))
      if (!Number.isNaN(fallbackDate.getTime())) {
        return fallbackDate.toLocaleString(locale, {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      }
      return value
    }

    return date.toLocaleString(locale, {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  const handleAddActivity = (e) => {
    e.preventDefault()
    if (activityName && duration) {
      if (editingActivity) {
        // Update existing activity
        updateActivity(editingActivity.id, {
          name: activityName.trim(),
          duration: Number(duration),
          calories: Number(calories) || 0
        })
        setEditingActivity(null)
      } else {
        // Add new activity
        const timestamp = new Date().toISOString()
        const activity = {
          id: Date.now(),
          name: activityName.trim(),
          duration: Number(duration),
          calories: Number(calories) || 0,
          date: timestamp
        }
        addActivity(activity)
      }
      setActivityName('')
      setDuration('')
      setCalories('')
      setShowLogForm(false)
      setVisibleCount((prev) => Math.max(prev, 10))
    }
  }

  const handleEditActivity = (activity) => {
    setEditingActivity(activity)
    setActivityName(activity.name)
    setDuration(activity.duration.toString())
    setCalories(activity.calories?.toString() || '')
    setShowLogForm(true)
  }

  const handleCancelEdit = () => {
    setEditingActivity(null)
    setActivityName('')
    setDuration('')
    setCalories('')
    setShowLogForm(false)
  }

  const handleDeleteActivity = (activityId) => {
    deleteActivity(activityId)
    setDeleteConfirm(null)
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10)
  }

  const renderActivityDate = (activity) => {
    if (!activity) return ''
    return formatActivityDate(activity.date || activity.loggedAt)
  }

  // Timer logic
  useEffect(() => {
    let interval
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerRunning])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartPauseTimer = () => {
    setTimerRunning(!timerRunning)
  }

  const handleResetTimer = () => {
    setTimerSeconds(0)
    setTimerRunning(false)
  }

  const handleFinishWorkout = () => {
    if (timerSeconds > 0) {
      const minutes = Math.floor(timerSeconds / 60)
      setDuration(minutes.toString())
      setShowTimer(false)
      setShowLogForm(true)
      handleResetTimer()
    }
  }

  // Activity insights calculations
  const activityStats = useMemo(() => {
    const totalActivities = activities.length
    const totalMinutes = activities.reduce((sum, a) => sum + (a.duration || 0), 0)
    const totalCalories = activities.reduce((sum, a) => sum + (a.calories || 0), 0)
    
    // Last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentActivities = activities.filter(a => new Date(a.date) >= sevenDaysAgo)
    const avgDuration = recentActivities.length > 0 
      ? Math.round(recentActivities.reduce((sum, a) => sum + (a.duration || 0), 0) / recentActivities.length)
      : 0

    // Most common activity
    const activityCounts = {}
    activities.forEach(a => {
      activityCounts[a.name] = (activityCounts[a.name] || 0) + 1
    })
    const mostCommon = Object.entries(activityCounts).sort((a, b) => b[1] - a[1])[0]

    return {
      totalActivities,
      totalMinutes,
      totalCalories,
      avgDuration,
      recentActivities: recentActivities.length,
      mostCommon: mostCommon ? mostCommon[0] : 'N/A'
    }
  }, [activities])

  return (
    <div className="activity-tracker-page">
      <header className="page-header">
        <h1>{t('activityTracker.title')}</h1>
        <p>{t('activityTracker.subtitle')}</p>
      </header>

      {/* Wearable Sync Banner */}
      {activities.length === 0 && (
        <div className="wearable-sync-banner">
          <Watch size={32} />
          <div className="banner-content">
            <h3>{t('activityTracker.syncBanner.title')}</h3>
            <p>{t('activityTracker.syncBanner.description')}</p>
            <button className="sync-nav-btn" onClick={() => navigate('/wearable-sync')}>
              {t('activityTracker.syncBanner.goToSync')}
            </button>
          </div>
        </div>
      )}

      <div className="activity-actions">
        <div className="action-card">
          <h2>{editingActivity ? t('common.edit') : t('activityTracker.logActivitySection')}</h2>
          <p>{t('activityTracker.logDesc')}</p>
          {!showLogForm ? (
            <button className="log-activity-btn" onClick={() => setShowLogForm(true)}>
              <Plus size={18} />
              <span>{t('activityTracker.logNewActivity')}</span>
            </button>
          ) : (
            <form onSubmit={handleAddActivity} className="activity-form">
              <div className="form-group">
                <label htmlFor="activity-name">{t('activityTracker.activityNameLabel')}</label>
                <input
                  id="activity-name"
                  type="text"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder={t('activityTracker.activityNamePlaceholder')}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="activity-duration">{t('activityTracker.durationLabel')}</label>
                  <input
                    id="activity-duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder={t('activityTracker.durationPlaceholder')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="activity-calories">{t('activityTracker.caloriesLabel')}</label>
                  <input
                    id="activity-calories"
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder={t('activityTracker.caloriesPlaceholder')}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                  {t('activityTracker.cancel')}
                </button>
                <button type="submit" className="save-btn">
                  {editingActivity ? t('common.update') : t('activityTracker.saveActivity')}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => setShowTimer(true)}>
            <Clock size={20} />
            <span>{t('activityTracker.workoutTimer')}</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/wearable-sync')}>
            <Watch size={20} />
            <span>{t('activityTracker.wearableDevices')}</span>
          </button>
          <button className="quick-action-btn" onClick={() => setShowInsights(true)}>
            <TrendingUp size={20} />
            <span>{t('activityTracker.progressInsights')}</span>
          </button>
        </div>
      </div>

      <div className="activity-log">
        <h2>{t('activityTracker.activityHistory')}</h2>
        <div className="activities-list">
          {activities.length === 0 ? (
            <div className="no-activities">
              <Activity size={48} />
              <p>{t('activityTracker.noActivities')}</p>
            </div>
          ) : (
            <>
              {activities.slice(0, visibleCount).map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-main">
                    <div className="activity-icon">
                      <Activity size={24} />
                    </div>
                    <div className="activity-details">
                      <h3 className="activity-name">{activity.name}</h3>
                      <div className="activity-stats">
                        <span>{t('activityTracker.minutesUnit', { count: activity.duration })}</span>
                        {activity.calories > 0 && (
                          <>
                            <span>•</span>
                            <span>{t('activityTracker.caloriesUnit', { count: activity.calories })}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{renderActivityDate(activity)}</span>
                      </div>
                    </div>
                    <div className="activity-actions">
                      <button 
                        className="icon-btn edit-btn" 
                        onClick={() => handleEditActivity(activity)}
                        title={t('common.edit')}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        className="icon-btn delete-btn" 
                        onClick={() => setDeleteConfirm(activity.id)}
                        title={t('common.delete')}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {activities.length > visibleCount && (
                <button className="load-more-btn" onClick={handleLoadMore}>
                  {t('common.loadMore')}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Workout Timer Modal */}
      {showTimer && (
        <div className="modal-overlay" onClick={() => setShowTimer(false)}>
          <div className="timer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('activityTracker.workoutTimer')}</h2>
              <button className="close-btn" onClick={() => setShowTimer(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="timer-display">
              <div className="timer-time">{formatTime(timerSeconds)}</div>
              <p className="timer-label">{t('activityTracker.timerLabel')}</p>
            </div>
            <div className="timer-controls">
              <button 
                className={`timer-btn ${timerRunning ? 'pause' : 'play'}`}
                onClick={handleStartPauseTimer}
              >
                {timerRunning ? (
                  <>
                    <Pause size={24} />
                    <span>{t('activityTracker.pause')}</span>
                  </>
                ) : (
                  <>
                    <Play size={24} />
                    <span>{t('activityTracker.start')}</span>
                  </>
                )}
              </button>
              <button className="timer-btn reset" onClick={handleResetTimer}>
                <RotateCcw size={24} />
                <span>{t('activityTracker.reset')}</span>
              </button>
            </div>
            {timerSeconds > 0 && (
              <button className="finish-workout-btn" onClick={handleFinishWorkout}>
                {t('activityTracker.finishLog')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Progress Insights Modal */}
      {showInsights && (
        <div className="modal-overlay" onClick={() => setShowInsights(false)}>
          <div className="insights-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('activityTracker.progressInsights')}</h2>
              <button className="close-btn" onClick={() => setShowInsights(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="insights-content">
              <div className="insights-grid">
                <div className="insight-card">
                  <div className="insight-icon">
                    <Activity size={32} />
                  </div>
                  <div className="insight-value">{activityStats.totalActivities}</div>
                  <div className="insight-label">{t('activityTracker.totalActivities')}</div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">
                    <Clock size={32} />
                  </div>
                  <div className="insight-value">{activityStats.totalMinutes}</div>
                  <div className="insight-label">{t('activityTracker.totalMinutes')}</div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">
                    <Flame size={32} />
                  </div>
                  <div className="insight-value">{activityStats.totalCalories}</div>
                  <div className="insight-label">{t('activityTracker.totalCalories')}</div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">
                    <BarChart3 size={32} />
                  </div>
                  <div className="insight-value">{activityStats.avgDuration}</div>
                  <div className="insight-label">{t('activityTracker.avgDuration')}</div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">
                    <Calendar size={32} />
                  </div>
                  <div className="insight-value">{activityStats.recentActivities}</div>
                  <div className="insight-label">{t('activityTracker.last7Days')}</div>
                </div>
                <div className="insight-card full-width">
                  <div className="insight-icon">
                    <TrendingUp size={32} />
                  </div>
                  <div className="insight-value">{activityStats.mostCommon}</div>
                  <div className="insight-label">{t('activityTracker.mostCommon')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <button className="delete-confirm-btn" onClick={() => handleDeleteActivity(deleteConfirm)}>
                <Trash2 size={18} />
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivityTracker

