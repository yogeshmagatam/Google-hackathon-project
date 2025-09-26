'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, DollarSign, Bookmark, ExternalLink, Star, Filter, Briefcase, Clock } from 'lucide-react'
import { AnimatedButton, AnimatedCard, StaggeredGrid, AnimatedLoading } from '@/components/animations'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  description: string
  requirements: string[]
  fitScore: number
  source: string
  url?: string
}

interface UserProfile {
  skills: string[]
  careerLevel: string
  interests: string[]
}

const JobRecommendations: React.FC = () => {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'all' | 'high-fit' | 'remote'>('all')
  const [sortBy, setSortBy] = useState<'fit-score' | 'recent' | 'salary'>('fit-score')

  useEffect(() => {
    if (session) {
      fetchJobRecommendations()
    }
  }, [session])

  const fetchJobRecommendations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs)
        setUserProfile(data.userProfile)
      }
    } catch (error) {
      console.error('Failed to fetch job recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookmark = async (jobId: string) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, action: 'bookmark' })
      })

      if (response.ok) {
        setBookmarkedJobs(prev => new Set([...prev, jobId]))
      }
    } catch (error) {
      console.error('Failed to bookmark job:', error)
    }
  }

  const getFitScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getFitScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  // Extracts max salary in rupees (₹). Converts $ to ₹ if needed (1 USD = 83 INR)
  const extractMaxSalary = (salaryString?: string): number => {
    if (!salaryString) return 0
    // Check for rupee values first
    const rupeeMatches = salaryString.match(/₹(\d+,?\d*)/g)
    if (rupeeMatches) {
      const numbers = rupeeMatches.map(match => parseInt(match.replace(/₹|,/g, '')))
      return Math.max(...numbers)
    }
    // Fallback: convert dollar values to rupees
    const dollarMatches = salaryString.match(/\$(\d+,?\d*)/g)
    if (dollarMatches) {
      const numbers = dollarMatches.map(match => parseInt(match.replace(/\$|,/g, '')) * 83) // 1 USD = 83 INR
      return Math.max(...numbers)
    }
    return 0
  }

  const filteredAndSortedJobs = React.useMemo(() => {
    let filtered = jobs

    // Apply filters
    switch (filter) {
      case 'high-fit':
        filtered = jobs.filter(job => job.fitScore >= 70)
        break
      case 'remote':
        filtered = jobs.filter(job => job.location.toLowerCase().includes('remote'))
        break
      default:
        filtered = jobs
    }

    // Apply sorting
    switch (sortBy) {
      case 'fit-score':
        return filtered.sort((a, b) => b.fitScore - a.fitScore)
      case 'recent':
        return filtered // Assuming jobs are already in recent order
      case 'salary':
        return filtered.sort((a, b) => {
          const aMax = extractMaxSalary(a.salary)
          const bMax = extractMaxSalary(b.salary)
          return bMax - aMax
        })
      default:
        return filtered
    }
  }, [jobs, filter, sortBy])

  if (loading) {
    return (
      <motion.div 
        className="flex items-center justify-center h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatedLoading type="wave" size="lg" color="blue-500" text="Finding perfect jobs for you..." />
      </motion.div>
    )
  }

  if (!userProfile) {
    return (
      <motion.div 
        className="text-center py-12 text-black"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
        >
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-xl font-semibold text-black mb-2">Complete Your Profile</h3>
        <p className="text-gray-700">Complete a skills assessment or upload your resume to get personalized job recommendations.</p>
      </motion.div>
    )
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
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-black"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-black flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Briefcase className="w-6 h-6 text-blue-600" />
            </motion.div>
            Job Recommendations
          </h2>
          <motion.p 
            className="text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Based on your skills: {userProfile.skills.slice(0, 3).join(', ')}
          </motion.p>
        </div>
        
        {/* Filters and Sort */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="all">All Jobs</option>
            <option value="high-fit">High Fit (70%+)</option>
            <option value="remote">Remote Only</option>
          </motion.select>
          
          <motion.select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="fit-score">Best Fit</option>
            <option value="recent">Most Recent</option>
            <option value="salary">Highest Salary</option>
          </motion.select>
        </motion.div>
      </motion.div>

      {/* Stats */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-black">Total Jobs</span>
          </div>
          <p className="text-2xl font-bold text-black mt-1">{filteredAndSortedJobs.length}</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-green-600" />
            <span className="font-medium text-black">High Fit Jobs</span>
          </div>
          <p className="text-2xl font-bold text-black mt-1">
            {jobs.filter(job => job.fitScore >= 80).length}
          </p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-black">Remote Jobs</span>
          </div>
          <p className="text-2xl font-bold text-black mt-1">
            {jobs.filter(job => job.location.toLowerCase().includes('remote')).length}
          </p>
        </div>
      </div>

      {/* Job List */}
      <motion.div 
        className="space-y-4"  
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <AnimatePresence>
          {filteredAndSortedJobs.map((job, index) => (
            <AnimatedCard 
              key={job.id} 
              animation="hover"
              clickable={false}
              className="p-6"
              delay={index * 0.1}
            >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                {/* Job Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                    <p className="text-lg text-gray-200">{job.company}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${getFitScoreBg(job.fitScore)}`}>
                    <span className={`text-sm font-medium ${getFitScoreColor(job.fitScore)}`}>
                      {job.fitScore}% fit
                    </span>
                  </div>
                </div>

                {/* Job Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-white mb-3">
                  <div className="flex items-center gap-1 text-white">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-1 text-white">
                      {/* Rupee icon or symbol */}
                      <span className="font-bold text-green-700">₹</span>
                      {/* Convert and display salary in rupees */}
                      {(() => {
                        // If already in rupees, show as is; if in dollars, convert
                        if (job.salary.includes('₹')) return job.salary
                        const dollarMatches = job.salary.match(/\$(\d+,?\d*)/g)
                        if (dollarMatches) {
                          // Replace each $amount with ₹amount_inr
                          let converted = job.salary
                          dollarMatches.forEach(match => {
                            const num = parseInt(match.replace(/\$|,/g, ''))
                            const inr = num * 83
                            converted = converted.replace(match, `₹${inr.toLocaleString('en-IN')}`)
                          })
                          return converted
                        }
                        return job.salary
                      })()}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-white">
                    <Clock className="w-4 h-4" />
                    {job.source}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-200 mb-4 line-clamp-2">{job.description}</p>

                {/* Requirements */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, index) => {
                      const isMatch = userProfile.skills.some(skill => 
                        skill.toLowerCase().includes(req.toLowerCase()) ||
                        req.toLowerCase().includes(skill.toLowerCase())
                      )
                      return (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-full ${
                            isMatch 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}
                        >
                          {req}
                          {isMatch && ' ✓'}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 lg:ml-4">
                <AnimatedButton
                  onClick={() => handleBookmark(job.id)}
                  disabled={bookmarkedJobs.has(job.id)}
                  variant={bookmarkedJobs.has(job.id) ? "secondary" : "ghost"}
                  animation="bounce"
                  className={bookmarkedJobs.has(job.id) 
                    ? 'bg-yellow-50 border-yellow-200 text-gray-300' 
                    : 'border-gray-300 text-gray-300'
                  }
                >
                  <motion.div
                    animate={bookmarkedJobs.has(job.id) ? { 
                      scale: [1, 1.2, 1],
                      rotate: [0, 15, -15, 0]
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarkedJobs.has(job.id) ? 'fill-current' : ''}`} />
                  </motion.div>
                  {bookmarkedJobs.has(job.id) ? 'Bookmarked' : 'Bookmark'}
                </AnimatedButton>
                
                {job.url && (
                  <AnimatedButton
                    onClick={() => window.open(job.url, '_blank')}
                    variant="primary"
                    animation="glow"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Apply Now
                  </AnimatedButton>
                )}
              </div>
            </div>
            </AnimatedCard>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredAndSortedJobs.length === 0 && (
        <motion.div 
          className="text-center py-12 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          >
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-xl font-semibold text-white mb-2">No Jobs Found</h3>
          <p className="text-gray-200">Try adjusting your filters or complete your profile for better recommendations.</p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default JobRecommendations