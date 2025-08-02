// Test file for the enhance API route
// This is for development testing only

const testEnhanceAPI = async () => {
  try {
    const response = await fetch('/api/enhance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'watch',
        description: 'nice watch',
      }),
    })

    const data = await response.json()
    console.log('Enhance API Response:', data)
    
    if (response.ok) {
      console.log('✅ API test successful!')
      console.log('Enhanced title:', data.enhancedTitle)
      console.log('Enhanced description:', data.enhancedDescription)
    } else {
      console.log('❌ API test failed:', data.error)
    }
  } catch (error) {
    console.error('❌ API test error:', error)
  }
}

// Uncomment the line below to test the API
// testEnhanceAPI() 