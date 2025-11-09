import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ChefHat, Clock, Users, Flame, BookOpen, Star, ChevronDown, ChevronUp, ShoppingCart, Filter, Search, TrendingUp, TrendingDown, Target, Activity, User, Settings } from 'lucide-react'
import { getJSON } from '../utils/storage'
import { useNavigate } from 'react-router-dom'
import { generateRecipes } from '../data/recipeDatabase'
import './MeredithShirkMealPlan.css'

const MeredithShirkMealPlan = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('plans')
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [expandedRecipe, setExpandedRecipe] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterCuisine, setFilterCuisine] = useState('all')
  const [filterGoal, setFilterGoal] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [calorieTarget, setCalorieTarget] = useState('all')
  const [userProfile, setUserProfile] = useState(null)

  console.log('🍽️ MeredithShirkMealPlan component loaded')
  console.log('Translation test:', t('meredithShirk.title'))

  // Load user profile from localStorage
  useEffect(() => {
    const profile = getJSON('personalInformation', null)
    setUserProfile(profile)
  }, [])

  // Calculate daily calorie needs based on BMR (Basal Metabolic Rate)
  const calculateCalories = useMemo(() => {
    if (!userProfile || !userProfile.age || !userProfile.weight || !userProfile.height || !userProfile.gender) {
      return null
    }

    const { age, weight, height, gender, activityLevel, goal } = userProfile

    // Mifflin-St Jeor Equation for BMR
    let bmr
    if (gender === 'Male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
    }

    // Activity multipliers
    const activityMultipliers = {
      'Sedentary': 1.2,
      'Lightly active': 1.375,
      'Moderately active': 1.55,
      'Very active': 1.725,
      'Extra active': 1.9
    }

    const multiplier = activityMultipliers[activityLevel] || 1.2
    let tdee = bmr * multiplier // Total Daily Energy Expenditure

    // Adjust for goal
    if (goal === 'Weight Loss') {
      tdee = tdee - 500 // 500 calorie deficit for weight loss
    } else if (goal === 'Muscle Gain') {
      tdee = tdee + 300 // 300 calorie surplus for muscle gain
    }

    // Calculate macros (example: 40% carbs, 30% protein, 30% fat)
    const protein = Math.round((tdee * 0.30) / 4) // 4 calories per gram of protein
    const carbs = Math.round((tdee * 0.40) / 4) // 4 calories per gram of carbs
    const fat = Math.round((tdee * 0.30) / 9) // 9 calories per gram of fat

    return {
      calories: Math.round(tdee),
      protein,
      carbs,
      fat,
      bmr: Math.round(bmr)
    }
  }, [userProfile])

  const mealPlans = [
    {
      id: 1,
      name: t('meredithShirk.plans.weightLoss.name'),
      description: t('meredithShirk.plans.weightLoss.description'),
      duration: t('meredithShirk.plans.weightLoss.duration'),
      calories: '1200-1500',
      goal: 'weightLoss',
      image: '🥗',
      meals: [
        { day: 'Monday', breakfast: 'Green Smoothie Bowl', lunch: 'Grilled Chicken Salad', dinner: 'Baked Salmon with Asparagus' },
        { day: 'Tuesday', breakfast: 'Protein Pancakes', lunch: 'Turkey Lettuce Wraps', dinner: 'Zucchini Noodles with Marinara' },
        { day: 'Wednesday', breakfast: 'Greek Yogurt Parfait', lunch: 'Quinoa Buddha Bowl', dinner: 'Lemon Herb Chicken Breast' },
        { day: 'Thursday', breakfast: 'Egg White Omelette', lunch: 'Tuna Avocado Salad', dinner: 'Grilled Shrimp Skewers' },
        { day: 'Friday', breakfast: 'Chia Seed Pudding', lunch: 'Mediterranean Wrap', dinner: 'Turkey Meatballs with Veggies' },
        { day: 'Saturday', breakfast: 'Avocado Toast', lunch: 'Chicken Veggie Stir-Fry', dinner: 'Baked Cod with Broccoli' },
        { day: 'Sunday', breakfast: 'Berry Protein Smoothie', lunch: 'Spinach Salad with Grilled Chicken', dinner: 'Lean Beef with Sweet Potato' }
      ]
    },
    {
      id: 2,
      name: t('meredithShirk.plans.muscleGain.name'),
      description: t('meredithShirk.plans.muscleGain.description'),
      duration: t('meredithShirk.plans.muscleGain.duration'),
      calories: '2000-2500',
      goal: 'muscleGain',
      image: '💪',
      meals: [
        { day: 'Monday', breakfast: 'Protein Oatmeal with Nuts', lunch: 'Grilled Steak with Quinoa', dinner: 'Chicken Breast with Brown Rice' },
        { day: 'Tuesday', breakfast: 'Egg and Cheese Wrap', lunch: 'Salmon with Sweet Potato', dinner: 'Turkey Chili with Beans' },
        { day: 'Wednesday', breakfast: 'Greek Yogurt with Granola', lunch: 'Tuna Sandwich', dinner: 'Beef Stir-Fry with Rice' },
        { day: 'Thursday', breakfast: 'Protein Pancakes', lunch: 'Chicken Pasta Salad', dinner: 'Grilled Fish with Vegetables' },
        { day: 'Friday', breakfast: 'Scrambled Eggs with Toast', lunch: 'Turkey Burger with Fries', dinner: 'Lamb Chops with Couscous' },
        { day: 'Saturday', breakfast: 'Smoothie Bowl', lunch: 'Chicken Wrap', dinner: 'Steak with Mashed Potatoes' },
        { day: 'Sunday', breakfast: 'French Toast', lunch: 'Grilled Chicken Sandwich', dinner: 'Pork Tenderloin with Veggies' }
      ]
    },
    {
      id: 3,
      name: t('meredithShirk.plans.balanced.name'),
      description: t('meredithShirk.plans.balanced.description'),
      duration: t('meredithShirk.plans.balanced.duration'),
      calories: '1600-1900',
      goal: 'maintenance',
      image: '⚖️',
      meals: [
        { day: 'Monday', breakfast: 'Oatmeal with Berries', lunch: 'Chicken Caesar Salad', dinner: 'Baked Tilapia with Quinoa' },
        { day: 'Tuesday', breakfast: 'Veggie Omelette', lunch: 'Turkey Sandwich', dinner: 'Pasta Primavera' },
        { day: 'Wednesday', breakfast: 'Smoothie', lunch: 'Greek Salad with Feta', dinner: 'Grilled Chicken with Rice' },
        { day: 'Thursday', breakfast: 'Yogurt Parfait', lunch: 'Vegetable Soup', dinner: 'Salmon with Asparagus' },
        { day: 'Friday', breakfast: 'Toast with Avocado', lunch: 'Chicken Wrap', dinner: 'Beef Tacos' },
        { day: 'Saturday', breakfast: 'Pancakes', lunch: 'Tuna Salad', dinner: 'Pizza with Salad' },
        { day: 'Sunday', breakfast: 'Eggs Benedict', lunch: 'Burger with Sweet Potato Fries', dinner: 'Roast Chicken with Vegetables' }
      ]
    },
    {
      id: 4,
      name: t('meredithShirk.plans.keto.name'),
      description: t('meredithShirk.plans.keto.description'),
      duration: '7 days',
      calories: '1500-1800',
      goal: 'weightLoss',
      image: '🥑',
      meals: [
        { day: 'Monday', breakfast: 'Keto Coffee with Eggs', lunch: 'Chicken Avocado Salad', dinner: 'Ribeye Steak with Butter' },
        { day: 'Tuesday', breakfast: 'Bacon and Eggs', lunch: 'Tuna Lettuce Wraps', dinner: 'Salmon with Cauliflower Rice' },
        { day: 'Wednesday', breakfast: 'Cheese Omelette', lunch: 'Grilled Chicken Thighs', dinner: 'Pork Chops with Green Beans' },
        { day: 'Thursday', breakfast: 'Bulletproof Coffee', lunch: 'Caesar Salad with Salmon', dinner: 'Lamb with Roasted Vegetables' },
        { day: 'Friday', breakfast: 'Scrambled Eggs with Cheese', lunch: 'Beef Bowl', dinner: 'Grilled Fish with Asparagus' },
        { day: 'Saturday', breakfast: 'Keto Pancakes', lunch: 'Chicken Wings', dinner: 'Steak with Mushrooms' },
        { day: 'Sunday', breakfast: 'Avocado Egg Boats', lunch: 'Shrimp Salad', dinner: 'BBQ Ribs with Coleslaw' }
      ]
    },
    {
      id: 5,
      name: t('meredithShirk.plans.vegan.name'),
      description: t('meredithShirk.plans.vegan.description'),
      duration: '7 days',
      calories: '1400-1700',
      goal: 'health',
      image: '🌱',
      meals: [
        { day: 'Monday', breakfast: 'Oatmeal with Banana', lunch: 'Chickpea Buddha Bowl', dinner: 'Lentil Curry with Rice' },
        { day: 'Tuesday', breakfast: 'Smoothie Bowl', lunch: 'Quinoa Salad', dinner: 'Tofu Stir-Fry' },
        { day: 'Wednesday', breakfast: 'Chia Pudding', lunch: 'Falafel Wrap', dinner: 'Vegetable Pasta' },
        { day: 'Thursday', breakfast: 'Avocado Toast', lunch: 'Black Bean Tacos', dinner: 'Mushroom Risotto' },
        { day: 'Friday', breakfast: 'Granola with Almond Milk', lunch: 'Hummus Platter', dinner: 'Thai Green Curry' },
        { day: 'Saturday', breakfast: 'Pancakes with Maple Syrup', lunch: 'Veggie Burger', dinner: 'Stuffed Bell Peppers' },
        { day: 'Sunday', breakfast: 'French Toast', lunch: 'Mediterranean Bowl', dinner: 'Vegan Pizza' }
      ]
    },
    {
      id: 6,
      name: t('meredithShirk.plans.mediterranean.name'),
      description: t('meredithShirk.plans.mediterranean.description'),
      duration: '7 days',
      calories: '1600-2000',
      goal: 'health',
      image: '🫒',
      meals: [
        { day: 'Monday', breakfast: 'Greek Yogurt with Honey', lunch: 'Greek Salad', dinner: 'Grilled Fish with Vegetables' },
        { day: 'Tuesday', breakfast: 'Whole Grain Toast with Olive Oil', lunch: 'Hummus Bowl', dinner: 'Lamb with Couscous' },
        { day: 'Wednesday', breakfast: 'Fruit Salad', lunch: 'Tabbouleh', dinner: 'Baked Chicken with Lemon' },
        { day: 'Thursday', breakfast: 'Omelette with Feta', lunch: 'Lentil Soup', dinner: 'Seafood Paella' },
        { day: 'Friday', breakfast: 'Smoothie', lunch: 'Caprese Salad', dinner: 'Grilled Halloumi with Vegetables' },
        { day: 'Saturday', breakfast: 'Shakshuka', lunch: 'Fattoush Salad', dinner: 'Moussaka' },
        { day: 'Sunday', breakfast: 'Yogurt Parfait', lunch: 'Falafel Plate', dinner: 'Grilled Sea Bass' }
      ]
    }
  ]

  // Generate comprehensive recipe database (1500+ recipes)
  const recipes = useMemo(() => generateRecipes(), [])
  
  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = filterCategory === 'all' || recipe.category === filterCategory
    const matchesCuisine = filterCuisine === 'all' || recipe.cuisine === filterCuisine
    const matchesGoal = filterGoal === 'all' || recipe.goal === filterGoal
    const matchesCalories = calorieTarget === 'all' || 
      (calorieTarget === 'low' && recipe.calories < 300) ||
      (calorieTarget === 'medium' && recipe.calories >= 300 && recipe.calories < 500) ||
      (calorieTarget === 'high' && recipe.calories >= 500)
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesCuisine && matchesGoal && matchesCalories && matchesSearch
  })

  const filteredPlans = mealPlans.filter(plan => {
    const matchesGoal = filterGoal === 'all' || plan.goal === filterGoal
    return matchesGoal
  })

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'green'
      case 'Medium': return 'orange'
      case 'Hard': return 'red'
      default: return 'gray'
    }
  }

  return (
    <div className="meredith-shirk-meal-plan">
      <header className="page-header">
        <div className="header-content">
          <ChefHat size={48} className="header-icon" />
          <div>
            <h1>{t('meredithShirk.title')}</h1>
            <p>{t('meredithShirk.subtitle')}</p>
          </div>
        </div>
      </header>

      <div className="meal-plan-tabs">
        <button 
          className={`tab-btn ${activeTab === 'plans' ? 'active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          <BookOpen size={20} />
          <span>{t('meredithShirk.tabs.mealPlans')}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          <ChefHat size={20} />
          <span>{t('meredithShirk.tabs.recipes')}</span>
        </button>
      </div>

      {/* Personalized Profile Banner */}
      {calculateCalories ? (
        <div className="profile-nutrition-banner">
          <div className="banner-header">
            <User size={24} />
            <div>
              <h3>{t('meredithShirk.profileBanner.personalizedGoals')}</h3>
              <p>{t('meredithShirk.profileBanner.basedOnProfile')}: {userProfile.age}{t('meredithShirk.profileBanner.years')}, {userProfile.weight}kg, {userProfile.height}cm, {userProfile.activityLevel}</p>
            </div>
          </div>
          <div className="nutrition-stats">
            <div className="stat-card primary">
              <Flame size={28} />
              <div>
                <span className="stat-value">{calculateCalories.calories}</span>
                <span className="stat-label">{t('meredithShirk.profileBanner.dailyCalories')}</span>
              </div>
            </div>
            <div className="stat-card">
              <Target size={24} />
              <div>
                <span className="stat-value">{calculateCalories.protein}g</span>
                <span className="stat-label">{t('meredithShirk.profileBanner.protein')}</span>
              </div>
            </div>
            <div className="stat-card">
              <Activity size={24} />
              <div>
                <span className="stat-value">{calculateCalories.carbs}g</span>
                <span className="stat-label">{t('meredithShirk.profileBanner.carbs')}</span>
              </div>
            </div>
            <div className="stat-card">
              <TrendingUp size={24} />
              <div>
                <span className="stat-value">{calculateCalories.fat}g</span>
                <span className="stat-label">{t('meredithShirk.profileBanner.fats')}</span>
              </div>
            </div>
          </div>
          <p className="banner-note">
            💡 {t('meredithShirk.profileBanner.tip')} {calculateCalories.calories} {t('meredithShirk.profileBanner.calorieGoal')}
          </p>
        </div>
      ) : (
        <div className="profile-nutrition-banner incomplete">
          <div className="banner-header">
            <Settings size={24} />
            <div>
              <h3>{t('meredithShirk.profileBanner.incompleteTitle')}</h3>
              <p>{t('meredithShirk.profileBanner.incompleteDesc')}</p>
            </div>
          </div>
          <button className="setup-profile-btn" onClick={() => navigate('/profile/personal-info')}>
            <User size={20} />
            {t('meredithShirk.profileBanner.setupButton')}
          </button>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="meal-plans-section">
          <div className="section-header-with-filters">
            <div>
              <h2>{t('meredithShirk.plansSection.title')}</h2>
              <p className="section-subtitle">{t('meredithShirk.plansSection.subtitle')}</p>
            </div>
            
            <div className="plan-goal-filter">
              <Target size={18} />
              <select value={filterGoal} onChange={(e) => setFilterGoal(e.target.value)}>
                <option value="all">{t('meredithShirk.filters.allGoals')}</option>
                <option value="weightLoss">{t('meredithShirk.filters.weightLoss')}</option>
                <option value="muscleGain">{t('meredithShirk.filters.muscleGain')}</option>
                <option value="maintenance">{t('meredithShirk.filters.maintenance')}</option>
                <option value="health">{t('meredithShirk.filters.health')}</option>
              </select>
            </div>
          </div>
          
          <div className="plans-grid">
            {filteredPlans.map(plan => (
              <div key={plan.id} className="plan-card">
                <div className="plan-icon">{plan.image}</div>
                <h3>{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
                
                <div className="plan-meta">
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{plan.duration}</span>
                  </div>
                  <div className="meta-item">
                    <Flame size={16} />
                    <span>{plan.calories} {t('meredithShirk.common.kcalPerDay')}</span>
                  </div>
                </div>

                <button 
                  className="view-plan-btn"
                  onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
                >
                  {selectedPlan === plan.id ? t('meredithShirk.common.hide') : t('meredithShirk.common.viewPlan')}
                  {selectedPlan === plan.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {selectedPlan === plan.id && (
                  <div className="plan-details">
                    <h4>{t('meredithShirk.common.weeklyMeals')}</h4>
                    <div className="meals-list">
                      {plan.meals.map((meal, index) => (
                        <div key={index} className="meal-day">
                          <div className="day-label">{meal.day}</div>
                          <div className="day-meals">
                            <div className="meal-item">
                              <span className="meal-type">{t('meredithShirk.common.breakfast')}:</span>
                              <span>{meal.breakfast}</span>
                            </div>
                            <div className="meal-item">
                              <span className="meal-type">{t('meredithShirk.common.lunch')}:</span>
                              <span>{meal.lunch}</span>
                            </div>
                            <div className="meal-item">
                              <span className="meal-type">{t('meredithShirk.common.dinner')}:</span>
                              <span>{meal.dinner}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recipes' && (
        <div className="recipes-section">
          <div className="recipes-header">
            <div>
              <h2>{t('meredithShirk.recipesSection.title')}</h2>
              <p className="section-subtitle">{t('meredithShirk.recipesSection.subtitle')}</p>
            </div>
            
            <div className="recipes-filters">
              <div className="search-box">
                <Search size={18} />
                <input 
                  type="text"
                  placeholder={t('meredithShirk.common.searchRecipes')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="filter-row">
                <div className="filter-group">
                  <label>{t('meredithShirk.filters.category')}</label>
                  <div className="filter-buttons">
                    <button 
                      className={`filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterCategory('all')}
                    >
                      {t('meredithShirk.common.all')}
                    </button>
                    <button 
                      className={`filter-btn ${filterCategory === 'breakfast' ? 'active' : ''}`}
                      onClick={() => setFilterCategory('breakfast')}
                    >
                      {t('meredithShirk.common.breakfast')}
                    </button>
                    <button 
                      className={`filter-btn ${filterCategory === 'lunch' ? 'active' : ''}`}
                      onClick={() => setFilterCategory('lunch')}
                    >
                      {t('meredithShirk.common.lunch')}
                    </button>
                    <button 
                      className={`filter-btn ${filterCategory === 'dinner' ? 'active' : ''}`}
                      onClick={() => setFilterCategory('dinner')}
                    >
                      {t('meredithShirk.common.dinner')}
                    </button>
                    <button 
                      className={`filter-btn ${filterCategory === 'snacks' ? 'active' : ''}`}
                      onClick={() => setFilterCategory('snacks')}
                    >
                      {t('meredithShirk.common.snacks')}
                    </button>
                  </div>
                </div>

                <div className="filter-group">
                  <label>{t('meredithShirk.filters.cuisine')}</label>
                  <div className="filter-buttons">
                    <button 
                      className={`filter-btn ${filterCuisine === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterCuisine('all')}
                    >
                      {t('meredithShirk.common.all')}
                    </button>
                    <button 
                      className={`filter-btn ${filterCuisine === 'mediterranean' ? 'active' : ''}`}
                      onClick={() => setFilterCuisine('mediterranean')}
                    >
                      {t('meredithShirk.filters.mediterranean')}
                    </button>
                    <button 
                      className={`filter-btn ${filterCuisine === 'asian' ? 'active' : ''}`}
                      onClick={() => setFilterCuisine('asian')}
                    >
                      {t('meredithShirk.filters.asian')}
                    </button>
                    <button 
                      className={`filter-btn ${filterCuisine === 'mexican' ? 'active' : ''}`}
                      onClick={() => setFilterCuisine('mexican')}
                    >
                      {t('meredithShirk.filters.mexican')}
                    </button>
                    <button 
                      className={`filter-btn ${filterCuisine === 'italian' ? 'active' : ''}`}
                      onClick={() => setFilterCuisine('italian')}
                    >
                      {t('meredithShirk.filters.italian')}
                    </button>
                    <button 
                      className={`filter-btn ${filterCuisine === 'american' ? 'active' : ''}`}
                      onClick={() => setFilterCuisine('american')}
                    >
                      {t('meredithShirk.filters.american')}
                    </button>
                  </div>
                </div>

                <div className="filter-group">
                  <label>{t('meredithShirk.filters.goal')}</label>
                  <div className="filter-buttons">
                    <button 
                      className={`filter-btn ${filterGoal === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterGoal('all')}
                    >
                      {t('meredithShirk.common.all')}
                    </button>
                    <button 
                      className={`filter-btn ${filterGoal === 'weightLoss' ? 'active' : ''}`}
                      onClick={() => setFilterGoal('weightLoss')}
                    >
                      <TrendingDown size={14} />
                      {t('meredithShirk.filters.weightLoss')}
                    </button>
                    <button 
                      className={`filter-btn ${filterGoal === 'muscleGain' ? 'active' : ''}`}
                      onClick={() => setFilterGoal('muscleGain')}
                    >
                      <Activity size={14} />
                      {t('meredithShirk.filters.muscleGain')}
                    </button>
                    <button 
                      className={`filter-btn ${filterGoal === 'health' ? 'active' : ''}`}
                      onClick={() => setFilterGoal('health')}
                    >
                      {t('meredithShirk.filters.health')}
                    </button>
                  </div>
                </div>

                <div className="filter-group">
                  <label>{t('meredithShirk.filters.calories')}</label>
                  <div className="filter-buttons">
                    <button 
                      className={`filter-btn ${calorieTarget === 'all' ? 'active' : ''}`}
                      onClick={() => setCalorieTarget('all')}
                    >
                      {t('meredithShirk.common.all')}
                    </button>
                    <button 
                      className={`filter-btn ${calorieTarget === 'low' ? 'active' : ''}`}
                      onClick={() => setCalorieTarget('low')}
                    >
                      {'< 300'}
                    </button>
                    <button 
                      className={`filter-btn ${calorieTarget === 'medium' ? 'active' : ''}`}
                      onClick={() => setCalorieTarget('medium')}
                    >
                      {' 300-500'}
                    </button>
                    <button 
                      className={`filter-btn ${calorieTarget === 'high' ? 'active' : ''}`}
                      onClick={() => setCalorieTarget('high')}
                    >
                      {'500+'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="recipes-grid">
            {filteredRecipes.map(recipe => (
              <div key={recipe.id} className="recipe-card">
                <div className="recipe-image">{recipe.image}</div>
                
                <div className="recipe-content">
                  <div className="recipe-header">
                    <h3>{i18n.language === 'ar' && recipe.nameAr ? recipe.nameAr : recipe.name}</h3>
                    <div className="recipe-rating">
                      <Star size={16} fill="gold" color="gold" />
                      <span>{recipe.rating}</span>
                    </div>
                  </div>

                  <div className="recipe-tags">
                    <span className="cuisine-tag">{recipe.cuisine}</span>
                    <span className="goal-tag">{recipe.goal}</span>
                  </div>

                  <div className="recipe-quick-info">
                    <div className="info-item">
                      <Clock size={14} />
                      <span>{recipe.prepTime}</span>
                    </div>
                    <div className="info-item">
                      <Users size={14} />
                      <span>{recipe.servings} {t('meredithShirk.common.servings')}</span>
                    </div>
                    <div className="info-item">
                      <Flame size={14} />
                      <span>{recipe.calories} {t('meredithShirk.common.kcal')}</span>
                    </div>
                    <div className={`difficulty-badge ${getDifficultyColor(recipe.difficulty)}`}>
                      {t(`meredithShirk.mealMeta.${recipe.difficulty.toLowerCase()}`)}
                    </div>
                  </div>

                  <button 
                    className="view-recipe-btn"
                    onClick={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
                  >
                    {expandedRecipe === recipe.id ? t('meredithShirk.common.hideRecipe') : t('meredithShirk.common.viewRecipe')}
                    {expandedRecipe === recipe.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {expandedRecipe === recipe.id && (
                    <div className="recipe-details">
                      <div className="ingredients-section">
                        <h4>
                          <ShoppingCart size={18} />
                          {t('meredithShirk.common.ingredients')}
                        </h4>
                        <ul>
                          {(i18n.language === 'ar' && recipe.ingredientsAr ? recipe.ingredientsAr : recipe.ingredients).map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="instructions-section">
                        <h4>{t('meredithShirk.common.instructions')}</h4>
                        <ol>
                          {(i18n.language === 'ar' && recipe.instructionsAr ? recipe.instructionsAr : recipe.instructions).map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ol>
                      </div>

                      <div className="nutrition-section">
                        <h4>{t('meredithShirk.common.nutrition')}</h4>
                        <div className="nutrition-grid">
                          <div className="nutrition-item">
                            <span className="label">{t('meredithShirk.common.protein')}</span>
                            <span className="value">{recipe.nutrition.protein}</span>
                          </div>
                          <div className="nutrition-item">
                            <span className="label">{t('meredithShirk.common.carbs')}</span>
                            <span className="value">{recipe.nutrition.carbs}</span>
                          </div>
                          <div className="nutrition-item">
                            <span className="label">{t('meredithShirk.common.fat')}</span>
                            <span className="value">{recipe.nutrition.fat}</span>
                          </div>
                          <div className="nutrition-item">
                            <span className="label">{t('meredithShirk.common.fiber')}</span>
                            <span className="value">{recipe.nutrition.fiber}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="no-results">
              <p>{t('meredithShirk.common.noRecipes')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MeredithShirkMealPlan
