import imageCompression from 'browser-image-compression'

export interface CompressionOptions {
  maxSizeMB: number
  maxWidthOrHeight: number
  useWebWorker: boolean
  quality: number
  convertToWebP: boolean
}

export const defaultCompressionOptions: CompressionOptions = {
  maxSizeMB: 1.0, // Increased to 1MB for better quality
  maxWidthOrHeight: 1200, // Max width as requested
  useWebWorker: true, // Use web worker for better performance
  quality: 0.75, // 75% quality (middle of 70-80% range)
  convertToWebP: true // Convert to WebP format
}

export const compressImage = async (
  file: File, 
  options: Partial<CompressionOptions> = {}
): Promise<File> => {
  const compressionOptions = {
    ...defaultCompressionOptions,
    ...options
  }

  try {
    const compressedFile = await imageCompression(file, compressionOptions)
    
    // Create a new File object with the compressed data
    // If converting to WebP, change the filename extension
    const fileName = compressionOptions.convertToWebP 
      ? file.name.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      : file.name
    
    const mimeType = compressionOptions.convertToWebP 
      ? 'image/webp'
      : file.type
    
    const compressedFileWithName = new File(
      [compressedFile], 
      fileName, 
      { type: mimeType }
    )
    
    return compressedFileWithName
  } catch (error) {
    console.error('Error compressing image:', error)
    // Return original file if compression fails
    return file
  }
}

// WebP-specific compression options for admin panel
export const webpCompressionOptions: CompressionOptions = {
  maxSizeMB: 0.8, // 800KB max file size
  maxWidthOrHeight: 1200, // Max width as requested
  useWebWorker: true,
  quality: 0.75, // 75% quality (70-80% range)
  convertToWebP: true // Convert to WebP
}

// Balanced compression for good quality and reasonable file size
export const balancedCompressionOptions: CompressionOptions = {
  maxSizeMB: 0.8, // 800KB max file size
  maxWidthOrHeight: 1400, // Balanced dimensions
  useWebWorker: true,
  quality: 0.75, // 75% quality for good balance
  convertToWebP: true // Convert to WebP
}

// Smart compression that adapts based on original file size with WebP conversion
export const getSmartCompressionOptions = (originalSize: number): CompressionOptions => {
  const sizeInMB = originalSize / (1024 * 1024)
  
  if (sizeInMB > 3) {
    // Very large files: moderate compression with good quality
    return {
      maxSizeMB: 1.2,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      quality: 0.7, // 70% quality
      convertToWebP: true
    }
  } else if (sizeInMB > 2) {
    // Large files: light compression with high quality
    return {
      maxSizeMB: 1.0,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      quality: 0.75, // 75% quality
      convertToWebP: true
    }
  } else if (sizeInMB > 1) {
    // Medium files: very light compression
    return {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      quality: 0.8, // 80% quality
      convertToWebP: true
    }
  } else if (sizeInMB > 0.5) {
    // Small-medium files: minimal compression
    return {
      maxSizeMB: 0.6,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      quality: 0.8, // 80% quality
      convertToWebP: true
    }
  } else {
    // Small files: no compression or very minimal
    return {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      quality: 0.8, // 80% quality
      convertToWebP: true
    }
  }
}

// High quality compression for product images with WebP conversion
export const getHighQualityCompressionOptions = (originalSize: number): CompressionOptions => {
  const sizeInMB = originalSize / (1024 * 1024)
  
  if (sizeInMB > 2) {
    return {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      quality: 0.75, // 75% quality
      convertToWebP: true
    }
  } else if (sizeInMB > 1) {
    return {
      maxSizeMB: 1.2,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      quality: 0.8, // 80% quality
      convertToWebP: true
    }
  } else {
    return {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      quality: 0.8, // 80% quality
      convertToWebP: true
    }
  }
}

// Admin panel specific compression (WebP + 70-80% quality + 1200px max width)
export const getAdminCompressionOptions = (originalSize: number): CompressionOptions => {
  const sizeInMB = originalSize / (1024 * 1024)
  
  if (sizeInMB > 2) {
    return {
      maxSizeMB: 1.0,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      quality: 0.7, // 70% quality for large files
      convertToWebP: true
    }
  } else if (sizeInMB > 1) {
    return {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      quality: 0.75, // 75% quality for medium files
      convertToWebP: true
    }
  } else {
    return {
      maxSizeMB: 0.6,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      quality: 0.8, // 80% quality for small files
      convertToWebP: true
    }
  }
}

export const compressMultipleImages = async (
  files: File[],
  options: Partial<CompressionOptions> = {}
): Promise<File[]> => {
  const compressionPromises = files.map(file => compressImage(file, options))
  return Promise.all(compressionPromises)
}

// Helper function to get file size in MB
export const getFileSizeInMB = (file: File): number => {
  return file.size / (1024 * 1024)
}

// Helper function to format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Helper function to check if file is a supported image type
export const isSupportedImageType = (file: File): boolean => {
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  return supportedTypes.includes(file.type.toLowerCase())
}

// Helper function to get compression info for display
export const getCompressionInfo = (originalFile: File, compressedFile: File) => {
  const originalSize = originalFile.size
  const compressedSize = compressedFile.size
  const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
  const isWebP = compressedFile.type === 'image/webp'
  
  return {
    originalSize,
    compressedSize,
    savings: parseFloat(savings),
    isWebP,
    originalFormat: originalFile.type,
    compressedFormat: compressedFile.type
  }
} 