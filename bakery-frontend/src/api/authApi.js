import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080'
})

export function register(data) {
  return api.post('/api/auth/register', data)
}

export function login(data) {
  return api.post('/api/auth/login', data)
}