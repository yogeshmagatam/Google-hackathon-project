import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-helpers'

interface JobRecommendation {
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

export async function GET(request: NextRequest) {
  try {
    // Use auth helper to handle Next.js 15 session management
    const authResult = await requireAuth(request)
    
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const session = authResult.session!

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email! },
      include: {
        assessments: {
          orderBy: { completedAt: 'desc' },
          take: 1
        },
        resumes: {
          orderBy: { uploadedAt: 'desc' },
          take: 1
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user profile data
    const latestAssessment = user.assessments[0]
    const latestResume = user.resumes[0]

    let userSkills: string[] = []
    let careerLevel = 'entry'
    let interests: string[] = []

    if (latestAssessment) {
      const technicalSkills = JSON.parse(latestAssessment.technicalSkills || '{}')
      const softSkills = JSON.parse(latestAssessment.softSkills || '{}')
      const userInterests = JSON.parse(latestAssessment.interests || '[]')
      
      userSkills = [
        ...Object.keys(technicalSkills).filter(skill => technicalSkills[skill] >= 3),
        ...Object.keys(softSkills).filter(skill => softSkills[skill] >= 3)
      ]
      
      careerLevel = latestAssessment.experience?.toLowerCase().includes('senior') ? 'senior' : 
                    latestAssessment.experience?.toLowerCase().includes('mid') ? 'mid' : 'entry'
      interests = userInterests
    }

    if (latestResume && latestResume.skills) {
      const resumeSkills = JSON.parse(latestResume.skills)
      userSkills = [...userSkills, ...resumeSkills.technical, ...resumeSkills.soft]
    }

    // Remove duplicates
    userSkills = [...new Set(userSkills)]

    // Fetch job recommendations
    const jobs = await fetchJobRecommendations(userSkills, careerLevel, interests)
    
    // Calculate fit scores and sort
    const jobsWithFitScores = jobs.map(job => ({
      ...job,
      fitScore: calculateFitScore(job, userSkills, careerLevel)
    })).sort((a, b) => b.fitScore - a.fitScore)

    return NextResponse.json({
      jobs: jobsWithFitScores,
      userProfile: {
        skills: userSkills,
        careerLevel,
        interests
      }
    })

  } catch (error) {
    console.error('Job recommendations error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job recommendations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Use auth helper to handle Next.js 15 session management
    const authResult = await requireAuth(request)
    
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const session = authResult.session!

    const { jobId, action } = await request.json()
    
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email! }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (action === 'bookmark') {
      // Get job details from our mock data or API
      const job = await getJobById(jobId)
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      }

      const bookmark = await prisma.jobBookmark.create({
        data: {
          userId: user.id,
          jobTitle: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          description: job.description,
          url: job.url,
          fitScore: job.fitScore
        }
      })

      return NextResponse.json({ success: true, bookmarkId: bookmark.id })
    }

    if (action === 'apply') {
      await prisma.jobBookmark.updateMany({
        where: {
          userId: user.id,
          id: jobId
        },
        data: {
          appliedAt: new Date()
        }
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Job action error:', error)
    return NextResponse.json(
      { error: 'Failed to process job action' },
      { status: 500 }
    )
  }
}

async function fetchJobRecommendations(
  skills: string[], 
  careerLevel: string, 
  interests: string[]
): Promise<JobRecommendation[]> {
  // In a real application, you'd integrate with job APIs like:
  // - Indeed API
  // - LinkedIn Jobs API
  // - GitHub Jobs
  // - RemoteOK API
  // - Reed API (UK)
  
  // For demo purposes, we'll return mock data based on user profile
  const mockJobs: JobRecommendation[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120,000 - $160,000',
      description: 'We are looking for a senior software engineer to join our growing team. You will be responsible for developing scalable web applications using modern technologies.',
      requirements: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Leadership'],
      fitScore: 0,
      source: 'LinkedIn',
      url: 'https://linkedin.com/jobs/123456'
    },
    {
      id: '2',
      title: 'Data Scientist',
      company: 'DataFlow Analytics',
      location: 'Remote',
      salary: '$100,000 - $140,000',
      description: 'Join our data science team to build machine learning models and extract insights from large datasets.',
      requirements: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'Statistics'],
      fitScore: 0,
      source: 'Indeed',
      url: 'https://indeed.com/jobs/789012'
    },
    {
      id: '3',
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'New York, NY',
      salary: '$110,000 - $150,000',
      description: 'Lead product development from conception to launch. Work with cross-functional teams to deliver exceptional user experiences.',
      requirements: ['Product Management', 'Leadership', 'Communication', 'Project Management', 'Strategic Thinking'],
      fitScore: 0,
      source: 'Glassdoor'
    },
    {
      id: '4',
      title: 'UX/UI Designer',
      company: 'Creative Studio',
      location: 'Los Angeles, CA',
      salary: '$80,000 - $110,000',
      description: 'Design beautiful and intuitive user interfaces for web and mobile applications.',
      requirements: ['Design', 'Figma', 'User Research', 'Prototyping', 'Creativity'],
      fitScore: 0,
      source: 'Dribbble Jobs'
    },
    {
      id: '5',
      title: 'Marketing Manager',
      company: 'GrowthCo',
      location: 'Austin, TX',
      salary: '$70,000 - $95,000',
      description: 'Drive marketing campaigns and strategies to increase brand awareness and customer acquisition.',
      requirements: ['Digital Marketing', 'Communication', 'Analytics', 'Content Creation', 'Leadership'],
      fitScore: 0,
      source: 'MarketingJobs'
    },
    {
      id: '6',
      title: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      location: 'Seattle, WA',
      salary: '$105,000 - $135,000',
      description: 'Manage cloud infrastructure and deployment pipelines. Ensure high availability and scalability.',
      requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Infrastructure'],
      fitScore: 0,
      source: 'Stack Overflow Jobs'
    },
    {
      id: '7',
      title: 'Business Analyst',
      company: 'FinanceFirst',
      location: 'Chicago, IL',
      salary: '$65,000 - $85,000',
      description: 'Analyze business processes and requirements to drive operational improvements.',
      requirements: ['Business Analysis', 'Excel', 'Communication', 'Problem Solving', 'Finance'],
      fitScore: 0,
      source: 'LinkedIn'
    },
    {
      id: '8',
      title: 'Frontend Developer',
      company: 'WebBuilders',
      location: 'Remote',
      salary: '$75,000 - $100,000',
      description: 'Build responsive and interactive web applications using modern frontend frameworks.',
      requirements: ['JavaScript', 'React', 'CSS', 'HTML', 'TypeScript'],
      fitScore: 0,
      source: 'AngelList'
    }
  ]

  // Filter jobs based on interests if available
  if (interests.length > 0) {
    return mockJobs.filter(job => 
      interests.some(interest => 
        job.title.toLowerCase().includes(interest.toLowerCase()) ||
        job.description.toLowerCase().includes(interest.toLowerCase()) ||
        job.company.toLowerCase().includes(interest.toLowerCase())
      )
    ).concat(mockJobs.filter(job => 
      !interests.some(interest => 
        job.title.toLowerCase().includes(interest.toLowerCase()) ||
        job.description.toLowerCase().includes(interest.toLowerCase()) ||
        job.company.toLowerCase().includes(interest.toLowerCase())
      )
    ).slice(0, 3))
  }

  return mockJobs
}

function calculateFitScore(
  job: JobRecommendation, 
  userSkills: string[], 
  careerLevel: string
): number {
  let score = 0
  const maxScore = 100

  // Skill matching (60% of score)
  const skillMatches = job.requirements.filter(req => 
    userSkills.some(skill => 
      skill.toLowerCase().includes(req.toLowerCase()) ||
      req.toLowerCase().includes(skill.toLowerCase())
    )
  ).length
  
  const skillScore = (skillMatches / job.requirements.length) * 60
  score += skillScore

  // Career level matching (25% of score)
  const jobLevel = job.title.toLowerCase().includes('senior') ? 'senior' :
                   job.title.toLowerCase().includes('lead') || job.title.toLowerCase().includes('manager') ? 'mid' : 'entry'
  
  if (jobLevel === careerLevel) {
    score += 25
  } else if (
    (careerLevel === 'mid' && jobLevel === 'entry') ||
    (careerLevel === 'senior' && jobLevel === 'mid')
  ) {
    score += 15 // Slightly lower level is okay
  } else if (
    (careerLevel === 'entry' && jobLevel === 'mid') ||
    (careerLevel === 'mid' && jobLevel === 'senior')
  ) {
    score += 10 // Stretch opportunity
  }

  // Location preference (10% of score)
  if (job.location.toLowerCase().includes('remote')) {
    score += 10 // Remote work is often preferred
  } else {
    score += 5
  }

  // Company reputation (5% of score) - simplified
  if (job.source === 'LinkedIn' || job.source === 'Glassdoor') {
    score += 5
  } else {
    score += 3
  }

  return Math.min(Math.round(score), maxScore)
}

async function getJobById(jobId: string): Promise<JobRecommendation | null> {
  // In a real app, this would fetch from your database or external API
  const mockJobs = await fetchJobRecommendations([], 'entry', [])
  return mockJobs.find(job => job.id === jobId) || null
}