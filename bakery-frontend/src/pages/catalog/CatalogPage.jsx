import { useEffect, useState } from 'react'
import { getProducts } from '../../api/productApi'

function CatalogPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProducts()
      .then(response => setProducts(response.data))
      .catch(() => setError('Error al cargar los productos'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Nuestros productos</h1>
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>{product.price} €</p>
          <p>{product.category}</p>
        </div>
      ))}
    </div>
  )
}

export default CatalogPage