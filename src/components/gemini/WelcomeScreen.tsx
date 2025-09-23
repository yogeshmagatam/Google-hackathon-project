'use client';

import React from 'react';
import { Briefcase, Target, BookOpen, TrendingUp, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStartChat: () => void;
}

export function WelcomeScreen({ onStartChat }: WelcomeScreenProps) {
  const quickStarters = [
    {
      icon: Briefcase,
      title: "Career Change Guidance",
      description: "Explore new career paths and transition strategies",
      prompt: "I'm thinking about changing careers. Can you help me explore options and create a transition plan?"
    },
    {
      icon: Target,
      title: "Skills Assessment",
      description: "Identify your strengths and areas for improvement",
      prompt: "Can you help me assess my current skills and identify areas for improvement in my field?"
    },
    {
      icon: BookOpen,
      title: "Learning Roadmap",
      description: "Get personalized learning recommendations",
      prompt: "What should I learn to advance in my career? Please suggest specific courses and certifications."
    },
    {
      icon: TrendingUp,
      title: "Industry Insights",
      description: "Stay updated with market trends and opportunities",
      prompt: "What are the current trends and future outlook in my industry? How can I stay competitive?"
    }
  ];

  const conversationStarters = [
    "I'm feeling stuck in my current role and need guidance",
    "How do I negotiate a salary increase effectively?",
    "What's the best way to network professionally?",
    "I want to develop leadership skills for my career",
    "How do I build a strong personal brand?",
    "What are the best practices for remote work?"
  ];

  const handleQuickStart = (prompt: string) => {
    onStartChat();
    // The prompt would be automatically filled in the chat input
    // This would require additional implementation
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Career Advisor AI
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
          Your intelligent companion for career growth, skills development, and professional success. 
          Get personalized advice, industry insights, and actionable strategies.
        </p>

        <button
          onClick={onStartChat}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
        >
          <MessageCircle className="w-5 h-5" />
          Start New Conversation
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Start Cards */}
      <div className="w-full mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Quick Start Options
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickStarters.map((starter, index) => (
            <div
              key={index}
              onClick={() => handleQuickStart(starter.prompt)}
              className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <starter.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {starter.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {starter.description}
                  </p>
                </div>
                
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation Starters */}
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Or try these conversation starters
        </h2>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {conversationStarters.map((starter, index) => (
            <button
              key={index}
              onClick={() => handleQuickStart(starter)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium transition-colors border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
            >
              "{starter}"
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personalized Guidance</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get advice tailored to your specific situation, goals, and industry
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Expert Knowledge</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Access insights from industry experts and best practices
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Actionable Strategies</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Receive concrete steps and strategies you can implement today
          </p>
        </div>
      </div>
    </div>
  );
}