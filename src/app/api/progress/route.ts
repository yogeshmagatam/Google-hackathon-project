import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // In Next.js 15, we need to await cookies before using getServerSession
    const cookieStore = await cookies()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        assessments: {
          orderBy: { completedAt: 'asc' }
        },
        resumes: {
          orderBy: { uploadedAt: 'asc' }
        },
        jobBookmarks: {
          orderBy: { bookmarkedAt: 'asc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Process and format the data
    const progressData = {
      assessments: user.assessments.map(assessment => ({
        id: assessment.id,
        completedAt: assessment.completedAt.toISOString(),
        score: assessment.score,
        technicalSkills: JSON.parse(assessment.technicalSkills || '{}'),
        softSkills: JSON.parse(assessment.softSkills || '{}')
      })),
      resumes: user.resumes.map(resume => ({
        id: resume.id,
        fileName: resume.fileName,
        uploadedAt: resume.uploadedAt.toISOString(),
        analysis: JSON.parse(resume.analysis || '{"overallScore": 0, "careerLevel": "unknown"}')
      })),
      jobBookmarks: user.jobBookmarks.map(bookmark => ({
        id: bookmark.id,
        jobTitle: bookmark.jobTitle,
        company: bookmark.company,
        fitScore: bookmark.fitScore,
        bookmarkedAt: bookmark.bookmarkedAt.toISOString(),
        appliedAt: bookmark.appliedAt?.toISOString()
      }))
    }

    return NextResponse.json(progressData)
  } catch (error) {
    console.error('Progress API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress data' },
      { status: 500 }
    )
  }
}