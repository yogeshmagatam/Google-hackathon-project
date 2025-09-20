'use client';

import { useState } from 'react';
import CareerAdvisorChat from '@/components/CareerAdvisorChat';
import SkillAssessment from '@/components/SkillAssessment';
import AssessmentReport from '@/components/AssessmentReport';
import { MessageCircle, Target, BarChart3 } from 'lucide-react';

interface AssessmentResults {
  technicalSkills: { [key: string]: number };
  softSkills: { [key: string]: number };
  careerGoals: string[];
  experience: string;
  interests: string[];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'assessment' | 'report'>('chat');
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResults | null>(null);

  const handleAssessmentComplete = (results: AssessmentResults) => {
    setAssessmentResults(results);
    setActiveTab('report');
  };

  const handleStartNewAssessment = () => {
    setAssessmentResults(null);
    setActiveTab('assessment');
  };

  const tabs = [
    { id: 'chat', label: 'AI Career Chat', icon: MessageCircle },
    { id: 'assessment', label: 'Skills Assessment', icon: Target },
    { id: 'report', label: 'Assessment Report', icon: BarChart3, disabled: !assessmentResults },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            🎯 AI Career & Skills Advisor
          </h1>
          <p className="text-black text-lg mb-8">
            Get personalized career guidance and skills development recommendations
          </p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-lg">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
                    disabled={tab.disabled}
                    className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-black shadow-md'
                        : tab.disabled
                        ? 'text-black cursor-not-allowed'
                        : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'chat' && <CareerAdvisorChat />}
        {activeTab === 'assessment' && (
          <SkillAssessment onComplete={handleAssessmentComplete} />
        )}
        {activeTab === 'report' && assessmentResults && (
          <AssessmentReport 
            results={assessmentResults} 
            onStartNewAssessment={handleStartNewAssessment}
          />
        )}
      </div>
    </main>
  );
}
