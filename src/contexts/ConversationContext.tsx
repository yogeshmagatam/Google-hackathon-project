'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Conversation, Message } from '@/types';
import { generateId } from '@/lib/utils';

interface ConversationContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createNewConversation: () => string;
  selectConversation: (id: string) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  searchConversations: (query: string) => Conversation[];
  pinConversation: (id: string) => void;
  unpinConversation: (id: string) => void;
  exportConversation: (id: string) => void;
  importConversations: (data: Conversation[]) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export function useConversations() {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversations must be used within a ConversationProvider');
  }
  return context;
}

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const currentConversation = conversations.find(c => c.id === currentConversationId) || null;

  // Load conversations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setConversations(conversationsWithDates);
        
        // Set the most recent conversation as current
        if (conversationsWithDates.length > 0) {
          setCurrentConversationId(conversationsWithDates[0].id);
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: generateId(),
      title: 'New conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
      tags: []
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    return newConversation.id;
  }, []);

  const selectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
  }, []);

  const updateConversation = useCallback((id: string, updates: Partial<Conversation>) => {
    setConversations(prev => prev.map(conv => 
      conv.id === id 
        ? { ...conv, ...updates, updatedAt: new Date() }
        : conv
    ));
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (currentConversationId === id) {
      const remaining = conversations.filter(conv => conv.id !== id);
      setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
  }, [currentConversationId, conversations]);

  const addMessage = useCallback((conversationId: string, message: Message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = [...conv.messages, message];
        
        // Auto-generate title from first user message
        let title = conv.title;
        if (conv.title === 'New conversation' && message.sender === 'user') {
          title = message.text.slice(0, 50) + (message.text.length > 50 ? '...' : '');
        }
        
        return {
          ...conv,
          messages: updatedMessages,
          title,
          updatedAt: new Date()
        };
      }
      return conv;
    }));
  }, []);

  const updateMessage = useCallback((conversationId: string, messageId: string, updates: Partial<Message>) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: conv.messages.map(msg => 
            msg.id === messageId ? { ...msg, ...updates } : msg
          ),
          updatedAt: new Date()
        };
      }
      return conv;
    }));
  }, []);

  const searchConversations = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return conversations.filter(conv =>
      conv.title.toLowerCase().includes(lowerQuery) ||
      conv.messages.some(msg => msg.text.toLowerCase().includes(lowerQuery)) ||
      conv.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [conversations]);

  const pinConversation = useCallback((id: string) => {
    updateConversation(id, { isPinned: true });
  }, [updateConversation]);

  const unpinConversation = useCallback((id: string) => {
    updateConversation(id, { isPinned: false });
  }, [updateConversation]);

  const exportConversation = useCallback((id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (!conversation) return;

    const dataStr = JSON.stringify(conversation, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversation-${conversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [conversations]);

  const importConversations = useCallback((data: Conversation[]) => {
    const processedData = data.map(conv => ({
      ...conv,
      id: generateId(), // Generate new IDs to avoid conflicts
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map(msg => ({
        ...msg,
        id: generateId(),
        timestamp: new Date(msg.timestamp)
      }))
    }));
    
    setConversations(prev => [...processedData, ...prev]);
  }, []);

  const value: ConversationContextType = {
    conversations,
    currentConversation,
    createNewConversation,
    selectConversation,
    updateConversation,
    deleteConversation,
    addMessage,
    updateMessage,
    searchConversations,
    pinConversation,
    unpinConversation,
    exportConversation,
    importConversations
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}