import { useState, useEffect, useRef } from 'react'
import { useWellness } from '../context/WellnessContext'
import { 
  FileText, 
  TrendingUp, 
  Award, 
  AlertCircle, 
  Heart, 
  Activity,
  Droplet,
  Moon,
  Brain,
  Target,
  Download,
  Calendar,
  BarChart3,
  Sparkles,
  Share2,
  MessageCircle
} from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import './WellnessReport.css'

const WellnessReport = () => {
  const wellnessContext = useWellness()
  const wellnessData = wellnessContext?.wellnessData || {
    nutrition: [],
    water: [],
    activities: [],
    sleep: [],
    mood: []
  }
  
  const [reportPeriod, setReportPeriod] = useState('week') // week, month, year
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const reportRef = useRef(null)

  useEffect(() => {
    generateReport()
  }, [reportPeriod])

  const generateReport = () => {
    setLoading(true)
    setTimeout(() => {
      try {
        const generatedReport = calculateWellnessMetrics()
        setReport(generatedReport)
      } catch (error) {
        console.error('Error generating report:', error)
        // Set default report if generation fails
        setReport(getDefaultReport())
      } finally {
        setLoading(false)
      }
    }, 1000)
  }

  const getDefaultReport = () => {
    return {
      period: reportPeriod,
      generatedDate: new Date().toLocaleDateString(),
      overallScore: 70,
      scores: {
        nutrition: 70,
        hydration: 70,
        activity: 70,
        sleep: 70,
        mood: 70
      },
      insights: [],
      achievements: generateAchievements(),
      recommendations: []
    }
  }

  const calculateWellnessMetrics = () => {
    const { nutrition, water, activities, sleep, mood } = wellnessData || {
      nutrition: [],
      water: [],
      activities: [],
      sleep: [],
      mood: []
    }

    // Calculate averages and scores
    const nutritionScore = calculateNutritionScore(nutrition)
    const hydrationScore = calculateHydrationScore(water)
    const activityScore = calculateActivityScore(activities)
    const sleepScore = calculateSleepScore(sleep)
    const moodScore = calculateMoodScore(mood)

    const overallScore = Math.round(
      (nutritionScore + hydrationScore + activityScore + sleepScore + moodScore) / 5
    )

    return {
      period: reportPeriod,
      generatedDate: new Date().toLocaleDateString(),
      overallScore,
      scores: {
        nutrition: nutritionScore,
        hydration: hydrationScore,
        activity: activityScore,
        sleep: sleepScore,
        mood: moodScore
      },
      insights: generateInsights({
        nutrition: nutritionScore,
        hydration: hydrationScore,
        activity: activityScore,
        sleep: sleepScore,
        mood: moodScore
      }),
      achievements: generateAchievements(),
      recommendations: generateRecommendations({
        nutrition: nutritionScore,
        hydration: hydrationScore,
        activity: activityScore,
        sleep: sleepScore,
        mood: moodScore
      })
    }
  }

  const calculateNutritionScore = (nutrition) => {
    if (!nutrition || !Array.isArray(nutrition) || nutrition.length === 0) return 50
    
    try {
      const avgCalories = nutrition.reduce((sum, item) => sum + (item.calories || 0), 0) / nutrition.length
      const targetCalories = 2000
      const difference = Math.abs(avgCalories - targetCalories)
      
      if (difference < 200) return 95
      if (difference < 400) return 85
      if (difference < 600) return 75
      return 60
    } catch (error) {
      console.error('Error calculating nutrition score:', error)
      return 50
    }
  }

  const calculateHydrationScore = (water) => {
    if (!water || !Array.isArray(water) || water.length === 0) return 50
    
    try {
      const avgWater = water.reduce((sum, item) => sum + (item.amount || 0), 0) / water.length
      const targetWater = 2000 // ml per day
      
      if (avgWater >= targetWater) return 95
      if (avgWater >= targetWater * 0.8) return 85
      if (avgWater >= targetWater * 0.6) return 70
      return 55
    } catch (error) {
      console.error('Error calculating hydration score:', error)
      return 50
    }
  }

  const calculateActivityScore = (activities) => {
    if (!activities || !Array.isArray(activities) || activities.length === 0) return 50
    
    try {
      const totalMinutes = activities.reduce((sum, item) => sum + (item.duration || 0), 0)
      const avgMinutes = totalMinutes / 7 // Weekly average
      
      if (avgMinutes >= 30) return 95
      if (avgMinutes >= 20) return 80
      if (avgMinutes >= 10) return 65
      return 50
    } catch (error) {
      console.error('Error calculating activity score:', error)
      return 50
    }
  }

  const calculateSleepScore = (sleep) => {
    if (!sleep || !Array.isArray(sleep) || sleep.length === 0) return 50
    
    try {
      const avgHours = sleep.reduce((sum, item) => sum + (item.hours || 0), 0) / sleep.length
      
      if (avgHours >= 7 && avgHours <= 9) return 95
      if (avgHours >= 6 && avgHours <= 10) return 80
      if (avgHours >= 5 && avgHours <= 11) return 65
      return 50
    } catch (error) {
      console.error('Error calculating sleep score:', error)
      return 50
    }
  }

  const calculateMoodScore = (mood) => {
    if (!mood || !Array.isArray(mood) || mood.length === 0) return 70
    
    try {
      const moodValues = {
        'great': 100,
        'good': 80,
        'okay': 60,
        'bad': 40,
        'terrible': 20
      }
      
      const avgMood = mood.reduce((sum, item) => {
        return sum + (moodValues[item.mood?.toLowerCase()] || 60)
      }, 0) / mood.length
      
      return Math.round(avgMood)
    } catch (error) {
      console.error('Error calculating mood score:', error)
      return 70
    }
  }

  const generateInsights = (scores) => {
    const insights = []
    
    try {
      if (!scores) return insights
      
      // Strength insights
      const strengths = Object.entries(scores)
        .filter(([_, score]) => score >= 85)
        .map(([category]) => category)
      
      if (strengths.length > 0) {
        insights.push({
          type: 'success',
          icon: Award,
          title: 'Your Strengths',
          message: `You're excelling in ${strengths.join(', ')}! Keep up the great work.`
        })
      }

      // Improvement areas
      const improvements = Object.entries(scores)
        .filter(([_, score]) => score < 70)
        .map(([category]) => category)
      
      if (improvements.length > 0) {
        insights.push({
          type: 'warning',
          icon: AlertCircle,
          title: 'Areas for Improvement',
          message: `Focus on improving your ${improvements.join(', ')} for better wellness.`
        })
      }

      // Overall trend
      if (scores.nutrition > 80 && scores.activity > 80) {
        insights.push({
          type: 'info',
          icon: TrendingUp,
          title: 'Excellent Balance',
          message: 'Your nutrition and activity levels are well balanced!'
        })
      }

      if (scores.sleep < 70 && scores.mood < 70) {
        insights.push({
          type: 'warning',
          icon: Brain,
          title: 'Rest & Recovery',
          message: 'Better sleep could improve your mood. Try establishing a bedtime routine.'
        })
      }
    } catch (error) {
      console.error('Error generating insights:', error)
    }

    return insights
  }

  const generateAchievements = () => {
    return [
      { icon: Heart, title: 'Wellness Warrior', description: '7 days of tracking', earned: true },
      { icon: Droplet, title: 'Hydration Hero', description: 'Met water goal 5 days', earned: true },
      { icon: Activity, title: 'Active Lifestyle', description: '30+ min exercise daily', earned: false },
      { icon: Moon, title: 'Sleep Champion', description: '7-9 hours sleep consistently', earned: true },
      { icon: Target, title: 'Goal Getter', description: 'Completed 3 goals', earned: false }
    ]
  }

  const generateRecommendations = (scores) => {
    const recommendations = []

    if (scores.hydration < 80) {
      recommendations.push({
        category: 'Hydration',
        icon: Droplet,
        title: 'Increase Water Intake',
        description: 'Aim for 8 glasses (2000ml) of water daily. Set reminders throughout the day.',
        priority: 'high'
      })
    }

    if (scores.activity < 80) {
      recommendations.push({
        category: 'Activity',
        icon: Activity,
        title: 'Boost Physical Activity',
        description: 'Try to get at least 30 minutes of moderate exercise daily. Start with a 10-minute walk.',
        priority: 'high'
      })
    }

    if (scores.sleep < 80) {
      recommendations.push({
        category: 'Sleep',
        icon: Moon,
        title: 'Improve Sleep Quality',
        description: 'Establish a consistent bedtime routine. Avoid screens 1 hour before bed.',
        priority: 'medium'
      })
    }

    if (scores.nutrition < 80) {
      recommendations.push({
        category: 'Nutrition',
        icon: Heart,
        title: 'Balance Your Diet',
        description: 'Focus on whole foods, vegetables, and lean proteins. Use the AI food analyzer for guidance.',
        priority: 'medium'
      })
    }

    if (scores.mood < 70) {
      recommendations.push({
        category: 'Mental Health',
        icon: Brain,
        title: 'Practice Self-Care',
        description: 'Try meditation, journaling, or breathing exercises. Connect with the AI wellness chat for support.',
        priority: 'high'
      })
    }

    return recommendations
  }

  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981' // green
    if (score >= 70) return '#f59e0b' // yellow
    return '#ef4444' // red
  }

  const getScoreLabel = (score) => {
    if (score >= 85) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 50) return 'Fair'
    return 'Needs Improvement'
  }

  const handleDownload = async () => {
    setExporting(true)
    try {
      const element = reportRef.current
      
      // Temporarily hide buttons for PDF
      const buttons = element.querySelectorAll('.report-actions, .download-btn, .share-btn')
      buttons.forEach(btn => btn.style.display = 'none')
      
      // Capture the report as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })
      
      // Restore buttons
      buttons.forEach(btn => btn.style.display = '')
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      // Download the PDF
      const filename = `Wellness-Report-${report.generatedDate.replace(/\//g, '-')}.pdf`
      pdf.save(filename)
      
      // Show success message
      alert('✅ PDF downloaded successfully!')
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('❌ Failed to generate PDF. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const handleShareWhatsApp = async () => {
    setExporting(true)
    try {
      const element = reportRef.current
      
      // Temporarily hide buttons for PDF
      const buttons = element.querySelectorAll('.report-actions, .download-btn, .share-btn')
      buttons.forEach(btn => btn.style.display = 'none')
      
      // Capture the report as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })
      
      // Restore buttons
      buttons.forEach(btn => btn.style.display = '')
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      // Convert PDF to blob
      const pdfBlob = pdf.output('blob')
      const pdfUrl = URL.createObjectURL(pdfBlob)
      
      // Create share message
      const message = `🌟 My Wellness Report (${reportPeriod})\n\n` +
        `Overall Score: ${report.overallScore}/100 (${getScoreLabel(report.overallScore)})\n\n` +
        `📊 Scores:\n` +
        `• Nutrition: ${report.scores.nutrition}/100\n` +
        `• Hydration: ${report.scores.hydration}/100\n` +
        `• Activity: ${report.scores.activity}/100\n` +
        `• Sleep: ${report.scores.sleep}/100\n` +
        `• Mood: ${report.scores.mood}/100\n\n` +
        `Generated on ${report.generatedDate}\n\n` +
        `Track your wellness journey with Find Your Inner Peace! 🧘‍♀️`
      
      // Check if Web Share API is available with files support
      if (navigator.share && navigator.canShare) {
        try {
          const file = new File([pdfBlob], `Wellness-Report-${report.generatedDate.replace(/\//g, '-')}.pdf`, {
            type: 'application/pdf'
          })
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'My Wellness Report',
              text: message,
              files: [file]
            })
            alert('✅ Shared successfully!')
          } else {
            // Fallback to WhatsApp web link
            shareViaWhatsAppWeb(message, pdfUrl)
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            shareViaWhatsAppWeb(message, pdfUrl)
          }
        }
      } else {
        // Fallback for browsers without Web Share API
        shareViaWhatsAppWeb(message, pdfUrl)
      }
    } catch (error) {
      console.error('Share error:', error)
      alert('❌ Failed to share. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const shareViaWhatsAppWeb = (message, pdfUrl) => {
    // First download the PDF
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `Wellness-Report-${report.generatedDate.replace(/\//g, '-')}.pdf`
    link.click()
    
    // Then open WhatsApp with the message
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    alert('📄 PDF downloaded! Now you can manually attach it in WhatsApp.')
  }

  if (loading) {
    return (
      <div className="wellness-report-container">
        <div className="report-loading">
          <div className="spinner"></div>
          <p>Generating your wellness report...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="wellness-report-container" ref={reportRef}>
      {/* Header */}
      <div className="report-header">
        <div className="report-header-content">
          <div className="report-icon-wrapper">
            <FileText size={32} />
          </div>
          <div>
            <h1 className="report-title">Wellness Report</h1>
            <p className="report-subtitle">
              Your personalized health insights for the past {reportPeriod}
            </p>
          </div>
        </div>
        <div className="report-actions">
          <select 
            value={reportPeriod} 
            onChange={(e) => setReportPeriod(e.target.value)}
            className="period-select"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
          <button 
            className="download-btn" 
            onClick={handleDownload}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <div className="spinner-small"></div>
                Generating...
              </>
            ) : (
              <>
                <Download size={18} />
                Download PDF
              </>
            )}
          </button>
          <button 
            className="share-btn whatsapp" 
            onClick={handleShareWhatsApp}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <div className="spinner-small"></div>
                Preparing...
              </>
            ) : (
              <>
                <MessageCircle size={18} />
                Share on WhatsApp
              </>
            )}
          </button>
        </div>
      </div>

      {/* Overall Score */}
      <div className="overall-score-card">
        <div className="score-circle-container">
          <svg className="score-circle" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="20"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={getScoreColor(report.overallScore)}
              strokeWidth="20"
              strokeDasharray={`${report.overallScore * 5.65} 565`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div className="score-center">
            <div className="score-number">{report.overallScore}</div>
            <div className="score-label">{getScoreLabel(report.overallScore)}</div>
          </div>
        </div>
        <div className="score-details">
          <h2>Your Overall Wellness Score</h2>
          <p>Generated on {report.generatedDate}</p>
          <div className="score-breakdown">
            {Object.entries(report.scores).map(([category, score]) => (
              <div key={category} className="score-item">
                <span className="category-name">{category}</span>
                <div className="score-bar-container">
                  <div 
                    className="score-bar" 
                    style={{ 
                      width: `${score}%`,
                      backgroundColor: getScoreColor(score)
                    }}
                  />
                </div>
                <span className="score-value">{score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      {report.insights.length > 0 && (
        <div className="report-section">
          <h3 className="section-title">
            <Sparkles size={20} />
            Key Insights
          </h3>
          <div className="insights-grid">
            {report.insights.map((insight, index) => (
              <div key={index} className={`insight-card insight-${insight.type}`}>
                <div className="insight-icon">
                  <insight.icon size={24} />
                </div>
                <div className="insight-content">
                  <h4>{insight.title}</h4>
                  <p>{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="report-section">
        <h3 className="section-title">
          <Award size={20} />
          Achievements
        </h3>
        <div className="achievements-grid">
          {report.achievements.map((achievement, index) => (
            <div 
              key={index} 
              className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
            >
              <div className="achievement-icon">
                <achievement.icon size={32} />
              </div>
              <h4>{achievement.title}</h4>
              <p>{achievement.description}</p>
              {achievement.earned && (
                <div className="earned-badge">
                  <Award size={16} />
                  Earned
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {report.recommendations.length > 0 && (
        <div className="report-section">
          <h3 className="section-title">
            <Target size={20} />
            Personalized Recommendations
          </h3>
          <div className="recommendations-list">
            {report.recommendations.map((rec, index) => (
              <div key={index} className={`recommendation-card priority-${rec.priority}`}>
                <div className="rec-icon">
                  <rec.icon size={24} />
                </div>
                <div className="rec-content">
                  <div className="rec-header">
                    <h4>{rec.title}</h4>
                    <span className={`priority-badge ${rec.priority}`}>
                      {rec.priority} priority
                    </span>
                  </div>
                  <p>{rec.description}</p>
                  <span className="rec-category">{rec.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="report-footer">
        <div className="footer-icon">
          <BarChart3 size={24} />
        </div>
        <div className="footer-content">
          <h4>Keep Up the Great Work!</h4>
          <p>
            Continue tracking your wellness journey. Small daily improvements lead to significant long-term results.
            Use the AI Wellness Hub for personalized guidance and support.
          </p>
        </div>
      </div>
    </div>
  )
}

export default WellnessReport
