import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyOrders } from '../../api/orderApi'

function OrderHistoryPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMyOrders()
      .then(response => setOrders(response.data))
      .catch(() => setError('Error al cargar los pedidos'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center py-20">
      <p className="text-amber-800 text-lg">Cargando pedidos...</p>
    </div>
  )

  if (error) return (
    <div className="flex justify-center py-20">
      <p className="text-red-500">{error}</p>
    </div>
  )

  if (orders.length === 0) return (
    <div className="flex flex-col items-center py-20 gap-4">
      <p className="text-stone-500 text-lg">Todavía no has hecho ningún pedido</p>
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
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Mis pedidos</h1>
      <div className="flex flex-col gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-stone-500">Pedido #{order.id}</p>
                <p className="text-sm text-stone-400">
                  {new Date(order.createdAt).toLocaleDateString('es-ES', {
                    day: '2-digit', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  order.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                  order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status === 'PENDING' ? 'Pendiente' :
                   order.status === 'CONFIRMED' ? 'Confirmado' :
                   order.status === 'DELIVERED' ? 'Entregado' : 'Cancelado'}
                </span>
                <span className="text-sm text-stone-500">
                  {order.paymentMethod === 'CASH' ? '💵 Efectivo' : '💳 Tarjeta'}
                </span>
              </div>
            </div>
            <div className="divide-y divide-stone-100">
              {order.items.map(item => (
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
              <div>
                <p className="text-sm text-stone-500">{order.address}</p>
              </div>
              <p className="text-lg font-bold text-amber-800">{order.total.toFixed(2)} €</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderHistoryPage