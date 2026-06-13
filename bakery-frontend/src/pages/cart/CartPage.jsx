import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCart, updateCartItem, removeFromCart } from '../../api/cartApi'

function CartPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getCart()
      .then(response => setItems(response.data))
      .catch(() => setError('Error al cargar el carrito'))
      .finally(() => setLoading(false))
  }, [])

  function handleUpdateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return
    updateCartItem(productId, newQuantity)
      .then(response => {
        setItems(prev => prev.map(item =>
          item.productId === productId ? response.data : item
        ))
      })
      .catch(() => setError('Error al actualizar la cantidad'))
  }

  function handleRemove(productId) {
    removeFromCart(productId)
      .then(() => {
        setItems(prev => prev.filter(item => item.productId !== productId))
      })
      .catch(() => setError('Error al eliminar el producto'))
  }

  const total = items.reduce((sum, item) => sum + item.subtotal, 0)

  if (loading) return (
    <div className="flex justify-center py-20">
      <p className="text-amber-800 text-lg">Cargando carrito...</p>
    </div>
  )

  if (error) return (
    <div className="flex justify-center py-20">
      <p className="text-red-500">{error}</p>
    </div>
  )

  if (items.length === 0) return (
    <div className="flex flex-col items-center py-20 gap-4">
      <p className="text-stone-500 text-lg">Tu carrito está vacío</p>
      <Link
        to="/"
        className="bg-amber-700 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition font-medium"
      >
        Ver productos
      </Link>
    </div>
  )

  return (
    <div>
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Mi carrito</h1>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {items.map((item, index) => (
          <div
            key={item.productId}
            className={`flex items-center gap-4 p-5 ${index !== items.length - 1 ? 'border-b border-stone-100' : ''}`}
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                onError={e => e.target.style.display = 'none'}
              />
            )}
            <div className="flex-1">
              <p className="font-semibold text-stone-800">{item.productName}</p>
              <p className="text-sm text-stone-500">{item.unitPrice} € / unidad</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition flex items-center justify-center"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold text-stone-800">{item.quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition flex items-center justify-center"
              >
                +
              </button>
            </div>
            <p className="w-24 text-right font-bold text-amber-800">
              {item.subtotal.toFixed(2)} €
            </p>
            <button
              onClick={() => handleRemove(item.productId)}
              className="text-red-400 hover:text-red-600 transition text-sm font-medium ml-2"
            >
              Eliminar
            </button>
          </div>
        ))}
        <div className="flex items-center justify-between p-5 bg-amber-50 border-t border-stone-200">
          <p className="text-xl font-bold text-stone-800">Total</p>
          <p className="text-2xl font-bold text-amber-800">{total.toFixed(2)} €</p>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          disabled
          className="bg-amber-700 text-white px-8 py-3 rounded-xl font-semibold opacity-50 cursor-not-allowed"
        >
          Proceder al pedido
        </button>
      </div>
    </div>
  )
}

export default CartPage