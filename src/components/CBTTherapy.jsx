import { useState, useEffect } from 'react'
import { Brain, BookOpen, CheckCircle, PlusCircle, Edit3, Trash2, Play, Target, Heart, Sparkles, AlertCircle, Lightbulb } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getJSON, setJSON } from '../utils/storage'
import './CBTTherapy.css'

const CBTTherapy = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('thought-records') // thought-records, grounding, relaxation, activation
  const [thoughtRecords, setThoughtRecords] = useState([])
  const [groundingExercises, setGroundingExercises] = useState([])
  const [activationPlans, setActivationPlans] = useState([])
  const [showNewRecordModal, setShowNewRecordModal] = useState(false)
  const [showActivationModal, setShowActivationModal] = useState(false)

  // Thought Record Form
  const [thoughtRecord, setThoughtRecord] = useState({
    situation: '',
    automaticThought: '',
    emotion: '',
    emotionIntensity: 5,
    evidence: '',
    alternativeThought: '',
    newEmotion: '',
    newEmotionIntensity: 5
  })

  // Activation Plan Form
  const [activationPlan, setActivationPlan] = useState({
    activity: '',
    day: '',
    time: '',
    motivation: 5,
    importance: 5
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setThoughtRecords(getJSON('cbtThoughtRecords', []))
    setGroundingExercises(getJSON('cbtGroundingExercises', []))
    setActivationPlans(getJSON('cbtActivationPlans', []))
  }

  const saveThoughtRecord = () => {
    if (!thoughtRecord.situation || !thoughtRecord.automaticThought) {
      alert(t('cbt.fillRequired'))
      return
    }

    const record = {
      ...thoughtRecord,
      id: Date.now(),
      date: new Date().toISOString(),
      dateString: new Date().toLocaleDateString()
    }

    const records = [record, ...getJSON('cbtThoughtRecords', [])]
    setJSON('cbtThoughtRecords', records)
    setThoughtRecords(records)
    setShowNewRecordModal(false)
    resetThoughtRecord()
  }

  const resetThoughtRecord = () => {
    setThoughtRecord({
      situation: '',
      automaticThought: '',
      emotion: '',
      emotionIntensity: 5,
      evidence: '',
      alternativeThought: '',
      newEmotion: '',
      newEmotionIntensity: 5
    })
  }

  const deleteThoughtRecord = (id) => {
    if (confirm(t('cbt.confirmDelete'))) {
      const records = thoughtRecords.filter(r => r.id !== id)
      setJSON('cbtThoughtRecords', records)
      setThoughtRecords(records)
    }
  }

  const saveActivationPlan = () => {
    if (!activationPlan.activity || !activationPlan.day) {
      alert(t('cbt.fillRequired'))
      return
    }

    const plan = {
      ...activationPlan,
      id: Date.now(),
      completed: false,
      date: new Date().toISOString()
    }

    const plans = [plan, ...getJSON('cbtActivationPlans', [])]
    setJSON('cbtActivationPlans', plans)
    setActivationPlans(plans)
    setShowActivationModal(false)
    resetActivationPlan()
  }

  const resetActivationPlan = () => {
    setActivationPlan({
      activity: '',
      day: '',
      time: '',
      motivation: 5,
      importance: 5
    })
  }

  const toggleActivationComplete = (id) => {
    const plans = activationPlans.map(p => 
      p.id === id ? { ...p, completed: !p.completed } : p
    )
    setJSON('cbtActivationPlans', plans)
    setActivationPlans(plans)
  }

  const deleteActivationPlan = (id) => {
    if (confirm(t('cbt.confirmDelete'))) {
      const plans = activationPlans.filter(p => p.id !== id)
      setJSON('cbtActivationPlans', plans)
      setActivationPlans(plans)
    }
  }

  const startGroundingExercise = (type) => {
    const exercise = {
      id: Date.now(),
      type,
      date: new Date().toISOString(),
      dateString: new Date().toLocaleDateString()
    }
    
    const exercises = [exercise, ...getJSON('cbtGroundingExercises', [])]
    setJSON('cbtGroundingExercises', exercises)
    setGroundingExercises(exercises)
  }

  return (
    <div className="cbt-therapy-page">
      <header className="page-header">
        <div>
          <h1><Brain size={32} /> {t('cbt.title')}</h1>
          <p>{t('cbt.subtitle')}</p>
        </div>
      </header>

      {/* Info Banner */}
      <div className="cbt-info-banner">
        <Lightbulb size={24} />
        <div>
          <strong>{t('cbt.whatIsCBT')}</strong>
          <p>{t('cbt.whatIsCBTDesc')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="cbt-tabs">
        <button 
          className={`cbt-tab ${activeTab === 'thought-records' ? 'active' : ''}`}
          onClick={() => setActiveTab('thought-records')}
        >
          <BookOpen size={18} />
          {t('cbt.thoughtRecords')}
        </button>
        <button 
          className={`cbt-tab ${activeTab === 'grounding' ? 'active' : ''}`}
          onClick={() => setActiveTab('grounding')}
        >
          <Heart size={18} />
          {t('cbt.grounding')}
        </button>
        <button 
          className={`cbt-tab ${activeTab === 'relaxation' ? 'active' : ''}`}
          onClick={() => setActiveTab('relaxation')}
        >
          <Sparkles size={18} />
          {t('cbt.relaxation')}
        </button>
        <button 
          className={`cbt-tab ${activeTab === 'activation' ? 'active' : ''}`}
          onClick={() => setActiveTab('activation')}
        >
          <Target size={18} />
          {t('cbt.activation')}
        </button>
      </div>

      {/* Thought Records Tab */}
      {activeTab === 'thought-records' && (
        <div className="cbt-content">
          <div className="content-header">
            <div>
              <h2>{t('cbt.thoughtRecords')}</h2>
              <p>{t('cbt.thoughtRecordsDesc')}</p>
            </div>
            <button className="cbt-primary-btn" onClick={() => setShowNewRecordModal(true)}>
              <PlusCircle size={20} />
              {t('cbt.newRecord')}
            </button>
          </div>

          {thoughtRecords.length === 0 ? (
            <div className="cbt-empty-state">
              <BookOpen size={48} />
              <p>{t('cbt.noThoughtRecords')}</p>
            </div>
          ) : (
            <div className="thought-records-list">
              {thoughtRecords.map(record => (
                <div key={record.id} className="thought-record-card">
                  <div className="record-header">
                    <span className="record-date">{record.dateString}</span>
                    <button className="delete-icon-btn" onClick={() => deleteThoughtRecord(record.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="record-section">
                    <h4>{t('cbt.situation')}</h4>
                    <p>{record.situation}</p>
                  </div>

                  <div className="record-section">
                    <h4>{t('cbt.automaticThought')}</h4>
                    <p>{record.automaticThought}</p>
                    {record.emotion && (
                      <div className="emotion-indicator">
                        <span className="emotion-label">{record.emotion}</span>
                        <div className="intensity-bar">
                          <div 
                            className="intensity-fill" 
                            style={{ width: `${(record.emotionIntensity / 10) * 100}%` }}
                          />
                        </div>
                        <span className="intensity-value">{record.emotionIntensity}/10</span>
                      </div>
                    )}
                  </div>

                  {record.evidence && (
                    <div className="record-section">
                      <h4>{t('cbt.evidence')}</h4>
                      <p>{record.evidence}</p>
                    </div>
                  )}

                  {record.alternativeThought && (
                    <div className="record-section alternative">
                      <h4>{t('cbt.alternativeThought')}</h4>
                      <p>{record.alternativeThought}</p>
                      {record.newEmotion && (
                        <div className="emotion-indicator">
                          <span className="emotion-label">{record.newEmotion}</span>
                          <div className="intensity-bar">
                            <div 
                              className="intensity-fill positive" 
                              style={{ width: `${(record.newEmotionIntensity / 10) * 100}%` }}
                            />
                          </div>
                          <span className="intensity-value">{record.newEmotionIntensity}/10</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grounding Techniques Tab */}
      {activeTab === 'grounding' && (
        <div className="cbt-content">
          <div className="content-header">
            <div>
              <h2>{t('cbt.grounding')}</h2>
              <p>{t('cbt.groundingDesc')}</p>
            </div>
          </div>

          <div className="grounding-techniques">
            <div className="technique-card featured">
              <div className="technique-icon">👁️</div>
              <h3>{t('cbt.fiveThings')}</h3>
              <p>{t('cbt.fiveThingsDesc')}</p>
              <button className="cbt-primary-btn" onClick={() => startGroundingExercise('5-4-3-2-1')}>
                <Play size={18} />
                {t('cbt.startExercise')}
              </button>
              <div className="technique-steps">
                <div className="step-item">5️⃣ {t('cbt.fiveSee')}</div>
                <div className="step-item">4️⃣ {t('cbt.fourTouch')}</div>
                <div className="step-item">3️⃣ {t('cbt.threeHear')}</div>
                <div className="step-item">2️⃣ {t('cbt.twoSmell')}</div>
                <div className="step-item">1️⃣ {t('cbt.oneTaste')}</div>
              </div>
            </div>

            <div className="technique-card">
              <div className="technique-icon">🫁</div>
              <h3>{t('cbt.boxBreathing')}</h3>
              <p>{t('cbt.boxBreathingDesc')}</p>
              <button className="cbt-primary-btn" onClick={() => startGroundingExercise('box-breathing')}>
                <Play size={18} />
                {t('cbt.startExercise')}
              </button>
              <div className="technique-steps">
                <div className="step-item">{t('cbt.breathIn4')}</div>
                <div className="step-item">{t('cbt.hold4')}</div>
                <div className="step-item">{t('cbt.breathOut4')}</div>
                <div className="step-item">{t('cbt.hold4again')}</div>
              </div>
            </div>

            <div className="technique-card">
              <div className="technique-icon">👣</div>
              <h3>{t('cbt.bodyScan')}</h3>
              <p>{t('cbt.bodyScanDesc')}</p>
              <button className="cbt-primary-btn" onClick={() => startGroundingExercise('body-scan')}>
                <Play size={18} />
                {t('cbt.startExercise')}
              </button>
            </div>

            <div className="technique-card">
              <div className="technique-icon">🧊</div>
              <h3>{t('cbt.coldWater')}</h3>
              <p>{t('cbt.coldWaterDesc')}</p>
              <button className="cbt-primary-btn" onClick={() => startGroundingExercise('cold-water')}>
                <Play size={18} />
                {t('cbt.startExercise')}
              </button>
            </div>
          </div>

          {groundingExercises.length > 0 && (
            <div className="exercise-history">
              <h3>{t('cbt.recentExercises')}</h3>
              <div className="history-list">
                {groundingExercises.slice(0, 10).map(ex => (
                  <div key={ex.id} className="history-item">
                    <CheckCircle size={16} color="#10b981" />
                    <span>{t(`cbt.${ex.type}`)}</span>
                    <span className="history-date">{ex.dateString}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progressive Muscle Relaxation Tab */}
      {activeTab === 'relaxation' && (
        <div className="cbt-content">
          <div className="content-header">
            <div>
              <h2>{t('cbt.relaxation')}</h2>
              <p>{t('cbt.relaxationDesc')}</p>
            </div>
          </div>

          <div className="relaxation-guide">
            <div className="pmr-instructions">
              <h3>{t('cbt.pmrTitle')}</h3>
              <p>{t('cbt.pmrIntro')}</p>

              <div className="muscle-groups">
                {[
                  { key: 'hands', emoji: '✊' },
                  { key: 'arms', emoji: '💪' },
                  { key: 'shoulders', emoji: '🤷' },
                  { key: 'face', emoji: '😤' },
                  { key: 'stomach', emoji: '🫁' },
                  { key: 'legs', emoji: '🦵' },
                  { key: 'feet', emoji: '🦶' }
                ].map(group => (
                  <div key={group.key} className="muscle-group-card">
                    <span className="group-emoji">{group.emoji}</span>
                    <div className="group-info">
                      <h4>{t(`cbt.pmr.${group.key}.title`)}</h4>
                      <p>{t(`cbt.pmr.${group.key}.instruction`)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="cbt-primary-btn large" 
                onClick={() => startGroundingExercise('pmr')}
              >
                <Play size={20} />
                {t('cbt.startPMR')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Behavioral Activation Tab */}
      {activeTab === 'activation' && (
        <div className="cbt-content">
          <div className="content-header">
            <div>
              <h2>{t('cbt.activation')}</h2>
              <p>{t('cbt.activationDesc')}</p>
            </div>
            <button className="cbt-primary-btn" onClick={() => setShowActivationModal(true)}>
              <PlusCircle size={20} />
              {t('cbt.planActivity')}
            </button>
          </div>

          {activationPlans.length === 0 ? (
            <div className="cbt-empty-state">
              <Target size={48} />
              <p>{t('cbt.noActivationPlans')}</p>
            </div>
          ) : (
            <div className="activation-plans-grid">
              {activationPlans.map(plan => (
                <div key={plan.id} className={`activation-card ${plan.completed ? 'completed' : ''}`}>
                  <div className="activation-header">
                    <button 
                      className="checkbox-btn"
                      onClick={() => toggleActivationComplete(plan.id)}
                    >
                      {plan.completed && <CheckCircle size={20} />}
                    </button>
                    <button className="delete-icon-btn" onClick={() => deleteActivationPlan(plan.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h4 className="activity-title">{plan.activity}</h4>
                  <div className="activity-schedule">
                    <span>📅 {plan.day}</span>
                    {plan.time && <span>⏰ {plan.time}</span>}
                  </div>

                  <div className="activity-metrics">
                    <div className="metric">
                      <span className="metric-label">{t('cbt.motivation')}</span>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill" 
                          style={{ width: `${(plan.motivation / 10) * 100}%` }}
                        />
                      </div>
                      <span>{plan.motivation}/10</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">{t('cbt.importance')}</span>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill" 
                          style={{ width: `${(plan.importance / 10) * 100}%` }}
                        />
                      </div>
                      <span>{plan.importance}/10</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Thought Record Modal */}
      {showNewRecordModal && (
        <div className="cbt-modal-overlay" onClick={() => setShowNewRecordModal(false)}>
          <div className="cbt-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{t('cbt.newThoughtRecord')}</h2>
            <p className="modal-subtitle">{t('cbt.newThoughtRecordDesc')}</p>

            <div className="form-group">
              <label>{t('cbt.situation')} *</label>
              <textarea
                value={thoughtRecord.situation}
                onChange={(e) => setThoughtRecord({...thoughtRecord, situation: e.target.value})}
                placeholder={t('cbt.situationPlaceholder')}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>{t('cbt.automaticThought')} *</label>
              <textarea
                value={thoughtRecord.automaticThought}
                onChange={(e) => setThoughtRecord({...thoughtRecord, automaticThought: e.target.value})}
                placeholder={t('cbt.thoughtPlaceholder')}
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('cbt.emotion')}</label>
                <input
                  type="text"
                  value={thoughtRecord.emotion}
                  onChange={(e) => setThoughtRecord({...thoughtRecord, emotion: e.target.value})}
                  placeholder={t('cbt.emotionPlaceholder')}
                />
              </div>
              <div className="form-group">
                <label>{t('cbt.intensity')} ({thoughtRecord.emotionIntensity}/10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={thoughtRecord.emotionIntensity}
                  onChange={(e) => setThoughtRecord({...thoughtRecord, emotionIntensity: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('cbt.evidence')}</label>
              <textarea
                value={thoughtRecord.evidence}
                onChange={(e) => setThoughtRecord({...thoughtRecord, evidence: e.target.value})}
                placeholder={t('cbt.evidencePlaceholder')}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>{t('cbt.alternativeThought')}</label>
              <textarea
                value={thoughtRecord.alternativeThought}
                onChange={(e) => setThoughtRecord({...thoughtRecord, alternativeThought: e.target.value})}
                placeholder={t('cbt.alternativePlaceholder')}
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('cbt.newEmotion')}</label>
                <input
                  type="text"
                  value={thoughtRecord.newEmotion}
                  onChange={(e) => setThoughtRecord({...thoughtRecord, newEmotion: e.target.value})}
                  placeholder={t('cbt.newEmotionPlaceholder')}
                />
              </div>
              <div className="form-group">
                <label>{t('cbt.newIntensity')} ({thoughtRecord.newEmotionIntensity}/10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={thoughtRecord.newEmotionIntensity}
                  onChange={(e) => setThoughtRecord({...thoughtRecord, newEmotionIntensity: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="cbt-secondary-btn" onClick={() => {
                setShowNewRecordModal(false)
                resetThoughtRecord()
              }}>
                {t('common.cancel')}
              </button>
              <button className="cbt-primary-btn" onClick={saveThoughtRecord}>
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Activation Plan Modal */}
      {showActivationModal && (
        <div className="cbt-modal-overlay" onClick={() => setShowActivationModal(false)}>
          <div className="cbt-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{t('cbt.newActivationPlan')}</h2>
            <p className="modal-subtitle">{t('cbt.newActivationPlanDesc')}</p>

            <div className="form-group">
              <label>{t('cbt.activity')} *</label>
              <input
                type="text"
                value={activationPlan.activity}
                onChange={(e) => setActivationPlan({...activationPlan, activity: e.target.value})}
                placeholder={t('cbt.activityPlaceholder')}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('cbt.day')} *</label>
                <select
                  value={activationPlan.day}
                  onChange={(e) => setActivationPlan({...activationPlan, day: e.target.value})}
                >
                  <option value="">{t('cbt.selectDay')}</option>
                  <option value="Monday">{t('cbt.days.monday')}</option>
                  <option value="Tuesday">{t('cbt.days.tuesday')}</option>
                  <option value="Wednesday">{t('cbt.days.wednesday')}</option>
                  <option value="Thursday">{t('cbt.days.thursday')}</option>
                  <option value="Friday">{t('cbt.days.friday')}</option>
                  <option value="Saturday">{t('cbt.days.saturday')}</option>
                  <option value="Sunday">{t('cbt.days.sunday')}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t('cbt.time')}</label>
                <input
                  type="time"
                  value={activationPlan.time}
                  onChange={(e) => setActivationPlan({...activationPlan, time: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('cbt.motivation')} ({activationPlan.motivation}/10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={activationPlan.motivation}
                onChange={(e) => setActivationPlan({...activationPlan, motivation: parseInt(e.target.value)})}
              />
            </div>

            <div className="form-group">
              <label>{t('cbt.importance')} ({activationPlan.importance}/10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={activationPlan.importance}
                onChange={(e) => setActivationPlan({...activationPlan, importance: parseInt(e.target.value)})}
              />
            </div>

            <div className="modal-actions">
              <button className="cbt-secondary-btn" onClick={() => {
                setShowActivationModal(false)
                resetActivationPlan()
              }}>
                {t('common.cancel')}
              </button>
              <button className="cbt-primary-btn" onClick={saveActivationPlan}>
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CBTTherapy


