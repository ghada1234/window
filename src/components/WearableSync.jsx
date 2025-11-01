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
import './WearableSync.css'

const WearableSync = () => {
  const [connectedDevices, setConnectedDevices] = useState([])
  const [syncStatus, setSyncStatus] = useState({})
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    loadConnectedDevices()
  }, [])

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

  const handleConnect = (device) => {
    if (isConnected(device.id)) {
      showMessage(`${device.name} is already connected`, 'info')
      return
    }

    // Simulate connection process
    showMessage(`Connecting to ${device.name}...`, 'info')
    
    setTimeout(() => {
      const newDevice = {
        ...device,
        connectedAt: new Date().toISOString(),
        lastSync: null,
        syncEnabled: true
      }
      
      const updated = [...connectedDevices, newDevice]
      setConnectedDevices(updated)
      setJSON('connectedWearables', updated)
      
      showMessage(`✅ ${device.name} connected successfully!`, 'success')
    }, 1500)
  }

  const handleDisconnect = (deviceId) => {
    const device = connectedDevices.find(d => d.id === deviceId)
    if (!device) return

    const updated = connectedDevices.filter(d => d.id !== deviceId)
    setConnectedDevices(updated)
    setJSON('connectedWearables', updated)
    
    showMessage(`${device.name} disconnected`, 'info')
  }

  const handleSync = async (deviceId) => {
    const device = connectedDevices.find(d => d.id === deviceId)
    if (!device) return

    showMessage(`Syncing ${device.name}...`, 'info')
    
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
      importDataToApp(syncData)
      
      // Update sync status
      const newStatus = { ...syncStatus, [deviceId]: 'success' }
      setSyncStatus(newStatus)
      setJSON('wearableSyncStatus', newStatus)
      
      showMessage(`✅ ${device.name} synced successfully! ${syncData.itemsCount} items imported.`, 'success')
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
        type: 'walk',
        duration: 30,
        calories: 150,
        date: today.toISOString(),
        source: device.name
      })
      data.itemsCount++
    }

    // Generate sleep data
    if (device.dataTypes.includes('sleep')) {
      data.sleep.push({
        hours: Math.floor(Math.random() * 3) + 6,
        quality: ['good', 'excellent', 'fair'][Math.floor(Math.random() * 3)],
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
    // Import activities
    if (syncData.activities.length > 0) {
      const existingActivities = getJSON('activities', [])
      setJSON('activities', [...existingActivities, ...syncData.activities])
    }

    // Import sleep
    if (syncData.sleep.length > 0) {
      const existingSleep = getJSON('sleep', [])
      setJSON('sleep', [...existingSleep, ...syncData.sleep])
    }

    // Update stats
    if (syncData.steps > 0) {
      const stats = getJSON('dailyStats', {})
      stats.stepsToday = (stats.stepsToday || 0) + syncData.steps
      setJSON('dailyStats', stats)
    }
  }

  const handleManualImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,.csv,.xml'
    
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result)
          importDataToApp(data)
          showMessage('✅ Data imported successfully!', 'success')
        } catch (error) {
          showMessage('❌ Failed to import data. Invalid format.', 'error')
        }
      }
      reader.readAsText(file)
    }
    
    input.click()
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
          <h1 className="wearable-title">Wearable Devices</h1>
          <p className="wearable-subtitle">
            Connect your fitness trackers and smartwatches to automatically sync health data
          </p>
        </div>
      </div>

      {message && (
        <div className={`wearable-message ${messageType}`}>
          {messageType === 'success' && <CheckCircle size={20} />}
          {messageType === 'error' && <AlertCircle size={20} />}
          {messageType === 'info' && <RefreshCw size={20} />}
          <span>{message}</span>
        </div>
      )}

      {/* Connected Devices */}
      {connectedDevices.length > 0 && (
        <div className="connected-section">
          <h3 className="section-title">
            <LinkIcon size={20} />
            Connected Devices
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
                        Connected
                      </p>
                    </div>
                  </div>
                  <button
                    className="disconnect-btn"
                    onClick={() => handleDisconnect(device.id)}
                    title="Disconnect"
                  >
                    <Unlink size={18} />
                  </button>
                </div>

                <div className="device-info">
                  <div className="info-row">
                    <span className="info-label">Connected:</span>
                    <span className="info-value">
                      {new Date(device.connectedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Last Sync:</span>
                    <span className="info-value">
                      {device.lastSync 
                        ? new Date(device.lastSync).toLocaleString()
                        : 'Never'}
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
                  Sync Now
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
          Available Devices
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
                  Connected
                </button>
              ) : (
                <button
                  className="connect-btn"
                  onClick={() => handleConnect(device)}
                >
                  <LinkIcon size={18} />
                  Connect
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
          Manual Import
        </h3>
        <div className="manual-import-card">
          <div className="import-info">
            <p><strong>Can't find your device?</strong></p>
            <p>Manually import your health data from JSON, CSV, or XML files exported from your device or app.</p>
          </div>
          <button className="import-btn" onClick={handleManualImport}>
            <Upload size={18} />
            Import Data File
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="wearable-info">
        <h4>💡 How Wearable Sync Works</h4>
        <ul>
          <li><strong>Automatic Sync:</strong> Data syncs automatically when you open the app</li>
          <li><strong>Manual Sync:</strong> Click "Sync Now" to pull latest data anytime</li>
          <li><strong>Data Mapping:</strong> Health data automatically populates your wellness trackers</li>
          <li><strong>Privacy:</strong> Your data stays on your device - no cloud storage</li>
          <li><strong>Offline Support:</strong> Import data files when offline</li>
        </ul>
      </div>
    </div>
  )
}

export default WearableSync

