'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    if (messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.parentElement?.parentElement;
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    // Add a small delay to ensure DOM updates are complete
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [currentConversation?.messages]);

  // Also scroll when typing status changes
  useEffect(() => {
    if (isTyping) {
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [isTyping]);

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
    <motion.div 
      className="h-full flex flex-col bg-white dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-6 min-h-0">
        <div className="max-w-4xl mx-auto space-y-6">
          {currentConversation.messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                ease: "easeOut" 
              }}
            >
              <ChatMessage message={message} />
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              className="flex items-start gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-white font-bold text-sm">AI</span>
              </motion.div>
              <LoadingIndicator />
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <motion.div 
        className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="max-w-4xl mx-auto p-4">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading || isTyping}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}