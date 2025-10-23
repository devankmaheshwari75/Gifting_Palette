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

    // === Use OpenAI instead of Gemini ===
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

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

Respond strictly in JSON format like this:
{
  "enhancedTitle": "your enhanced title here",
  "enhancedDescription": "your enhanced description here"
}`

    // === Call OpenAI Chat API ===
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // ✅ free, fast, supports JSON text well
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to enhance content with AI' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const responseText = data.choices?.[0]?.message?.content

    if (!responseText) {
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      )
    }

    // Try to parse JSON from the model’s reply
    let enhancedData: EnhanceResponse
    try {
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
