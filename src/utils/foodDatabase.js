// Comprehensive Food Database with Nutritional Information
// All values are approximate and based on standard serving sizes

export const foodDatabase = {
  // ========== PROTEINS ==========
  
  // Poultry
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, serving: '100g' },
  'grilled chicken breast': { calories: 231, protein: 43.5, carbs: 0, fat: 5, fiber: 0, sugar: 0, serving: '100g' },
  'chicken thigh': { calories: 209, protein: 26, carbs: 0, fat: 11, fiber: 0, sugar: 0, serving: '100g' },
  'turkey breast': { calories: 135, protein: 30, carbs: 0, fat: 1, fiber: 0, sugar: 0, serving: '100g' },
  'ground turkey': { calories: 203, protein: 27, carbs: 0, fat: 10, fiber: 0, sugar: 0, serving: '100g' },
  'duck': { calories: 337, protein: 19, carbs: 0, fat: 28, fiber: 0, sugar: 0, serving: '100g' },
  
  // Beef
  'lean ground beef': { calories: 250, protein: 26, carbs: 0, fat: 17, fiber: 0, sugar: 0, serving: '100g' },
  'beef steak': { calories: 271, protein: 25, carbs: 0, fat: 18, fiber: 0, sugar: 0, serving: '100g' },
  'sirloin steak': { calories: 202, protein: 23, carbs: 0, fat: 11, fiber: 0, sugar: 0, serving: '100g' },
  'ribeye steak': { calories: 291, protein: 23, carbs: 0, fat: 22, fiber: 0, sugar: 0, serving: '100g' },
  'ground beef': { calories: 332, protein: 14, carbs: 0, fat: 30, fiber: 0, sugar: 0, serving: '100g' },
  
  // Pork
  'pork chop': { calories: 242, protein: 28, carbs: 0, fat: 14, fiber: 0, sugar: 0, serving: '100g' },
  'bacon': { calories: 541, protein: 37, carbs: 1.4, fat: 42, fiber: 0, sugar: 1.4, serving: '100g' },
  'ham': { calories: 145, protein: 21, carbs: 1.5, fat: 5.5, fiber: 0, sugar: 1.5, serving: '100g' },
  'pork tenderloin': { calories: 143, protein: 26, carbs: 0, fat: 3.5, fiber: 0, sugar: 0, serving: '100g' },
  
  // Fish & Seafood
  'salmon': { calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0, sugar: 0, serving: '100g' },
  'grilled salmon': { calories: 232, protein: 25, carbs: 0, fat: 14, fiber: 0, sugar: 0, serving: '100g' },
  'tuna': { calories: 144, protein: 30, carbs: 0, fat: 1, fiber: 0, sugar: 0, serving: '100g' },
  'canned tuna': { calories: 116, protein: 26, carbs: 0, fat: 0.8, fiber: 0, sugar: 0, serving: '100g' },
  'cod': { calories: 82, protein: 18, carbs: 0, fat: 0.7, fiber: 0, sugar: 0, serving: '100g' },
  'tilapia': { calories: 96, protein: 20, carbs: 0, fat: 1.7, fiber: 0, sugar: 0, serving: '100g' },
  'shrimp': { calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, sugar: 0, serving: '100g' },
  'crab': { calories: 97, protein: 20, carbs: 0, fat: 1.5, fiber: 0, sugar: 0, serving: '100g' },
  'lobster': { calories: 89, protein: 19, carbs: 0, fat: 0.9, fiber: 0, sugar: 0, serving: '100g' },
  'mackerel': { calories: 205, protein: 19, carbs: 0, fat: 14, fiber: 0, sugar: 0, serving: '100g' },
  'sardines': { calories: 208, protein: 25, carbs: 0, fat: 11, fiber: 0, sugar: 0, serving: '100g' },
  
  // Eggs & Dairy Proteins
  'eggs': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 0.6, serving: '2 large' },
  'egg white': { calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0, sugar: 0.7, serving: '100g' },
  'boiled egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, serving: '1 large' },
  'scrambled eggs': { calories: 204, protein: 14, carbs: 3, fat: 15, fiber: 0, sugar: 2, serving: '2 eggs' },
  'omelet': { calories: 154, protein: 11, carbs: 2, fat: 12, fiber: 0, sugar: 1, serving: '2 eggs' },
  
  // Plant-Based Proteins
  'tofu': { calories: 144, protein: 15.6, carbs: 3.4, fat: 8.7, fiber: 2.3, sugar: 0.5, serving: '100g' },
  'tempeh': { calories: 193, protein: 20, carbs: 9, fat: 11, fiber: 0, sugar: 0, serving: '100g' },
  'edamame': { calories: 122, protein: 11, carbs: 10, fat: 5, fiber: 5, sugar: 2, serving: '100g' },
  'lentils': { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8, sugar: 1.8, serving: '100g cooked' },
  'chickpeas': { calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6, sugar: 4.8, serving: '100g cooked' },
  'black beans': { calories: 132, protein: 8.9, carbs: 24, fat: 0.5, fiber: 8.7, sugar: 0.3, serving: '100g cooked' },
  'kidney beans': { calories: 127, protein: 8.7, carbs: 23, fat: 0.5, fiber: 6.4, sugar: 0.3, serving: '100g cooked' },
  
  // ========== GRAINS & CARBS ==========
  
  'quinoa': { calories: 222, protein: 8.1, carbs: 39.4, fat: 3.6, fiber: 5.2, sugar: 0.9, serving: '1 cup cooked' },
  'brown rice': { calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0.4, serving: '1 cup cooked' },
  'white rice': { calories: 205, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, sugar: 0.1, serving: '1 cup cooked' },
  'basmati rice': { calories: 191, protein: 4, carbs: 43, fat: 0.5, fiber: 0.7, sugar: 0, serving: '1 cup cooked' },
  'jasmine rice': { calories: 180, protein: 3.8, carbs: 39, fat: 0.3, fiber: 1.4, sugar: 0, serving: '1 cup cooked' },
  'wild rice': { calories: 166, protein: 6.5, carbs: 35, fat: 0.6, fiber: 3, sugar: 1.2, serving: '1 cup cooked' },
  'oatmeal': { calories: 154, protein: 5.3, carbs: 27, fat: 2.4, fiber: 4, sugar: 0.8, serving: '1 cup cooked' },
  'oats': { calories: 389, protein: 17, carbs: 66, fat: 6.9, fiber: 11, sugar: 0, serving: '100g dry' },
  
  // Bread & Baked Goods
  'whole wheat bread': { calories: 81, protein: 4, carbs: 13.8, fat: 1.3, fiber: 2, sugar: 1.3, serving: '1 slice' },
  'white bread': { calories: 75, protein: 2.7, carbs: 14, fat: 1, fiber: 0.8, sugar: 1.5, serving: '1 slice' },
  'sourdough bread': { calories: 93, protein: 3.8, carbs: 18, fat: 0.6, fiber: 1.7, sugar: 1.9, serving: '1 slice' },
  'pita bread': { calories: 165, protein: 5.5, carbs: 33, fat: 0.7, fiber: 1.3, sugar: 0.6, serving: '1 medium' },
  'bagel': { calories: 289, protein: 11, carbs: 56, fat: 2.1, fiber: 2.3, sugar: 5, serving: '1 medium' },
  'croissant': { calories: 406, protein: 8.2, carbs: 45, fat: 21, fiber: 2.6, sugar: 10, serving: '1 medium' },
  'tortilla': { calories: 104, protein: 3, carbs: 18, fat: 2.3, fiber: 1.2, sugar: 0.7, serving: '1 medium' },
  
  // Pasta & Noodles
  'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sugar: 0.6, serving: '100g cooked' },
  'whole wheat pasta': { calories: 124, protein: 5, carbs: 26, fat: 0.5, fiber: 3.7, sugar: 0.6, serving: '100g cooked' },
  'spaghetti': { calories: 158, protein: 5.8, carbs: 31, fat: 0.9, fiber: 1.8, sugar: 0.6, serving: '100g cooked' },
  'penne': { calories: 157, protein: 5.5, carbs: 31, fat: 0.9, fiber: 1.6, sugar: 0.6, serving: '100g cooked' },
  'ramen noodles': { calories: 188, protein: 4.5, carbs: 27, fat: 7, fiber: 1.8, sugar: 0.6, serving: '100g cooked' },
  'rice noodles': { calories: 192, protein: 1.6, carbs: 44, fat: 0.4, fiber: 1.8, sugar: 0.2, serving: '100g cooked' },
  
  // Other Grains
  'couscous': { calories: 112, protein: 3.8, carbs: 23, fat: 0.2, fiber: 1.4, sugar: 0.1, serving: '100g cooked' },
  'bulgur': { calories: 83, protein: 3, carbs: 19, fat: 0.2, fiber: 4.5, sugar: 0.1, serving: '100g cooked' },
  'barley': { calories: 123, protein: 2.3, carbs: 28, fat: 0.4, fiber: 3.5, sugar: 0.4, serving: '100g cooked' },
  'millet': { calories: 119, protein: 3.5, carbs: 24, fat: 1, fiber: 1.3, sugar: 0.2, serving: '100g cooked' },
  
  // ========== FRUITS ==========
  
  'banana': { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14.4, serving: '1 medium' },
  'apple': { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, serving: '1 medium' },
  'orange': { calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, fiber: 3.1, sugar: 12.2, serving: '1 medium' },
  'strawberries': { calories: 49, protein: 1, carbs: 12, fat: 0.5, fiber: 3, sugar: 7, serving: '1 cup' },
  'blueberries': { calories: 84, protein: 1.1, carbs: 21, fat: 0.5, fiber: 3.6, sugar: 15, serving: '1 cup' },
  'raspberries': { calories: 64, protein: 1.5, carbs: 15, fat: 0.8, fiber: 8, sugar: 5, serving: '1 cup' },
  'blackberries': { calories: 62, protein: 2, carbs: 14, fat: 0.7, fiber: 7.6, sugar: 7, serving: '1 cup' },
  'avocado': { calories: 234, protein: 3, carbs: 12, fat: 21, fiber: 10, sugar: 0.7, serving: '1 medium' },
  'grapes': { calories: 62, protein: 0.6, carbs: 16, fat: 0.2, fiber: 1, sugar: 16, serving: '1 cup' },
  'watermelon': { calories: 46, protein: 0.9, carbs: 11, fat: 0.2, fiber: 0.6, sugar: 9, serving: '1 cup diced' },
  'mango': { calories: 99, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6, sugar: 23, serving: '1 cup sliced' },
  'pineapple': { calories: 82, protein: 0.9, carbs: 22, fat: 0.2, fiber: 2.3, sugar: 16, serving: '1 cup chunks' },
  'peach': { calories: 59, protein: 1.4, carbs: 14, fat: 0.4, fiber: 2.3, sugar: 13, serving: '1 medium' },
  'pear': { calories: 101, protein: 0.6, carbs: 27, fat: 0.3, fiber: 5.5, sugar: 17, serving: '1 medium' },
  'plum': { calories: 46, protein: 0.7, carbs: 11, fat: 0.3, fiber: 1.4, sugar: 10, serving: '1 medium' },
  'cherry': { calories: 87, protein: 1.5, carbs: 22, fat: 0.3, fiber: 2.9, sugar: 18, serving: '1 cup' },
  'kiwi': { calories: 61, protein: 1.2, carbs: 15, fat: 0.5, fiber: 3, sugar: 9, serving: '1 medium' },
  'grapefruit': { calories: 52, protein: 0.9, carbs: 13, fat: 0.2, fiber: 2, sugar: 9, serving: '1/2 medium' },
  'cantaloupe': { calories: 53, protein: 1.3, carbs: 13, fat: 0.3, fiber: 1.4, sugar: 12, serving: '1 cup diced' },
  'papaya': { calories: 59, protein: 0.7, carbs: 15, fat: 0.2, fiber: 2.5, sugar: 11, serving: '1 cup cubed' },
  'pomegranate': { calories: 144, protein: 2.9, carbs: 33, fat: 2, fiber: 7, sugar: 24, serving: '1 medium' },
  
  // ========== VEGETABLES ==========
  
  'broccoli': { calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5, sugar: 2.6, serving: '1 cup' },
  'spinach': { calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, sugar: 0.1, serving: '1 cup raw' },
  'kale': { calories: 33, protein: 2.9, carbs: 6, fat: 0.6, fiber: 2.6, sugar: 0.8, serving: '1 cup chopped' },
  'carrots': { calories: 50, protein: 1, carbs: 12, fat: 0.2, fiber: 3.4, sugar: 5, serving: '1 cup chopped' },
  'sweet potato': { calories: 180, protein: 4, carbs: 41, fat: 0.3, fiber: 6.6, sugar: 13, serving: '1 medium' },
  'potato': { calories: 163, protein: 4.3, carbs: 37, fat: 0.2, fiber: 4.7, sugar: 1.9, serving: '1 medium' },
  'tomatoes': { calories: 32, protein: 1.6, carbs: 7, fat: 0.4, fiber: 2.2, sugar: 4.7, serving: '1 cup chopped' },
  'cucumber': { calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, sugar: 1.7, serving: '1 cup sliced' },
  'bell pepper': { calories: 46, protein: 1.5, carbs: 11, fat: 0.4, fiber: 3.1, sugar: 7, serving: '1 cup chopped' },
  'onion': { calories: 64, protein: 1.8, carbs: 15, fat: 0.2, fiber: 2.7, sugar: 7, serving: '1 cup chopped' },
  'garlic': { calories: 4, protein: 0.2, carbs: 1, fat: 0, fiber: 0.1, sugar: 0, serving: '1 clove' },
  'mushrooms': { calories: 21, protein: 3, carbs: 3.1, fat: 0.3, fiber: 1, sugar: 1.9, serving: '1 cup sliced' },
  'zucchini': { calories: 33, protein: 2.4, carbs: 6, fat: 0.4, fiber: 2, sugar: 5, serving: '1 cup chopped' },
  'eggplant': { calories: 20, protein: 0.8, carbs: 4.8, fat: 0.1, fiber: 2.5, sugar: 2.9, serving: '1 cup cubed' },
  'cauliflower': { calories: 25, protein: 2, carbs: 5, fat: 0.1, fiber: 2.5, sugar: 2, serving: '1 cup chopped' },
  'asparagus': { calories: 27, protein: 3, carbs: 5.2, fat: 0.2, fiber: 2.8, sugar: 2.5, serving: '1 cup' },
  'green beans': { calories: 44, protein: 2.4, carbs: 10, fat: 0.1, fiber: 4, sugar: 1.9, serving: '1 cup' },
  'peas': { calories: 134, protein: 8.6, carbs: 25, fat: 0.4, fiber: 8.8, sugar: 9.5, serving: '1 cup' },
  'corn': { calories: 96, protein: 3.5, carbs: 21, fat: 1.5, fiber: 2.4, sugar: 4.5, serving: '1 cup' },
  'lettuce': { calories: 5, protein: 0.5, carbs: 1, fat: 0, fiber: 0.5, sugar: 0.4, serving: '1 cup shredded' },
  'cabbage': { calories: 22, protein: 1.1, carbs: 5.2, fat: 0.1, fiber: 2.2, sugar: 2.9, serving: '1 cup chopped' },
  'celery': { calories: 14, protein: 0.7, carbs: 3, fat: 0.2, fiber: 1.6, sugar: 1.4, serving: '1 cup chopped' },
  'radish': { calories: 19, protein: 0.8, carbs: 4, fat: 0.1, fiber: 1.9, sugar: 2.2, serving: '1 cup sliced' },
  'beets': { calories: 58, protein: 2.2, carbs: 13, fat: 0.2, fiber: 3.8, sugar: 9, serving: '1 cup' },
  
  // ========== NUTS & SEEDS ==========
  
  'almonds': { calories: 164, protein: 6, carbs: 6.1, fat: 14, fiber: 3.5, sugar: 1.2, serving: '1 oz (23 nuts)' },
  'walnuts': { calories: 185, protein: 4.3, carbs: 3.9, fat: 18, fiber: 1.9, sugar: 0.7, serving: '1 oz (14 halves)' },
  'cashews': { calories: 157, protein: 5.2, carbs: 8.6, fat: 12, fiber: 0.9, sugar: 1.7, serving: '1 oz' },
  'pistachios': { calories: 159, protein: 5.7, carbs: 7.7, fat: 13, fiber: 3, sugar: 2.2, serving: '1 oz' },
  'peanuts': { calories: 161, protein: 7.3, carbs: 4.6, fat: 14, fiber: 2.4, sugar: 1.3, serving: '1 oz' },
  'pecans': { calories: 196, protein: 2.6, carbs: 3.9, fat: 20, fiber: 2.7, sugar: 1.1, serving: '1 oz' },
  'macadamia nuts': { calories: 204, protein: 2.2, carbs: 3.9, fat: 21, fiber: 2.4, sugar: 1.3, serving: '1 oz' },
  'brazil nuts': { calories: 186, protein: 4.1, carbs: 3.5, fat: 19, fiber: 2.1, sugar: 0.7, serving: '1 oz' },
  'hazelnuts': { calories: 178, protein: 4.2, carbs: 4.7, fat: 17, fiber: 2.8, sugar: 1.2, serving: '1 oz' },
  'peanut butter': { calories: 188, protein: 8, carbs: 6, fat: 16, fiber: 2, sugar: 3, serving: '2 tbsp' },
  'almond butter': { calories: 196, protein: 6.7, carbs: 6, fat: 18, fiber: 3.3, sugar: 1.9, serving: '2 tbsp' },
  'sunflower seeds': { calories: 164, protein: 5.5, carbs: 6.8, fat: 14, fiber: 2.4, sugar: 0.8, serving: '1 oz' },
  'pumpkin seeds': { calories: 151, protein: 7, carbs: 5, fat: 13, fiber: 1.7, sugar: 0.4, serving: '1 oz' },
  'chia seeds': { calories: 138, protein: 4.7, carbs: 12, fat: 8.7, fiber: 9.8, sugar: 0, serving: '1 oz' },
  'flax seeds': { calories: 150, protein: 5.1, carbs: 8.1, fat: 12, fiber: 7.6, sugar: 0.4, serving: '1 oz' },
  'sesame seeds': { calories: 160, protein: 5, carbs: 6.6, fat: 14, fiber: 3.3, sugar: 0.1, serving: '1 oz' },
  
  // ========== DAIRY & ALTERNATIVES ==========
  
  'greek yogurt': { calories: 100, protein: 17, carbs: 6, fat: 0, fiber: 0, sugar: 4, serving: '1 cup' },
  'yogurt': { calories: 149, protein: 8.5, carbs: 11, fat: 8, fiber: 0, sugar: 11, serving: '1 cup' },
  'milk': { calories: 103, protein: 8, carbs: 12, fat: 2.4, fiber: 0, sugar: 12, serving: '1 cup' },
  'whole milk': { calories: 149, protein: 7.7, carbs: 12, fat: 7.9, fiber: 0, sugar: 12, serving: '1 cup' },
  'skim milk': { calories: 83, protein: 8.3, carbs: 12, fat: 0.2, fiber: 0, sugar: 12, serving: '1 cup' },
  'almond milk': { calories: 39, protein: 1.5, carbs: 3.4, fat: 2.5, fiber: 0.5, sugar: 2, serving: '1 cup' },
  'soy milk': { calories: 105, protein: 6.3, carbs: 12, fat: 3.6, fiber: 0.5, sugar: 8.9, serving: '1 cup' },
  'oat milk': { calories: 120, protein: 3, carbs: 16, fat: 5, fiber: 2, sugar: 7, serving: '1 cup' },
  'coconut milk': { calories: 76, protein: 0.5, carbs: 7.1, fat: 5.1, fiber: 0, sugar: 6.3, serving: '1 cup' },
  'cheese': { calories: 113, protein: 7, carbs: 1, fat: 9, fiber: 0, sugar: 0.5, serving: '1 oz' },
  'cheddar cheese': { calories: 114, protein: 7, carbs: 0.4, fat: 9.4, fiber: 0, sugar: 0.1, serving: '1 oz' },
  'mozzarella cheese': { calories: 85, protein: 6.3, carbs: 1.1, fat: 6.3, fiber: 0, sugar: 0.4, serving: '1 oz' },
  'parmesan cheese': { calories: 122, protein: 11, carbs: 1, fat: 8, fiber: 0, sugar: 0.2, serving: '1 oz' },
  'feta cheese': { calories: 75, protein: 4, carbs: 1.2, fat: 6, fiber: 0, sugar: 1.2, serving: '1 oz' },
  'cottage cheese': { calories: 163, protein: 28, carbs: 6.2, fat: 2.3, fiber: 0, sugar: 6.2, serving: '1 cup' },
  'cream cheese': { calories: 99, protein: 1.7, carbs: 1.6, fat: 10, fiber: 0, sugar: 0.8, serving: '1 oz' },
  'butter': { calories: 102, protein: 0.1, carbs: 0, fat: 12, fiber: 0, sugar: 0, serving: '1 tbsp' },
  
  // ========== SNACKS & SWEETS ==========
  
  'dark chocolate': { calories: 155, protein: 2.2, carbs: 13, fat: 11, fiber: 3.1, sugar: 6.8, serving: '1 oz' },
  'milk chocolate': { calories: 153, protein: 2, carbs: 17, fat: 9, fiber: 1, sugar: 15, serving: '1 oz' },
  'honey': { calories: 64, protein: 0.1, carbs: 17, fat: 0, fiber: 0, sugar: 17, serving: '1 tbsp' },
  'maple syrup': { calories: 52, protein: 0, carbs: 13, fat: 0, fiber: 0, sugar: 12, serving: '1 tbsp' },
  'jam': { calories: 56, protein: 0.1, carbs: 14, fat: 0, fiber: 0.2, sugar: 10, serving: '1 tbsp' },
  'nutella': { calories: 100, protein: 1, carbs: 11, fat: 6, fiber: 0, sugar: 11, serving: '1 tbsp' },
  'granola': { calories: 134, protein: 3.3, carbs: 18, fat: 5.8, fiber: 1.9, sugar: 6.2, serving: '1/4 cup' },
  'protein bar': { calories: 200, protein: 20, carbs: 25, fat: 6, fiber: 3, sugar: 15, serving: '1 bar' },
  'energy bar': { calories: 230, protein: 4, carbs: 45, fat: 6, fiber: 3, sugar: 20, serving: '1 bar' },
  'popcorn': { calories: 31, protein: 1, carbs: 6.2, fat: 0.4, fiber: 1.2, sugar: 0.1, serving: '1 cup popped' },
  'chips': { calories: 152, protein: 2, carbs: 15, fat: 10, fiber: 1.1, sugar: 0.2, serving: '1 oz' },
  'pretzels': { calories: 108, protein: 2.6, carbs: 23, fat: 0.8, fiber: 0.9, sugar: 1.2, serving: '1 oz' },
  'crackers': { calories: 142, protein: 2.3, carbs: 18, fat: 7, fiber: 0.6, sugar: 0.8, serving: '1 oz' },
  'cookies': { calories: 142, protein: 1.5, carbs: 19, fat: 7, fiber: 0.7, sugar: 10, serving: '1 oz (2 cookies)' },
  'ice cream': { calories: 207, protein: 3.5, carbs: 24, fat: 11, fiber: 0.7, sugar: 21, serving: '1/2 cup' },
  'cake': { calories: 257, protein: 2.6, carbs: 42, fat: 10, fiber: 0.6, sugar: 30, serving: '1 slice' },
  
  // ========== BEVERAGES & CONDIMENTS ==========
  
  'coffee': { calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, sugar: 0, serving: '1 cup' },
  'tea': { calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, serving: '1 cup' },
  'green tea': { calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, serving: '1 cup' },
  'orange juice': { calories: 112, protein: 1.7, carbs: 26, fat: 0.5, fiber: 0.5, sugar: 21, serving: '1 cup' },
  'apple juice': { calories: 114, protein: 0.2, carbs: 28, fat: 0.3, fiber: 0.2, sugar: 24, serving: '1 cup' },
  'soda': { calories: 140, protein: 0, carbs: 39, fat: 0, fiber: 0, sugar: 39, serving: '12 oz' },
  'protein shake': { calories: 160, protein: 30, carbs: 6, fat: 2, fiber: 1, sugar: 4, serving: '1 scoop' },
  'smoothie': { calories: 200, protein: 5, carbs: 40, fat: 2, fiber: 4, sugar: 30, serving: '1 cup' },
  'ketchup': { calories: 19, protein: 0.2, carbs: 5, fat: 0, fiber: 0, sugar: 4, serving: '1 tbsp' },
  'mayonnaise': { calories: 94, protein: 0.1, carbs: 0.1, fat: 10, fiber: 0, sugar: 0.1, serving: '1 tbsp' },
  'mustard': { calories: 10, protein: 0.6, carbs: 1, fat: 0.6, fiber: 0.5, sugar: 0.3, serving: '1 tbsp' },
  'soy sauce': { calories: 8, protein: 1.3, carbs: 0.8, fat: 0, fiber: 0.1, sugar: 0.4, serving: '1 tbsp' },
  'olive oil': { calories: 119, protein: 0, carbs: 0, fat: 14, fiber: 0, sugar: 0, serving: '1 tbsp' },
  'vegetable oil': { calories: 124, protein: 0, carbs: 0, fat: 14, fiber: 0, sugar: 0, serving: '1 tbsp' },
  'coconut oil': { calories: 121, protein: 0, carbs: 0, fat: 14, fiber: 0, sugar: 0, serving: '1 tbsp' },
  'vinegar': { calories: 3, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, serving: '1 tbsp' },
  'hummus': { calories: 25, protein: 1.2, carbs: 2.9, fat: 1.3, fiber: 0.8, sugar: 0, serving: '1 tbsp' },
  'guacamole': { calories: 25, protein: 0.3, carbs: 2, fat: 2, fiber: 1, sugar: 0, serving: '2 tbsp' },
  'salsa': { calories: 5, protein: 0.2, carbs: 1.1, fat: 0, fiber: 0.3, sugar: 0.8, serving: '2 tbsp' },
};

