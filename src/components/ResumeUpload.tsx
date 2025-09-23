'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface ResumeAnalysis {
  id: string
  fileName: string
  analysis: {
    strengths: string[]
    improvements: string[]
    careerLevel: string
    overallScore: number
    recommendations: string[]
  }
  skills: {
    technical: string[]
    soft: string[]
    tools: string[]
  }
  extractedText: string
}

interface ResumeUploadProps {
  onAnalysisComplete?: (analysis: ResumeAnalysis) => void
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onAnalysisComplete }) => {
  const [uploading, setUploading] = useState(false)
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      setAnalysis(result.resume)
      onAnalysisComplete?.(result.resume)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [onAnalysisComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: uploading
  })

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          {uploading ? (
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {uploading ? 'Analyzing your resume...' : 'Upload your resume'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {uploading 
                ? 'This may take a few moments' 
                : isDragActive 
                  ? 'Drop your PDF here' 
                  : 'Drag & drop a PDF file here, or click to select'
              }
            </p>
          </div>
          
          {!uploading && (
            <div className="text-xs text-gray-400">
              PDF files only • Max 10MB
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <h3 className="font-semibold text-green-900">Resume Analyzed Successfully</h3>
              <p className="text-sm text-green-700">File: {analysis.fileName}</p>
            </div>
          </div>

          {/* Overall Score */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${getScoreBgColor(analysis.analysis.overallScore)}`}>
              <span className="text-lg font-semibold text-gray-900">Overall Score:</span>
              <span className={`text-2xl font-bold ${getScoreColor(analysis.analysis.overallScore)}`}>
                {analysis.analysis.overallScore}/100
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Career Level: <span className="font-medium capitalize">{analysis.analysis.careerLevel}</span>
            </p>
          </div>

          {/* Analysis Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3">✅ Strengths</h4>
              <ul className="space-y-1">
                {analysis.analysis.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-green-800">• {strength}</li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-3">🎯 Areas for Improvement</h4>
              <ul className="space-y-1">
                {analysis.analysis.improvements.map((improvement, index) => (
                  <li key={index} className="text-sm text-orange-800">• {improvement}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Skills Extracted */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">🔧 Skills Identified</h4>
            
            <div className="grid md:grid-cols-3 gap-4">
              {/* Technical Skills */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 mb-2">Technical Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.technical.length > 0 ? (
                    analysis.skills.technical.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-blue-600 italic">None detected</span>
                  )}
                </div>
              </div>

              {/* Soft Skills */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h5 className="font-medium text-purple-900 mb-2">Soft Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.soft.length > 0 ? (
                    analysis.skills.soft.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-purple-600 italic">None detected</span>
                  )}
                </div>
              </div>

              {/* Tools */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Tools & Platforms</h5>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.tools.length > 0 ? (
                    analysis.skills.tools.map((tool, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {tool}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-600 italic">None detected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-900 mb-3">💡 Recommendations</h4>
            <ul className="space-y-2">
              {analysis.analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-indigo-800 flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">→</span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeUpload