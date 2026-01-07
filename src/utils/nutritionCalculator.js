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

// Calculate BMI (Body Mass Index)
export const calculateBMI = (weightKg, heightCm) => {
  const weight = kgFrom(weightKg)
  const height = cmFrom(heightCm)
  if (height <= 0) return null
  const heightM = height / 100
  const bmi = weight / (heightM * heightM)
  return Math.round(bmi * 10) / 10 // Round to 1 decimal place
}

// Get BMI category
export const getBMICategory = (bmi) => {
  if (!bmi || bmi < 0) return 'Unknown'
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal weight'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

export const getNutritionPlan = (profile) => {
  const gender = (profile?.gender || 'female').toLowerCase()
  const age = yearsFrom(profile?.age)
  const height = cmFrom(profile?.heightCm ?? profile?.height)
  const weight = kgFrom(profile?.weightKg ?? profile?.weight)
  const activityMultiplier = activityMultiplierFrom(profile?.activityLevel)
  const goal = (profile?.goal || 'maintain').toLowerCase()

  // Calculate BMI
  const bmi = calculateBMI(weight, height)
  const bmiCategory = getBMICategory(bmi)

  // Mifflin-St Jeor BMR
  const bmr =
    gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161

  const tdee = bmr * activityMultiplier

  let targetCalories = tdee
  if (goal.includes('lose') || goal.includes('weight loss')) targetCalories = tdee - 300
  if (goal.includes('gain') || goal.includes('weight gain') || goal.includes('muscle')) targetCalories = tdee + 300

  // Macros (approximate): protein 1.6 g/kg, fat 30% kcal, carbs remaining
  const proteinGrams = Math.round(1.6 * weight)
  const proteinKcal = proteinGrams * 4
  const fatKcal = Math.round(targetCalories * 0.30)
  const fatGrams = Math.round(fatKcal / 9)
  const carbsKcal = Math.max(0, Math.round(targetCalories - proteinKcal - fatKcal))
  const carbsGrams = Math.round(carbsKcal / 4)

  // Calculate water goal (35ml per kg body weight, minimum 2L)
  const waterGoal = Math.max(2, Math.round((weight * 35) / 1000 * 10) / 10)

  // Meal distribution suggestions
  const mealSuggestions = {
    breakfast: Math.round(targetCalories * 0.25),
    lunch: Math.round(targetCalories * 0.35),
    dinner: Math.round(targetCalories * 0.30),
    snacks: Math.round(targetCalories * 0.10)
  }

  // Tips based on BMI and goal
  const tips = []
  if (bmi < 18.5) {
    tips.push('Focus on nutrient-dense foods to support healthy weight gain')
    tips.push('Include healthy fats like avocados, nuts, and olive oil')
  } else if (bmi >= 30) {
    tips.push('Prioritize whole foods and reduce processed foods')
    tips.push('Aim for gradual, sustainable weight loss')
  } else {
    tips.push('Maintain a balanced diet with variety')
  }
  
  if (goal.includes('lose')) {
    tips.push('Create a moderate calorie deficit for sustainable weight loss')
    tips.push('Focus on protein to preserve muscle mass during weight loss')
  } else if (goal.includes('gain') || goal.includes('muscle')) {
    tips.push('Ensure adequate protein intake for muscle building')
    tips.push('Time meals around workouts for optimal recovery')
  } else {
    tips.push('Maintain consistent meal timing')
    tips.push('Listen to your body\'s hunger and fullness cues')
  }

  return {
    bmi,
    bmiCategory,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    dailyCalories: Math.round(targetCalories),
    waterGoal,
    macros: {
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams,
      fiber: 30,
      sugar: 50
    },
    mealSuggestions,
    tips
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


