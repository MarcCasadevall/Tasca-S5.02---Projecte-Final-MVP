import axios from 'axios'

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

export function placeOrder(data) {
  return authApi.post('/api/orders', data)
}

export function getMyOrders() {
  return authApi.get('/api/orders/my')
}