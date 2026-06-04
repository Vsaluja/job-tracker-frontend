import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import EditApplication from './pages/EditApplication/EditApplication'
import './App.css'

function App() {
  const [jobs, setJobs] = useState([])
  const API_BASE = import.meta.env.VITE_API_URL
  const API_URL = `${API_BASE}/api/applications/`

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch(API_URL)
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Main Dashboard Route */}
        <Route
          path="/"
          element={<Dashboard jobs={jobs} fetchJobs={fetchJobs} API_URL={API_URL} />}
        />
        {/* Update Application Form Route */}
        <Route
          path="/applications/:id"
          element={<EditApplication API_URL={API_URL} fetchJobs={fetchJobs} />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App