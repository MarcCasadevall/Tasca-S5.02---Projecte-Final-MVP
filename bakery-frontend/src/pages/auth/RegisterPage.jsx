import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext.jsx'

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
    } catch (err) {
      setError('Error al registrarse. Comprueba los datos.')
    }
  }

  return (
    <div>
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p>{error}</p>}
        <button type="submit">Registrarse</button>
      </form>
      <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
    </div>
  )
}

export default RegisterPage