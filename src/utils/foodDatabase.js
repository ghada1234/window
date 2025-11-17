// Minimal local food database and helpers (fallback when AI is unavailable)

const FOODS = [
  { name: 'apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, serving: '1 medium (182g)' },
  { name: 'banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, fiber: 3.1, sugar: 14, serving: '1 medium (118g)' },
  { name: 'chicken breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, serving: '100g cooked' },
  { name: 'salmon', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0, serving: '100g cooked' },
  { name: 'rice cooked', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, sugar: 0.1, serving: '1 cup (158g)' },
  { name: 'quinoa cooked', calories: 222, protein: 8, carbs: 39, fat: 3.6, fiber: 5, sugar: 1.6, serving: '1 cup (185g)' },
  { name: 'pita', calories: 170, protein: 6, carbs: 35, fat: 1, fiber: 2, sugar: 1, serving: '1 medium (60g)' }
]

export const getAllFoodNames = () => FOODS.map(f => f.name)

export const getFoodByName = (name) => {
  if (!name) return null
  const n = String(name).trim().toLowerCase()
  return FOODS.find(f => f.name.toLowerCase() === n) || null
}

export const searchFoodDatabase = (query, limit = 10) => {
  if (!query) return []
  const q = String(query).trim().toLowerCase()
  const results = FOODS.filter(f => f.name.toLowerCase().includes(q))
  return results.slice(0, limit)
}


