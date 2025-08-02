import imageCompression from 'browser-image-compression'

export interface CompressionOptions {
  maxSizeMB: number
  maxWidthOrHeight: number
  useWebWorker: boolean
  quality: number
}

export const defaultCompressionOptions: CompressionOptions = {
  maxSizeMB: 0.5, // 500KB max file size (more aggressive)
  maxWidthOrHeight: 1200, // Reduced max dimensions for better compression
  useWebWorker: true, // Use web worker for better performance
  quality: 0.6 // 60% quality (more aggressive compression)
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
    const compressedFileWithName = new File(
      [compressedFile], 
      file.name, 
      { type: file.type }
    )
    
    return compressedFileWithName
  } catch (error) {
    console.error('Error compressing image:', error)
    // Return original file if compression fails
    return file
  }
}

// Aggressive compression for maximum file size reduction
export const aggressiveCompressionOptions: CompressionOptions = {
  maxSizeMB: 0.2, // 200KB max file size
  maxWidthOrHeight: 800, // Smaller dimensions
  useWebWorker: true,
  quality: 0.4 // 40% quality for maximum compression
}

// Smart compression that adapts based on original file size
export const getSmartCompressionOptions = (originalSize: number): CompressionOptions => {
  const sizeInMB = originalSize / (1024 * 1024)
  
  if (sizeInMB > 2) {
    // Very large files: aggressive compression
    return {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      quality: 0.4
    }
  } else if (sizeInMB > 1) {
    // Large files: moderate compression
    return {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1000,
      useWebWorker: true,
      quality: 0.5
    }
  } else if (sizeInMB > 0.5) {
    // Medium files: light compression
    return {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      quality: 0.6
    }
  } else {
    // Small files: minimal compression
    return {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 1400,
      useWebWorker: true,
      quality: 0.7
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