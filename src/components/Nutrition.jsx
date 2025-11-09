import { useState, useMemo, useRef } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Apple, Heart, Search, Camera, ScanLine, TrendingUp, TrendingDown, Brain, Lightbulb, AlertCircle } from 'lucide-react'
import { analyzeFoodImage, analyzeNutritionLabel, isGeminiConfigured } from '../utils/gemini'
import { useTranslation } from 'react-i18next'
import './Nutrition.css'

const Nutrition = () => {
  const { t } = useTranslation()
  const { nutrition, addNutritionEntry, moodLogs } = useWellness()
  const [preMealMood, setPreMealMood] = useState('')
  const [postMealMood, setPostMealMood] = useState('')
  const [foodSearch, setFoodSearch] = useState('')
  const [showPreMealModal, setShowPreMealModal] = useState(false)
  const [showPostMealModal, setShowPostMealModal] = useState(false)
  const [currentMeal, setCurrentMeal] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [foodSuggestions, setFoodSuggestions] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const photoInputRef = useRef(null)
  const labelInputRef = useRef(null)
  const geminiConfigured = isGeminiConfigured()
  
  const nutritionStats = [
    { label: t('nutrition.calories'), value: nutrition.calories.toFixed(0), unit: '', key: 'calories' },
    { label: t('nutrition.protein'), value: nutrition.protein.toFixed(0), unit: 'g', key: 'protein' },
    { label: t('nutrition.carbs'), value: nutrition.carbs.toFixed(0), unit: 'g', key: 'carbs' },
    { label: t('nutrition.fat'), value: nutrition.fat.toFixed(0), unit: 'g', key: 'fat' },
    { label: t('nutrition.fiber'), value: nutrition.fiber.toFixed(0), unit: 'g', key: 'fiber' },
    { label: t('nutrition.sugar'), value: nutrition.sugar.toFixed(0), unit: 'g', key: 'sugar' }
  ]

  const moods = ['😊 Happy', '😌 Calm', '😰 Anxious', '😔 Sad', '😠 Angry', '😴 Tired']

  // Get current mood from latest mood log
  const currentMood = useMemo(() => {
    if (moodLogs.length === 0) return '😐 Okay'
    const latestMood = moodLogs[moodLogs.length - 1]
    return latestMood.mood || '😐 Okay'
  }, [moodLogs])

  // Get latest post-meal mood from recent nutrition entries
  const latestPostMealMood = useMemo(() => {
    const entriesWithPostMeal = nutrition.entries.filter(e => e.postMealMood)
    if (entriesWithPostMeal.length > 0) {
      return entriesWithPostMeal[0].postMealMood
    }
    return null
  }, [nutrition.entries])

  // Food recommendations based on mood
  const getRecommendationsForMood = (mood) => {
    const recommendations = {
      '😊 Happy': {
        title: 'Maintain Your Energy',
        foods: [
          { name: 'Whole grains', reason: 'Sustains your positive energy levels' },
          { name: 'Lean proteins', reason: 'Supports stable mood' },
          { name: 'Leafy greens', reason: 'Rich in folate for mood regulation' },
          { name: 'Berries', reason: 'Antioxidants to protect brain health' }
        ],
        tips: 'Focus on balanced meals to maintain your positive mood'
      },
      '😌 Calm': {
        title: 'Nourish Your Peace',
        foods: [
          { name: 'Complex carbs', reason: 'Promotes serotonin production' },
          { name: 'Salmon or walnuts', reason: 'Omega-3s for brain health' },
          { name: 'Chamomile tea', reason: 'Natural calming properties' },
          { name: 'Dark chocolate', reason: 'Moderate amounts can boost mood' }
        ],
        tips: 'Choose foods that support your calm state'
      },
      '😰 Anxious': {
        title: 'Calming Foods',
        foods: [
          { name: 'Oatmeal', reason: 'Steady blood sugar for stability' },
          { name: 'Magnesium-rich foods', reason: 'Helps reduce anxiety (spinach, almonds)' },
          { name: 'Herbal teas', reason: 'Chamomile, lavender, or green tea' },
          { name: 'Foods with tryptophan', reason: 'Turkey, bananas, seeds' }
        ],
        tips: 'Avoid caffeine and heavy meals that can increase anxiety'
      },
      '😔 Sad': {
        title: 'Mood-Boosting Foods',
        foods: [
          { name: 'Foods rich in omega-3s', reason: 'Salmon, chia seeds, walnuts' },
          { name: 'Dark leafy greens', reason: 'Folate supports mood regulation' },
          { name: 'Whole grains', reason: 'Complex carbs increase serotonin' },
          { name: 'Berries and citrus', reason: 'Vitamin C and antioxidants' },
          { name: 'Lean protein', reason: 'Chicken, fish, beans for energy' }
        ],
        tips: 'Foods rich in B vitamins and omega-3s can help lift your mood'
      },
      '😠 Angry': {
        title: 'Cooling and Balancing',
        foods: [
          { name: 'Cooling foods', reason: 'Cucumber, watermelon, mint' },
          { name: 'Magnesium-rich options', reason: 'Spinach, almonds, avocado' },
          { name: 'Complex carbohydrates', reason: 'Helps stabilize mood swings' },
          { name: 'Hydrating foods', reason: 'Coconut water, celery' }
        ],
        tips: 'Avoid processed foods and sugars that can exacerbate mood swings'
      },
      '😴 Tired': {
        title: 'Energy-Boosting Nutrition',
        foods: [
          { name: 'Iron-rich foods', reason: 'Lean meats, beans, spinach' },
          { name: 'B-vitamin sources', reason: 'Whole grains, eggs, nuts' },
          { name: 'Complex carbs', reason: 'Sustained energy release' },
          { name: 'Hydrating fruits', reason: 'Watermelon, oranges' }
        ],
        tips: 'Focus on nutrient-dense foods to combat fatigue'
      },
      '😐 Okay': {
        title: t('nutrition.balancedNutrition'),
        foods: [
          { name: t('nutrition.colorfulVegetables'), reason: t('nutrition.varietyNutrients') },
          { name: t('nutrition.wholeGrains'), reason: t('nutrition.steadyEnergy') },
          { name: t('nutrition.leanProteins'), reason: t('nutrition.muscleHealth') },
          { name: t('nutrition.healthyFats'), reason: t('nutrition.fatsExample') }
        ],
        tips: t('nutrition.balancedDesc')
      }
    }

    const moodKey = mood.includes('Happy') ? '😊 Happy' :
                    mood.includes('Calm') ? '😌 Calm' :
                    mood.includes('Anxious') ? '😰 Anxious' :
                    mood.includes('Sad') ? '😔 Sad' :
                    mood.includes('Angry') ? '😠 Angry' :
                    mood.includes('Tired') ? '😴 Tired' : '😐 Okay'

    return recommendations[moodKey] || recommendations['😐 Okay']
  }

  // Current mood-based recommendations (general)
  const moodBasedRecommendations = useMemo(() => {
    return getRecommendationsForMood(currentMood)
  }, [currentMood, t])

  // Pre-meal mood recommendations
  const preMealRecommendations = useMemo(() => {
    if (!preMealMood) return null
    return getRecommendationsForMood(preMealMood)
  }, [preMealMood, t])

  // Post-meal mood recommendations (for next meal)
  const postMealRecommendations = useMemo(() => {
    if (!latestPostMealMood) return null
    return getRecommendationsForMood(latestPostMealMood)
  }, [latestPostMealMood])

  // Emotional insights - correlation between food and mood
  const emotionalInsights = useMemo(() => {
    if (nutrition.entries.length === 0 || moodLogs.length === 0) {
      return {
        patterns: [],
        summary: t('nutrition.startLoggingMeals'),
        correlations: []
      }
    }

    // Group nutrition entries and mood logs by date
    const entriesByDate = {}
    const moodsByDate = {}

    nutrition.entries.forEach(entry => {
      const date = new Date(entry.date || entry.dateString || Date.now()).toDateString()
      if (!entriesByDate[date]) entriesByDate[date] = []
      entriesByDate[date].push(entry)
    })

    moodLogs.forEach(mood => {
      const date = new Date(mood.date || mood.dateString || Date.now()).toDateString()
      if (!moodsByDate[date]) moodsByDate[date] = []
      moodsByDate[date].push(mood)
    })

    // Find correlations
    const correlations = []
    const patterns = []

    // Analyze patterns
    Object.keys(entriesByDate).forEach(date => {
      const dayEntries = entriesByDate[date]
      const dayMoods = moodsByDate[date] || []
      
      if (dayMoods.length > 0) {
        const avgMood = dayMoods[dayMoods.length - 1].mood
        const totalCalories = dayEntries.reduce((sum, e) => sum + (e.calories || 0), 0)
        const mealCount = dayEntries.length

        patterns.push({
          date,
          mood: avgMood,
          calories: totalCalories,
          mealCount,
          hasPreMeal: dayEntries.some(e => e.preMealMood),
          hasPostMeal: dayEntries.some(e => e.postMealMood)
        })
      }
    })

    // Calculate correlations
    if (patterns.length >= 3) {
      // High calorie days vs mood
      const highCalorieDays = patterns.filter(p => p.calories > 2000)
      const lowCalorieDays = patterns.filter(p => p.calories < 1500)

      if (highCalorieDays.length > 0) {
        const highCalMoods = highCalorieDays.map(p => p.mood)
        correlations.push({
          type: 'calories',
          finding: `On days with higher calorie intake (${highCalorieDays.length} days), your mood was typically ${highCalMoods[0]}`,
          insight: 'Consider how meal size affects your emotional state'
        })
      }

      // Meal frequency vs mood
      const frequentMealDays = patterns.filter(p => p.mealCount >= 3)
      if (frequentMealDays.length > 0) {
        correlations.push({
          type: 'frequency',
          finding: `Days with 3+ meals (${frequentMealDays.length} days) showed more stable patterns`,
          insight: 'Regular meal timing may support mood stability'
        })
      }

      // Pre/post meal mood tracking
      const trackedMeals = patterns.filter(p => p.hasPreMeal || p.hasPostMeal)
      if (trackedMeals.length > 0) {
        correlations.push({
          type: 'tracking',
          finding: `You've tracked emotional states for ${trackedMeals.length} meals`,
          insight: 'Continue tracking to build stronger insights'
        })
      }
    }

    const summary = patterns.length > 0
      ? `Based on ${patterns.length} days of data, we're identifying patterns between your nutrition and mood.`
      : 'Start logging your meals and moods to discover patterns and correlations.'

    return {
      patterns,
      summary,
      correlations: correlations.slice(0, 3)
    }
  }, [nutrition.entries, moodLogs])

  const handlePreMealCheckin = () => {
    setShowPreMealModal(true)
  }

  const handlePostMealCheckin = () => {
    setShowPostMealModal(true)
  }

  const handleSavePreMeal = (mood) => {
    setPreMealMood(mood)
    setShowPreMealModal(false)
  }

  const handleSavePostMeal = (mood) => {
    setPostMealMood(mood)
    setShowPostMealModal(false)
    // If there's a current meal, we need to update it - for now store for next meal
    // The post-meal mood will be used for the next meal recommendation
  }

  // Comprehensive food database
  const foodDatabase = {
    // Proteins
    'grilled chicken breast': { calories: 231, protein: 43.5, carbs: 0, fat: 5, fiber: 0, sugar: 0, serving: '100g' },
    'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, serving: '100g' },
    'salmon': { calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0, sugar: 0, serving: '100g' },
    'tuna': { calories: 144, protein: 30, carbs: 0, fat: 1, fiber: 0, sugar: 0, serving: '100g' },
    'eggs': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 0.6, serving: '2 large' },
    'tofu': { calories: 144, protein: 15.6, carbs: 3.4, fat: 8.7, fiber: 2.3, sugar: 0.5, serving: '100g' },
    'lean ground beef': { calories: 250, protein: 26, carbs: 0, fat: 17, fiber: 0, sugar: 0, serving: '100g' },
    'turkey breast': { calories: 135, protein: 30, carbs: 0, fat: 1, fiber: 0, sugar: 0, serving: '100g' },
    
    // Grains & Carbs
    'quinoa': { calories: 222, protein: 8.1, carbs: 39.4, fat: 3.6, fiber: 5.2, sugar: 0.9, serving: '1 cup cooked' },
    'brown rice': { calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0.4, serving: '1 cup cooked' },
    'white rice': { calories: 205, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, sugar: 0.1, serving: '1 cup cooked' },
    'oatmeal': { calories: 154, protein: 5.3, carbs: 27, fat: 2.4, fiber: 4, sugar: 0.8, serving: '1 cup cooked' },
    'whole wheat bread': { calories: 81, protein: 4, carbs: 13.8, fat: 1.3, fiber: 2, sugar: 1.3, serving: '1 slice' },
    'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sugar: 0.6, serving: '100g cooked' },
    
    // Fruits
    'banana': { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14.4, serving: '1 medium' },
    'apple': { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, serving: '1 medium' },
    'orange': { calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, fiber: 3.1, sugar: 12.2, serving: '1 medium' },
    'strawberries': { calories: 49, protein: 1, carbs: 12, fat: 0.5, fiber: 3, sugar: 7, serving: '1 cup' },
    'blueberries': { calories: 84, protein: 1.1, carbs: 21, fat: 0.5, fiber: 3.6, sugar: 15, serving: '1 cup' },
    'avocado': { calories: 234, protein: 3, carbs: 12, fat: 21, fiber: 10, sugar: 0.7, serving: '1 medium' },
    'grapes': { calories: 62, protein: 0.6, carbs: 16, fat: 0.2, fiber: 1, sugar: 16, serving: '1 cup' },
    
    // Vegetables
    'broccoli': { calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5, sugar: 2.6, serving: '1 cup' },
    'spinach': { calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, sugar: 0.1, serving: '1 cup raw' },
    'carrots': { calories: 50, protein: 1, carbs: 12, fat: 0.2, fiber: 3.4, sugar: 5, serving: '1 cup chopped' },
    'sweet potato': { calories: 180, protein: 4, carbs: 41, fat: 0.3, fiber: 6.6, sugar: 13, serving: '1 medium' },
    'tomatoes': { calories: 32, protein: 1.6, carbs: 7, fat: 0.4, fiber: 2.2, sugar: 4.7, serving: '1 cup chopped' },
    
    // Nuts & Seeds
    'almonds': { calories: 164, protein: 6, carbs: 6.1, fat: 14, fiber: 3.5, sugar: 1.2, serving: '1 oz (23 nuts)' },
    'walnuts': { calories: 185, protein: 4.3, carbs: 3.9, fat: 18, fiber: 1.9, sugar: 0.7, serving: '1 oz (14 halves)' },
    'peanut butter': { calories: 188, protein: 8, carbs: 6, fat: 16, fiber: 2, sugar: 3, serving: '2 tbsp' },
    
    // Dairy
    'greek yogurt': { calories: 100, protein: 17, carbs: 6, fat: 0, fiber: 0, sugar: 4, serving: '1 cup' },
    'milk': { calories: 103, protein: 8, carbs: 12, fat: 2.4, fiber: 0, sugar: 12, serving: '1 cup' },
    'cheese': { calories: 113, protein: 7, carbs: 1, fat: 9, fiber: 0, sugar: 0.5, serving: '1 oz' },
    
    // Other
    'dark chocolate': { calories: 155, protein: 2.2, carbs: 13, fat: 11, fiber: 3.1, sugar: 6.8, serving: '1 oz' },
    'honey': { calories: 64, protein: 0.1, carbs: 17, fat: 0, fiber: 0, sugar: 17, serving: '1 tbsp' },
  }

  // Generate food suggestions based on search input
  const getFoodSuggestions = (query) => {
    if (!query || query.length < 2) return []
    const normalizedQuery = query.toLowerCase()
    return Object.keys(foodDatabase)
      .filter(food => food.toLowerCase().includes(normalizedQuery))
      .slice(0, 5)
  }

  // Handle food search with suggestions
  const handleFoodSearchChange = (value) => {
    setFoodSearch(value)
    const suggestions = getFoodSuggestions(value)
    setFoodSuggestions(suggestions)
    setSearchResults(null)
  }

  const handleSearchFood = (foodName = null) => {
    const searchTerm = foodName || foodSearch.trim()
    if (!searchTerm) return
    
    const normalizedSearch = searchTerm.toLowerCase()
    let food = foodDatabase[normalizedSearch]
    
    // Try partial match
    if (!food) {
      const match = Object.keys(foodDatabase).find(key => 
        key.toLowerCase().includes(normalizedSearch) || normalizedSearch.includes(key.toLowerCase())
      )
      if (match) {
        food = foodDatabase[match]
        setFoodSearch(match)
      }
    }

    if (food) {
      setSearchResults({
        food: foodName || foodSearch,
        ...food,
        preMealMood: preMealMood || undefined,
        postMealMood: postMealMood || undefined
      })
      setFoodSuggestions([])
    } else {
      setSearchResults({ error: `Food "${searchTerm}" not found in database. Try searching for common foods like chicken, salmon, banana, or quinoa.` })
    }
  }

  const handleAddFoodToLog = (foodData) => {
    const entry = {
      id: Date.now(),
      food: foodData.food,
      calories: foodData.calories,
      protein: foodData.protein,
      carbs: foodData.carbs,
      fat: foodData.fat,
      fiber: foodData.fiber,
      sugar: foodData.sugar,
      preMealMood: foodData.preMealMood || undefined,
      postMealMood: foodData.postMealMood || undefined,
      date: new Date().toISOString(),
      dateString: new Date().toLocaleString()
    }
    addNutritionEntry(entry)
    setSearchResults(null)
    setFoodSearch('')
    setPreMealMood('')
    // Show success message
    alert(`Added ${foodData.food} to your nutrition log!`)
  }

  const handlePhotoInputChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file (jpg, png, etc.)')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image file size must be less than 10MB')
      return
    }

    setIsAnalyzing(true)
    setErrorMessage(null)
    setSearchResults(null)

    try {
      const results = await analyzeFoodImage(file)
      
      if (results.error) {
        setErrorMessage(results.error)
        setSearchResults(null)
      } else {
        setSearchResults({
          ...results,
          preMealMood: preMealMood || undefined,
          postMealMood: postMealMood || undefined
        })
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to analyze food image. Please try again.')
      setSearchResults(null)
    } finally {
      setIsAnalyzing(false)
      // Reset input
      if (photoInputRef.current) {
        photoInputRef.current.value = ''
      }
    }
  }

  const handleAnalyzePhoto = () => {
    if (!geminiConfigured) {
      setErrorMessage('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.')
      return
    }
    photoInputRef.current?.click()
  }

  const handleLabelInputChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file (jpg, png, etc.)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image file size must be less than 10MB')
      return
    }

    setIsAnalyzing(true)
    setErrorMessage(null)
    setSearchResults(null)

    try {
      const results = await analyzeNutritionLabel(file)
      
      if (results.error) {
        setErrorMessage(results.error)
        setSearchResults(null)
      } else {
        setSearchResults({
          ...results,
          preMealMood: preMealMood || undefined,
          postMealMood: postMealMood || undefined
        })
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to scan nutrition label. Please try again.')
      setSearchResults(null)
    } finally {
      setIsAnalyzing(false)
      // Reset input
      if (labelInputRef.current) {
        labelInputRef.current.value = ''
      }
    }
  }

  const handleScanLabel = () => {
    if (!geminiConfigured) {
      setErrorMessage('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.')
      return
    }
    labelInputRef.current?.click()
  }

  const handleAddCustomMeal = () => {
    const calories = prompt('Enter calories:')
    const protein = prompt('Enter protein (g):') || 0
    const carbs = prompt('Enter carbs (g):') || 0
    const fat = prompt('Enter fat (g):') || 0

    if (calories) {
      const entry = {
        id: Date.now(),
        food: 'Custom meal',
        calories: parseFloat(calories),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fat: parseFloat(fat),
        fiber: 0,
        sugar: 0,
        preMealMood: preMealMood || undefined,
        postMealMood: postMealMood || undefined,
        date: new Date().toISOString(),
        dateString: new Date().toLocaleString()
      }
      addNutritionEntry(entry)
      setCurrentMeal(null)
      setPreMealMood('')
      // Keep post-meal mood for next meal recommendations
      // setPostMealMood('')
    }
  }

  return (
    <div className="nutrition-page">
      <header className="page-header">
        <h1>{t('nutrition.title')}</h1>
        <p>{t('nutrition.subtitle')}</p>
      </header>

      {/* Pre-Meal Mood Recommendations */}
      {preMealMood && preMealRecommendations && (
        <section className="mood-recommendations pre-meal-rec">
          <div className="recommendation-header">
            <h2><Heart size={24} /> Recommendations Based on Your Pre-Meal Mood</h2>
            <p className="current-mood-display">Your Pre-Meal Mood: <span className="mood-badge">{preMealMood}</span></p>
          </div>
          <div className="recommendation-card">
            <h3>{preMealRecommendations.title}</h3>
            <p className="recommendation-tip">{preMealRecommendations.tips}</p>
            <div className="recommended-foods">
              {preMealRecommendations.foods.map((food, index) => (
                <div key={index} className="food-recommendation">
                  <div className="food-name">{food.name}</div>
                  <div className="food-reason">{food.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Post-Meal Mood Recommendations (for next meal) */}
      {latestPostMealMood && postMealRecommendations && (
        <section className="mood-recommendations post-meal-rec">
          <div className="recommendation-header">
            <h2><Heart size={24} /> Next Meal Recommendations Based on Your Last Post-Meal Mood</h2>
            <p className="current-mood-display">Last Post-Meal Mood: <span className="mood-badge">{latestPostMealMood}</span></p>
          </div>
          <div className="recommendation-card">
            <h3>{postMealRecommendations.title}</h3>
            <p className="recommendation-tip">{postMealRecommendations.tips}</p>
            <div className="recommended-foods">
              {postMealRecommendations.foods.map((food, index) => (
                <div key={index} className="food-recommendation">
                  <div className="food-name">{food.name}</div>
                  <div className="food-reason">{food.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* General Mood-Based Food Recommendations */}
      <section className="mood-recommendations general-rec">
        <div className="recommendation-header">
          <h2><Lightbulb size={24} /> {t('nutrition.generalRecommendations')}</h2>
          <p className="current-mood-display">{t('nutrition.currentMood')} <span className="mood-badge">{currentMood}</span></p>
          {!preMealMood && !latestPostMealMood && (
            <p className="recommendation-hint">
              {t('nutrition.tipMessage')}
            </p>
          )}
        </div>
        <div className="recommendation-card">
          <h3>{moodBasedRecommendations.title}</h3>
          <p className="recommendation-tip">{moodBasedRecommendations.tips}</p>
          <div className="recommended-foods">
            {moodBasedRecommendations.foods.map((food, index) => (
              <div key={index} className="food-recommendation">
                <div className="food-name">{food.name}</div>
                <div className="food-reason">{food.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emotional Insights Section */}
      <section className="emotional-insights">
        <h2><Brain size={24} /> {t('nutrition.emotionalInsights')}</h2>
        <p>{t('nutrition.emotionalDesc')}</p>
        
        <div className="insights-card">
          <p className="insights-summary">{emotionalInsights.summary}</p>
          
          {emotionalInsights.correlations.length > 0 && (
            <div className="correlations-list">
              {emotionalInsights.correlations.map((correlation, index) => (
                <div key={index} className="correlation-item">
                  <div className="correlation-finding">{correlation.finding}</div>
                  <div className="correlation-insight">{correlation.insight}</div>
                </div>
              ))}
            </div>
          )}

          {emotionalInsights.patterns.length > 0 && (
            <div className="patterns-section">
              <h4>Recent Patterns</h4>
              <div className="patterns-grid">
                {emotionalInsights.patterns.slice(-5).reverse().map((pattern, index) => (
                  <div key={index} className="pattern-card">
                    <div className="pattern-date">{new Date(pattern.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <div className="pattern-mood">Mood: {pattern.mood}</div>
                    <div className="pattern-calories">{pattern.calories} cal</div>
                    <div className="pattern-meals">{pattern.mealCount} meals</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Emotional Check-in Section */}
      <section className="emotional-checkin">
        <h2>{t('nutrition.emotionalCheckin')}</h2>
        <p>{t('nutrition.checkinDesc')}</p>
        <div className="checkin-buttons">
          <button className="checkin-btn pre-meal" onClick={handlePreMealCheckin}>
            <Heart size={20} />
            <span>{t('nutrition.preMealCheckin')}</span>
          </button>
          <button className="checkin-btn post-meal" onClick={handlePostMealCheckin}>
            <Heart size={20} />
            <span>{t('nutrition.postMealCheckin')}</span>
          </button>
        </div>
        
        {/* Pre-Meal Mood Modal */}
        {showPreMealModal && (
          <div className="mood-modal-overlay" onClick={() => setShowPreMealModal(false)}>
            <div className="mood-modal" onClick={(e) => e.stopPropagation()}>
              <h3>How are you feeling before this meal?</h3>
              <div className="mood-options">
                {moods.map((mood) => (
                  <button
                    key={mood}
                    className={`mood-option ${preMealMood === mood ? 'selected' : ''}`}
                    onClick={() => handleSavePreMeal(mood)}
                  >
                    {mood}
                  </button>
                ))}
              </div>
              <button className="modal-close" onClick={() => setShowPreMealModal(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Post-Meal Mood Modal */}
        {showPostMealModal && (
          <div className="mood-modal-overlay" onClick={() => setShowPostMealModal(false)}>
            <div className="mood-modal" onClick={(e) => e.stopPropagation()}>
              <h3>How do you feel after this meal?</h3>
              <div className="mood-options">
                {moods.map((mood) => (
                  <button
                    key={mood}
                    className={`mood-option ${postMealMood === mood ? 'selected' : ''}`}
                    onClick={() => handleSavePostMeal(mood)}
                  >
                    {mood}
                  </button>
                ))}
              </div>
              <button className="modal-close" onClick={() => setShowPostMealModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </section>

      {/* Today's Nutrition */}
      <section className="nutrition-stats">
        <h2>{t('nutrition.todayNutrition')}</h2>
        <p>{t('nutrition.dailyProgress')}</p>
        <div className="stats-grid">
          {nutritionStats.map((stat, index) => (
            <div key={index} className="nutrition-stat-card">
              <div className="stat-value">{stat.value}<span className="stat-unit">{stat.unit}</span></div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Food Analysis */}
      <section className="ai-food-analysis">
        <h2>{t('nutrition.aiFoodAnalysis')}</h2>
        <p>{t('nutrition.aiDesc')}</p>
        
        {/* Gemini API Configuration Status */}
        {!geminiConfigured && (
          <div className="api-warning">
            <AlertCircle size={20} />
            <div>
              <strong>Gemini API Not Configured</strong>
              <p>To use AI photo analysis and label scanning, please set your Gemini API key:</p>
              <ol>
                <li>Create a <code>.env</code> file in the root directory</li>
                <li>Add: <code>VITE_GEMINI_API_KEY=your_api_key_here</code></li>
                <li>Get your API key from: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{errorMessage}</span>
            <button 
              className="error-close" 
              onClick={(e) => {
                e.stopPropagation()
                setErrorMessage(null)
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handlePhotoInputChange}
        />
        <input
          ref={labelInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleLabelInputChange}
        />
        
        <div className="analysis-options">
          {/* Search Food Database */}
          <div className="analysis-card">
            <div className="analysis-icon">
              <Search size={32} />
            </div>
            <h3>{t('nutrition.searchDatabase')}</h3>
            <p>{t('nutrition.searchDesc')}</p>
            <div className="search-input-group">
              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder={t('nutrition.searchPlaceholder')}
                  value={foodSearch}
                  onChange={(e) => handleFoodSearchChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchFood()}
                  onFocus={() => {
                    if (foodSearch.length >= 2) {
                      setFoodSuggestions(getFoodSuggestions(foodSearch))
                    }
                  }}
                  className="food-search-input"
                />
                <button className="search-btn" onClick={() => handleSearchFood()}>Search</button>
              </div>
              
              {/* Food Suggestions */}
              {foodSuggestions.length > 0 && (
                <div className="food-suggestions">
                  {foodSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="suggestion-item"
                      onClick={() => {
                        setFoodSearch(suggestion)
                        handleSearchFood(suggestion)
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Search Results */}
            {searchResults && !searchResults.error && (
              <div className="search-results">
                <div className="food-result-header">
                  <h4>{searchResults.food}</h4>
                  {searchResults.serving && <span className="serving-size">Serving: {searchResults.serving}</span>}
                </div>
                <div className="nutrition-info-grid">
                  <div className="nutrition-info-item">
                    <span className="info-label">Calories</span>
                    <span className="info-value">{searchResults.calories}</span>
                  </div>
                  <div className="nutrition-info-item">
                    <span className="info-label">Protein</span>
                    <span className="info-value">{searchResults.protein}g</span>
                  </div>
                  <div className="nutrition-info-item">
                    <span className="info-label">Carbs</span>
                    <span className="info-value">{searchResults.carbs}g</span>
                  </div>
                  <div className="nutrition-info-item">
                    <span className="info-label">Fat</span>
                    <span className="info-value">{searchResults.fat}g</span>
                  </div>
                  {searchResults.fiber > 0 && (
                    <div className="nutrition-info-item">
                      <span className="info-label">Fiber</span>
                      <span className="info-value">{searchResults.fiber}g</span>
                    </div>
                  )}
                  {searchResults.sugar > 0 && (
                    <div className="nutrition-info-item">
                      <span className="info-label">Sugar</span>
                      <span className="info-value">{searchResults.sugar}g</span>
                    </div>
                  )}
                </div>
                {(searchResults.detectedFoods || searchResults.confidence || searchResults.healthTips) && (
                  <div className="ai-analysis-info">
                    {searchResults.confidence && (
                      <span className="confidence-badge">AI Confidence: {searchResults.confidence}</span>
                    )}
                    {searchResults.detectedFoods && Array.isArray(searchResults.detectedFoods) && (
                      <div className="detected-foods">
                        <strong>Detected Foods:</strong> {searchResults.detectedFoods.join(', ')}
                      </div>
                    )}
                    {searchResults.healthTips && Array.isArray(searchResults.healthTips) && searchResults.healthTips.length > 0 && (
                      <div className="health-tips">
                        <strong>Health Tips:</strong>
                        <ul>
                          {searchResults.healthTips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                <button 
                  className="add-to-log-btn"
                  onClick={() => handleAddFoodToLog(searchResults)}
                >
                  Add to Log
                </button>
              </div>
            )}
            
            {searchResults?.error && (
              <div className="search-error">
                <p>{searchResults.error}</p>
              </div>
            )}
            
            {(preMealMood || postMealMood) && !searchResults && (
              <div className="current-mood-status">
                {preMealMood && <span className="mood-status-tag">Pre-meal: {preMealMood}</span>}
                {postMealMood && <span className="mood-status-tag">Post-meal: {postMealMood}</span>}
              </div>
            )}
          </div>

          {/* Analyze Food Photo */}
          <div className="analysis-card">
            <div className="analysis-icon">
              <Camera size={32} />
            </div>
            <h3>{t('nutrition.analyzePhoto')}</h3>
            <p>{t('nutrition.analyzePhotoDesc')}</p>
            <button 
              className="photo-btn" 
              onClick={handleAnalyzePhoto}
              disabled={isAnalyzing || !geminiConfigured}
              title={!geminiConfigured ? 'Gemini API key required' : ''}
            >
              {isAnalyzing ? (
                <>
                  <div className="spinner"></div>
                  <span>Analyzing with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Camera size={20} />
                  <span>{t('nutrition.uploadPhoto')}</span>
                </>
              )}
            </button>
            {isAnalyzing && (
              <p className="analyzing-message">Gemini AI is analyzing your food photo...</p>
            )}
            {!geminiConfigured && (
              <p className="analyzing-message" style={{ color: '#ef4444' }}>
                Gemini API key required for this feature
              </p>
            )}
          </div>

          {/* Scan Nutrition Label */}
          <div className="analysis-card">
            <div className="analysis-icon">
              <ScanLine size={32} />
            </div>
            <h3>{t('nutrition.scanLabel')}</h3>
            <p>{t('nutrition.scanLabelDesc')}</p>
            <button 
              className="scan-btn"
              onClick={handleScanLabel}
              disabled={isAnalyzing || !geminiConfigured}
              title={!geminiConfigured ? 'Gemini API key required' : ''}
            >
              {isAnalyzing ? (
                <>
                  <div className="spinner"></div>
                  <span>Scanning with Gemini AI...</span>
                </>
              ) : (
                <>
                  <ScanLine size={20} />
                  <span>{t('nutrition.uploadLabel')}</span>
                </>
              )}
            </button>
            {isAnalyzing && (
              <p className="analyzing-message">Gemini AI is extracting nutrition data from label...</p>
            )}
            {!geminiConfigured && (
              <p className="analyzing-message" style={{ color: '#ef4444' }}>
                Gemini API key required for this feature
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Recent Nutrition Entries */}
      {nutrition.entries.length > 0 && (
        <section className="recent-entries">
          <h2>Recent Food Entries</h2>
          <div className="entries-list">
            {nutrition.entries.slice(0, 10).map((entry) => (
              <div key={entry.id} className="entry-card">
                <div className="entry-main">
                  <div className="entry-food">{entry.food || 'Custom meal'}</div>
                  <div className="entry-calories">{entry.calories} cal</div>
                </div>
                <div className="entry-meta">
                  <span>{entry.protein}g protein</span>
                  <span>{entry.carbs}g carbs</span>
                  <span>{entry.fat}g fat</span>
                </div>
                {(entry.preMealMood || entry.postMealMood) && (
                  <div className="entry-moods">
                    {entry.preMealMood && <span className="mood-tag pre">Before: {entry.preMealMood}</span>}
                    {entry.postMealMood && <span className="mood-tag post">After: {entry.postMealMood}</span>}
                  </div>
                )}
                <div className="entry-date">
                  {entry.dateString || new Date(entry.date).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Nutrition



