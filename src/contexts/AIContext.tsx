'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AIProvider as AIProviderType, AIModel, StreamingResponse } from '@/types';

interface AIContextType {
  providers: AIProviderType[];
  currentProvider: AIProviderType | null;
  currentModel: AIModel | null;
  isLoading: boolean;
  isStreaming: boolean;
  setProvider: (providerId: string) => void;
  setModel: (modelId: string) => void;
  generateResponse: (message: string, conversationHistory: any[], attachments?: any[]) => Promise<string>;
  generateStreamingResponse: (message: string, conversationHistory: any[], onChunk: (chunk: StreamingResponse) => void) => Promise<void>;
  updateProviderSettings: (providerId: string, settings: Record<string, any>) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Initialize with available providers
  const [providers] = useState<AIProviderType[]>([
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'GPT models from OpenAI',
      models: [
        {
          id: 'gpt-4',
          name: 'GPT-4',
          description: 'Most capable model, best for complex tasks',
          maxTokens: 8192,
          costPer1kTokens: 0.03,
          capabilities: ['text-generation', 'code-execution', 'function-calling']
        },
        {
          id: 'gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          description: 'Fast and efficient model',
          maxTokens: 4096,
          costPer1kTokens: 0.002,
          capabilities: ['text-generation', 'function-calling']
        }
      ],
      capabilities: ['text-generation', 'code-execution', 'function-calling'],
      isActive: true,
      settings: {
        temperature: 0.7,
        maxTokens: 1000
      }
    },
    {
      id: 'google',
      name: 'Google Gemini',
      description: 'Google\'s advanced AI model',
      models: [
        {
          id: 'gemini-1.5-flash',
          name: 'Gemini 1.5 Flash',
          description: 'Fast and efficient multimodal model',
          maxTokens: 8192,
          costPer1kTokens: 0.001,
          capabilities: ['text-generation', 'image-analysis', 'code-execution']
        }
      ],
      capabilities: ['text-generation', 'image-analysis', 'code-execution'],
      isActive: true,
      settings: {
        temperature: 0.7,
        maxTokens: 1000
      }
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      description: 'Constitutional AI by Anthropic',
      models: [
        {
          id: 'claude-3-haiku',
          name: 'Claude 3 Haiku',
          description: 'Fast and efficient model',
          maxTokens: 200000,
          costPer1kTokens: 0.0025,
          capabilities: ['text-generation', 'function-calling']
        }
      ],
      capabilities: ['text-generation', 'function-calling'],
      isActive: false,
      settings: {
        temperature: 0.7,
        maxTokens: 1000
      }
    }
  ]);

  const [currentProviderId, setCurrentProviderId] = useState('google');
  const [currentModelId, setCurrentModelId] = useState('gemini-1.5-flash');

  const currentProvider = providers.find(p => p.id === currentProviderId) || providers[0];
  const currentModel = currentProvider?.models.find(m => m.id === currentModelId) || currentProvider?.models[0];

  const setProvider = useCallback((providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (provider) {
      setCurrentProviderId(providerId);
      setCurrentModelId(provider.models[0].id);
    }
  }, [providers]);

  const setModel = useCallback((modelId: string) => {
    setCurrentModelId(modelId);
  }, []);

  const generateResponse = useCallback(async (message: string, conversationHistory: any[], attachments?: any[]): Promise<string> => {
    setIsLoading(true);
    try {
      // Import the multimodal AI provider
      const { MultimodalAIProvider } = await import('@/lib/multimodal-ai');
      const aiProvider = new MultimodalAIProvider();
      
      // Set the provider to the currently selected one
      aiProvider.setProvider(currentProviderId);
      
      if (attachments && attachments.length > 0) {
        return await aiProvider.generateResponseWithAttachments(message, conversationHistory, attachments);
      } else {
        const response = await aiProvider.generateResponse(message, conversationHistory);
        return response.message;
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentProviderId]);

  const generateStreamingResponse = useCallback(async (
    message: string,
    conversationHistory: any[],
    onChunk: (chunk: StreamingResponse) => void
  ): Promise<void> => {
    setIsStreaming(true);
    try {
      // For now, simulate streaming by calling the regular API and chunking the response
      const fullResponse = await generateResponse(message, conversationHistory);
      
      // Simulate streaming by sending chunks
      const words = fullResponse.split(' ');
      let currentText = '';
      
      for (let i = 0; i < words.length; i++) {
        currentText += (i > 0 ? ' ' : '') + words[i];
        onChunk({
          text: currentText,
          isComplete: i === words.length - 1,
          usage: i === words.length - 1 ? { tokens: words.length } : undefined
        });
        
        // Small delay to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } catch (error) {
      console.error('Error in streaming response:', error);
      throw error;
    } finally {
      setIsStreaming(false);
    }
  }, [generateResponse]);

  const updateProviderSettings = useCallback((providerId: string, settings: Record<string, any>) => {
    // In a real implementation, this would update the provider settings
    console.log('Updating provider settings:', providerId, settings);
  }, []);

  const value: AIContextType = {
    providers,
    currentProvider,
    currentModel,
    isLoading,
    isStreaming,
    setProvider,
    setModel,
    generateResponse,
    generateStreamingResponse,
    updateProviderSettings
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}