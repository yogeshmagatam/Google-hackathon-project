'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle, Circle, Target, TrendingUp, Lightbulb } from 'lucide-react';
import { AnimatedButton, AnimatedCard, AnimatedContainer, AnimatedItem } from '@/components/animations';

interface SkillAssessmentProps {
  onComplete: (results: AssessmentResults) => void;
}

interface AssessmentResults {
  technicalSkills: { [key: string]: number };
  softSkills: { [key: string]: number };
  careerGoals: string[];
  experience: string;
  interests: string[];
  educationalBackground: {
    currentLevel?: string;
    stream?: string;
    degree?: string;
    college?: string;
    percentage?: number;
    entranceExams?: string[];
    grades?: string;
  };
}

const SkillAssessment = ({ onComplete }: SkillAssessmentProps) => {
  // Experience Level options for assessment step
  const experienceOptions = [
    'Student (12th Standard)',
    'Student (Graduation - 1st/2nd Year)',
    'Student (Graduation - 3rd/4th Year)',
    'Fresh Graduate (0-1 years)',
    'Entry Level (1-3 years)',
    'Mid Level (3-7 years)',
    'Senior Level (7+ years)',
    'Manager/Team Lead',
    'Director/VP'
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<Partial<AssessmentResults>>({
    technicalSkills: {},
    softSkills: {},
    careerGoals: [],
    experience: '',
    interests: [],
    educationalBackground: {},
  });

  const steps = [
    'Educational Background',
    'Technical Skills',
    'Soft Skills', 
    'Experience Level',
    'Career Goals',
    'Interests'
  ];

  // Enhanced technical skills relevant to Indian job market
  const technicalSkills = [
    'Java', 'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Excel', 'Power BI',
    'Data Analysis', 'Machine Learning', 'Digital Marketing', 'Tally', 'SAP', 'AutoCAD',
    'Photoshop', 'Financial Modeling', 'Project Management', 'Content Writing'
  ];

  const softSkills = [
    'English Communication', 'Hindi Communication', 'Leadership', 'Problem Solving', 
    'Teamwork', 'Adaptability', 'Time Management', 'Critical Thinking', 'Creativity', 
    'Emotional Intelligence', 'Networking', 'Presentation Skills'
  ];

  // Updated career goals relevant to Indian context
  const careerGoalOptions = [
    'Get placed in top IT company (TCS, Infosys, Wipkart)',
    'Crack government job (UPSC, Banking, SSC)',
    'Higher studies (MBA, MS, M.Tech)',
    'Start own business/startup',
    'Work in MNC (Google, Microsoft, Amazon)',
    'Join consulting (McKinsey, BCG, Deloitte)',
    'Career in finance/banking',
    'Teaching/Research career'
  ];

  // Indian context interests
  const interestOptions = [
    'Information Technology', 'Banking & Finance', 'Government Jobs', 'Healthcare', 
    'Education & Teaching', 'Civil Services', 'Engineering', 'Entrepreneurship',
    'Digital Marketing', 'Data Science', 'Consulting', 'Media & Entertainment'
  ];

  // Educational background options
  const educationalStreams = [
    'Science (PCM) - Physics, Chemistry, Mathematics',
    'Science (PCB) - Physics, Chemistry, Biology', 
    'Commerce - Business Studies, Accountancy, Economics',
    'Arts/Humanities - History, Geography, Political Science'
  ];

  const degreeOptions = [
    'B.Tech/B.E. - Computer Science',
    'B.Tech/B.E. - Electronics & Communication',
    'B.Tech/B.E. - Mechanical Engineering',
    'B.Tech/B.E. - Civil Engineering',
    'MBBS - Bachelor of Medicine',
    'B.Com - Commerce',
    'BBA - Business Administration',
    'BCA - Computer Applications',
    'BA - Arts/Humanities',
    'BSc - Science',
    'Currently in 12th Standard',
    'Other'
  ];

  // Dynamic stream options depending on academic level (addresses incorrect streams for Undergraduates)
  const getStreamOptions = (): string[] => {
    const level = results.educationalBackground?.currentLevel;
    switch (level) {
      case '10th Grade':
      case '12th Grade':
        return [
          'Science (PCM)',
          'Science (PCB)',
          'Commerce',
          'Arts/Humanities'
        ];
      case 'Undergraduate':
        return [
          'B.Tech - Computer Science (CSE)',
          'B.Tech - Electronics & Communication (ECE)',
          'B.Tech - Electrical & Electronics (EEE)',
          'B.Tech - Information Technology (IT)',
          'B.Tech - Artificial Intelligence & Data Science',
          'B.Tech - Mechanical Engineering',
          'B.Tech - Civil Engineering',
          'B.Tech - Chemical Engineering',
          'B.Tech - Biotechnology',
          'B.Tech - Aerospace Engineering',
          'B.Tech - Mechatronics / Robotics',
          'BCA - Computer Applications',
          'B.Sc - Pure Sciences',
          'B.Com - Commerce',
          'BBA - Business Administration',
          'BA - Arts/Humanities',
          'MBBS - Medicine',
          'B.Pharma - Pharmacy',
          'B.Arch - Architecture',
          'B.Des - Design',
          'B.Sc Nursing',
          'Law (LLB)',
          'Integrated Dual Degree (B.Tech + M.Tech)',
          'Other'
        ];
      case 'Postgraduate':
        return [
          'Engineering (M.Tech/M.E.)',
          'Science (M.Sc)',
          'Computer Applications (MCA)',
          'Business Administration (MBA)',
          'Arts/Humanities (MA)',
          'Commerce (M.Com)',
          'Research (M.Phil)',
          'Other'
        ];
      case 'PhD':
        return [
          'Engineering Research',
          'Computer Science / AI Research',
          'Physics Research',
          'Chemistry Research',
          'Biotechnology / Life Sciences',
          'Mathematics / Data Science',
          'Humanities & Social Sciences',
          'Management / Economics',
          'Interdisciplinary',
          'Other'
        ];
      default:
        return [];
    }
  };

  const handleSkillRating = (skill: string, rating: number, category: 'technical' | 'soft') => {
    const skillKey = category === 'technical' ? 'technicalSkills' : 'softSkills';
    setResults(prev => ({
      ...prev,
      [skillKey]: {
        ...prev[skillKey],
        [skill]: rating
      }
    }));
  };

  const handleMultiSelect = (option: string, field: 'careerGoals' | 'interests') => {
    setResults(prev => {
      const currentArray = prev[field] || [];
      const isSelected = currentArray.includes(option);
      
      return {
        ...prev,
        [field]: isSelected 
          ? currentArray.filter(item => item !== option)
          : [...currentArray, option]
      };
    });
  };

  const handleExperienceSelect = (experience: string) => {
    setResults(prev => ({ ...prev, experience }));
  };

  const handleEducationalBackground = (field: string, value: string | number | string[]) => {
    setResults(prev => ({
      ...prev,
      educationalBackground: {
        ...prev.educationalBackground,
        [field]: value
      }
    }));
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Ensure all required fields are present before completing
      const completeResults: AssessmentResults = {
        technicalSkills: results.technicalSkills || {},
        softSkills: results.softSkills || {},
        careerGoals: results.careerGoals || [],
        experience: results.experience || '',
        interests: results.interests || [],
        educationalBackground: results.educationalBackground || {},
      };

      try {
        // Save to database
        const response = await fetch('/api/assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(completeResults)
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Assessment saved with score:', result.score);
        }
      } catch (error) {
        console.error('Failed to save assessment:', error);
      }

      onComplete(completeResults);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Educational Background
        return !!(results.educationalBackground?.currentLevel);
      case 1: // Technical skills
        return Object.keys(results.technicalSkills || {}).length >= 3;
      case 2: // Soft skills
        return Object.keys(results.softSkills || {}).length >= 3;
      case 3: // Experience
        return !!results.experience;
      case 4: // Career goals
        return (results.careerGoals || []).length >= 1;
      case 5: // Interests
        return (results.interests || []).length >= 2;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Educational Background
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Educational Background</h3>
            <p className="text-white mb-6">Tell us about your educational journey:</p>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Current Academic Level</label>
                <select
                  value={results.educationalBackground?.currentLevel || ''}
                  onChange={(e) => handleEducationalBackground('currentLevel', e.target.value)}
                  className="w-full p-2 border rounded text-white bg-gray-800"
                >
                  <option value="" className="text-white">Select your current level</option>
                  {['10th Grade', '12th Grade', 'Undergraduate', 'Postgraduate', 'PhD'].map(level => (
                    <option key={level} value={level} className="text-white">{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Stream (if applicable)</label>
                <select
                  value={results.educationalBackground?.stream || ''}
                  onChange={(e) => handleEducationalBackground('stream', e.target.value)}
                  className="w-full p-2 border rounded text-white bg-gray-800 disabled:opacity-50"
                  disabled={getStreamOptions().length === 0}
                >
                  <option value="" className="text-white">
                    {getStreamOptions().length ? 'Select your stream' : 'Select level first'}
                  </option>
                  {getStreamOptions().map(stream => (
                    <option key={stream} value={stream} className="text-white">{stream}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Degree/Course (if applicable)</label>
                <select
                  value={results.educationalBackground?.degree || ''}
                  onChange={(e) => handleEducationalBackground('degree', e.target.value)}
                  className="w-full p-2 border rounded text-white bg-gray-800"
                >
                  <option value="" className="text-white">Select your degree</option>
                  {[
                    'B.Tech/B.E.', 'B.Sc.', 'BCA', 'B.Com', 'BBA', 'BA', 'MBBS', 'B.Pharma',
                    'M.Tech/M.E.', 'M.Sc.', 'MCA', 'MBA', 'MA', 'M.Com', 'PhD', 'Diploma'
                  ].map(degree => (
                    <option key={degree} value={degree} className="text-white">{degree}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Percentage/CGPA (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., 85% or 8.5 CGPA"
                  value={results.educationalBackground?.grades || ''}
                  onChange={(e) => handleEducationalBackground('grades', e.target.value)}
                  className="w-full p-2 border rounded text-white bg-gray-800"
                />
              </div>
            </div>
          </div>
        );
      case 1: // Technical Skills
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Rate Your Technical Skills</h3>
            <p className="text-white mb-6">Rate yourself from 1 (beginner) to 5 (expert) for each skill:</p>
            {technicalSkills.map(skill => (
              <div key={skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-black">{skill}</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleSkillRating(skill, rating, 'technical')}
                      className={`w-8 h-8 rounded-full border-2 ${
                        (results.technicalSkills?.[skill] || 0) >= rating
                          ? 'bg-blue-600 border-blue-600 text-gray-300'
                          : 'border-gray-300 hover:border-blue-400 text-gray-300'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case 2: // Soft Skills
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Rate Your Soft Skills</h3>
            <p className="text-white mb-6">Rate yourself from 1 (beginner) to 5 (expert) for each skill:</p>
            {softSkills.map(skill => (
              <div key={skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-black">{skill}</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleSkillRating(skill, rating, 'soft')}
                      className={`w-8 h-8 rounded-full border-2 ${
                        (results.softSkills?.[skill] || 0) >= rating
                          ? 'bg-green-600 border-green-600 text-gray-300'
                          : 'border-gray-300 hover:border-green-400 text-gray-300'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case 3: // Experience Level
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">What best describes your professional experience?</h3>
            <div className="grid grid-cols-2 gap-3">
              {experienceOptions.map(option => (
                <button
                  key={option}
                  onClick={() => handleExperienceSelect(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    results.experience === option
                      ? 'border-purple-500 bg-purple-50 text-gray-500'
                      : 'border-gray-200 hover:border-purple-300 text-gray-500'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      case 4: // Career Goals
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Career Goals</h3>
            <p className="text-white mb-6">Select your primary career objectives (choose at least 1):</p>
            <div className="grid grid-cols-2 gap-3">
              {careerGoalOptions.map(goal => (
                <button
                  key={goal}
                  onClick={() => handleMultiSelect(goal, 'careerGoals')}
                  className={`p-3 text-left rounded-lg border-2 transition-colors ${
                    (results.careerGoals || []).includes(goal)
                      ? 'border-orange-500 bg-orange-50 text-gray-300'
                      : 'border-gray-200 hover:border-orange-300 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {(results.careerGoals || []).includes(goal) ? (
                      <CheckCircle className="w-5 h-5 text-orange-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-500">{goal}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 5: // Interests
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Areas of Interest</h3>
            <p className="text-white mb-6">Select fields that interest you (choose at least 2):</p>
            <div className="grid grid-cols-3 gap-3">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  onClick={() => handleMultiSelect(interest, 'interests')}
                  className={`p-3 text-center rounded-lg border-2 transition-colors ${
                    (results.interests || []).includes(interest)
                      ? 'border-indigo-500 bg-indigo-50 text-gray-300'
                      : 'border-gray-200 hover:border-indigo-300 text-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    {(results.interests || []).includes(interest) ? (
                      <CheckCircle className="w-5 h-5 text-indigo-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-500">{interest}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatedCard animation="hover" className="bg-white shadow-xl p-6 max-w-4xl mx-auto">
      {/* Progress Bar */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Assessment Progress</span>
          <motion.span 
            className="text-sm text-white"
            key={currentStep}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {currentStep + 1} of {steps.length}
          </motion.span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <motion.span
              key={step}
                className={`text-xs ${
                  index <= currentStep ? 'text-blue-600 font-medium' : 'text-white'
                }`}
              initial={{ opacity: 0.5 }}
              animate={{ 
                opacity: index <= currentStep ? 1 : 0.5,
                scale: index === currentStep ? 1.1 : 1 
              }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
                {step}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <motion.div 
        className="flex justify-between mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatedButton
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          variant="ghost"
          animation="slide"
        >
          Previous
        </AnimatedButton>
        <AnimatedButton
          onClick={handleNext}
          disabled={!canProceed()}
          variant="primary"
          animation="glow"
          className="flex items-center gap-2"
        >
          {currentStep === steps.length - 1 ? 'Complete Assessment' : 'Next'}
          <motion.div
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </AnimatedButton>
      </motion.div>
    </AnimatedCard>
  );
}

export default SkillAssessment;
