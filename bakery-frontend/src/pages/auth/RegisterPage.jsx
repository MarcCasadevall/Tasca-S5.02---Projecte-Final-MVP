import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login: saveToken } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const response = await register({ name, email, password })
      saveToken(response.data.token)
      navigate('/')
    } catch {
      setError('Error al registrarse. Comprueba los datos.')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Crear cuenta</h1>
        <p className="text-stone-500 mb-6">Únete a Sweet Bakery</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="password"
            placeholder="Contraseña (mínimo 8 caracteres)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-amber-800 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center text-stone-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-amber-700 font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage