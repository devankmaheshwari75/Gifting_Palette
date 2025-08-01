'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getFeaturedProducts } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import ProductCard from '../components/ProductCard'
import { ArrowRight, Star, Shield, Truck, Sparkles, Palette, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const data = await getFeaturedProducts()
      setFeaturedProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 pb-20 gradient-bg-warm relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 handcrafted-pattern opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  Handcrafted with Love
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-craft font-bold text-accent-800 mb-6 leading-tight">
                Handcrafted{' '}
                <span className="text-gradient">Art Work</span>
                <br />
                That Tells Your Story
              </h1>
              <p className="text-xl text-accent-600 mb-8 leading-relaxed">
                Discover unique, handcrafted pieces that bring beauty and personality
                to your everyday life. From elegant watches to charming keyrings,
                each piece is crafted with love and attention to detail.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/gallery" className="btn-primary inline-flex items-center justify-center">
                  Explore Gallery
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <button
                  className="btn-secondary"
                  onClick={() =>
                    window.open(
                      "https://wa.me/7340991544?text=Hey%2C%20I%20want%20to%20place%20a%20custom%20order!!",
                      "_blank"
                    )
                  }
                >
                  Custom Order
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-craft-lg border border-cream-200">
                <Image
                  src="https://plus.unsplash.com/premium_photo-1665949503249-d330c0f2eecb?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Handcrafted Resin Art Collection"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -left-4 bg-white p-3 rounded-full shadow-craft border border-cream-200"
              >
                <Palette className="w-6 h-6 text-primary-500" />
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 bg-white p-3 rounded-full shadow-craft border border-cream-200"
              >
                <Heart className="w-6 h-6 text-warm-500" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative">
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
              Why Choose Our Artwork ?
            </h2>
            <p className="text-xl text-accent-600 max-w-3xl mx-auto">
              Each piece is carefully crafted with premium materials and unique designs
              that reflect your personal style and preferences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Handcrafted Quality',
                description: 'Every piece is individually crafted by hand, ensuring unique character and superior quality.',
                icon: '✨',
                color: 'primary'
              },
              {
                title: 'Custom Designs',
                description: 'Personalize your pieces with custom colors, patterns, and designs that match your style.',
                icon: '🎨',
                color: 'warm'
              },
              {
                title: 'Durable & Beautiful',
                description: 'Made with high-quality material that\'s both beautiful and built to last through daily use.',
                icon: '💎',
                color: 'accent'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-2xl bg-cream-50 hover:bg-cream-100 transition-all duration-300 border border-cream-200 shadow-craft hover:shadow-craft-lg hover:-translate-y-1"
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-craft font-semibold text-accent-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-accent-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
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
              Featured Products
            </h2>
            <p className="text-xl text-accent-600 max-w-3xl mx-auto">
              Discover our most popular resin art pieces, each telling a unique story
              and bringing beauty to your everyday life.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/gallery" className="btn-primary inline-flex items-center">
              View All Products
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-warm-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 handcrafted-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-craft font-bold mb-6">
              Ready to Create Something Special?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Let's work together to create a custom art piece that perfectly
              matches your style and tells your unique story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 hover:bg-cream-100 font-medium py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-craft" onClick={() => window.open("https://wa.me/7340991544?text=Hey%2C%20I%20want%20to%20place%20a%20custom%20order!!",
                "_blank")}>
                Start Custom Order
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105" onClick={() => router.push('/contact')}>
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
} 