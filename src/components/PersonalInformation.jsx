import { useState, useEffect } from 'react'
import { User, Save, Calendar, Activity, Target, UtensilsCrossed } from 'lucide-react'
import { getJSON, setJSON } from '../utils/storage'
import { useTranslation } from 'react-i18next'
import './PersonalInformation.css'

const PersonalInformation = () => {
  const { t } = useTranslation()
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

  const genders = [
    { value: 'Male', label: t('personalInfo.genders.male') },
    { value: 'Female', label: t('personalInfo.genders.female') },
    { value: 'Non-binary', label: t('personalInfo.genders.nonBinary') },
    { value: 'Prefer not to say', label: t('personalInfo.genders.preferNot') }
  ]
  
  const activityLevels = [
    { value: 'Sedentary', label: t('personalInfo.activityLevels.sedentary') },
    { value: 'Lightly Active', label: t('personalInfo.activityLevels.lightlyActive') },
    { value: 'Moderately Active', label: t('personalInfo.activityLevels.moderatelyActive') },
    { value: 'Very Active', label: t('personalInfo.activityLevels.veryActive') },
    { value: 'Extremely Active', label: t('personalInfo.activityLevels.extremelyActive') }
  ]
  
  const goals = [
    { value: 'Weight Loss', label: t('personalInfo.goals.weightLoss') },
    { value: 'Weight Gain', label: t('personalInfo.goals.weightGain') },
    { value: 'Muscle Building', label: t('personalInfo.goals.muscleBuilding') },
    { value: 'Maintain Weight', label: t('personalInfo.goals.maintainWeight') },
    { value: 'Improve Fitness', label: t('personalInfo.goals.improveFitness') },
    { value: 'General Health', label: t('personalInfo.goals.generalHealth') }
  ]
  
  const dietaryPreferences = [
    { value: 'None', label: t('personalInfo.dietaryPreferences.none') },
    { value: 'Vegan', label: t('personalInfo.dietaryPreferences.vegan') },
    { value: 'Vegetarian', label: t('personalInfo.dietaryPreferences.vegetarian') },
    { value: 'Pescatarian', label: t('personalInfo.dietaryPreferences.pescatarian') },
    { value: 'Keto', label: t('personalInfo.dietaryPreferences.keto') },
    { value: 'Paleo', label: t('personalInfo.dietaryPreferences.paleo') },
    { value: 'Gluten-Free', label: t('personalInfo.dietaryPreferences.glutenFree') },
    { value: 'Dairy-Free', label: t('personalInfo.dietaryPreferences.dairyFree') },
    { value: 'Halal', label: t('personalInfo.dietaryPreferences.halal') },
    { value: 'Kosher', label: t('personalInfo.dietaryPreferences.kosher') }
  ]

  return (
    <div className="personal-information-page">
      <header className="page-header">
        <div className="header-content">
          <User size={32} />
          <div>
            <h1>{t('personalInfo.title')}</h1>
            <p>{t('personalInfo.subtitle')}</p>
          </div>
        </div>
      </header>

      <div className="personal-info-content">
        <div className="info-section-card">
          <div className="section-header">
            <h2>{t('personalInfo.sectionTitle')}</h2>
            <p>{t('personalInfo.sectionSubtitle')}</p>
          </div>

          <form onSubmit={handleSave} className="personal-info-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="age">
                  <Calendar size={18} />
                  {t('personalInfo.age')}
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
                <label htmlFor="gender">{t('personalInfo.gender')}</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="select-input"
                >
                  <option value="">{t('personalInfo.select')}</option>
                  {genders.map(gender => (
                    <option key={gender.value} value={gender.value}>{gender.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="height">
                  {t('personalInfo.height')}
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
                  {t('personalInfo.weight')}
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
                  {t('personalInfo.activityLevel')}
                </label>
                <select
                  id="activityLevel"
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="select-input"
                >
                  <option value="">{t('personalInfo.select')}</option>
                  {activityLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="goal">
                  <Target size={18} />
                  {t('personalInfo.goal')}
                </label>
                <select
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="select-input"
                >
                  <option value="">{t('personalInfo.select')}</option>
                  {goals.map(goal => (
                    <option key={goal.value} value={goal.value}>{goal.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Meal Planner Preferences */}
            <div className="meal-planner-section">
              <div className="section-header">
                <UtensilsCrossed size={20} />
                <h3>{t('personalInfo.mealPlannerTitle')}</h3>
              </div>
              <p className="section-subtitle">{t('personalInfo.mealPlannerSubtitle')}</p>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="preferredCuisine">{t('personalInfo.preferredCuisine')}</label>
                  <input
                    type="text"
                    id="preferredCuisine"
                    name="preferredCuisine"
                    value={formData.preferredCuisine}
                    onChange={handleChange}
                    placeholder={t('personalInfo.cuisinePlaceholder')}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="allergies">{t('personalInfo.allergies')}</label>
                  <input
                    type="text"
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder={t('personalInfo.allergiesPlaceholder')}
                  />
                  <small className="form-hint">{t('personalInfo.allergiesHint')}</small>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="dislikes">{t('personalInfo.dislikes')}</label>
                  <input
                    type="text"
                    id="dislikes"
                    name="dislikes"
                    value={formData.dislikes}
                    onChange={handleChange}
                    placeholder={t('personalInfo.dislikesPlaceholder')}
                  />
                  <small className="form-hint">{t('personalInfo.dislikesHint')}</small>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="dietaryPreference">{t('personalInfo.dietaryPreference')}</label>
                  <select
                    id="dietaryPreference"
                    name="dietaryPreference"
                    value={formData.dietaryPreference}
                    onChange={handleChange}
                    className="select-input"
                  >
                    <option value="">{t('personalInfo.dietaryPreferences.none')}</option>
                    {dietaryPreferences.filter(p => p.value !== 'None').map(pref => (
                      <option key={pref.value} value={pref.value}>{pref.label}</option>
                    ))}
                  </select>
                  <small className="form-hint">{t('personalInfo.dietaryHint')}</small>
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
                    <span>{t('personalInfo.saving')}</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>{t('personalInfo.saveButton')}</span>
                  </>
                )}
              </button>
              {saveSuccess && (
                <div className="save-success-message">
                  {t('personalInfo.saveSuccess')}
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


