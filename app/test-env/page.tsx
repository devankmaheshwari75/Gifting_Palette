'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function TestEnv() {
  const [envStatus, setEnvStatus] = useState({
    supabaseUrl: false,
    supabaseKey: false,
    connection: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkEnvironment()
  }, [])

  const checkEnvironment = async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setEnvStatus({
      supabaseUrl: !!url,
      supabaseKey: !!key,
      connection: false
    })

    if (url && key) {
      try {
        // Test the connection by making a simple query
        const { data, error } = await supabase
          .from('products')
          .select('count')
          .limit(1)

        setEnvStatus(prev => ({
          ...prev,
          connection: !error
        }))
      } catch (error) {
        console.error('Connection test failed:', error)
      }
    }

    setLoading(false)
  }

  const testAuth = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword'
      })
      
      if (error) {
        console.log('Auth test result:', error.message)
        alert(`Auth test: ${error.message}`)
      } else {
        alert('Auth connection working!')
      }
    } catch (error) {
      console.error('Auth test failed:', error)
      alert('Auth test failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Environment Test</h1>
        
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full ${envStatus.supabaseUrl ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Supabase URL: {envStatus.supabaseUrl ? '✅ Set' : '❌ Missing'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full ${envStatus.supabaseKey ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Supabase Key: {envStatus.supabaseKey ? '✅ Set' : '❌ Missing'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full ${envStatus.connection ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Database Connection: {envStatus.connection ? '✅ Working' : '❌ Failed'}</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Test Actions</h2>
            <div className="space-y-2">
              <button
                onClick={testAuth}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Test Authentication
              </button>
            </div>
          </div>

          {!envStatus.supabaseUrl || !envStatus.supabaseKey ? (
            <div className="border border-red-200 bg-red-50 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">Missing Environment Variables</h3>
              <p className="text-red-700 text-sm">
                Please check your `.env.local` file and ensure you have:
              </p>
              <ul className="text-red-700 text-sm mt-2 list-disc list-inside">
                <li>NEXT_PUBLIC_SUPABASE_URL</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              </ul>
            </div>
          ) : null}

          {envStatus.supabaseUrl && envStatus.supabaseKey && !envStatus.connection ? (
            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
              <h3 className="text-yellow-800 font-semibold mb-2">Connection Issue</h3>
              <p className="text-yellow-700 text-sm">
                Environment variables are set but database connection failed. 
                Check your Supabase project settings and ensure the database is properly configured.
              </p>
            </div>
          ) : null}

          {envStatus.supabaseUrl && envStatus.supabaseKey && envStatus.connection ? (
            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold mb-2">✅ All Systems Working</h3>
              <p className="text-green-700 text-sm">
                Your environment is properly configured! You can now proceed with the admin panel.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
} 