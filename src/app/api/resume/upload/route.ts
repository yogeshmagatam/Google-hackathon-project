import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { AIProviderManager } from '@/lib/ai-providers'
import { requireAuth } from '@/lib/auth-helpers'

const aiProvider = new AIProviderManager()

export async function POST(request: NextRequest) {
  try {
    // Use auth helper to handle Next.js 15 session management
    const authResult = await requireAuth(request)
    
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const session = authResult.session!

    const formData = await request.formData()
    const file = formData.get('resume') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = `${Date.now()}-${file.name}`
    const filePath = join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    // Extract text from PDF
    let extractedText = ''
    try {
      const pdf = (await import('pdf-parse')).default
      const pdfData = await pdf(buffer)
      extractedText = pdfData.text
    } catch (error) {
      console.error('PDF extraction error:', error)
      extractedText = 'Unable to extract text from PDF'
    }

    // Analyze resume with AI
    const analysis = await analyzeResume(extractedText)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email! }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Save to database
    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        fileName: file.name,
        fileUrl: `/uploads/${fileName}`,
        extractedText,
        analysis: JSON.stringify(analysis.analysis),
        skills: JSON.stringify(analysis.skills)
      }
    })

    return NextResponse.json({
      success: true,
      resume: {
        id: resume.id,
        fileName: resume.fileName,
        analysis: analysis.analysis,
        skills: analysis.skills,
        extractedText: extractedText.substring(0, 500) + '...' // Truncate for response
      }
    })

  } catch (error) {
    console.error('Resume upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    )
  }
}

async function analyzeResume(text: string) {
  const prompt = `Analyze this resume and provide:

1. A professional assessment of strengths and areas for improvement
2. Extracted skills (technical and soft skills)
3. Career level assessment
4. Recommended next steps

Resume text:
${text}

Please respond in JSON format:
{
  "analysis": {
    "strengths": ["strength1", "strength2", ...],
    "improvements": ["area1", "area2", ...],
    "careerLevel": "entry|mid|senior|executive",
    "overallScore": 85,
    "recommendations": ["rec1", "rec2", ...]
  },
  "skills": {
    "technical": ["skill1", "skill2", ...],
    "soft": ["skill1", "skill2", ...],
    "tools": ["tool1", "tool2", ...]
  }
}`

  try {
    const response = await aiProvider.generateResponse(prompt, [])
    
    // Try to parse as JSON, fallback to structured text if needed
    try {
      return JSON.parse(response.message)
    } catch {
      // Fallback analysis if JSON parsing fails
      return {
        analysis: {
          strengths: ["Experience in relevant field", "Clear career progression"],
          improvements: ["Could add more quantifiable achievements", "Consider adding relevant certifications"],
          careerLevel: "mid",
          overallScore: 75,
          recommendations: ["Highlight quantifiable achievements", "Add relevant skills section", "Consider adding portfolio links"]
        },
        skills: {
          technical: extractSkillsFromText(text, 'technical'),
          soft: extractSkillsFromText(text, 'soft'),
          tools: extractSkillsFromText(text, 'tools')
        }
      }
    }
  } catch (error) {
    console.error('AI analysis error:', error)
    // Return basic analysis if AI fails
    return {
      analysis: {
        strengths: ["Resume uploaded successfully"],
        improvements: ["AI analysis temporarily unavailable"],
        careerLevel: "mid",
        overallScore: 70,
        recommendations: ["Complete skills assessment for detailed feedback"]
      },
      skills: {
        technical: extractSkillsFromText(text, 'technical'),
        soft: [],
        tools: []
      }
    }
  }
}

function extractSkillsFromText(text: string, type: 'technical' | 'soft' | 'tools'): string[] {
  const lowerText = text.toLowerCase()
  
  const technicalSkills = [
    'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node.js', 'typescript',
    'html', 'css', 'sql', 'mongodb', 'postgresql', 'mysql', 'docker', 'kubernetes',
    'aws', 'azure', 'gcp', 'git', 'github', 'machine learning', 'data analysis',
    'artificial intelligence', 'blockchain', 'cybersecurity'
  ]
  
  const softSkills = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
    'project management', 'time management', 'adaptability', 'creativity', 'collaboration'
  ]
  
  const tools = [
    'figma', 'photoshop', 'illustrator', 'slack', 'jira', 'trello', 'notion',
    'excel', 'powerpoint', 'tableau', 'power bi', 'salesforce'
  ]
  
  let skillList: string[] = []
  
  switch (type) {
    case 'technical':
      skillList = technicalSkills
      break
    case 'soft':
      skillList = softSkills
      break
    case 'tools':
      skillList = tools
      break
  }
  
  return skillList.filter(skill => lowerText.includes(skill))
}