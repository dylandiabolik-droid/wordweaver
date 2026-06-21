import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import EtsyListingGenerator from './EtsyListingGenerator.jsx'
import { Imprint, Privacy } from './LegalPages.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EtsyListingGenerator />} />
        <Route path="/etsy-listing-generator" element={<Navigate to="/" replace />} />
        <Route path="/imprint" element={<Imprint />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  </React.StrictMode>,
)
