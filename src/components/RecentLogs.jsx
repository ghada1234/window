import { useTranslation } from 'react-i18next'
import './RecentLogs.css'

const RecentLogs = () => {
  const { t } = useTranslation()
  
  // Create logs array inside component so it updates when language changes
  const logs = [
    { 
      type: t('sidebar.activity'), 
      details: `${t('dashboard.cycling')} (60 ${t('dashboard.minutes')})`, 
      time: '04:41 PM' 
    },
    { 
      type: t('sidebar.sleep'), 
      details: `8.25 ${t('dashboard.hours')}, ${t('dashboard.excellent')} ${t('dashboard.quality')}`, 
      time: '02:44 PM' 
    },
    { 
      type: t('sidebar.activity'), 
      details: `${t('dashboard.hiit')} (35 ${t('dashboard.minutes')})`, 
      time: '01:46 PM' 
    },
    { 
      type: t('sidebar.sleep'), 
      details: `8.25 ${t('dashboard.hours')}, ${t('dashboard.excellent')} ${t('dashboard.quality')}`, 
      time: '01:46 PM' 
    },
    { 
      type: t('sidebar.activity'), 
      details: `${t('dashboard.hiit')} (35 ${t('dashboard.minutes')})`, 
      time: '01:43 PM' 
    },
    { 
      type: t('sidebar.sleep'), 
      details: `8.25 ${t('dashboard.hours')}, ${t('dashboard.excellent')} ${t('dashboard.quality')}`, 
      time: '01:42 PM' 
    },
    { 
      type: t('sidebar.sleep'), 
      details: `8.25 ${t('dashboard.hours')}, ${t('dashboard.excellent')} ${t('dashboard.quality')}`, 
      time: '01:40 PM' 
    },
    { 
      type: t('sidebar.sleep'), 
      details: `8.25 ${t('dashboard.hours')}, ${t('dashboard.excellent')} ${t('dashboard.quality')}`, 
      time: '01:40 PM' 
    },
    { 
      type: t('sidebar.mood'), 
      details: `${t('dashboard.good')} ${t('sidebar.mood')}, ${t('dashboard.moderate')} ${t('dashboard.energy')}`, 
      time: '06:48 AM' 
    },
    { 
      type: t('sidebar.sleep'), 
      details: `8.25 ${t('dashboard.hours')}, ${t('dashboard.good')} ${t('dashboard.quality')}`, 
      time: '04:09 AM' 
    }
  ]

  return (
    <div className="recent-logs">
      <h3>{t('dashboard.recentLogs')}</h3>
      <p className="recent-logs-subtitle">{t('dashboard.recentLogsSubtitle')}</p>
      <div className="logs-table">
        <table>
          <thead>
            <tr>
              <th>{t('dashboard.type')}</th>
              <th>{t('dashboard.details')}</th>
              <th>{t('dashboard.time')}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="log-type">{log.type}</td>
                <td className="log-details">{log.details}</td>
                <td className="log-time">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentLogs



    { 
      type: t('sidebar.mood'), 
      details: `${t('dashboard.good')} ${t('sidebar.mood')}, ${t('dashboard.moderate')} ${t('dashboard.energy')}`, 
      time: '06:48 AM' 
    },
    { 
      type: t('sidebar.sleep'), 
      details: `8.25 ${t('dashboard.hours')}, ${t('dashboard.good')} ${t('dashboard.quality')}`, 
      time: '04:09 AM' 
    }
  ]

  return (
    <div className="recent-logs">
      <h3>{t('dashboard.recentLogs')}</h3>
      <p className="recent-logs-subtitle">{t('dashboard.recentLogsSubtitle')}</p>
      <div className="logs-table">
        <table>
          <thead>
            <tr>
              <th>{t('dashboard.type')}</th>
              <th>{t('dashboard.details')}</th>
              <th>{t('dashboard.time')}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="log-type">{log.type}</td>
                <td className="log-details">{log.details}</td>
                <td className="log-time">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentLogs


