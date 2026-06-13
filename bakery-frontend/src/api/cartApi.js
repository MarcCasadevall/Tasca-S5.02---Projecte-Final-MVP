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

export function getCart() {
  return authApi.get('/api/cart')
}

export function addToCart(productId, quantity) {
  return authApi.post('/api/cart/items', { productId, quantity })
}

export function updateCartItem(productId, quantity) {
  return authApi.put(`/api/cart/items/${productId}`, { quantity })
}

export function removeFromCart(productId) {
  return authApi.delete(`/api/cart/items/${productId}`)
}