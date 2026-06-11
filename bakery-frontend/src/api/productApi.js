import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080'
})

const authApi = axios.create({
  baseURL: 'http://localhost:8080'
})

authApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getProducts() {
  return api.get('/api/products')
}

export function createProduct(data) {
  return authApi.post('/api/admin/products', data)
}

export function updateProduct(id, data) {
  return authApi.put(`/api/admin/products/${id}`, data)
}

export function deactivateProduct(id) {
  return authApi.patch(`/api/admin/products/${id}/deactivate`)
}