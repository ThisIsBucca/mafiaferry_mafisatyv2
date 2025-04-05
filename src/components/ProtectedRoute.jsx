import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
} 