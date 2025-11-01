import { useWellness } from '../context/WellnessContext'
import { Droplet } from 'lucide-react'
import './WaterIntake.css'

const WaterIntake = () => {
  const { waterIntake, addWater } = useWellness()
  const { glasses, goal: totalGlasses } = waterIntake

  const addGlass = (amount = 1) => {
    addWater(amount)
  }

  return (
    <div className="water-intake">
      <div className="water-intake-header">
        <Droplet size={24} />
        <h3>Water Intake</h3>
      </div>
      <div className="water-intake-content">
        <div className="water-intake-counter">
          <span className="water-current">{glasses}</span>
          <span className="water-separator">/</span>
          <span className="water-total">{totalGlasses}</span>
          <span className="water-label">Today's Glasses</span>
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
          + Add Glass
        </button>
      </div>
    </div>
  )
}

export default WaterIntake

