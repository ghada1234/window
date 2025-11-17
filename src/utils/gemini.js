import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null

// Force a single stable model: Gemini 2.5 Flash
const DEFAULT_MODEL = 'gemini-2.5-flash'

// Normalize Gemini errors to friendly messages
const normalizeGeminiError = (error) => {
  const message = String(error?.message || error || '').toLowerCase()
  const status = error?.status || error?.response?.status
  if (status === 403 || message.includes('403')) {
    if (message.includes('leaked')) {
      return 'Your Gemini API key was reported as leaked. Create a new key in Google AI Studio, update VITE_GEMINI_API_KEY, then redeploy.'
    }
    return 'Gemini access denied (403). Check billing, model access, and API key permissions.'
  }
  if (status === 401 || message.includes('unauthorized') || message.includes('invalid api key')) {
    return 'Invalid Gemini API key. Update VITE_GEMINI_API_KEY and restart the app.'
  }
  return error?.message || 'Gemini request failed. Please check your API key and try again.'
}

// Food analysis prompt template
const FOOD_ANALYSIS_PROMPT = `You are a nutrition analysis expert. Analyze the food image provided and extract nutritional information. 

Return ONLY a valid JSON object. No additional text, explanations, or markdown formatting. Just pure JSON:

{
  "food": "name of the food item(s)",
  "calories": 250,
  "protein": 20,
  "carbs": 30,
  "fat": 8,
  "fiber": 5,
  "sugar": 12,
  "serving": "1 serving (approximately 150g)",
  "detectedFoods": ["grilled chicken", "rice", "vegetables"],
  "confidence": "85%",
  "healthTips": ["High in protein", "Good source of fiber"]
}

Important:
- All numeric values must be numbers (not strings)
- Estimate based on typical serving sizes visible in the image
- If you cannot clearly identify the food, estimate based on visual characteristics
- Provide realistic nutrition values
- confidence should be a string like "85%"
- detectedFoods should be an array of strings
- healthTips should be an array of strings

If you cannot analyze the image at all, return:
{
  "error": "Unable to analyze image. Please try a clearer photo."
}`

const LABEL_ANALYSIS_PROMPT = `You are a nutrition label reader. Analyze the nutrition label image and extract all nutritional information accurately.

Return ONLY a valid JSON object. No additional text, explanations, or markdown formatting. Just pure JSON:

{
  "food": "product name from label",
  "calories": 250,
  "protein": 10,
  "carbs": 30,
  "fat": 8,
  "fiber": 3,
  "sugar": 5,
  "serving": "1 serving (30g)",
  "confidence": "92%",
  "labelData": "Nutrition label scanned successfully"
}

Important:
- Extract EXACT values from the nutrition label (per serving)
- All numeric values must be numbers (not strings)
- Read the serving size from the label
- Read the product name from the label
- confidence should be a string like "92%"
- Use the values shown on the label exactly as displayed

If you cannot read the label clearly, return:
{
  "error": "Unable to read nutrition label. Please ensure the label is clearly visible and try again."
}`

