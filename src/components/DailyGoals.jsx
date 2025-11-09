import { CheckCircle, Droplet, Footprints, BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './DailyGoals.css'

const DailyGoals = () => {
  const { t } = useTranslation()
  
  const goals = [
    { icon: CheckCircle, label: t('dashboard.meditate'), current: 0, target: 10, unit: t('dashboard.minutes'), targetNum: 10 },
    { icon: Droplet, label: t('dashboard.drinkWater'), current: 0, target: 8, unit: t('dashboard.glasses'), targetNum: 8 },
    { icon: Footprints, label: t('dashboard.walk'), current: 0, target: 30, unit: t('dashboard.minutes'), targetNum: 30 },
    { icon: BookOpen, label: t('dashboard.journal'), current: 0, target: 1, unit: t('dashboard.entry'), targetNum: 1 }
  ]

  return (
    <div className="daily-goals">
      <h3>{t('dashboard.dailyGoals')}</h3>
      <p className="daily-goals-subtitle">{t('dashboard.goalsSubtitle')}</p>
      <div className="goals-list">
        {goals.map((goal, index) => {
          const Icon = goal.icon
          const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0
          return (
            <div key={index} className="goal-item">
              <div className="goal-header">
                <Icon size={20} />
                <span className="goal-label">{goal.label}</span>
              </div>
              <div className="goal-progress">
                <div className="goal-progress-bar">
                  <div 
                    className="goal-progress-fill" 
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <div className="goal-stats">
                  <span>{goal.current} / {goal.target} {goal.unit}</span>
                </div>
                <div className="goal-message">{goal.targetNum} {goal.unit} {t('dashboard.moreToGo')}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DailyGoals


