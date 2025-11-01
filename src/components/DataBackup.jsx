import { useState } from 'react'
import { Download, Upload, Database, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { createBackup, restoreBackup, downloadBackup } from '../utils/storageBackup'
import { getJSON, setJSON } from '../utils/storage'
import './DataBackup.css'

const DataBackup = () => {
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // success, error, info

  const showMessage = (text, type = 'info') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, 5000)
  }

  const handleDownloadBackup = () => {
    try {
      downloadBackup()
      showMessage('✅ Backup downloaded successfully!', 'success')
    } catch (error) {
      console.error('Backup download error:', error)
      showMessage('❌ Failed to download backup', 'error')
    }
  }

  const handleUploadBackup = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const backup = JSON.parse(event.target.result)
          if (restoreBackup(backup)) {
            showMessage('✅ Backup restored successfully! Please refresh the page.', 'success')
            setTimeout(() => window.location.reload(), 2000)
          } else {
            showMessage('❌ Failed to restore backup', 'error')
          }
        } catch (error) {
          console.error('Backup restore error:', error)
          showMessage('❌ Invalid backup file', 'error')
        }
      }
      reader.readAsText(file)
    }
    
    input.click()
  }

  const handleCreateManualBackup = () => {
    try {
      const backup = createBackup()
      setJSON('manualBackup', backup)
      showMessage('✅ Manual backup created in browser storage', 'success')
    } catch (error) {
      console.error('Manual backup error:', error)
      showMessage('❌ Failed to create backup', 'error')
    }
  }

  const handleRestoreAutoBackup = () => {
    try {
      const backup = getJSON('autoBackup')
      if (!backup) {
        showMessage('⚠️ No auto-backup found', 'info')
        return
      }

      if (restoreBackup(backup)) {
        showMessage('✅ Auto-backup restored! Please refresh the page.', 'success')
        setTimeout(() => window.location.reload(), 2000)
      } else {
        showMessage('❌ Failed to restore auto-backup', 'error')
      }
    } catch (error) {
      console.error('Auto-backup restore error:', error)
      showMessage('❌ Failed to restore auto-backup', 'error')
    }
  }

  const getBackupInfo = () => {
    const autoBackup = getJSON('autoBackup')
    const manualBackup = getJSON('manualBackup')
    
    return {
      hasAutoBackup: !!autoBackup,
      autoBackupDate: autoBackup?.timestamp ? new Date(autoBackup.timestamp).toLocaleString() : 'Never',
      hasManualBackup: !!manualBackup,
      manualBackupDate: manualBackup?.timestamp ? new Date(manualBackup.timestamp).toLocaleString() : 'Never'
    }
  }

  const backupInfo = getBackupInfo()

  return (
    <div className="data-backup-container">
      <div className="backup-header">
        <div className="backup-icon-wrapper">
          <Database size={32} />
        </div>
        <div>
          <h2 className="backup-title">Data Backup & Recovery</h2>
          <p className="backup-subtitle">
            Protect your wellness data with automatic and manual backups
          </p>
        </div>
      </div>

      {message && (
        <div className={`backup-message ${messageType}`}>
          {messageType === 'success' && <CheckCircle size={20} />}
          {messageType === 'error' && <AlertCircle size={20} />}
          {messageType === 'info' && <Database size={20} />}
          <span>{message}</span>
        </div>
      )}

      <div className="backup-grid">
        {/* Auto Backup */}
        <div className="backup-card">
          <div className="backup-card-header">
            <RefreshCw size={24} />
            <h3>Automatic Backup</h3>
          </div>
          <div className="backup-card-body">
            <p className="backup-description">
              Automatic backups are created every 5 minutes and before you close the app.
            </p>
            <div className="backup-info">
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`info-value ${backupInfo.hasAutoBackup ? 'success' : 'warning'}`}>
                  {backupInfo.hasAutoBackup ? '✓ Active' : '⚠ No backup yet'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Backup:</span>
                <span className="info-value">{backupInfo.autoBackupDate}</span>
              </div>
            </div>
            <button 
              className="backup-btn primary"
              onClick={handleRestoreAutoBackup}
              disabled={!backupInfo.hasAutoBackup}
            >
              <Upload size={18} />
              Restore Auto-Backup
            </button>
          </div>
        </div>

        {/* Manual Backup */}
        <div className="backup-card">
          <div className="backup-card-header">
            <Database size={24} />
            <h3>Manual Backup</h3>
          </div>
          <div className="backup-card-body">
            <p className="backup-description">
              Create a backup in browser storage that persists until you clear it manually.
            </p>
            <div className="backup-info">
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`info-value ${backupInfo.hasManualBackup ? 'success' : 'warning'}`}>
                  {backupInfo.hasManualBackup ? '✓ Available' : '⚠ No backup'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Created:</span>
                <span className="info-value">{backupInfo.manualBackupDate}</span>
              </div>
            </div>
            <button 
              className="backup-btn secondary"
              onClick={handleCreateManualBackup}
            >
              <Database size={18} />
              Create Manual Backup
            </button>
          </div>
        </div>

        {/* Download Backup */}
        <div className="backup-card highlight">
          <div className="backup-card-header">
            <Download size={24} />
            <h3>Download Backup File</h3>
          </div>
          <div className="backup-card-body">
            <p className="backup-description">
              Download all your wellness data as a JSON file. Keep it safe for future recovery.
            </p>
            <div className="backup-features">
              <div className="feature-item">
                <CheckCircle size={16} />
                <span>All wellness data included</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={16} />
                <span>Portable JSON format</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={16} />
                <span>Works across devices</span>
              </div>
            </div>
            <button 
              className="backup-btn download"
              onClick={handleDownloadBackup}
            >
              <Download size={18} />
              Download Backup Now
            </button>
          </div>
        </div>

        {/* Upload Backup */}
        <div className="backup-card highlight">
          <div className="backup-card-header">
            <Upload size={24} />
            <h3>Restore from File</h3>
          </div>
          <div className="backup-card-body">
            <p className="backup-description">
              Upload a previously downloaded backup file to restore all your data.
            </p>
            <div className="backup-warning">
              <AlertCircle size={16} />
              <span>This will overwrite current data</span>
            </div>
            <button 
              className="backup-btn upload"
              onClick={handleUploadBackup}
            >
              <Upload size={18} />
              Upload & Restore Backup
            </button>
          </div>
        </div>
      </div>

      <div className="backup-tips">
        <h4>💡 Backup Best Practices</h4>
        <ul>
          <li><strong>Regular Downloads:</strong> Download a backup file weekly for extra safety</li>
          <li><strong>Safe Storage:</strong> Store backup files in a secure location (cloud drive, USB)</li>
          <li><strong>Before Changes:</strong> Create a manual backup before major changes</li>
          <li><strong>Device Transfer:</strong> Use backup files to move data between devices</li>
          <li><strong>Auto-Backup:</strong> Runs automatically - no action needed!</li>
        </ul>
      </div>
    </div>
  )
}

export default DataBackup

