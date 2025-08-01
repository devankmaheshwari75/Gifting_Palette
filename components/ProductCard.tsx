'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MessageCircle, Heart, Sparkles } from 'lucide-react';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const handleCustomize = () => {
    const phoneNumber = '7340991544';
    const message = `Hi! I saw the "${product.name}" on your website and I'd like to discuss customization options.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="group relative"
    >
      {/* Handcrafted Border Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary-300 via-warm-400 to-accent-300 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      
      <div className="relative bg-white rounded-3xl shadow-craft hover:shadow-craft-lg transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-cream-200">
        {/* Image Container */}
        <div className="relative h-72 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-2 group-hover:translate-x-0">
            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
              <Sparkles className="w-4 h-4 text-primary-500" />
            </div>
          </div>

          {/* Price Badge */}
          {product.price && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-primary-700 shadow-lg border border-cream-200">
              {product.price}
            </div>
          )}

          {/* Favorite Button */}
          <button className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur-sm rounded-full text-accent-600 hover:text-primary-500 transition-all duration-300 shadow-lg border border-cream-200 hover:scale-110">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary-600 uppercase tracking-wider bg-primary-50 px-3 py-1 rounded-full">
              {product.type}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-primary-200 to-transparent"></div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-craft font-semibold text-accent-800 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-accent-600 text-sm leading-relaxed line-clamp-2">
            {product.description}
          </p>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleCustomize}
              className="w-full bg-gradient-to-r from-primary-500 to-warm-500 hover:from-primary-600 hover:to-warm-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 shadow-craft hover:shadow-craft-lg flex items-center justify-center gap-2 group/btn"
            >
              <MessageCircle className="w-4 h-4 group-hover/btn:animate-pulse" />
              <span>Customize This Piece</span>
            </button>
          </div>
        </div>

        {/* Bottom Decorative Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-300 via-warm-400 to-accent-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 