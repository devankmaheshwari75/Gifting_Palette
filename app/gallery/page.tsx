'use client'

import React, { useState, useEffect, useMemo } from 'react'
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
      console.log('Categories count:', data.length)
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const filterProducts = () => {
    console.log('Filtering products:', { selectedCategory, productsCount: products.length, categoriesCount: categories.length })
    console.log('Available categories:', categories.map(c => ({ name: c.name, slug: c.slug })))
    console.log('Product categories:', products.map(p => p.category))
    
    if (selectedCategory === 'all') {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product => product.category === selectedCategory)
      console.log('Filtered products:', { selectedCategory, filteredCount: filtered.length })
      setFilteredProducts(filtered)
    }
  }

  // Get categories that have products, with "Other" category at the end - now reactive with useMemo
  const activeCategories = useMemo(() => {
    console.log('Getting active categories...')
    console.log('All categories:', categories)
    console.log('All products:', products.map(p => ({ name: p.name, category: p.category })))
    
    // If no categories from database, create fallback categories from product data
    if (categories.length === 0) {
      console.log('No categories in database, creating fallback from products...')
      const uniqueCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean)
      
      const fallbackCategories = uniqueCategories.map(categorySlug => ({
        id: categorySlug,
        name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' '),
        slug: categorySlug,
        created_at: new Date().toISOString()
      }))
      
      console.log('Fallback categories:', fallbackCategories)
      return fallbackCategories
    }
    
    const categoriesWithProducts = categories.filter(category => {
      const productCount = products.filter(p => p.category === category.slug).length
      console.log(`Category ${category.name} (${category.slug}): ${productCount} products`)
      return productCount > 0
    })

    console.log('Categories with products:', categoriesWithProducts)

    // Separate "Other" category and place it at the end
    const otherCategory = categoriesWithProducts.find(cat => cat.slug === 'other')
    const regularCategories = categoriesWithProducts.filter(cat => cat.slug !== 'other')

    if (otherCategory) {
      return [...regularCategories, otherCategory]
    }
    return regularCategories
  }, [categories, products]) // Dependencies ensure it updates when either changes

  // Debug logging
  useEffect(() => {
    console.log('Active categories for filtering:', activeCategories)
  }, [activeCategories])

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
          className="mb-8"
        >
          {/* Filter Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Filter className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Filter by Category</span>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                title="Grid View"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="relative">
            {/* Gradient Fade Indicators */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            
            {/* Scrollable Filter Container */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-3 min-w-max px-4 py-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border-2 ${
                    selectedCategory === 'all'
                      ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-200'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>All Products</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {products.length}
                    </span>
                  </span>
                </button>
                
                {activeCategories.map((category) => {
                  const categoryProductCount = products.filter(p => p.category === category.slug).length
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border-2 ${
                        selectedCategory === category.slug
                          ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-200'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{category.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          selectedCategory === category.slug ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {categoryProductCount}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
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