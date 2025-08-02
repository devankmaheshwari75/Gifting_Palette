# Image Compression Feature

## Overview
This project now includes automatic client-side image compression before uploading to Supabase Storage. This feature helps reduce upload times, storage costs, and improves overall performance.

## Features

### Automatic Compression
- Images are automatically compressed when selected for upload
- Compression happens on the client-side before upload
- Maintains 80% quality while significantly reducing file size
- Supports multiple image formats (JPEG, PNG, GIF)

### Compression Settings
- **Quality**: 40-70% (adaptive based on file size)
- **Max File Size**: 200KB-500KB (adaptive)
- **Max Dimensions**: 800-1400px (adaptive)
- **Web Worker**: Enabled for better performance
- **Smart Compression**: Adapts settings based on original file size

### User Experience
- Real-time compression progress notifications
- Compression statistics displayed (original vs compressed size)
- Visual indicators showing compression percentage
- File size information on image previews

## Implementation Details

### Dependencies
```bash
npm install browser-image-compression
```

### Key Files
- `lib/imageCompression.ts` - Compression utility functions
- `components/ProductForm.tsx` - Updated form with compression
- `types/browser-image-compression.d.ts` - TypeScript declarations

### Compression Process
1. User selects images (via file input or drag & drop)
2. Images are automatically compressed using `browser-image-compression`
3. Compression statistics are calculated and displayed
4. Compressed images are stored in component state
5. Images are uploaded to Supabase Storage during form submission

### Error Handling
- If compression fails, original file is used
- User is notified of any compression errors
- Graceful fallback ensures upload functionality

## Usage

### Basic Usage
The compression is automatically applied when users upload images through the admin form. No additional configuration is required.

### Customizing Compression
The system now uses smart compression that adapts based on file size. To modify compression settings, edit the `getSmartCompressionOptions` function in `lib/imageCompression.ts`:

```typescript
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
  }
  // ... more size-based rules
}
```

You can also use predefined options:
- `defaultCompressionOptions`: Standard compression
- `aggressiveCompressionOptions`: Maximum compression

### Testing
Use the test function in `lib/imageCompression.test.ts` to verify compression functionality:

```typescript
import { testCompression } from './lib/imageCompression.test'

// Run test
testCompression().then(result => {
  console.log('Compression test result:', result)
})
```

## Benefits

1. **Reduced Upload Times**: Smaller files upload faster
2. **Lower Storage Costs**: Compressed images use less storage
3. **Better Performance**: Faster page loads with smaller images
4. **Bandwidth Savings**: Reduced data transfer
5. **User Experience**: Real-time feedback on compression results

## Browser Support
- Modern browsers with Web Workers support
- Fallback to original file if compression fails
- Progressive enhancement approach

## Performance Notes
- Compression happens asynchronously using Web Workers
- Multiple images are compressed in parallel
- Original file URLs are cleaned up to prevent memory leaks
- Compression statistics are calculated efficiently 