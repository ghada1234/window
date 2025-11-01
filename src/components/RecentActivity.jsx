import { Activity, Moon } from 'lucide-react'
import './RecentActivity.css'

const RecentActivity = () => {
  const activities = [
    { icon: Activity, text: "Logged 'Cycling' activity", time: '10 days ago' },
    { icon: Moon, text: 'Logged 8.25h of sleep', time: '11 days ago' },
    { icon: Moon, text: 'Logged 8.25h of sleep', time: '11 days ago' },
    { icon: Activity, text: "Completed 'Box Breathing (4-7-8) – Relaxation and Focus' breathing", time: '1 months ago' },
    { icon: Activity, text: "Completed 'undefined' meditation", time: '1 months ago' }
  ]

  return (
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      <div className="activity-timeline">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                <Icon size={18} />
              </div>
              <div className="activity-content">
                <p className="activity-text">{activity.text}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentActivity


