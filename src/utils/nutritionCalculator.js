// Nutrition calculator utilities
// Provides basic daily goal calculation and formatting helpers.

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const kgFrom = (weightKg) => {
  const n = Number(weightKg)
  return Number.isFinite(n) && n > 0 ? n : 70
}

const cmFrom = (heightCm) => {
  const n = Number(heightCm)
  return Number.isFinite(n) && n > 0 ? n : 170
}

const yearsFrom = (ageYears) => {
  const n = Number(ageYears)
  return Number.isFinite(n) && n > 0 ? n : 30
}

const activityMultiplierFrom = (activityLevel) => {
  switch ((activityLevel || '').toLowerCase()) {
    case 'sedentary':
      return 1.2
    case 'light':
    case 'lightly active':
      return 1.375
    case 'moderate':
    case 'moderately active':
      return 1.55
    case 'active':
      return 1.725
    case 'very active':
      return 1.9
    default:
      return 1.375
  }
}

export const getNutritionPlan = (profile) => {
  const gender = (profile?.gender || 'female').toLowerCase()
  const age = yearsFrom(profile?.age)
  const height = cmFrom(profile?.heightCm ?? profile?.height)
  const weight = kgFrom(profile?.weightKg ?? profile?.weight)
  const activityMultiplier = activityMultiplierFrom(profile?.activityLevel)
  const goal = (profile?.goal || 'maintain').toLowerCase()

  // Mifflin-St Jeor BMR
  const bmr =
    gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161

  const tdee = bmr * activityMultiplier

  let targetCalories = tdee
  if (goal.includes('lose')) targetCalories = tdee - 300
  if (goal.includes('gain')) targetCalories = tdee + 300

  // Macros (approximate): protein 1.6 g/kg, fat 30% kcal, carbs remaining
  const proteinGrams = Math.round(1.6 * weight)
  const proteinKcal = proteinGrams * 4
  const fatKcal = Math.round(targetCalories * 0.30)
  const fatGrams = Math.round(fatKcal / 9)
  const carbsKcal = Math.max(0, Math.round(targetCalories - proteinKcal - fatKcal))
  const carbsGrams = Math.round(carbsKcal / 4)

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    dailyGoals: {
      calories: Math.round(targetCalories),
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams,
      fiber: 25
    }
  }
}

export const calculateProgress = (consumed, goal) => {
  const g = Number(goal) || 0
  if (g <= 0) return 0
  return clamp(Math.round((Number(consumed) * 100) / g), 0, 999)
}

export const getProgressColor = (percent) => {
  const p = Number(percent) || 0
  if (p < 60) return '#22c55e' // green
  if (p < 90) return '#eab308' // amber
  if (p <= 110) return '#06b6d4' // cyan
  return '#ef4444' // red
}

export const formatNutritionValue = (value, unit = '') => {
  const n = Number(value)
  if (!Number.isFinite(n)) return '0'
  const rounded = Math.round(n)
  return unit ? `${rounded} ${unit}` : String(rounded)
}


