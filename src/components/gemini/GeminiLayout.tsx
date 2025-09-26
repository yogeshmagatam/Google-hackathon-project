'use client'

import React, { useState, useCallback } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/gemini/Sidebar';
import { ChatArea } from '@/components/gemini/ChatArea';
import { ConversationProvider } from '@/contexts/ConversationContext';
import { AIProvider } from '@/contexts/AIContext';
import { cn } from '@/lib/utils';
import { Menu, X, User, LogOut, Settings, BarChart3, Briefcase, FileText, Home } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import SkillAssessment from '@/components/SkillAssessment';
import AssessmentReport from '@/components/AssessmentReport';
import ResumeUpload from '@/components/ResumeUpload';
import JobRecommendations from '@/components/JobRecommendations';
import { AnimatedWrapper, PageTransition, AnimatedLoading, AnimatedButton } from '@/components/animations';

export default function GeminiLayout() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [assessmentResults, setAssessmentResults] = useState(null);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleAssessmentComplete = (results: any) => {
    setAssessmentResults(results);
    setActiveTab('report');
  };

  if (status === 'loading') {
    return (
  <AnimatedWrapper animation="fadeIn" className="flex items-center justify-center h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <AnimatedLoading type="wave" size="lg" color="blue-500" text="Loading your career advisor..." />
      </AnimatedWrapper>
    );
  }

  if (!session) {
    return (
  <AnimatedWrapper animation="fadeIn" className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)] text-[var(--color-text)]">
        <motion.div 
          className="max-w-md w-full rounded-2xl shadow-xl p-8" style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="text-white font-bold text-2xl">CA</span>
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Career Advisor AI</h1>
            <p className="text-gray-600">Your personal career guidance assistant</p>
          </motion.div>

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <AnimatedButton
              onClick={() => signIn('google')}
              variant="default"
              animation="glow"
              className="w-full text-black border-2 border-gray-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </AnimatedButton>

            <AnimatedButton
              onClick={() => signIn('github')}
              variant="default"
              animation="bounce"
              className="w-full bg-gray-900 text-white hover:bg-gray-800 border-gray-900"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </AnimatedButton>
          </motion.div>

          <motion.div 
            className="mt-8 text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </motion.div>
        </motion.div>
      </AnimatedWrapper>
    );
  }

  return (
    <ConversationProvider>
      <AIProvider>
  <AnimatedWrapper animation="fadeIn" className="h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
          <AnimatePresence>
            {isMobile && sidebarOpen && (
              <motion.div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setSidebarOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>

          {/* Header Bar */}
          <motion.div 
            className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              {activeTab === 'chat' && (
                <motion.button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Toggle sidebar"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={sidebarOpen ? 'close' : 'menu'}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              )}
              <motion.h1 
                className="text-xl font-semibold text-gray-900 dark:text-white"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                Career Advisor AI
              </motion.h1>
            </div>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <motion.button 
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                    whileHover={{ rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <User className="w-4 h-4 text-white" />
                  </motion.div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {session?.user?.name || session?.user?.email}
                  </span>
                </motion.button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content 
                  className="min-w-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1"
                  sideOffset={5}
                >
                  <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
                    <Settings className="w-4 h-4" />
                    Settings
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  <DropdownMenu.Item 
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md cursor-pointer"
                    onClick={() => signOut()}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </motion.div>

          {/* Tab Navigation */}
          <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <motion.div
              className="flex-shrink-0 flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Tabs.List className="flex">
                {[
                  { value: "chat", icon: Home, label: "Chat" },
                  { value: "assessment", icon: BarChart3, label: "Assessment" },
                  { value: "jobs", icon: Briefcase, label: "Jobs" },
                  { value: "resume", icon: FileText, label: "Resume" },
                  ...(assessmentResults ? [{ value: "report", icon: BarChart3, label: "Report" }] : [])
                ].map((tab, index) => (
                  <Tabs.Trigger 
                    key={tab.value}
                    value={tab.value}
                    asChild
                  >
                    <motion.button
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 relative"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <motion.div
                        animate={activeTab === tab.value ? { 
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <tab.icon className="w-4 h-4" />
                      </motion.div>
                      {tab.label}
                      {activeTab === tab.value && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                          layoutId="activeTab"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </motion.div>

            {/* Content Area */}
            <div className="flex-1 flex min-h-0">
              {/* Sidebar for Chat Tab */}
              {activeTab === 'chat' && (
                <motion.div 
                  className={cn(
                    "flex-shrink-0 transition-all duration-300 ease-in-out",
                    sidebarOpen ? "w-80" : "w-0",
                    isMobile ? "fixed top-0 left-0 h-full z-50" : "relative"
                  )}
                  initial={{ x: -320 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Sidebar 
                    isOpen={sidebarOpen} 
                    onClose={() => setSidebarOpen(false)}
                    isMobile={isMobile}
                  />
                </motion.div>
              )}

              {/* Main Content */}
              <div className="flex-1 min-w-0 h-full">
                <PageTransition page={activeTab}>
                  <Tabs.Content value="chat" className="h-full">
                    <ChatArea />
                  </Tabs.Content>

                  <Tabs.Content value="assessment" className="h-full overflow-auto p-6">
                    <SkillAssessment onComplete={handleAssessmentComplete} />
                  </Tabs.Content>

                  <Tabs.Content value="jobs" className="h-full overflow-auto p-6">
                    <JobRecommendations />
                  </Tabs.Content>

                  <Tabs.Content value="resume" className="h-full overflow-auto p-6">
                    <ResumeUpload />
                  </Tabs.Content>

                  {assessmentResults && (
                    <Tabs.Content value="report" className="h-full overflow-auto p-6">
                      <AssessmentReport 
                        results={assessmentResults} 
                        onStartNewAssessment={() => {
                          setAssessmentResults(null);
                          setActiveTab('assessment');
                        }}
                      />
                    </Tabs.Content>
                  )}
                </PageTransition>
              </div>
            </div>
          </Tabs.Root>
        </AnimatedWrapper>
      </AIProvider>
    </ConversationProvider>
  );
}
