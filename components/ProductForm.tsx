'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Loader, Edit } from 'lucide-react'
import { addProduct, updateProduct, uploadImage, Product } from '../lib/supabase'
import toast from 'react-hot-toast'

interface ProductFormProps {
  onClose: () => void
  onSuccess: () => void
  product?: Product
  isEditing?: boolean
}

export default function ProductForm({ onClose, onSuccess, product, isEditing = false }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    type: product?.type || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    category: product?.category || '',
    featured: product?.featured || false
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(product?.image || '')
  const [uploading, setUploading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let imageUrl = imagePreview
      
      if (image) {
        imageUrl = await uploadImage(image)
      }

      if (isEditing && product) {
        const updated = await updateProduct(product.id, {
          ...formData,
          price: parseFloat(formData.price),
          image: imageUrl,
          featured: formData.featured
        })
        
        if (updated) {
          toast.success('Product updated successfully!')
          onSuccess()
        } else {
          toast.error('Failed to update product')
        }
      } else {
        const added = await addProduct({
          ...formData,
          price: parseFloat(formData.price),
          image: imageUrl,
          featured: formData.featured
        })
        
        if (added) {
          toast.success('Product added successfully!')
          onSuccess()
        } else {
          toast.error('Failed to add product')
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Error saving product')
    } finally {
      setUploading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="mb-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                        required={!isEditing}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Watch, Keyring, Photo Frame"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  <option value="watches">Watches</option>
                  <option value="keyrings">Keyrings</option>
                  <option value="photo-frames">Photo Frames</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                Mark as featured product
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Adding Product...'}
                  </>
                ) : (
                  <>
                    {isEditing ? <Edit className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                    {isEditing ? 'Update Product' : 'Add Product'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 