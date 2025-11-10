import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/rtl.css'
import './i18n/i18n'

// Add error handling
console.log('🚀 main.jsx loading...')

try {
  const rootElement = document.getElementById('root')
  
  if (!rootElement) {
    console.error('❌ Root element not found!')
    document.body.innerHTML = '<div style="padding: 20px; font-family: Arial; background: red; color: white;"><h1>ERROR: Root element missing</h1></div>'
  } else {
    console.log('✅ Root element found, rendering React app...')
    
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
    
    console.log('✅ React app rendered successfully')
  }
} catch (error) {
  console.error('❌ Error rendering app:', error)
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial; background: red; color: white;">
      <h1>ERROR Loading App</h1>
      <p>${error.message}</p>
      <pre>${error.stack}</pre>
    </div>
  `
}




