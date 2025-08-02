'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Loader, Edit, Trash2, Plus, FileDown } from 'lucide-react'
import { addProduct, updateProduct, uploadImage, uploadMultipleImages, deleteImage, Product } from '../lib/supabase'
import { compressImage, compressMultipleImages, formatFileSize, getFileSizeInMB, getAdminCompressionOptions, getCompressionInfo, isSupportedImageType } from '../lib/imageCompression'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface ProductFormProps {
  onClose: () => void
  onSuccess: () => void
  product?: Product
  isEditing?: boolean
}

interface ImageFile {
  file?: File
  url: string
  isNew: boolean
  originalSize?: number
  compressedSize?: number
  isCompressed?: boolean
  isWebP?: boolean
  originalFormat?: string
  compressedFormat?: string
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
  
  const [images, setImages] = useState<ImageFile[]>(() => {
    if (product) {
      const imageFiles: ImageFile[] = []
      
      // Add main image
      if (product.image) {
        imageFiles.push({ url: product.image, isNew: false })
      }
      
      // Add additional images
      if (product.images && product.images.length > 0) {
        product.images.forEach(img => {
          imageFiles.push({ url: img, isNew: false })
        })
      }
      
      return imageFiles
    }
    return []
  })
  
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter(file => isSupportedImageType(file))
    
