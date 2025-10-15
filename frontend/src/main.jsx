// src/main.jsx (FIXED - ADD BrowserRouter)
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);
// ...existing code...
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'; // 👈 IMPORT THIS
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 👈 WRAP <App /> with <BrowserRouter> */}
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </StrictMode>,
)