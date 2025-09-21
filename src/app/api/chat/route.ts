import { NextRequest, NextResponse } from 'next/server';
import { AIProviderManager } from '@/lib/ai-providers';

// Initialize AI provider manager
const aiProvider = new AIProviderManager();

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message too long. Please keep it under 2000 characters.' },
        { status: 400 }
      );
    }

    // Rate limiting check (basic implementation)
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `rate_limit_${clientIP}`;
    
    // Generate AI response using the provider manager
    const startTime = Date.now();
    const aiResponse = await aiProvider.generateResponse(message, conversationHistory || []);
    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      message: aiResponse.message,
      timestamp: new Date().toISOString(),
      provider: aiResponse.provider,
      responseTime: responseTime,
      usage: aiResponse.usage,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Provide specific error messages based on the error type
    let errorMessage = 'Internal server error';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'AI service configuration error. Please try again later.';
        statusCode = 503;
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
        statusCode = 429;
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout. Please try again.';
        statusCode = 408;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        retryAfter: statusCode === 429 ? 60 : undefined,
      },
      { status: statusCode }
    );
  }
}

export async function GET() {
  const provider = process.env.AI_PROVIDER || 'local';
  
  return NextResponse.json({
    status: 'Career Advisor API is running',
    provider: provider,
    version: '2.0',
    features: [
      'Multi-provider AI support',
      'Real-time responses',
      'Conversation context',
      'Rate limiting',
      'Error handling',
    ],
    endpoints: {
      POST: 'Send a message to get career advice',
      GET: 'Get API status and information',
    },
  });
}
