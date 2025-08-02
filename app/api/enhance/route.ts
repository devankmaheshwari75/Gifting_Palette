import { NextRequest, NextResponse } from 'next/server'

interface EnhanceRequest {
  title: string
  description: string
}

interface EnhanceResponse {
  enhancedTitle: string
  enhancedDescription: string
}

export async function POST(request: NextRequest) {
  try {
    const { title, description }: EnhanceRequest = await request.json()

    if (!title && !description) {
      return NextResponse.json(
        { error: 'At least title or description must be provided' },
        { status: 400 }
      )
    }

    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    // Prepare the prompt for Gemini
    const prompt = `Please enhance the following product information for an e-commerce website:

Current title: "${title || 'No title provided'}"
Current description: "${description || 'No description provided'}"

Please provide:
1. A short, compelling product title (maximum 10 words) that is SEO-friendly and appealing to customers
2. A concise product description (2-3 lines maximum) that highlights key features and benefits

Requirements:
- Keep the title under 10 words
- Keep the description to 2-3 lines maximum
- Make it engaging and sales-oriented
- Focus on benefits and features
- Use clear, professional language

Please respond in JSON format:
{
  "enhancedTitle": "your enhanced title here",
  "enhancedDescription": "your enhanced description here"
}`

    // Call Gemini Flash API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Gemini API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to enhance content with AI' },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    // Extract the response text
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!responseText) {
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      )
    }

    // Try to parse JSON from the response
    let enhancedData: EnhanceResponse
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        enhancedData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText)
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      )
    }

    // Validate the response
    if (!enhancedData.enhancedTitle || !enhancedData.enhancedDescription) {
      return NextResponse.json(
        { error: 'Invalid AI response format' },
        { status: 500 }
      )
    }

    return NextResponse.json(enhancedData)

  } catch (error) {
    console.error('Enhance API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 