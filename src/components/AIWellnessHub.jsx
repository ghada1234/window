import { useState, useEffect, useMemo } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Sparkles, MessageCircle, BarChart3, Target, Send, TrendingUp, TrendingDown, Brain, Droplet, Moon, Heart, Activity, AlertCircle, RefreshCw } from 'lucide-react'
import { generateWellnessRecommendations, generateWellnessChatResponse, generateWellnessInsights, isGeminiConfigured } from '../utils/gemini'
import { useTranslation } from 'react-i18next'
import './AIWellnessHub.css'

const AIWellnessHub = () => {
  const { t } = useTranslation()
  const { activities, sleepLogs, moodLogs, waterIntake, nutrition } = useWellness()
  const [activeTab, setActiveTab] = useState('recommendations')
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [aiInsights, setAiInsights] = useState(null)
  const [recommendationsError, setRecommendationsError] = useState(null)
  const geminiConfigured = isGeminiConfigured()

  // Prepare user data for AI analysis
  const userData = useMemo(() => {
    const avgSleep = sleepLogs.length > 0 
      ? sleepLogs.reduce((sum, log) => {
          const hours = parseFloat(log.durationHours || log.duration?.replace(' hours', '') || '0')
          return sum + hours
        }, 0) / sleepLogs.length
      : null

    const moodMap = { 'Excellent': 5, 'Good': 4, 'Okay': 3, 'Low': 2, 'Poor': 1 }
    const avgMood = moodLogs.length > 0
      ? moodLogs.reduce((sum, log) => {
          const moodValue = moodMap[log.mood] || 3
          return sum + moodValue
        }, 0) / moodLogs.length
      : null

    return {
      activities: activities || [],
      sleepLogs: sleepLogs || [],
      moodLogs: moodLogs || [],
      waterIntake: waterIntake || { glasses: 0, goal: 8 },
      nutrition: nutrition || { calories: 0, entries: [] },
      avgSleep: avgSleep ? avgSleep.toFixed(1) : null,
      avgMood: avgMood ? avgMood.toFixed(1) : null
    }
  }, [activities, sleepLogs, moodLogs, waterIntake, nutrition])

  // Load AI recommendations on mount or when data changes
  useEffect(() => {
    if (activeTab === 'recommendations' && recommendations.length === 0 && !isLoadingRecommendations) {
      if (geminiConfigured) {
        loadAIRecommendations()
      } else {
        // Use default recommendations if Gemini not configured
        setRecommendations(defaultRecommendations)
      }
    }
  }, [geminiConfigured, activeTab]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load AI insights when insights tab is opened
  useEffect(() => {
    if (geminiConfigured && activeTab === 'insights' && !aiInsights && !isLoadingInsights) {
      loadAIInsights()
    }
  }, [geminiConfigured, activeTab]) // eslint-disable-line react-hooks/exhaustive-deps

  // Add/update initial message when assistant tab is opened or language changes
  useEffect(() => {
    if (activeTab === 'assistant') {
      const initialMessage = {
        id: 1, // Fixed ID for initial message
        type: 'assistant',
        text: t('aiHub.assistantTab.initialMessage'),
        timestamp: new Date()
      }
      
      // If no messages or only the initial message, set/update it
      if (messages.length === 0) {
        setMessages([initialMessage])
      } else if (messages.length === 1 && messages[0].id === 1) {
        // Update the initial message text when language changes
        setMessages([initialMessage])
      }
    }
  }, [activeTab, t]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadAIRecommendations = async () => {
    if (!geminiConfigured) {
      setRecommendationsError('Gemini API not configured')
      return
    }

    setIsLoadingRecommendations(true)
    setRecommendationsError(null)

    try {
      const aiRecs = await generateWellnessRecommendations(userData)
      if (aiRecs && aiRecs.length > 0) {
        // Add IDs to recommendations
        const recsWithIds = aiRecs.map((rec, index) => ({
          ...rec,
          id: index + 1
        }))
        setRecommendations(recsWithIds)
      } else {
        // Fallback to default recommendations
        setRecommendations(defaultRecommendations)
      }
    } catch (error) {
      console.error('Failed to load AI recommendations:', error)
      setRecommendationsError('Failed to generate AI recommendations. Using default recommendations.')
      setRecommendations(defaultRecommendations)
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  const loadAIInsights = async () => {
    if (!geminiConfigured) {
      return
    }

    setIsLoadingInsights(true)

    try {
      const insights = await generateWellnessInsights(userData)
      if (insights) {
        setAiInsights(insights)
      }
    } catch (error) {
      console.error('Failed to load AI insights:', error)
    } finally {
      setIsLoadingInsights(false)
    }
  }

  // Default recommendations fallback
  const defaultRecommendations = [
    {
      id: 1,
      title: t('aiHub.defaultRecommendations.sleep.title'),
      priority: t('aiHub.defaultRecommendations.sleep.priority'),
      impact: t('aiHub.defaultRecommendations.sleep.impact'),
      duration: t('aiHub.defaultRecommendations.sleep.duration'),
      description: t('aiHub.defaultRecommendations.sleep.description'),
      actions: t('aiHub.defaultRecommendations.sleep.actions', { returnObjects: true })
    },
    {
      id: 2,
      title: t('aiHub.defaultRecommendations.activity.title'),
      priority: t('aiHub.defaultRecommendations.activity.priority'),
      impact: t('aiHub.defaultRecommendations.activity.impact'),
      duration: t('aiHub.defaultRecommendations.activity.duration'),
      description: t('aiHub.defaultRecommendations.activity.description'),
      actions: t('aiHub.defaultRecommendations.activity.actions', { returnObjects: true })
    },
    {
      id: 3,
      title: t('aiHub.defaultRecommendations.stress.title'),
      priority: t('aiHub.defaultRecommendations.stress.priority'),
      impact: t('aiHub.defaultRecommendations.stress.impact'),
      duration: t('aiHub.defaultRecommendations.stress.duration'),
      description: t('aiHub.defaultRecommendations.stress.description'),
      actions: t('aiHub.defaultRecommendations.stress.actions', { returnObjects: true })
    },
    {
      id: 4,
      title: t('aiHub.defaultRecommendations.nutrition.title'),
      priority: t('aiHub.defaultRecommendations.nutrition.priority'),
      impact: t('aiHub.defaultRecommendations.nutrition.impact'),
      duration: t('aiHub.defaultRecommendations.nutrition.duration'),
      description: t('aiHub.defaultRecommendations.nutrition.description'),
      actions: t('aiHub.defaultRecommendations.nutrition.actions', { returnObjects: true })
    }
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMsg = inputMessage.trim()
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: userMsg,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoadingChat(true)

    try {
      let aiResponse
      
      if (geminiConfigured) {
        // Use Gemini AI for real responses
        aiResponse = await generateWellnessChatResponse(userMsg, userData)
        
        // Fallback to default if Gemini fails
        if (!aiResponse) {
          aiResponse = generateDefaultResponse(userMsg)
        }
      } else {
        // Fallback to default responses if Gemini not configured
        aiResponse = generateDefaultResponse(userMsg)
      }

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: aiResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to get AI response:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: t('aiHub.assistantTab.errorMessage'),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoadingChat(false)
    }
  }

  const generateDefaultResponse = (userMessage) => {
    const message = userMessage.toLowerCase()
    
    // Check for keywords in both English and Arabic
    if (message.includes('sleep') || message.includes('نوم')) {
      return t('aiHub.assistantTab.responses.sleep')
    }
    if (message.includes('mood') || message.includes('feel') || message.includes('مزاج') || message.includes('شعور')) {
      return t('aiHub.assistantTab.responses.mood')
    }
    if (message.includes('activity') || message.includes('exercise') || message.includes('workout') || message.includes('نشاط') || message.includes('تمرين')) {
      return t('aiHub.assistantTab.responses.activity')
    }
    if (message.includes('nutrition') || message.includes('food') || message.includes('calorie') || message.includes('تغذية') || message.includes('طعام')) {
      return t('aiHub.assistantTab.responses.nutrition')
    }
    if (message.includes('goal') || message.includes('improve') || message.includes('هدف') || message.includes('تحسين')) {
      return t('aiHub.assistantTab.responses.goal')
    }
    if (message.includes('hello') || message.includes('hi') || message.includes('مرحبا')) {
      return t('aiHub.assistantTab.responses.hello')
    }
    
    return t('aiHub.assistantTab.responses.default')
  }

  const getPriorityColor = (priority) => {
    if (priority.includes('High') || priority.includes('عالية')) return 'high'
    if (priority.includes('Medium') || priority.includes('متوسطة')) return 'medium'
    return 'low'
  }

  const getImpactColor = (impact) => {
    if (impact.includes('High') || impact.includes('عالٍ')) return 'high'
    if (impact.includes('Medium') || impact.includes('متوسط')) return 'medium'
    return 'low'
  }

  const translatePriority = (priority) => {
    if (priority.includes('High')) return t('aiHub.priorities.high')
    if (priority.includes('Medium')) return t('aiHub.priorities.medium')
    if (priority.includes('Low')) return t('aiHub.priorities.low')
    return priority
  }

  const translateImpact = (impact) => {
    if (impact.includes('High')) return t('aiHub.impacts.high')
    if (impact.includes('Medium')) return t('aiHub.impacts.medium')
    if (impact.includes('Low')) return t('aiHub.impacts.low')
    return impact
  }

  const handleAddToPlan = (recommendation) => {
    // Save to habits/goals or show success message
    alert(`✅ "${recommendation.title}" ${t('aiHub.recommendationsTab.addedToPlan') || 'added to your plan!'}`)
  }

  const handleTellMore = (recommendation) => {
    // Switch to assistant tab and ask about this recommendation
    setActiveTab('assistant')
    setInputMessage(t('aiHub.recommendationsTab.tellMoreQuestion', { 
      title: recommendation.title 
    }) || `Tell me more about: ${recommendation.title}`)
  }

  return (
    <div className="ai-wellness-hub">
      <header className="page-header">
        <h1>{t('aiHub.title')}</h1>
        <p>{t('aiHub.subtitle')}</p>
      </header>

      <div className="hub-tabs">
        <button 
          className={`tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          <Target size={20} />
          <span>{t('aiHub.tabs.recommendations')}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'assistant' ? 'active' : ''}`}
          onClick={() => setActiveTab('assistant')}
        >
          <MessageCircle size={20} />
          <span>{t('aiHub.tabs.assistant')}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <BarChart3 size={20} />
          <span>{t('aiHub.tabs.insights')}</span>
        </button>
      </div>

      {activeTab === 'recommendations' && (
        <div className="recommendations-section">
          <div className="section-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2>{t('aiHub.recommendationsTab.title')}</h2>
                <p>{t('aiHub.recommendationsTab.subtitle')}</p>
              </div>
              {geminiConfigured && (
                <button 
                  className="refresh-recommendations-btn"
                  onClick={loadAIRecommendations}
                  disabled={isLoadingRecommendations}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: 'var(--primary-color)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px',
                    cursor: isLoadingRecommendations ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <RefreshCw size={16} className={isLoadingRecommendations ? 'spinning' : ''} />
                  <span>{t('aiHub.recommendationsTab.refreshAnalysis')}</span>
                </button>
              )}
            </div>
            {!geminiConfigured && (
              <div style={{ 
                padding: '1rem', 
                background: '#fef3c7', 
                border: '1px solid #f59e0b', 
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <AlertCircle size={20} color="#f59e0b" />
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
                  <strong>{t('aiHub.assistantTab.geminiNotConfigured')}</strong>
                  <p style={{ margin: '0.25rem 0 0 0' }}>{t('aiHub.assistantTab.geminiNotConfiguredDesc')}</p>
                </div>
              </div>
            )}
            {recommendationsError && (
              <div style={{ 
                padding: '0.75rem', 
                background: '#fee2e2', 
                border: '1px solid #ef4444', 
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                color: '#991b1b'
              }}>
                {recommendationsError}
              </div>
            )}
            <div className="recommendations-count">
              <span>{t('aiHub.recommendationsTab.recommendationCount', { count: recommendations.length })}</span>
            </div>
          </div>

          {isLoadingRecommendations ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <RefreshCw size={32} className="spinning" style={{ marginBottom: '1rem' }} />
              <p>{t('aiHub.recommendationsTab.loadingMessage')}</p>
            </div>
          ) : (

          <div className="recommendations-list">
            {recommendations.map((rec) => (
              <div key={rec.id} className="recommendation-card">
                <div className="recommendation-header">
                  <h3 className="recommendation-title">{rec.title}</h3>
                  <div className="recommendation-meta">
                    <span className={`priority-badge priority-${getPriorityColor(rec.priority)}`}>
                      {translatePriority(rec.priority)}
                    </span>
                    <span className={`impact-badge impact-${getImpactColor(rec.impact)}`}>
                      {translateImpact(rec.impact)}
                    </span>
                  </div>
                </div>
                
                <div className="recommendation-duration">
                  <span className="duration-label">{t('aiHub.recommendationsTab.duration')}</span>
                  <span className="duration-value">{rec.duration}</span>
                </div>

                <p className="recommendation-description">{rec.description}</p>

                <div className="recommended-actions">
                  <strong>{t('aiHub.recommendationsTab.recommendedActions')}</strong>
                  <ul className="actions-list">
                    {rec.actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>

                <div className="recommendation-actions">
                  <button className="add-plan-btn" onClick={() => handleAddToPlan(rec)}>
                    <span>✨</span>
                    <span>{t('aiHub.recommendationsTab.addToPlan')}</span>
                  </button>
                  <button className="tell-more-btn" onClick={() => handleTellMore(rec)}>
                    <MessageCircle size={18} />
                    <span>{t('aiHub.recommendationsTab.tellMore')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}

      {activeTab === 'assistant' && (
        <div className="assistant-section">
          <div className="assistant-header">
            <div>
              <h2>{t('aiHub.assistantTab.title')}</h2>
              <p>{t('aiHub.assistantTab.subtitle')}</p>
            </div>
            {!geminiConfigured && (
              <div style={{ 
                padding: '1rem', 
                background: '#fef3c7', 
                border: '1px solid #f59e0b', 
                borderRadius: '8px',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <AlertCircle size={20} color="#f59e0b" />
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
                  <strong>{t('aiHub.assistantTab.geminiNotConfigured')}</strong>
                  <p style={{ margin: '0.25rem 0 0 0' }}>{t('aiHub.assistantTab.geminiNotConfiguredDesc')}</p>
                </div>
              </div>
            )}
            {geminiConfigured && (
              <div style={{ 
                padding: '0.75rem 1rem', 
                background: '#d1fae5', 
                border: '1px solid #10b981', 
                borderRadius: '8px',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: '#065f46'
              }}>
                <Sparkles size={16} color="#10b981" />
                <span><strong>{t('aiHub.assistantTab.geminiConfigured')}</strong> - {t('aiHub.assistantTab.geminiConfiguredDesc')}</span>
              </div>
            )}
          </div>
          
          <div className="chat-container">
            <div className="chat-messages">
              {messages.map((message) => (
                <div key={message.id} className={`chat-message ${message.type}`}>
                  <div className="message-content">
                    {message.type === 'assistant' && (
                      <div className="message-avatar">
                        <Sparkles size={20} />
                      </div>
                    )}
                    <div className="message-text">
                      <p>{message.text}</p>
                      {message.timestamp && (
                        <span className="message-time">
                          {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="chat-input-container">
              <input
                type="text"
                className="chat-input"
                placeholder={t('aiHub.assistantTab.placeholder')}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && inputMessage.trim()) {
                    handleSendMessage()
                  }
                }}
              />
              <button 
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoadingChat}
              >
                {isLoadingChat ? (
                  <>
                    <RefreshCw size={20} className="spinning" />
                    <span>{t('aiHub.assistantTab.thinking')}</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>{t('aiHub.assistantTab.send')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="insights-section">
          <div className="insights-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2>Wellness Insights</h2>
                <p>Deep analytics and trends from your wellness journey</p>
              </div>
              {geminiConfigured && (
                <button 
                  className="refresh-recommendations-btn"
                  onClick={loadAIInsights}
                  disabled={isLoadingInsights}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: 'var(--primary-color)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px',
                    cursor: isLoadingInsights ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <RefreshCw size={16} className={isLoadingInsights ? 'spinning' : ''} />
                  <span>{t('aiHub.insightsTab.refreshAnalysis')}</span>
                </button>
              )}
            </div>
            {!geminiConfigured && (
              <div style={{ 
                padding: '1rem', 
                background: '#fef3c7', 
                border: '1px solid #f59e0b', 
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <AlertCircle size={20} color="#f59e0b" />
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
                  <strong>{t('aiHub.insightsTab.geminiNotConfigured')}</strong>
                  <p style={{ margin: '0.25rem 0 0 0' }}>{t('aiHub.insightsTab.geminiNotConfiguredDesc')}</p>
                </div>
              </div>
            )}
          </div>

          {isLoadingInsights ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <RefreshCw size={32} className="spinning" style={{ marginBottom: '1rem' }} />
              <p>{t('aiHub.insightsTab.loadingMessage')}</p>
            </div>
          ) : (
            <>
              {/* Correlation Analysis */}
              <div className="correlation-section">
                <h3>{t('aiHub.insightsTab.correlationAnalysis')}</h3>
                <p className="section-subtitle">{t('aiHub.insightsTab.correlationSubtitle')}</p>
                
                <div className="correlation-cards">
                  {(aiInsights?.correlations && aiInsights.correlations.length > 0) ? (
                    aiInsights.correlations.map((corr, index) => {
                      const strengthClass = corr.strength?.includes('Strong') ? 'positive' : 
                                           corr.strength?.includes('Moderate') ? 'moderate' : 'negative'
                      return (
                        <div key={index} className="correlation-card">
                          <div className="correlation-header">
                            <div className="correlation-title">
                              <Moon size={20} />
                              <Heart size={20} />
                              <span>{corr.type || 'Wellness Correlation'}</span>
                            </div>
                            <span className={`correlation-strength ${strengthClass}`}>
                              {corr.strength || 'Positive'}
                            </span>
                          </div>
                          <p className="correlation-finding">
                            {corr.finding || 'Analysis of wellness patterns'}
                          </p>
                          <div className="correlation-recommendation">
                            <span>💡</span>
                            <span><strong>Recommendation:</strong> {corr.recommendation || 'Continue tracking your wellness patterns'}</span>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    // Default correlations if no AI insights
                    <>
                      <div className="correlation-card">
                        <div className="correlation-header">
                          <div className="correlation-title">
                            <Moon size={20} />
                            <Heart size={20} />
                            <span>{t('aiHub.insightsTab.defaultCorrelations.sleepMood.title')}</span>
                          </div>
                          <span className="correlation-strength positive">{t('aiHub.insightsTab.defaultCorrelations.sleepMood.strength')}</span>
                        </div>
                        <p className="correlation-finding">
                          {t('aiHub.insightsTab.defaultCorrelations.sleepMood.finding')}
                        </p>
                        <div className="correlation-recommendation">
                          <span>💡</span>
                          <span><strong>{t('aiHub.insightsTab.recommendation')}:</strong> {t('aiHub.insightsTab.defaultCorrelations.sleepMood.recommendation')}</span>
                        </div>
                      </div>

                      <div className="correlation-card">
                        <div className="correlation-header">
                          <div className="correlation-title">
                            <Activity size={20} />
                            <Moon size={20} />
                            <span>{t('aiHub.insightsTab.defaultCorrelations.activitySleep.title')}</span>
                          </div>
                          <span className="correlation-strength moderate">{t('aiHub.insightsTab.defaultCorrelations.activitySleep.strength')}</span>
                        </div>
                        <p className="correlation-finding">
                          {t('aiHub.insightsTab.defaultCorrelations.activitySleep.finding')}
                        </p>
                        <div className="correlation-recommendation">
                          <span>💡</span>
                          <span><strong>{t('aiHub.insightsTab.recommendation')}:</strong> {t('aiHub.insightsTab.defaultCorrelations.activitySleep.recommendation')}</span>
                        </div>
                      </div>

                      <div className="correlation-card">
                        <div className="correlation-header">
                          <div className="correlation-title">
                            <Brain size={20} />
                            <span>{t('aiHub.insightsTab.defaultCorrelations.meditationStress.title')}</span>
                          </div>
                          <span className="correlation-strength negative">{t('aiHub.insightsTab.defaultCorrelations.meditationStress.strength')}</span>
                        </div>
                        <p className="correlation-finding">
                          {t('aiHub.insightsTab.defaultCorrelations.meditationStress.finding')}
                        </p>
                        <div className="correlation-recommendation">
                          <span>💡</span>
                          <span><strong>{t('aiHub.insightsTab.recommendation')}:</strong> {t('aiHub.insightsTab.defaultCorrelations.meditationStress.recommendation')}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Predictive Insights */}
              <div className="predictive-section">
                <h3>{t('aiHub.insightsTab.predictiveInsights')}</h3>
                <p className="section-subtitle">{t('aiHub.insightsTab.predictiveSubtitle')}</p>
                
                <div className="predictive-cards">
                  {(aiInsights?.predictions && aiInsights.predictions.length > 0) ? (
                    aiInsights.predictions.map((pred, index) => (
                      <div key={index} className="predictive-card">
                        <div className="predictive-header">
                          <div>
                            <h4>{pred.title || 'Wellness Prediction'}</h4>
                            <span className="confidence-badge">{pred.confidence || '80%'} Confidence</span>
                          </div>
                        </div>
                        <p className="predictive-text">
                          {pred.prediction || 'Based on your wellness patterns'}
                        </p>
                        <div className="predictive-action">
                          <span>🎯</span>
                          <span><strong>Action:</strong> {pred.action || 'Continue your wellness journey'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Default predictions if no AI insights
                    <>
                      <div className="predictive-card">
                        <div className="predictive-header">
                          <div>
                            <h4>{t('aiHub.insightsTab.defaultPredictions.sleep.title')}</h4>
                            <span className="confidence-badge">{t('aiHub.insightsTab.defaultPredictions.sleep.confidence')} {t('aiHub.insightsTab.confidence')}</span>
                          </div>
                        </div>
                        <p className="predictive-text">
                          {t('aiHub.insightsTab.defaultPredictions.sleep.prediction')}
                        </p>
                        <div className="predictive-action">
                          <span>🎯</span>
                          <span><strong>{t('aiHub.insightsTab.action')}:</strong> {t('aiHub.insightsTab.defaultPredictions.sleep.action')}</span>
                        </div>
                      </div>

                      <div className="predictive-card">
                        <div className="predictive-header">
                          <div>
                            <h4>{t('aiHub.insightsTab.defaultPredictions.weight.title')}</h4>
                            <span className="confidence-badge">{t('aiHub.insightsTab.defaultPredictions.weight.confidence')} {t('aiHub.insightsTab.confidence')}</span>
                          </div>
                        </div>
                        <p className="predictive-text">
                          {t('aiHub.insightsTab.defaultPredictions.weight.prediction')}
                        </p>
                        <div className="predictive-action">
                          <span>🎯</span>
                          <span><strong>{t('aiHub.insightsTab.action')}:</strong> {t('aiHub.insightsTab.defaultPredictions.weight.action')}</span>
                        </div>
                      </div>

                      <div className="predictive-card">
                        <div className="predictive-header">
                          <div>
                            <h4>{t('aiHub.insightsTab.defaultPredictions.mood.title')}</h4>
                            <span className="confidence-badge">{t('aiHub.insightsTab.defaultPredictions.mood.confidence')} {t('aiHub.insightsTab.confidence')}</span>
                          </div>
                        </div>
                        <p className="predictive-text">
                          {t('aiHub.insightsTab.defaultPredictions.mood.prediction')}
                        </p>
                        <div className="predictive-action">
                          <span>🎯</span>
                          <span><strong>{t('aiHub.insightsTab.action')}:</strong> {t('aiHub.insightsTab.defaultPredictions.mood.action')}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Interactive Dashboards */}
          <div className="dashboards-section">
            <h3>{t('aiHub.insightsTab.interactiveDashboards')}</h3>
            <p className="section-subtitle">{t('aiHub.insightsTab.dashboardsSubtitle')}</p>
            
            <div className="dashboard-metrics">
              <div className="metric-card">
                <div className="metric-header">
                  <Brain size={20} />
                  <span>{t('aiHub.insightsTab.dashboards.moodTrend')}</span>
                </div>
                <div className="metric-value">4.2</div>
                <div className="metric-change positive">
                  <TrendingUp size={16} />
                  <span>+0.3 {t('aiHub.insightsTab.fromLastWeek')}</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Moon size={20} />
                  <span>{t('aiHub.insightsTab.dashboards.sleepQuality')}</span>
                </div>
                <div className="metric-value">7.5h</div>
                <div className="metric-change positive">
                  <TrendingUp size={16} />
                  <span>+0.5h {t('aiHub.insightsTab.fromLastWeek')}</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Activity size={20} />
                  <span>{t('aiHub.insightsTab.dashboards.activity')}</span>
                </div>
                <div className="metric-value">6,240</div>
                <div className="metric-change">
                  <span>{t('aiHub.insightsTab.stepsToday')}</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Droplet size={20} />
                  <span>{t('aiHub.insightsTab.dashboards.waterIntake')}</span>
                </div>
                <div className="metric-value">{waterIntake.glasses}/{waterIntake.goal}</div>
                <div className="metric-change">
                  <span>{t('aiHub.insightsTab.glassesToday')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wellness Reports */}
          <div className="wellness-reports-section">
            <h3>{t('aiHub.insightsTab.wellnessReports')}</h3>
            <p className="section-subtitle">{t('aiHub.insightsTab.reportsSubtitle')}</p>
            
            <div className="reports-grid">
              <div className="report-goal-card">
                <div className="goal-header">
                  <Brain size={24} />
                  <h4>{t('aiHub.insightsTab.reports.dailyMeditation')}</h4>
                </div>
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: '71%' }}></div>
                </div>
                <div className="goal-stats">
                  <span>5/7 {t('aiHub.insightsTab.daysThisWeek')}</span>
                  <span className="goal-percentage">71%</span>
                </div>
              </div>

              <div className="report-goal-card">
                <div className="goal-header">
                  <Moon size={24} />
                  <h4>{t('aiHub.insightsTab.reports.sleepGoal')}</h4>
                </div>
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: '85%' }}></div>
                </div>
                <div className="goal-stats">
                  <span>{t('aiHub.insightsTab.reports.sevenEightHours')}</span>
                  <span className="goal-percentage">85%</span>
                </div>
              </div>

              <div className="report-goal-card">
                <div className="goal-header">
                  <Droplet size={24} />
                  <h4>{t('aiHub.insightsTab.reports.waterIntakeGoal')}</h4>
                </div>
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: '75%' }}></div>
                </div>
                <div className="goal-stats">
                  <span>{t('aiHub.insightsTab.reports.eightGlasses')}</span>
                  <span className="goal-percentage">75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIWellnessHub


import { useState, useEffect, useMemo } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Sparkles, MessageCircle, BarChart3, Target, Send, TrendingUp, TrendingDown, Brain, Droplet, Moon, Heart, Activity, AlertCircle, RefreshCw } from 'lucide-react'
import { generateWellnessRecommendations, generateWellnessChatResponse, generateWellnessInsights, isGeminiConfigured } from '../utils/gemini'
import './AIWellnessHub.css'

const AIWellnessHub = () => {
  const { activities, sleepLogs, moodLogs, waterIntake, nutrition } = useWellness()
  const [activeTab, setActiveTab] = useState('recommendations')
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: "Hello! I'm your AI Wellness Assistant powered by Gemini AI. How can I help you understand your data or reach your goals today?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [aiInsights, setAiInsights] = useState(null)
  const [recommendationsError, setRecommendationsError] = useState(null)
  const geminiConfigured = isGeminiConfigured()

  // Prepare user data for AI analysis
  const userData = useMemo(() => {
    const avgSleep = sleepLogs.length > 0 
      ? sleepLogs.reduce((sum, log) => {
          const hours = parseFloat(log.durationHours || log.duration?.replace(' hours', '') || '0')
          return sum + hours
        }, 0) / sleepLogs.length
      : null

    const moodMap = { 'Excellent': 5, 'Good': 4, 'Okay': 3, 'Low': 2, 'Poor': 1 }
    const avgMood = moodLogs.length > 0
      ? moodLogs.reduce((sum, log) => {
          const moodValue = moodMap[log.mood] || 3
          return sum + moodValue
        }, 0) / moodLogs.length
      : null

    return {
      activities: activities || [],
      sleepLogs: sleepLogs || [],
      moodLogs: moodLogs || [],
      waterIntake: waterIntake || { glasses: 0, goal: 8 },
      nutrition: nutrition || { calories: 0, entries: [] },
      avgSleep: avgSleep ? avgSleep.toFixed(1) : null,
      avgMood: avgMood ? avgMood.toFixed(1) : null
    }
  }, [activities, sleepLogs, moodLogs, waterIntake, nutrition])

  // Load AI recommendations on mount or when data changes
  useEffect(() => {
    if (activeTab === 'recommendations' && recommendations.length === 0 && !isLoadingRecommendations) {
      if (geminiConfigured) {
        loadAIRecommendations()
      } else {
        // Use default recommendations if Gemini not configured
        setRecommendations(defaultRecommendations)
      }
    }
  }, [geminiConfigured, activeTab]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load AI insights when insights tab is opened
  useEffect(() => {
    if (geminiConfigured && activeTab === 'insights' && !aiInsights && !isLoadingInsights) {
      loadAIInsights()
    }
  }, [geminiConfigured, activeTab]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadAIRecommendations = async () => {
    if (!geminiConfigured) {
      setRecommendationsError('Gemini API not configured')
      return
    }

    setIsLoadingRecommendations(true)
    setRecommendationsError(null)

    try {
      const aiRecs = await generateWellnessRecommendations(userData)
      if (aiRecs && aiRecs.length > 0) {
        // Add IDs to recommendations
        const recsWithIds = aiRecs.map((rec, index) => ({
          ...rec,
          id: index + 1
        }))
        setRecommendations(recsWithIds)
      } else {
        // Fallback to default recommendations
        setRecommendations(defaultRecommendations)
      }
    } catch (error) {
      console.error('Failed to load AI recommendations:', error)
      setRecommendationsError('Failed to generate AI recommendations. Using default recommendations.')
      setRecommendations(defaultRecommendations)
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  const loadAIInsights = async () => {
    if (!geminiConfigured) {
      return
    }

    setIsLoadingInsights(true)

    try {
      const insights = await generateWellnessInsights(userData)
      if (insights) {
        setAiInsights(insights)
      }
    } catch (error) {
      console.error('Failed to load AI insights:', error)
    } finally {
      setIsLoadingInsights(false)
    }
  }

  // Default recommendations fallback
  const defaultRecommendations = [
    {
      id: 1,
      title: 'Prioritize Consistent Sleep Schedule',
      priority: 'High Priority',
      impact: 'High Impact',
      duration: '1-2 Weeks',
      description: "Your sleep duration of 6.5 hours is below the recommended 7-9 hours for adults, and you've identified 'Improve Sleep' as a goal. Inconsistent sleep can negatively affect mood, energy levels, and overall health. Establishing a regular sleep schedule can improve sleep quality and duration, leading to better mood, focus, and physical health.",
      actions: [
        'Set a consistent bedtime and wake-up time, even on weekends.',
        'Create a relaxing bedtime routine (e.g., reading, taking a warm bath).',
        'Avoid caffeine and alcohol before bed.',
        'Ensure your bedroom is dark, quiet, and cool.'
      ]
    },
    {
      id: 2,
      title: 'Increase Daily Steps Towards Activity Goal',
      priority: 'Medium Priority',
      impact: 'Medium Impact',
      duration: '2-3 Weeks',
      description: "Your daily step count of 4500 is below the recommended 10,000 steps, and you want to 'Be More Active.' Increasing your step count can improve cardiovascular health, boost energy levels, and aid in weight management.",
      actions: [
        'Set a daily step goal that is slightly higher than your current average (e.g., 5000 steps).',
        'Incorporate short walks into your daily routine (e.g., during lunch breaks, after dinner).',
        'Take the stairs instead of the elevator whenever possible.',
        'Find an activity you enjoy, such as dancing or hiking, to make exercise more fun.'
      ]
    },
    {
      id: 3,
      title: 'Incorporate Stress-Reducing Techniques',
      priority: 'Medium Priority',
      impact: 'Medium Impact',
      duration: '1-2 Weeks',
      description: 'Your journal entry indicates feeling stressed at work. Managing stress is crucial for overall well-being. Incorporating stress-reducing techniques can improve mood, reduce anxiety, and enhance cognitive function.',
      actions: [
        'Extend your meditation time to 10-15 minutes daily.',
        'Practice deep breathing exercises for a few minutes each day.',
        'Take short breaks during work to stretch or walk around.',
        'Consider engaging in a hobby you enjoy to unwind after work.'
      ]
    },
    {
      id: 4,
      title: 'Mindful Calorie Tracking',
      priority: 'Low Priority',
      impact: 'Medium Impact',
      duration: 'Ongoing',
      description: "While your calorie intake is within a reasonable range, mindful tracking can help ensure you're meeting your nutritional needs and maintaining a healthy eating pattern. This promotes overall wellness by optimizing energy levels and supporting various bodily functions.",
      actions: [
        'Use a food tracking app or journal to log your meals and snacks.',
        'Focus on eating whole, unprocessed foods.',
        'Pay attention to portion sizes.',
        'Consult a registered dietitian or nutritionist for personalized dietary advice.'
      ]
    }
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMsg = inputMessage.trim()
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: userMsg,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoadingChat(true)

    try {
      let aiResponse
      
      if (geminiConfigured) {
        // Use Gemini AI for real responses
        aiResponse = await generateWellnessChatResponse(userMsg, userData)
        
        // Fallback to default if Gemini fails
        if (!aiResponse) {
          aiResponse = generateDefaultResponse(userMsg)
        }
      } else {
        // Fallback to default responses if Gemini not configured
        aiResponse = generateDefaultResponse(userMsg)
      }

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: aiResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to get AI response:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: "I'm sorry, I encountered an error processing your question. Please try again or ask me about your sleep, mood, activity, or nutrition.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoadingChat(false)
    }
  }

  const generateDefaultResponse = (userMessage) => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('sleep')) {
      return "Based on your recent sleep logs, I notice you're tracking your sleep patterns. Maintaining a consistent sleep schedule is crucial for wellness. Try going to bed and waking up at the same time each day for better sleep quality."
    }
    if (message.includes('mood') || message.includes('feel')) {
      return "Tracking your mood helps identify patterns in your emotional well-being. Regular mood logging can reveal connections between your activities, sleep, and emotional state. Would you like to explore your mood trends?"
    }
    if (message.includes('activity') || message.includes('exercise') || message.includes('workout')) {
      return "Physical activity is a cornerstone of wellness. Aim for at least 30 minutes of moderate activity daily. I can help you set activity goals or analyze your activity patterns if you'd like."
    }
    if (message.includes('nutrition') || message.includes('food') || message.includes('calorie')) {
      return "Nutrition plays a vital role in your overall health. Tracking your meals helps ensure you're meeting your nutritional needs. Would you like recommendations for balanced meal planning?"
    }
    if (message.includes('goal') || message.includes('improve')) {
      return "Setting clear wellness goals is important. Based on your data, I recommend focusing on consistency - whether it's sleep, activity, or mood tracking. Small, consistent steps lead to lasting change."
    }
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! I'm here to help you understand your wellness data and achieve your goals. Feel free to ask me about your sleep, mood, activity, nutrition, or any wellness-related questions!"
    }
    
    return "That's a great question! I'm here to help you understand your wellness journey. Try asking me about your sleep patterns, mood trends, activity levels, nutrition goals, or ways to improve your overall wellness."
  }

  const getPriorityColor = (priority) => {
    if (priority.includes('High')) return 'high'
    if (priority.includes('Medium')) return 'medium'
    return 'low'
  }

  const getImpactColor = (impact) => {
    if (impact.includes('High')) return 'high'
    if (impact.includes('Medium')) return 'medium'
    return 'low'
  }

  return (
    <div className="ai-wellness-hub">
      <header className="page-header">
        <h1>AI Wellness Hub</h1>
        <p>Your intelligent center for personalized insights and recommendations</p>
      </header>

      <div className="hub-tabs">
        <button 
          className={`tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          <Target size={20} />
          <span>Recommendations</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'assistant' ? 'active' : ''}`}
          onClick={() => setActiveTab('assistant')}
        >
          <MessageCircle size={20} />
          <span>AI Assistant</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <BarChart3 size={20} />
          <span>Insights</span>
        </button>
      </div>

      {activeTab === 'recommendations' && (
        <div className="recommendations-section">
          <div className="section-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2>Your Personalized Recommendations</h2>
                <p>AI-powered insights tailored to your wellness journey</p>
              </div>
              {geminiConfigured && (
                <button 
                  className="refresh-recommendations-btn"
                  onClick={loadAIRecommendations}
                  disabled={isLoadingRecommendations}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: 'var(--primary-color)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px',
                    cursor: isLoadingRecommendations ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <RefreshCw size={16} className={isLoadingRecommendations ? 'spinning' : ''} />
                  <span>Refresh AI Analysis</span>
                </button>
              )}
            </div>
            {!geminiConfigured && (
              <div style={{ 
                padding: '1rem', 
                background: '#fef3c7', 
                border: '1px solid #f59e0b', 
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <AlertCircle size={20} color="#f59e0b" />
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
                  <strong>Gemini AI Not Configured</strong>
                  <p style={{ margin: '0.25rem 0 0 0' }}>Configure VITE_GEMINI_API_KEY in your .env file to get AI-powered personalized recommendations.</p>
                </div>
              </div>
            )}
            {recommendationsError && (
              <div style={{ 
                padding: '0.75rem', 
                background: '#fee2e2', 
                border: '1px solid #ef4444', 
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                color: '#991b1b'
              }}>
                {recommendationsError}
              </div>
            )}
            <div className="recommendations-count">
              <span>{recommendations.length} recommendations</span>
            </div>
          </div>

          {isLoadingRecommendations ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <RefreshCw size={32} className="spinning" style={{ marginBottom: '1rem' }} />
              <p>AI is analyzing your wellness data and generating personalized recommendations...</p>
            </div>
          ) : (

          <div className="recommendations-list">
            {recommendations.map((rec) => (
              <div key={rec.id} className="recommendation-card">
                <div className="recommendation-header">
                  <h3 className="recommendation-title">{rec.title}</h3>
                  <div className="recommendation-meta">
                    <span className={`priority-badge priority-${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                    <span className={`impact-badge impact-${getImpactColor(rec.impact)}`}>
                      {rec.impact}
                    </span>
                  </div>
                </div>
                
                <div className="recommendation-duration">
                  <span className="duration-label">Duration:</span>
                  <span className="duration-value">{rec.duration}</span>
                </div>

                <p className="recommendation-description">{rec.description}</p>

                <div className="recommended-actions">
                  <strong>Recommended Actions:</strong>
                  <ul className="actions-list">
                    {rec.actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>

                <div className="recommendation-actions">
                  <button className="add-plan-btn">
                    <span>✨</span>
                    <span>Add to Plan</span>
                  </button>
                  <button className="tell-more-btn">
                    <MessageCircle size={18} />
                    <span>💬 Tell me more</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}

      {activeTab === 'assistant' && (
        <div className="assistant-section">
          <div className="assistant-header">
            <div>
              <h2>Chat with Wellness AI</h2>
              <p>Ask questions, get explanations, and explore your wellness data with AI assistance.</p>
            </div>
            {!geminiConfigured && (
              <div style={{ 
                padding: '1rem', 
                background: '#fef3c7', 
                border: '1px solid #f59e0b', 
                borderRadius: '8px',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <AlertCircle size={20} color="#f59e0b" />
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
                  <strong>Gemini AI Not Configured</strong>
                  <p style={{ margin: '0.25rem 0 0 0' }}>Configure VITE_GEMINI_API_KEY to enable AI-powered chat responses based on your data.</p>
                </div>
              </div>
            )}
            {geminiConfigured && (
              <div style={{ 
                padding: '0.75rem 1rem', 
                background: '#d1fae5', 
                border: '1px solid #10b981', 
                borderRadius: '8px',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: '#065f46'
              }}>
                <Sparkles size={16} color="#10b981" />
                <span><strong>Powered by Gemini AI</strong> - Real-time personalized responses</span>
              </div>
            )}
          </div>
          
          <div className="chat-container">
            <div className="chat-messages">
              {messages.map((message) => (
                <div key={message.id} className={`chat-message ${message.type}`}>
                  <div className="message-content">
                    {message.type === 'assistant' && (
                      <div className="message-avatar">
                        <Sparkles size={20} />
                      </div>
                    )}
                    <div className="message-text">
                      <p>{message.text}</p>
                      {message.timestamp && (
                        <span className="message-time">
                          {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="chat-input-container">
              <input
                type="text"
                className="chat-input"
                placeholder="Ask about your sleep, mood, activity, or wellness goals..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && inputMessage.trim()) {
                    handleSendMessage()
                  }
                }}
              />
              <button 
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoadingChat}
              >
                {isLoadingChat ? (
                  <>
                    <RefreshCw size={20} className="spinning" />
                    <span>AI thinking...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="insights-section">
          <div className="insights-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2>Wellness Insights</h2>
                <p>Deep analytics and trends from your wellness journey</p>
              </div>
              {geminiConfigured && (
                <button 
                  className="refresh-recommendations-btn"
                  onClick={loadAIInsights}
                  disabled={isLoadingInsights}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: 'var(--primary-color)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px',
                    cursor: isLoadingInsights ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <RefreshCw size={16} className={isLoadingInsights ? 'spinning' : ''} />
                  <span>Refresh AI Analysis</span>
                </button>
              )}
            </div>
            {!geminiConfigured && (
              <div style={{ 
                padding: '1rem', 
                background: '#fef3c7', 
                border: '1px solid #f59e0b', 
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <AlertCircle size={20} color="#f59e0b" />
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
                  <strong>Gemini AI Not Configured</strong>
                  <p style={{ margin: '0.25rem 0 0 0' }}>Configure VITE_GEMINI_API_KEY to get AI-powered insights based on your data.</p>
                </div>
              </div>
            )}
          </div>

          {isLoadingInsights ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <RefreshCw size={32} className="spinning" style={{ marginBottom: '1rem' }} />
              <p>AI is analyzing your wellness data and generating insights...</p>
            </div>
          ) : (
            <>
              {/* Correlation Analysis */}
              <div className="correlation-section">
                <h3>🔍 Correlation Analysis</h3>
                <p className="section-subtitle">Key relationships discovered in your wellness data</p>
                
                <div className="correlation-cards">
                  {(aiInsights?.correlations && aiInsights.correlations.length > 0) ? (
                    aiInsights.correlations.map((corr, index) => {
                      const strengthClass = corr.strength?.includes('Strong') ? 'positive' : 
                                           corr.strength?.includes('Moderate') ? 'moderate' : 'negative'
                      return (
                        <div key={index} className="correlation-card">
                          <div className="correlation-header">
                            <div className="correlation-title">
                              <Moon size={20} />
                              <Heart size={20} />
                              <span>{corr.type || 'Wellness Correlation'}</span>
                            </div>
                            <span className={`correlation-strength ${strengthClass}`}>
                              {corr.strength || 'Positive'}
                            </span>
                          </div>
                          <p className="correlation-finding">
                            {corr.finding || 'Analysis of wellness patterns'}
                          </p>
                          <div className="correlation-recommendation">
                            <span>💡</span>
                            <span><strong>Recommendation:</strong> {corr.recommendation || 'Continue tracking your wellness patterns'}</span>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    // Default correlations if no AI insights
                    <>
                      <div className="correlation-card">
                        <div className="correlation-header">
                          <div className="correlation-title">
                            <Moon size={20} />
                            <Heart size={20} />
                            <span>Sleep ↔ Mood</span>
                          </div>
                          <span className="correlation-strength positive">Strong Positive</span>
                        </div>
                        <p className="correlation-finding">
                          Users who sleep 7+ hours report 42% better mood scores the next day
                        </p>
                        <div className="correlation-recommendation">
                          <span>💡</span>
                          <span><strong>Recommendation:</strong> Maintain consistent 7-8 hour sleep schedule</span>
                        </div>
                      </div>

                      <div className="correlation-card">
                        <div className="correlation-header">
                          <div className="correlation-title">
                            <Activity size={20} />
                            <Moon size={20} />
                            <span>Activity ↔ Sleep Quality</span>
                          </div>
                          <span className="correlation-strength moderate">Moderate Positive</span>
                        </div>
                        <p className="correlation-finding">
                          10,000+ daily steps associated with 28% better sleep quality
                        </p>
                        <div className="correlation-recommendation">
                          <span>💡</span>
                          <span><strong>Recommendation:</strong> Exercise earlier in the day for better sleep</span>
                        </div>
                      </div>

                      <div className="correlation-card">
                        <div className="correlation-header">
                          <div className="correlation-title">
                            <Brain size={20} />
                            <span>Meditation ↔ Stress</span>
                          </div>
                          <span className="correlation-strength negative">Strong Negative</span>
                        </div>
                        <p className="correlation-finding">
                          15+ minutes daily meditation reduces stress levels by 35%
                        </p>
                        <div className="correlation-recommendation">
                          <span>💡</span>
                          <span><strong>Recommendation:</strong> Practice meditation regularly for stress management</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Predictive Insights */}
              <div className="predictive-section">
                <h3>📈 Predictive Insights</h3>
                <p className="section-subtitle">AI predictions based on your wellness patterns</p>
                
                <div className="predictive-cards">
                  {(aiInsights?.predictions && aiInsights.predictions.length > 0) ? (
                    aiInsights.predictions.map((pred, index) => (
                      <div key={index} className="predictive-card">
                        <div className="predictive-header">
                          <div>
                            <h4>{pred.title || 'Wellness Prediction'}</h4>
                            <span className="confidence-badge">{pred.confidence || '80%'} Confidence</span>
                          </div>
                        </div>
                        <p className="predictive-text">
                          {pred.prediction || 'Based on your wellness patterns'}
                        </p>
                        <div className="predictive-action">
                          <span>🎯</span>
                          <span><strong>Action:</strong> {pred.action || 'Continue your wellness journey'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Default predictions if no AI insights
                    <>
                      <div className="predictive-card">
                        <div className="predictive-header">
                          <div>
                            <h4>Next 7 Days - Sleep</h4>
                            <span className="confidence-badge">85% Confidence</span>
                          </div>
                        </div>
                        <p className="predictive-text">
                          Based on your current trends, sleep quality likely to improve by 15% with consistent bedtime
                        </p>
                        <div className="predictive-action">
                          <span>🎯</span>
                          <span><strong>Action:</strong> Go to bed at same time for next 7 days</span>
                        </div>
                      </div>

                      <div className="predictive-card">
                        <div className="predictive-header">
                          <div>
                            <h4>Next Month - Weight Goal</h4>
                            <span className="confidence-badge">78% Confidence</span>
                          </div>
                        </div>
                        <p className="predictive-text">
                          Current nutrition and activity patterns suggest 2-3kg progress toward goal
                        </p>
                        <div className="predictive-action">
                          <span>🎯</span>
                          <span><strong>Action:</strong> Use AI Meal Planner for consistent nutrition</span>
                        </div>
                      </div>

                      <div className="predictive-card">
                        <div className="predictive-header">
                          <div>
                            <h4>Next Week - Mood Trend</h4>
                            <span className="confidence-badge">92% Confidence</span>
                          </div>
                        </div>
                        <p className="predictive-text">
                          Meditation habit forming - expect 20% mood improvement with continued practice
                        </p>
                        <div className="predictive-action">
                          <span>🎯</span>
                          <span><strong>Action:</strong> Maintain daily meditation streak</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Interactive Dashboards */}
          <div className="dashboards-section">
            <h3>📊 Interactive Dashboards</h3>
            <p className="section-subtitle">Real-time data visualization with customizable charts</p>
            
            <div className="dashboard-metrics">
              <div className="metric-card">
                <div className="metric-header">
                  <Brain size={20} />
                  <span>Mood Trend</span>
                </div>
                <div className="metric-value">4.2</div>
                <div className="metric-change positive">
                  <TrendingUp size={16} />
                  <span>+0.3 from last week</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Moon size={20} />
                  <span>Sleep Quality</span>
                </div>
                <div className="metric-value">7.5h</div>
                <div className="metric-change positive">
                  <TrendingUp size={16} />
                  <span>+0.5h from last week</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Activity size={20} />
                  <span>Activity</span>
                </div>
                <div className="metric-value">6,240</div>
                <div className="metric-change">
                  <span>steps today</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Droplet size={20} />
                  <span>Water Intake</span>
                </div>
                <div className="metric-value">{waterIntake.glasses}/{waterIntake.goal}</div>
                <div className="metric-change">
                  <span>glasses today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wellness Reports */}
          <div className="wellness-reports-section">
            <h3>📋 Wellness Reports</h3>
            <p className="section-subtitle">Your comprehensive wellness summary with goal progress tracking</p>
            
            <div className="reports-grid">
              <div className="report-goal-card">
                <div className="goal-header">
                  <Brain size={24} />
                  <h4>Daily Meditation</h4>
                </div>
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: '71%' }}></div>
                </div>
                <div className="goal-stats">
                  <span>5/7 days this week</span>
                  <span className="goal-percentage">71%</span>
                </div>
              </div>

              <div className="report-goal-card">
                <div className="goal-header">
                  <Moon size={24} />
                  <h4>Sleep Goal</h4>
                </div>
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: '85%' }}></div>
                </div>
                <div className="goal-stats">
                  <span>7-8 hours nightly</span>
                  <span className="goal-percentage">85%</span>
                </div>
              </div>

              <div className="report-goal-card">
                <div className="goal-header">
                  <Droplet size={24} />
                  <h4>Water Intake</h4>
                </div>
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: '75%' }}></div>
                </div>
                <div className="goal-stats">
                  <span>8 glasses daily</span>
                  <span className="goal-percentage">75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIWellnessHub


                <div className="goal-header">
                  <Droplet size={24} />
                  <h4>{t('aiHub.insightsTab.reports.waterIntakeGoal')}</h4>
                </div>
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: '75%' }}></div>
                </div>
                <div className="goal-stats">
                  <span>{t('aiHub.insightsTab.reports.eightGlasses')}</span>
                  <span className="goal-percentage">75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIWellnessHub


import { useState, useEffect, useMemo } from 'react'
import { useWellness } from '../context/WellnessContext'
import { Sparkles, MessageCircle, BarChart3, Target, Send, TrendingUp, TrendingDown, Brain, Droplet, Moon, Heart, Activity, AlertCircle, RefreshCw } from 'lucide-react'
import { generateWellnessRecommendations, generateWellnessChatResponse, generateWellnessInsights, isGeminiConfigured } from '../utils/gemini'
import './AIWellnessHub.css'

const AIWellnessHub = () => {
  const { activities, sleepLogs, moodLogs, waterIntake, nutrition } = useWellness()
  const [activeTab, setActiveTab] = useState('recommendations')
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: "Hello! I'm your AI Wellness Assistant powered by Gemini AI. How can I help you understand your data or reach your goals today?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [aiInsights, setAiInsights] = useState(null)
  const [recommendationsError, setRecommendationsError] = useState(null)
  const geminiConfigured = isGeminiConfigured()

  // Prepare user data for AI analysis
  const userData = useMemo(() => {
    const avgSleep = sleepLogs.length > 0 
      ? sleepLogs.reduce((sum, log) => {
          const hours = parseFloat(log.durationHours || log.duration?.replace(' hours', '') || '0')
          return sum + hours
        }, 0) / sleepLogs.length
      : null

    const moodMap = { 'Excellent': 5, 'Good': 4, 'Okay': 3, 'Low': 2, 'Poor': 1 }
    const avgMood = moodLogs.length > 0
      ? moodLogs.reduce((sum, log) => {
          const moodValue = moodMap[log.mood] || 3
          return sum + moodValue
        }, 0) / moodLogs.length
      : null

    return {
      activities: activities || [],
      sleepLogs: sleepLogs || [],
      moodLogs: moodLogs || [],
      waterIntake: waterIntake || { glasses: 0, goal: 8 },
      nutrition: nutrition || { calories: 0, entries: [] },
      avgSleep: avgSleep ? avgSleep.toFixed(1) : null,
      avgMood: avgMood ? avgMood.toFixed(1) : null
    }
  }, [activities, sleepLogs, moodLogs, waterIntake, nutrition])

  // Load AI recommendations on mount or when data changes
  useEffect(() => {
    if (activeTab === 'recommendations' && recommendations.length === 0 && !isLoadingRecommendations) {
      if (geminiConfigured) {
        loadAIRecommendations()
      } else {
        // Use default recommendations if Gemini not configured
        setRecommendations(defaultRecommendations)
      }
    }
  }, [geminiConfigured, activeTab]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load AI insights when insights tab is opened
  useEffect(() => {
    if (geminiConfigured && activeTab === 'insights' && !aiInsights && !isLoadingInsights) {
      loadAIInsights()
    }
  }, [geminiConfigured, activeTab]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadAIRecommendations = async () => {
    if (!geminiConfigured) {
      setRecommendationsError('Gemini API not configured')
      return
    }

    setIsLoadingRecommendations(true)
    setRecommendationsError(null)

    try {
      const aiRecs = await generateWellnessRecommendations(userData)
      if (aiRecs && aiRecs.length > 0) {
        // Add IDs to recommendations
        const recsWithIds = aiRecs.map((rec, index) => ({
          ...rec,
          id: index + 1
        }))
        setRecommendations(recsWithIds)
      } else {
        // Fallback to default recommendations
        setRecommendations(defaultRecommendations)
      }
    } catch (error) {
      console.error('Failed to load AI recommendations:', error)
      setRecommendationsError('Failed to generate AI recommendations. Using default recommendations.')
      setRecommendations(defaultRecommendations)
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  const loadAIInsights = async () => {
    if (!geminiConfigured) {
      return
    }

    setIsLoadingInsights(true)

    try {
      const insights = await generateWellnessInsights(userData)
      if (insights) {
        setAiInsights(insights)
      }
    } catch (error) {
      console.error('Failed to load AI insights:', error)
    } finally {
      setIsLoadingInsights(false)
    }
  }

  // Default recommendations fallback
  const defaultRecommendations = [
    {
      id: 1,
      title: 'Prioritize Consistent Sleep Schedule',
      priority: 'High Priority',
      impact: 'High Impact',
      duration: '1-2 Weeks',
      description: "Your sleep duration of 6.5 hours is below the recommended 7-9 hours for adults, and you've identified 'Improve Sleep' as a goal. Inconsistent sleep can negatively affect mood, energy levels, and overall health. Establishing a regular sleep schedule can improve sleep quality and duration, leading to better mood, focus, and physical health.",
      actions: [
        'Set a consistent bedtime and wake-up time, even on weekends.',
        'Create a relaxing bedtime routine (e.g., reading, taking a warm bath).',
        'Avoid caffeine and alcohol before bed.',
        'Ensure your bedroom is dark, quiet, and cool.'
      ]
    },
    {
      id: 2,
      title: 'Increase Daily Steps Towards Activity Goal',
      priority: 'Medium Priority',
      impact: 'Medium Impact',
      duration: '2-3 Weeks',
      description: "Your daily step count of 4500 is below the recommended 10,000 steps, and you want to 'Be More Active.' Increasing your step count can improve cardiovascular health, boost energy levels, and aid in weight management.",
      actions: [
        'Set a daily step goal that is slightly higher than your current average (e.g., 5000 steps).',
        'Incorporate short walks into your daily routine (e.g., during lunch breaks, after dinner).',
        'Take the stairs instead of the elevator whenever possible.',
        'Find an activity you enjoy, such as dancing or hiking, to make exercise more fun.'
      ]
    },
    {
      id: 3,
      title: 'Incorporate Stress-Reducing Techniques',
      priority: 'Medium Priority',
      impact: 'Medium Impact',
      duration: '1-2 Weeks',
      description: 'Your journal entry indicates feeling stressed at work. Managing stress is crucial for overall well-being. Incorporating stress-reducing techniques can improve mood, reduce anxiety, and enhance cognitive function.',
      actions: [
        'Extend your meditation time to 10-15 minutes daily.',
        'Practice deep breathing exercises for a few minutes each day.',
        'Take short breaks during work to stretch or walk around.',
        'Consider engaging in a hobby you enjoy to unwind after work.'
      ]
    },
    {
      id: 4,
      title: 'Mindful Calorie Tracking',
      priority: 'Low Priority',
      impact: 'Medium Impact',
      duration: 'Ongoing',
      description: "While your calorie intake is within a reasonable range, mindful tracking can help ensure you're meeting your nutritional needs and maintaining a healthy eating pattern. This promotes overall wellness by optimizing energy levels and supporting various bodily functions.",
      actions: [
        'Use a food tracking app or journal to log your meals and snacks.',
        'Focus on eating whole, unprocessed foods.',
        'Pay attention to portion sizes.',
        'Consult a registered dietitian or nutritionist for personalized dietary advice.'
      ]
    }
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMsg = inputMessage.trim()
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: userMsg,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoadingChat(true)

    try {
      let aiResponse
      
      if (geminiConfigured) {
        // Use Gemini AI for real responses
        aiResponse = await generateWellnessChatResponse(userMsg, userData)
        
        // Fallback to default if Gemini fails
        if (!aiResponse) {
          aiResponse = generateDefaultResponse(userMsg)
        }
      } else {
        // Fallback to default responses if Gemini not configured
        aiResponse = generateDefaultResponse(userMsg)
      }

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: aiResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to get AI response:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: "I'm sorry, I encountered an error processing your question. Please try again or ask me about your sleep, mood, activity, or nutrition.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoadingChat(false)
    }
  }

  const generateDefaultResponse = (userMessage) => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('sleep')) {
      return "Based on your recent sleep logs, I notice you're tracking your sleep patterns. Maintaining a consistent sleep schedule is crucial for wellness. Try going to bed and waking up at the same time each day for better sleep quality."
    }
    if (message.includes('mood') || message.includes('feel')) {
      return "Tracking your mood helps identify patterns in your emotional well-being. Regular mood logging can reveal connections between your activities, sleep, and emotional state. Would you like to explore your mood trends?"
    }
    if (message.includes('activity') || message.includes('exercise') || message.includes('workout')) {
      return "Physical activity is a cornerstone of wellness. Aim for at least 30 minutes of moderate activity daily. I can help you set activity goals or analyze your activity patterns if you'd like."
    }
    if (message.includes('nutrition') || message.includes('food') || message.includes('calorie')) {
      return "Nutrition plays a vital role in your overall health. Tracking your meals helps ensure you're meeting your nutritional needs. Would you like recommendations for balanced meal planning?"
    }
    if (message.includes('goal') || message.includes('improve')) {
      return "Setting clear wellness goals is important. Based on your data, I recommend focusing on consistency - whether it's sleep, activity, or mood tracking. Small, consistent steps lead to lasting change."
    }
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! I'm here to help you understand your wellness data and achieve your goals. Feel free to ask me about your sleep, mood, activity, nutrition, or any wellness-related questions!"
    }
    
    return "That's a great question! I'm here to help you understand your wellness journey. Try asking me about your sleep patterns, mood trends, activity levels, nutrition goals, or ways to improve your overall wellness."
  }

  const getPriorityColor = (priority) => {
    if (priority.includes('High')) return 'high'
    if (priority.includes('Medium')) return 'medium'
    return 'low'
  }

  const getImpactColor = (impact) => {
    if (impact.includes('High')) return 'high'
    if (impact.includes('Medium')) return 'medium'
    return 'low'
  }

  return (
    <div className="ai-wellness-hub">
      <header className="page-header">
        <h1>AI Wellness Hub</h1>
        <p>Your intelligent center for personalized insights and recommendations</p>
      </header>

      <div className="hub-tabs">
        <button 
          className={`tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          <Target size={20} />
          <span>Recommendations</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'assistant' ? 'active' : ''}`}
          onClick={() => setActiveTab('assistant')}
        >
          <MessageCircle size={20} />
          <span>AI Assistant</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <BarChart3 size={20} />
          <span>Insights</span>
        </button>
      </div>

      {activeTab === 'recommendations' && (
        <div className="recommendations-section">
          <div className="section-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2>Your Personalized Recommendations</h2>
                <p>AI-powered insights tailored to your wellness journey</p>
              </div>
              {geminiConfigured && (
                <button 
                  className="refresh-recommendations-btn"
                  onClick={loadAIRecommendations}
                  disabled={isLoadingRecommendations}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: 'var(--primary-color)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px',
                    cursor: isLoadingRecommendations ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <RefreshCw size={16} className={isLoadingRecommendations ? 'spinning' : ''} />
                  <span>Refresh AI Analysis</span>
                </button>
              )}
            </div>
            {!geminiConfigured && (
              <div style={{ 
                padding: '1rem', 
                background: '#fef3c7', 
                border: '1px solid #f59e0b', 
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <AlertCircle size={20} color="#f59e0b" />
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
                  <strong>Gemini AI Not Configured</strong>
                  <p style={{ margin: '0.25rem 0 0 0' }}>Configure VITE_GEMINI_API_KEY in your .env file to get AI-powered personalized recommendations.</p>
                </div>
              </div>
            )}
            {recommendationsError && (
              <div style={{ 
                padding: '0.75rem', 
                background: '#fee2e2', 
                border: '1px solid #ef4444', 
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                color: '#991b1b'
              }}>
                {recommendationsError}
              </div>
            )}
            <div className="recommendations-count">
              <span>{recommendations.length} recommendations</span>
            </div>
          </div>

          {isLoadingRecommendations ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <RefreshCw size={32} className="spinning" style={{ marginBottom: '1rem' }} />
              <p>AI is analyzing your wellness data and generating personalized recommendations...</p>
            </div>
          ) : (

          <div className="recommendations-list">
            {recommendations.map((rec) => (
              <div key={rec.id} className="recommendation-card">
                <div className="recommendation-header">
                  <h3 className="recommendation-title">{rec.title}</h3>
                  <div className="recommendation-meta">
                    <span className={`priority-badge priority-${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                    <span className={`impact-badge impact-${getImpactColor(rec.impact)}`}>
                      {rec.impact}
                    </span>
                  </div>
                </div>
                
                <div className="recommendation-duration">
                  <span className="duration-label">Duration:</span>
                  <span className="duration-value">{rec.duration}</span>
                </div>

                <p className="recommendation-description">{rec.description}</p>

                <div className="recommended-actions">
                  <strong>Recommended Actions:</strong>
                  <ul className="actions-list">
                    {rec.actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>

                <div className="recommendation-actions">
                  <button className="add-plan-btn">
                    <span>✨</span>
                    <span>Add to Plan</span>
                  </button>
                  <button className="tell-more-btn">
                    <MessageCircle size={18} />
                    <span>💬 Tell me more</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}

      {activeTab === 'assistant' && (
        <div className="assistant-section">
          <div className="assistant-header">
            <div>
              <h2>Chat with Wellness AI</h2>
              <p>Ask questions, get explanations, and explore your wellness data with AI assistance.</p>
            </div>
            {!geminiConfigured && (
              <div style={{ 
                padding: '1rem', 
                background: '#fef3c7', 
                border: '1px solid #f59e0b', 
                borderRadius: '8px',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <AlertCircle size={20} color="#f59e0b" />
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
                  <strong>Gemini AI Not Configured</strong>
                  <p style={{ margin: '0.25rem 0 0 0' }}>Configure VITE_GEMINI_API_KEY to enable AI-powered chat responses based on your data.</p>
                </div>
              </div>
            )}
            {geminiConfigured && (
              <div style={{ 
                padding: '0.75rem 1rem', 
                background: '#d1fae5', 
                border: '1px solid #10b981', 
                borderRadius: '8px',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: '#065f46'
              }}>
                <Sparkles size={16} color="#10b981" />
                <span><strong>Powered by Gemini AI</strong> - Real-time personalized responses</span>
              </div>
            )}
          </div>
          
          <div className="chat-container">
            <div className="chat-messages">
              {messages.map((message) => (
                <div key={message.id} className={`chat-message ${message.type}`}>
                  <div className="message-content">
                    {message.type === 'assistant' && (
                      <div className="message-avatar">
                        <Sparkles size={20} />
                      </div>
                    )}
                    <div className="message-text">
                      <p>{message.text}</p>
                      {message.timestamp && (
                        <span className="message-time">
                          {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="chat-input-container">
              <input
                type="text"
                className="chat-input"
                placeholder="Ask about your sleep, mood, activity, or wellness goals..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && inputMessage.trim()) {
                    handleSendMessage()
                  }
                }}
              />
              <button 
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoadingChat}
              >
                {isLoadingChat ? (
                  <>
                    <RefreshCw size={20} className="spinning" />
                    <span>AI thinking...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="insights-section">
          <div className="insights-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2>Wellness Insights</h2>
                <p>Deep analytics and trends from your wellness journey</p>
              </div>
              {geminiConfigured && (
                <button 
                  className="refresh-recommendations-btn"
                  onClick={loadAIInsights}
                  disabled={isLoadingInsights}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: 'var(--primary-color)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px',
                    cursor: isLoadingInsights ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <RefreshCw size={16} className={isLoadingInsights ? 'spinning' : ''} />
                  <span>Refresh AI Analysis</span>
                </button>
              )}
            </div>
            {!geminiConfigured && (
              <div style={{ 
                padding: '1rem', 
                background: '#fef3c7', 
                border: '1px solid #f59e0b', 
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <AlertCircle size={20} color="#f59e0b" />
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
                  <strong>Gemini AI Not Configured</strong>
                  <p style={{ margin: '0.25rem 0 0 0' }}>Configure VITE_GEMINI_API_KEY to get AI-powered insights based on your data.</p>
                </div>
              </div>
            )}
          </div>

          {isLoadingInsights ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <RefreshCw size={32} className="spinning" style={{ marginBottom: '1rem' }} />
              <p>AI is analyzing your wellness data and generating insights...</p>
            </div>
          ) : (
            <>
              {/* Correlation Analysis */}
              <div className="correlation-section">
                <h3>🔍 Correlation Analysis</h3>
                <p className="section-subtitle">Key relationships discovered in your wellness data</p>
                
                <div className="correlation-cards">
                  {(aiInsights?.correlations && aiInsights.correlations.length > 0) ? (
                    aiInsights.correlations.map((corr, index) => {
                      const strengthClass = corr.strength?.includes('Strong') ? 'positive' : 
                                           corr.strength?.includes('Moderate') ? 'moderate' : 'negative'
                      return (
                        <div key={index} className="correlation-card">
                          <div className="correlation-header">
                            <div className="correlation-title">
                              <Moon size={20} />
                              <Heart size={20} />
                              <span>{corr.type || 'Wellness Correlation'}</span>
                            </div>
                            <span className={`correlation-strength ${strengthClass}`}>
                              {corr.strength || 'Positive'}
                            </span>
                          </div>
                          <p className="correlation-finding">
                            {corr.finding || 'Analysis of wellness patterns'}
                          </p>
                          <div className="correlation-recommendation">
                            <span>💡</span>
                            <span><strong>Recommendation:</strong> {corr.recommendation || 'Continue tracking your wellness patterns'}</span>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    // Default correlations if no AI insights
                    <>
                      <div className="correlation-card">
                        <div className="correlation-header">
                          <div className="correlation-title">
                            <Moon size={20} />
                            <Heart size={20} />
                            <span>Sleep ↔ Mood</span>
                          </div>
                          <span className="correlation-strength positive">Strong Positive</span>
                        </div>
                        <p className="correlation-finding">
                          Users who sleep 7+ hours report 42% better mood scores the next day
                        </p>
                        <div className="correlation-recommendation">
                          <span>💡</span>
                          <span><strong>Recommendation:</strong> Maintain consistent 7-8 hour sleep schedule</span>
                        </div>
                      </div>

                      <div className="correlation-card">
                        <div className="correlation-header">
                          <div className="correlation-title">
                            <Activity size={20} />
                            <Moon size={20} />
                            <span>Activity ↔ Sleep Quality</span>
                          </div>
                          <span className="correlation-strength moderate">Moderate Positive</span>
                        </div>
                        <p className="correlation-finding">
                          10,000+ daily steps associated with 28% better sleep quality
                        </p>
                        <div className="correlation-recommendation">
                          <span>💡</span>
                          <span><strong>Recommendation:</strong> Exercise earlier in the day for better sleep</span>
                        </div>
                      </div>

                      <div className="correlation-card">
                        <div className="correlation-header">
                          <div className="correlation-title">
                            <Brain size={20} />
                            <span>Meditation ↔ Stress</span>
                          </div>
                          <span className="correlation-strength negative">Strong Negative</span>
                        </div>
                        <p className="correlation-finding">
                          15+ minutes daily meditation reduces stress levels by 35%
                        </p>
                        <div className="correlation-recommendation">
                          <span>💡</span>
                          <span><strong>Recommendation:</strong> Practice meditation regularly for stress management</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Predictive Insights */}
              <div className="predictive-section">
                <h3>📈 Predictive Insights</h3>
                <p className="section-subtitle">AI predictions based on your wellness patterns</p>
                
                <div className="predictive-cards">
                  {(aiInsights?.predictions && aiInsights.predictions.length > 0) ? (
                    aiInsights.predictions.map((pred, index) => (
                      <div key={index} className="predictive-card">
                        <div className="predictive-header">
                          <div>
                            <h4>{pred.title || 'Wellness Prediction'}</h4>
                            <span className="confidence-badge">{pred.confidence || '80%'} Confidence</span>
                          </div>
                        </div>
                        <p className="predictive-text">
                          {pred.prediction || 'Based on your wellness patterns'}
                        </p>
                        <div className="predictive-action">
                          <span>🎯</span>
                          <span><strong>Action:</strong> {pred.action || 'Continue your wellness journey'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Default predictions if no AI insights
                    <>
                      <div className="predictive-card">
                        <div className="predictive-header">
                          <div>
                            <h4>Next 7 Days - Sleep</h4>
                            <span className="confidence-badge">85% Confidence</span>
                          </div>
                        </div>
                        <p className="predictive-text">
                          Based on your current trends, sleep quality likely to improve by 15% with consistent bedtime
                        </p>
                        <div className="predictive-action">
                          <span>🎯</span>
                          <span><strong>Action:</strong> Go to bed at same time for next 7 days</span>
                        </div>
                      </div>

                      <div className="predictive-card">
                        <div className="predictive-header">
                          <div>
                            <h4>Next Month - Weight Goal</h4>
                            <span className="confidence-badge">78% Confidence</span>
                          </div>
                        </div>
                        <p className="predictive-text">
                          Current nutrition and activity patterns suggest 2-3kg progress toward goal
                        </p>
                        <div className="predictive-action">
                          <span>🎯</span>
                          <span><strong>Action:</strong> Use AI Meal Planner for consistent nutrition</span>
                        </div>
                      </div>

                      <div className="predictive-card">
                        <div className="predictive-header">
                          <div>
                            <h4>Next Week - Mood Trend</h4>
                            <span className="confidence-badge">92% Confidence</span>
                          </div>
                        </div>
                        <p className="predictive-text">
                          Meditation habit forming - expect 20% mood improvement with continued practice
                        </p>
                        <div className="predictive-action">
                          <span>🎯</span>
                          <span><strong>Action:</strong> Maintain daily meditation streak</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Interactive Dashboards */}
          <div className="dashboards-section">
            <h3>📊 Interactive Dashboards</h3>
            <p className="section-subtitle">Real-time data visualization with customizable charts</p>
            
            <div className="dashboard-metrics">
              <div className="metric-card">
                <div className="metric-header">
                  <Brain size={20} />
                  <span>Mood Trend</span>
                </div>
                <div className="metric-value">4.2</div>
                <div className="metric-change positive">
                  <TrendingUp size={16} />
                  <span>+0.3 from last week</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Moon size={20} />
                  <span>Sleep Quality</span>
                </div>
                <div className="metric-value">7.5h</div>
                <div className="metric-change positive">
                  <TrendingUp size={16} />
                  <span>+0.5h from last week</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Activity size={20} />
                  <span>Activity</span>
                </div>
                <div className="metric-value">6,240</div>
                <div className="metric-change">
                  <span>steps today</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Droplet size={20} />
                  <span>Water Intake</span>
                </div>
                <div className="metric-value">{waterIntake.glasses}/{waterIntake.goal}</div>
                <div className="metric-change">
                  <span>glasses today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wellness Reports */}
          <div className="wellness-reports-section">
            <h3>📋 Wellness Reports</h3>
            <p className="section-subtitle">Your comprehensive wellness summary with goal progress tracking</p>
            
            <div className="reports-grid">
              <div className="report-goal-card">
                <div className="goal-header">
                  <Brain size={24} />
                  <h4>Daily Meditation</h4>
                </div>
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: '71%' }}></div>
                </div>
                <div className="goal-stats">
                  <span>5/7 days this week</span>
                  <span className="goal-percentage">71%</span>
                </div>
              </div>

              <div className="report-goal-card">
                <div className="goal-header">
                  <Moon size={24} />
                  <h4>Sleep Goal</h4>
                </div>
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: '85%' }}></div>
                </div>
                <div className="goal-stats">
                  <span>7-8 hours nightly</span>
                  <span className="goal-percentage">85%</span>
                </div>
              </div>

              <div className="report-goal-card">
                <div className="goal-header">
                  <Droplet size={24} />
                  <h4>Water Intake</h4>
                </div>
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: '75%' }}></div>
                </div>
                <div className="goal-stats">
                  <span>8 glasses daily</span>
                  <span className="goal-percentage">75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIWellnessHub

