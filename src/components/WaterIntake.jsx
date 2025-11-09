import { useWellness } from '../context/WellnessContext'
import { Droplet, Trash2, History } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './WaterIntake.css'

const WaterIntake = () => {
  const { t, i18n } = useTranslation()
  const { waterIntake, addWater, deleteWaterEntry } = useWellness()
  const { glasses, goal: totalGlasses, entries } = waterIntake

  const addGlass = (amount = 1) => {
    addWater(amount)
  }

  return (
    <div className="water-intake">
      <div className="water-intake-header">
        <Droplet size={24} />
        <h3>{t('dashboard.waterIntake')}</h3>
      </div>
      <div className="water-intake-content">
        <div className="water-intake-counter">
          <span className="water-current">{glasses}</span>
          <span className="water-separator">/</span>
          <span className="water-total">{totalGlasses}</span>
          <span className="water-label">{t('dashboard.todayGlasses')}</span>
        </div>
        <div className="water-glasses">
          {Array.from({ length: totalGlasses }).map((_, index) => (
            <div
              key={index}
              className={`water-glass ${index < glasses ? 'filled' : ''}`}
              onClick={addGlass}
            >
              <Droplet size={20} />
            </div>
          ))}
        </div>
        <button className="water-add-btn" onClick={addGlass}>
          {t('dashboard.addGlass')}
        </button>

        {/* Water History */}
        {entries && entries.length > 0 && (
          <div className="water-history">
            <div className="history-header">
              <History size={18} />
              <h4>{t('waterTracker.history')}</h4>
            </div>
            <div className="water-entries-list">
              {entries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="water-entry-item">
                  <div className="entry-info">
                    <Droplet size={16} />
                    <span>{entry.glasses} {entry.glasses === 1 ? t('waterTracker.glass') : t('waterTracker.glasses')}</span>
                    <span className="entry-time">
                      {new Date(entry.timestamp).toLocaleString(i18n.language === 'ar' ? 'ar-AE' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <button 
                    className="icon-btn delete-btn" 
                    onClick={() => deleteWaterEntry(entry.id)}
                    title={t('common.delete')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WaterIntake