// Analyze food from image using Gemini Vision
export const analyzeFoodImage = async (imageFile) => {
  if (!genAI) {
    throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.')
  }

  try {
    // Use Gemini 2.5 Flash (stable, multimodal - supports text + images)
    const modelsToTry = [DEFAULT_MODEL]
    let lastError = null
    
    // Convert file to base64 first
    const base64Image = await fileToBase64(imageFile)
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        
        const result = await model.generateContent([
          FOOD_ANALYSIS_PROMPT,
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Image
            }
          }
        ])

        const response = await result.response
        const text = response.text()

        // Parse JSON from response
        try {
          // Clean the text - remove markdown code blocks, extra whitespace, etc.
          let jsonText = text.trim()
          
          // Remove markdown code blocks if present
          jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
          
          // Try to find JSON object in the text
          const jsonObjectMatch = jsonText.match(/\{[\s\S]*\}/)
          if (jsonObjectMatch) {
            jsonText = jsonObjectMatch[0]
          }
          
          // Parse JSON
          const parsed = JSON.parse(jsonText)
          
          // Validate and set default values
          if (!parsed.error) {
            // Ensure all required fields have defaults
            const result = {
              food: parsed.food || 'Unknown food',
              calories: typeof parsed.calories === 'number' ? parsed.calories : (parseFloat(parsed.calories) || 0),
              protein: typeof parsed.protein === 'number' ? parsed.protein : (parseFloat(parsed.protein) || 0),
              carbs: typeof parsed.carbs === 'number' ? parsed.carbs : (parseFloat(parsed.carbs) || 0),
              fat: typeof parsed.fat === 'number' ? parsed.fat : (parseFloat(parsed.fat) || 0),
              fiber: typeof parsed.fiber === 'number' ? parsed.fiber : (parseFloat(parsed.fiber) || 0),
              sugar: typeof parsed.sugar === 'number' ? parsed.sugar : (parseFloat(parsed.sugar) || 0),
              serving: parsed.serving || '1 serving',
              detectedFoods: Array.isArray(parsed.detectedFoods) ? parsed.detectedFoods : [parsed.food || 'Unknown'],
              confidence: parsed.confidence || '80%',
              healthTips: Array.isArray(parsed.healthTips) ? parsed.healthTips : []
            }
            return result
          }
          
          return parsed
        } catch (parseError) {
          // If JSON parse fails, try more aggressive extraction
          console.error('JSON parse error:', parseError, 'Raw response:', text.substring(0, 200))
          
          // Try to extract key-value pairs manually
          const extractedData = {
            food: extractValue(text, 'food', 'Unknown food'),
            calories: extractNumber(text, 'calories'),
            protein: extractNumber(text, 'protein'),
            carbs: extractNumber(text, 'carbs'),
            fat: extractNumber(text, 'fat'),
            fiber: extractNumber(text, 'fiber'),
            sugar: extractNumber(text, 'sugar'),
            serving: extractValue(text, 'serving', '1 serving'),
            detectedFoods: [extractValue(text, 'food', 'Unknown food')],
            confidence: extractValue(text, 'confidence', '75%'),
            healthTips: []
          }
          
          // If we got at least some data, return it
          if (extractedData.calories > 0 || extractedData.food !== 'Unknown food') {
            return extractedData
          }
          
          return {
            error: 'Failed to parse AI response. The image might be unclear or contain no recognizable food. Please try again with a clearer photo.',
            rawResponse: text.substring(0, 500)
          }
        }
      } catch (modelError) {
        lastError = modelError
        console.warn(`Model ${modelName} failed, trying next...`, modelError.message)
        continue // Try next model
      }
    }
    
    // If all models failed, return error
    console.error('All Gemini models failed:', lastError)
    return {
      error: normalizeGeminiError(lastError)
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    return {
      error: normalizeGeminiError(error)
    }
  }
}

// Analyze nutrition label from image
export const analyzeNutritionLabel = async (imageFile) => {
  if (!genAI) {
    throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.')
  }

  try {
    // Use Gemini 2.5 Flash (stable, multimodal - supports text + images)
    const modelsToTry = [DEFAULT_MODEL]
    let lastError = null
    
    // Convert file to base64 first
    const base64Image = await fileToBase64(imageFile)
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        
        const result = await model.generateContent([
          LABEL_ANALYSIS_PROMPT,
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Image
            }
          }
        ])

        const response = await result.response
        const text = response.text()

        try {
          // Clean the text - remove markdown code blocks
          let jsonText = text.trim()
          jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
          
          // Try to find JSON object
          const jsonObjectMatch = jsonText.match(/\{[\s\S]*\}/)
          if (jsonObjectMatch) {
            jsonText = jsonObjectMatch[0]
          }
          
          const parsed = JSON.parse(jsonText)
          
          // Validate and set defaults for label analysis
          if (!parsed.error) {
            return {
              food: parsed.food || 'Unknown product',
              calories: typeof parsed.calories === 'number' ? parsed.calories : (parseFloat(parsed.calories) || 0),
              protein: typeof parsed.protein === 'number' ? parsed.protein : (parseFloat(parsed.protein) || 0),
              carbs: typeof parsed.carbs === 'number' ? parsed.carbs : (parseFloat(parsed.carbs) || 0),
              fat: typeof parsed.fat === 'number' ? parsed.fat : (parseFloat(parsed.fat) || 0),
              fiber: typeof parsed.fiber === 'number' ? parsed.fiber : (parseFloat(parsed.fiber) || 0),
              sugar: typeof parsed.sugar === 'number' ? parsed.sugar : (parseFloat(parsed.sugar) || 0),
              serving: parsed.serving || '1 serving',
              confidence: parsed.confidence || '85%',
              labelData: parsed.labelData || 'Nutrition label scanned successfully'
            }
          }
          
          return parsed
        } catch (parseError) {
          console.error('JSON parse error:', parseError)
          // Try manual extraction for label
          const extractedData = {
            food: extractValue(text, 'food', 'Unknown product'),
            calories: extractNumber(text, 'calories'),
            protein: extractNumber(text, 'protein'),
            carbs: extractNumber(text, 'carbs'),
            fat: extractNumber(text, 'fat'),
            fiber: extractNumber(text, 'fiber'),
            sugar: extractNumber(text, 'sugar'),
            serving: extractValue(text, 'serving', '1 serving'),
            confidence: extractValue(text, 'confidence', '80%'),
            labelData: 'Nutrition label scanned successfully'
          }
          
          if (extractedData.calories > 0 || extractedData.food !== 'Unknown product') {
            return extractedData
          }
          
          return {
            error: 'Failed to parse nutrition label. Please ensure the label is clearly visible and try again.',
            rawResponse: text.substring(0, 500)
          }
        }
      } catch (modelError) {
        lastError = modelError
        console.warn(`Model ${modelName} failed, trying next...`, modelError.message)
        continue // Try next model
      }
    }
    
    // If all models failed, return error
    console.error('All Gemini models failed:', lastError)
    return {
      error: normalizeGeminiError(lastError)
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    return {
      error: normalizeGeminiError(error)
    }
  }
}

