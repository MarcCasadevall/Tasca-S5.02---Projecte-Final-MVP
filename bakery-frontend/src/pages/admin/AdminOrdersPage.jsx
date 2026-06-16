import { useEffect, useState } from 'react'
import { getAllOrders, updateOrderStatus } from '../../api/orderApi'

function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAllOrders()
      .then(response => setOrders(response.data))
      .catch(() => setError('Error al cargar los pedidos'))
      .finally(() => setLoading(false))
  }, [])

  function handleStatusChange(orderId, newStatus) {
    updateOrderStatus(orderId, newStatus)
      .then(response => {
        setOrders(prev => prev.map(order =>
          order.id === orderId ? response.data : order
        ))
      })
      .catch(() => setError('Error al actualizar el estado'))
  }

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
    <div className="flex justify-center py-20">
      <p className="text-stone-500 text-lg">No hay pedidos todavía</p>
    </div>
  )

  return (
    <div>
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Gestión de pedidos</h1>
      <div className="flex flex-col gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-bold text-stone-800">Pedido #{order.id}</p>
                <p className="text-sm text-stone-500">
                  {new Date(order.createdAt).toLocaleDateString('es-ES', {
                    day: '2-digit', month: 'long', year: 'numeric'
                  })}
                </p>
                <p className="text-sm text-stone-600 mt-1">{order.fullName} · {order.dni}</p>
                <p className="text-sm text-stone-500">{order.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-stone-500">
                  {order.paymentMethod === 'CASH' ? '💵 Efectivo' : '💳 Tarjeta'}
                </span>
                <select
                  value={order.status}
                  onChange={e => handleStatusChange(order.id, e.target.value)}
                  className={`text-sm font-semibold px-3 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    order.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                    order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="CONFIRMED">Confirmado</option>
                  <option value="DELIVERED">Entregado</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
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
            <div className="flex justify-end pt-4 border-t border-stone-200 mt-2">
              <p className="text-lg font-bold text-amber-800">{order.total.toFixed(2)} €</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminOrdersPage