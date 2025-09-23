import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // In Next.js 15, we need to await cookies before using getServerSession
    const cookieStore = await cookies()
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const assessmentData = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate overall score
    const technicalAvg = Object.values(assessmentData.technicalSkills as Record<string, number>)
      .reduce((sum, rating) => sum + rating, 0) / Object.keys(assessmentData.technicalSkills).length

    const softAvg = Object.values(assessmentData.softSkills as Record<string, number>)
      .reduce((sum, rating) => sum + rating, 0) / Object.keys(assessmentData.softSkills).length

    const overallScore = ((technicalAvg + softAvg) / 2) * 20 // Convert to 100 scale

    // Save assessment to database
    const assessment = await prisma.assessment.create({
      data: {
        userId: user.id,
        technicalSkills: JSON.stringify(assessmentData.technicalSkills),
        softSkills: JSON.stringify(assessmentData.softSkills),
        careerGoals: JSON.stringify(assessmentData.careerGoals),
        experience: assessmentData.experience,
        interests: JSON.stringify(assessmentData.interests),
        score: overallScore
      }
    })

    // Log progress
    await prisma.progressLog.create({
      data: {
        userId: user.id,
        type: 'assessment',
        data: JSON.stringify({
          assessmentId: assessment.id,
          score: overallScore,
          skillsCount: Object.keys(assessmentData.technicalSkills).length + Object.keys(assessmentData.softSkills).length
        })
      }
    })

    return NextResponse.json({
      success: true,
      assessmentId: assessment.id,
      score: overallScore
    })

  } catch (error) {
    console.error('Assessment save error:', error)
    return NextResponse.json(
      { error: 'Failed to save assessment' },
      { status: 500 }
    )
  }
}