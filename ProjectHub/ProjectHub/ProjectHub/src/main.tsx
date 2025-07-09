import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { configureServices } from './config/serviceConfig'
import PowerProvider from './PowerProvider.tsx'

// Configure services before rendering the app
configureServices()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PowerProvider>
      <App />
    </PowerProvider>
  </StrictMode>,
)
