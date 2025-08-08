'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Product } from '../lib/supabase';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link href={`/product/${product.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="group relative cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
      >
        {/* Image Container - Flipkart Style */}
        <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          {/* Wishlist Button - Top Right */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-110 opacity-0 group-hover:opacity-100"
          >
            <Heart className="w-4 h-4" />
          </button>

          {/* Discount Badge - Top Left (if applicable) */}
          {product.price && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md">
              -20%
            </div>
          )}
        </div>

        {/* Content Section - Compact & Clean */}
        <div className="p-4 space-y-2">
          {/* Product Name - Flipkart Style */}
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Price Section - Flipkart Style */}
          {product.price && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-900">
                ₹{product.price}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ₹{Math.round(product.price * 1.25)}
              </span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const phoneNumber = '7340991544';
                const message = `Hi! I saw the "${product.name}" on your website and I'd like to discuss customization options.`;
                const encodedMessage = encodeURIComponent(message);
                const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
                window.open(whatsappURL, '_blank');
              }}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1"
            >
              Customize
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard; 