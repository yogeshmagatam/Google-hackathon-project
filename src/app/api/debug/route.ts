import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const customPrompt = process.env.CUSTOM_SYSTEM_PROMPT;
  const provider = process.env.AI_PROVIDER;
  
  return NextResponse.json({
    status: 'Debug info',
    provider: provider || 'local',
    hasCustomPrompt: !!customPrompt,
    customPromptPreview: customPrompt ? customPrompt.substring(0, 100) + '...' : 'None',
    customPromptLength: customPrompt ? customPrompt.length : 0,
    allEnvVars: {
      AI_PROVIDER: process.env.AI_PROVIDER,
      MAX_TOKENS: process.env.MAX_TOKENS,
      TEMPERATURE: process.env.TEMPERATURE,
      HAS_OPENAI_KEY: !!process.env.OPENAI_API_KEY,
      HAS_CUSTOM_PROMPT: !!process.env.CUSTOM_SYSTEM_PROMPT,
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const { testMessage } = await request.json();
    
    // Test the AI provider directly
    const { AIProviderManager } = await import('@/lib/ai-providers');
    const aiProvider = new AIProviderManager();
    
    const response = await aiProvider.generateResponse(
      testMessage || "Hello, test the custom prompt", 
      []
    );
    
    return NextResponse.json({
      success: true,
      provider: response.provider,
      message: response.message,
      responseLength: response.message.length,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
