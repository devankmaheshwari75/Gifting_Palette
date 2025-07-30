'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MessageCircle, Heart } from 'lucide-react';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // const handleCustomize = () => {
  //   window.open('https://www.instagram.com/artist_bhoomi_/', '_blank');
  // };
  const handleCustomize = () => {
   
    const phoneNumber = '7340991544'; // Use the 10-digit number + 91 country code

    // Create a pre-filled message
    const message = `Hi! I saw the "${product.name}" on your website and I'd like to discuss customization options.`;

    // Encode the message for the URL
    const encodedMessage = encodeURIComponent(message);

    // Create the final WhatsApp URL
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open the URL in a new tab
    window.open(whatsappURL, '_blank');
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card group overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Price Badge */}
        {product.price && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
            {product.price}
          </div>
        )}

        {/* Favorite Button */}
        <button className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 transition-colors duration-200">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
            {product.type}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Action Buttons */}
<div className="mt-auto pt-4 flex flex-col sm:flex-row gap-2">
  <button
    onClick={handleCustomize}
    // FIX: Added px-4 to reduce horizontal padding.
    className="flex-1 btn-primary text-sm flex items-center justify-center gap-2 px-4"
  >
    <MessageCircle className="w-4 h-4" />
    {/* FIX: Shortened text */}
    Customize
  </button>
  

</div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 