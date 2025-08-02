// Test file to demonstrate improved compression
import { compressImage, getSmartCompressionOptions, formatFileSize } from './imageCompression'

// Create a mock large file for testing
const createLargeImageFile = (sizeInMB: number): File => {
  const sizeInBytes = sizeInMB * 1024 * 1024
  const blob = new Blob(['x'.repeat(sizeInBytes)], { type: 'image/jpeg' })
  return new File([blob], `test-${sizeInMB}mb.jpg`, { type: 'image/jpeg' })
}

export const testImprovedCompression = async () => {
  console.log('🧪 Testing Improved Compression...\n')
  
  const testSizes = [0.8, 1.5, 2.5, 4.0] // Test different file sizes in MB
  
  for (const sizeInMB of testSizes) {
    const originalFile = createLargeImageFile(sizeInMB)
    const originalSize = originalFile.size
    
    console.log(`📁 Original file: ${formatFileSize(originalSize)}`)
    
    try {
      // Get smart compression options
      const smartOptions = getSmartCompressionOptions(originalSize)
      console.log(`⚙️  Smart options: Quality=${smartOptions.quality * 100}%, MaxSize=${smartOptions.maxSizeMB}MB, MaxDim=${smartOptions.maxWidthOrHeight}px`)
      
      // Compress the file
      const compressedFile = await compressImage(originalFile, smartOptions)
      const compressedSize = compressedFile.size
      
      // Calculate savings
      const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
      const reduction = (originalSize / compressedSize).toFixed(1)
      
      console.log(`📦 Compressed file: ${formatFileSize(compressedSize)}`)
      console.log(`💾 Savings: ${savings}% (${reduction}x smaller)`)
      console.log('---')
      
    } catch (error) {
      console.error(`❌ Error compressing ${sizeInMB}MB file:`, error)
    }
  }
  
  console.log('\n✅ Compression test completed!')
}

// Export for manual testing
export { createLargeImageFile } 