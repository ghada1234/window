import { useState, useEffect } from 'react'
import { Users, Plus, MessageCircle, UserPlus, ExternalLink, X, CheckCircle } from 'lucide-react'
import { getJSON, setJSON } from '../utils/storage'
import { useTranslation } from 'react-i18next'
import './WhatsAppGroups.css'

const WhatsAppGroups = () => {
  const { t } = useTranslation()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [groups, setGroups] = useState([])
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    category: 'General Wellness',
    whatsappLink: '',
    icon: '💪'
  })

  // Load groups from storage on mount
  useEffect(() => {
    const savedGroups = getJSON('whatsappGroups', [
      {
        id: 1,
        name: t('whatsappGroups.defaultGroups.wellnessWarriors.name'),
        description: t('whatsappGroups.defaultGroups.wellnessWarriors.description'),
        category: t('whatsappGroups.categories.generalWellness'),
        members: 150,
        icon: '💪',
        whatsappLink: ''
      },
      {
        id: 2,
        name: t('whatsappGroups.defaultGroups.mindfulMeditation.name'),
        description: t('whatsappGroups.defaultGroups.mindfulMeditation.description'),
        category: t('whatsappGroups.categories.meditation'),
        members: 89,
        icon: '🧘',
        whatsappLink: ''
      },
      {
        id: 3,
        name: t('whatsappGroups.defaultGroups.nutritionHealth.name'),
        description: t('whatsappGroups.defaultGroups.nutritionHealth.description'),
        category: t('whatsappGroups.categories.nutrition'),
        members: 203,
        icon: '🥗',
        whatsappLink: ''
      },
      {
        id: 4,
        name: t('whatsappGroups.defaultGroups.fitnessBuddies.name'),
        description: t('whatsappGroups.defaultGroups.fitnessBuddies.description'),
        category: t('whatsappGroups.categories.fitness'),
        members: 175,
        icon: '🏋️',
        whatsappLink: ''
      }
    ])
    setGroups(savedGroups)
  }, [t])

  const handleJoinGroup = (group) => {
    if (group.whatsappLink) {
      // Open WhatsApp group link
      window.open(group.whatsappLink, '_blank')
    } else {
      // If no link, create a WhatsApp message to request join
      const message = `Hi! I'd like to join the "${group.name}" wellness group. Can you send me the invite link?`
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    }
  }

  const handleCreateGroup = () => {
    if (!newGroup.name || !newGroup.description) {
      alert(t('whatsappGroups.fillRequired'))
      return
    }

    const groupToAdd = {
      id: Date.now(),
      ...newGroup,
      members: 1, // Creator is first member
      createdAt: new Date().toISOString()
    }

    const updatedGroups = [...groups, groupToAdd]
    setGroups(updatedGroups)
    setJSON('whatsappGroups', updatedGroups)

    // Reset form
    setNewGroup({
      name: '',
      description: '',
      category: t('whatsappGroups.categories.generalWellness'),
      whatsappLink: '',
      icon: '💪'
    })
    setShowCreateForm(false)

    // Open WhatsApp to create actual group
    alert(t('whatsappGroups.groupCreated'))
  }

  const handleOpenWhatsAppToCreateGroup = () => {
    // Open WhatsApp
    const message = `Let's create a wellness group: ${newGroup.name}\n\n${newGroup.description}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const iconOptions = ['💪', '🧘', '🥗', '🏋️', '❤️', '🧠', '💆', '🌟', '🌿', '☮️']
  const categoryOptions = [
    { value: 'generalWellness', label: t('whatsappGroups.categories.generalWellness') },
    { value: 'meditation', label: t('whatsappGroups.categories.meditation') },
    { value: 'nutrition', label: t('whatsappGroups.categories.nutrition') },
    { value: 'fitness', label: t('whatsappGroups.categories.fitness') },
    { value: 'mentalHealth', label: t('whatsappGroups.categories.mentalHealth') },
    { value: 'sleep', label: t('whatsappGroups.categories.sleep') },
    { value: 'yoga', label: t('whatsappGroups.categories.yoga') },
    { value: 'running', label: t('whatsappGroups.categories.running') },
    { value: 'weightLoss', label: t('whatsappGroups.categories.weightLoss') },
    { value: 'other', label: t('whatsappGroups.categories.other') }
  ]

  return (
    <div className="whatsapp-groups-page">
      <div className="whatsapp-groups-container">
        <div className="page-header">
        <div>
          <h1>{t('whatsappGroups.title')}</h1>
          <p>{t('whatsappGroups.subtitle')}</p>
        </div>
        <button 
          className="create-group-btn"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus size={20} />
          {t('whatsappGroups.createGroup')}
        </button>
      </div>

      <div className="groups-grid">
        {groups.map(group => (
          <div key={group.id} className="group-card">
            <div className="group-header">
              <div className="group-icon">{group.icon}</div>
              <div className="group-info">
                <h3>{group.name}</h3>
                <span className="group-category">{group.category}</span>
              </div>
            </div>
            <p className="group-description">{group.description}</p>
            <div className="group-footer">
              <div className="group-members">
                <Users size={16} />
                <span>{group.members} {t('whatsappGroups.members')}</span>
              </div>
              <button 
                className="join-btn"
                onClick={() => handleJoinGroup(group)}
              >
                <UserPlus size={16} />
                {t('whatsappGroups.joinOnWhatsApp')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="create-group-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('whatsappGroups.createGroupModal')}</h2>
              <button className="close-btn" onClick={() => setShowCreateForm(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>{t('whatsappGroups.groupName')} *</label>
                <input
                  type="text"
                  placeholder={t('whatsappGroups.groupNamePlaceholder')}
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>{t('whatsappGroups.description')} *</label>
                <textarea
                  placeholder={t('whatsappGroups.descriptionPlaceholder')}
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>{t('whatsappGroups.category')}</label>
                <select
                  value={newGroup.category}
                  onChange={(e) => setNewGroup({...newGroup, category: e.target.value})}
                >
                  {categoryOptions.map(cat => (
                    <option key={cat.value} value={cat.label}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t('whatsappGroups.icon')}</label>
                <div className="icon-picker">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      className={`icon-option ${newGroup.icon === icon ? 'selected' : ''}`}
                      onClick={() => setNewGroup({...newGroup, icon})}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>{t('whatsappGroups.whatsappLink')}</label>
                <input
                  type="url"
                  placeholder={t('whatsappGroups.whatsappLinkPlaceholder')}
                  value={newGroup.whatsappLink}
                  onChange={(e) => setNewGroup({...newGroup, whatsappLink: e.target.value})}
                />
                <small>{t('whatsappGroups.addLinkLater')}</small>
              </div>

              <div className="info-box">
                <CheckCircle size={18} />
                <div>
                  <strong>{t('whatsappGroups.howItWorks')}</strong>
                  <p>{t('whatsappGroups.step1')}</p>
                  <p>{t('whatsappGroups.step2')}</p>
                  <p>{t('whatsappGroups.step3')}</p>
                  <p>{t('whatsappGroups.step4')}</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={handleOpenWhatsAppToCreateGroup}
              >
                <MessageCircle size={18} />
                {t('whatsappGroups.openWhatsApp')}
              </button>
              <button 
                className="btn-primary"
                onClick={handleCreateGroup}
              >
                <Plus size={18} />
                {t('whatsappGroups.createGroupButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="about-section">
        <h2>{t('whatsappGroups.aboutTitle')}</h2>
        <p>
          {t('whatsappGroups.aboutDesc')}
        </p>
        
        <div className="how-to-create">
          <h3>{t('whatsappGroups.wantToCreate')}</h3>
          <ol>
            <li>{t('whatsappGroups.createStep1')}</li>
            <li>{t('whatsappGroups.createStep2')}</li>
            <li>{t('whatsappGroups.createStep3')}</li>
            <li>{t('whatsappGroups.createStep4')}</li>
            <li>{t('whatsappGroups.createStep5')}</li>
          </ol>
        </div>
      </div>
      </div>
    </div>
  )
}

export default WhatsAppGroups

