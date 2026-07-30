import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import WeeklyReport from './pages/WeeklyReport'
import InventoryReport from './pages/InventoryReport'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/brands" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/report/:slug/weekly" element={<ProtectedRoute><WeeklyReport /></ProtectedRoute>} />
      <Route path="/report/:slug/inventory" element={<ProtectedRoute><InventoryReport /></ProtectedRoute>} />
      <Route path="/report/:slug/:type" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
