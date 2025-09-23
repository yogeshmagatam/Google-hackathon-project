'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { MapPin, DollarSign, Bookmark, ExternalLink, Star, Filter, Briefcase, Clock } from 'lucide-react'

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

  const extractMaxSalary = (salaryString?: string): number => {
    if (!salaryString) return 0
    const matches = salaryString.match(/\$(\d+,?\d*)/g)
    if (!matches) return 0
    const numbers = matches.map(match => parseInt(match.replace(/\$|,/g, '')))
    return Math.max(...numbers)
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Profile</h3>
        <p className="text-gray-600">Complete a skills assessment or upload your resume to get personalized job recommendations.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Recommendations</h2>
          <p className="text-gray-600">Based on your skills: {userProfile.skills.slice(0, 3).join(', ')}</p>
        </div>
        
        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Jobs</option>
            <option value="high-fit">High Fit (70%+)</option>
            <option value="remote">Remote Only</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="fit-score">Best Fit</option>
            <option value="recent">Most Recent</option>
            <option value="salary">Highest Salary</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Total Jobs</span>
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-1">{filteredAndSortedJobs.length}</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">High Fit Jobs</span>
          </div>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {jobs.filter(job => job.fitScore >= 80).length}
          </p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">Remote Jobs</span>
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-1">
            {jobs.filter(job => job.location.toLowerCase().includes('remote')).length}
          </p>
        </div>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {filteredAndSortedJobs.map((job) => (
          <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                {/* Job Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-lg text-gray-700">{job.company}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${getFitScoreBg(job.fitScore)}`}>
                    <span className={`text-sm font-medium ${getFitScoreColor(job.fitScore)}`}>
                      {job.fitScore}% fit
                    </span>
                  </div>
                </div>

                {/* Job Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {job.source}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                {/* Requirements */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
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
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
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
                <button
                  onClick={() => handleBookmark(job.id)}
                  disabled={bookmarkedJobs.has(job.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    bookmarkedJobs.has(job.id)
                      ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkedJobs.has(job.id) ? 'fill-current' : ''}`} />
                  {bookmarkedJobs.has(job.id) ? 'Bookmarked' : 'Bookmark'}
                </button>
                
                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Apply Now
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedJobs.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
          <p className="text-gray-600">Try adjusting your filters or complete your profile for better recommendations.</p>
        </div>
      )}
    </div>
  )
}

export default JobRecommendations