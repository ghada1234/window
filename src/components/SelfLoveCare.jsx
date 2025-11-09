import { useState, useMemo } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Heart, Plus, X, Star, StarOff, Edit2, Trash2, Award, Sparkles, TrendingUp, BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './SelfLoveCare.css'

const SelfLoveCare = () => {
  const { t, i18n } = useTranslation()
  const { affirmations, addAffirmation, updateAffirmation, deleteAffirmation, toggleAffirmationFavorite, gratitudeEntries, addGratitudeEntry, deleteGratitudeEntry, selfCareActivities, completeSelfCareActivity, moodLogs } = useWellness()
  const [activeTab, setActiveTab] = useState('affirmations')
  const [showAffirmationForm, setShowAffirmationForm] = useState(false)
  const [editingAffirmation, setEditingAffirmation] = useState(null)
  const [affirmationText, setAffirmationText] = useState('')
  const [gratitudeText, setGratitudeText] = useState('')

  // Default affirmations - now from translations
  const defaultAffirmations = t('selfLove.defaultAffirmations', { returnObjects: true })

  // Self-care activities - now from translations
  const selfCareOptions = [
    { id: 1, name: t('selfLove.selfCareActivities.1'), icon: '🛁', duration: 20 },
    { id: 2, name: t('selfLove.selfCareActivities.2'), icon: '🚶‍♀️', duration: 15 },
    { id: 3, name: t('selfLove.selfCareActivities.3'), icon: '🧘‍♀️', duration: 10 },
    { id: 4, name: t('selfLove.selfCareActivities.4'), icon: '🫁', duration: 5 },
    { id: 5, name: t('selfLove.selfCareActivities.5'), icon: '📚', duration: 30 },
    { id: 6, name: t('selfLove.selfCareActivities.6'), icon: '🎵', duration: 15 },
    { id: 7, name: t('selfLove.selfCareActivities.7'), icon: '🧘', duration: 10 },
    { id: 8, name: t('selfLove.selfCareActivities.8'), icon: '✍️', duration: 15 },
    { id: 9, name: t('selfLove.selfCareActivities.9'), icon: '📞', duration: 20 },
    { id: 10, name: t('selfLove.selfCareActivities.10'), icon: '🙏', duration: 5 },
    { id: 11, name: t('selfLove.selfCareActivities.11'), icon: '😄', duration: 25 },
    { id: 12, name: t('selfLove.selfCareActivities.12'), icon: '🎨', duration: 45 },
    { id: 13, name: t('selfLove.selfCareActivities.13'), icon: '💻', duration: 30 },
    { id: 14, name: t('selfLove.selfCareActivities.14'), icon: '💌', duration: 5 },
    { id: 15, name: t('selfLove.selfCareActivities.15'), icon: '👥', duration: 60 },
    { id: 16, name: t('selfLove.selfCareActivities.16'), icon: '🤝', duration: 120 }
  ]


  const handleAddAffirmation = () => {
    if (affirmationText.trim()) {
      addAffirmation({
        id: Date.now(),
        text: affirmationText,
        isFavorite: false,
        createdAt: new Date().toISOString()
      })
      setAffirmationText('')
      setShowAffirmationForm(false)
    }
  }

  const handleEditAffirmation = (affirmation) => {
    setEditingAffirmation(affirmation)
    setAffirmationText(affirmation.text)
    setShowAffirmationForm(true)
  }

  const handleUpdateAffirmation = () => {
    if (affirmationText.trim() && editingAffirmation) {
      updateAffirmation(editingAffirmation.id, { text: affirmationText })
      setAffirmationText('')
      setEditingAffirmation(null)
      setShowAffirmationForm(false)
    }
  }

  const handleAddGratitude = () => {
    if (gratitudeText.trim()) {
      addGratitudeEntry({
        id: Date.now(),
        text: gratitudeText,
        createdAt: new Date().toISOString()
      })
      setGratitudeText('')
    }
  }

  // Get current mood from latest mood log
  const getCurrentMood = () => {
    if (moodLogs.length === 0) return 'neutral'
    const latestMood = moodLogs[moodLogs.length - 1]
    const moodText = latestMood.mood || 'Good'
    
    // Map mood to categories
    if (moodText.includes('Excellent') || moodText.includes('Great') || moodText.includes('ممتاز')) return 'excellent'
    if (moodText.includes('Good') || moodText.includes('Happy') || moodText.includes('جيد') || moodText.includes('سعيد')) return 'good'
    if (moodText.includes('Okay') || moodText.includes('Calm') || moodText.includes('مقبول') || moodText.includes('هادئ')) return 'okay'
    if (moodText.includes('Low') || moodText.includes('Sad') || moodText.includes('منخفض') || moodText.includes('حزين')) return 'low'
    if (moodText.includes('Poor') || moodText.includes('Anxious') || moodText.includes('سيء') || moodText.includes('قلق')) return 'anxious'
    return 'neutral'
  }

  // Mood-based affirmations
  const getMoodBasedAffirmations = () => {
    const currentMood = getCurrentMood()
    
    const moodAffirmations = {
      excellent: t('selfLove.moodAffirmations.excellent', { returnObjects: true }),
      good: t('selfLove.moodAffirmations.good', { returnObjects: true }),
      okay: t('selfLove.moodAffirmations.okay', { returnObjects: true }),
      low: t('selfLove.moodAffirmations.low', { returnObjects: true }),
      anxious: t('selfLove.moodAffirmations.anxious', { returnObjects: true }),
      neutral: t('selfLove.moodAffirmations.neutral', { returnObjects: true })
    }
    
    return moodAffirmations[currentMood] || moodAffirmations.neutral
  }

  // Get random affirmation based on mood
  const getRandomAffirmation = () => {
    const moodBasedAffirmations = getMoodBasedAffirmations()
    // Combine user's affirmations with mood-specific ones
    const allAffirmations = [...affirmations, ...moodBasedAffirmations]
    if (allAffirmations.length === 0) return moodBasedAffirmations[0]
    return allAffirmations[Math.floor(Math.random() * allAffirmations.length)]
  }

  const todayAffirmation = useMemo(() => {
    return affirmations.find(a => a.isToday) || getRandomAffirmation()
  }, [affirmations, moodLogs])
  
  const currentMood = getCurrentMood()
  const moodEmoji = {
    excellent: '😄',
    good: '😊',
    okay: '😌',
    low: '😔',
    anxious: '😰',
    neutral: '😐'
  }[currentMood]

  // Calculate insights
  const insights = useMemo(() => {
    const favoriteAffirmations = affirmations.filter(a => a.isFavorite).length
    const today = new Date().toDateString()
    const todaySelfCare = selfCareActivities.filter(a => 
      a.completedDays?.some(date => new Date(date).toDateString() === today)
    ).length
    const totalGratitude = gratitudeEntries.length

    return {
      affirmationsCount: affirmations.length || defaultAffirmations.length,
      favoriteAffirmations,
      todaySelfCare,
      totalGratitude
    }
  }, [affirmations, selfCareActivities, gratitudeEntries])

  const todaySelfCareCount = selfCareActivities.filter(a => 
    a.completedDays?.some(date => new Date(date).toDateString() === new Date().toDateString())
  ).length

  return (
    <div className="self-love-care-page">
      <div className="page-header">
        <div>
          <h1>{t('selfLove.title')}</h1>
          <p>{t('selfLove.subtitle')}</p>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'affirmations' ? 'active' : ''}`}
          onClick={() => setActiveTab('affirmations')}
        >
          {t('selfLove.affirmations')}
        </button>
        <button 
          className={`tab ${activeTab === 'self-care' ? 'active' : ''}`}
          onClick={() => setActiveTab('self-care')}
        >
          {t('selfLove.selfCare')}
        </button>
        <button 
          className={`tab ${activeTab === 'gratitude' ? 'active' : ''}`}
          onClick={() => setActiveTab('gratitude')}
        >
          {t('selfLove.gratitudeTab')}
        </button>
        <button 
          className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          {t('selfLove.insights')}
        </button>
      </div>

      {/* Affirmations Tab */}
      {activeTab === 'affirmations' && (
        <div className="tab-content">
          <div className="today-affirmation">
            <div className="affirmation-header-with-mood">
              <h3>{t('selfLove.todayAffirmation')}</h3>
              <div className="mood-indicator-badge" title={t(`selfLove.basedOnMood`)}>
                {moodEmoji} {t(`selfLove.moods.${currentMood}`)}
              </div>
            </div>
            <p className="affirmation-text">
              {typeof todayAffirmation === 'string' ? todayAffirmation : todayAffirmation.text}
            </p>
            <p className="affirmation-subtitle">{t('selfLove.moodBasedSubtitle')}</p>
            <div className="affirmation-card-actions">
              <button className="add-to-favorites-btn" onClick={() => {
                const affirmationToAdd = typeof todayAffirmation === 'string' ? todayAffirmation : todayAffirmation.text
                addAffirmation({
                  id: Date.now(),
                  text: affirmationToAdd,
                  isFavorite: true,
                  createdAt: new Date().toISOString()
                })
              }}>
                <Heart size={18} />
                {t('selfLove.addToFavorites')}
              </button>
            <button className="new-affirmation-btn" onClick={() => {
              const random = getRandomAffirmation()
              setAffirmationText('')
              setShowAffirmationForm(false)
            }}>
                {t('selfLove.newAffirmation')}
            </button>
            </div>
          </div>

          <div className="affirmations-section">
            <div className="section-header">
              <h3>{t('selfLove.inFavorites')}</h3>
              <button className="add-btn" onClick={() => {
                setEditingAffirmation(null)
                setAffirmationText('')
                setShowAffirmationForm(true)
              }}>
                <Plus size={18} />
                {t('selfLove.add')}
              </button>
            </div>
            <div className="affirmations-list">
              {affirmations.filter(a => a.isFavorite).length > 0 ? (
                affirmations.filter(a => a.isFavorite).map(affirmation => (
                  <div key={affirmation.id} className="affirmation-item">
                    <p>{affirmation.text}</p>
                    <div className="affirmation-actions">
                      <button 
                        className="action-btn"
                        onClick={() => toggleAffirmationFavorite(affirmation.id)}
                        title="Remove from favorites"
                      >
                        <Star size={16} fill="currentColor" />
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => handleEditAffirmation(affirmation)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => deleteAffirmation(affirmation.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-message">{t('selfLove.noFavorites')}</p>
              )}
            </div>

            <div className="section-header" style={{ marginTop: '2rem' }}>
              <h3>{t('selfLove.yourAffirmations')}</h3>
            </div>
            <div className="affirmations-list">
              {affirmations.filter(a => !a.isFavorite).length > 0 ? (
                affirmations.filter(a => !a.isFavorite).map(affirmation => (
                  <div key={affirmation.id} className="affirmation-item">
                    <p>{affirmation.text}</p>
                    <div className="affirmation-actions">
                      <button 
                        className="action-btn"
                        onClick={() => toggleAffirmationFavorite(affirmation.id)}
                        title="Add to favorites"
                      >
                        <StarOff size={16} />
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => handleEditAffirmation(affirmation)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => deleteAffirmation(affirmation.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-message">{t('selfLove.noAffirmations')}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Self-Care Tab */}
      {activeTab === 'self-care' && (
        <div className="tab-content">
          <div className="self-care-grid">
            {selfCareOptions.map(activity => {
              const activityData = selfCareActivities.find(a => a.id === activity.id)
              const completedDays = activityData?.completedDays || []
              const isCompletedToday = completedDays.some(date => 
                new Date(date).toDateString() === new Date().toDateString()
              )
              
              return (
                <div key={activity.id} className={`self-care-card ${isCompletedToday ? 'completed' : ''}`}>
                  <div className="self-care-icon">{activity.icon}</div>
                  <h4>{activity.name}</h4>
                  <div className="self-care-duration">{activity.duration} {t('selfLove.min')}</div>
                  <button
                    className={`do-btn ${isCompletedToday ? 'done' : ''}`}
                    onClick={() => completeSelfCareActivity(activity.id)}
                    disabled={isCompletedToday}
                  >
                    {isCompletedToday ? t('selfLove.done') : t('selfLove.do')}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="today-progress">
            <h3>{t('selfLove.todayProgress')}</h3>
            {todaySelfCareCount > 0 ? (
              <p className="progress-text">
                {todaySelfCareCount === 1 
                  ? t('selfLove.completedActivities', { count: todaySelfCareCount })
                  : t('selfLove.completedActivitiesPlural', { count: todaySelfCareCount })
                }
              </p>
            ) : (
              <p className="progress-text">{t('selfLove.noActivitiesCompleted')}</p>
            )}
          </div>
        </div>
      )}

      {/* Gratitude Tab */}
      {activeTab === 'gratitude' && (
        <div className="tab-content">
          <div className="gratitude-entry-section">
            <h3>{t('selfLove.gratitude.title')}</h3>
            <p className="section-subtitle">{t('selfLove.gratitude.subtitle')}</p>
            <div className="gratitude-form">
              <label>{t('selfLove.gratitude.question')}</label>
              <textarea
                value={gratitudeText}
                onChange={(e) => setGratitudeText(e.target.value)}
                placeholder={t('selfLove.gratitude.placeholder')}
                rows="4"
              />
              <button className="add-gratitude-btn" onClick={handleAddGratitude}>
                {t('selfLove.gratitude.newEntry')}
              </button>
            </div>
          </div>

          <div className="gratitude-entries">
            <h3>{t('selfLove.gratitude.recentEntries')}</h3>
            {gratitudeEntries.length > 0 ? (
              <div className="gratitude-list">
                {gratitudeEntries.slice(0, 10).map(entry => (
                  <div key={entry.id} className="gratitude-item">
                    <div className="gratitude-content">
                      <p>{entry.text}</p>
                      <span className="gratitude-date">
                        {new Date(entry.createdAt).toLocaleString(i18n.language === 'ar' ? 'ar-AE' : 'en-US', {
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        })}
                      </span>
                    </div>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteGratitudeEntry(entry.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">{t('selfLove.gratitude.noEntries')}</p>
            )}
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="tab-content">
          <div className="insights-stats">
            <div className="stat-card">
              <Award size={24} />
              <div className="stat-value">{insights.affirmationsCount}</div>
              <div className="stat-label">{t('selfLove.insightsTab.affirmations')}</div>
              <div className="stat-sublabel">{insights.favoriteAffirmations} {t('selfLove.insightsTab.saved')}</div>
            </div>
            <div className="stat-card">
              <Heart size={24} />
              <div className="stat-value">{insights.todaySelfCare}</div>
              <div className="stat-label">{t('selfLove.insightsTab.selfCareActs')}</div>
              <div className="stat-sublabel">{t('selfLove.insightsTab.today')}</div>
            </div>
            <div className="stat-card">
              <Sparkles size={24} />
              <div className="stat-value">{insights.totalGratitude}</div>
              <div className="stat-label">{t('selfLove.insightsTab.gratitudeLabel')}</div>
              <div className="stat-sublabel">{t('selfLove.insightsTab.total')}</div>
            </div>
          </div>

          <div className="insights-messages">
            <h3>{t('selfLove.insightsTab.journeyTitle')}</h3>
            <div className="insight-card">
              <TrendingUp size={20} />
              <div>
                <h4>{t('selfLove.insightsTab.growingSelfCompassion')}</h4>
                <p>{t('selfLove.insightsTab.growingSelfCompassionDesc')}</p>
              </div>
            </div>
            <div className="insight-card">
              <Heart size={20} />
              <div>
                <h4>{t('selfLove.insightsTab.consistentCare')}</h4>
                <p>{t('selfLove.insightsTab.consistentCareDesc')}</p>
              </div>
            </div>
            <div className="insight-card">
              <Sparkles size={20} />
              <div>
                <h4>{t('selfLove.insightsTab.embracingPositive')}</h4>
                <p>{t('selfLove.insightsTab.embracingPositiveDesc')}</p>
              </div>
            </div>
            <div className="insight-encouragement">
              <p>{t('selfLove.insightsTab.encouragement')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Affirmation Form Modal */}
      {showAffirmationForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingAffirmation ? t('selfLove.modal.editAffirmation') : t('selfLove.modal.addNewAffirmation')}</h3>
              <button className="close-btn" onClick={() => {
                setShowAffirmationForm(false)
                setEditingAffirmation(null)
                setAffirmationText('')
              }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <textarea
                value={affirmationText}
                onChange={(e) => setAffirmationText(e.target.value)}
                placeholder={t('selfLove.modal.affirmationPlaceholder')}
                rows="3"
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => {
                setShowAffirmationForm(false)
                setEditingAffirmation(null)
                setAffirmationText('')
              }}>
                {t('selfLove.modal.cancel')}
              </button>
              <button className="save-btn" onClick={editingAffirmation ? handleUpdateAffirmation : handleAddAffirmation}>
                {t('selfLove.modal.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SelfLoveCare

