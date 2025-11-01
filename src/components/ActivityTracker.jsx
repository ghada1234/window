import { useState } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Activity, Plus, Clock, Watch, TrendingUp, X } from 'lucide-react'
import './ActivityTracker.css'

const ActivityTracker = () => {
  const { activities, addActivity } = useWellness()
  const [showLogForm, setShowLogForm] = useState(false)
  const [activityName, setActivityName] = useState('')
  const [duration, setDuration] = useState('')
  const [calories, setCalories] = useState('')

  const handleAddActivity = (e) => {
    e.preventDefault()
    if (activityName && duration) {
      const activity = {
        id: Date.now(),
        name: activityName,
        duration: parseInt(duration),
        calories: parseInt(calories) || 0,
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
      addActivity(activity)
      setActivityName('')
      setDuration('')
      setCalories('')
      setShowLogForm(false)
    }
  }

  return (
    <div className="activity-tracker-page">
      <header className="page-header">
        <h1>Activity Tracker</h1>
        <p>Log your workouts, track your progress, and stay motivated.</p>
      </header>

      <div className="activity-actions">
        <div className="action-card">
          <h2>Log Your Activity</h2>
          <p>Quickly add a new workout or activity to your daily log.</p>
          {!showLogForm ? (
            <button className="log-activity-btn" onClick={() => setShowLogForm(true)}>
              <Plus size={18} />
              <span>Log New Activity</span>
            </button>
          ) : (
            <form onSubmit={handleAddActivity} className="activity-form">
              <div className="form-group">
                <label>Activity Name</label>
                <input
                  type="text"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="e.g., Running, Cycling"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Duration (min)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="30"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Calories (optional)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="300"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowLogForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">Save Activity</button>
              </div>
            </form>
          )}
        </div>

        <div className="quick-actions">
          <button className="quick-action-btn">
            <Clock size={20} />
            <span>Workout Timer</span>
          </button>
          <button className="quick-action-btn">
            <Watch size={20} />
            <span>Wearable Devices</span>
          </button>
          <button className="quick-action-btn">
            <TrendingUp size={20} />
            <span>Progress & Insights</span>
          </button>
        </div>
      </div>

      <div className="activity-log">
        <h2>Your Activity History</h2>
        <div className="activities-list">
          {activities.length === 0 ? (
            <div className="no-activities">
              <Activity size={48} />
              <p>No activities logged yet. Start logging your workouts!</p>
            </div>
          ) : (
            <>
              {activities.slice(0, 10).map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-main">
                    <div className="activity-icon">
                      <Activity size={24} />
                    </div>
                    <div className="activity-details">
                      <h3 className="activity-name">{activity.name}</h3>
                      <div className="activity-stats">
                        <span>{activity.duration} min</span>
                        {activity.calories > 0 && (
                          <>
                            <span>•</span>
                            <span>{activity.calories} kcal</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{activity.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {activities.length > 10 && (
                <button className="load-more-btn">Load More</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityTracker

