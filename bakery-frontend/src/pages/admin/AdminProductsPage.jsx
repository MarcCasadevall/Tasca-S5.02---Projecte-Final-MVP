import { useEffect, useState } from 'react'
import { getProducts, createProduct, deactivateProduct } from '../../api/productApi'

function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'CAKES', imageUrl: ''
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => { loadProducts() }, [])

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
      setSuccess('Producto creado correctamente')
      setTimeout(() => setSuccess(null), 3000)
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

  const inputClass = "border border-stone-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full"

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-amber-900 mb-8">Panel de administración</h1>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-stone-800 mb-4">Nuevo producto</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
          <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className={inputClass} />
          <input name="price" placeholder="Precio (€)" value={form.price} onChange={handleChange} className={inputClass} />
          <input name="description" placeholder="Descripción" value={form.description} onChange={handleChange} className={`${inputClass} col-span-2`} />
          <input name="imageUrl" placeholder="URL imagen" value={form.imageUrl} onChange={handleChange} className={inputClass} />
          <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
            <option value="CAKES">Tartas</option>
            <option value="COOKIES">Galletas</option>
            <option value="PASTRIES">Bollería</option>
            <option value="DRINKS">Bebidas</option>
            <option value="OTHER">Otros</option>
          </select>
          {error && <p className="text-red-500 text-sm col-span-2">{error}</p>}
          {success && <p className="text-green-600 text-sm col-span-2">{success}</p>}
          <button type="submit" className="col-span-2 bg-amber-800 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition">
            Crear producto
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-stone-800 mb-4">Productos activos</h2>
        <div className="flex flex-col gap-3">
          {products.map(product => (
            <div key={product.id} className="flex items-center justify-between border border-stone-100 rounded-xl p-4 hover:bg-amber-50 transition">
              <div className="flex items-center gap-4">
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} className="w-14 h-14 object-cover rounded-lg" />
                )}
                <div>
                  <p className="font-semibold text-stone-800">{product.name}</p>
                  <p className="text-sm text-stone-500">{product.category} · {product.price} €</p>
                </div>
              </div>
              <button
                onClick={() => handleDeactivate(product.id)}
                className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-lg transition"
              >
                Desactivar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminProductsPage