import { useState, useEffect } from 'react'
import { 
  Watch, 
  Smartphone, 
  Activity, 
  Heart, 
  Moon, 
  Footprints,
  Zap,
  CheckCircle,
  AlertCircle,
  Upload,
  RefreshCw,
  Settings,
  Link as LinkIcon,
  Unlink
} from 'lucide-react'
import { getJSON, setJSON } from '../utils/storage'
import { useTranslation } from 'react-i18next'
import { 
  connectGoogleFit, 
  connectAppleHealth, 
  connectFitbit,
  fetchGoogleFitData,
  isHealthApiConfigured 
} from '../utils/healthApis'
import './WearableSync.css'

const WearableSync = () => {
  const { t } = useTranslation()
  const [connectedDevices, setConnectedDevices] = useState([])
  const [syncStatus, setSyncStatus] = useState({})
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [apiConfigured, setApiConfigured] = useState(false)
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true)
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    loadConnectedDevices()
    setApiConfigured(isHealthApiConfigured())
    
    // Load auto-sync preference
    const autoSyncPref = localStorage.getItem('autoSyncEnabled')
    if (autoSyncPref !== null) {
      setAutoSyncEnabled(autoSyncPref === 'true')
    }
  }, [])

  // Auto-sync every 5 minutes for connected devices
  useEffect(() => {
    if (!autoSyncEnabled || connectedDevices.length === 0) return

    const syncInterval = setInterval(() => {
      console.log('🔄 Auto-syncing connected devices...')
      connectedDevices.forEach((device) => {
        handleSync(device.id, true) // Silent sync
      })
    }, 5 * 60 * 1000) // 5 minutes

    // Initial sync on mount
    setTimeout(() => {
      connectedDevices.forEach((device) => {
        handleSync(device.id, true)
      })
    }, 2000) // Wait 2 seconds after mount

    return () => clearInterval(syncInterval)
  }, [connectedDevices, autoSyncEnabled])

  const loadConnectedDevices = () => {
    const devices = getJSON('connectedWearables', [])
    setConnectedDevices(devices)
    
    // Load sync status
    const status = getJSON('wearableSyncStatus', {})
    setSyncStatus(status)
  }

  const showMessage = (text, type = 'info') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, 5000)
  }

  const availableDevices = [
    {
      id: 'apple-watch',
      name: 'Apple Watch',
      icon: '⌚',
      color: '#000000',
      description: 'Sync activity, heart rate, sleep, and workouts',
      dataTypes: ['steps', 'heartRate', 'sleep', 'calories', 'workouts'],
      setupGuide: 'Apple Health integration'
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      icon: '🏃',
      color: '#00B0B9',
      description: 'Track steps, heart rate, sleep, and exercise',
      dataTypes: ['steps', 'heartRate', 'sleep', 'calories', 'water'],
      setupGuide: 'Fitbit API connection'
    },
    {
      id: 'garmin',
      name: 'Garmin',
      icon: '⚡',
      color: '#007CC3',
      description: 'Advanced fitness metrics and performance data',
      dataTypes: ['steps', 'heartRate', 'sleep', 'calories', 'vo2max'],
      setupGuide: 'Garmin Connect'
    },
    {
      id: 'samsung-health',
      name: 'Samsung Health',
      icon: '💚',
      color: '#1428A0',
      description: 'Comprehensive health and fitness tracking',
      dataTypes: ['steps', 'heartRate', 'sleep', 'calories', 'stress'],
      setupGuide: 'Samsung Health SDK'
    },
    {
      id: 'google-fit',
      name: 'Google Fit',
      icon: '🎯',
      color: '#4285F4',
      description: 'Aggregated data from multiple sources',
      dataTypes: ['steps', 'heartRate', 'sleep', 'calories', 'distance'],
      setupGuide: 'Google Fit API'
    },
    {
      id: 'whoop',
      name: 'WHOOP',
      icon: '🔴',
      color: '#FF3366',
      description: 'Recovery, strain, and sleep optimization',
      dataTypes: ['heartRate', 'sleep', 'recovery', 'strain', 'hrv'],
      setupGuide: 'WHOOP API'
    }
  ]

  const isConnected = (deviceId) => {
    return connectedDevices.some(d => d.id === deviceId)
  }

  const handleConnect = async (device) => {
    if (isConnected(device.id)) {
      showMessage(t('wearableDevices.messages.alreadyConnected', { device: device.name }), 'info')
      return
    }

    showMessage(t('wearableDevices.messages.connecting', { device: device.name }), 'info')
    
    try {
      let result

      // Use real API if configured, otherwise simulate
      switch (device.id) {
        case 'google-fit':
          if (apiConfigured) {
            result = await connectGoogleFit()
            if (!result.success) {
              showMessage(result.error || t('wearableDevices.messages.connectionFailed'), 'error')
              return
            }
          }
          break
          
        case 'apple-watch':
          const appleInfo = connectAppleHealth()
          showMessage(appleInfo.message, 'info')
          // Show manual export instructions
          alert(appleInfo.instructions.join('\n'))
          return
          
        case 'fitbit':
          if (apiConfigured) {
            result = await connectFitbit()
            if (!result.success) {
              showMessage(result.error || t('wearableDevices.messages.connectionFailed'), 'error')
              return
            }
          }
          break
          
        default:
          // Simulate for other devices
          break
      }

      // Save connected device
      const newDevice = {
        ...device,
        connectedAt: new Date().toISOString(),
        lastSync: null,
        syncEnabled: true,
        accessToken: result?.accessToken || null
      }
      
      const updated = [...connectedDevices, newDevice]
      setConnectedDevices(updated)
      setJSON('connectedWearables', updated)
      
      showMessage(t('wearableDevices.messages.connectedSuccess', { device: device.name }), 'success')
    } catch (error) {
      console.error('Connection error:', error)
      showMessage(t('wearableDevices.messages.connectionFailed') || `❌ ${error.message}`, 'error')
    }
  }

  const handleDisconnect = (deviceId) => {
    const device = connectedDevices.find(d => d.id === deviceId)
    if (!device) return

    const updated = connectedDevices.filter(d => d.id !== deviceId)
    setConnectedDevices(updated)
    setJSON('connectedWearables', updated)
    
    showMessage(t('wearableDevices.messages.disconnected', { device: device.name }), 'info')
  }

  const handleSync = async (deviceId, silent = false) => {
    const device = connectedDevices.find(d => d.id === deviceId)
    if (!device) return

    if (!silent) {
      showMessage(t('wearableDevices.messages.syncing', { device: device.name }), 'info')
    } else {
      console.log(`🔄 Auto-syncing ${device.name}...`)
    }
    
    // Simulate sync
    setTimeout(() => {
      // Generate sample data
      const syncData = generateSampleData(device)
      
      // Update last sync time
      const updated = connectedDevices.map(d => 
        d.id === deviceId 
          ? { ...d, lastSync: new Date().toISOString() }
          : d
      )
      setConnectedDevices(updated)
      setJSON('connectedWearables', updated)
      
      // Save synced data
      const imported = importDataToApp(syncData)
      
      // Update sync status
      const newStatus = { ...syncStatus, [deviceId]: 'success' }
      setSyncStatus(newStatus)
      setJSON('wearableSyncStatus', newStatus)
      
      if (!silent) {
        showMessage(t('wearableDevices.messages.syncSuccess', { device: device.name, count: imported }), 'success')
        
        // Only reload for manual syncs
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        console.log(`✅ Auto-synced ${device.name}: ${imported} items imported`)
      }
    }, 2000)
  }

  const generateSampleData = (device) => {
    const today = new Date()
    const data = {
      itemsCount: 0,
      activities: [],
      sleep: [],
      heartRate: [],
      steps: 0
    }

    // Generate activity data
    if (device.dataTypes.includes('steps')) {
      data.steps = Math.floor(Math.random() * 5000) + 5000
      data.activities.push({
        name: 'Walking',
        type: 'Walking',
        duration: 30,
        calories: 150,
        date: today.toISOString(),
        source: device.name
      })
      data.itemsCount++
    }

    // Generate workout data
    if (device.dataTypes.includes('workouts')) {
      const workouts = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Gym']
      const randomWorkout = workouts[Math.floor(Math.random() * workouts.length)]
      data.activities.push({
        name: randomWorkout,
        type: randomWorkout,
        duration: Math.floor(Math.random() * 30) + 30,
        calories: Math.floor(Math.random() * 200) + 200,
        date: today.toISOString(),
        source: device.name
      })
      data.itemsCount++
    }

    // Generate sleep data
    if (device.dataTypes.includes('sleep')) {
      const sleepHours = Math.floor(Math.random() * 3) + 6
      const qualities = ['Excellent', 'Good', 'Fair']
      const qualityEmojis = ['✨', '😊', '🙂']
      const qualityIndex = Math.floor(Math.random() * 3)
      
      data.sleep.push({
        bedtime: '10:30 PM',
        wakeTime: '06:30 AM',
        hours: sleepHours,
        durationHours: sleepHours,
        quality: qualities[qualityIndex],
        qualityEmoji: qualityEmojis[qualityIndex],
        factors: [],
        date: today.toISOString(),
        source: device.name
      })
      data.itemsCount++
    }

    // Generate heart rate data
    if (device.dataTypes.includes('heartRate')) {
      data.heartRate.push({
        avg: Math.floor(Math.random() * 20) + 60,
        max: Math.floor(Math.random() * 40) + 140,
        min: Math.floor(Math.random() * 10) + 50,
        date: today.toISOString(),
        source: device.name
      })
      data.itemsCount++
    }

    return data
  }

  const importDataToApp = (syncData) => {
    let itemsImported = 0
    let importedData = { activities: [], sleep: [] }

    // Import activities - matches ActivityTracker format
    if (syncData.activities && syncData.activities.length > 0) {
      const existingActivities = getJSON('activities', [])
      const formattedActivities = syncData.activities.map((act, idx) => ({
        id: Date.now() + idx,
        name: act.name || act.type || 'Workout',
        duration: act.duration || 30,
        calories: act.calories || 0,
        date: act.date || new Date().toISOString()
      }))
      
      // Add to activities array (newest first)
      const mergedActivities = [...formattedActivities, ...existingActivities]
      setJSON('activities', mergedActivities)
      importedData.activities = mergedActivities
      itemsImported += formattedActivities.length
      
      console.log(`✅ Imported ${formattedActivities.length} activities`)
      console.log('Sample activity:', formattedActivities[0])
    }

    // Import sleep - matches SleepTracker format (uses 'sleepLogs' key!)
    if (syncData.sleep && syncData.sleep.length > 0) {
      const existingSleep = getJSON('sleepLogs', [])
      const formattedSleep = syncData.sleep.map((sleep, idx) => ({
        id: Date.now() + idx + 1000,
        bedtime: sleep.bedtime || sleep.bedTime || '10:30 PM',
        wakeTime: sleep.wakeTime || '06:30 AM',
        duration: `${sleep.hours || sleep.durationHours || 7.5} hours`,
        durationHours: sleep.hours || sleep.durationHours || 7.5,
        quality: sleep.quality || 'Good',
        qualityEmoji: sleep.qualityEmoji || '😊',
        factors: sleep.factors || [],
        notes: sleep.notes || `Imported from ${sleep.source || 'wearable device'}`,
        date: sleep.date || new Date().toISOString(),
        dateString: new Date(sleep.date || new Date()).toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      }))
      
      const mergedSleep = [...formattedSleep, ...existingSleep]
      setJSON('sleepLogs', mergedSleep)
      importedData.sleep = mergedSleep
      itemsImported += formattedSleep.length
      
      console.log(`✅ Imported ${formattedSleep.length} sleep logs`)
      console.log('Sample sleep log:', formattedSleep[0])
    }

    // Update daily stats
    if (syncData.steps > 0) {
      const stats = getJSON('dailyStats', {})
      stats.stepsToday = (stats.stepsToday || 0) + syncData.steps
      setJSON('dailyStats', stats)
      itemsImported++
    }

    // Save import summary
    const importHistory = getJSON('importHistory', [])
    importHistory.unshift({
      date: new Date().toISOString(),
      itemsImported,
      source: syncData.source || 'manual',
      activities: syncData.activities?.length || 0,
      sleep: syncData.sleep?.length || 0,
      steps: syncData.steps || 0
    })
    setJSON('importHistory', importHistory.slice(0, 50)) // Keep last 50 imports

    console.log(`✅ Imported ${itemsImported} items:`, {
      activities: syncData.activities?.length || 0,
      sleep: syncData.sleep?.length || 0,
      steps: syncData.steps || 0
    })

    return itemsImported
  }

  const handleManualImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,.csv,.xml,.zip'
    
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return

      showMessage(t('wearableDevices.messages.importing') || 'Importing data...', 'info')

      try {
        // Check if it's a ZIP file (Apple Health export)
        if (file.name.endsWith('.zip')) {
          showMessage(t('wearableDevices.messages.zipNotSupported') || '⚠️ Please extract the ZIP file first and upload the export.xml file inside', 'error')
          return
        }

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
            const content = event.target.result
            let data
            
            console.log('File type:', file.name)
            console.log('File size:', file.size, 'bytes')
            
            // Parse based on file type
            if (file.name.endsWith('.json')) {
              try {
                data = JSON.parse(content)
                console.log('JSON parsed successfully')
              } catch (jsonError) {
                console.error('JSON parse error:', jsonError)
                showMessage(t('wearableDevices.messages.invalidJson') || '❌ Invalid JSON file', 'error')
                return
              }
            } else if (file.name.endsWith('.xml')) {
              // Basic XML parsing for Apple Health exports
              console.log('Parsing XML file...')
              data = parseAppleHealthXML(content)
              console.log('XML parsed, data items:', data.itemsCount)
            } else if (file.name.endsWith('.csv')) {
              // Basic CSV parsing
              console.log('Parsing CSV file...')
              data = parseCSV(content)
              console.log('CSV parsed')
            } else {
              // Try JSON by default
              try {
                data = JSON.parse(content)
              } catch {
                showMessage(t('wearableDevices.messages.unsupportedFormat') || '❌ Unsupported file format. Please use JSON, CSV, or XML', 'error')
                return
              }
            }
            
            if (data && data.itemsCount > 0) {
              const imported = importDataToApp(data)
              showMessage(t('wearableDevices.messages.importSuccess') + ` (${imported} ${t('wearableDevices.messages.items')})`, 'success')
              
              // Force reload to reflect changes in WellnessContext
              setTimeout(() => {
                window.location.reload()
              }, 1500)
            } else if (data && (data.activities || data.sleep || data.steps)) {
              const imported = importDataToApp(data)
              showMessage(t('wearableDevices.messages.importSuccess') + ` (${imported} ${t('wearableDevices.messages.items')})`, 'success')
              
              // Force reload to reflect changes
              setTimeout(() => {
                window.location.reload()
              }, 1500)
            } else {
              showMessage(t('wearableDevices.messages.noDataFound') || '⚠️ No health data found in file. Make sure you exported from your health app correctly.', 'error')
            }
        } catch (error) {
            console.error('Import error:', error)
            showMessage(`${t('wearableDevices.messages.importError')}: ${error.message}`, 'error')
          }
        }
        
        reader.onerror = (error) => {
          console.error('File read error:', error)
          showMessage(t('wearableDevices.messages.readError') || '❌ Failed to read file', 'error')
        }
        
      reader.readAsText(file)
      } catch (error) {
        console.error('File handling error:', error)
        showMessage(`❌ Error: ${error.message}`, 'error')
      }
    }
    
    input.click()
  }

  // Parse Apple Health XML export
  const parseAppleHealthXML = (xmlContent) => {
    // Sample parser - extracts basic metrics from Apple Health XML
    const data = { activities: [], sleep: [], steps: 0, itemsCount: 0 }
    
    // Extract step count
    const stepMatches = xmlContent.match(/type="HKQuantityTypeIdentifierStepCount".*?value="(\d+)"/g)
    if (stepMatches) {
      data.steps = stepMatches.reduce((sum, match) => {
        const value = parseInt(match.match(/value="(\d+)"/)?.[1] || 0)
        return sum + value
      }, 0)
      data.itemsCount++
    }

    // Extract sleep data
    const sleepMatches = xmlContent.match(/type="HKCategoryTypeIdentifierSleepAnalysis".*?/g)
    if (sleepMatches && sleepMatches.length > 0) {
      data.sleep.push({
        hours: 7.5, // Simplified
        quality: 'good',
        date: new Date().toISOString(),
        source: 'Apple Health'
      })
      data.itemsCount++
    }

    return data
  }

  // Parse CSV
  const parseCSV = (csvContent) => {
    const data = { activities: [], sleep: [], steps: 0, itemsCount: 0 }
    const lines = csvContent.split('\n')
    
    // Simple CSV parser - assumes first row is headers
    if (lines.length > 1) {
      const headers = lines[0].split(',')
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',')
        if (values.length === headers.length) {
          // Try to extract steps or activity
          const stepsIndex = headers.findIndex(h => h.toLowerCase().includes('step'))
          if (stepsIndex >= 0) {
            data.steps += parseInt(values[stepsIndex]) || 0
            data.itemsCount++
          }
        }
      }
    }

    return data
  }

  const getDataTypeIcon = (type) => {
    const icons = {
      steps: <Footprints size={16} />,
      heartRate: <Heart size={16} />,
      sleep: <Moon size={16} />,
      calories: <Zap size={16} />,
      workouts: <Activity size={16} />
    }
    return icons[type] || <Activity size={16} />
  }

  return (
    <div className="wearable-sync-container">
      {/* Header */}
      <div className="wearable-header">
        <div className="wearable-icon-wrapper">
          <Watch size={32} />
        </div>
        <div>
          <h1 className="wearable-title">{t('wearableDevices.title')}</h1>
          <p className="wearable-subtitle">
            {t('wearableDevices.subtitle')}
          </p>
        </div>
      </div>

      {/* Auto-Sync Toggle */}
      {connectedDevices.length > 0 && (
        <div style={{
          padding: '1rem 1.5rem',
          background: autoSyncEnabled ? '#f0fdf4' : '#fef2f2',
          border: `2px solid ${autoSyncEnabled ? '#22c55e' : '#ef4444'}`,
          borderRadius: '12px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#1a1a1a' }}>
              🔄 {t('wearableDevices.autoSync.title')}
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
              {autoSyncEnabled 
                ? t('wearableDevices.autoSync.enabled')
                : t('wearableDevices.autoSync.disabled')}
            </p>
          </div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none'
          }}>
            <input
              type="checkbox"
              checked={autoSyncEnabled}
              onChange={(e) => {
                const enabled = e.target.checked
                setAutoSyncEnabled(enabled)
                localStorage.setItem('autoSyncEnabled', enabled.toString())
                showMessage(
                  enabled 
                    ? t('wearableDevices.autoSync.enabledMessage')
                    : t('wearableDevices.autoSync.disabledMessage'),
                  'success'
                )
              }}
              style={{
                width: '50px',
                height: '28px',
                accentColor: '#22c55e',
                cursor: 'pointer'
              }}
            />
          </label>
        </div>
      )}

      {message && (
        <div className={`wearable-message ${messageType}`}>
          {messageType === 'success' && <CheckCircle size={20} />}
          {messageType === 'error' && <AlertCircle size={20} />}
          {messageType === 'info' && <RefreshCw size={20} />}
          <span>{message}</span>
        </div>
      )}

      {/* API Setup Notice */}
      {!apiConfigured && (
        <div style={{
          padding: '1.5rem',
          background: '#f0f9ff',
          border: '2px solid #0284c7',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#0369a1', fontSize: '1.1rem' }}>
            {t('wearableDevices.apiSetup.title')}
          </h3>
          <p style={{ margin: '0 0 12px 0', color: '#0c4a6e', fontSize: '0.95rem' }}>
            {t('wearableDevices.apiSetup.notConfigured')}
          </p>
          <div style={{ 
            padding: '12px', 
            background: '#d1fae5', 
            border: '1px solid #10b981', 
            borderRadius: '8px',
            marginBottom: '12px'
          }}>
            <p style={{ margin: 0, color: '#065f46', fontWeight: '600', fontSize: '0.9rem' }}>
              {t('wearableDevices.apiSetup.manualWorks')}
            </p>
            <p style={{ margin: '6px 0 0 0', color: '#064e3b', fontSize: '0.875rem' }}>
              {t('wearableDevices.apiSetup.manualInstructions')}
            </p>
          </div>
          <details style={{ fontSize: '0.875rem', color: '#0c4a6e' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '8px' }}>
              📱 How to export from your phone
            </summary>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li><strong>iPhone:</strong> Health app → Profile → Export All Health Data → Upload export.xml</li>
              <li><strong>Android:</strong> Google Fit → Settings → Download your data → Upload JSON/CSV</li>
              <li><strong>Samsung:</strong> Samsung Health → Settings → Download personal data</li>
            </ul>
          </details>
        </div>
      )}

      {/* Connected Devices */}
      {connectedDevices.length > 0 && (
        <div className="connected-section">
          <h3 className="section-title">
            <LinkIcon size={20} />
            {t('wearableDevices.connectedDevices')}
          </h3>
          <div className="connected-devices-grid">
            {connectedDevices.map((device) => (
              <div key={device.id} className="connected-device-card">
                <div className="device-header">
                  <div className="device-icon-name">
                    <span className="device-emoji">{device.icon}</span>
                    <div>
                      <h4>{device.name}</h4>
                      <p className="device-status connected">
                        <CheckCircle size={14} />
                        {t('wearableDevices.connected')}
                      </p>
                    </div>
                  </div>
                  <button
                    className="disconnect-btn"
                    onClick={() => handleDisconnect(device.id)}
                    title={t('wearableDevices.disconnect')}
                  >
                    <Unlink size={18} />
                  </button>
                </div>

                <div className="device-info">
                  <div className="info-row">
                    <span className="info-label">{t('wearableDevices.connectedOn')}:</span>
                    <span className="info-value">
                      {new Date(device.connectedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">{t('wearableDevices.lastSync')}:</span>
                    <span className="info-value">
                      {device.lastSync 
                        ? new Date(device.lastSync).toLocaleString()
                        : t('wearableDevices.never')}
                    </span>
                  </div>
                </div>

                <div className="device-data-types">
                  {device.dataTypes.map((type) => (
                    <span key={type} className="data-type-badge">
                      {getDataTypeIcon(type)}
                      {type}
                    </span>
                  ))}
                </div>

                <button
                  className="sync-btn"
                  onClick={() => handleSync(device.id)}
                >
                  <RefreshCw size={18} />
                  {t('wearableDevices.syncNow')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Devices */}
      <div className="available-section">
        <h3 className="section-title">
          <Smartphone size={20} />
          {t('wearableDevices.availableDevices')}
        </h3>
        <div className="available-devices-grid">
          {availableDevices.map((device) => (
            <div
              key={device.id}
              className={`available-device-card ${isConnected(device.id) ? 'connected' : ''}`}
            >
              <div className="device-card-header">
                <span className="device-emoji-large">{device.icon}</span>
                <h4>{device.name}</h4>
              </div>

              <p className="device-description">{device.description}</p>

              <div className="device-data-types">
                {device.dataTypes.slice(0, 4).map((type) => (
                  <span key={type} className="data-type-badge-small">
                    {getDataTypeIcon(type)}
                    {type}
                  </span>
                ))}
                {device.dataTypes.length > 4 && (
                  <span className="data-type-badge-small">+{device.dataTypes.length - 4}</span>
                )}
              </div>

              {isConnected(device.id) ? (
                <button className="connect-btn connected-state" disabled>
                  <CheckCircle size={18} />
                  {t('wearableDevices.connected')}
                </button>
              ) : (
                <button
                  className="connect-btn"
                  onClick={() => handleConnect(device)}
                >
                  <LinkIcon size={18} />
                  {t('wearableDevices.connect')}
                </button>
              )}

              <p className="setup-guide">
                <Settings size={14} />
                {device.setupGuide}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Import */}
      <div className="manual-import-section">
        <h3 className="section-title">
          <Upload size={20} />
          {t('wearableDevices.manualImport')}
        </h3>
        <div className="manual-import-card">
          <div className="import-info">
            <p><strong>{t('wearableDevices.cantFindDevice')}</strong></p>
            <p>{t('wearableDevices.manualImportDesc')}</p>
          </div>
          <button className="import-btn" onClick={handleManualImport}>
            <Upload size={18} />
            {t('wearableDevices.importDataFile')}
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="wearable-info">
        <h4>{t('wearableDevices.howItWorks')}</h4>
        <ul>
          <li><strong>{t('wearableDevices.tips.autoSync')}</strong> {t('wearableDevices.tips.autoSyncDesc')}</li>
          <li><strong>{t('wearableDevices.tips.manualSync')}</strong> {t('wearableDevices.tips.manualSyncDesc')}</li>
          <li><strong>{t('wearableDevices.tips.dataMapping')}</strong> {t('wearableDevices.tips.dataMappingDesc')}</li>
          <li><strong>{t('wearableDevices.tips.privacy')}</strong> {t('wearableDevices.tips.privacyDesc')}</li>
          <li><strong>{t('wearableDevices.tips.offline')}</strong> {t('wearableDevices.tips.offlineDesc')}</li>
        </ul>
      </div>

      {/* Debug Panel */}
      <div className="debug-section">
        <button className="debug-toggle-btn" onClick={() => setShowDebug(!showDebug)}>
          🐛 {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
        </button>
        
        {showDebug && (
          <div className="debug-panel">
            <h4>📊 Storage Debug Information</h4>
            <div className="debug-grid">
              <div className="debug-item">
                <strong>Activities in Storage:</strong>
                <span className="debug-value">{getJSON('activities', []).length} items</span>
              </div>
              <div className="debug-item">
                <strong>Sleep Logs in Storage:</strong>
                <span className="debug-value">{getJSON('sleepLogs', []).length} items</span>
              </div>
              <div className="debug-item">
                <strong>Connected Devices:</strong>
                <span className="debug-value">{connectedDevices.length} devices</span>
              </div>
              <div className="debug-item">
                <strong>Last Import:</strong>
                <span className="debug-value">
                  {getJSON('importHistory', [])[0]?.date 
                    ? new Date(getJSON('importHistory', [])[0].date).toLocaleString() 
                    : 'None'}
                </span>
              </div>
            </div>
            
            {getJSON('activities', []).length > 0 && (
              <div className="debug-data-preview">
                <strong>Latest Activity Data:</strong>
                <pre className="debug-code">{JSON.stringify(getJSON('activities', [])[0], null, 2)}</pre>
              </div>
            )}
            
            {getJSON('sleepLogs', []).length > 0 && (
              <div className="debug-data-preview">
                <strong>Latest Sleep Data:</strong>
                <pre className="debug-code">{JSON.stringify(getJSON('sleepLogs', [])[0], null, 2)}</pre>
              </div>
            )}
            
            <button className="force-refresh-btn" onClick={() => window.location.reload()}>
              <RefreshCw size={16} />
              Force Page Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default WearableSync

