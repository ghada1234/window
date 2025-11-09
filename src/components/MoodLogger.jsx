import { useState } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './MoodLogger.css'

const MoodLogger = () => {
  const { t } = useTranslation()
  const { addMoodLog } = useWellness()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mood, setMood] = useState('')
  const [energy, setEnergy] = useState('')

  const moods = ['😊 Good', '😄 Great', '😌 Calm', '😔 Low', '😢 Sad', '😠 Angry', '😰 Anxious']
  const energyLevels = ['High', 'Moderate', 'Low']

  const handleLogMood = (e) => {
    e.preventDefault()
    if (mood && energy) {
      const moodEntry = {
        id: Date.now(),
        mood,
        energy,
        date: new Date().toLocaleString('en-US', {
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
      setIsModalOpen(false)
      setMood('')
      setEnergy('')
    }
  }

  return (
    <>
      <div className="mood-logger">
        <div className="mood-logger-header">
          <Heart size={24} />
          <div>
            <h3>{t('dashboard.logYourMood')}</h3>
            <p>{t('dashboard.moodSubtitle')}</p>
          </div>
        </div>
        <button className="log-mood-btn" onClick={() => setIsModalOpen(true)}>
          {t('dashboard.logMood')}
        </button>
      </div>

      {isModalOpen && (
        <div className="mood-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="mood-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('dashboard.logYourMood')}</h3>
            <form onSubmit={handleLogMood}>
              <div className="mood-select-group">
                <label>How are you feeling?</label>
                <div className="mood-options">
                  {moods.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`mood-option ${mood === m ? 'selected' : ''}`}
                      onClick={() => setMood(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="energy-select-group">
                <label>Energy Level</label>
                <div className="energy-options">
                  {energyLevels.map((e) => (
                    <button
                      key={e}
                      type="button"
                      className={`energy-option ${energy === e ? 'selected' : ''}`}
                      onClick={() => setEnergy(e)}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mood-modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" disabled={!mood || !energy}>Log Mood</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default MoodLogger

