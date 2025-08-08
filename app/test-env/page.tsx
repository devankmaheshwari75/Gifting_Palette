'use client'

import React, { useState, useEffect } from 'react'
import { getCategories, getProducts } from '../../lib/supabase'

export default function TestEnv() {
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    testData()
  }, [])

  const testData = async () => {
    try {
      console.log('Testing categories fetch...')
      const categoriesData = await getCategories()
      console.log('Categories result:', categoriesData)
      setCategories(categoriesData)

      console.log('Testing products fetch...')
      const productsData = await getProducts()
      console.log('Products result:', productsData)
      setProducts(productsData)
    } catch (error) {
      console.error('Error testing data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Environment Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set'}</p>
          <p><strong>SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Categories Test</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>Categories Count:</strong> {categories.length}</p>
          <p><strong>Categories Data:</strong></p>
          <pre className="bg-white p-2 rounded text-sm overflow-auto">
            {JSON.stringify(categories, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Products Test</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>Products Count:</strong> {products.length}</p>
          <p><strong>Product Categories:</strong></p>
          <ul className="list-disc list-inside">
            {products.map(product => (
              <li key={product.id}>{product.name} - {product.category}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
} 