// Search function with fuzzy matching
export const searchFoodDatabase = (query, limit = 5) => {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  const results = [];
  
  // Exact matches first
  const exactMatch = Object.keys(foodDatabase).find(
    food => food.toLowerCase() === normalizedQuery
  );
  if (exactMatch) {
    results.push({ food: exactMatch, ...foodDatabase[exactMatch], matchType: 'exact' });
  }
  
  // Starts with matches
  Object.keys(foodDatabase).forEach(food => {
    if (food.toLowerCase().startsWith(normalizedQuery) && food !== exactMatch) {
      results.push({ food, ...foodDatabase[food], matchType: 'startsWith' });
    }
  });
  
  // Contains matches
  Object.keys(foodDatabase).forEach(food => {
    if (
      food.toLowerCase().includes(normalizedQuery) &&
      !food.toLowerCase().startsWith(normalizedQuery) &&
      food !== exactMatch
    ) {
      results.push({ food, ...foodDatabase[food], matchType: 'contains' });
    }
  });
  
  return results.slice(0, limit);
};

// Get food by exact name
export const getFoodByName = (foodName) => {
  const normalizedName = foodName.toLowerCase().trim();
  const exactMatch = foodDatabase[normalizedName];
  
  if (exactMatch) {
    return { food: foodName, ...exactMatch };
  }
  
  // Try partial match
  const partialMatch = Object.keys(foodDatabase).find(key =>
    key.includes(normalizedName) || normalizedName.includes(key)
  );
  
  if (partialMatch) {
    return { food: partialMatch, ...foodDatabase[partialMatch] };
  }
  
  return null;
};

// Get all food names (for autocomplete)
export const getAllFoodNames = () => {
  return Object.keys(foodDatabase).sort();
};

// Get food categories
export const getFoodCategories = () => {
  return {
    proteins: ['chicken breast', 'salmon', 'tuna', 'eggs', 'tofu', 'beef steak'],
    grains: ['quinoa', 'brown rice', 'oatmeal', 'pasta', 'whole wheat bread'],
    fruits: ['banana', 'apple', 'orange', 'berries', 'avocado', 'mango'],
    vegetables: ['broccoli', 'spinach', 'carrots', 'sweet potato', 'tomatoes'],
    nuts: ['almonds', 'walnuts', 'cashews', 'peanut butter'],
    dairy: ['greek yogurt', 'milk', 'cheese', 'cottage cheese']
  };
};

export default foodDatabase;

