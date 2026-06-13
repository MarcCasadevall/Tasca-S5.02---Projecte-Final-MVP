import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCart } from '../../api/cartApi'
import { placeOrder } from '../../api/orderApi'

function CheckoutPage() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [fullName, setFullName] = useState('')
  const [dni, setDni] = useState('')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const navigate = useNavigate()

  useEffect(() => {
    getCart()
      .then(response => setCartItems(response.data))
      .catch(() => setError('Error al cargar el carrito'))
      .finally(() => setLoading(false))
  }, [])

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0)

  function handleSubmit() {
    if (!fullName || !dni || !address) {
      setError('Por favor rellena todos los campos')
      return
    }
    setSubmitting(true)
    setError(null)
    placeOrder({ fullName, dni, address, paymentMethod })
      .then(() => setSuccess(true))
      .catch(() => setError('Error al realizar el pedido'))
      .finally(() => setSubmitting(false))
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <p className="text-amber-800 text-lg">Cargando...</p>
    </div>
  )

  if (success) return (
    <div className="flex flex-col items-center py-20 gap-6">
      <div className="text-6xl">🎉</div>
      <h2 className="text-2xl font-bold text-amber-900">¡Pedido realizado!</h2>
      <p className="text-stone-500">Te avisaremos cuando esté listo.</p>
      <button
        onClick={() => navigate('/')}
        className="bg-amber-700 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition font-medium"
      >
        Volver al catálogo
      </button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Finalizar pedido</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-stone-800 mb-4">Resumen del pedido</h2>
          <div className="divide-y divide-stone-100">
            {cartItems.map(item => (
              <div key={item.productId} className="flex justify-between py-3">
                <div>
                  <p className="font-medium text-stone-800">{item.productName}</p>
                  <p className="text-sm text-stone-500">{item.quantity} × {item.unitPrice} €</p>
                </div>
                <p className="font-semibold text-amber-800">{item.subtotal.toFixed(2)} €</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4 border-t border-stone-200 mt-2">
            <p className="text-lg font-bold text-stone-800">Total</p>
            <p className="text-xl font-bold text-amber-800">{total.toFixed(2)} €</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-stone-800 mb-2">Datos de entrega</h2>
          <input
            type="text"
            placeholder="Nombre completo"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="border border-stone-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            type="text"
            placeholder="DNI"
            value={dni}
            onChange={e => setDni(e.target.value)}
            className="border border-stone-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            type="text"
            placeholder="Dirección"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="border border-stone-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <div>
            <p className="text-sm font-semibold text-stone-700 mb-2">Método de pago</p>
            <div className="flex gap-3">
              <button
                onClick={() => setPaymentMethod('CASH')}
                className={`flex-1 py-2 rounded-lg border-2 font-medium transition ${
                  paymentMethod === 'CASH'
                    ? 'border-amber-700 bg-amber-50 text-amber-800'
                    : 'border-stone-200 text-stone-500 hover:border-amber-300'
                }`}
              >
                💵 Efectivo
              </button>
              <button
                onClick={() => setPaymentMethod('CARD')}
                className={`flex-1 py-2 rounded-lg border-2 font-medium transition ${
                  paymentMethod === 'CARD'
                    ? 'border-amber-700 bg-amber-50 text-amber-800'
                    : 'border-stone-200 text-stone-500 hover:border-amber-300'
                }`}
              >
                💳 Tarjeta
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-amber-700 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Procesando...' : 'Confirmar pedido'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage