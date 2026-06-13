import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  function getRole() {
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.role
    } catch {
      return null
    }
  }

  const role = getRole()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-amber-900 text-white px-8 py-4 flex items-center justify-between shadow-lg">
      <Link to="/" className="text-2xl font-bold tracking-wide hover:text-amber-200 transition">
        🥐 Sweet Bakery
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-amber-200 transition font-medium">
          Catálogo
        </Link>
        {token && (
          <Link to="/cart" className="hover:text-amber-200 transition font-medium">
            Carrito
          </Link>
        )}
        {role === 'ADMIN' && (
          <Link to="/admin/products" className="hover:text-amber-200 transition font-medium">
            Panel Admin
          </Link>
        )}
        {token ? (
          <button
            onClick={handleLogout}
            className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition font-medium"
          >
            Cerrar sesión
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-amber-200 transition font-medium">
              Entrar
            </Link>
            <Link
              to="/register"
              className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition font-medium"
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar