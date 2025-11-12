/**
 * Nutrition Calculator based on BMI and User Profile
 * Calculates personalized daily nutrition goals
 */

/**
 * Calculate BMI (Body Mass Index)
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {number} BMI value
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height) return 0
  const heightInMeters = height / 100
  return weight / (heightInMeters * heightInMeters)
}

/**
 * Get BMI category
 * @param {number} bmi - BMI value
 * @returns {object} Category info
 */
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      color: '#3b82f6',
      recommendation: 'Focus on calorie surplus and strength training'
    }
  } else if (bmi >= 18.5 && bmi < 25) {
    return {
      category: 'Normal Weight',
      color: '#10b981',
      recommendation: 'Maintain current weight with balanced nutrition'
    }
  } else if (bmi >= 25 && bmi < 30) {
    return {
      category: 'Overweight',
      color: '#f59e0b',
      recommendation: 'Focus on calorie deficit and regular exercise'
    }
  } else {
    return {
      category: 'Obese',
      color: '#ef4444',
      recommendation: 'Consult healthcare provider, focus on gradual weight loss'
    }
  }
}

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @param {number} age - Age in years
 * @param {string} gender - 'male' or 'female'
 * @returns {number} BMR in calories
 */
export const calculateBMR = (weight, height, age, gender) => {
  if (!weight || !height || !age) return 0
  
  // Mifflin-St Jeor Equation
  const bmr = (10 * weight) + (6.25 * height) - (5 * age)
  
  if (gender === 'male') {
    return bmr + 5
  } else if (gender === 'female') {
    return bmr - 161
  } else {
    // Default to average
    return bmr - 78
  }
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * @param {number} bmr - Basal Metabolic Rate
 * @param {string} activityLevel - Activity level
 * @returns {number} TDEE in calories
 */
export const calculateTDEE = (bmr, activityLevel = 'moderate') => {
  const multipliers = {
    sedentary: 1.2,      // Little or no exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725,       // Hard exercise 6-7 days/week
    veryActive: 1.9      // Very hard exercise, physical job
  }
  
  return bmr * (multipliers[activityLevel] || multipliers.moderate)
}

/**
 * Calculate daily calorie goal based on goal type
 * @param {number} tdee - Total Daily Energy Expenditure
 * @param {string} goal - 'lose', 'maintain', or 'gain'
 * @returns {number} Daily calorie goal
 */
export const calculateCalorieGoal = (tdee, goal = 'maintain') => {
  switch (goal) {
    case 'lose':
      return Math.round(tdee - 500) // 500 cal deficit for ~0.5kg/week loss
    case 'gain':
      return Math.round(tdee + 500) // 500 cal surplus for ~0.5kg/week gain
    case 'maintain':
    default:
      return Math.round(tdee)
  }
}

/**
 * Calculate macronutrient goals
 * @param {number} calories - Daily calorie goal
 * @param {string} goal - 'lose', 'maintain', or 'gain'
 * @param {number} weight - Weight in kg
 * @returns {object} Macro goals
 */
export const calculateMacros = (calories, goal = 'maintain', weight = 70) => {
  let proteinPerKg, fatPercent, carbPercent
  
  switch (goal) {
    case 'lose':
      // Higher protein for muscle preservation
      proteinPerKg = 2.2      // 2.2g per kg
      fatPercent = 0.25       // 25% of calories
      carbPercent = 0.4       // 40% of calories (rest is protein)
      break
      
    case 'gain':
      // Moderate protein, higher carbs for energy
      proteinPerKg = 2.0      // 2.0g per kg
      fatPercent = 0.25       // 25% of calories
      carbPercent = 0.5       // 50% of calories
      break
      
    case 'maintain':
    default:
      // Balanced macros
      proteinPerKg = 1.8      // 1.8g per kg
      fatPercent = 0.30       // 30% of calories
      carbPercent = 0.40      // 40% of calories
      break
  }
  
  // Calculate protein
  const protein = Math.round(weight * proteinPerKg)
  const proteinCalories = protein * 4
  
  // Calculate fat
  const fat = Math.round((calories * fatPercent) / 9)
  const fatCalories = fat * 9
  
  // Calculate carbs (remaining calories)
  const remainingCalories = calories - proteinCalories - fatCalories
  const carbs = Math.round(remainingCalories / 4)
  
  // Calculate fiber (minimum 25-35g per day)
  const fiber = Math.round(calories / 1000 * 14) // 14g per 1000 calories
  
  // Calculate sugar limit (max 10% of calories)
  const sugar = Math.round((calories * 0.10) / 4)
  
  return {
    protein,
    fat,
    carbs,
    fiber,
    sugar,
    proteinPercent: Math.round((proteinCalories / calories) * 100),
    fatPercent: Math.round((fatCalories / calories) * 100),
    carbPercent: Math.round(((carbs * 4) / calories) * 100)
  }
}

/**
 * Get complete nutrition plan
 * @param {object} userData - User profile data
 * @returns {object} Complete nutrition plan
 */
export const getNutritionPlan = (userData) => {
  const {
    weight = 70,
    height = 170,
    age = 30,
    gender = 'other',
    activityLevel = 'moderate',
    goal = 'maintain'
  } = userData
  
  // Calculate BMI
  const bmi = calculateBMI(weight, height)
  const bmiCategory = getBMICategory(bmi)
  
  // Calculate BMR and TDEE
  const bmr = calculateBMR(weight, height, age, gender)
  const tdee = calculateTDEE(bmr, activityLevel)
  
  // Calculate calorie goal
  const calories = calculateCalorieGoal(tdee, goal)
  
  // Calculate macros
  const macros = calculateMacros(calories, goal, weight)
  
  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory: bmiCategory.category,
    bmiColor: bmiCategory.color,
    bmiRecommendation: bmiCategory.recommendation,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    dailyCalories: calories,
    macros: {
      protein: macros.protein,
      fat: macros.fat,
      carbs: macros.carbs,
      fiber: macros.fiber,
      sugar: macros.sugar
    },
    macroPercentages: {
      protein: macros.proteinPercent,
      fat: macros.fatPercent,
      carbs: macros.carbPercent
    },
    waterGoal: Math.round(weight * 0.033), // 33ml per kg
    mealSuggestions: getMealSuggestions(calories),
    tips: getTipsForGoal(goal, bmi)
  }
}

