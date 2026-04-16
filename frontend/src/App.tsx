import type { ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Layout } from './components/Layout/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { GoatPage } from './pages/Goat'
import { FeedingPage } from './pages/Feeding'
import { HealthPage } from './pages/Health'
import { ExpensePage } from './pages/Expense'
import { SalesPage } from './pages/Sales'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="goats" element={<GoatPage />} />
        <Route path="feeding" element={<FeedingPage />} />
        <Route path="health" element={<HealthPage />} />
        <Route path="expense" element={<ExpensePage />} />
        <Route path="sales" element={<SalesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

