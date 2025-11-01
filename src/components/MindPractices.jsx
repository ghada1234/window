import { Play } from 'lucide-react'
import './MindPractices.css'

const MindPractices = () => {
  const breathingExercises = [
    {
      title: 'Box Breathing',
      duration: '5 min',
      description: 'Breathe in for 4, hold for 4, out for 4, hold for 4. Perfect for focus and calm.',
      benefits: ['Deep Relaxation', 'Stress Relief', 'Enhanced Focus']
    },
    {
      title: '4-7-8 Breathing',
      duration: '5 min',
      description: 'Powerful technique to quickly reduce stress and anxiety.',
      benefits: ['Stress Relief', 'Anxiety Reduction', 'Quick Calm']
    },
    {
      title: 'Diaphragmatic Breathing',
      duration: '5 min',
      description: 'Deep belly breathing for relaxation and stress reduction.',
      benefits: ['Deep Relaxation', 'Stress Reduction', 'Better Breathing']
    }
  ]

  return (
    <div className="mind-practices-page">
      <header className="page-header">
        <h1>Mind Practices</h1>
        <p>Breathing exercises, meditation, and mindfulness practices for mental wellness</p>
      </header>

      <div className="practice-tabs">
        <button className="tab active">Breathing</button>
        <button className="tab">Meditation</button>
        <button className="tab">Mindfulness</button>
        <button className="tab">History</button>
      </div>

      <section className="breathing-exercises">
        <h2>Breathing Exercises</h2>
        <p>Master conscious breathing techniques for relaxation and focus</p>
        
        <div className="exercises-grid">
          {breathingExercises.map((exercise, index) => (
            <div key={index} className="exercise-card">
              <div className="exercise-header">
                <span className="exercise-duration">{exercise.duration}</span>
                <h3 className="exercise-title">{exercise.title}</h3>
              </div>
              <p className="exercise-description">{exercise.description}</p>
              <div className="exercise-benefits">
                <strong>Benefits:</strong>
                <div className="benefits-list">
                  {exercise.benefits.map((benefit, i) => (
                    <span key={i} className="benefit-tag">{benefit}</span>
                  ))}
                </div>
              </div>
              <button className="start-practice-btn">
                <Play size={18} />
                <span>Start Practice</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default MindPractices


