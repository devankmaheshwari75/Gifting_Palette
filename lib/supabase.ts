import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Product {
  id: string
  name: string
  type: string
  description: string
  image: string
  price: number
  category: string
  featured: boolean
  created_at: string
  updated_at: string
}

// Product Management Functions
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }

  return data || []
}

export const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single()

  if (error) {
    console.error('Error adding product:', error)
    return null
  }

  return data
}

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating product:', error)
    return null
  }

  return data
}

export const deleteProduct = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    return false
  }

  return true
}

// Image Upload Function
export const uploadImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `products/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file)

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}

// Authentication Functions
export const signInWithPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
} 