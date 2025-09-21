'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Briefcase, Target, BookOpen, TrendingUp, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  provider?: string;
  responseTime?: number;
}

interface APIResponse {
  message: string;
  timestamp: string;
  provider?: string;
  responseTime?: number;
  usage?: {
    tokens: number;
    cost?: number;
  };
}

const CareerAdvisorChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Career & Skills Advisor. I'm here to help you with:\n\n• **Career Path Guidance** - Find the right career direction\n• **Skills Assessment** - Identify your strengths and gaps\n• **Industry Insights** - Learn about different sectors\n• **Professional Development** - Get personalized learning recommendations\n\nTo get started, tell me about your current situation, career goals, or any specific questions you have!",
      sender: 'ai',
      timestamp: new Date(),
      provider: 'system',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [apiStatus, setApiStatus] = useState<{provider: string; online: boolean} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const placeholders = [
    "Ask about career advice, skills assessment, or professional development...",
    "What career path should I consider with my background?",
    "How can I improve my technical skills?",
    "What are the salary expectations for my role?",
    "How do I transition to a new industry?",
    "What soft skills are most important in my field?",
    "Can you help me prepare for job interviews?",
    "What learning resources do you recommend?",
  ];

  // Rotate placeholder text every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '44px';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('career-advisor-chat-history');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
    
    // Check API status
    checkApiStatus();
  }, []);

  // Check API status
  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/chat');
      if (response.ok) {
        const data = await response.json();
        setApiStatus({
          provider: data.provider || 'unknown',
          online: true,
        });
      }
    } catch (error) {
      setApiStatus({
        provider: 'offline',
        online: false,
      });
    }
  };

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 1) { // Don't save if only welcome message
      localStorage.setItem('career-advisor-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data: APIResponse = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        sender: 'ai',
        timestamp: new Date(),
        provider: data.provider,
        responseTime: data.responseTime,
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update API status if we got a successful response
      if (data.provider) {
        setApiStatus({
          provider: data.provider,
          online: true,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I apologize, but I'm having trouble connecting right now. ${error instanceof Error ? error.message : 'Please try again in a moment.'}`,
        sender: 'ai',
        timestamp: new Date(),
        provider: 'error',
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Update API status on error
      setApiStatus(prev => prev ? { ...prev, online: false } : null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow new line with Shift+Enter
        return;
      } else {
        // Send message with Enter
        e.preventDefault();
        handleSend();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  const quickActions = [
    { icon: Briefcase, text: "Career Change Advice", query: "I'm thinking about changing careers. Can you help me explore options and create a transition plan?" },
    { icon: Target, text: "Skills Assessment", query: "Can you help me assess my current skills and identify areas for improvement in my field?" },
    { icon: BookOpen, text: "Learning Path", query: "What should I learn to advance in my career? Please suggest specific courses and certifications." },
    { icon: TrendingUp, text: "Industry Trends", query: "What are the current trends and future outlook in my industry? How can I stay competitive?" },
  ];

  const conversationStarters = [
    "I'm feeling stuck in my current role...",
    "How do I negotiate a salary increase?",
    "What's the best way to network professionally?",
    "I want to develop leadership skills",
    "How do I build a personal brand?",
    "What are remote work best practices?",
  ];

  const handleQuickAction = (query: string) => {
    setInput(query);
    // Auto-focus the textarea after setting the query
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const clearChatHistory = () => {
    const confirmClear = window.confirm('Are you sure you want to clear the chat history? This action cannot be undone.');
    if (confirmClear) {
      setMessages([{
        id: '1',
        text: "Hello! I'm your AI Career & Skills Advisor. I'm here to help you with:\n\n• **Career Path Guidance** - Find the right career direction\n• **Skills Assessment** - Identify your strengths and gaps\n• **Industry Insights** - Learn about different sectors\n• **Professional Development** - Get personalized learning recommendations\n\nTo get started, tell me about your current situation, career goals, or any specific questions you have!",
        sender: 'ai',
        timestamp: new Date(),
        provider: 'system',
      }]);
      localStorage.removeItem('career-advisor-chat-history');
    }
  };

  // Show provider change notification
  const showProviderInfo = () => {
    if (apiStatus) {
      const providerName = apiStatus.provider.charAt(0).toUpperCase() + apiStatus.provider.slice(1);
      alert(`Currently using: ${providerName} AI Provider\n\nStatus: ${apiStatus.online ? 'Online ✅' : 'Offline ❌'}\n\nTo change providers, check the AI_SETUP.md file for configuration instructions.`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto h-[70vh] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-black p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-semibold">Career Advisor AI</h2>
              <div className="flex items-center gap-2">
                <p className="text-blue-100 text-sm">Your personal career guidance assistant</p>
                {apiStatus && (
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${apiStatus.online ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-xs text-blue-100 capitalize">
                      {apiStatus.provider} {apiStatus.online ? 'online' : 'offline'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 1 && (
              <button
                onClick={clearChatHistory}
                className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
                title="Clear chat history"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            )}
            <button
              onClick={showProviderInfo}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="View AI provider information"
            >
              <Bot className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'ai' && (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-black" />
              </div>
            )}
            <div
              className={`max-w-3xl rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-black'
                  : 'bg-black-100 text-black'
              }`}
            >
              {message.sender === 'ai' ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown 
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.text}</p>
              )}
              <p className={`text-xs mt-2 flex items-center justify-between ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                <span>{message.timestamp.toLocaleTimeString()}</span>
                {message.sender === 'ai' && message.provider && message.provider !== 'system' && (
                  <span className="flex items-center gap-1">
                    {message.responseTime && (
                      <span>{message.responseTime}ms</span>
                    )}
                    <span className="capitalize">• {message.provider}</span>
                  </span>
                )}
              </p>
            </div>
            {message.sender === 'user' && (
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-black" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 bg-gray-50 border-t">
          <p className="text-sm text-black mb-3 font-medium">Quick actions to get started:</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.query)}
                className="flex items-center gap-2 p-3 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <action.icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-black">{action.text}</span>
              </button>
            ))}
          </div>
          
          <p className="text-sm text-black mb-2 font-medium">Or try these conversation starters:</p>
          <div className="flex flex-wrap gap-2">
            {conversationStarters.map((starter, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(starter)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                "{starter}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-gray-50">
        <div className="space-y-2">
          {/* Character count for longer messages */}
          {input.length > 100 && (
            <div className="flex justify-end">
              <span className={`text-xs ${input.length > 500 ? 'text-red-500' : 'text-gray-500'}`}>
                {input.length}/1000 characters
              </span>
            </div>
          )}
          
          <div className="flex gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholders[placeholderIndex]}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[44px] max-h-[120px] text-black transition-all duration-200"
              disabled={isLoading}
              maxLength={1000}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || input.length > 1000}
              className="bg-blue-600 text-black p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-11 h-11 flex items-center justify-center self-end"
              title={input.trim() ? "Send message" : "Type a message to send"}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* Hint text */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            {isLoading && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                AI is typing...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerAdvisorChat;
