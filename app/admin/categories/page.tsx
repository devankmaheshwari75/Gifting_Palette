'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Tag, Trash2 } from 'lucide-react'
import { getCategories, deleteCategory, Category, getCurrentUser } from '../../../lib/supabase'
import AdminLogin from '../../../components/AdminLogin'
import CategoryForm from '../../../components/CategoryForm'
import AdminNav from '../../../components/AdminNav'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [categoriesPerPage] = useState(12)

  useEffect(() => {
    checkUser()
    fetchCategories()
  }, [])

  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }



  const handleCategoryAdded = () => {
    setShowCategoryForm(false)
    fetchCategories()
    setCurrentPage(1)
  }

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will affect all products in this category.')) {
      const success = await deleteCategory(id)
      if (success) {
        fetchCategories()
        toast.success('Category deleted successfully!')
        const newTotalPages = Math.ceil((categories.length - 1) / categoriesPerPage)
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages)
        }
      } else {
        toast.error('Error deleting category')
      }
    }
  }

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory)
  const totalPages = Math.ceil(categories.length / categoriesPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
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
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
            <p className="text-gray-600">Manage your product categories</p>
          </div>
        </div>
      </header>
      
      <AdminNav currentPage="categories" onLogout={() => setUser(null)} />

             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Tag className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Add Category Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCategoryForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            Add New Category
          </button>
        </div>

                 {/* Categories List */}
         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
           <div className="px-4 sm:px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">All Categories</h2>
              <span className="text-sm text-gray-500">
                {categories.length} {categories.length === 1 ? 'category' : 'categories'} total
              </span>
            </div>
          </div>
                     <div className="p-4 sm:p-6">
            {categories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No categories found. Add your first category above.</p>
            ) : (
              <>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {currentCategories.map((category) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                                             className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border hover:shadow-md transition-all duration-200"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                        <p className="text-xs text-gray-400">
                          Created: {new Date(category.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        title="Delete category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                                 {/* Pagination */}
                 {totalPages > 1 && (
                   <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t gap-4 sm:gap-0">
                    <div className="text-sm text-gray-500">
                      Showing {indexOfFirstCategory + 1} to {Math.min(indexOfLastCategory, categories.length)} of {categories.length} categories
                    </div>
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </button>
                      
                      <span className="px-4 py-2 text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
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

      {/* Category Form Modal */}
      {showCategoryForm && (
        <CategoryForm 
          onClose={() => setShowCategoryForm(false)}
          onSuccess={handleCategoryAdded}
        />
      )}
    </div>
  )
}
