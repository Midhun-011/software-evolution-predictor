import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Overview from './pages/Overview'
import RepositoryAnalysis from './pages/RepositoryAnalysis'

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/analysis" element={<RepositoryAnalysis />} />
        </Routes>
      </main>
    </div>
  )
}
