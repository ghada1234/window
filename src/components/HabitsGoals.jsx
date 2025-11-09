import { useState, useMemo } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Target, Plus, X, Check, Calendar, TrendingUp, Edit2, Trash2, Bell, Award, Flag, Star, Filter } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './HabitsGoals.css'

const HabitsGoals = () => {
  const { t } = useTranslation()
  const { habits, addHabit, updateHabit, deleteHabit, completeHabit } = useWellness()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [filterPriority, setFilterPriority] = useState('all')
  const [sortBy, setSortBy] = useState('priority')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    target: 7,
    category: 'wellness',
    priority: 'medium',
    difficulty: 'medium',
    reminderTime: '',
    motivation: '',
    milestone: null
  })

  const categories = [
    { value: 'wellness', label: t('habitsGoals.categories.wellness') },
    { value: 'fitness', label: t('habitsGoals.categories.fitness') },
    { value: 'mindfulness', label: t('habitsGoals.categories.mindfulness') },
    { value: 'nutrition', label: t('habitsGoals.categories.nutrition') },
    { value: 'productivity', label: t('habitsGoals.categories.productivity') },
    { value: 'other', label: t('habitsGoals.categories.other') }
  ]

  const priorities = [
    { value: 'high', label: t('habitsGoals.priorities.high'), icon: Flag, color: '#ef4444' },
    { value: 'medium', label: t('habitsGoals.priorities.medium'), icon: Target, color: '#f59e0b' },
    { value: 'low', label: t('habitsGoals.priorities.low'), icon: Star, color: '#10b981' }
  ]

  const difficulties = [
    { value: 'easy', label: t('habitsGoals.difficulties.easy'), color: '#10b981' },
    { value: 'medium', label: t('habitsGoals.difficulties.medium'), color: '#f59e0b' },
    { value: 'hard', label: t('habitsGoals.difficulties.hard'), color: '#ef4444' }
  ]

  // Calculate success rate for a habit
  const getSuccessRate = (habit) => {
    if (!habit.completedDays || habit.completedDays.length === 0) return 0
    const daysSinceStart = Math.max(
      1,
      Math.floor((new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24))
    )
    const completionCount = habit.totalCompletions || habit.completedDays.length
    return Math.round((completionCount / (daysSinceStart * (habit.target / 7))) * 100)
  }

  // Filtered and sorted habits
  const filteredHabits = useMemo(() => {
    let filtered = habits.filter(habit => {
      if (filterPriority === 'all') return true
      return habit.priority === filterPriority
    })

    // Sort by selected criteria
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2)
      }
      if (sortBy === 'streak') {
        return (b.streak || 0) - (a.streak || 0)
      }
      if (sortBy === 'success') {
        return getSuccessRate(b) - getSuccessRate(a)
      }
      if (sortBy === 'recent') {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      return 0
    })

    return filtered
  }, [habits, filterPriority, sortBy])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name.trim()) {
      if (editingHabit) {
        updateHabit(editingHabit.id, formData)
        setEditingHabit(null)
      } else {
        addHabit({
          ...formData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          completedDays: [],
          streak: 0,
          bestStreak: 0,
          totalCompletions: 0,
          reminderEnabled: !!formData.reminderTime
        })
      }
      setFormData({
        name: '',
        description: '',
        frequency: 'daily',
        target: 7,
        category: 'wellness',
        priority: 'medium',
        difficulty: 'medium',
        reminderTime: '',
        motivation: '',
        milestone: null
      })
      setShowAddForm(false)
    }
  }

  const handleEdit = (habit) => {
    setEditingHabit(habit)
    setFormData({
      name: habit.name,
      description: habit.description || '',
      frequency: habit.frequency,
      target: habit.target,
      category: habit.category,
      priority: habit.priority || 'medium',
      difficulty: habit.difficulty || 'medium',
      reminderTime: habit.reminderTime || '',
      motivation: habit.motivation || '',
      milestone: habit.milestone || null
    })
    setShowAddForm(true)
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingHabit(null)
    setFormData({
      name: '',
      description: '',
      frequency: 'daily',
      target: 7,
      category: 'wellness',
      priority: 'medium',
      difficulty: 'medium',
      reminderTime: '',
      motivation: '',
      milestone: null
    })
  }

  const handleComplete = (habitId) => {
    completeHabit(habitId)
  }

  const getStreakColor = (streak) => {
    if (streak >= 30) return '#16a34a'
    if (streak >= 14) return '#22c55e'
    if (streak >= 7) return '#84cc16'
    return '#eab308'
  }

  const getProgressPercentage = (habit) => {
    const today = new Date().toDateString()
    const thisWeek = getThisWeekDates()
    const completedThisWeek = habit.completedDays.filter(date => 
      thisWeek.includes(new Date(date).toDateString())
    ).length
    return Math.round((completedThisWeek / habit.target) * 100)
  }

  const getThisWeekDates = () => {
    const dates = []
    const today = new Date()
    const dayOfWeek = today.getDay()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek)
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date.toDateString())
    }
    return dates
  }

  return (
    <div className="habits-goals-page">
      <div className="page-header">
        <div>
          <h1>{t('habitsGoals.title')}</h1>
          <p>{t('habitsGoals.subtitle')}</p>
        </div>
        <button 
          className="add-habit-btn"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} />
          {t('habitsGoals.addHabit')}
        </button>
      </div>

      {showAddForm && (
        <div className="habit-form-overlay">
          <div className="habit-form-card">
            <div className="habit-form-header">
              <h2>{editingHabit ? t('habitsGoals.editHabit') : t('habitsGoals.addNewHabit')}</h2>
              <button className="close-btn" onClick={handleCancel}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('habitsGoals.habitName')} *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('habitsGoals.habitNamePlaceholder')}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('habitsGoals.description')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('habitsGoals.descriptionPlaceholder')}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('habitsGoals.priority')} *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    required
                  >
                    {priorities.map(pri => (
                      <option key={pri.value} value={pri.value}>{pri.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t('habitsGoals.difficulty')}</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    {difficulties.map(diff => (
                      <option key={diff.value} value={diff.value}>{diff.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('habitsGoals.category')}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t('habitsGoals.frequency')}</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  >
                    <option value="daily">{t('habitsGoals.frequencies.daily')}</option>
                    <option value="weekly">{t('habitsGoals.frequencies.weekly')}</option>
                    <option value="custom">{t('habitsGoals.frequencies.custom')}</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('habitsGoals.weeklyTarget')}</label>
                  <input
                    type="number"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) || 7 })}
                    min="1"
                    max="7"
                  />
                </div>
                <div className="form-group">
                  <label>{t('habitsGoals.reminderTime')}</label>
                  <input
                    type="time"
                    value={formData.reminderTime}
                    onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t('habitsGoals.motivation')}</label>
                <textarea
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  placeholder={t('habitsGoals.motivationPlaceholder')}
                  rows="2"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  {t('habitsGoals.cancel')}
                </button>
                <button type="submit" className="save-btn">
                  {editingHabit ? t('habitsGoals.updateHabit') : t('habitsGoals.createHabit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {habits.length === 0 ? (
        <div className="empty-state">
          <Target size={64} />
          <h2>{t('habitsGoals.noHabits')}</h2>
          <p>{t('habitsGoals.startBuilding')}</p>
          <button className="add-first-habit-btn" onClick={() => setShowAddForm(true)}>
            {t('habitsGoals.addFirstHabit')}
          </button>
        </div>
      ) : (
        <div className="habits-grid">
          {habits.map(habit => {
            const progress = getProgressPercentage(habit)
            const isCompletedToday = habit.completedDays.some(date => 
              new Date(date).toDateString() === new Date().toDateString()
            )
            
            return (
              <div key={habit.id} className={`habit-card ${habit.priority}-priority`}>
                <div className="habit-card-header">
                  <div className="habit-title-section">
                    <PriorityIcon size={20} className="habit-icon" style={{ color: priorityInfo.color }} />
                    <div className="habit-title-content">
                      <div className="habit-title-row">
                        <h3>{habit.name}</h3>
                        <span className="priority-badge" style={{ backgroundColor: `${priorityInfo.color}20`, color: priorityInfo.color }}>
                          <PriorityIcon size={12} />
                          {priorityInfo.label.split(' ')[0]}
                        </span>
                      </div>
                      <div className="habit-meta">
                        <span className="habit-category">{categories.find(c => c.value === habit.category)?.label}</span>
                        <span className="habit-difficulty" style={{ color: difficultyInfo.color }}>
                          {difficultyInfo.label}
                        </span>
                        {habit.reminderTime && (
                          <span className="habit-reminder">
                            <Bell size={12} />
                            {habit.reminderTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="habit-actions">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(habit)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => deleteHabit(habit.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {habit.description && (
                  <p className="habit-description">{habit.description}</p>
                )}

                {habit.motivation && (
                  <div className="habit-motivation">
                    <span className="motivation-icon">💡</span>
                    <p>{habit.motivation}</p>
                  </div>
                )}

                <div className="habit-stats">
                  <div className="stat-item">
                    <TrendingUp size={16} />
                    <div>
                      <span className="stat-value" style={{ color: getStreakColor(habit.streak) }}>
                        {habit.streak || 0}
                      </span>
                      <span className="stat-label">{t('habitsGoals.dayStreak')}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <Award size={16} />
                    <div>
                      <span className="stat-value" style={{ color: successRate >= 80 ? '#22c55e' : successRate >= 50 ? '#f59e0b' : '#ef4444' }}>
                        {successRate}%
                      </span>
                      <span className="stat-label">{t('habitsGoals.successRate')}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <Calendar size={16} />
                    <div>
                      <span className="stat-value">{progress}%</span>
                      <span className="stat-label">{t('habitsGoals.thisWeek')}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <Target size={16} />
                    <div>
                      <span className="stat-value">{habit.bestStreak || 0}</span>
                      <span className="stat-label">{t('habitsGoals.bestStreak')}</span>
                    </div>
                  </div>
                </div>

                <div className="habit-progress">
                  <div className="progress-header">
                    <span className="progress-label">{t('habitsGoals.weeklyProgress')}</span>
                    <span className="progress-percentage">{progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {habit.completedDays.filter(date => 
                      getThisWeekDates().includes(new Date(date).toDateString())
                    ).length} / {habit.target} {t('habitsGoals.daysThisWeek')}
                  </span>
                </div>

                <button
                  className={`complete-btn ${isCompletedToday ? 'completed' : ''}`}
                  onClick={() => handleComplete(habit.id)}
                  disabled={isCompletedToday}
                >
                  <Check size={18} />
                  {isCompletedToday ? t('habitsGoals.completedToday') : t('habitsGoals.markComplete')}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Success Analytics Summary */}
      {habits.length > 0 && (
        <div className="success-summary">
          <h3>{t('habitsGoals.successOverview')}</h3>
          <div className="summary-stats">
            <div className="summary-card">
              <div className="summary-value">{habits.length}</div>
              <div className="summary-label">{t('habitsGoals.totalHabits')}</div>
            </div>
            <div className="summary-card">
              <div className="summary-value" style={{ color: '#22c55e' }}>
                {habits.filter(h => getSuccessRate(h) >= 80).length}
              </div>
              <div className="summary-label">{t('habitsGoals.highSuccess')}</div>
            </div>
            <div className="summary-card">
              <div className="summary-value" style={{ color: '#f59e0b' }}>
                {habits.filter(h => (h.streak || 0) >= 7).length}
              </div>
              <div className="summary-label">{t('habitsGoals.sevenDayStreaks')}</div>
            </div>
            <div className="summary-card">
              <div className="summary-value">
                {Math.round(habits.reduce((sum, h) => sum + getSuccessRate(h), 0) / habits.length) || 0}%
              </div>
              <div className="summary-label">{t('habitsGoals.averageSuccess')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HabitsGoals

