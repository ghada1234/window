import './RecentLogs.css'

const RecentLogs = () => {
  const logs = [
    { type: 'Activity', details: 'Cycling (60 min)', time: '04:41 PM' },
    { type: 'Sleep', details: '8.25 hours, Excellent quality', time: '02:44 PM' },
    { type: 'Activity', details: 'HIIT Training (35 min)', time: '01:46 PM' },
    { type: 'Sleep', details: '8.25 hours, Excellent quality', time: '01:46 PM' },
    { type: 'Activity', details: 'HIIT Training (35 min)', time: '01:43 PM' },
    { type: 'Sleep', details: '8.25 hours, Excellent quality', time: '01:42 PM' },
    { type: 'Sleep', details: '8.25 hours, Excellent quality', time: '01:40 PM' },
    { type: 'Sleep', details: '8.25 hours, Excellent quality', time: '01:40 PM' },
    { type: 'Mood', details: 'Good mood, Moderate energy', time: '06:48 AM' },
    { type: 'Sleep', details: '8.25 hours, Good quality', time: '04:09 AM' }
  ]

  return (
    <div className="recent-logs">
      <h3>Recent Logs</h3>
      <p className="recent-logs-subtitle">A summary of your most recent wellness entries.</p>
      <div className="logs-table">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Details</th>
              <th>Time</th>
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


