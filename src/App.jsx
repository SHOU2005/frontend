import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import AnalysisPage from './pages/AnalysisPage'
import ResultsPage from './pages/ResultsPage'
import LoginPage from './pages/LoginPage'

// Protected Route wrapper component
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    // Check authentication status from sessionStorage
    const authStatus = sessionStorage.getItem('isAuthenticated')
    setIsAuthenticated(authStatus === 'true')
    setIsLoading(false)
  }, [])

  if (isLoading) {
    // Show loading state while checking auth
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 animate-pulse">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
          <p className="text-white/60">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login while preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

// Logout component to clear session and redirect
function Logout() {
  sessionStorage.removeItem('isAuthenticated')
  sessionStorage.removeItem('userId')
  return <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      {/* Public route - Login page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Logout route */}
      <Route path="/logout" element={<Logout />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <LandingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analyze"
        element={
          <ProtectedRoute>
            <AnalysisPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home (which will redirect to login if needed) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

