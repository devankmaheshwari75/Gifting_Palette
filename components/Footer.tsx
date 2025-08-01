import Link from 'next/link';
import { Instagram, Facebook, Mail, Phone, Palette, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-accent-800 to-accent-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 handcrafted-pattern opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-warm-500 rounded-xl flex items-center justify-center shadow-craft">
                <Palette className="w-7 h-7 text-white" />
              </div>
              <span className="font-craft text-2xl font-bold text-gradient">
                Gifting Palette 
              </span>
            </div>
            <p className="text-white/80 mb-6 max-w-md leading-relaxed">
              Handcrafted art pieces that bring beauty and uniqueness to your everyday life. 
              From watches to keyrings, each piece is made with love and attention to detail.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/artist_bhoomi_/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-primary-300 hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-craft font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/80 hover:text-primary-300 transition-all duration-300 font-medium group">
                  <span className="relative">
                    Home
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-300 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-white/80 hover:text-primary-300 transition-all duration-300 font-medium group">
                  <span className="relative">
                    Gallery
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-300 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/80 hover:text-primary-300 transition-all duration-300 font-medium group">
                  <span className="relative">
                    About
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-300 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-primary-300 transition-all duration-300 font-medium group">
                  <span className="relative">
                    Contact
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-300 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-craft font-semibold mb-6 text-white">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center group-hover:bg-primary-500/30 transition-all duration-300">
                  <Phone className="w-4 h-4 text-primary-300" />
                </div>
                <span className="text-white/80 group-hover:text-white transition-all duration-300">+91 7340991544</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-warm-500/20 rounded-full flex items-center justify-center group-hover:bg-warm-500/30 transition-all duration-300">
                  <Mail className="w-4 h-4 text-warm-300" />
                </div>
                <span className="text-white/80 group-hover:text-white transition-all duration-300">gifttingpalette@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-primary-300 animate-pulse-soft" />
            <p className="text-white/60 font-medium">Handcrafted with love</p>
            <Heart className="w-4 h-4 text-warm-300 animate-pulse-soft" />
          </div>
          <p className="text-white/60">&copy; 2025 Gifting Palette. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 