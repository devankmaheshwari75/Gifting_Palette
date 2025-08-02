// Simple test to verify compression functionality
import { compressImage, formatFileSize, getFileSizeInMB } from './imageCompression'

// Mock File object for testing
const createMockFile = (size: number, name: string = 'test.jpg'): File => {
  const blob = new Blob(['x'.repeat(size)], { type: 'image/jpeg' })
  return new File([blob], name, { type: 'image/jpeg' })
}

// Test compression function
export const testCompression = async () => {
  try {
    const mockFile = createMockFile(1024 * 1024) // 1MB file
    console.log('Original file size:', formatFileSize(mockFile.size))
    
    const compressedFile = await compressImage(mockFile)
    console.log('Compressed file size:', formatFileSize(compressedFile.size))
    
    const savings = ((mockFile.size - compressedFile.size) / mockFile.size * 100).toFixed(1)
    console.log(`Compression savings: ${savings}%`)
    
    return {
      success: true,
      originalSize: mockFile.size,
      compressedSize: compressedFile.size,
      savings: parseFloat(savings)
    }
  } catch (error) {
    console.error('Compression test failed:', error)
    return { success: false, error }
  }
}

// Export for manual testing
export { createMockFile } 