import { useEffect } from 'react'

/**
 * OAuth Callback Handler
 * Handles OAuth redirects from health platforms (Google Fit, Fitbit, etc.)
 */
const OAuthCallback = () => {
  useEffect(() => {
    // Extract token from URL hash
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    
    const accessToken = params.get('access_token')
    const state = params.get('state')
    const error = params.get('error')

    if (error) {
      console.error('OAuth error:', error)
      window.opener?.postMessage({ 
        type: 'oauth_error', 
        error 
      }, window.location.origin)
      window.close()
      return
    }

    if (accessToken && state) {
      // Send token back to parent window
      window.opener?.postMessage({ 
        type: 'oauth_success', 
        accessToken,
        state
      }, window.location.origin)
      
      // Close popup after a short delay
      setTimeout(() => window.close(), 1000)
    }
  }, [])

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div className="spinner" style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }}></div>
      <p style={{ color: '#666', fontSize: '14px' }}>
        ✅ Authorization successful! Closing window...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default OAuthCallback


