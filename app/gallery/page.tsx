'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getProducts, getCategories, Category } from '../../lib/supabase'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import FloatingWhatsApp from '../../components/FloatingWhatsApp'
import ProductCard from '../../components/ProductCard'
import { Grid, List, Filter } from 'lucide-react'

export default function Gallery() {
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategory])

  const fetchProducts = async () => {
    try {
      const data = await getProducts()
      console.log('Fetched products:', data.map(p => ({ name: p.name, category: p.category })))
      setProducts(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      console.log('Fetched categories:', data)
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const filterProducts = () => {
    console.log('Filtering products:', { selectedCategory, productsCount: products.length, categoriesCount: categories.length })
    if (selectedCategory === 'all') {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product => product.category === selectedCategory)
      console.log('Filtered products:', { selectedCategory, filteredCount: filtered.length })
      setFilteredProducts(filtered)
    }
  }

  // Get categories that have products, with "Other" category at the end
  const getActiveCategories = () => {
    const categoriesWithProducts = categories.filter(category => {
      const productCount = products.filter(p => p.category === category.slug).length
      return productCount > 0
    })

    // Separate "Other" category and place it at the end
    const otherCategory = categoriesWithProducts.find(cat => cat.slug === 'other')
    const regularCategories = categoriesWithProducts.filter(cat => cat.slug !== 'other')

    if (otherCategory) {
      return [...regularCategories, otherCategory]
    }
    return regularCategories
  }

  const activeCategories = getActiveCategories()

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-craft font-bold text-accent-800 mb-4">
            Our Gallery
          </h1>
          <p className="text-xl text-accent-600 max-w-3xl mx-auto">
            Explore our collection of handcrafted resin art pieces, each telling a unique story
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({products.length})
            </button>
            {activeCategories.map((category) => {
              const categoryProductCount = products.filter(p => p.category === category.slug).length
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.slug
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({categoryProductCount})
                </button>
              )
            })}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`grid gap-4 sm:gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1'
            }`}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </motion.div>
        )}
      </div>

      <Footer />
      <FloatingWhatsApp />
    </div>
  )
} 