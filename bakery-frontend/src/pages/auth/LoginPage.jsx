import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login: saveToken } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const response = await login({ email, password })
      saveToken(response.data.token)
      navigate('/')
    } catch {
      setError('Email o contraseña incorrectos')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Bienvenido</h1>
        <p className="text-stone-500 mb-6">Inicia sesión en tu cuenta</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-amber-800 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-stone-500 mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-amber-700 font-semibold hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage