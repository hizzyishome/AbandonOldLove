import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Login } from '@/features/auth/Login'
import { Dashboard } from '@/features/star-list/Dashboard'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import '@/i18n/config'
import * as React from 'react'

// Initialize theme on load
useThemeStore.getState();

// Auth Guard Component
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <RequireAuth>
             <Dashboard />
          </RequireAuth>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
