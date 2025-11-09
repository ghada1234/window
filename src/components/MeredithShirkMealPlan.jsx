import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ChefHat, Clock, Users, Flame, BookOpen, Star, ChevronDown, ChevronUp, ShoppingCart, Filter, Search, TrendingUp, Target, Activity, User, Settings } from 'lucide-react'
import { getJSON } from '../utils/storage'
import { useNavigate } from 'react-router-dom'
import './MeredithShirkMealPlan.css'

const MeredithShirkMealPlan = () => {
  const { t } = useTranslation()
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

  const recipes = [
    // Breakfast - International
    {
      id: 1,
      name: 'Green Smoothie Bowl',
      category: 'breakfast',
      cuisine: 'american',
      goal: 'weightLoss',
      image: '🥤',
      prepTime: '5 min',
      servings: 2,
      calories: 150,
      difficulty: 'Easy',
      rating: 4.8,
      ingredients: ['1 cup spinach', '1 frozen banana', '1/2 cup almond milk', '1 tbsp chia seeds', '1/2 avocado', 'Fresh berries', 'Granola'],
      instructions: ['Blend spinach, banana, almond milk until smooth', 'Add avocado and chia seeds', 'Blend until creamy', 'Pour into bowl', 'Top with berries and granola', 'Serve immediately'],
      nutrition: { protein: '5g', carbs: '28g', fat: '3g', fiber: '6g' }
    },
    {
      id: 4,
      name: 'Protein Pancakes',
      category: 'breakfast',
      cuisine: 'american',
      goal: 'muscleGain',
      image: '🥞',
      prepTime: '15 min',
      servings: 2,
      calories: 280,
      difficulty: 'Easy',
      rating: 4.6,
      ingredients: ['1 cup oat flour', '1 scoop protein powder', '2 eggs', '1/2 cup milk', '1 banana mashed', '1 tsp baking powder', 'Honey', 'Berries for topping'],
      instructions: ['Mix dry ingredients', 'Whisk eggs, milk, and mashed banana', 'Combine wet and dry ingredients', 'Heat griddle with butter', 'Pour batter and cook until bubbles form', 'Flip and cook until golden', 'Serve with honey and berries'],
      nutrition: { protein: '24g', carbs: '32g', fat: '6g', fiber: '4g' }
    },
    {
      id: 9,
      name: 'Shakshuka',
      category: 'breakfast',
      cuisine: 'mediterranean',
      goal: 'health',
      image: '🍳',
      prepTime: '25 min',
      servings: 2,
      calories: 220,
      difficulty: 'Medium',
      rating: 4.9,
      ingredients: ['4 eggs', '2 tomatoes, diced', '1 bell pepper, diced', '1 onion, chopped', '2 cloves garlic', '1 tsp cumin', '1 tsp paprika', 'Fresh cilantro', 'Olive oil', 'Salt and pepper'],
      instructions: ['Heat oil in a pan', 'Sauté onion and bell pepper until soft', 'Add garlic, cumin, and paprika', 'Add tomatoes and simmer for 10 minutes', 'Make wells and crack eggs into them', 'Cover and cook until eggs are set', 'Garnish with cilantro and serve'],
      nutrition: { protein: '16g', carbs: '14g', fat: '12g', fiber: '4g' }
    },
    {
      id: 10,
      name: 'Japanese Tamago',
      category: 'breakfast',
      cuisine: 'asian',
      goal: 'maintenance',
      image: '🍱',
      prepTime: '15 min',
      servings: 2,
      calories: 180,
      difficulty: 'Medium',
      rating: 4.7,
      ingredients: ['4 eggs', '2 tbsp mirin', '1 tbsp soy sauce', '1 tsp sugar', 'Dashi stock', 'Oil for pan'],
      instructions: ['Beat eggs with mirin, soy sauce, sugar, and dashi', 'Heat a rectangular pan with oil', 'Pour thin layer of egg mixture', 'Roll when partially cooked', 'Repeat layers, rolling each time', 'Slice and serve'],
      nutrition: { protein: '14g', carbs: '8g', fat: '10g', fiber: '0g' }
    },
    // Lunch - International
    {
      id: 2,
      name: 'Grilled Chicken Salad',
      category: 'lunch',
      cuisine: 'mediterranean',
      goal: 'muscleGain',
      image: '🍗',
      prepTime: '30 min',
      servings: 4,
      calories: 320,
      difficulty: 'Medium',
      rating: 4.9,
      ingredients: ['400g chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Red onion', 'Feta cheese', 'Olive oil', 'Lemon juice', 'Herbs', 'Salt and pepper'],
      instructions: ['Season and grill chicken breast', 'Slice when cooked and rested', 'Chop all vegetables', 'Toss greens with olive oil and lemon', 'Arrange vegetables on greens', 'Top with sliced chicken', 'Crumble feta on top', 'Season to taste'],
      nutrition: { protein: '42g', carbs: '8g', fat: '12g', fiber: '2g' }
    },
    {
      id: 5,
      name: 'Quinoa Buddha Bowl',
      category: 'lunch',
      cuisine: 'mediterranean',
      goal: 'health',
      image: '🥙',
      prepTime: '20 min',
      servings: 2,
      calories: 420,
      difficulty: 'Medium',
      rating: 4.8,
      ingredients: ['1 cup quinoa', '1 can chickpeas', 'Sweet potato', 'Kale', 'Avocado', 'Tahini', 'Lemon', 'Olive oil', 'Cumin', 'Paprika'],
      instructions: ['Cook quinoa according to package', 'Roast sweet potato cubes', 'Roast chickpeas with spices', 'Massage kale with lemon', 'Assemble bowl with all ingredients', 'Make tahini dressing', 'Drizzle dressing over bowl', 'Top with avocado'],
      nutrition: { protein: '18g', carbs: '52g', fat: '14g', fiber: '8g' }
    },
    {
      id: 11,
      name: 'Chicken Pad Thai',
      category: 'lunch',
      cuisine: 'asian',
      goal: 'maintenance',
      image: '🍜',
      prepTime: '25 min',
      servings: 2,
      calories: 480,
      difficulty: 'Medium',
      rating: 4.8,
      ingredients: ['200g rice noodles', '200g chicken breast', '2 eggs', '3 tbsp fish sauce', '2 tbsp tamarind paste', '2 tbsp palm sugar', 'Bean sprouts', 'Peanuts', 'Lime wedges', 'Green onions'],
      instructions: ['Soak noodles in warm water', 'Cook chicken, set aside', 'Scramble eggs in wok', 'Add sauce ingredients', 'Add noodles and chicken', 'Toss with bean sprouts', 'Serve with peanuts and lime'],
      nutrition: { protein: '32g', carbs: '58g', fat: '14g', fiber: '4g' }
    },
    {
      id: 12,
      name: 'Chicken Burrito Bowl',
      category: 'lunch',
      cuisine: 'mexican',
      goal: 'muscleGain',
      image: '🌯',
      prepTime: '30 min',
      servings: 2,
      calories: 520,
      difficulty: 'Easy',
      rating: 4.7,
      ingredients: ['300g chicken breast', '1 cup brown rice', '1 can black beans', '1 cup corn', 'Salsa', 'Avocado', 'Lettuce', 'Cheese', 'Lime', 'Cilantro', 'Spices (cumin, paprika)'],
      instructions: ['Cook rice', 'Season and grill chicken', 'Heat black beans and corn', 'Slice chicken', 'Assemble bowl with all ingredients', 'Top with salsa and avocado', 'Garnish with lime and cilantro'],
      nutrition: { protein: '42g', carbs: '62g', fat: '16g', fiber: '12g' }
    },
    {
      id: 13,
      name: 'Italian Caprese Salad',
      category: 'lunch',
      cuisine: 'italian',
      goal: 'weightLoss',
      image: '🍅',
      prepTime: '10 min',
      servings: 2,
      calories: 280,
      difficulty: 'Easy',
      rating: 4.9,
      ingredients: ['4 tomatoes, sliced', '200g fresh mozzarella', 'Fresh basil leaves', '3 tbsp olive oil', 'Balsamic vinegar', 'Salt and pepper'],
      instructions: ['Slice tomatoes and mozzarella', 'Arrange alternating on plate', 'Tuck basil leaves between slices', 'Drizzle with olive oil', 'Add balsamic vinegar', 'Season with salt and pepper', 'Serve immediately'],
      nutrition: { protein: '16g', carbs: '12g', fat: '20g', fiber: '2g' }
    },
    // Dinner - International
    {
      id: 3,
      name: 'Baked Salmon with Asparagus',
      category: 'dinner',
      cuisine: 'mediterranean',
      goal: 'health',
      image: '🐟',
      prepTime: '25 min',
      servings: 2,
      calories: 380,
      difficulty: 'Easy',
      rating: 4.7,
      ingredients: ['2 salmon fillets', '1 bunch asparagus', '2 cloves garlic', 'Lemon', 'Olive oil', 'Dill', 'Salt and pepper', 'Cherry tomatoes'],
      instructions: ['Preheat oven to 400°F', 'Season salmon with salt, pepper, and dill', 'Trim asparagus', 'Arrange salmon and asparagus on baking sheet', 'Drizzle with olive oil and lemon juice', 'Add garlic and tomatoes', 'Bake for 15-18 minutes', 'Serve with lemon wedges'],
      nutrition: { protein: '40g', carbs: '5g', fat: '22g', fiber: '3g' }
    },
    {
      id: 6,
      name: 'Zucchini Noodles with Marinara',
      category: 'dinner',
      cuisine: 'italian',
      goal: 'weightLoss',
      image: '🍝',
      prepTime: '20 min',
      servings: 2,
      calories: 220,
      difficulty: 'Easy',
      rating: 4.5,
      ingredients: ['3 medium zucchini', '2 cups marinara sauce', '2 cloves garlic', 'Fresh basil', 'Parmesan cheese', 'Olive oil', 'Red pepper flakes', 'Salt'],
      instructions: ['Spiralize zucchini into noodles', 'Heat marinara sauce with garlic', 'Sauté zucchini noodles briefly', 'Combine with sauce', 'Top with fresh basil', 'Sprinkle parmesan', 'Add red pepper flakes', 'Serve immediately'],
      nutrition: { protein: '12g', carbs: '18g', fat: '10g', fiber: '5g' }
    },
    {
      id: 8,
      name: 'Turkey Meatballs with Vegetables',
      category: 'dinner',
      cuisine: 'american',
      goal: 'muscleGain',
      image: '🍖',
      prepTime: '35 min',
      servings: 4,
      calories: 290,
      difficulty: 'Medium',
      rating: 4.9,
      ingredients: ['500g ground turkey', '1 egg', 'Breadcrumbs', 'Garlic', 'Onion', 'Mixed vegetables', 'Tomato sauce', 'Italian herbs', 'Parmesan'],
      instructions: ['Mix turkey with egg, breadcrumbs, and herbs', 'Form into meatballs', 'Bake at 375°F for 20 minutes', 'Sauté vegetables', 'Heat tomato sauce', 'Combine meatballs with sauce', 'Serve with vegetables', 'Garnish with parmesan'],
      nutrition: { protein: '32g', carbs: '12g', fat: '14g', fiber: '3g' }
    },
    {
      id: 14,
      name: 'Beef Teriyaki Stir-Fry',
      category: 'dinner',
      cuisine: 'asian',
      goal: 'muscleGain',
      image: '🥩',
      prepTime: '20 min',
      servings: 2,
      calories: 450,
      difficulty: 'Medium',
      rating: 4.8,
      ingredients: ['300g beef strips', '2 cups mixed vegetables', '3 tbsp teriyaki sauce', '2 tbsp soy sauce', '1 tbsp honey', '2 cloves garlic', '1 tsp ginger', 'Sesame seeds', 'Rice for serving'],
      instructions: ['Marinate beef in teriyaki sauce', 'Heat wok on high', 'Stir-fry beef until browned', 'Remove beef, set aside', 'Stir-fry vegetables', 'Add beef back with sauce', 'Serve over rice with sesame seeds'],
      nutrition: { protein: '38g', carbs: '42g', fat: '16g', fiber: '4g' }
    },
    {
      id: 15,
      name: 'Chicken Enchiladas',
      category: 'dinner',
      cuisine: 'mexican',
      goal: 'maintenance',
      image: '🌮',
      prepTime: '40 min',
      servings: 4,
      calories: 420,
      difficulty: 'Medium',
      rating: 4.7,
      ingredients: ['400g chicken breast', '8 corn tortillas', '2 cups enchilada sauce', '2 cups cheese', '1 onion', '1 bell pepper', '1 can black beans', 'Sour cream', 'Cilantro'],
      instructions: ['Cook and shred chicken', 'Sauté onion and bell pepper', 'Mix chicken with beans and vegetables', 'Fill tortillas and roll', 'Place in baking dish', 'Cover with sauce and cheese', 'Bake at 375°F for 25 minutes', 'Top with sour cream and cilantro'],
      nutrition: { protein: '36g', carbs: '38g', fat: '18g', fiber: '8g' }
    },
    {
      id: 16,
      name: 'Lamb Tagine',
      category: 'dinner',
      cuisine: 'mediterranean',
      goal: 'health',
      image: '🍲',
      prepTime: '90 min',
      servings: 4,
      calories: 480,
      difficulty: 'Hard',
      rating: 4.9,
      ingredients: ['500g lamb shoulder', '2 onions', '3 cloves garlic', '2 carrots', '1 cup dried apricots', '1 tsp cinnamon', '1 tsp cumin', '1 tsp paprika', 'Chickpeas', 'Couscous for serving', 'Fresh herbs'],
      instructions: ['Brown lamb in tagine or pot', 'Add onions and garlic', 'Add spices and toast', 'Add vegetables and apricots', 'Cover with stock', 'Simmer for 1.5 hours', 'Add chickpeas', 'Serve over couscous'],
      nutrition: { protein: '42g', carbs: '48g', fat: '20g', fiber: '8g' }
    },
    // Snacks
    {
      id: 7,
      name: 'Chia Seed Pudding',
      category: 'snacks',
      cuisine: 'american',
      goal: 'health',
      image: '🍮',
      prepTime: '10 min + overnight',
      servings: 2,
      calories: 180,
      difficulty: 'Easy',
      rating: 4.7,
      ingredients: ['1/4 cup chia seeds', '1 cup almond milk', '1 tbsp maple syrup', '1/2 tsp vanilla extract', 'Fresh berries', 'Sliced almonds', 'Coconut flakes'],
      instructions: ['Mix chia seeds with almond milk', 'Add maple syrup and vanilla', 'Stir well and refrigerate overnight', 'Stir again in the morning', 'Top with fresh berries', 'Add almonds and coconut', 'Serve chilled'],
      nutrition: { protein: '6g', carbs: '22g', fat: '8g', fiber: '10g' }
    },
    {
      id: 17,
      name: 'Energy Balls',
      category: 'snacks',
      cuisine: 'american',
      goal: 'muscleGain',
      image: '🍫',
      prepTime: '15 min',
      servings: 12,
      calories: 120,
      difficulty: 'Easy',
      rating: 4.8,
      ingredients: ['1 cup oats', '1/2 cup almond butter', '1/3 cup honey', '1/4 cup protein powder', '1/4 cup dark chocolate chips', '2 tbsp chia seeds', '1 tsp vanilla extract'],
      instructions: ['Mix all ingredients in a bowl', 'Refrigerate for 30 minutes', 'Roll into 12 balls', 'Store in refrigerator', 'Enjoy as pre/post workout snack'],
      nutrition: { protein: '6g', carbs: '16g', fat: '6g', fiber: '3g' }
    },
    {
      id: 18,
      name: 'Hummus with Veggies',
      category: 'snacks',
      cuisine: 'mediterranean',
      goal: 'weightLoss',
      image: '🥕',
      prepTime: '10 min',
      servings: 4,
      calories: 140,
      difficulty: 'Easy',
      rating: 4.6,
      ingredients: ['1 can chickpeas', '3 tbsp tahini', '2 cloves garlic', 'Juice of 1 lemon', '2 tbsp olive oil', 'Cumin', 'Paprika', 'Carrot sticks', 'Cucumber slices', 'Bell pepper'],
      instructions: ['Blend chickpeas, tahini, garlic, lemon juice', 'Add olive oil slowly while blending', 'Season with cumin and salt', 'Transfer to bowl', 'Drizzle with olive oil and paprika', 'Cut vegetables into sticks', 'Serve hummus with veggie sticks'],
      nutrition: { protein: '6g', carbs: '18g', fat: '8g', fiber: '6g' }
    },
    {
      id: 19,
      name: 'Avocado Toast',
      category: 'breakfast',
      cuisine: 'american',
      goal: 'health',
      image: '🥑',
      prepTime: '5 min',
      servings: 1,
      calories: 250,
      difficulty: 'Easy',
      rating: 4.7,
      ingredients: ['2 slices whole grain bread', '1 ripe avocado', '1 egg (optional)', 'Cherry tomatoes', 'Red pepper flakes', 'Lemon juice', 'Salt and pepper', 'Olive oil'],
      instructions: ['Toast bread until golden', 'Mash avocado with lemon juice and salt', 'Spread avocado on toast', 'Top with sliced tomatoes', 'Fry egg if desired', 'Sprinkle with pepper flakes', 'Drizzle with olive oil'],
      nutrition: { protein: '12g', carbs: '28g', fat: '16g', fiber: '10g' }
    },
    {
      id: 20,
      name: 'Greek Yogurt Parfait',
      category: 'breakfast',
      cuisine: 'mediterranean',
      goal: 'muscleGain',
      image: '🥛',
      prepTime: '5 min',
      servings: 1,
      calories: 280,
      difficulty: 'Easy',
      rating: 4.8,
      ingredients: ['1 cup Greek yogurt', '1/2 cup granola', '1/2 cup mixed berries', '2 tbsp honey', '1 tbsp chia seeds', '1 tbsp almonds', 'Fresh mint'],
      instructions: ['Layer yogurt in glass', 'Add granola layer', 'Add berries', 'Repeat layers', 'Drizzle with honey', 'Top with chia seeds and almonds', 'Garnish with mint'],
      nutrition: { protein: '22g', carbs: '42g', fat: '6g', fiber: '6g' }
    },
    {
      id: 21,
      name: 'Salmon Poke Bowl',
      category: 'lunch',
      cuisine: 'asian',
      goal: 'muscleGain',
      image: '🍚',
      prepTime: '20 min',
      servings: 2,
      calories: 450,
      difficulty: 'Medium',
      rating: 4.9,
      ingredients: ['300g fresh salmon', '2 cups sushi rice', '1 avocado', '1 cucumber', 'Edamame', 'Seaweed', 'Soy sauce', 'Sesame oil', 'Sriracha mayo', 'Sesame seeds'],
      instructions: ['Cook sushi rice and cool', 'Cube salmon and marinate in soy sauce', 'Slice cucumber and avocado', 'Arrange rice in bowls', 'Top with salmon, vegetables, and edamame', 'Drizzle with sesame oil and sriracha mayo', 'Sprinkle with sesame seeds'],
      nutrition: { protein: '32g', carbs: '48g', fat: '18g', fiber: '8g' }
    },
    {
      id: 22,
      name: 'Veggie Stir-Fry',
      category: 'dinner',
      cuisine: 'asian',
      goal: 'weightLoss',
      image: '🥦',
      prepTime: '20 min',
      servings: 3,
      calories: 220,
      difficulty: 'Easy',
      rating: 4.6,
      ingredients: ['2 cups broccoli', '1 bell pepper', '1 cup snap peas', '1 carrot', '200g mushrooms', '3 cloves garlic', 'Ginger', 'Soy sauce', 'Sesame oil', 'Brown rice'],
      instructions: ['Heat wok with sesame oil', 'Stir-fry garlic and ginger', 'Add firm vegetables first', 'Add softer vegetables', 'Season with soy sauce', 'Toss until tender-crisp', 'Serve over brown rice'],
      nutrition: { protein: '10g', carbs: '32g', fat: '6g', fiber: '8g' }
    },
    {
      id: 23,
      name: 'Turkey Meatballs',
      category: 'dinner',
      cuisine: 'italian',
      goal: 'muscleGain',
      image: '🍝',
      prepTime: '35 min',
      servings: 4,
      calories: 380,
      difficulty: 'Medium',
      rating: 4.8,
      ingredients: ['500g ground turkey', '1 egg', '1/2 cup breadcrumbs', '2 cloves garlic', 'Fresh parsley', 'Parmesan cheese', 'Marinara sauce', 'Zucchini noodles', 'Italian seasoning'],
      instructions: ['Mix turkey, egg, breadcrumbs, garlic, and herbs', 'Form into meatballs', 'Bake at 400°F for 20 minutes', 'Prepare zucchini noodles', 'Heat marinara sauce', 'Add meatballs to sauce', 'Serve over zucchini noodles'],
      nutrition: { protein: '38g', carbs: '28g', fat: '14g', fiber: '6g' }
    },
    {
      id: 24,
      name: 'Protein Smoothie Bowl',
      category: 'breakfast',
      cuisine: 'american',
      goal: 'muscleGain',
      image: '🥣',
      prepTime: '10 min',
      servings: 1,
      calories: 350,
      difficulty: 'Easy',
      rating: 4.9,
      ingredients: ['1 frozen banana', '1 cup frozen berries', '1 scoop protein powder', '1/2 cup almond milk', 'Granola', 'Fresh berries', 'Coconut flakes', 'Almond butter', 'Chia seeds'],
      instructions: ['Blend banana, berries, protein powder, and milk', 'Pour into bowl', 'Top with granola', 'Add fresh berries', 'Sprinkle coconut flakes', 'Drizzle almond butter', 'Add chia seeds'],
      nutrition: { protein: '28g', carbs: '42g', fat: '10g', fiber: '8g' }
    },
    {
      id: 25,
      name: 'Chicken Caesar Wrap',
      category: 'lunch',
      cuisine: 'american',
      goal: 'maintenance',
      image: '🌯',
      prepTime: '15 min',
      servings: 2,
      calories: 380,
      difficulty: 'Easy',
      rating: 4.7,
      ingredients: ['2 large tortillas', '300g grilled chicken', 'Romaine lettuce', 'Parmesan cheese', 'Caesar dressing', 'Cherry tomatoes', 'Croutons'],
      instructions: ['Grill and slice chicken', 'Chop romaine lettuce', 'Warm tortillas', 'Layer lettuce on tortilla', 'Add chicken slices', 'Drizzle with Caesar dressing', 'Add parmesan and croutons', 'Roll tightly and slice'],
      nutrition: { protein: '32g', carbs: '36g', fat: '14g', fiber: '4g' }
    },
    {
      id: 26,
      name: 'Sweet Potato Buddha Bowl',
      category: 'lunch',
      cuisine: 'american',
      goal: 'health',
      image: '🍠',
      prepTime: '35 min',
      servings: 2,
      calories: 420,
      difficulty: 'Medium',
      rating: 4.9,
      ingredients: ['2 sweet potatoes', '1 cup chickpeas', '2 cups kale', '1 avocado', '1/4 cup tahini', 'Lemon juice', 'Quinoa', 'Pumpkin seeds', 'Olive oil', 'Spices'],
      instructions: ['Cube and roast sweet potatoes', 'Roast chickpeas with spices', 'Cook quinoa', 'Massage kale with lemon', 'Arrange all in bowl', 'Make tahini dressing', 'Drizzle dressing', 'Top with seeds and avocado'],
      nutrition: { protein: '16g', carbs: '62g', fat: '16g', fiber: '14g' }
    },
    // Additional International Recipes
    {
      id: 27,
      name: 'Greek Moussaka (Lightened)',
      category: 'dinner',
      cuisine: 'mediterranean',
      goal: 'maintenance',
      image: '🇬🇷',
      prepTime: '60 min',
      servings: 6,
      calories: 380,
      difficulty: 'Hard',
      rating: 4.9,
      ingredients: ['2 eggplants', '400g lean ground beef', '2 tomatoes', '1 onion', 'Garlic', 'Cinnamon', 'Greek yogurt', 'Egg whites', 'Parmesan', 'Olive oil', 'Oregano'],
      instructions: ['Slice and grill eggplant', 'Cook ground beef with onions and spices', 'Add tomatoes and simmer', 'Make lighter yogurt-based béchamel', 'Layer eggplant and meat sauce', 'Top with béchamel', 'Bake at 350°F for 40 minutes', 'Rest before serving'],
      nutrition: { protein: '28g', carbs: '32g', fat: '16g', fiber: '8g' }
    },
    {
      id: 28,
      name: 'Thai Green Curry with Chicken',
      category: 'dinner',
      cuisine: 'asian',
      goal: 'maintenance',
      image: '🍛',
      prepTime: '35 min',
      servings: 4,
      calories: 420,
      difficulty: 'Medium',
      rating: 4.8,
      ingredients: ['400g chicken breast', '2 tbsp green curry paste', '400ml light coconut milk', 'Bamboo shoots', 'Bell peppers', 'Thai basil', 'Fish sauce', 'Lime', 'Brown rice'],
      instructions: ['Cube chicken and cook until white', 'Add curry paste and toast', 'Pour in coconut milk', 'Add vegetables', 'Simmer for 15 minutes', 'Season with fish sauce and lime', 'Add Thai basil', 'Serve over brown rice'],
      nutrition: { protein: '32g', carbs: '38g', fat: '16g', fiber: '6g' }
    },
    {
      id: 29,
      name: 'Indian Chickpea Curry (Chana Masala)',
      category: 'lunch',
      cuisine: 'asian',
      goal: 'weightLoss',
      image: '🇮🇳',
      prepTime: '30 min',
      servings: 4,
      calories: 280,
      difficulty: 'Easy',
      rating: 4.7,
      ingredients: ['2 cans chickpeas', '2 tomatoes', '1 onion', 'Ginger', 'Garlic', 'Garam masala', 'Turmeric', 'Cumin', 'Coriander', 'Spinach', 'Cilantro'],
      instructions: ['Sauté onions until golden', 'Add ginger, garlic, and spices', 'Add tomatoes and cook down', 'Add chickpeas and water', 'Simmer for 15 minutes', 'Stir in spinach', 'Garnish with cilantro', 'Serve with cauliflower rice'],
      nutrition: { protein: '14g', carbs: '42g', fat: '6g', fiber: '12g' }
    },
    {
      id: 30,
      name: 'Japanese Miso Soup with Tofu',
      category: 'snacks',
      cuisine: 'asian',
      goal: 'health',
      image: '🍵',
      prepTime: '15 min',
      servings: 4,
      calories: 80,
      difficulty: 'Easy',
      rating: 4.6,
      ingredients: ['4 cups dashi stock', '3 tbsp miso paste', '200g silken tofu', 'Wakame seaweed', 'Green onions', 'Mushrooms'],
      instructions: ['Heat dashi stock', 'Add sliced mushrooms', 'Cube tofu and add to pot', 'Remove from heat', 'Whisk in miso paste', 'Add rehydrated wakame', 'Garnish with green onions', 'Serve hot'],
      nutrition: { protein: '6g', carbs: '8g', fat: '3g', fiber: '2g' }
    },
    {
      id: 31,
      name: 'Korean Bibimbap Bowl',
      category: 'lunch',
      cuisine: 'asian',
      goal: 'maintenance',
      image: '🍚',
      prepTime: '40 min',
      servings: 2,
      calories: 480,
      difficulty: 'Medium',
      rating: 4.9,
      ingredients: ['Brown rice', '200g beef', 'Spinach', 'Bean sprouts', 'Carrots', 'Zucchini', 'Mushrooms', 'Egg', 'Gochujang sauce', 'Sesame oil', 'Sesame seeds'],
      instructions: ['Cook brown rice', 'Marinate and cook beef strips', 'Blanch spinach and bean sprouts separately', 'Sauté carrots, zucchini, and mushrooms', 'Fry egg sunny-side up', 'Arrange all on rice in sections', 'Top with egg', 'Serve with gochujang and sesame seeds'],
      nutrition: { protein: '28g', carbs: '58g', fat: '16g', fiber: '8g' }
    },
    {
      id: 32,
      name: 'Lebanese Fattoush Salad',
      category: 'lunch',
      cuisine: 'mediterranean',
      goal: 'weightLoss',
      image: '🥗',
      prepTime: '20 min',
      servings: 4,
      calories: 220,
      difficulty: 'Easy',
      rating: 4.7,
      ingredients: ['Romaine lettuce', 'Tomatoes', 'Cucumbers', 'Radishes', 'Mint', 'Parsley', 'Sumac', 'Pita bread', 'Lemon juice', 'Olive oil', 'Garlic'],
      instructions: ['Chop all vegetables', 'Toast pita and break into pieces', 'Mix lemon, olive oil, garlic, and sumac', 'Toss vegetables with herbs', 'Add pita pieces', 'Drizzle with dressing', 'Toss and serve immediately'],
      nutrition: { protein: '6g', carbs: '28g', fat: '10g', fiber: '6g' }
    },
    {
      id: 33,
      name: 'Moroccan Lentil Soup (Harira)',
      category: 'dinner',
      cuisine: 'mediterranean',
      goal: 'health',
      image: '🥘',
      prepTime: '50 min',
      servings: 6,
      calories: 280,
      difficulty: 'Medium',
      rating: 4.8,
      ingredients: ['1 cup lentils', '1 can chickpeas', 'Tomatoes', 'Onion', 'Celery', 'Cilantro', 'Parsley', 'Ginger', 'Turmeric', 'Cinnamon', 'Lemon', 'Vegetable broth'],
      instructions: ['Sauté onions and celery', 'Add spices and toast', 'Add lentils, chickpeas, and tomatoes', 'Pour in broth and simmer 35 minutes', 'Add fresh herbs', 'Blend partially for thickness', 'Season with lemon juice', 'Serve with dates'],
      nutrition: { protein: '16g', carbs: '44g', fat: '4g', fiber: '14g' }
    },
    {
      id: 34,
      name: 'Vietnamese Pho Bowl (Lightened)',
      category: 'lunch',
      cuisine: 'asian',
      goal: 'weightLoss',
      image: '🍜',
      prepTime: '90 min',
      servings: 4,
      calories: 320,
      difficulty: 'Hard',
      rating: 4.9,
      ingredients: ['Beef bones', '200g lean beef', 'Rice noodles', 'Star anise', 'Cinnamon', 'Ginger', 'Onion', 'Bean sprouts', 'Thai basil', 'Lime', 'Sriracha', 'Hoisin sauce'],
      instructions: ['Simmer beef bones with spices for 1 hour', 'Strain broth', 'Slice beef thinly', 'Cook rice noodles', 'Heat broth to boiling', 'Place noodles in bowl', 'Add raw beef slices', 'Pour hot broth over', 'Top with herbs and lime'],
      nutrition: { protein: '24g', carbs: '38g', fat: '8g', fiber: '4g' }
    },
    {
      id: 35,
      name: 'Spanish Gazpacho',
      category: 'snacks',
      cuisine: 'mediterranean',
      goal: 'weightLoss',
      image: '🍅',
      prepTime: '15 min + chill',
      servings: 4,
      calories: 120,
      difficulty: 'Easy',
      rating: 4.6,
      ingredients: ['6 ripe tomatoes', '1 cucumber', '1 bell pepper', '1 small onion', '2 cloves garlic', 'Olive oil', 'Red wine vinegar', 'Cumin', 'Salt', 'Bread cubes'],
      instructions: ['Roughly chop all vegetables', 'Blend with garlic, oil, and vinegar', 'Season with cumin and salt', 'Chill for at least 2 hours', 'Serve cold', 'Garnish with diced vegetables', 'Top with toasted bread cubes'],
      nutrition: { protein: '4g', carbs: '18g', fat: '6g', fiber: '4g' }
    },
    {
      id: 36,
      name: 'Turkish Breakfast Bowl',
      category: 'breakfast',
      cuisine: 'mediterranean',
      goal: 'maintenance',
      image: '🇹🇷',
      prepTime: '15 min',
      servings: 2,
      calories: 340,
      difficulty: 'Easy',
      rating: 4.7,
      ingredients: ['2 eggs', 'Feta cheese', 'Tomatoes', 'Cucumbers', 'Olives', 'Whole grain bread', 'Honey', 'Walnuts', 'Mint', 'Olive oil'],
      instructions: ['Boil or fry eggs', 'Slice tomatoes and cucumbers', 'Arrange vegetables on plate', 'Crumble feta cheese', 'Add olives and walnuts', 'Drizzle honey on bread', 'Add fresh mint', 'Serve with tea'],
      nutrition: { protein: '18g', carbs: '32g', fat: '16g', fiber: '6g' }
    },
    {
      id: 37,
      name: 'Brazilian Açaí Bowl',
      category: 'breakfast',
      cuisine: 'american',
      goal: 'health',
      image: '🇧🇷',
      prepTime: '10 min',
      servings: 2,
      calories: 320,
      difficulty: 'Easy',
      rating: 4.9,
      ingredients: ['2 packs frozen açaí', '1 banana', '1/2 cup blueberries', 'Almond milk', 'Granola', 'Coconut flakes', 'Fresh berries', 'Honey', 'Chia seeds'],
      instructions: ['Blend açaí, banana, and almond milk', 'Pour into bowl', 'Top with granola', 'Add fresh berries', 'Sprinkle coconut and chia', 'Drizzle with honey', 'Serve immediately'],
      nutrition: { protein: '8g', carbs: '54g', fat: '12g', fiber: '10g' }
    },
    {
      id: 38,
      name: 'Ethiopian Lentil Stew (Misir Wot)',
      category: 'dinner',
      cuisine: 'mediterranean',
      goal: 'weightLoss',
      image: '🇪🇹',
      prepTime: '40 min',
      servings: 4,
      calories: 260,
      difficulty: 'Medium',
      rating: 4.8,
      ingredients: ['2 cups red lentils', '1 onion', '3 cloves garlic', 'Ginger', 'Berbere spice', 'Tomato paste', 'Vegetable broth', 'Olive oil', 'Lemon juice'],
      instructions: ['Sauté onions until caramelized', 'Add garlic and ginger', 'Stir in berbere and tomato paste', 'Add lentils and broth', 'Simmer for 25 minutes', 'Season with lemon juice', 'Serve over injera or cauliflower rice'],
      nutrition: { protein: '18g', carbs: '42g', fat: '4g', fiber: '16g' }
    },
    {
      id: 39,
      name: 'Peruvian Ceviche',
      category: 'lunch',
      cuisine: 'american',
      goal: 'weightLoss',
      image: '🇵🇪',
      prepTime: '20 min + marinate',
      servings: 3,
      calories: 180,
      difficulty: 'Medium',
      rating: 4.9,
      ingredients: ['400g fresh white fish', 'Lime juice', 'Red onion', 'Cilantro', 'Jalapeño', 'Sweet potato', 'Corn', 'Garlic', 'Salt', 'Pepper'],
      instructions: ['Cube fresh fish into small pieces', 'Mix with lime juice and salt', 'Marinate for 15 minutes', 'Dice red onion and jalapeño', 'Add onions, cilantro, and pepper', 'Boil sweet potato and corn', 'Serve ceviche with vegetables', 'Garnish with cilantro'],
      nutrition: { protein: '28g', carbs: '12g', fat: '4g', fiber: '2g' }
    },
    {
      id: 40,
      name: 'Chinese Steamed Fish with Ginger',
      category: 'dinner',
      cuisine: 'asian',
      goal: 'health',
      image: '🐟',
      prepTime: '25 min',
      servings: 2,
      calories: 240,
      difficulty: 'Medium',
      rating: 4.8,
      ingredients: ['2 white fish fillets', 'Fresh ginger', 'Green onions', 'Soy sauce', 'Sesame oil', 'Cilantro', 'Bok choy', 'Garlic'],
      instructions: ['Slice ginger and green onions', 'Place fish on steaming plate', 'Top with ginger slices', 'Steam for 12-15 minutes', 'Heat soy sauce with sesame oil', 'Remove fish and top with green onions', 'Pour hot sauce over fish', 'Serve with steamed bok choy'],
      nutrition: { protein: '32g', carbs: '6g', fat: '8g', fiber: '2g' }
    }
  ]

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
              <h3>Your Personalized Nutrition Goals</h3>
              <p>Based on your profile: {userProfile.age}y, {userProfile.weight}kg, {userProfile.height}cm, {userProfile.activityLevel}</p>
            </div>
          </div>
          <div className="nutrition-stats">
            <div className="stat-card primary">
              <Flame size={28} />
              <div>
                <span className="stat-value">{calculateCalories.calories}</span>
                <span className="stat-label">Daily Calories</span>
              </div>
            </div>
            <div className="stat-card">
              <Target size={24} />
              <div>
                <span className="stat-value">{calculateCalories.protein}g</span>
                <span className="stat-label">Protein</span>
              </div>
            </div>
            <div className="stat-card">
              <Activity size={24} />
              <div>
                <span className="stat-value">{calculateCalories.carbs}g</span>
                <span className="stat-label">Carbs</span>
              </div>
            </div>
            <div className="stat-card">
              <TrendingUp size={24} />
              <div>
                <span className="stat-value">{calculateCalories.fat}g</span>
                <span className="stat-label">Fats</span>
              </div>
            </div>
          </div>
          <p className="banner-note">
            💡 Tip: Meal plans are filtered to match your {calculateCalories.calories} calorie goal
          </p>
        </div>
      ) : (
        <div className="profile-nutrition-banner incomplete">
          <div className="banner-header">
            <Settings size={24} />
            <div>
              <h3>Complete Your Profile for Personalized Meal Plans</h3>
              <p>Set your age, weight, height, activity level, and goal to get customized recommendations</p>
            </div>
          </div>
          <button className="setup-profile-btn" onClick={() => navigate('/profile/personal-info')}>
            <User size={20} />
            Complete Profile Setup
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
                    <h3>{recipe.name}</h3>
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
                      {recipe.difficulty}
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
                          {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="instructions-section">
                        <h4>{t('meredithShirk.common.instructions')}</h4>
                        <ol>
                          {recipe.instructions.map((instruction, index) => (
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
