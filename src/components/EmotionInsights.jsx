import { useMemo } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Brain, TrendingUp, TrendingDown, Heart, Moon, Activity, Apple, BookOpen, Calendar, Lightbulb, BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './EmotionInsights.css'

const EmotionInsights = () => {
  const { t } = useTranslation()
  const { moodLogs, nutrition, sleepLogs, activities, journalEntries } = useWellness()

  // Analyze mood patterns over time
  const moodAnalysis = useMemo(() => {
    if (moodLogs.length === 0) {
      return {
        totalLogs: 0,
        moodDistribution: {},
        averageMood: null,
        trend: null,
        weeklyPattern: [],
        insights: []
      }
    }

    const moodMap = { '😄 Excellent': 5, 'Great': 5, '😊 Good': 4, 'Moderate': 3, '😐 Okay': 3, '😔 Low': 2, '😢 Poor': 1, 'High': 5, 'Low': 2 }
    
    // Count mood distribution
    const distribution = {}
    moodLogs.forEach(log => {
      const mood = log.mood || '😐 Okay'
      distribution[mood] = (distribution[mood] || 0) + 1
    })

    // Calculate average mood score
    const moodScores = moodLogs.map(log => {
      const mood = log.mood || '😐 Okay'
      return moodMap[mood] || moodMap[Object.keys(moodMap).find(k => mood.includes(k))] || 3
    })
    const avgScore = moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length

    // Determine trend (comparing recent vs older moods)
    const recentMoods = moodScores.slice(-7)
    const olderMoods = moodScores.slice(0, -7)
    let trend = 'stable'
    if (recentMoods.length > 0 && olderMoods.length > 0) {
      const recentAvg = recentMoods.reduce((sum, s) => sum + s, 0) / recentMoods.length
      const olderAvg = olderMoods.reduce((sum, s) => sum + s, 0) / olderMoods.length
      if (recentAvg > olderAvg + 0.3) trend = 'improving'
      else if (recentAvg < olderAvg - 0.3) trend = 'declining'
    }

    // Weekly pattern (mood by day of week)
    const weeklyPattern = Array(7).fill(0).map((_, dayIndex) => {
      const dayMoods = moodLogs.filter(log => {
        const date = new Date(log.date || log.dateString || Date.now())
        return date.getDay() === dayIndex
      })
      if (dayMoods.length === 0) return { day: dayIndex, avgScore: 3, count: 0 }
      const scores = dayMoods.map(log => {
        const mood = log.mood || '😐 Okay'
        return moodMap[mood] || 3
      })
      return {
        day: dayIndex,
        avgScore: scores.reduce((sum, s) => sum + s, 0) / scores.length,
        count: dayMoods.length
      }
    })

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    // Generate insights
    const insights = []
    if (trend === 'improving') {
      insights.push({
        type: 'positive',
        title: 'Mood Trend: Improving',
        description: 'Your mood has been improving recently! Keep up the great work.'
      })
    } else if (trend === 'declining') {
      insights.push({
        type: 'caution',
        title: 'Mood Trend: Needs Attention',
        description: 'Your mood has been lower recently. Consider practicing self-care and reaching out for support.'
      })
    }

    const bestDay = weeklyPattern.reduce((best, day) => 
      day.avgScore > best.avgScore ? day : best
    , weeklyPattern[0])
    
    if (bestDay.count > 0) {
      insights.push({
        type: 'info',
        title: `Best Mood Day: ${dayNames[bestDay.day]}`,
        description: `Your mood tends to be highest on ${dayNames[bestDay.day]}. Notice what activities or routines you do on this day.`
      })
    }

    return {
      totalLogs: moodLogs.length,
      moodDistribution: distribution,
      averageMood: avgScore.toFixed(1),
      trend,
      weeklyPattern: weeklyPattern.map(p => ({ ...p, dayName: dayNames[p.day] })),
      insights
    }
  }, [moodLogs])

  // Correlate mood with other wellness factors
  const correlations = useMemo(() => {
    const correlationsList = []

    // Mood vs Sleep
    if (moodLogs.length > 0 && sleepLogs.length > 0) {
      const sleepQualityMap = { 'Excellent': 5, 'Good': 4, 'Fair': 3, 'Poor': 2, 'Terrible': 1 }
      const moodMap = { '😄 Excellent': 5, 'Great': 5, '😊 Good': 4, 'Moderate': 3, '😐 Okay': 3, '😔 Low': 2, '😢 Poor': 1 }
      
      // Match mood and sleep by date
      const matchedDays = []
      moodLogs.forEach(moodLog => {
        const moodDate = new Date(moodLog.date || moodLog.dateString || Date.now()).toDateString()
        const sleepLog = sleepLogs.find(s => {
          const sleepDate = new Date(s.date || s.dateString || Date.now()).toDateString()
          return sleepDate === moodDate
        })
        if (sleepLog) {
          const moodScore = moodMap[moodLog.mood] || 3
          const sleepScore = sleepQualityMap[sleepLog.quality] || 3
          matchedDays.push({ mood: moodScore, sleep: sleepScore })
        }
      })

      if (matchedDays.length >= 3) {
        const avgMood = matchedDays.reduce((sum, d) => sum + d.mood, 0) / matchedDays.length
        const avgSleep = matchedDays.reduce((sum, d) => sum + d.sleep, 0) / matchedDays.length
        
        // Simple correlation check
        if (avgSleep >= 4 && avgMood >= 4) {
          correlationsList.push({
            factor: 'Sleep Quality',
            correlation: 'positive',
            finding: 'Better sleep quality is associated with better moods',
            description: 'Days with good sleep quality tend to correlate with positive moods.'
          })
        } else if (avgSleep < 3 && avgMood < 3) {
          correlationsList.push({
            factor: 'Sleep Quality',
            correlation: 'negative',
            finding: 'Poor sleep may be affecting your mood',
            description: 'Lower sleep quality appears to be linked with lower mood scores.'
          })
        }
      }
    }

    // Mood vs Activity
    if (moodLogs.length > 0 && activities.length > 0) {
      const moodMap = { '😄 Excellent': 5, 'Great': 5, '😊 Good': 4, 'Moderate': 3, '😐 Okay': 3, '😔 Low': 2, '😢 Poor': 1 }
      
      const matchedDays = []
      moodLogs.forEach(moodLog => {
        const moodDate = new Date(moodLog.date || moodLog.dateString || Date.now()).toDateString()
        const dayActivities = activities.filter(a => {
          const activityDate = new Date(a.date || Date.now()).toDateString()
          return activityDate === moodDate
        })
        if (dayActivities.length > 0) {
          const moodScore = moodMap[moodLog.mood] || 3
          const totalActivity = dayActivities.reduce((sum, a) => sum + (a.duration || 0), 0)
          matchedDays.push({ mood: moodScore, activity: totalActivity })
        }
      })

      if (matchedDays.length >= 3) {
        const activeDays = matchedDays.filter(d => d.activity > 30) // 30+ minutes
        const inactiveDays = matchedDays.filter(d => d.activity <= 30)
        
        if (activeDays.length > 0 && inactiveDays.length > 0) {
          const activeMood = activeDays.reduce((sum, d) => sum + d.mood, 0) / activeDays.length
          const inactiveMood = inactiveDays.reduce((sum, d) => sum + d.mood, 0) / inactiveDays.length
          
          if (activeMood > inactiveMood + 0.5) {
            correlationsList.push({
              factor: 'Physical Activity',
              correlation: 'positive',
              finding: 'More activity is linked to better mood',
              description: 'Days with more physical activity tend to have better mood scores.'
            })
          }
        }
      }
    }

    // Mood vs Nutrition (using pre/post meal moods)
    if (nutrition.entries.length > 0) {
      const entriesWithMood = nutrition.entries.filter(e => e.preMealMood || e.postMealMood)
      if (entriesWithMood.length >= 3) {
        const moodMap = { '😊 Happy': 5, '😌 Calm': 4, '😰 Anxious': 3, '😔 Sad': 2, '😠 Angry': 2, '😴 Tired': 3 }
        
        const preMealAvg = entriesWithMood
          .filter(e => e.preMealMood)
          .map(e => moodMap[e.preMealMood] || 3)
        const postMealAvg = entriesWithMood
          .filter(e => e.postMealMood)
          .map(e => moodMap[e.postMealMood] || 3)
        
        if (preMealAvg.length > 0 && postMealAvg.length > 0) {
          const preAvg = preMealAvg.reduce((sum, m) => sum + m, 0) / preMealAvg.length
          const postAvg = postMealAvg.reduce((sum, m) => sum + m, 0) / postMealAvg.length
          
          if (postAvg > preAvg + 0.3) {
            correlationsList.push({
              factor: 'Food Impact',
              correlation: 'positive',
              finding: 'Meals tend to improve your mood',
              description: 'Your post-meal mood is typically better than pre-meal mood, suggesting food has a positive impact.'
            })
          } else if (postAvg < preAvg - 0.3) {
            correlationsList.push({
              factor: 'Food Impact',
              correlation: 'negative',
              finding: 'Meals may be affecting your mood negatively',
              description: 'Consider mindful eating and choosing foods that support your emotional well-being.'
            })
          }
        }
      }
    }

    return correlationsList
  }, [moodLogs, sleepLogs, activities, nutrition.entries])

  // Journal sentiment analysis (simple keyword-based)
  const journalInsights = useMemo(() => {
    if (journalEntries.length === 0) return null

    const positiveWords = ['happy', 'good', 'great', 'excited', 'grateful', 'love', 'joy', 'peaceful', 'calm', 'grateful', 'thankful']
    const negativeWords = ['sad', 'angry', 'frustrated', 'worried', 'anxious', 'stressed', 'tired', 'upset', 'down']

    const sentimentScores = journalEntries.map(entry => {
      const text = (entry.content || entry.text || '').toLowerCase()
      const positive = positiveWords.filter(word => text.includes(word)).length
      const negative = negativeWords.filter(word => text.includes(word)).length
      return positive - negative
    })

    const avgSentiment = sentimentScores.reduce((sum, s) => sum + s, 0) / sentimentScores.length

    return {
      totalEntries: journalEntries.length,
      averageSentiment: avgSentiment > 0 ? 'positive' : avgSentiment < 0 ? 'negative' : 'neutral',
      sentimentScore: avgSentiment.toFixed(1),
      insight: avgSentiment > 1 
        ? 'Your journal entries show a positive tone overall.'
        : avgSentiment < -1
        ? 'Your journal entries suggest you may benefit from additional support or self-care practices.'
        : 'Your journal entries show a balanced emotional tone.'
    }
  }, [journalEntries])

  return (
    <div className="emotion-insights-page">
      <header className="page-header">
        <h1><Brain size={32} /> {t('emotionInsights.title')}</h1>
        <p>{t('emotionInsights.subtitle')}</p>
      </header>

      {/* Mood Overview */}
      <section className="mood-overview">
        <h2><Heart size={24} /> {t('emotionInsights.moodOverview')}</h2>
        {moodAnalysis.totalLogs === 0 ? (
          <div className="empty-state">
            <Heart size={48} />
            <p>{t('emotionInsights.startLogging')}</p>
          </div>
        ) : (
          <div className="mood-stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Mood Logs</div>
              <div className="stat-value">{moodAnalysis.totalLogs}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Average Mood Score</div>
              <div className="stat-value">{moodAnalysis.averageMood}/5</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Trend</div>
              <div className={`stat-value trend-${moodAnalysis.trend}`}>
                {moodAnalysis.trend === 'improving' && <TrendingUp size={20} />}
                {moodAnalysis.trend === 'declining' && <TrendingDown size={20} />}
                {moodAnalysis.trend === 'stable' && '—'}
                {moodAnalysis.trend === 'improving' && ' Improving'}
                {moodAnalysis.trend === 'declining' && ' Declining'}
                {moodAnalysis.trend === 'stable' && ' Stable'}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Mood Distribution */}
      {moodAnalysis.totalLogs > 0 && (
        <section className="mood-distribution">
          <h2><BarChart3 size={24} /> Mood Distribution</h2>
          <div className="distribution-chart">
            {Object.entries(moodAnalysis.moodDistribution).map(([mood, count]) => {
              const percentage = (count / moodAnalysis.totalLogs) * 100
              return (
                <div key={mood} className="distribution-bar">
                  <div className="bar-header">
                    <span className="mood-emoji">{mood}</span>
                    <span className="bar-count">{count} times ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Weekly Pattern */}
      {moodAnalysis.totalLogs > 0 && moodAnalysis.weeklyPattern.some(p => p.count > 0) && (
        <section className="weekly-pattern">
          <h2><Calendar size={24} /> Weekly Mood Pattern</h2>
          <div className="weekly-chart">
            {moodAnalysis.weeklyPattern.map((day, index) => (
              <div key={index} className="week-day">
                <div className="day-name">{day.dayName.slice(0, 3)}</div>
                <div className="day-score-bar">
                  <div 
                    className="score-fill" 
                    style={{ height: `${(day.avgScore / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="day-score">{day.avgScore.toFixed(1)}</div>
                <div className="day-count">{day.count} logs</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Correlations */}
      <section className="correlations-section">
        <h2><Lightbulb size={24} /> {t('emotionInsights.correlationsInsights')}</h2>
        {correlations.length === 0 ? (
          <div className="empty-state">
            <p>{t('emotionInsights.logMoreData')}</p>
          </div>
        ) : (
          <div className="correlations-grid">
            {correlations.map((correlation, index) => (
              <div key={index} className={`correlation-card ${correlation.correlation}`}>
                <div className="correlation-icon">
                  {correlation.factor === 'Sleep Quality' && <Moon size={24} />}
                  {correlation.factor === 'Physical Activity' && <Activity size={24} />}
                  {correlation.factor === 'Food Impact' && <Apple size={24} />}
                </div>
                <div className="correlation-title">{correlation.factor}</div>
                <div className="correlation-finding">{correlation.finding}</div>
                <div className="correlation-description">{correlation.description}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Journal Insights */}
      {journalInsights && (
        <section className="journal-insights-section">
          <h2><BookOpen size={24} /> {t('emotionInsights.journalSentiment')}</h2>
          <div className="journal-insight-card">
            <div className="journal-stat">
              <div className="stat-label">{t('emotionInsights.totalEntries')}</div>
              <div className="stat-value">{journalInsights.totalEntries}</div>
            </div>
            <div className="journal-stat">
              <div className="stat-label">{t('emotionInsights.averageSentiment')}</div>
              <div className={`stat-value sentiment-${journalInsights.averageSentiment}`}>
                {t(`emotionInsights.${journalInsights.averageSentiment}`)}
              </div>
            </div>
            <div className="journal-insight">
              <Lightbulb size={20} />
              <p>
                {journalInsights.averageSentiment === 'neutral' && t('emotionInsights.balancedTone')}
                {journalInsights.averageSentiment === 'positive' && t('emotionInsights.positiveTone')}
                {journalInsights.averageSentiment === 'negative' && t('emotionInsights.negativeTone')}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Mood Insights */}
      {moodAnalysis.insights.length > 0 && (
        <section className="insights-section">
          <h2><Brain size={24} /> Key Insights</h2>
          <div className="insights-list">
            {moodAnalysis.insights.map((insight, index) => (
              <div key={index} className={`insight-card ${insight.type}`}>
                <div className="insight-title">{insight.title}</div>
                <div className="insight-description">{insight.description}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations */}
      <section className="recommendations-section">
        <h2><Lightbulb size={24} /> {t('emotionInsights.recommendations')}</h2>
        <div className="recommendations-grid">
          {moodAnalysis.averageMood && parseFloat(moodAnalysis.averageMood) < 3 && (
            <div className="recommendation-card">
              <h3>Mood Support</h3>
              <p>Your average mood is lower. Consider:</p>
              <ul>
                <li>Regular exercise and physical activity</li>
                <li>Consistent sleep schedule</li>
                <li>Mindfulness and meditation practices</li>
                <li>Connecting with loved ones</li>
                <li>Seeking professional support if needed</li>
              </ul>
            </div>
          )}
          
          {correlations.some(c => c.factor === 'Sleep Quality' && c.correlation === 'negative') && (
            <div className="recommendation-card">
              <h3>Sleep & Mood Connection</h3>
              <p>Improving your sleep may positively impact your mood:</p>
              <ul>
                <li>Aim for 7-9 hours of quality sleep</li>
                <li>Maintain a consistent sleep schedule</li>
                <li>Create a relaxing bedtime routine</li>
                <li>Limit screen time before bed</li>
              </ul>
            </div>
          )}

          {correlations.some(c => c.factor === 'Physical Activity' && c.correlation === 'positive') && (
            <div className="recommendation-card">
              <h3>Keep Moving!</h3>
              <p>Physical activity is helping your mood. Continue:</p>
              <ul>
                <li>Maintaining regular exercise routine</li>
                <li>Finding activities you enjoy</li>
                <li>Setting achievable activity goals</li>
                <li>Tracking your progress</li>
              </ul>
            </div>
          )}

          {moodAnalysis.totalLogs < 7 && (
            <div className="recommendation-card">
              <h3>{t('emotionInsights.buildYourData')}</h3>
              <p>{t('emotionInsights.logMoreMoods')}</p>
              <ul>
                <li>{t('emotionInsights.logMoodDaily')}</li>
                <li>{t('emotionInsights.trackMealMoods')}</li>
                <li>{t('emotionInsights.noteFactors')}</li>
                <li>{t('emotionInsights.reviewPatterns')}</li>
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default EmotionInsights



}

export default EmotionInsights