// Get food suggestions using Gemini text generation
export const getFoodSuggestions = async (query) => {
  if (!genAI) {
    // Fallback to local suggestions if API key not available
    return null
  }

  try {
    // Use Gemini 2.5 Flash for text generation
    const modelsToTry = [DEFAULT_MODEL]
    let lastError = null

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })

        const prompt = `Given the search query "${query}", suggest 5 similar food items that might match. Return ONLY a JSON array of food names: ["food1", "food2", "food3", "food4", "food5"]`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        try {
          const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\[.*\]/)
          const jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text
          const parsed = JSON.parse(jsonText.trim())
          return Array.isArray(parsed) ? parsed : []
        } catch (parseError) {
          console.warn(`Failed to parse response from ${modelName}, trying next model...`)
          continue
        }
      } catch (modelError) {
        lastError = modelError
        console.warn(`Model ${modelName} failed, trying next...`, modelError.message)
        continue
      }
    }

    console.error('All Gemini models failed for text suggestions:', lastError)
    return null
  } catch (error) {
    console.error('Gemini suggestion error:', error)
    return null
  }
}

// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1] // Remove data URL prefix
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Helper function to extract values from text
const extractValue = (text, key, defaultValue = '') => {
  const regex = new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`, 'i')
  const match = text.match(regex)
  return match ? match[1] : defaultValue
}

// Helper function to extract numbers from text
const extractNumber = (text, key) => {
  const regex = new RegExp(`"${key}"\\s*:\\s*(\\d+(?:\\.\\d+)?)`, 'i')
  const match = text.match(regex)
  return match ? parseFloat(match[1]) : 0
}

// Generate wellness recommendations using Gemini
export const generateWellnessRecommendations = async (userData) => {
  if (!genAI) {
    return null
  }

  try {
    const modelsToTry = [DEFAULT_MODEL]
    let lastError = null

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })

        const prompt = `You are a wellness expert AI assistant. Analyze the following user wellness data and generate 4-5 personalized recommendations.

User Data:
- Activities: ${userData.activities?.length || 0} logged activities
- Sleep Logs: ${userData.sleepLogs?.length || 0} sleep entries. Average sleep: ${userData.avgSleep || 'N/A'} hours
- Mood Logs: ${userData.moodLogs?.length || 0} mood entries. Average mood: ${userData.avgMood || 'N/A'}
- Water Intake: ${userData.waterIntake?.glasses || 0}/${userData.waterIntake?.goal || 8} glasses today

Return ONLY a valid JSON array of recommendation objects with this exact structure:
[
  {
    "title": "Recommendation title",
    "priority": "High Priority" or "Medium Priority" or "Low Priority",
    "impact": "High Impact" or "Medium Impact" or "Low Impact",
    "duration": "1-2 Weeks" or "2-3 Weeks" or "Ongoing" or similar,
    "description": "Detailed explanation of why this recommendation is important based on user data",
    "actions": ["action 1", "action 2", "action 3", "action 4"]
  }
]

Make recommendations specific to the user's actual data. If they have no sleep logs, recommend tracking sleep. If mood is low, recommend mood-boosting activities. Be specific and actionable.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        try {
          let jsonText = text.trim()
          jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
          const jsonMatch = jsonText.match(/\[[\s\S]*\]/)
          if (jsonMatch) {
            jsonText = jsonMatch[0]
          }
          const parsed = JSON.parse(jsonText)
          return Array.isArray(parsed) ? parsed : []
        } catch (parseError) {
          console.warn(`Failed to parse recommendations from ${modelName}, trying next model...`)
          continue
        }
      } catch (modelError) {
        lastError = modelError
        console.warn(`Model ${modelName} failed for recommendations, trying next...`, modelError.message)
        continue
      }
    }

    console.error('All Gemini models failed for recommendations:', lastError)
    return null
  } catch (error) {
    console.error('Gemini recommendation error:', error)
    return null
  }
}

