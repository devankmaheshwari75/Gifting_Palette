// Test file to demonstrate improved compression
import { compressImage, getAdminCompressionOptions, formatFileSize, getCompressionInfo } from './imageCompression'

// Test function to demonstrate WebP conversion and compression
export const testWebPCompression = async (file: File) => {
  console.log('=== WebP Conversion & Compression Test ===')
  console.log('Original file:', file.name)
  console.log('Original size:', formatFileSize(file.size))
  console.log('Original format:', file.type)
  
  try {
    // Use admin compression (WebP + 70-80% quality + 1200px max width)
    const adminOptions = getAdminCompressionOptions(file.size)
    console.log('Compression options:', adminOptions)
    
    const compressedFile = await compressImage(file, adminOptions)
    const compressionInfo = getCompressionInfo(file, compressedFile)
    
    console.log('Compressed file:', compressedFile.name)
    console.log('Compressed size:', formatFileSize(compressedFile.size))
    console.log('Compressed format:', compressedFile.type)
    console.log(`Size reduction: ${compressionInfo.savings.toFixed(1)}%`)
    console.log(`WebP conversion: ${compressionInfo.isWebP ? 'Yes' : 'No'}`)
    
    return {
      originalSize: file.size,
      compressedSize: compressedFile.size,
      savings: compressionInfo.savings,
      quality: adminOptions.quality,
      maxWidthOrHeight: adminOptions.maxWidthOrHeight,
      isWebP: compressionInfo.isWebP,
      originalFormat: compressionInfo.originalFormat,
      compressedFormat: compressionInfo.compressedFormat
    }
  } catch (error) {
    console.error('WebP compression test failed:', error)
    return null
  }
}

// Function to compare JPEG vs WebP compression
export const compareJPEGvsWebP = async (file: File) => {
  console.log('=== JPEG vs WebP Compression Comparison ===')
  
  // JPEG compression settings (old method)
  const jpegSettings = {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    quality: 0.75,
    convertToWebP: false
  }
  
  // WebP compression settings (new method)
  const webpSettings = getAdminCompressionOptions(file.size)
  
  try {
    const jpegCompressed = await compressImage(file, jpegSettings)
    const webpCompressed = await compressImage(file, webpSettings)
    
    const jpegInfo = getCompressionInfo(file, jpegCompressed)
    const webpInfo = getCompressionInfo(file, webpCompressed)
    
    console.log('Original size:', formatFileSize(file.size))
    console.log('JPEG compressed size:', formatFileSize(jpegCompressed.size))
    console.log('WebP compressed size:', formatFileSize(webpCompressed.size))
    
    console.log(`JPEG compression savings: ${jpegInfo.savings.toFixed(1)}%`)
    console.log(`WebP compression savings: ${webpInfo.savings.toFixed(1)}%`)
    
    const additionalSavings = jpegInfo.savings - webpInfo.savings
    console.log(`Additional savings with WebP: ${additionalSavings.toFixed(1)}%`)
    
    return {
      jpeg: { 
        size: jpegCompressed.size, 
        savings: jpegInfo.savings, 
        quality: 0.75,
        format: 'JPEG'
      },
      webp: { 
        size: webpCompressed.size, 
        savings: webpInfo.savings, 
        quality: webpSettings.quality,
        format: 'WebP'
      },
      additionalSavings
    }
  } catch (error) {
    console.error('Comparison failed:', error)
    return null
  }
}

// Test function to demonstrate improved compression quality
export const testCompressionQuality = async (file: File) => {
  console.log('=== Image Compression Quality Test ===')
  console.log('Original file:', file.name)
  console.log('Original size:', formatFileSize(file.size))
  
  try {
    // Use high quality compression
    const highQualityOptions = getAdminCompressionOptions(file.size)
    console.log('Compression options:', highQualityOptions)
    
    const compressedFile = await compressImage(file, highQualityOptions)
    
    console.log('Compressed size:', formatFileSize(compressedFile.size))
    const savings = ((file.size - compressedFile.size) / file.size * 100).toFixed(1)
    console.log(`Size reduction: ${savings}%`)
    
    return {
      originalSize: file.size,
      compressedSize: compressedFile.size,
      savings: parseFloat(savings),
      quality: highQualityOptions.quality,
      maxWidthOrHeight: highQualityOptions.maxWidthOrHeight
    }
  } catch (error) {
    console.error('Compression test failed:', error)
    return null
  }
}

// Function to compare old vs new compression
export const compareCompressionMethods = async (file: File) => {
  console.log('=== Compression Method Comparison ===')
  
  // Old aggressive settings (for comparison)
  const oldSettings = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    quality: 0.6,
    convertToWebP: false
  }
  
  // New WebP settings
  const newSettings = getAdminCompressionOptions(file.size)
  
  try {
    const oldCompressed = await compressImage(file, oldSettings)
    const newCompressed = await compressImage(file, newSettings)
    
    console.log('Original size:', formatFileSize(file.size))
    console.log('Old compression size:', formatFileSize(oldCompressed.size))
    console.log('New compression size:', formatFileSize(newCompressed.size))
    
    const oldSavings = ((file.size - oldCompressed.size) / file.size * 100).toFixed(1)
    const newSavings = ((file.size - newCompressed.size) / file.size * 100).toFixed(1)
    
    console.log(`Old compression savings: ${oldSavings}% (Quality: 60%, Format: JPEG)`)
    console.log(`New compression savings: ${newSavings}% (Quality: ${(newSettings.quality * 100).toFixed(0)}%, Format: WebP)`)
    
    return {
      old: { size: oldCompressed.size, savings: parseFloat(oldSavings), quality: 0.6, format: 'JPEG' },
      new: { size: newCompressed.size, savings: parseFloat(newSavings), quality: newSettings.quality, format: 'WebP' }
    }
  } catch (error) {
    console.error('Comparison failed:', error)
    return null
  }
} 