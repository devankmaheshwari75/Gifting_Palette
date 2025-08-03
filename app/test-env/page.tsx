'use client'

import { testStoragePermissions } from '../../lib/supabase'

export default function TestEnv() {
  const handleTestStorage = async () => {
    console.log('Starting storage test...')
    await testStoragePermissions()
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="space-y-2 mb-6">
        <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
        <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Storage Test</h2>
        <button 
          onClick={handleTestStorage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Storage Permissions
        </button>
        <p className="text-sm text-gray-600">
          Click the button above and check the browser console for detailed storage test results.
        </p>
      </div>
    </div>
  )
} 