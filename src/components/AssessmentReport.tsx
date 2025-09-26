'use client';

import React, { useState } from 'react';
import { TrendingUp, Target, BookOpen, Users, Award, ChevronDown, ChevronUp } from 'lucide-react';

interface AssessmentResults {
  technicalSkills: { [key: string]: number };
  softSkills: { [key: string]: number };
  careerGoals: string[];
  experience: string;
  interests: string[];
}

interface CareerRecommendation {
  title: string;
  match: string;
  description: string;
  requirements: string[];
}

interface LearningRecommendation {
  category: string;
  skill: string;
  resources: string[];
  timeframe: string;
  priority: string;
}

interface AssessmentReportProps {
  results: AssessmentResults;
  onStartNewAssessment: () => void;
}

const AssessmentReport = ({ results, onStartNewAssessment }: AssessmentReportProps) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    strengths: true,
    improvements: true,
    recommendations: true,
    careerPaths: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev: { [key: string]: boolean }) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Analyze strengths and weaknesses
  const getTopSkills = (skills: { [key: string]: number }, count: number = 3) => {
    if (!skills || Object.keys(skills).length === 0) return [];
    return Object.entries(skills)
      .sort(([, a], [, b]) => b - a)
      .slice(0, count);
  };

  const getImprovementAreas = (skills: { [key: string]: number }, threshold: number = 2) => {
    if (!skills || Object.keys(skills).length === 0) return [];
    return Object.entries(skills)
      .filter(([, rating]) => rating <= threshold)
      .sort(([, a], [, b]) => a - b);
  };

  const topTechnicalSkills = getTopSkills(results.technicalSkills || {});
  const topSoftSkills = getTopSkills(results.softSkills || {});
  const technicalImprovements = getImprovementAreas(results.technicalSkills || {});
  const softImprovements = getImprovementAreas(results.softSkills || {});

  // Generate career recommendations based on interests and skills
  const generateCareerRecommendations = (): CareerRecommendation[] => {
    const recommendations: CareerRecommendation[] = [];
    const interests = results.interests || [];
    
    if (interests.includes('Technology')) {
      if (topTechnicalSkills.some(([skill]) => skill === 'Programming')) {
        recommendations.push({
          title: 'Software Developer',
          match: '92%',
          description: 'Build applications and systems using programming languages',
          requirements: ['Programming', 'Problem Solving', 'Continuous Learning']
        });
      }
      
      if (topTechnicalSkills.some(([skill]) => skill === 'Data Analysis')) {
        recommendations.push({
          title: 'Data Scientist',
          match: '88%',
          description: 'Analyze complex data to extract insights and drive decisions',
          requirements: ['Data Analysis', 'Critical Thinking', 'Communication']
        });
      }
    }
    
    if (interests.includes('Marketing')) {
      recommendations.push({
        title: 'Digital Marketing Manager',
        match: '85%',
        description: 'Develop and execute digital marketing strategies',
        requirements: ['Digital Marketing', 'Creativity', 'Data Analysis']
      });
    }
    
    if (interests.includes('Finance')) {
      recommendations.push({
        title: 'Financial Analyst',
        match: '83%',
        description: 'Analyze financial data and market trends',
        requirements: ['Financial Analysis', 'Critical Thinking', 'Attention to Detail']
      });
    }
    
    // Default recommendation if none match
    if (recommendations.length === 0) {
      recommendations.push({
        title: 'Project Manager',
        match: '80%',
        description: 'Lead cross-functional teams to deliver projects',
        requirements: ['Project Management', 'Leadership', 'Communication']
      });
    }
    
    return recommendations.slice(0, 3);
  };

  const careerRecommendations = generateCareerRecommendations();

  // Generate learning recommendations
  const generateLearningRecommendations = (): LearningRecommendation[] => {
    const recommendations: LearningRecommendation[] = [];
    
    // Based on improvement areas
    technicalImprovements.slice(0, 2).forEach(([skill]) => {
      recommendations.push({
        category: 'Technical Skills',
        skill,
        resources: [
          `${skill} Fundamentals Course (Coursera)`,
          `${skill} Certification Program`,
          `Hands-on ${skill} Projects`
        ],
        timeframe: '3-6 months',
        priority: 'High'
      });
    });
    
    softImprovements.slice(0, 2).forEach(([skill]) => {
      recommendations.push({
        category: 'Soft Skills',
        skill,
        resources: [
          `${skill} Workshop Series`,
          `Professional ${skill} Coaching`,
          `${skill} Practice Groups`
        ],
        timeframe: '2-4 months',
        priority: 'Medium'
      });
    });
    
    return recommendations;
  };

  const learningRecommendations = generateLearningRecommendations();

  const SkillRating = ({ skill, rating }: { skill: string; rating: number }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="font-medium text-black">{skill}</span>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i <= rating ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
  <span className="text-sm text-black ml-2">{rating}/5</span>
      </div>
    </div>
  );

  const SectionHeader = ({ icon: Icon, title, section }: { icon: any; title: string; section: string }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 text-blue-600" />
  <h3 className="text-lg font-semibold text-black">{title}</h3>
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="w-5 h-5 text-blue-600" />
      ) : (
        <ChevronDown className="w-5 h-5 text-blue-600" />
      )}
    </button>
  );

  return (
  <div className="bg-white rounded-lg shadow-xl p-6 max-w-6xl mx-auto text-black">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black mb-2">Your Career Assessment Report</h2>
        <p className="text-black">Personalized insights and recommendations for your professional journey</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{results.experience ? 1 : 0}</div>
    <div className="text-sm text-white">Experience Level</div>
    <div className="text-xs text-white mt-1">What best describes your professional experience?</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{Object.keys(results.softSkills || {}).length}</div>
    <div className="text-sm text-black">Soft Skills Rated</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{(results.careerGoals || []).length}</div>
    <div className="text-sm text-white">Career Goals</div>
    <div className="text-xs text-white mt-1">Select your primary career objectives (choose at least 1):</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{(results.interests || []).length}</div>
    <div className="text-sm text-white">Interests</div>
    <div className="text-xs text-white mt-1">Select fields that interest you (choose at least 2):</div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Strengths Section */}
        <div>
          <SectionHeader icon={TrendingUp} title="Your Key Strengths" section="strengths" />
          {expandedSections.strengths && (
            <div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-black mb-3">Top Technical Skills</h4>
                  <div className="space-y-2">
                    {topTechnicalSkills.map(([skill, rating]) => (
                      <SkillRating key={skill} skill={skill} rating={rating} />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-3">Top Soft Skills</h4>
                  <div className="space-y-2">
                    {topSoftSkills.map(([skill, rating]) => (
                      <SkillRating key={skill} skill={skill} rating={rating} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Improvement Areas */}
        <div>
          <SectionHeader icon={Target} title="Areas for Improvement" section="improvements" />
          {expandedSections.improvements && (
            <div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg">
              {(technicalImprovements.length > 0 || softImprovements.length > 0) ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {technicalImprovements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-black mb-3">Technical Skills to Develop</h4>
                      <div className="space-y-2">
                        {technicalImprovements.slice(0, 3).map(([skill, rating]) => (
                          <SkillRating key={skill} skill={skill} rating={rating} />
                        ))}
                      </div>
                    </div>
                  )}
                  {softImprovements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-black mb-3">Soft Skills to Develop</h4>
                      <div className="space-y-2">
                        {softImprovements.slice(0, 3).map(([skill, rating]) => (
                          <SkillRating key={skill} skill={skill} rating={rating} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-black">Great job! You've rated all your skills highly. Focus on advanced specialization in your strongest areas.</p>
              )}
            </div>
          )}
        </div>

        {/* Career Recommendations */}
        <div>
          <SectionHeader icon={Users} title="Recommended Career Paths" section="careerPaths" />
          {expandedSections.careerPaths && (
            <div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4">
                {careerRecommendations.map((career, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-black">{career.title}</h4>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {career.match} match
                      </span>
                    </div>
                    <p className="text-black text-sm mb-3">{career.description}</p>
                    <div>
                      <h5 className="text-xs font-medium text-black mb-1">Key Requirements:</h5>
                      <div className="flex flex-wrap gap-1">
                        {career.requirements.map((req, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Learning Recommendations */}
        <div>
          <SectionHeader icon={BookOpen} title="Personalized Learning Plan" section="recommendations" />
          {expandedSections.recommendations && (
            <div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg">
              {learningRecommendations.length > 0 ? (
                <div className="space-y-4">
                  {learningRecommendations.map((rec, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-black">{rec.skill}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            rec.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {rec.priority} Priority
                          </span>
                          <span className="text-xs text-gray-500">{rec.timeframe}</span>
                        </div>
                      </div>
                      <p className="text-sm text-black mb-2">{rec.category}</p>
                      <ul className="text-sm text-black">
                        {rec.resources.map((resource: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Award className="w-3 h-3 text-blue-500" />
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-black">Based on your strong skill ratings, focus on advanced specialization and leadership development.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onStartNewAssessment}
          className="px-6 py-2 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors"
        >
          Retake Assessment
        </button>
        <button className="px-6 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 transition-colors">
          Download Report
        </button>
        <button className="px-6 py-2 bg-green-600 text-black rounded-lg hover:bg-green-700 transition-colors">
          Schedule Career Consultation
        </button>
      </div>
    </div>
  );
};

export default AssessmentReport;
