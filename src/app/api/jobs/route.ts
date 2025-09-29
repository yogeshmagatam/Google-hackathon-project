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
  // In a real application, you'd integrate with Indian job APIs like:
  // - Naukri.com API
  // - LinkedIn India API
  // - Indeed India API
  // - Monster India API
  // - Freshersworld API
  // - InternShala API
  
  // Mock data with Indian companies and job market context
  const mockJobs: JobRecommendation[] = [
    // Indian IT Services Companies
    {
      id: '1',
      title: 'Software Engineer',
      company: 'Tata Consultancy Services (TCS)',
      location: 'Bangalore, Karnataka',
      salary: '₹3,50,000 - ₹8,00,000',
      description: 'Join TCS as a Software Engineer to work on cutting-edge projects for global clients. You will be part of digital transformation initiatives using latest technologies.',
      requirements: ['Java', 'Spring Boot', 'React', 'SQL', 'Problem Solving'],
      fitScore: 0,
      source: 'Naukri.com',
      url: 'https://naukri.com/jobs/123456'
    },
    {
      id: '2',
      title: 'Data Scientist',
      company: 'Infosys',
      location: 'Hyderabad, Telangana',
      salary: '₹5,00,000 - ₹12,00,000',
      description: 'Work with Infosys AI and automation team to build machine learning models and data-driven solutions for enterprise clients.',
      requirements: ['Python', 'Machine Learning', 'SQL', 'Power BI', 'Statistics'],
      fitScore: 0,
      source: 'LinkedIn India',
      url: 'https://linkedin.com/jobs/789012'
    },
    {
      id: '3',
      title: 'Product Manager',
      company: 'Flipkart',
      location: 'Bangalore, Karnataka',
      salary: '₹15,00,000 - ₹25,00,000',
      description: 'Lead product strategy for Flipkart\'s e-commerce platform. Drive product development from ideation to launch with cross-functional teams.',
      requirements: ['Product Management', 'Analytics', 'Communication', 'Agile', 'Leadership'],
      fitScore: 0,
      source: 'Glassdoor India',
      url: 'https://glassdoor.co.in/jobs/345678'
    },
    {
      id: '4',
      title: 'UI/UX Designer',
      company: 'Zomato',
      location: 'Gurgaon, Haryana',
      salary: '₹6,00,000 - ₹12,00,000',
      description: 'Design delightful user experiences for Zomato\'s food delivery platform. Work on mobile and web applications used by millions of users.',
      requirements: ['Figma', 'User Research', 'Prototyping', 'Design Thinking', 'Mobile Design'],
      fitScore: 0,
      source: 'AngelList India',
      url: 'https://angel.co/jobs/456789'
    },
    {
      id: '5',
      title: 'Digital Marketing Manager',
      company: 'Paytm',
      location: 'Noida, Uttar Pradesh',
      salary: '₹8,00,000 - ₹15,00,000',
      description: 'Drive digital marketing campaigns for Paytm\'s fintech products. Manage performance marketing, social media, and brand campaigns.',
      requirements: ['Digital Marketing', 'Google Ads', 'Facebook Ads', 'Analytics', 'Content Strategy'],
      fitScore: 0,
      source: 'Indeed India',
      url: 'https://indeed.co.in/jobs/567890'
    },
    {
      id: '6',
      title: 'DevOps Engineer',
      company: 'Tech Mahindra',
      location: 'Pune, Maharashtra',
      salary: '₹7,00,000 - ₹14,00,000',
      description: 'Manage cloud infrastructure and CI/CD pipelines for enterprise clients. Work with AWS, Azure, and containerization technologies.',
      requirements: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Linux', 'Python'],
      fitScore: 0,
      source: 'Monster India',
      url: 'https://monsterindia.com/jobs/678901'
    },
    {
      id: '7',
      title: 'Business Analyst',
      company: 'HDFC Bank',
      location: 'Mumbai, Maharashtra',
      salary: '₹4,50,000 - ₹9,00,000',
      description: 'Analyze business requirements for digital banking initiatives. Work on process improvements and system integrations.',
      requirements: ['Business Analysis', 'SQL', 'Excel', 'Banking Domain', 'Communication'],
      fitScore: 0,
      source: 'Naukri.com',
      url: 'https://naukri.com/jobs/789012'
    },
    {
      id: '8',
      title: 'Frontend Developer',
      company: 'Byju\'s',
      location: 'Bangalore, Karnataka',
      salary: '₹5,00,000 - ₹10,00,000',
      description: 'Build interactive learning experiences for Byju\'s EdTech platform. Work on web and mobile applications for K-12 education.',
      requirements: ['React', 'JavaScript', 'TypeScript', 'CSS', 'Mobile Development'],
      fitScore: 0,
      source: 'Freshersworld',
      url: 'https://freshersworld.com/jobs/890123'
    },
    // Government and Banking Jobs
    {
      id: '9',
      title: 'Probationary Officer (PO)',
      company: 'State Bank of India',
      location: 'Multiple Locations',
      salary: '₹4,50,000 - ₹8,00,000',
      description: 'Join SBI as a Probationary Officer. Handle banking operations, customer service, and branch management responsibilities.',
      requirements: ['Banking Knowledge', 'Communication', 'Leadership', 'Customer Service', 'Financial Analysis'],
      fitScore: 0,
      source: 'SBI Careers',
      url: 'https://sbi.co.in/careers/po-recruitment'
    },
    {
      id: '10',
      title: 'Assistant Engineer',
      company: 'Indian Railways',
      location: 'Various States',
      salary: '₹3,50,000 - ₹7,00,000',
      description: 'Work as Assistant Engineer in Indian Railways. Involved in maintenance, operations, and development of railway infrastructure.',
      requirements: ['Engineering Degree', 'Technical Knowledge', 'Problem Solving', 'Project Management'],
      fitScore: 0,
      source: 'RRB Official',
      url: 'https://indianrailways.gov.in/jobs/ae-recruitment'
    },
    // Startup and New-age Companies
    {
      id: '11',
      title: 'Growth Marketing Specialist',
      company: 'Ola',
      location: 'Bangalore, Karnataka',
      salary: '₹6,00,000 - ₹12,00,000',
      description: 'Drive user acquisition and retention for Ola\'s mobility platform. Work on data-driven marketing campaigns and growth experiments.',
      requirements: ['Growth Marketing', 'Analytics', 'A/B Testing', 'SQL', 'Digital Marketing'],
      fitScore: 0,
      source: 'LinkedIn India',
      url: 'https://linkedin.com/jobs/growth-ola'
    },
    {
      id: '12',
      title: 'Content Writer',
      company: 'Unacademy',
      location: 'Remote',
      salary: '₹3,00,000 - ₹6,00,000',
      description: 'Create engaging educational content for Unacademy\'s online learning platform. Write for various competitive exams and academic subjects.',
      requirements: ['Content Writing', 'Research', 'Education Background', 'Communication', 'Subject Expertise'],
      fitScore: 0,
      source: 'InternShala',
      url: 'https://internshala.com/jobs/content-writer-unacademy'
    },
    // Consulting and Finance
    {
      id: '13',
      title: 'Management Trainee',
      company: 'Deloitte India',
      location: 'Mumbai, Maharashtra',
      salary: '₹8,00,000 - ₹15,00,000',
      description: 'Join Deloitte\'s management consulting practice. Work with Fortune 500 clients on strategy, operations, and technology implementations.',
      requirements: ['MBA', 'Consulting', 'Problem Solving', 'Communication', 'Analytics'],
      fitScore: 0,
      source: 'Glassdoor India',
      url: 'https://glassdoor.co.in/jobs/deloitte-mt'
    },
    {
      id: '14',
      title: 'Financial Analyst',
      company: 'ICICI Bank',
      location: 'Chennai, Tamil Nadu',
      salary: '₹4,00,000 - ₹8,50,000',
      description: 'Analyze financial data and market trends for ICICI Bank\'s corporate banking division. Support loan processing and risk assessment.',
      requirements: ['Finance', 'Excel', 'Financial Modeling', 'Banking', 'Risk Analysis'],
      fitScore: 0,
      source: 'Naukri.com',
      url: 'https://naukri.com/jobs/icici-financial-analyst'
    },
    // Entry-level and Internship opportunities
    {
      id: '15',
      title: 'Management Trainee - Sales',
      company: 'Asian Paints',
      location: 'Mumbai, Maharashtra',
      salary: '₹3,50,000 - ₹6,00,000',
      description: 'Start your career in sales with Asian Paints. Comprehensive training program covering sales, marketing, and business development.',
      requirements: ['MBA/B.Tech', 'Communication', 'Sales Aptitude', 'Leadership Potential', 'Market Research'],
      fitScore: 0,
      source: 'Company Website',
      url: 'https://asianpaints.com/careers/mt-sales'
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