'use client'

import { useState, useEffect } from 'react'
import { getProducts } from '../../lib/supabase'
import ProductCard from '../../components/ProductCard'

export default function TestProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await getProducts()
      console.log('Fetched products:', data)
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Products Test Page</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            <p><strong>Total Products:</strong> {products.length}</p>
            <p><strong>Products with IDs:</strong></p>
            <ul className="list-disc list-inside mt-2">
              {products.map(product => (
                <li key={product.id}>
                  {product.name} (ID: {product.id})
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, index) => (
            <div key={product.id} className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Product {index + 1}</p>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found. Check your database setup.</p>
          </div>
        )}
      </div>
    </div>
  )
} 