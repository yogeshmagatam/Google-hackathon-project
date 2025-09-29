'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Building, MapPin, Star, ExternalLink, Filter, BookOpen, Award, Users, TrendingUp } from 'lucide-react'
import { AnimatedButton, AnimatedCard, StaggeredGrid } from '@/components/animations'
import { studentCareerGuidance, indianEducationSystem } from '@/lib/indian-career-context'

interface College {
  id: string
  name: string
  location: string
  type: 'IIT' | 'NIT' | 'IIM' | 'Medical' | 'Private' | 'Government'
  rating: number
  averagePackage: string
  topRecruiters: string[]
  courses: string[]
  entranceExam: string
  fees: string
}

interface Internship {
  id: string
  title: string
  company: string
  location: string
  duration: string
  stipend: string
  description: string
  requirements: string[]
  type: 'Tech' | 'Finance' | 'Consulting' | 'Marketing' | 'Research'
  applicationDeadline: string
}

const StudentGuidance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'colleges' | 'internships' | 'career-paths'>('colleges')
  const [selectedStream, setSelectedStream] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

  // Mock college data based on Indian context
  const colleges: College[] = [
    {
      id: '1',
      name: 'IIT Bombay',
      location: 'Mumbai, Maharashtra',
      type: 'IIT',
      rating: 4.9,
      averagePackage: '₹20-25 LPA', 
      topRecruiters: ['Google', 'Microsoft', 'Goldman Sachs', 'McKinsey'],
      courses: ['B.Tech CSE', 'B.Tech EE', 'B.Tech Mechanical', 'M.Tech', 'MBA'],
      entranceExam: 'JEE Advanced',
      fees: '₹2,50,000/year'
    },
    {
      id: '2',
      name: 'AIIMS Delhi',
      location: 'New Delhi',
      type: 'Medical',
      rating: 4.8,
      averagePackage: '₹12-15 LPA',
      topRecruiters: ['Apollo Hospitals', 'Fortis', 'Max Healthcare', 'PGIMER'],
      courses: ['MBBS', 'MD', 'MS', 'DM', 'MCh'],
      entranceExam: 'NEET',
      fees: '₹1,50,000/year'
    },
    {
      id: '3',
      name: 'IIM Ahmedabad',
      location: 'Ahmedabad, Gujarat',
      type: 'IIM',
      rating: 4.9,
      averagePackage: '₹25-30 LPA',
      topRecruiters: ['McKinsey', 'BCG', 'Bain', 'Goldman Sachs', 'JP Morgan'],
      courses: ['MBA', 'PGPX', 'PhD'],
      entranceExam: 'CAT',
      fees: '₹23,00,000 (2 years)'
    },
    {
      id: '4',
      name: 'BITS Pilani',
      location: 'Pilani, Rajasthan',
      type: 'Private',
      rating: 4.7,
      averagePackage: '₹15-20 LPA',
      topRecruiters: ['Microsoft', 'Amazon', 'Google', 'Adobe', 'Flipkart'],
      courses: ['B.E.', 'M.Sc.', 'MBA', 'PhD'],
      entranceExam: 'BITSAT',
      fees: '₹4,50,000/year'
    },
    {
      id: '5',
      name: 'NIT Trichy',
      location: 'Tiruchirappalli, Tamil Nadu',
      type: 'NIT',
      rating: 4.6,
      averagePackage: '₹10-15 LPA',
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant'],
      courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'],
      entranceExam: 'JEE Main',
      fees: '₹1,50,000/year'
    }
  ]

  // Mock internship data
  const internships: Internship[] = [
    {
      id: '1',
      title: 'Software Development Intern',
      company: 'Flipkart',
      location: 'Bangalore, Karnataka',
      duration: '2-3 months',
      stipend: '₹50,000/month',
      description: 'Work on cutting-edge e-commerce platform features. Gain hands-on experience with large-scale distributed systems.',
      requirements: ['Java/Python', 'Data Structures', 'System Design', 'Problem Solving'],
      type: 'Tech',
      applicationDeadline: '15th November 2024'
    },
    {
      id: '2',
      title: 'Investment Banking Intern',
      company: 'Goldman Sachs',
      location: 'Mumbai, Maharashtra',
      duration: '10 weeks',
      stipend: '₹1,00,000/month',
      description: 'Support deal execution, financial modeling, and client presentations in Investment Banking Division.',
      requirements: ['Finance Background', 'Excel', 'Financial Modeling', 'Communication'],
      type: 'Finance',
      applicationDeadline: '30th October 2024'
    },
    {
      id: '3',
      title: 'Management Consulting Intern',
      company: 'McKinsey & Company',
      location: 'Mumbai, Maharashtra',
      duration: '8 weeks',
      stipend: '₹80,000/month',
      description: 'Work with Fortune 500 clients on strategy and operations projects. Mentorship from senior consultants.',
      requirements: ['MBA/B.Tech', 'Problem Solving', 'Communication', 'Analytics'],
      type: 'Consulting',
      applicationDeadline: '20th November 2024'
    },
    {
      id: '4',
      title: 'Product Marketing Intern',
      company: 'Zomato',
      location: 'Gurgaon, Haryana',
      duration: '3 months',
      stipend: '₹35,000/month',
      description: 'Drive go-to-market strategies for new product launches. Work closely with product and marketing teams.',
      requirements: ['Marketing', 'Analytics', 'Content Creation', 'Communication'],
      type: 'Marketing',
      applicationDeadline: '25th October 2024'
    },
    {
      id: '5',
      title: 'Research Intern',
      company: 'IIT Bombay',
      location: 'Mumbai, Maharashtra',
      duration: '6 months',
      stipend: '₹20,000/month',
      description: 'Research on AI/ML applications in healthcare. Opportunity to publish papers and attend conferences.',
      requirements: ['Python', 'Machine Learning', 'Research Aptitude', 'Mathematics'],
      type: 'Research',
      applicationDeadline: '10th December 2024'
    }
  ]

  const filteredColleges = colleges.filter(college => {
    if (selectedType === 'all') return true
    return college.type === selectedType
  })

  const filteredInternships = internships.filter(internship => {
    if (selectedType === 'all') return true
    return internship.type === selectedType
  })

  const getTypeColor = (type: string) => {
    const colors = {
      'IIT': 'bg-red-100 text-black border-red-200',
      'NIT': 'bg-blue-100 text-black border-blue-200',
      'IIM': 'bg-green-100 text-black border-green-200',
      'Medical': 'bg-purple-100 text-black border-purple-200',
      'Private': 'bg-orange-100 text-black border-orange-200',
      'Government': 'bg-gray-100 text-black border-gray-200',
      'Tech': 'bg-blue-100 text-black border-blue-200',
      'Finance': 'bg-green-100 text-black border-green-200',
      'Consulting': 'bg-purple-100 text-black border-purple-200',
      'Marketing': 'bg-pink-100 text-black border-pink-200',
      'Research': 'bg-indigo-100 text-black border-indigo-200'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-black border-gray-200'
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </motion.div>
          Student Career Guidance
        </h2>
        <p className="text-gray-600">Comprehensive guidance for Indian students - Colleges, Internships & Career Paths</p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        className="flex justify-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
          {[
            { key: 'colleges', label: 'Top Colleges', icon: Building },
            { key: 'internships', label: 'Internships', icon: BookOpen },
            { key: 'career-paths', label: 'Career Paths', icon: Award }
          ].map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="flex justify-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {activeTab === 'colleges' && (
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All College Types</option>
            <option value="IIT">IITs</option>
            <option value="NIT">NITs</option>
            <option value="IIM">IIMs</option>
            <option value="Medical">Medical Colleges</option>
            <option value="Private">Private Colleges</option>
            <option value="Government">Government Colleges</option>
          </select>
        )}
        {activeTab === 'internships' && (
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Internship Types</option>
            <option value="Tech">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Consulting">Consulting</option>
            <option value="Marketing">Marketing</option>
            <option value="Research">Research</option>
          </select>
        )}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Colleges Tab */}
          {activeTab === 'colleges' && (
            <div className="space-y-4">
              {filteredColleges.map((college, index) => (
                <AnimatedCard 
                  key={college.id}
                  animation="hover"
                  delay={index * 0.1}
                  className="p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{college.name}</h3>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <MapPin className="w-4 h-4 text-white" />
                            <span className="text-white">{college.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(college.type)}`}>
                            {college.type}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium text-white">{college.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-white mb-1">Average Package</p>
                          <p className="font-semibold text-green-600">{college.averagePackage}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white mb-1">Entrance Exam</p>
                          <p className="font-semibold text-blue-600">{college.entranceExam}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white mb-1">Annual Fees</p>
                          <p className="font-semibold text-orange-600">{college.fees}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white mb-1">Popular Courses</p>
                          <p className="font-medium text-white">{college.courses.slice(0, 2).join(', ')}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-white mb-2">Top Recruiters:</p>
                        <div className="flex flex-wrap gap-2">
                          {college.topRecruiters.map((recruiter, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-black text-xs rounded-full">
                              {recruiter}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:ml-4">
                      <AnimatedButton
                        variant="primary"
                        animation="glow"
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Details
                      </AnimatedButton>
                      <AnimatedButton
                        variant="secondary"
                        animation="bounce"
                        className="border-gray-300"
                      >
                        <Users className="w-4 h-4" />
                        Connect Alumni
                      </AnimatedButton>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          )}

          {/* Internships Tab */}
          {activeTab === 'internships' && (
            <div className="space-y-4">
              {filteredInternships.map((internship, index) => (
                <AnimatedCard 
                  key={internship.id}
                  animation="hover"
                  delay={index * 0.1}
                  className="p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{internship.title}</h3>
                          <p className="text-lg text-white">{internship.company}</p>
                          <div className="flex items-center gap-4 text-sm text-white mt-2">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {internship.location}
                            </div>
                            <span>Duration: {internship.duration}</span>
                            <span className="font-semibold text-green-600">{internship.stipend}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(internship.type)}`}>
                          {internship.type}
                        </span>
                      </div>

                      <p className="text-white mb-4">{internship.description}</p>

                      <div className="mb-4">
                        <p className="text-sm text-white mb-2">Requirements:</p>
                        <div className="flex flex-wrap gap-2">
                          {internship.requirements.map((req, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-sm text-white">
                        <span className="font-medium">Application Deadline:</span> {internship.applicationDeadline}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:ml-4">
                      <AnimatedButton
                        variant="primary"
                        animation="glow"
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Apply Now
                      </AnimatedButton>
                      <AnimatedButton
                        variant="secondary"
                        animation="bounce"
                        className="border-gray-300"
                      >
                        Save for Later
                      </AnimatedButton>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          )}

          {/* Career Paths Tab */}
          {activeTab === 'career-paths' && (
            <div className="space-y-6">
              {Object.entries(studentCareerGuidance.byStream).map(([stream, data], index) => (
                <AnimatedCard 
                  key={stream}
                  animation="hover"
                  delay={index * 0.1}
                  className="p-6"
                >
                  <div className="mb-4">
                    <h3 className="text-2xl font-semibold text-white capitalize mb-2">{stream} Stream</h3>
                    <p className="text-white">Popular career paths and emerging opportunities</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-500" />
                        Top Career Options
                      </h4>
                      <ul className="space-y-2">
                        {data.topCareers.map((career, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-white">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {career}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        Emerging Fields
                      </h4>
                      <ul className="space-y-2">
                        {data.emergingFields.map((field, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-white">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {field}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold text-white mb-3">Recommended Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.recommendedSkills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

export default StudentGuidance