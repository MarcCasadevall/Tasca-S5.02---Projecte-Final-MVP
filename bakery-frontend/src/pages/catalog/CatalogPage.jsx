import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getProducts } from '../../api/productApi'
import { addToCart } from '../../api/cartApi'

function CatalogPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addedProductId, setAddedProductId] = useState(null)
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getProducts()
      .then(response => setProducts(response.data))
      .catch(() => setError('Error al cargar los productos'))
      .finally(() => setLoading(false))
  }, [])

  function handleAddToCart(productId) {
    if (!token) {
      navigate('/login')
      return
    }
    addToCart(productId, 1)
      .then(() => {
        setAddedProductId(productId)
        setTimeout(() => setAddedProductId(null), 1500)
      })
      .catch(() => setError('Error al añadir al carrito'))
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <p className="text-amber-800 text-lg">Cargando productos...</p>
    </div>
  )

  if (error) return (
    <div className="flex justify-center py-20">
      <p className="text-red-500">{error}</p>
    </div>
  )

  return (
    <div>
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Nuestros productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={e => e.target.style.display = 'none'}
              />
            )}
            <div className="p-5">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                {product.category}
              </span>
              <h2 className="text-xl font-bold text-stone-800 mt-1">{product.name}</h2>
              <p className="text-stone-500 text-sm mt-2">{product.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-2xl font-bold text-amber-800">{product.price} €</span>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className={`px-4 py-2 rounded-lg transition text-sm font-medium text-white ${
                    addedProductId === product.id
                      ? 'bg-green-600'
                      : 'bg-amber-700 hover:bg-amber-600'
                  }`}
                >
                  {addedProductId === product.id ? '¡Añadido!' : 'Añadir al carrito'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CatalogPage