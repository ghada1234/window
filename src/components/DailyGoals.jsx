import { CheckCircle, Droplet, Footprints, BookOpen } from 'lucide-react'
import './DailyGoals.css'

const DailyGoals = () => {
  const goals = [
    { icon: CheckCircle, label: 'Meditate', current: 0, target: 10, unit: 'minutes', message: '10 minutes more to go' },
    { icon: Droplet, label: 'Drink Water', current: 0, target: 8, unit: 'glasses', message: '8 glasses more to go' },
    { icon: Footprints, label: 'Walk', current: 0, target: 30, unit: 'minutes', message: '30 minutes more to go' },
    { icon: BookOpen, label: 'Journal', current: 0, target: 1, unit: 'entry', message: '1 entry more to go' }
  ]

  return (
    <div className="daily-goals">
      <h3>Daily Goals</h3>
      <p className="daily-goals-subtitle">Stay on track with your wellness targets for today.</p>
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
                <div className="goal-message">{goal.message}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DailyGoals


