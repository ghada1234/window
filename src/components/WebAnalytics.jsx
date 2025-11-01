import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Users, 
  Eye, 
  Clock, 
  Globe, 
  TrendingUp,
  Activity,
  MousePointer,
  Smartphone,
  Monitor,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import './WebAnalytics.css'

const WebAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = () => {
    setLoading(true)
    // Simulate loading analytics data
    // In production, this would fetch from Vercel Analytics API or your backend
    setTimeout(() => {
      setAnalyticsData(getDemoData())
      setLoading(false)
    }, 1000)
  }

  const getDemoData = () => {
    // Demo data for visualization
    return {
      overview: {
        totalVisitors: 1248,
        pageViews: 3567,
        avgSessionDuration: '3m 24s',
        bounceRate: '42%',
        trends: {
          visitors: '+12.5%',
          pageViews: '+18.3%',
          duration: '+5.2%',
          bounceRate: '-3.1%'
        }
      },
      topPages: [
        { path: '/dashboard', views: 892, visitors: 654 },
        { path: '/nutrition', views: 567, visitors: 423 },
        { path: '/ai-hub', views: 445, visitors: 334 },
        { path: '/activities', views: 398, visitors: 289 },
        { path: '/profile', views: 334, visitors: 256 }
      ],
      devices: {
        mobile: 68,
        desktop: 28,
        tablet: 4
      },
      browsers: [
        { name: 'Chrome', percentage: 54 },
        { name: 'Safari', percentage: 28 },
        { name: 'Firefox', percentage: 12 },
        { name: 'Edge', percentage: 6 }
      ],
      countries: [
        { name: 'United Arab Emirates', visitors: 432, flag: '🇦🇪' },
        { name: 'Saudi Arabia', visitors: 234, flag: '🇸🇦' },
        { name: 'United States', visitors: 189, flag: '🇺🇸' },
        { name: 'United Kingdom', visitors: 156, flag: '🇬🇧' },
        { name: 'India', visitors: 142, flag: '🇮🇳' }
      ],
      realtimeVisitors: 23
    }
  }

  const StatCard = ({ icon: Icon, title, value, trend, color }) => (
    <div className="analytics-stat-card">
      <div className="stat-icon" style={{ backgroundColor: `${color}20` }}>
        <Icon size={24} color={color} />
      </div>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
        {trend && (
          <p className={`stat-trend ${trend.startsWith('+') ? 'positive' : trend.startsWith('-') ? 'negative' : ''}`}>
            {trend} vs last period
          </p>
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="analytics-loading">
          <div className="spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1 className="analytics-title">
            <BarChart3 size={32} />
            Web Analytics
          </h1>
          <p className="analytics-subtitle">
            Track your website's performance and user engagement
          </p>
        </div>
        <div className="analytics-actions">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="refresh-btn" onClick={loadAnalyticsData}>
            <RefreshCw size={18} />
            Refresh
          </button>
          <a 
            href="https://vercel.com/ghada-rabees-projects/window/analytics" 
            target="_blank" 
            rel="noopener noreferrer"
            className="vercel-analytics-btn"
          >
            <ExternalLink size={18} />
            View Full Analytics
          </a>
        </div>
      </div>

      {/* Real-time Visitors */}
      <div className="realtime-banner">
        <Activity size={20} className="pulse-icon" />
        <strong>{analyticsData.realtimeVisitors}</strong> users online right now
      </div>

      {/* Overview Stats */}
      <div className="analytics-grid">
        <StatCard
          icon={Users}
          title="Total Visitors"
          value={analyticsData.overview.totalVisitors.toLocaleString()}
          trend={analyticsData.overview.trends.visitors}
          color="#6366f1"
        />
        <StatCard
          icon={Eye}
          title="Page Views"
          value={analyticsData.overview.pageViews.toLocaleString()}
          trend={analyticsData.overview.trends.pageViews}
          color="#10b981"
        />
        <StatCard
          icon={Clock}
          title="Avg. Session Duration"
          value={analyticsData.overview.avgSessionDuration}
          trend={analyticsData.overview.trends.duration}
          color="#f59e0b"
        />
        <StatCard
          icon={TrendingUp}
          title="Bounce Rate"
          value={analyticsData.overview.bounceRate}
          trend={analyticsData.overview.trends.bounceRate}
          color="#ef4444"
        />
      </div>

      <div className="analytics-row">
        {/* Top Pages */}
        <div className="analytics-card analytics-card-large">
          <h3 className="card-title">
            <MousePointer size={20} />
            Top Pages
          </h3>
          <div className="top-pages-list">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="top-page-item">
                <div className="page-rank">#{index + 1}</div>
                <div className="page-info">
                  <p className="page-path">{page.path}</p>
                  <p className="page-stats">
                    {page.views.toLocaleString()} views • {page.visitors.toLocaleString()} visitors
                  </p>
                </div>
                <div className="page-bar-container">
                  <div 
                    className="page-bar" 
                    style={{ width: `${(page.views / analyticsData.topPages[0].views) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="analytics-card">
          <h3 className="card-title">
            <Smartphone size={20} />
            Device Types
          </h3>
          <div className="device-chart">
            <div className="donut-chart">
              <svg viewBox="0 0 100 100" className="donut">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#6366f1" 
                  strokeWidth="20"
                  strokeDasharray={`${analyticsData.devices.mobile * 2.51} 251`}
                  transform="rotate(-90 50 50)"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="20"
                  strokeDasharray={`${analyticsData.devices.desktop * 2.51} 251`}
                  strokeDashoffset={-analyticsData.devices.mobile * 2.51}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="donut-center">
                <p className="donut-label">Devices</p>
              </div>
            </div>
            <div className="device-legend">
              <div className="legend-item">
                <Smartphone size={16} color="#6366f1" />
                <span>Mobile</span>
                <strong>{analyticsData.devices.mobile}%</strong>
              </div>
              <div className="legend-item">
                <Monitor size={16} color="#10b981" />
                <span>Desktop</span>
                <strong>{analyticsData.devices.desktop}%</strong>
              </div>
              <div className="legend-item">
                <Monitor size={16} color="#f59e0b" />
                <span>Tablet</span>
                <strong>{analyticsData.devices.tablet}%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-row">
        {/* Top Countries */}
        <div className="analytics-card">
          <h3 className="card-title">
            <Globe size={20} />
            Top Countries
          </h3>
          <div className="countries-list">
            {analyticsData.countries.map((country, index) => (
              <div key={index} className="country-item">
                <span className="country-flag">{country.flag}</span>
                <span className="country-name">{country.name}</span>
                <span className="country-visitors">{country.visitors.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Browser Stats */}
        <div className="analytics-card">
          <h3 className="card-title">
            <Globe size={20} />
            Browser Distribution
          </h3>
          <div className="browsers-list">
            {analyticsData.browsers.map((browser, index) => (
              <div key={index} className="browser-item">
                <div className="browser-info">
                  <span className="browser-name">{browser.name}</span>
                  <span className="browser-percentage">{browser.percentage}%</span>
                </div>
                <div className="browser-bar-container">
                  <div 
                    className="browser-bar" 
                    style={{ width: `${browser.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="analytics-info-banner">
        <div className="info-icon">ℹ️</div>
        <div>
          <h4>Live Analytics Powered by Vercel</h4>
          <p>
            This dashboard shows simulated data for demonstration. Once deployed, Vercel Analytics will track real visitor data automatically.
            <a 
              href="https://vercel.com/docs/analytics" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Learn more about Vercel Analytics →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default WebAnalytics