    if (imageFiles.length > 0) {
      try {
        // Show compression notification
        toast.loading('Converting to WebP and compressing images...', { id: 'compression' })
        
        // Compress all images with admin compression (WebP + 70-80% quality + 1200px max width)
        const compressedFiles = await Promise.all(
          imageFiles.map(async (file) => {
            const adminOptions = getAdminCompressionOptions(file.size)
            return await compressImage(file, adminOptions)
          })
        )
        
        const newImages: ImageFile[] = compressedFiles.map((compressedFile, index) => {
          const originalFile = imageFiles[index]
          const compressionInfo = getCompressionInfo(originalFile, compressedFile)
          
          return {
            file: compressedFile,
            url: URL.createObjectURL(compressedFile),
            isNew: true,
            originalSize: compressionInfo.originalSize,
            compressedSize: compressionInfo.compressedSize,
            isCompressed: compressionInfo.savings > 0,
            isWebP: compressionInfo.isWebP,
            originalFormat: compressionInfo.originalFormat,
            compressedFormat: compressionInfo.compressedFormat
          }
        })
        
        setImages(prev => [...prev, ...newImages])
        
        // Show compression results
        const totalOriginalSize = imageFiles.reduce((sum, file) => sum + file.size, 0)
        const totalCompressedSize = compressedFiles.reduce((sum, file) => sum + file.size, 0)
        const savings = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1)
        
        toast.success(
          `Images converted to WebP and compressed! Saved ${savings}% (${formatFileSize(totalOriginalSize)} → ${formatFileSize(totalCompressedSize)})`,
          { id: 'compression' }
        )
      } catch (error) {
        toast.error('Error compressing images', { id: 'compression' })
        console.error('Compression error:', error)
      }
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
           if (e.dataTransfer.files && e.dataTransfer.files[0]) {
         const files = Array.from(e.dataTransfer.files)
         const imageFiles = files.filter(file => isSupportedImageType(file))
         
         if (imageFiles.length > 0) {
           try {
             // Show compression notification
             toast.loading('Converting to WebP and compressing images...', { id: 'compression' })
             
             // Compress all images with admin compression (WebP + 70-80% quality + 1200px max width)
             const compressedFiles = await Promise.all(
               imageFiles.map(async (file) => {
                 const adminOptions = getAdminCompressionOptions(file.size)
                 return await compressImage(file, adminOptions)
               })
             )
          
                     const newImages: ImageFile[] = compressedFiles.map((compressedFile, index) => {
             const originalFile = imageFiles[index]
             const compressionInfo = getCompressionInfo(originalFile, compressedFile)
             
             return {
               file: compressedFile,
               url: URL.createObjectURL(compressedFile),
               isNew: true,
               originalSize: compressionInfo.originalSize,
               compressedSize: compressionInfo.compressedSize,
               isCompressed: compressionInfo.savings > 0,
               isWebP: compressionInfo.isWebP,
               originalFormat: compressionInfo.originalFormat,
               compressedFormat: compressionInfo.compressedFormat
             }
           })
           
           setImages(prev => [...prev, ...newImages])
           
           // Show compression results
           const totalOriginalSize = imageFiles.reduce((sum, file) => sum + file.size, 0)
           const totalCompressedSize = compressedFiles.reduce((sum, file) => sum + file.size, 0)
           const savings = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1)
           
           toast.success(
             `Images converted to WebP and compressed! Saved ${savings}% (${formatFileSize(totalOriginalSize)} → ${formatFileSize(totalCompressedSize)})`,
             { id: 'compression' }
           )
        } catch (error) {
          toast.error('Error compressing images', { id: 'compression' })
          console.error('Compression error:', error)
        }
      }
    }
  }, [])

  const removeImage = async (index: number) => {
    const imageToRemove = images[index]
    
    if (imageToRemove.isNew) {
      // Remove from local state only
      setImages(prev => prev.filter((_, i) => i !== index))
    } else {
      // Delete from storage if it's an existing image
      try {
        await deleteImage(imageToRemove.url)
        setImages(prev => prev.filter((_, i) => i !== index))
        toast.success('Image removed successfully')
      } catch (error) {
        toast.error('Failed to remove image')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      // Upload new images
      const newImages = images.filter(img => img.isNew && img.file)
      const uploadedUrls: string[] = []
      
      if (newImages.length > 0) {
        const files = newImages.map(img => img.file!).filter(Boolean)
        uploadedUrls.push(...await uploadMultipleImages(files))
      }

      // Combine existing and new image URLs
      const existingImages = images.filter(img => !img.isNew).map(img => img.url)
      const allImages = [...existingImages, ...uploadedUrls]
      
      // First image becomes the main image
      const mainImage = allImages[0] || ''
      const additionalImages = allImages.slice(1)

      if (isEditing && product) {
        const updated = await updateProduct(product.id, {
          ...formData,
          price: parseFloat(formData.price),
          image: mainImage,
          images: additionalImages,
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
          image: mainImage,
          images: additionalImages,
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
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
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
            {/* Multiple Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images (First image will be the main image)
              </label>
              
              {/* Drag & Drop Area */}
              <div
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${
                  dragActive 
                    ? 'border-purple-400 bg-purple-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                      <span>Upload images</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each (will be compressed automatically)</p>
                </div>
              </div>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Images:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={image.url}
                            alt={`Product image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                            Main
                          </div>
                        )}
                                                                          {/* WebP conversion info for new images */}
                          {image.isNew && image.isWebP && (
                            <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                              <FileDown className="w-3 h-3" />
                              <span>WebP</span>
                            </div>
                          )}
                         {/* Compression info for new images */}
                          {image.isNew && image.isCompressed && !image.isWebP && (
                            <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                              <FileDown className="w-3 h-3" />
                              {image.originalSize && image.compressedSize && (
                                <span>
                                  {((image.originalSize - image.compressedSize) / image.originalSize * 100).toFixed(0)}%
                                </span>
                              )}
                            </div>
                          )}
                         {/* File size info */}
                         {image.isNew && (
                           <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                             {image.compressedSize ? formatFileSize(image.compressedSize) : formatFileSize(image.file?.size || 0)}
                           </div>
                         )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

                                                   {/* Compression Settings */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <FileDown className="w-4 h-4" />
                  WebP Conversion & Compression Settings
                </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Format:</span> Convert to WebP
                  </div>
                  <div>
                    <span className="font-medium">Quality:</span> 70-80% (adaptive)
                  </div>
                  <div>
                    <span className="font-medium">Max Width:</span> 1200px
                  </div>
                </div>
                              <p className="text-xs text-gray-500 mt-2">
                  Images are automatically converted to WebP format and compressed using smart settings. 
                  WebP provides better compression while maintaining high quality.
                </p>
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
                disabled={uploading || images.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Adding Product...'}
                  </>
                ) : (
                  <>
                    {isEditing ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
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