// Generate AI chat response using Gemini
export const generateWellnessChatResponse = async (userMessage, userData) => {
  if (!genAI) {
    return null
  }

  try {
    const modelsToTry = [DEFAULT_MODEL]
    let lastError = null

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })

        const prompt = `You are a friendly and knowledgeable wellness AI assistant. The user is asking you about their wellness journey.

User's Question: "${userMessage}"

User's Wellness Data:
- Activities: ${userData.activities?.length || 0} logged activities
- Sleep Logs: ${userData.sleepLogs?.length || 0} sleep entries. Recent average: ${userData.avgSleep || 'N/A'} hours
- Mood Logs: ${userData.moodLogs?.length || 0} mood entries. Recent average mood: ${userData.avgMood || 'N/A'}
- Water Intake: ${userData.waterIntake?.glasses || 0}/${userData.waterIntake?.goal || 8} glasses today

Provide a helpful, personalized response based on their data. Be conversational, supportive, and offer actionable advice. Reference their actual data when relevant. Keep response concise (2-3 sentences typically, up to 5 sentences for complex questions).

Just return the response text directly - no JSON, no markdown formatting, just plain conversational text.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text().trim()
      } catch (modelError) {
        lastError = modelError
        console.warn(`Model ${modelName} failed for chat, trying next...`, modelError.message)
        continue
      }
    }

    console.error('All Gemini models failed for chat:', lastError)
    return null
  } catch (error) {
    console.error('Gemini chat error:', error)
    return null
  }
}

// Generate wellness insights using Gemini
export const generateWellnessInsights = async (userData) => {
  if (!genAI) {
    return null
  }

  try {
    const modelsToTry = [DEFAULT_MODEL]
    let lastError = null

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })

        const prompt = `You are a wellness analytics expert. Analyze the following user wellness data and generate insights.

User Data:
- Activities: ${userData.activities?.length || 0} logged activities
- Sleep Logs: ${userData.sleepLogs?.length || 0} entries. Average: ${userData.avgSleep || 'N/A'} hours
- Mood Logs: ${userData.moodLogs?.length || 0} entries. Average mood: ${userData.avgMood || 'N/A'}
- Water Intake: ${userData.waterIntake?.glasses || 0}/${userData.waterIntake?.goal || 8} glasses

Return ONLY a valid JSON object with insights:
{
  "correlations": [
    {
      "type": "Sleep ↔ Mood",
      "strength": "Strong Positive" or "Moderate Positive" or "Negative",
      "finding": "Description of the correlation",
      "recommendation": "Actionable recommendation"
    }
  ],
  "predictions": [
    {
      "title": "Next 7 Days - Sleep",
      "confidence": "85%",
      "prediction": "What will happen based on trends",
      "action": "Recommended action"
    }
  ]
}`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        try {
          let jsonText = text.trim()
          jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
          const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            jsonText = jsonMatch[0]
          }
          const parsed = JSON.parse(jsonText)
          return parsed
        } catch (parseError) {
          console.warn(`Failed to parse insights from ${modelName}, trying next model...`)
          continue
        }
      } catch (modelError) {
        lastError = modelError
        console.warn(`Model ${modelName} failed for insights, trying next...`, modelError.message)
        continue
      }
    }

    console.error('All Gemini models failed for insights:', lastError)
    return null
  } catch (error) {
    console.error('Gemini insights error:', error)
    return null
  }
}

// Check if Gemini API is configured
export const isGeminiConfigured = () => {
  return !!API_KEY
}
