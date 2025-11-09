import { useState, useEffect } from 'react'
import { Users, TrendingUp, Activity, Globe, Award, Clock, UserCheck, UserPlus, Zap, BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { 
  getTotalUsers, 
  getActiveUsers, 
  getSignUpsPerDay, 
  getUsersByCountry,
  getMostActiveUsers,
  getGrowthRate,
  getCurrentUserInfo,
  initializeUserStats
} from '../utils/userStats'
import './UserStats.css'

const UserStats = () => {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    growthRate: 0,
    usersByCountry: {},
    signUpsPerDay: {},
    mostActiveUsers: []
  })
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    initializeUserStats()
    loadStats()
    setCurrentUser(getCurrentUserInfo())
  }, [])

  const loadStats = () => {
    const totalUsers = getTotalUsers()
    const activeUsers = getActiveUsers()
    const growthRate = getGrowthRate()
    const usersByCountry = getUsersByCountry()
    const signUpsPerDay = getSignUpsPerDay()
    const mostActiveUsers = getMostActiveUsers(10)

    setStats({
      totalUsers,
      activeUsers,
      growthRate,
      usersByCountry,
      signUpsPerDay,
      mostActiveUsers
    })
  }

  const getCountryFlag = (country) => {
    const flags = {
      'UAE': '🇦🇪',
      'Saudi Arabia': '🇸🇦',
      'Egypt': '🇪🇬',
      'USA': '🇺🇸',
      'UK': '🇬🇧',
      'India': '🇮🇳',
      'Pakistan': '🇵🇰',
      'Unknown': '🌍'
    }
    return flags[country] || '🌍'
  }

  return (
    <div className="user-stats-page">
      <header className="page-header">
        <div>
          <h1><Users size={32} /> {t('userStats.title')}</h1>
          <p>{t('userStats.subtitle')}</p>
        </div>
        <button className="refresh-btn" onClick={loadStats}>
          <Activity size={18} />
          {t('userStats.refresh')}
        </button>
      </header>

      {/* Key Metrics */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <Users size={32} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">{t('userStats.totalUsers')}</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <UserCheck size={32} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeUsers}</div>
            <div className="stat-label">{t('userStats.activeUsers')}</div>
            <div className="stat-sublabel">{t('userStats.last7Days')}</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <TrendingUp size={32} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.growthRate}%</div>
            <div className="stat-label">{t('userStats.growthRate')}</div>
            <div className="stat-sublabel">{t('userStats.vsLastWeek')}</div>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <Zap size={32} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
            </div>
            <div className="stat-label">{t('userStats.engagementRate')}</div>
          </div>
        </div>
      </div>

      {/* Firebase Connection Info */}
      <div className="firebase-info-banner">
        <div className="firebase-icon">🔥</div>
        <div>
          <strong>{t('userStats.firebaseConnected')}</strong>
          <p>{t('userStats.firebaseConnectedDesc')}</p>
          <div className="firebase-details">
            <span>📦 {t('userStats.project')}: find-a1709</span>
            <span>•</span>
            <span>🔐 {t('userStats.authEnabled')}: ✅</span>
            <span>•</span>
            <span>📊 {t('userStats.realTimeData')}: ✅</span>
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="section-card">
        <h2>
          <Globe size={24} />
          {t('userStats.usersByCountry')}
        </h2>
        {Object.keys(stats.usersByCountry).length === 0 ? (
          <div className="empty-state">
            <p>{t('userStats.noGeographicData')}</p>
          </div>
        ) : (
          <div className="country-list">
            {Object.entries(stats.usersByCountry)
              .sort(([, a], [, b]) => b - a)
              .map(([country, count]) => (
                <div key={country} className="country-item">
                  <div className="country-info">
                    <span className="country-flag">{getCountryFlag(country)}</span>
                    <span className="country-name">{country}</span>
                  </div>
                  <div className="country-stats">
                    <div className="country-bar">
                      <div 
                        className="country-bar-fill" 
                        style={{ width: `${(count / stats.totalUsers) * 100}%` }}
                      />
                    </div>
                    <span className="country-count">{count} {t('userStats.users')}</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Most Active Users */}
      <div className="section-card">
        <h2>
          <Award size={24} />
          {t('userStats.mostActiveUsers')}
        </h2>
        {stats.mostActiveUsers.length === 0 ? (
          <div className="empty-state">
            <p>{t('userStats.noActivityData')}</p>
          </div>
        ) : (
          <div className="active-users-list">
            {stats.mostActiveUsers.map((user, index) => (
              <div key={user.userId} className="active-user-item">
                <div className="user-rank">#{index + 1}</div>
                <div className="user-avatar">👤</div>
                <div className="user-details">
                  <div className="user-email">{user.email}</div>
                  <div className="user-country">{getCountryFlag(user.country)} {user.country}</div>
                </div>
                <div className="user-activity-count">
                  <Activity size={16} />
                  <span>{user.activityCount} {t('userStats.activities')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sign-ups Trend */}
      <div className="section-card">
        <h2>
          <UserPlus size={24} />
          {t('userStats.signUpsTrend')}
        </h2>
        {Object.keys(stats.signUpsPerDay).length === 0 ? (
          <div className="empty-state">
            <p>{t('userStats.noSignUpData')}</p>
          </div>
        ) : (
          <div className="signups-chart">
            {Object.entries(stats.signUpsPerDay)
              .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
              .slice(-14) // Last 14 days
              .map(([date, count]) => (
                <div key={date} className="chart-bar">
                  <div 
                    className="bar-fill" 
                    style={{ height: `${Math.min((count / 10) * 100, 100)}%` }}
                    title={`${date}: ${count} sign-ups`}
                  />
                  <div className="bar-label">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div className="bar-count">{count}</div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Integration Guide */}
      <div className="integration-guide">
        <h3>{t('userStats.howItWorks')}</h3>
        <div className="guide-steps">
          <div className="guide-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>{t('userStats.step1Title')}</h4>
              <p>{t('userStats.step1Desc')}</p>
            </div>
          </div>
          <div className="guide-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>{t('userStats.step2Title')}</h4>
              <p>{t('userStats.step2Desc')}</p>
            </div>
          </div>
          <div className="guide-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>{t('userStats.step3Title')}</h4>
              <p>{t('userStats.step3Desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserStats


