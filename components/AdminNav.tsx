'use client'

import React from 'react'
import Link from 'next/link'
import { Package, Tag, Home, LogOut } from 'lucide-react'
import { signOut } from '../lib/supabase'
import toast from 'react-hot-toast'

interface AdminNavProps {
  currentPage?: 'dashboard' | 'products' | 'categories'
}

export default function AdminNav({ currentPage = 'dashboard' }: AdminNavProps) {
  const handleLogout = async () => {
    await signOut()
    toast.success('Logged out successfully')
  }

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: Home,
      active: currentPage === 'dashboard'
    },
    {
      href: '/admin/products',
      label: 'Products',
      icon: Package,
      active: currentPage === 'products'
    },
    {
      href: '/admin/categories',
      label: 'Categories',
      icon: Tag,
      active: currentPage === 'categories'
    }
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