/**
 * Get meal distribution suggestions
 * @param {number} calories - Daily calorie goal
 * @returns {object} Meal suggestions
 */
const getMealSuggestions = (calories) => {
  return {
    breakfast: Math.round(calories * 0.25),
    lunch: Math.round(calories * 0.35),
    dinner: Math.round(calories * 0.30),
    snacks: Math.round(calories * 0.10)
  }
}

/**
 * Get tips based on goal and BMI
 * @param {string} goal - User's goal
 * @param {number} bmi - User's BMI
 * @returns {array} Tips array
 */
const getTipsForGoal = (goal, bmi) => {
  const tips = []
  
  if (goal === 'lose') {
    tips.push('Create a calorie deficit through diet and exercise')
    tips.push('Focus on protein to preserve muscle mass')
    tips.push('Aim for 0.5-1kg weight loss per week')
    tips.push('Stay hydrated - drink plenty of water')
  } else if (goal === 'gain') {
    tips.push('Eat in a calorie surplus consistently')
    tips.push('Focus on strength training exercises')
    tips.push('Eat protein with every meal')
    tips.push('Consider healthy high-calorie foods like nuts and avocados')
  } else {
    tips.push('Maintain balanced nutrition')
    tips.push('Stay active with regular exercise')
    tips.push('Focus on whole, unprocessed foods')
    tips.push('Monitor your progress weekly')
  }
  
  // BMI-specific tips
  if (bmi < 18.5) {
    tips.push('⚠️ Consider consulting a nutritionist for healthy weight gain')
  } else if (bmi >= 30) {
    tips.push('⚠️ Consider consulting a healthcare provider')
  }
  
  return tips
}

/**
 * Calculate progress percentage
 * @param {number} current - Current value
 * @param {number} goal - Goal value
 * @returns {number} Progress percentage
 */
export const calculateProgress = (current, goal) => {
  if (!goal) return 0
  return Math.min(Math.round((current / goal) * 100), 100)
}

/**
 * Get color based on progress
 * @param {number} percentage - Progress percentage
 * @returns {string} Color code
 */
export const getProgressColor = (percentage) => {
  if (percentage >= 100) return '#10b981' // Green
  if (percentage >= 80) return '#f59e0b'  // Orange
  if (percentage >= 50) return '#3b82f6'  // Blue
  return '#ef4444' // Red
}

/**
 * Format nutrition value for display
 * @param {number} value - Nutrition value
 * @param {string} unit - Unit (g, cal, etc.)
 * @returns {string} Formatted string
 */
export const formatNutritionValue = (value, unit = '') => {
  if (!value) return `0${unit}`
  return `${Math.round(value)}${unit}`
}

/**
 * Check if nutrition goal is met
 * @param {number} current - Current value
 * @param {number} goal - Goal value
 * @param {number} tolerance - Tolerance percentage (default 10%)
 * @returns {boolean} Is goal met
 */
export const isGoalMet = (current, goal, tolerance = 0.1) => {
  const lowerBound = goal * (1 - tolerance)
  const upperBound = goal * (1 + tolerance)
  return current >= lowerBound && current <= upperBound
}

export default {
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateTDEE,
  calculateCalorieGoal,
  calculateMacros,
  getNutritionPlan,
  calculateProgress,
  getProgressColor,
  formatNutritionValue,
  isGoalMet
}

