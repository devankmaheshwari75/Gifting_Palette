'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { getProductById, getRelatedProducts, Product } from '../../../lib/supabase'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import FloatingWhatsApp from '../../../components/FloatingWhatsApp'
import ProductCard from '../../../components/ProductCard'
import { ArrowLeft, Star, Shield, Truck, Sparkles, Palette, Heart, MessageCircle, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [imageModalOpen, setImageModalOpen] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      if (params.id) {
        try {
          const foundProduct = await getProductById(params.id as string)
          if (foundProduct) {
            setProduct(foundProduct)
            // Get related products
            const related = await getRelatedProducts(params.id as string, foundProduct.category, 6)
            setRelatedProducts(related)
          }
        } catch (error) {
          console.error('Error fetching product:', error)
        }
      }
      setLoading(false)
    }

    fetchProduct()
  }, [params.id])

  const handleCustomize = () => {
    if (!product) return
    const phoneNumber = '7340991544'
    const message = `Hi! I saw the "${product.name}" on your website and I'd like to discuss customization options.`
    const encodedMessage = encodeURIComponent(message)
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappURL, '_blank')
  }

  const nextImage = () => {
    if (productImages.length > 1) {
      setSelectedImage((prev) => (prev + 1) % productImages.length)
    }
  }

  const prevImage = () => {
    if (productImages.length > 1) {
      setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-craft font-bold text-accent-800 mb-4">Product Not Found</h1>
            <Link href="/gallery" className="btn-primary">
              Back to Gallery
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Combine main image with additional images
  const productImages = [product.image, ...(product.images || [])].filter(Boolean)

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-16 pb-4 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-accent-600">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/gallery" className="hover:text-primary-600 transition-colors">
              Gallery
            </Link>
            <span>/</span>
            <span className="text-accent-800 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-craft-lg border border-cream-200 bg-gray-50">
                <Image
                  src={productImages[selectedImage]}
                  alt={`${product.name} - Image ${selectedImage + 1}`}
                  fill
                  className="object-contain p-4 cursor-pointer"
                  onClick={() => setImageModalOpen(true)}
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300"
                    >
                      <ChevronLeft className="w-5 h-5 text-accent-600" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300"
                    >
                      <ChevronRight className="w-5 h-5 text-accent-600" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 bg-gray-50 ${
                        selectedImage === index
                          ? 'border-primary-500 shadow-craft'
                          : 'border-cream-200 hover:border-primary-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className="object-contain p-2"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Category Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary-600 uppercase tracking-wider bg-primary-50 px-4 py-2 rounded-full">
                  {product.type}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-primary-200 to-transparent"></div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-craft font-bold text-accent-800 leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              {product.price && (
                <div className="text-2xl font-bold text-primary-600">
                  ₹{product.price}
                </div>
              )}

              {/* Description */}
              <p className="text-lg text-accent-600 leading-relaxed">
                {product.description}
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-cream-200">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Sparkles className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-accent-800">Handcrafted</h4>
                    <p className="text-sm text-accent-600">Made with love</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-cream-200">
                  <div className="p-2 bg-warm-50 rounded-lg">
                    <Palette className="w-5 h-5 text-warm-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-accent-800">Customizable</h4>
                    <p className="text-sm text-accent-600">Personalize your piece</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-cream-200">
                  <div className="p-2 bg-accent-50 rounded-lg">
                    <Shield className="w-5 h-5 text-accent-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-accent-800">Quality Assured</h4>
                    <p className="text-sm text-accent-600">Premium materials</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-cream-200">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Truck className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-accent-800">Fast Delivery</h4>
                    <p className="text-sm text-accent-600">Quick shipping</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleCustomize}
                  className="flex-1 bg-gradient-to-r from-primary-500 to-warm-500 hover:from-primary-600 hover:to-warm-600 text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 shadow-craft hover:shadow-craft-lg flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Customize This Piece</span>
                </button>
                <button className="p-4 bg-white border-2 border-primary-200 text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-cream-50 via-white to-primary-50 relative">
          <div className="absolute inset-0 handcrafted-pattern opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-craft font-bold text-accent-800 mb-4">
                Related Products
              </h2>
              <p className="text-xl text-accent-600 max-w-3xl mx-auto">
                Discover more beautiful pieces in the same category
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={relatedProduct} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Image Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
            <div className="relative aspect-square max-h-[80vh]">
              <Image
                src={productImages[selectedImage]}
                alt={`${product.name} - Image ${selectedImage + 1}`}
                fill
                className="object-contain"
              />
            </div>
            {productImages.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-4">
                <button
                  onClick={prevImage}
                  className="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/30 transition-all duration-300"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/30 transition-all duration-300"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
      <FloatingWhatsApp />
    </div>
  )
} 