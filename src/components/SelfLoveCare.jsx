import { useState, useMemo } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Heart, Plus, X, Star, StarOff, Edit2, Trash2, Award, Sparkles, TrendingUp, BarChart3 } from 'lucide-react'
import './SelfLoveCare.css'

const SelfLoveCare = () => {
  const { affirmations, addAffirmation, updateAffirmation, deleteAffirmation, toggleAffirmationFavorite, gratitudeEntries, addGratitudeEntry, deleteGratitudeEntry, selfCareActivities, completeSelfCareActivity } = useWellness()
  const [activeTab, setActiveTab] = useState('affirmations')
  const [showAffirmationForm, setShowAffirmationForm] = useState(false)
  const [editingAffirmation, setEditingAffirmation] = useState(null)
  const [affirmationText, setAffirmationText] = useState('')
  const [gratitudeText, setGratitudeText] = useState('')

  // Default affirmations
  const defaultAffirmations = [
    'I am worthy of love and kindness, especially from myself.',
    'I am enough just as I am.',
    'I am growing and learning every day.',
    'I release the need for self-criticism and embrace self-compassion.',
    'I have the power to create the life I desire.'
  ]

  // Self-care activities
  const selfCareOptions = [
    { id: 1, name: 'Take a relaxing bath or shower', icon: '🛁', duration: 20 },
    { id: 2, name: 'Go for a mindful 15-minute walk', icon: '🚶‍♀️', duration: 15 },
    { id: 3, name: 'Do a 10-minute stretching session', icon: '🧘‍♀️', duration: 10 },
    { id: 4, name: 'Practice deep breathing for 5 minutes', icon: '🫁', duration: 5 },
    { id: 5, name: 'Read a chapter of a book for fun', icon: '📚', duration: 30 },
    { id: 6, name: 'Listen to a favorite uplifting playlist', icon: '🎵', duration: 15 },
    { id: 7, name: 'Meditate for 10 minutes', icon: '🧘', duration: 10 },
    { id: 8, name: 'Write in your journal for 15 minutes', icon: '✍️', duration: 15 },
    { id: 9, name: 'Call or message a loved one', icon: '📞', duration: 20 },
    { id: 10, name: "Write down 3 things you're grateful for", icon: '🙏', duration: 5 },
    { id: 11, name: 'Watch a funny video or show', icon: '😄', duration: 25 },
    { id: 12, name: 'Do something creative for 45 minutes', icon: '🎨', duration: 45 },
    { id: 13, name: 'Schedule a video chat with a friend', icon: '💻', duration: 30 },
    { id: 14, name: 'Send a kind message to someone', icon: '💌', duration: 5 },
    { id: 15, name: 'Engage with a community or group', icon: '👥', duration: 60 },
    { id: 16, name: 'Spend time volunteering', icon: '🤝', duration: 120 }
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

  // Get random affirmation
  const getRandomAffirmation = () => {
    const allAffirmations = [...affirmations.filter(a => !a.isFavorite), ...defaultAffirmations]
    if (allAffirmations.length === 0) return defaultAffirmations[0]
    return allAffirmations[Math.floor(Math.random() * allAffirmations.length)]
  }

  const todayAffirmation = useMemo(() => {
    return affirmations.find(a => a.isToday) || getRandomAffirmation()
  }, [affirmations])

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
          <h1>Self-Love & Care</h1>
          <p>Cultivate compassion and kindness for yourself with these practices.</p>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'affirmations' ? 'active' : ''}`}
          onClick={() => setActiveTab('affirmations')}
        >
          Affirmations
        </button>
        <button 
          className={`tab ${activeTab === 'self-care' ? 'active' : ''}`}
          onClick={() => setActiveTab('self-care')}
        >
          Self-Care
        </button>
        <button 
          className={`tab ${activeTab === 'gratitude' ? 'active' : ''}`}
          onClick={() => setActiveTab('gratitude')}
        >
          Gratitude
        </button>
        <button 
          className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          Insights
        </button>
      </div>

      {/* Affirmations Tab */}
      {activeTab === 'affirmations' && (
        <div className="tab-content">
          <div className="today-affirmation">
            <h3>Today's Affirmation</h3>
            <p className="affirmation-text">
              {typeof todayAffirmation === 'string' ? todayAffirmation : todayAffirmation.text}
            </p>
            <p className="affirmation-subtitle">Use this as a mantra for your day.</p>
            <button className="new-affirmation-btn" onClick={() => {
              const random = getRandomAffirmation()
              setAffirmationText('')
              setShowAffirmationForm(false)
            }}>
              New Affirmation
            </button>
          </div>

          <div className="affirmations-section">
            <div className="section-header">
              <h3>In Favorites</h3>
              <button className="add-btn" onClick={() => {
                setEditingAffirmation(null)
                setAffirmationText('')
                setShowAffirmationForm(true)
              }}>
                <Plus size={18} />
                Add
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
                <p className="empty-message">No favorite affirmations yet. Add one to get started!</p>
              )}
            </div>

            <div className="section-header" style={{ marginTop: '2rem' }}>
              <h3>Your Personal Affirmations</h3>
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
                <p className="empty-message">No affirmations yet. Click "Add" to create your first one!</p>
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
                  <div className="self-care-duration">{activity.duration} min</div>
                  <button
                    className={`do-btn ${isCompletedToday ? 'done' : ''}`}
                    onClick={() => completeSelfCareActivity(activity.id)}
                    disabled={isCompletedToday}
                  >
                    {isCompletedToday ? '✓ Done' : 'Do'}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="today-progress">
            <h3>Today's Progress</h3>
            {todaySelfCareCount > 0 ? (
              <p className="progress-text">
                You've completed {todaySelfCareCount} self-care activity{todaySelfCareCount !== 1 ? 's' : ''} today! 🎉
              </p>
            ) : (
              <p className="progress-text">No self-care activities completed today.</p>
            )}
          </div>
        </div>
      )}

      {/* Gratitude Tab */}
      {activeTab === 'gratitude' && (
        <div className="tab-content">
          <div className="gratitude-entry-section">
            <h3>Daily Gratitude Reflection</h3>
            <p className="section-subtitle">Take a moment to appreciate the good things in your life.</p>
            <div className="gratitude-form">
              <label>What are you grateful for today?</label>
              <textarea
                value={gratitudeText}
                onChange={(e) => setGratitudeText(e.target.value)}
                placeholder="Today, I'm grateful for..."
                rows="4"
              />
              <button className="add-gratitude-btn" onClick={handleAddGratitude}>
                New Entry
              </button>
            </div>
          </div>

          <div className="gratitude-entries">
            <h3>Recent Gratitude Entries</h3>
            {gratitudeEntries.length > 0 ? (
              <div className="gratitude-list">
                {gratitudeEntries.slice(0, 10).map(entry => (
                  <div key={entry.id} className="gratitude-item">
                    <div className="gratitude-content">
                      <p>{entry.text}</p>
                      <span className="gratitude-date">
                        {new Date(entry.createdAt).toLocaleString('en-US', {
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
              <p className="empty-message">No gratitude entries yet. Start your gratitude practice today!</p>
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
              <div className="stat-label">Affirmations</div>
              <div className="stat-sublabel">{insights.favoriteAffirmations} Saved</div>
            </div>
            <div className="stat-card">
              <Heart size={24} />
              <div className="stat-value">{insights.todaySelfCare}</div>
              <div className="stat-label">Self-Care Acts</div>
              <div className="stat-sublabel">Today</div>
            </div>
            <div className="stat-card">
              <Sparkles size={24} />
              <div className="stat-value">{insights.totalGratitude}</div>
              <div className="stat-label">Gratitude</div>
              <div className="stat-sublabel">Total</div>
            </div>
          </div>

          <div className="insights-messages">
            <h3>Your Self-Love Journey</h3>
            <div className="insight-card">
              <TrendingUp size={20} />
              <div>
                <h4>Growing Self-Compassion</h4>
                <p>Your saved affirmations show a commitment to positive self-talk.</p>
              </div>
            </div>
            <div className="insight-card">
              <Heart size={20} />
              <div>
                <h4>Consistent Care</h4>
                <p>You're actively participating in self-care. Every small act matters.</p>
              </div>
            </div>
            <div className="insight-card">
              <Sparkles size={20} />
              <div>
                <h4>Embracing Positive Self-Talk</h4>
                <p>Gratitude is a powerful tool for shifting perspective. You're using it well.</p>
              </div>
            </div>
            <div className="insight-encouragement">
              <p>You're doing beautifully. Self-love is a practice, not a destination. Be patient with yourself.</p>
            </div>
          </div>
        </div>
      )}

      {/* Affirmation Form Modal */}
      {showAffirmationForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingAffirmation ? 'Edit Affirmation' : 'Add New Affirmation'}</h3>
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
                placeholder="I am worthy of love and kindness, especially from myself."
                rows="3"
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => {
                setShowAffirmationForm(false)
                setEditingAffirmation(null)
                setAffirmationText('')
              }}>
                Cancel
              </button>
              <button className="save-btn" onClick={editingAffirmation ? handleUpdateAffirmation : handleAddAffirmation}>
                {editingAffirmation ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SelfLoveCare

