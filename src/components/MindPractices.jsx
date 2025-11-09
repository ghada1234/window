import { Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './MindPractices.css'

const MindPractices = () => {
  const { t } = useTranslation()
  
  const breathingExercises = [
    {
      key: 'boxBreathing',
      duration: `5 ${t('mindPractices.min')}`
    },
    {
      key: 'fourSevenEight',
      duration: `5 ${t('mindPractices.min')}`
    },
    {
      key: 'diaphragmatic',
      duration: `5 ${t('mindPractices.min')}`
    }
  ]

  return (
    <div className="mind-practices-page">
      <header className="page-header">
        <h1>{t('mindPractices.title')}</h1>
        <p>{t('mindPractices.subtitle')}</p>
      </header>

      <div className="practice-tabs">
        <button className="tab active">{t('mindPractices.breathing')}</button>
        <button className="tab">{t('mindPractices.meditation')}</button>
        <button className="tab">{t('mindPractices.mindfulness')}</button>
        <button className="tab">{t('mindPractices.history')}</button>
      </div>

      <section className="breathing-exercises">
        <h2>{t('mindPractices.breathingExercises')}</h2>
        <p>{t('mindPractices.breathingSubtitle')}</p>
        
        <div className="exercises-grid">
          {breathingExercises.map((exercise, index) => (
            <div key={index} className="exercise-card">
              <div className="exercise-header">
                <span className="exercise-duration">{exercise.duration}</span>
                <h3 className="exercise-title">{t(`mindPractices.${exercise.key}.title`)}</h3>
              </div>
              <p className="exercise-description">{t(`mindPractices.${exercise.key}.description`)}</p>
              <div className="exercise-benefits">
                <strong>{t('mindPractices.benefits')}</strong>
                <div className="benefits-list">
                  <span className="benefit-tag">{t(`mindPractices.${exercise.key}.benefit1`)}</span>
                  <span className="benefit-tag">{t(`mindPractices.${exercise.key}.benefit2`)}</span>
                  <span className="benefit-tag">{t(`mindPractices.${exercise.key}.benefit3`)}</span>
                </div>
              </div>
              <button className="start-practice-btn">
                <Play size={18} />
                <span>{t('mindPractices.startPractice')}</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default MindPractices


