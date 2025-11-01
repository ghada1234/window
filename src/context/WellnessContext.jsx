import { createContext, useContext, useState, useEffect } from 'react'
import { getJSON, setJSON } from '../utils/storage'

const WellnessContext = createContext()

export const useWellness = () => {
  const context = useContext(WellnessContext)
  if (!context) {
    throw new Error('useWellness must be used within WellnessProvider')
  }
  return context
}

export const WellnessProvider = ({ children }) => {
  const [waterIntake, setWaterIntake] = useState(() => {
    return getJSON('waterIntake', { glasses: 0, goal: 8, entries: [] })
  })

  const [activities, setActivities] = useState(() => {
    return getJSON('activities', [])
  })

  const [sleepLogs, setSleepLogs] = useState(() => {
    return getJSON('sleepLogs', [])
  })

  const [moodLogs, setMoodLogs] = useState(() => {
    return getJSON('moodLogs', [])
  })

  const [journalEntries, setJournalEntries] = useState(() => {
    return getJSON('journalEntries', [])
  })

  const [nutrition, setNutrition] = useState(() => {
    return getJSON('nutrition', {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      entries: []
    })
  })

  const [habits, setHabits] = useState(() => {
    return getJSON('habits', [])
  })

  const [hobbies, setHobbies] = useState(() => {
    return getJSON('hobbies', [])
  })

  const [affirmations, setAffirmations] = useState(() => {
    return getJSON('affirmations', [])
  })

  const [gratitudeEntries, setGratitudeEntries] = useState(() => {
    return getJSON('gratitudeEntries', [])
  })

  const [selfCareActivities, setSelfCareActivities] = useState(() => {
    return getJSON('selfCareActivities', [])
  })

  // Save to storage whenever state changes
  useEffect(() => {
    setJSON('waterIntake', waterIntake)
  }, [waterIntake])

  useEffect(() => {
    setJSON('activities', activities)
  }, [activities])

  useEffect(() => {
    setJSON('sleepLogs', sleepLogs)
  }, [sleepLogs])

  useEffect(() => {
    setJSON('moodLogs', moodLogs)
  }, [moodLogs])

  useEffect(() => {
    setJSON('journalEntries', journalEntries)
  }, [journalEntries])

  useEffect(() => {
    setJSON('nutrition', nutrition)
  }, [nutrition])

  useEffect(() => {
    setJSON('habits', habits)
  }, [habits])

  useEffect(() => {
    setJSON('hobbies', hobbies)
  }, [hobbies])

  useEffect(() => {
    setJSON('affirmations', affirmations)
  }, [affirmations])

  useEffect(() => {
    setJSON('gratitudeEntries', gratitudeEntries)
  }, [gratitudeEntries])

  useEffect(() => {
    setJSON('selfCareActivities', selfCareActivities)
  }, [selfCareActivities])

  const addWater = (glasses) => {
    setWaterIntake(prev => ({
      ...prev,
      glasses: Math.min(prev.glasses + glasses, prev.goal)
    }))
  }

  const setWaterGoal = (goal) => {
    setWaterIntake(prev => ({ ...prev, goal }))
  }

  const addWaterEntry = (entry) => {
    setWaterIntake(prev => ({
      ...prev,
      entries: [entry, ...prev.entries],
      glasses: prev.glasses + entry.glasses
    }))
  }

  const addActivity = (activity) => {
    setActivities(prev => [activity, ...prev])
  }

  const addSleepLog = (log) => {
    setSleepLogs(prev => [log, ...prev])
  }

  const addMoodLog = (mood) => {
    setMoodLogs(prev => [mood, ...prev])
  }

  const addJournalEntry = (entry) => {
    setJournalEntries(prev => [entry, ...prev])
  }

  const addNutritionEntry = (entry) => {
    setNutrition(prev => ({
      ...prev,
      calories: prev.calories + (entry.calories || 0),
      protein: prev.protein + (entry.protein || 0),
      carbs: prev.carbs + (entry.carbs || 0),
      fat: prev.fat + (entry.fat || 0),
      fiber: prev.fiber + (entry.fiber || 0),
      sugar: prev.sugar + (entry.sugar || 0),
      entries: [entry, ...prev.entries]
    }))
  }

  const resetDailyNutrition = () => {
    setNutrition(prev => ({
      ...prev,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0
    }))
  }

  const addHabit = (habit) => {
    setHabits(prev => [habit, ...prev])
  }

  const updateHabit = (habitId, updates) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId ? { ...habit, ...updates } : habit
    ))
  }

  const deleteHabit = (habitId) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId))
  }

  const completeHabit = (habitId) => {
    const today = new Date().toISOString()
    const todayDateString = new Date().toDateString()
    
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit
      
      // Check if already completed today
      const alreadyCompleted = habit.completedDays.some(date => 
        new Date(date).toDateString() === todayDateString
      )
      
      if (alreadyCompleted) return habit
      
      const newCompletedDays = [...habit.completedDays, today]
      
      // Calculate streak
      let streak = habit.streak || 0
      const sortedDays = newCompletedDays
        .map(d => new Date(d).getTime())
        .sort((a, b) => b - a)
      
      // Calculate consecutive days
      let currentStreak = 1
      for (let i = 1; i < sortedDays.length; i++) {
        const daysDiff = (sortedDays[i - 1] - sortedDays[i]) / (1000 * 60 * 60 * 24)
        if (daysDiff === 1) {
          currentStreak++
        } else {
          break
        }
      }
      
      streak = currentStreak
      const bestStreak = Math.max(habit.bestStreak || 0, streak)
      
      return {
        ...habit,
        completedDays: newCompletedDays,
        streak,
        bestStreak,
        lastCompleted: today,
        totalCompletions: (habit.totalCompletions || habit.completedDays.length) + 1
      }
    }))
  }

  // Hobbies
  const addHobby = (hobby) => {
    setHobbies(prev => [hobby, ...prev])
  }

  const updateHobby = (hobbyId, updates) => {
    setHobbies(prev => prev.map(hobby => 
      hobby.id === hobbyId ? { ...hobby, ...updates } : hobby
    ))
  }

  const deleteHobby = (hobbyId) => {
    setHobbies(prev => prev.filter(hobby => hobby.id !== hobbyId))
  }

  // Affirmations
  const addAffirmation = (affirmation) => {
    setAffirmations(prev => [affirmation, ...prev])
  }

  const updateAffirmation = (affirmationId, updates) => {
    setAffirmations(prev => prev.map(affirmation => 
      affirmation.id === affirmationId ? { ...affirmation, ...updates } : affirmation
    ))
  }

  const deleteAffirmation = (affirmationId) => {
    setAffirmations(prev => prev.filter(affirmation => affirmation.id !== affirmationId))
  }

  const toggleAffirmationFavorite = (affirmationId) => {
    setAffirmations(prev => prev.map(affirmation => 
      affirmation.id === affirmationId 
        ? { ...affirmation, isFavorite: !affirmation.isFavorite } 
        : affirmation
    ))
  }

  // Gratitude
  const addGratitudeEntry = (entry) => {
    setGratitudeEntries(prev => [entry, ...prev])
  }

  const deleteGratitudeEntry = (entryId) => {
    setGratitudeEntries(prev => prev.filter(entry => entry.id !== entryId))
  }

  // Self-Care Activities
  const completeSelfCareActivity = (activityId) => {
    const today = new Date().toISOString()
    const todayDateString = new Date().toDateString()
    
    setSelfCareActivities(prev => {
      const existingActivity = prev.find(a => a.id === activityId)
      
      if (existingActivity) {
        const completedToday = existingActivity.completedDays?.some(date => 
          new Date(date).toDateString() === todayDateString
        )
        
        if (completedToday) return prev
        
        return prev.map(activity => 
          activity.id === activityId
            ? { ...activity, completedDays: [...(activity.completedDays || []), today] }
            : activity
        )
      } else {
        // Create new activity entry
        return [...prev, {
          id: activityId,
          completedDays: [today]
        }]
      }
    })
  }

  // Calculate daily stats for dashboard
  const getDailyStats = () => {
    const today = new Date().toDateString()
    
    const todayActivities = activities.filter(a => {
      const activityDate = new Date(a.date || Date.now()).toDateString()
      return activityDate === today
    })
    
    const todaySleep = sleepLogs.find(s => {
      const sleepDate = new Date(s.date || Date.now()).toDateString()
      return sleepDate === today
    })

    const todayMood = moodLogs.find(m => {
      const moodDate = new Date(m.date || Date.now()).toDateString()
      return moodDate === today
    })

    const totalActivityMinutes = todayActivities.reduce((sum, a) => sum + (a.duration || 0), 0)

    return {
      sleep: todaySleep ? todaySleep.duration : null,
      activity: totalActivityMinutes > 0 ? `${totalActivityMinutes} min` : null,
      calories: nutrition.calories,
      mood: todayMood ? todayMood.mood : null
    }
  }

  return (
    <WellnessContext.Provider
      value={{
        waterIntake,
        setWaterGoal,
        addWater,
        addWaterEntry,
        activities,
        addActivity,
        sleepLogs,
        addSleepLog,
        moodLogs,
        addMoodLog,
        journalEntries,
        addJournalEntry,
        nutrition,
        addNutritionEntry,
        resetDailyNutrition,
        getDailyStats,
        habits,
        addHabit,
        updateHabit,
        deleteHabit,
        completeHabit,
        hobbies,
        addHobby,
        updateHobby,
        deleteHobby,
        affirmations,
        addAffirmation,
        updateAffirmation,
        deleteAffirmation,
        toggleAffirmationFavorite,
        gratitudeEntries,
        addGratitudeEntry,
        deleteGratitudeEntry,
        selfCareActivities,
        completeSelfCareActivity
      }}
    >
      {children}
    </WellnessContext.Provider>
  )
}

