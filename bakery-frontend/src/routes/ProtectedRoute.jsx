import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, requiredRole }) {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/login" />
  }

  if (requiredRole) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userRole = payload.role || 
        (payload.authorities?.[0]?.authority?.replace('ROLE_', ''))
      
      if (userRole !== requiredRole) {
        return <Navigate to="/" />
      }
    } catch {
      return <Navigate to="/login" />
    }
  }

  return children
}

export default ProtectedRoute