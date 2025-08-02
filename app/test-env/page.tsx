'use client'

import { useState } from 'react'
import { testWebPCompression, compareJPEGvsWebP, compareCompressionMethods } from '../../lib/compressionTest'

export default function TestEnv() {
  const [webpResults, setWebpResults] = useState<any>(null)
  const [jpegVsWebpResults, setJpegVsWebpResults] = useState<any>(null)
  const [comparisonResults, setComparisonResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      // Test WebP conversion and compression
      const webpTest = await testWebPCompression(file)
      setWebpResults(webpTest)

      // Compare JPEG vs WebP compression
      const jpegVsWebp = await compareJPEGvsWebP(file)
      setJpegVsWebpResults(jpegVsWebp)

      // Compare old vs new compression methods
      const comparison = await compareCompressionMethods(file)
      setComparisonResults(comparison)
    } catch (error) {
      console.error('Test failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">WebP Conversion & Compression Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Image to Test WebP Conversion</h2>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-2">Supports JPEG and PNG files</p>
        </div>

        {isLoading && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Testing WebP conversion...</span>
            </div>
          </div>
        )}

        {webpResults && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">✅ WebP Conversion Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Original File</h3>
                <p>Size: {(webpResults.originalSize / 1024 / 1024).toFixed(2)} MB</p>
                <p>Format: {webpResults.originalFormat}</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-semibold mb-2">WebP File</h3>
                <p>Size: {(webpResults.compressedSize / 1024 / 1024).toFixed(2)} MB</p>
                <p>Format: {webpResults.compressedFormat}</p>
                <p>Quality: {(webpResults.quality * 100).toFixed(0)}%</p>
                <p>Max Width: {webpResults.maxWidthOrHeight}px</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded">
              <p className="font-semibold text-blue-800">
                Size Reduction: {webpResults.savings.toFixed(1)}% with WebP conversion
              </p>
            </div>
          </div>
        )}

        {jpegVsWebpResults && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">📊 JPEG vs WebP Comparison</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded border-l-4 border-red-400">
                <h3 className="font-semibold mb-2 text-red-800">JPEG Compression</h3>
                <p>Size: {(jpegVsWebpResults.jpeg.size / 1024 / 1024).toFixed(2)} MB</p>
                <p>Quality: {(jpegVsWebpResults.jpeg.quality * 100).toFixed(0)}%</p>
                <p>Savings: {jpegVsWebpResults.jpeg.savings.toFixed(1)}%</p>
                <p>Format: {jpegVsWebpResults.jpeg.format}</p>
              </div>
              <div className="bg-green-50 p-4 rounded border-l-4 border-green-400">
                <h3 className="font-semibold mb-2 text-green-800">WebP Compression</h3>
                <p>Size: {(jpegVsWebpResults.webp.size / 1024 / 1024).toFixed(2)} MB</p>
                <p>Quality: {(jpegVsWebpResults.webp.quality * 100).toFixed(0)}%</p>
                <p>Savings: {jpegVsWebpResults.webp.savings.toFixed(1)}%</p>
                <p>Format: {jpegVsWebpResults.webp.format}</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded">
              <p className="font-semibold text-yellow-800">
                💡 WebP provides {jpegVsWebpResults.additionalSavings.toFixed(1)}% additional savings over JPEG!
              </p>
            </div>
          </div>
        )}

        {comparisonResults && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">🔄 Old vs New Compression</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded border-l-4 border-red-400">
                <h3 className="font-semibold mb-2 text-red-800">Old Method (JPEG)</h3>
                <p>Size: {(comparisonResults.old.size / 1024 / 1024).toFixed(2)} MB</p>
                <p>Quality: {(comparisonResults.old.quality * 100).toFixed(0)}%</p>
                <p>Savings: {comparisonResults.old.savings.toFixed(1)}%</p>
                <p>Format: {comparisonResults.old.format}</p>
              </div>
              <div className="bg-green-50 p-4 rounded border-l-4 border-green-400">
                <h3 className="font-semibold mb-2 text-green-800">New Method (WebP)</h3>
                <p>Size: {(comparisonResults.new.size / 1024 / 1024).toFixed(2)} MB</p>
                <p>Quality: {(comparisonResults.new.quality * 100).toFixed(0)}%</p>
                <p>Savings: {comparisonResults.new.savings.toFixed(1)}%</p>
                <p>Format: {comparisonResults.new.format}</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded">
              <p className="font-semibold text-yellow-800">
                🎉 The new WebP method provides better compression and quality!
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">🎯 WebP Conversion Benefits</h2>
          <ul className="space-y-2 text-blue-700">
            <li>• <strong>Better compression</strong> - WebP typically 25-35% smaller than JPEG</li>
            <li>• <strong>High quality</strong> - 70-80% quality range maintains excellent visual quality</li>
            <li>• <strong>Modern format</strong> - WebP is supported by all modern browsers</li>
            <li>• <strong>Consistent sizing</strong> - Max 1200px width for optimal display</li>
            <li>• <strong>Automatic conversion</strong> - JPEG/PNG automatically converted to WebP</li>
            <li>• <strong>Storage savings</strong> - Smaller files mean lower storage costs</li>
          </ul>
        </div>

        <div className="mt-6 bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-800">⚙️ Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-semibold">Format Conversion</h3>
              <p>JPEG/PNG → WebP</p>
            </div>
            <div>
              <h3 className="font-semibold">Quality Settings</h3>
              <p>70-80% (adaptive)</p>
            </div>
            <div>
              <h3 className="font-semibold">Max Dimensions</h3>
              <p>1200px width</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 