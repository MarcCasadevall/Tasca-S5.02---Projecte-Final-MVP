import { useEffect, useState } from 'react'
import { getProducts, createProduct, deactivateProduct } from '../../api/productApi'

function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'CAKES', imageUrl: ''
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [])

  function loadProducts() {
    getProducts()
      .then(response => setProducts(response.data))
      .catch(() => setError('Error al cargar productos'))
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleCreate(e) {
    e.preventDefault()
    try {
      await createProduct({ ...form, price: parseFloat(form.price) })
      setForm({ name: '', description: '', price: '', category: 'CAKES', imageUrl: '' })
      loadProducts()
    } catch {
      setError('Error al crear el producto')
    }
  }

  async function handleDeactivate(id) {
    try {
      await deactivateProduct(id)
      loadProducts()
    } catch {
      setError('Error al desactivar el producto')
    }
  }

  return (
    <div>
      <h1>Gestión de productos</h1>

      <h2>Nuevo producto</h2>
      <form onSubmit={handleCreate}>
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
        <input name="description" placeholder="Descripción" value={form.description} onChange={handleChange} />
        <input name="price" placeholder="Precio" value={form.price} onChange={handleChange} />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="CAKES">Tartas</option>
          <option value="COOKIES">Galletas</option>
          <option value="PASTRIES">Bollería</option>
          <option value="DRINKS">Bebidas</option>
          <option value="OTHER">Otros</option>
        </select>
        <input name="imageUrl" placeholder="URL imagen" value={form.imageUrl} onChange={handleChange} />
        {error && <p>{error}</p>}
        <button type="submit">Crear producto</button>
      </form>

      <h2>Productos activos</h2>
      {products.map(product => (
        <div key={product.id}>
          <strong>{product.name}</strong> — {product.price} € — {product.category}
          <button onClick={() => handleDeactivate(product.id)}>Desactivar</button>
        </div>
      ))}
    </div>
  )
}

export default AdminProductsPage