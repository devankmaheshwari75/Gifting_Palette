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
  images?: string[] // Array of additional images
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

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
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

export const getRelatedProducts = async (currentProductId: string, category: string, limit: number = 6): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', currentProductId)
    .limit(limit)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching related products:', error)
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
  try {
    console.log('Starting deletion of product:', id)
    
    // First, get the product to find its images
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('image, images')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching product for deletion:', fetchError)
      return false
    }

    console.log('Product images found:', { mainImage: product.image, additionalImages: product.images })

    // Delete the product from database
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting product:', deleteError)
      return false
    }

    console.log('Product deleted from database successfully')

    // Delete images from storage
    const imagesToDelete: string[] = []
    
    // Add main image if it exists
    if (product.image) {
      imagesToDelete.push(product.image)
    }
    
    // Add additional images if they exist
    if (product.images && Array.isArray(product.images)) {
      imagesToDelete.push(...product.images)
    }

    console.log('Images to delete from storage:', imagesToDelete)

    // Delete all images from storage
    for (const imageUrl of imagesToDelete) {
      console.log('Deleting image:', imageUrl)
      const deleteResult = await deleteImage(imageUrl)
      console.log('Delete result for', imageUrl, ':', deleteResult)
    }

    console.log('Product deletion completed successfully')
    return true
  } catch (error) {
    console.error('Error in deleteProduct:', error)
    return false
  }
}

// Cleanup function to remove orphaned images from storage
export const cleanupOrphanedImages = async (): Promise<void> => {
  try {
    // Get all images from storage
    const { data: storageFiles } = await supabase.storage
      .from('product-images')
      .list('products')

    // Get all image URLs from database
    const { data: products } = await supabase
      .from('products')
      .select('image, images')

    const usedImages = new Set<string>()
    
    // Collect all used image URLs
    products?.forEach(product => {
      if (product.image) usedImages.add(product.image)
      if (product.images) {
        product.images.forEach((img: string) => usedImages.add(img))
      }
    })

    // Find orphaned images
    const orphanedFiles = storageFiles?.filter(file => {
      const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/products/${file.name}`
      return !usedImages.has(fileUrl)
    }) || []

    // Delete orphaned images
    for (const file of orphanedFiles) {
      await deleteImage(`products/${file.name}`)
    }

    console.log(`Cleaned up ${orphanedFiles.length} orphaned images`)
  } catch (error) {
    console.error('Error cleaning up orphaned images:', error)
  }
}

// Image Upload Functions
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

export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadImage(file))
  return Promise.all(uploadPromises)
}

export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  try {
    console.log('deleteImage called with URL:', imageUrl)
    
    let filePath: string

    // Handle different URL formats
    if (imageUrl.includes('supabase.co')) {
      // Full Supabase URL: https://xxx.supabase.co/storage/v1/object/public/product-images/products/filename.ext
      const urlParts = imageUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]
      filePath = `products/${fileName}`
    } else if (imageUrl.startsWith('products/')) {
      // Already a relative path
      filePath = imageUrl
    } else {
      // Just a filename
      filePath = `products/${imageUrl}`
    }

    console.log('Extracted file path:', filePath)

    // First, check if the file exists
    const { data: fileExists, error: checkError } = await supabase.storage
      .from('product-images')
      .list('products', {
        search: filePath.split('/').pop() // Search by filename
      })

    if (checkError) {
      console.error('Error checking if file exists:', checkError)
    } else {
      console.log('Files found in storage:', fileExists)
    }

    // Attempt to delete the file
    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath])

    if (error) {
      console.error('Error deleting image from storage:', error)
      console.error('Error details:', {
        message: error.message
      })
      return false
    }

    console.log('Successfully deleted file from storage:', filePath)
    return true
  } catch (error) {
    console.error('Exception in deleteImage:', error)
    return false
  }
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

// Test function to check storage setup and permissions
export const testStoragePermissions = async (): Promise<void> => {
  try {
    console.log('Testing storage permissions...')
    
    // Test 1: List files in storage
    const { data: files, error: listError } = await supabase.storage
      .from('product-images')
      .list('products')
    
    if (listError) {
      console.error('❌ Error listing files:', listError)
    } else {
      console.log('✅ Successfully listed files:', files)
    }

    // Test 2: Check bucket exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    
    if (bucketError) {
      console.error('❌ Error listing buckets:', bucketError)
    } else {
      console.log('✅ Available buckets:', buckets)
      const productImagesBucket = buckets?.find(b => b.name === 'product-images')
      if (productImagesBucket) {
        console.log('✅ product-images bucket found:', productImagesBucket)
      } else {
        console.log('❌ product-images bucket not found')
      }
    }

    // Test 3: Try to upload a test file
    const testFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload('test/test.txt', testFile)
    
    if (uploadError) {
      console.error('❌ Error uploading test file:', uploadError)
    } else {
      console.log('✅ Successfully uploaded test file')
      
      // Test 4: Try to delete the test file
      const { error: deleteError } = await supabase.storage
        .from('product-images')
        .remove(['test/test.txt'])
      
      if (deleteError) {
        console.error('❌ Error deleting test file:', deleteError)
      } else {
        console.log('✅ Successfully deleted test file')
      }
    }
    
  } catch (error) {
    console.error('❌ Exception in testStoragePermissions:', error)
  }
} 