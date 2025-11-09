import React, { useState, useEffect } from 'react';
import { Bell, BellOff, RefreshCw, Copy, Check, AlertCircle } from 'lucide-react';
import {
  areNotificationsSupported,
  getNotificationPermissionStatus,
  getFCMToken,
  getStoredToken,
  deleteFCMToken,
  scheduleLocalNotification,
  initializeFCM,
  sendTokenToServer
} from '../../utils/fcmNotifications';
import { useTranslation } from 'react-i18next';
import './NotificationSettings.css';

const NotificationSettings = () => {
  const { t } = useTranslation();
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [fcmToken, setFcmToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = () => {
    if (!areNotificationsSupported()) {
      setPermissionStatus('unsupported');
      return;
    }

    const status = getNotificationPermissionStatus();
    setPermissionStatus(status);

    // Get stored token if available
    const storedToken = getStoredToken();
    setFcmToken(storedToken);
  };

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    
    try {
      // Check if running on HTTPS
      if (window.location.protocol !== 'https:' && !window.location.hostname.includes('localhost')) {
        alert(t('notifications.pushSettings.httpsRequired') || '⚠️ Push notifications require HTTPS. Please access the app via https://');
        setIsLoading(false);
        return;
      }

      const token = await initializeFCM();
      
      if (token) {
        setFcmToken(token);
        setPermissionStatus('granted');
        
        // Send token to server
        await sendTokenToServer(token);
        
        alert(t('notifications.pushSettings.enabledSuccess') || '✅ Push notifications enabled successfully!');
      } else {
        setPermissionStatus('denied');
        alert(t('notifications.pushSettings.enabledFailed') || '❌ Failed to enable notifications. Please check your browser settings.');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      alert(t('notifications.pushSettings.enabledError') || `❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshToken = async () => {
    setIsLoading(true);
    
    try {
      // Delete old token
      deleteFCMToken();
      
      // Get new token
      const newToken = await getFCMToken();
      
      if (newToken) {
        setFcmToken(newToken);
        await sendTokenToServer(newToken);
        alert(t('notifications.pushSettings.tokenRefreshed'));
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      alert(t('notifications.pushSettings.tokenRefreshFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToken = () => {
    if (fcmToken) {
      navigator.clipboard.writeText(fcmToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTestNotification = () => {
    // Check permission first
    if (Notification.permission !== 'granted') {
      alert(t('notifications.pushSettings.permissionNotGranted') || '⚠️ Notification permission not granted. Please enable notifications first.');
      return;
    }

    try {
      // Create notification
      const notification = new Notification(
        t('notifications.pushSettings.testNotificationTitle'),
        {
          body: t('notifications.pushSettings.testNotificationBody'),
          icon: '/sun.jpg',
          badge: '/sun.jpg',
          tag: 'test-notification',
          requireInteraction: false
        }
      );

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
      
      console.log('✅ Test notification sent successfully');
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert(t('notifications.pushSettings.testFailed') || `❌ Failed to send test notification: ${error.message}`);
    }
  };

  const getStatusBadge = () => {
    const badges = {
      granted: { text: t('notifications.pushSettings.statusLabels.enabled'), color: 'success', icon: <Bell size={16} /> },
      denied: { text: t('notifications.pushSettings.statusLabels.blocked'), color: 'danger', icon: <BellOff size={16} /> },
      default: { text: t('notifications.pushSettings.statusLabels.notSet'), color: 'warning', icon: <AlertCircle size={16} /> },
      unsupported: { text: t('notifications.pushSettings.statusLabels.notSupported'), color: 'danger', icon: <BellOff size={16} /> }
    };

    const badge = badges[permissionStatus] || badges.default;

    return (
      <span className={`status-badge status-badge-${badge.color}`}>
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  return (
    <div className="notification-settings">
      <div className="notification-settings-header">
        <h2 className="notification-settings-title">
          <Bell size={24} />
          {t('notifications.pushSettings.title')}
        </h2>
        <p className="notification-settings-description">
          {t('notifications.pushSettings.subtitle')}
        </p>
      </div>

      <div className="notification-status-card">
        <div className="notification-status-row">
          <span className="notification-status-label">{t('notifications.pushSettings.status')}:</span>
          {getStatusBadge()}
        </div>
      </div>

      {permissionStatus === 'unsupported' && (
        <div className="notification-alert alert-danger">
          <AlertCircle size={20} />
          <div>
            <strong>{t('notifications.pushSettings.notSupported')}</strong>
            <p>{t('notifications.pushSettings.notSupportedDesc')}</p>
          </div>
        </div>
      )}

      {permissionStatus === 'denied' && (
        <div className="notification-alert alert-warning">
          <AlertCircle size={20} />
          <div>
            <strong>{t('notifications.pushSettings.blocked')}</strong>
            <p>
              {t('notifications.pushSettings.blockedDesc')}
            </p>
          </div>
        </div>
      )}

      {permissionStatus === 'default' && (
        <>
          <div className="notification-card">
            <h3 className="notification-card-title">{t('notifications.pushSettings.enableTitle')}</h3>
            <p className="notification-card-text">
              {t('notifications.pushSettings.enableDesc')}
            </p>
            <button
              className="notification-button primary"
              onClick={handleEnableNotifications}
              disabled={isLoading}
            >
              {isLoading ? t('notifications.pushSettings.enabling') : t('notifications.pushSettings.enableButton')}
            </button>
          </div>

          <div className="notification-card" style={{ background: '#f8f9fa', border: '1px solid #e5e7eb' }}>
            <h3 className="notification-card-title" style={{ fontSize: '1rem' }}>{t('notifications.pushSettings.requirements')}</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0 0', fontSize: '0.875rem' }}>
              {t('notifications.pushSettings.requirementsList', { returnObjects: true }).map((req, i) => (
                <li key={i} style={{ padding: '6px 0', color: '#666' }}>{req}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      {permissionStatus === 'granted' && (
        <>
          <div className="notification-card">
            <h3 className="notification-card-title">{t('notifications.pushSettings.preferences')}</h3>
            
            <div className="notification-preference">
              <label className="notification-checkbox">
                <input type="checkbox" defaultChecked />
                <span>{t('notifications.pushSettings.dailyReminders')}</span>
              </label>
            </div>

            <div className="notification-preference">
              <label className="notification-checkbox">
                <input type="checkbox" defaultChecked />
                <span>{t('notifications.pushSettings.meditationAlerts')}</span>
              </label>
            </div>

            <div className="notification-preference">
              <label className="notification-checkbox">
                <input type="checkbox" defaultChecked />
                <span>{t('notifications.pushSettings.moodPrompts')}</span>
              </label>
            </div>

            <div className="notification-preference">
              <label className="notification-checkbox">
                <input type="checkbox" defaultChecked />
                <span>{t('notifications.pushSettings.milestones')}</span>
              </label>
            </div>
          </div>

          <div className="notification-card">
            <h3 className="notification-card-title">{t('notifications.pushSettings.testDebug')}</h3>
            
            <div className="notification-actions">
              <button
                className="notification-button secondary"
                onClick={handleTestNotification}
                disabled={testSent}
              >
                {testSent ? (
                  <>
                    <Check size={18} />
                    {t('notifications.pushSettings.sent')}
                  </>
                ) : (
                  <>
                    <Bell size={18} />
                    {t('notifications.pushSettings.sendTest')}
                  </>
                )}
              </button>

              <button
                className="notification-button secondary"
                onClick={handleRefreshToken}
                disabled={isLoading}
              >
                <RefreshCw size={18} className={isLoading ? 'spinning' : ''} />
                {t('notifications.pushSettings.refreshToken')}
              </button>
            </div>
          </div>

          {fcmToken && (
            <div className="notification-card">
              <h3 className="notification-card-title">{t('notifications.pushSettings.fcmToken')}</h3>
              <p className="notification-card-text">
                {t('notifications.pushSettings.fcmTokenDesc')}
              </p>
              
              <div className="token-display">
                <code className="token-code">{fcmToken}</code>
                <button
                  className="token-copy-button"
                  onClick={handleCopyToken}
                  title={t('notifications.pushSettings.copyToken')}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <div className="notification-info">
        <AlertCircle size={16} />
        <p>
          {t('notifications.pushSettings.info')}
        </p>
      </div>

      {/* Debug Info */}
      <div className="notification-card" style={{ background: '#f0f9ff', border: '1px solid #0284c7' }}>
        <h3 className="notification-card-title" style={{ fontSize: '0.9rem', color: '#0369a1' }}>
          🔍 Debug Information
        </h3>
        <div style={{ fontSize: '0.875rem', color: '#0c4a6e', lineHeight: '1.8' }}>
          <p><strong>Protocol:</strong> {window.location.protocol}</p>
          <p><strong>Permission Status:</strong> {permissionStatus}</p>
          <p><strong>Notification API:</strong> {typeof Notification !== 'undefined' ? '✅ Available' : '❌ Not Available'}</p>
          <p><strong>Service Worker:</strong> {'serviceWorker' in navigator ? '✅ Supported' : '❌ Not Supported'}</p>
          <p><strong>FCM Token:</strong> {fcmToken ? '✅ Generated' : '⚠️ Not Generated'}</p>
          {window.location.protocol !== 'https:' && !window.location.hostname.includes('localhost') && (
            <p style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '8px' }}>
              ⚠️ HTTPS Required! Access via: https://window-7vxw9pusi-ghada-rabees-projects.vercel.app
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;












