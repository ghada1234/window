import { useState } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Droplet, AlertCircle } from 'lucide-react'
import './WaterLog.css'

const WaterLog = () => {
  const { waterIntake, addWaterEntry, setWaterGoal, addWater } = useWellness()
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }))
  const [newEntryGlasses, setNewEntryGlasses] = useState(0)

  const handleAddEntry = (e) => {
    e.preventDefault()
    if (newEntryGlasses > 0) {
      const entry = {
        id: Date.now(),
        glasses: newEntryGlasses,
        date: selectedDate
      }
      addWaterEntry(entry)
      setNewEntryGlasses(0)
    }
  }

  const handleUpdateGoal = () => {
    const newGoal = prompt('Enter new daily goal (glasses):', waterIntake.goal)
    if (newGoal && !isNaN(newGoal) && newGoal > 0) {
      setWaterGoal(parseInt(newGoal))
    }
  }

  const handleAddGlass = (amount) => {
    addWater(amount)
  }

  return (
    <div className="water-log-page">
      <header className="page-header">
        <h1>Water Log</h1>
        <p>Track and manage your daily water intake history.</p>
      </header>

      <div className="water-log-content">
        <div className="water-log-left">
          <div className="add-entry-card">
            <h2>Add New Entry</h2>
            <form onSubmit={handleAddEntry} className="water-entry-form">
              <div className="form-row">
                <label>Glasses of Water</label>
                <input
                  type="number"
                  min="0"
                  value={newEntryGlasses}
                  onChange={(e) => setNewEntryGlasses(parseInt(e.target.value) || 0)}
                  className="glasses-input"
                />
              </div>
              <div className="form-row">
                <label>Daily Goal (Glasses)</label>
                <input
                  type="number"
                  min="1"
                  value={waterIntake.goal}
                  onChange={(e) => setWaterGoal(parseInt(e.target.value) || 8)}
                  className="goal-input"
                />
              </div>
              <div className="form-row">
                <label>Date</label>
                <input
                  type="text"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="date-input"
                />
              </div>
              <button type="submit" className="add-entry-btn">
                Add Entry
              </button>
            </form>

            <div className="today-goal-card">
              <h3>Today's Water Goal</h3>
              <p>Current goal: {waterIntake.goal} glasses per day</p>
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(waterIntake.glasses / waterIntake.goal) * 100}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  {waterIntake.glasses} / {waterIntake.goal} glasses
                </div>
              </div>
              <button className="update-goal-btn" onClick={handleUpdateGoal}>
                Update Goal
              </button>
            </div>

            <div className="quick-add">
              <button className="quick-add-btn" onClick={() => handleAddGlass(1)}>
                +1 Glass
              </button>
              <button className="quick-add-btn" onClick={() => handleAddGlass(2)}>
                +2 Glasses
              </button>
              <button className="quick-add-btn" onClick={() => {
                const custom = prompt('Enter number of glasses:')
                if (custom && !isNaN(custom)) {
                  handleAddGlass(parseInt(custom))
                }
              }}>
                Custom
              </button>
            </div>

            {waterIntake.glasses < waterIntake.goal && (
              <div className="alert-card">
                <AlertCircle size={20} />
                <div>
                  <strong>Low Water Intake Alert</strong>
                  <p>You've only had {waterIntake.glasses} glasses today. You need {waterIntake.goal - waterIntake.glasses} more glasses to reach your goal of {waterIntake.goal} glasses.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="water-log-right">
          <div className="history-card">
            <h2>History</h2>
            {waterIntake.entries.length === 0 ? (
              <div className="no-history">
                <Droplet size={48} />
                <p>No water intake logged yet.</p>
                <p className="help-text">Add your first water log entry using the form on the left.</p>
              </div>
            ) : (
              <div className="history-list">
                {waterIntake.entries.map((entry) => (
                  <div key={entry.id} className="history-item">
                    <div className="history-date">{entry.date}</div>
                    <div className="history-glasses">{entry.glasses} glasses</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaterLog

