'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useConversations } from '@/contexts/ConversationContext';
import { useAI } from '@/contexts/AIContext';
import { Message } from '@/types';
import { generateId } from '@/lib/utils';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { WelcomeScreen } from './WelcomeScreen';
import { LoadingIndicator } from './LoadingIndicator';

export function ChatArea() {
  const { currentConversation, addMessage, createNewConversation } = useConversations();
  const { generateResponse, isLoading, currentProvider } = useAI();
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const handleSendMessage = async (content: string, attachments?: any[]) => {
    if (!content.trim()) return;

    let conversationId = currentConversation?.id;
    
    // Create new conversation if none exists
    if (!conversationId) {
      conversationId = createNewConversation();
    }

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      text: content,
      sender: 'user',
      timestamp: new Date(),
      attachments
    };

    addMessage(conversationId, userMessage);
    setIsTyping(true);

    try {
      // Generate AI response
      const response = await generateResponse(content, currentConversation?.messages || [], attachments);
      
      // Add AI message
      const aiMessage: Message = {
        id: generateId(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
        provider: currentProvider?.id || 'unknown'
      };

      addMessage(conversationId, aiMessage);
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        text: 'I apologize, but I encountered an error while processing your request. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        provider: 'error'
      };

      addMessage(conversationId, errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  if (!currentConversation) {
    return <WelcomeScreen onStartChat={createNewConversation} />;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {currentConversation.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <LoadingIndicator />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto p-4">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading || isTyping}
          />
        </div>
      </div>
    </div>
  );
}