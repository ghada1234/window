import { Activity, Moon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './RecentActivity.css'

const RecentActivity = () => {
  const { t } = useTranslation()
  
  const activities = [
    { 
      icon: Activity, 
      text: `${t('dashboard.logged')} '${t('dashboard.cycling')}' ${t('sidebar.activity')}`, 
      time: `10 ${t('dashboard.daysAgo')}` 
    },
    { 
      icon: Moon, 
      text: `${t('dashboard.logged')} 8.25h ${t('dashboard.of')} ${t('sidebar.sleep')}`, 
      time: `11 ${t('dashboard.daysAgo')}` 
    },
    { 
      icon: Moon, 
      text: `${t('dashboard.logged')} 8.25h ${t('dashboard.of')} ${t('sidebar.sleep')}`, 
      time: `11 ${t('dashboard.daysAgo')}` 
    },
    { 
      icon: Activity, 
      text: `${t('dashboard.completed')} 'Box Breathing (4-7-8) – Relaxation and Focus' ${t('dashboard.breathing')}`, 
      time: `1 ${t('dashboard.monthsAgo')}` 
    },
    { 
      icon: Activity, 
      text: `${t('dashboard.completed')} 'undefined' ${t('dashboard.meditation')}`, 
      time: `1 ${t('dashboard.monthsAgo')}` 
    }
  ]

  return (
    <div className="recent-activity">
      <h3>{t('dashboard.recentActivity')}</h3>
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


