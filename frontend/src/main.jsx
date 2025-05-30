import { AppContextProvider } from '../context/Appcontext.jsx'
import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <AppContextProvider>
    <App />
  </AppContextProvider>
)
