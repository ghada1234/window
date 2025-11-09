import { useState } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Palette, Plus, X, Edit2, Trash2, Clock, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './Hobbies.css'

const Hobbies = () => {
  const { t, i18n } = useTranslation()
  const { hobbies, addHobby, updateHobby, deleteHobby } = useWellness()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingHobby, setEditingHobby] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'creative',
    frequency: 'weekly'
  })

  const categories = [
    { value: 'creative', label: t('hobbies.categories.creative') },
    { value: 'physical', label: t('hobbies.categories.physical') },
    { value: 'social', label: t('hobbies.categories.social') },
    { value: 'mindful', label: t('hobbies.categories.mindful') },
    { value: 'educational', label: t('hobbies.categories.educational') },
    { value: 'other', label: t('hobbies.categories.other') }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name.trim()) {
      if (editingHobby) {
        updateHobby(editingHobby.id, formData)
        setEditingHobby(null)
      } else {
        addHobby({
          ...formData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          sessions: []
        })
      }
      setFormData({
        name: '',
        description: '',
        category: 'creative',
        frequency: 'weekly'
      })
      setShowAddForm(false)
    }
  }

  const handleEdit = (hobby) => {
    setEditingHobby(hobby)
    setFormData({
      name: hobby.name,
      description: hobby.description || '',
      category: hobby.category,
      frequency: hobby.frequency
    })
    setShowAddForm(true)
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingHobby(null)
    setFormData({
      name: '',
      description: '',
      category: 'creative',
      frequency: 'weekly'
    })
  }

  return (
    <div className="hobbies-page">
      <div className="page-header">
        <div>
          <h1>{t('hobbies.title')}</h1>
          <p>{t('hobbies.subtitle')}</p>
        </div>
        <button 
          className="add-hobby-btn"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} />
          {t('hobbies.addHobby')}
        </button>
      </div>

      {showAddForm && (
        <div className="hobby-form-overlay">
          <div className="hobby-form-card">
            <div className="hobby-form-header">
              <h2>{editingHobby ? t('hobbies.editHobby') : t('hobbies.addNewHobby')}</h2>
              <button className="close-btn" onClick={handleCancel}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('hobbies.hobbyName')} *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('hobbies.hobbyNamePlaceholder')}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('hobbies.description')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('hobbies.descriptionPlaceholder')}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('hobbies.category')}</label>
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
                  <label>{t('hobbies.frequency')}</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  >
                    <option value="daily">{t('hobbies.frequencies.daily')}</option>
                    <option value="weekly">{t('hobbies.frequencies.weekly')}</option>
                    <option value="monthly">{t('hobbies.frequencies.monthly')}</option>
                    <option value="occasional">{t('hobbies.frequencies.occasional')}</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  {t('hobbies.cancel')}
                </button>
                <button type="submit" className="save-btn">
                  {editingHobby ? t('hobbies.updateHobby') : t('hobbies.createHobby')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {hobbies.length === 0 ? (
        <div className="empty-state">
          <Palette size={64} />
          <h2>{t('hobbies.noHobbies')}</h2>
          <p>{t('hobbies.startTracking')}</p>
          <button className="add-first-hobby-btn" onClick={() => setShowAddForm(true)}>
            {t('hobbies.addFirstHobby')}
          </button>
        </div>
      ) : (
        <div className="hobbies-grid">
          {hobbies.map(hobby => (
            <div key={hobby.id} className="hobby-card">
              <div className="hobby-card-header">
                <div className="hobby-title-section">
                  <Palette size={20} className="hobby-icon" />
                  <div>
                    <h3>{hobby.name}</h3>
                    <span className="hobby-category">{categories.find(c => c.value === hobby.category)?.label}</span>
                  </div>
                </div>
                <div className="hobby-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(hobby)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => deleteHobby(hobby.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {hobby.description && (
                <p className="hobby-description">{hobby.description}</p>
              )}

              <div className="hobby-meta">
                <div className="meta-item">
                  <Clock size={14} />
                  <span>{t(`hobbies.frequencies.${hobby.frequency}`)}</span>
                </div>
                <div className="meta-item">
                  <Calendar size={14} />
                  <span>{t('hobbies.started')} {new Date(hobby.createdAt).toLocaleDateString(i18n.language === 'ar' ? 'ar-AE' : 'en-US')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Hobbies




