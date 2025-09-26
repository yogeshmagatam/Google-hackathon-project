'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Calendar, Award, Target, Briefcase } from 'lucide-react'

interface ProgressData {
  assessments: Array<{
    id: string
    createdAt: string
    technicalSkills: Record<string, number>
    softSkills: Record<string, number>
  }>
  resumes: Array<{
    id: string
    filename: string
    analysis: {
      overallScore: number
      careerLevel: string
    }
  }>
  jobBookmarks: Array<{
    id: string
    jobTitle: string
    company: string
    fitScore: number
    bookmarkedAt: string
    appliedAt?: string
  }>
}

const coerceNumber = (value: any, options: { min?: number; max?: number; fallback: number }): number => {
  const num = Number(value)
  if (isNaN(num)) return options.fallback
  if (options.min !== undefined && num < options.min) return options.min
  if (options.max !== undefined && num > options.max) return options.max
  return num
}

export default function ProgressDashboard() {
  const { data: session, status } = useSession()
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchProgressData = async () => {
      if (status === 'loading') return
      
      try {
        const response = await fetch('/api/progress')
        if (response.ok) {
          const data = await response.json()
          setProgressData(data)
        }
      } catch (error) {
        console.error('Error fetching progress data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgressData()
  }, [status])

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please sign in to view your progress dashboard.</p>
      </div>
    )
  }

  if (!progressData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No progress data available. Start by taking an assessment or uploading your resume.</p>
      </div>
    )
  }

  const jobApplicationStats = [
    { name: 'Bookmarked', value: progressData.jobBookmarks.length, color: '#3B82F6' },
    { name: 'Applied', value: progressData.jobBookmarks.filter(job => job.appliedAt).length, color: '#10B981' },
  ]

  const totalAssessments = progressData.assessments.length
  const latestAssessment = progressData.assessments[progressData.assessments.length - 1]
  const averageScore = latestAssessment
    ? Math.round((
        Object.values(latestAssessment.technicalSkills).reduce((a, b) => a + b, 0) +
        Object.values(latestAssessment.softSkills).reduce((a, b) => a + b, 0)
      ) / (Object.keys(latestAssessment.technicalSkills).length + Object.keys(latestAssessment.softSkills).length))
    : 0

  const skillsData = latestAssessment ? [
    ...Object.entries(latestAssessment.technicalSkills).map(([skill, score]) => ({
      name: skill,
      score: coerceNumber(score, { min: 0, max: 100, fallback: 0 }),
      category: 'Technical'
    })),
    ...Object.entries(latestAssessment.softSkills).map(([skill, score]) => ({
      name: skill,
      score: coerceNumber(score, { min: 0, max: 100, fallback: 0 }),
      category: 'Soft Skills'
    }))
  ] : []

  return (
    <div className="space-y-6">
  <h2 className="text-2xl font-bold text-white">Progress Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4 force-white-text">
              <p className="text-sm font-medium">Experience Level</p>
              <p className="text-xs mt-1">What best describes your professional experience?</p>
              <p className="text-2xl font-semibold">{totalAssessments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4" style={{color:'white'}}>
              <p className="text-sm font-medium">Career Goals</p>
              <p className="text-xs mt-1">Select your primary career objectives (choose at least 1):</p>
              <p className="text-2xl font-semibold">{averageScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4" style={{color:'white'}}>
              <p className="text-sm font-medium">Interests</p>
              <p className="text-xs mt-1">Select fields that interest you (choose at least 2):</p>
              <p className="text-2xl font-semibold">{progressData.jobBookmarks.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Overview</h3>
          {mounted && skillsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No assessment data available
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Applications</h3>
          {mounted && jobApplicationStats.some(stat => stat.value > 0) ? (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={jobApplicationStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {jobApplicationStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No job applications yet
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6 space-y-4">
          {progressData.assessments.slice(-3).reverse().map((assessment, index) => (
            <div key={assessment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Skills Assessment Completed</p>
                  <p className="text-sm text-gray-500">
                    {new Date(assessment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Score: {Math.round((
                    Object.values(assessment.technicalSkills).reduce((a, b) => a + b, 0) +
                    Object.values(assessment.softSkills).reduce((a, b) => a + b, 0)
                  ) / (Object.keys(assessment.technicalSkills).length + Object.keys(assessment.softSkills).length))}%
                </p>
              </div>
            </div>
          ))}
          
          {progressData.resumes.slice(-2).reverse().map((resume) => (
            <div key={resume.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Award className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Resume Uploaded</p>
                  <p className="text-sm text-gray-500">{resume.filename}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Score: {resume.analysis.overallScore}%
                </p>
                <p className="text-xs text-gray-500">{resume.analysis.careerLevel}</p>
              </div>
            </div>
          ))}

          {progressData.assessments.length === 0 && progressData.resumes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No recent activity. Start by taking an assessment or uploading your resume.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
