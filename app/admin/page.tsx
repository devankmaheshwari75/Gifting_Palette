'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, LogOut, Package, Users, DollarSign, Upload, Edit, Trash2, Tag } from 'lucide-react'
import { getProducts, deleteProduct, getCurrentUser, signOut, getCategories, deleteCategory, Category } from '../../lib/supabase'
import AdminLogin from '../../components/AdminLogin'
import ProductForm from '../../components/ProductForm'
import CategoryForm from '../../components/CategoryForm'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    totalValue: 0
  })

  // Category pagination state
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1)
  const [categoriesPerPage] = useState(8) // Show 8 categories per page (2x4 grid)

  useEffect(() => {
    checkUser()
    fetchProducts()
    fetchCategories()
  }, [])

  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }

  const fetchProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
      const totalValue = data.reduce((sum, product) => sum + (product.price || 0), 0)
      const featuredCount = data.filter(p => p.featured).length
      setStats({
        totalProducts: data.length,
        featuredProducts: featuredCount,
        totalValue
      })
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleLogout = async () => {
    await signOut()
    setUser(null)
    toast.success('Logged out successfully')
  }

  const handleProductAdded = () => {
    setShowProductForm(false)
    setEditingProduct(null)
    fetchProducts()
  }

  const handleCategoryAdded = () => {
    setShowCategoryForm(false)
    fetchCategories()
    // Reset to first page when adding new category
    setCurrentCategoryPage(1)
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setShowProductForm(true)
  }

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const success = await deleteProduct(id)
      if (success) {
        fetchProducts()
        toast.success('Product deleted successfully!')
      } else {
        toast.error('Error deleting product')
      }
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will affect all products in this category.')) {
      const success = await deleteCategory(id)
      if (success) {
        fetchCategories()
        toast.success('Category deleted successfully!')
        // Reset to first page if we're on a page that no longer exists
        const newTotalPages = Math.ceil((categories.length - 1) / categoriesPerPage)
        if (currentCategoryPage > newTotalPages && newTotalPages > 0) {
          setCurrentCategoryPage(newTotalPages)
        }
      } else {
        toast.error('Error deleting category')
      }
    }
  }

  // Category pagination logic
  const indexOfLastCategory = currentCategoryPage * categoriesPerPage
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory)
  const totalCategoryPages = Math.ceil(categories.length / categoriesPerPage)

  const handleCategoryPageChange = (pageNumber: number) => {
    setCurrentCategoryPage(pageNumber)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return <AdminLogin onLogin={() => checkUser()} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Featured Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.featuredProducts}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <button
            onClick={() => setShowProductForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            Add New Product
          </button>
        </div>


        {/* Products List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">All Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{product.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.featured 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Category Button */}
        <div className="mt-8">
          <button
            onClick={() => setShowCategoryForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            <Tag className="h-5 w-5" />
            Add New Category
          </button>
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm 
          onClose={() => {
            setShowProductForm(false)
            setEditingProduct(null)
          }} 
          onSuccess={handleProductAdded}
          product={editingProduct}
          isEditing={!!editingProduct}
        />
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <CategoryForm 
          onClose={() => setShowCategoryForm(false)}
          onSuccess={handleCategoryAdded}
        />
      )}

              {/* Categories Management */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Categories Management</h2>
              <span className="text-sm text-gray-500">
                {categories.length} {categories.length === 1 ? 'category' : 'categories'} total
              </span>
            </div>
          </div>
          <div className="p-6">
            {categories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No categories found. Add your first category below.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                      <div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2"
                        title="Delete category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pagination for Categories */}
                {totalCategoryPages > 1 && (
                  <div className="flex justify-between items-center mt-6 pt-6 border-t">
                    <div className="text-sm text-gray-500">
                      Showing {indexOfFirstCategory + 1} to {Math.min(indexOfLastCategory, categories.length)} of {categories.length} categories
                    </div>
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCategoryPageChange(currentCategoryPage - 1)}
                        disabled={currentCategoryPage === 1}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </button>
                      
                      <span className="px-4 py-2 text-sm text-gray-700">
                        Page {currentCategoryPage} of {totalCategoryPages}
                      </span>
                      
                      <button
                        onClick={() => handleCategoryPageChange(currentCategoryPage + 1)}
                        disabled={currentCategoryPage === totalCategoryPages}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        Next
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

    </div>
  )
} 