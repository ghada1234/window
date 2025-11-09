import { useState } from 'react'
import { Download, Upload, Database, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { createBackup, restoreBackup, downloadBackup } from '../utils/storageBackup'
import { getJSON, setJSON } from '../utils/storage'
import { useTranslation } from 'react-i18next'
import './DataBackup.css'

const DataBackup = () => {
  const { t } = useTranslation()
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
      showMessage(t('dataBackup.messages.downloadSuccess'), 'success')
    } catch (error) {
      console.error('Backup download error:', error)
      showMessage(t('dataBackup.messages.downloadError'), 'error')
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
            showMessage(t('dataBackup.messages.restoreSuccess'), 'success')
            setTimeout(() => window.location.reload(), 2000)
          } else {
            showMessage(t('dataBackup.messages.restoreError'), 'error')
          }
        } catch (error) {
          console.error('Backup restore error:', error)
          showMessage(t('dataBackup.messages.invalidFile'), 'error')
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
      showMessage(t('dataBackup.messages.manualBackupCreated'), 'success')
    } catch (error) {
      console.error('Manual backup error:', error)
      showMessage(t('dataBackup.messages.createError'), 'error')
    }
  }

  const handleRestoreAutoBackup = () => {
    try {
      const backup = getJSON('autoBackup')
      if (!backup) {
        showMessage(t('dataBackup.messages.noAutoBackup'), 'info')
        return
      }

      if (restoreBackup(backup)) {
        showMessage(t('dataBackup.messages.autoBackupRestored'), 'success')
        setTimeout(() => window.location.reload(), 2000)
      } else {
        showMessage(t('dataBackup.messages.autoRestoreError'), 'error')
      }
    } catch (error) {
      console.error('Auto-backup restore error:', error)
      showMessage(t('dataBackup.messages.autoRestoreError'), 'error')
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
          <h2 className="backup-title">{t('dataBackup.title')}</h2>
          <p className="backup-subtitle">
            {t('dataBackup.subtitle')}
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
            <h3>{t('dataBackup.autoBackup')}</h3>
          </div>
          <div className="backup-card-body">
            <p className="backup-description">
              {t('dataBackup.autoBackupDesc')}
            </p>
            <div className="backup-info">
              <div className="info-item">
                <span className="info-label">{t('dataBackup.status')}:</span>
                <span className={`info-value ${backupInfo.hasAutoBackup ? 'success' : 'warning'}`}>
                  {backupInfo.hasAutoBackup ? t('dataBackup.active') : t('dataBackup.noBackupYet')}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">{t('dataBackup.lastBackup')}:</span>
                <span className="info-value">{backupInfo.autoBackupDate}</span>
              </div>
            </div>
            <button 
              className="backup-btn primary"
              onClick={handleRestoreAutoBackup}
              disabled={!backupInfo.hasAutoBackup}
            >
              <Upload size={18} />
              {t('dataBackup.restoreAutoBackup')}
            </button>
          </div>
        </div>

        {/* Manual Backup */}
        <div className="backup-card">
          <div className="backup-card-header">
            <Database size={24} />
            <h3>{t('dataBackup.manualBackup')}</h3>
          </div>
          <div className="backup-card-body">
            <p className="backup-description">
              {t('dataBackup.manualBackupDesc')}
            </p>
            <div className="backup-info">
              <div className="info-item">
                <span className="info-label">{t('dataBackup.status')}:</span>
                <span className={`info-value ${backupInfo.hasManualBackup ? 'success' : 'warning'}`}>
                  {backupInfo.hasManualBackup ? t('dataBackup.available') : t('dataBackup.noBackup')}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">{t('dataBackup.created')}:</span>
                <span className="info-value">{backupInfo.manualBackupDate}</span>
              </div>
            </div>
            <button 
              className="backup-btn secondary"
              onClick={handleCreateManualBackup}
            >
              <Database size={18} />
              {t('dataBackup.createManualBackup')}
            </button>
          </div>
        </div>

        {/* Download Backup */}
        <div className="backup-card highlight">
          <div className="backup-card-header">
            <Download size={24} />
            <h3>{t('dataBackup.downloadBackup')}</h3>
          </div>
          <div className="backup-card-body">
            <p className="backup-description">
              {t('dataBackup.downloadBackupDesc')}
            </p>
            <div className="backup-features">
              <div className="feature-item">
                <CheckCircle size={16} />
                <span>{t('dataBackup.features.allData')}</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={16} />
                <span>{t('dataBackup.features.portable')}</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={16} />
                <span>{t('dataBackup.features.crossDevice')}</span>
              </div>
            </div>
            <button 
              className="backup-btn download"
              onClick={handleDownloadBackup}
            >
              <Download size={18} />
              {t('dataBackup.downloadBackupNow')}
            </button>
          </div>
        </div>

        {/* Upload Backup */}
        <div className="backup-card highlight">
          <div className="backup-card-header">
            <Upload size={24} />
            <h3>{t('dataBackup.restoreFromFile')}</h3>
          </div>
          <div className="backup-card-body">
            <p className="backup-description">
              {t('dataBackup.restoreFromFileDesc')}
            </p>
            <div className="backup-warning">
              <AlertCircle size={16} />
              <span>{t('dataBackup.warning')}</span>
            </div>
            <button 
              className="backup-btn upload"
              onClick={handleUploadBackup}
            >
              <Upload size={18} />
              {t('dataBackup.uploadRestore')}
            </button>
          </div>
        </div>
      </div>

      <div className="backup-tips">
        <h4>{t('dataBackup.bestPractices')}</h4>
        <ul>
          <li><strong>{t('dataBackup.tips.regularDownloads')}</strong> {t('dataBackup.tips.regularDownloadsDesc')}</li>
          <li><strong>{t('dataBackup.tips.safeStorage')}</strong> {t('dataBackup.tips.safeStorageDesc')}</li>
          <li><strong>{t('dataBackup.tips.beforeChanges')}</strong> {t('dataBackup.tips.beforeChangesDesc')}</li>
          <li><strong>{t('dataBackup.tips.deviceTransfer')}</strong> {t('dataBackup.tips.deviceTransferDesc')}</li>
          <li><strong>{t('dataBackup.tips.autoBackup')}</strong> {t('dataBackup.tips.autoBackupDesc')}</li>
        </ul>
      </div>
    </div>
  )
}

export default DataBackup

