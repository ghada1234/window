import { useState, useEffect } from 'react'
import { User, Save, Calendar, Activity, Target, UtensilsCrossed } from 'lucide-react'
import { getJSON, setJSON } from '../utils/storage'
import './PersonalInformation.css'

const PersonalInformation = () => {
  const [formData, setFormData] = useState(() => {
    return getJSON('personalInformation', {
      age: 30,
      gender: '',
      height: 175,
      weight: 70,
      activityLevel: '',
      goal: '',
      preferredCuisine: '',
      allergies: '',
      dislikes: '',
      dietaryPreference: ''
    })
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    // Load saved data on mount
    const saved = getJSON('personalInformation')
    if (saved) {
      setFormData(saved)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Save to storage
      setJSON('personalInformation', formData)
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save personal information:', error)
      alert('Failed to save. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say']
  const activityLevels = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Extremely Active']
  const goals = ['Weight Loss', 'Weight Gain', 'Muscle Building', 'Maintain Weight', 'Improve Fitness', 'General Health']
  const dietaryPreferences = ['None', 'Vegan', 'Vegetarian', 'Pescatarian', 'Keto', 'Paleo', 'Gluten-Free', 'Dairy-Free', 'Halal', 'Kosher']

  return (
    <div className="personal-information-page">
      <header className="page-header">
        <div className="header-content">
          <User size={32} />
          <div>
            <h1>Personal Information</h1>
            <p>Manage your personal information and preferences here.</p>
          </div>
        </div>
      </header>

      <div className="personal-info-content">
        <div className="info-section-card">
          <div className="section-header">
            <h2>Personal Information</h2>
            <p>This data helps us personalize your experience and recommendations.</p>
          </div>

          <form onSubmit={handleSave} className="personal-info-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="age">
                  <Calendar size={18} />
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  placeholder="30"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="select-input"
                >
                  <option value="">Select</option>
                  {genders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="height">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="50"
                  max="250"
                  placeholder="175"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="20"
                  max="300"
                  step="0.1"
                  placeholder="70"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="activityLevel">
                  <Activity size={18} />
                  Activity Level
                </label>
                <select
                  id="activityLevel"
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="select-input"
                >
                  <option value="">Select</option>
                  {activityLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="goal">
                  <Target size={18} />
                  Goal
                </label>
                <select
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="select-input"
                >
                  <option value="">Select</option>
                  {goals.map(goal => (
                    <option key={goal} value={goal}>{goal}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Meal Planner Preferences */}
            <div className="meal-planner-section">
              <div className="section-header">
                <UtensilsCrossed size={20} />
                <h3>Preferences for AI Meal Planner (Optional)</h3>
              </div>
              <p className="section-subtitle">These preferences help our AI generate personalized meal recommendations for you.</p>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="preferredCuisine">Preferred Cuisine</label>
                  <input
                    type="text"
                    id="preferredCuisine"
                    name="preferredCuisine"
                    value={formData.preferredCuisine}
                    onChange={handleChange}
                    placeholder="e.g., Italian, Any"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="allergies">Allergies</label>
                  <input
                    type="text"
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="e.g., Peanuts, Shellfish"
                  />
                  <small className="form-hint">List any food allergies or intolerances</small>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="dislikes">Dislikes</label>
                  <input
                    type="text"
                    id="dislikes"
                    name="dislikes"
                    value={formData.dislikes}
                    onChange={handleChange}
                    placeholder="e.g., Mushrooms, Olives"
                  />
                  <small className="form-hint">Foods you prefer to avoid</small>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="dietaryPreference">Dietary Preference</label>
                  <select
                    id="dietaryPreference"
                    name="dietaryPreference"
                    value={formData.dietaryPreference}
                    onChange={handleChange}
                    className="select-input"
                  >
                    <option value="">None</option>
                    {dietaryPreferences.filter(p => p !== 'None').map(pref => (
                      <option key={pref} value={pref}>{pref}</option>
                    ))}
                  </select>
                  <small className="form-hint">Select your dietary restriction or preference</small>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="save-btn"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="spinner-small"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Save Personal Information</span>
                  </>
                )}
              </button>
              {saveSuccess && (
                <div className="save-success-message">
                  ✓ Personal information saved successfully!
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PersonalInformation


