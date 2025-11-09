import { useState } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Droplet, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './WaterLog.css'

const WaterLog = () => {
  const { t } = useTranslation()
  const { waterIntake, addWaterEntry, setWaterGoal, addWater } = useWellness()
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }))
  const [newEntryGlasses, setNewEntryGlasses] = useState(0)

  const handleAddEntry = (e) => {
    e.preventDefault()
    if (newEntryGlasses > 0) {
      const entry = {
        id: Date.now(),
        glasses: newEntryGlasses,
        date: selectedDate
      }
      addWaterEntry(entry)
      setNewEntryGlasses(0)
    }
  }

  const handleUpdateGoal = () => {
    const newGoal = prompt('Enter new daily goal (glasses):', waterIntake.goal)
    if (newGoal && !isNaN(newGoal) && newGoal > 0) {
      setWaterGoal(parseInt(newGoal))
    }
  }

  const handleAddGlass = (amount) => {
    addWater(amount)
  }

  return (
    <div className="water-log-page">
      <header className="page-header">
        <h1>{t('waterLog.title')}</h1>
        <p>{t('waterLog.subtitle')}</p>
      </header>

      <div className="water-log-content">
        <div className="water-log-left">
          <div className="add-entry-card">
            <h2>{t('waterLog.addNewEntry')}</h2>
            <form onSubmit={handleAddEntry} className="water-entry-form">
              <div className="form-row">
                <label>{t('waterLog.glassesOfWater')}</label>
                <input
                  type="number"
                  min="0"
                  value={newEntryGlasses}
                  onChange={(e) => setNewEntryGlasses(parseInt(e.target.value) || 0)}
                  className="glasses-input"
                />
              </div>
              <div className="form-row">
                <label>{t('waterLog.dailyGoal')}</label>
                <input
                  type="number"
                  min="1"
                  value={waterIntake.goal}
                  onChange={(e) => setWaterGoal(parseInt(e.target.value) || 8)}
                  className="goal-input"
                />
              </div>
              <div className="form-row">
                <label>{t('waterLog.date')}</label>
                <input
                  type="text"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="date-input"
                />
              </div>
              <button type="submit" className="add-entry-btn">
                {t('waterLog.addEntry')}
              </button>
            </form>

            <div className="today-goal-card">
              <h3>{t('waterLog.todayWaterGoal')}</h3>
              <p>{t('waterLog.currentGoal')} {waterIntake.goal} {t('waterLog.glassesPerDay')}</p>
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(waterIntake.glasses / waterIntake.goal) * 100}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {waterIntake.glasses} / {waterIntake.goal} {t('waterLog.glasses')}
                </div>
              </div>
              <button className="update-goal-btn" onClick={handleUpdateGoal}>
                {t('waterLog.updateGoal')}
              </button>
            </div>

            <div className="quick-add">
              <button className="quick-add-btn" onClick={() => handleAddGlass(1)}>
                {t('waterLog.addOneGlass')}
              </button>
              <button className="quick-add-btn" onClick={() => handleAddGlass(2)}>
                {t('waterLog.addTwoGlasses')}
              </button>
              <button className="quick-add-btn" onClick={() => {
                const custom = prompt('Enter number of glasses:')
                if (custom && !isNaN(custom)) {
                  handleAddGlass(parseInt(custom))
                }
              }}>
                {t('waterLog.custom')}
              </button>
            </div>

            {waterIntake.glasses < waterIntake.goal && (
              <div className="alert-card">
                <AlertCircle size={20} />
                <div>
                  <strong>{t('waterLog.lowWaterAlert')}</strong>
                  <p>{t('waterLog.alertMessage', { 
                    current: waterIntake.glasses, 
                    remaining: waterIntake.goal - waterIntake.glasses, 
                    goal: waterIntake.goal 
                  })}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="water-log-right">
          <div className="history-card">
            <h2>{t('waterLog.history')}</h2>
            {waterIntake.entries.length === 0 ? (
              <div className="no-history">
                <Droplet size={48} />
                <p>No water intake logged yet.</p>
                <p className="help-text">Add your first water log entry using the form on the left.</p>
              </div>
            ) : (
              <div className="history-list">
                {waterIntake.entries.map((entry) => (
                  <div key={entry.id} className="history-item">
                    <div className="history-date">{entry.date}</div>
                    <div className="history-glasses">{entry.glasses} glasses</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaterLog


  )
}

export default WaterLog

