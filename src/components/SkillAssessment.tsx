'use client';

import { useState } from 'react';
import { ChevronRight, CheckCircle, Circle, Target, TrendingUp, Lightbulb } from 'lucide-react';

interface SkillAssessmentProps {
  onComplete: (results: AssessmentResults) => void;
}

interface AssessmentResults {
  technicalSkills: { [key: string]: number };
  softSkills: { [key: string]: number };
  careerGoals: string[];
  experience: string;
  interests: string[];
}

const SkillAssessment = ({ onComplete }: SkillAssessmentProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<Partial<AssessmentResults>>({
    technicalSkills: {},
    softSkills: {},
    careerGoals: [],
    experience: '',
    interests: [],
  });

  const steps = [
    'Technical Skills',
    'Soft Skills', 
    'Experience Level',
    'Career Goals',
    'Interests'
  ];

  const technicalSkills = [
    'Programming', 'Data Analysis', 'Digital Marketing', 'Design', 'Project Management',
    'Financial Analysis', 'Research', 'Writing', 'Sales', 'Customer Service'
  ];

  const softSkills = [
    'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Adaptability',
    'Time Management', 'Critical Thinking', 'Creativity', 'Emotional Intelligence', 'Networking'
  ];

  const careerGoalOptions = [
    'Advance in current role', 'Change careers', 'Start own business', 'Work remotely',
    'Increase salary', 'Better work-life balance', 'Leadership position', 'Specialize in expertise area'
  ];

  const interestOptions = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Sales',
    'Design', 'Engineering', 'Science', 'Arts', 'Social Impact', 'Entrepreneurship'
  ];

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

  const handleNext = () => {
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
      };
      onComplete(completeResults);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Technical skills
        return Object.keys(results.technicalSkills || {}).length >= 3;
      case 1: // Soft skills
        return Object.keys(results.softSkills || {}).length >= 3;
      case 2: // Experience
        return !!results.experience;
      case 3: // Career goals
        return (results.careerGoals || []).length >= 1;
      case 4: // Interests
        return (results.interests || []).length >= 2;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-black mb-4">Rate Your Technical Skills</h3>
            <p className="text-black mb-6">Rate yourself from 1 (beginner) to 5 (expert) for each skill:</p>
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
                          ? 'bg-blue-600 border-blue-600 text-black'
                          : 'border-gray-300 hover:border-blue-400'
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

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-black mb-4">Rate Your Soft Skills</h3>
            <p className="text-black mb-6">Rate yourself from 1 (beginner) to 5 (expert) for each skill:</p>
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
                          ? 'bg-green-600 border-green-600 text-black'
                          : 'border-gray-300 hover:border-green-400'
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

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-black mb-4">Experience Level</h3>
            <p className="text-black mb-6">What best describes your professional experience?</p>
            {[
              'Entry level (0-2 years)',
              'Mid-level (3-5 years)',
              'Senior level (6-10 years)',
              'Executive level (10+ years)',
              'Career changer'
            ].map(option => (
              <button
                key={option}
                onClick={() => handleExperienceSelect(option)}
                className={`w-full p-4 text-left text-black rounded-lg border-2 transition-colors ${
                  results.experience === option
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-black mb-4">Career Goals</h3>
            <p className="text-black mb-6">Select your primary career objectives (choose at least 1):</p>
            <div className="grid grid-cols-2 gap-3">
              {careerGoalOptions.map(goal => (
                <button
                  key={goal}
                  onClick={() => handleMultiSelect(goal, 'careerGoals')}
                  className={`p-3 text-left rounded-lg border-2 transition-colors ${
                    (results.careerGoals || []).includes(goal)
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {(results.careerGoals || []).includes(goal) ? (
                      <CheckCircle className="w-5 h-5 text-orange-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-black" />
                    )}
                    <span className="text-sm font-medium text-black">{goal}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-black mb-4">Areas of Interest</h3>
            <p className="text-black mb-6">Select fields that interest you (choose at least 2):</p>
            <div className="grid grid-cols-3 gap-3">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  onClick={() => handleMultiSelect(interest, 'interests')}
                  className={`p-3 text-center rounded-lg border-2 transition-colors ${
                    (results.interests || []).includes(interest)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    {(results.interests || []).includes(interest) ? (
                      <CheckCircle className="w-5 h-5 text-indigo-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-black" />
                    )}
                    <span className="text-sm font-medium text-black">{interest}</span>
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
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-black">Assessment Progress</span>
          <span className="text-sm text-black">{currentStep + 1} of {steps.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <span
              key={step}
              className={`text-xs ${
                index <= currentStep ? 'text-blue-600 font-medium' : 'text-black'
              }`}
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 text-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentStep === steps.length - 1 ? 'Complete Assessment' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SkillAssessment;
