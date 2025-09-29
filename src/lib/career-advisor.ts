interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

import { 
  indianEducationSystem, 
  indianJobMarket, 
  governmentJobs, 
  indianSkillsFramework, 
  studentCareerGuidance 
} from './indian-career-context';

// Career knowledge base and assessment logic with Indian context
const careerKnowledgeBase = {
  // Enhanced industries with Indian context
  industries: [
    {
      name: 'Technology (IT Services)',
      roles: ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'DevOps Engineer', 'Tech Lead'],
      skills: ['Java', 'Python', 'JavaScript', 'React', 'AWS', 'Problem Solving', 'Communication'],
      trends: ['AI/ML', 'Cloud Computing', 'Cybersecurity', 'Blockchain', 'IoT'],
      indianCompanies: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Flipkart', 'Zomato'],
      salaryRange: '₹3-50 LPA',
      jobHubs: ['Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Delhi NCR']
    },
    {
      name: 'Banking & Finance',
      roles: ['Financial Analyst', 'Investment Banker', 'Risk Manager', 'Relationship Manager', 'Credit Analyst'],
      skills: ['Financial Analysis', 'Excel', 'Risk Assessment', 'Communication', 'Regulatory Knowledge'],
      trends: ['Digital Banking', 'FinTech', 'UPI', 'Cryptocurrency Regulation', 'Open Banking'],
      indianCompanies: ['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra'],
      salaryRange: '₹2.5-40 LPA',
      jobHubs: ['Mumbai', 'Delhi NCR', 'Bangalore', 'Chennai']
    },
    {
      name: 'Government & Civil Services',
      roles: ['IAS Officer', 'IPS Officer', 'Bank PO', 'Railway Officer', 'Defence Officer'],
      skills: ['General Knowledge', 'Current Affairs', 'Leadership', 'Public Policy', 'Communication'],
      trends: ['Digital Governance', 'Policy Implementation', 'Rural Development', 'Smart Cities'],
      examPathway: ['UPSC CSE', 'IBPS', 'SSC', 'RRB', 'State PSC'],
      salaryRange: '₹2-25 LPA',
      jobSecurity: 'Very High'
    },
    {
      name: 'Healthcare & Medical',
      roles: ['Doctor', 'Nurse', 'Medical Researcher', 'Hospital Administrator', 'Public Health Officer'],
      skills: ['Medical Knowledge', 'Empathy', 'Critical Thinking', 'Communication', 'Stress Management'],
      trends: ['Telemedicine', 'Digital Health', 'Preventive Care', 'Medical AI', 'Rural Healthcare'],
      indianContext: ['AIIMS', 'Government Hospitals', 'Private Healthcare', 'Medical Tourism'],
      salaryRange: '₹3-100 LPA',
      jobHubs: ['All major cities', 'Rural areas with government schemes']
    },
    {
      name: 'Education & EdTech',
      roles: ['Teacher', 'Professor', 'Content Developer', 'Educational Consultant', 'Training Manager'],
      skills: ['Subject Expertise', 'Communication', 'Technology', 'Patience', 'Innovation'],
      trends: ['Online Learning', 'EdTech', 'Skill-based Education', 'Vernacular Content'],
      indianCompanies: ['Byju\'s', 'Unacademy', 'Vedantu', 'WhiteHat Jr', 'Toppr'],
      salaryRange: '₹2-30 LPA',
      jobHubs: ['All cities', 'Remote opportunities']
    }
  ],
  
  // Enhanced skill categories with Indian market focus
  skillCategories: {
    technical: ['Java', 'Python', 'JavaScript', 'React', 'Angular', 'Node.js', 'AWS', 'Azure', 'SQL', 'Power BI'],
    soft: ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Adaptability', 'Time Management'],
    analytical: ['Critical Thinking', 'Research', 'Financial Analysis', 'Data Analytics', 'Business Intelligence'],
    creative: ['Content Creation', 'Graphic Design', 'UI/UX Design', 'Video Editing', 'Digital Marketing'],
    indianSpecific: ['Hindi Communication', 'Regional Languages', 'Indian Business Context', 'GST Knowledge', 'Tally']
  },

  // Indian education streams and career mapping
  educationStreams: {
    'Science (PCM)': {
      topCareers: ['Software Engineer', 'Data Scientist', 'Product Manager', 'Research Scientist'],
      entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE'],
      colleges: ['IIT', 'NIT', 'IIIT', 'BITS'],
      averagePackage: '₹8-25 LPA'
    },
    'Science (PCB)': {
      topCareers: ['Doctor', 'Medical Researcher', 'Biotechnology', 'Pharmaceutical'],
      entranceExams: ['NEET', 'AIIMS', 'JIPMER'],
      colleges: ['AIIMS', 'CMC', 'JIPMER', 'Government Medical Colleges'],
      averagePackage: '₹5-50 LPA'
    },
    'Commerce': {
      topCareers: ['CA', 'Investment Banking', 'Financial Analyst', 'Business Analyst', 'MBA'],
      entranceExams: ['CA Foundation', 'CAT', 'XAT', 'CMAT'],
      colleges: ['IIM', 'XLRI', 'FMS', 'SRCC', 'LSR'],
      averagePackage: '₹6-40 LPA'
    },
    'Arts/Humanities': {
      topCareers: ['Civil Services', 'Journalism', 'Teaching', 'Content Writing', 'Social Work'],
      entranceExams: ['UPSC CSE', 'CLAT', 'JNU Entrance', 'BHU UET'],
      colleges: ['JNU', 'BHU', 'DU', 'AMU'],
      averagePackage: '₹3-20 LPA'
    }
  },
  
  careerStages: {
    'entry-level': {
      focus: ['Skill Building', 'Networking', 'Learning', 'Finding Mentors'],
      challenges: ['Lack of Experience', 'Competition', 'Uncertainty about Direction']
    },
    'mid-career': {
      focus: ['Specialization', 'Leadership Development', 'Career Advancement', 'Work-Life Balance'],
      challenges: ['Career Plateau', 'Skill Obsolescence', 'Increasing Responsibilities']
    },
    'senior-level': {
      focus: ['Strategic Leadership', 'Mentoring Others', 'Industry Expertise', 'Legacy Building'],
      challenges: ['Staying Current', 'Managing Teams', 'Industry Disruption']
    },
    'career-change': {
      focus: ['Transferable Skills', 'Retraining', 'Networking', 'Industry Research'],
      challenges: ['Starting Over', 'Salary Reduction', 'Age Discrimination', 'Skill Gaps']
    }
  }
};

// Enhanced AI response generation with career expertise
export async function generateCareerAdvice(userMessage: string, conversationHistory: Message[]): Promise<string> {
  // Analyze the user's message for career-related keywords and intent
  const intent = analyzeIntent(userMessage);
  const context = analyzeConversationContext(conversationHistory);
  
  // Generate appropriate response based on intent and context
  switch (intent.type) {
    case 'student_guidance':
      return generateStudentGuidance(userMessage, intent.details);
    case 'career_change':
      return generateCareerChangeAdvice(userMessage, intent.details);
    case 'skills_assessment':
      return generateSkillsAssessment(userMessage, intent.details);
    case 'industry_inquiry':
      return generateIndustryInsights(userMessage, intent.details);
    case 'government_jobs':
      return generateGovernmentJobGuidance(userMessage, intent.details);
    case 'general_career':
      return generateGeneralCareerAdvice(userMessage, context);
    default:
      return generateDefaultResponse(userMessage);
  }
}

function analyzeIntent(message: string): { type: string; details: any } {
  const lowerMessage = message.toLowerCase();
  
  // Student-specific indicators (high priority for Indian students)
  if (lowerMessage.includes('student') || lowerMessage.includes('12th') || lowerMessage.includes('class 12') ||
      lowerMessage.includes('graduation') || lowerMessage.includes('college') || lowerMessage.includes('university') ||
      lowerMessage.includes('entrance exam') || lowerMessage.includes('jee') || lowerMessage.includes('neet') ||
      lowerMessage.includes('placement') || lowerMessage.includes('campus') || lowerMessage.includes('internship')) {
    return { type: 'student_guidance', details: extractStudentContext(message) };
  }
  
  // Career change indicators
  if (lowerMessage.includes('career change') || lowerMessage.includes('switch career') || 
      lowerMessage.includes('new career') || lowerMessage.includes('different field')) {
    return { type: 'career_change', details: extractCareerChangeDetails(message) };
  }
  
  // Skills assessment indicators
  if (lowerMessage.includes('skills') && (lowerMessage.includes('assess') || lowerMessage.includes('evaluate') || 
      lowerMessage.includes('what skills') || lowerMessage.includes('my strengths'))) {
    return { type: 'skills_assessment', details: extractSkillsContext(message) };
  }
  
  // Industry inquiry indicators
  if (lowerMessage.includes('industry') || lowerMessage.includes('sector') || 
      lowerMessage.includes('field') || lowerMessage.includes('trends')) {
    return { type: 'industry_inquiry', details: extractIndustryContext(message) };
  }
  
  // Indian government job inquiry
  if (lowerMessage.includes('government job') || lowerMessage.includes('upsc') || lowerMessage.includes('civil service') ||
      lowerMessage.includes('bank po') || lowerMessage.includes('ssc') || lowerMessage.includes('railway')) {
    return { type: 'government_jobs', details: extractGovernmentJobContext(message) };
  }
  
  // General career advice
  if (lowerMessage.includes('career') || lowerMessage.includes('job') || 
      lowerMessage.includes('work') || lowerMessage.includes('professional')) {
    return { type: 'general_career', details: null };
  }
  
  return { type: 'general', details: null };
}

function analyzeConversationContext(history: Message[]): any {
  // Analyze conversation history for context
  const userMessages = history.filter(msg => msg.sender === 'user');
  const recentMessages = userMessages.slice(-3); // Last 3 user messages
  
  return {
    previousTopics: recentMessages.map(msg => analyzeIntent(msg.text).type),
    conversationLength: history.length,
    hasDiscussedCareer: userMessages.some(msg => msg.text.toLowerCase().includes('career')),
  };
}

function extractCareerChangeDetails(message: string): any {
  const currentFieldMatch = message.match(/(?:from|currently in|working in|in the)\s+([a-zA-Z\s]+?)(?:\s+(?:to|field|industry|sector)|$)/i);
  const targetFieldMatch = message.match(/(?:to|into|towards)\s+([a-zA-Z\s]+?)(?:\s+(?:field|industry|sector)|$)/i);
  
  return {
    currentField: currentFieldMatch ? currentFieldMatch[1].trim() : null,
    targetField: targetFieldMatch ? targetFieldMatch[1].trim() : null,
  };
}

function extractSkillsContext(message: string): any {
  const skills: string[] = [];
  const lowerMessage = message.toLowerCase();
  
  // Look for mentioned skills
  Object.values(careerKnowledgeBase.skillCategories).flat().forEach(skill => {
    if (lowerMessage.includes(skill.toLowerCase())) {
      skills.push(skill);
    }
  });
  
  return { mentionedSkills: skills };
}

function extractIndustryContext(message: string): any {
  const industries = careerKnowledgeBase.industries.map(ind => ind.name);
  const mentionedIndustry = industries.find(industry => 
    message.toLowerCase().includes(industry.toLowerCase())
  );
  
  return { industry: mentionedIndustry };
}

function extractStudentContext(message: string): any {
  const lowerMessage = message.toLowerCase();
  
  let stage = 'general';
  let stream = null;
  let examMentioned = null;
  
  // Detect student stage
  if (lowerMessage.includes('12th') || lowerMessage.includes('class 12') || lowerMessage.includes('board')) {
    stage = '12th';
  } else if (lowerMessage.includes('final year') || lowerMessage.includes('placement') || lowerMessage.includes('campus')) {
    stage = 'graduation';
  } else if (lowerMessage.includes('entrance') || lowerMessage.includes('jee') || lowerMessage.includes('neet')) {
    stage = 'entrance';
  }
  
  // Detect stream
  if (lowerMessage.includes('science') || lowerMessage.includes('pcm') || lowerMessage.includes('pcb')) {
    stream = 'science';
  } else if (lowerMessage.includes('commerce') || lowerMessage.includes('business')) {
    stream = 'commerce';
  } else if (lowerMessage.includes('arts') || lowerMessage.includes('humanities')) {
    stream = 'arts';
  }
  
  // Detect specific exams
  if (lowerMessage.includes('jee')) examMentioned = 'JEE';
  else if (lowerMessage.includes('neet')) examMentioned = 'NEET';
  else if (lowerMessage.includes('cat')) examMentioned = 'CAT';
  else if (lowerMessage.includes('upsc')) examMentioned = 'UPSC';
  
  return { stage, stream, examMentioned };
}

function extractGovernmentJobContext(message: string): any {
  const lowerMessage = message.toLowerCase();
  
  let jobType = 'general';
  let examMentioned = null;
  
  if (lowerMessage.includes('upsc') || lowerMessage.includes('ias') || lowerMessage.includes('ips')) {
    jobType = 'civil_services';
    examMentioned = 'UPSC CSE';
  } else if (lowerMessage.includes('bank') || lowerMessage.includes('ibps') || lowerMessage.includes('sbi')) {
    jobType = 'banking';
    examMentioned = 'IBPS';
  } else if (lowerMessage.includes('railway') || lowerMessage.includes('rrb')) {
    jobType = 'railway';
    examMentioned = 'RRB';
  } else if (lowerMessage.includes('ssc')) {
    jobType = 'ssc';
    examMentioned = 'SSC';
  }
  
  return { jobType, examMentioned };
}

function generateCareerChangeAdvice(message: string, details: any): string {
  const { currentField, targetField } = details;
  
  let advice = "# 🔄 Career Change Guidance for Indian Professionals\\n\\n";
  
  if (currentField && targetField) {
    advice += `Great! You're considering transitioning from **${currentField}** to **${targetField}**. Here's a strategic approach tailored for the Indian job market:\\n\\n`;
  } else {
    advice += "I understand you're considering a career change. Here's a comprehensive guide specifically designed for Indian professionals:\\n\\n";
  }
  
  advice += `## 🎯 Step-by-Step Career Transition Plan\\n\\n`;
  advice += `### 1. **Self-Assessment**\\n`;
  advice += `• Identify your transferable skills\\n`;
  advice += `• Clarify your values and motivations\\n`;
  advice += `• Assess your financial readiness (consider family responsibilities)\\n`;
  advice += `• Consider your risk tolerance and job market conditions\\n\\n`;
  
  advice += `### 2. **Indian Market Research**\\n`;
  advice += `• Research industry growth in major Indian cities\\n`;
  advice += `• Connect with professionals on LinkedIn India\\n`;
  advice += `• Attend industry meetups in Bangalore, Mumbai, Delhi, Hyderabad\\n`;
  advice += `• Check salary trends on Glassdoor India and Naukri.com\\n\\n`;
  
  advice += `### 3. **Skill Development (India-Focused)**\\n`;
  advice += `• Enroll in courses from Indian EdTech platforms (Unacademy, BYJU's)\\n`;
  advice += `• Get relevant certifications (AWS, Google Cloud for tech roles)\\n`;
  advice += `• Join professional communities and WhatsApp groups\\n`;
  advice += `• Consider part-time courses from IITs/IIMs (online programs)\\n\\n`;
  
  advice += `### 4. **Strategic Networking in India**\\n`;
  advice += `• Optimize your Naukri.com and LinkedIn profiles\\n`;
  advice += `• Join industry-specific associations\\n`;
  advice += `• Attend conferences in major tech hubs\\n`;
  advice += `• Connect with alumni from your college\\n\\n`;
  
  if (targetField) {
    const industry = careerKnowledgeBase.industries.find(ind => 
      ind.name.toLowerCase().includes(targetField.toLowerCase())
    );
    
    if (industry) {
      advice += `## 🏢 ${industry.name} in India\\n\\n`;
      advice += `**Key Roles:** ${industry.roles.join(', ')}\\n\\n`;
      advice += `**Essential Skills:** ${industry.skills.join(', ')}\\n\\n`;
      advice += `**Current Trends:** ${industry.trends.join(', ')}\\n\\n`;
      if (industry.indianCompanies) {
        advice += `**Top Indian Companies:** ${industry.indianCompanies.join(', ')}\\n\\n`;
      }
      if (industry.salaryRange) {
        advice += `**Salary Range:** ${industry.salaryRange}\\n\\n`;
      }
      if (industry.jobHubs) {
        advice += `**Job Hubs:** ${industry.jobHubs.join(', ')}\\n\\n`;
      }
    }
  }
  
  advice += `## 📈 Next Steps (Indian Context)\\n`;
  advice += `1. **This Week:** Complete a skills inventory and research companies on Glassdoor India\\n`;
  advice += `2. **This Month:** Apply to 5-10 relevant positions on Naukri.com and LinkedIn\\n`;
  advice += `3. **Next 3 Months:** Start skill development and network with industry professionals\\n\\n`;
  
  advice += `## 🇮🇳 India-Specific Considerations\\n`;
  advice += `• **Notice Period:** Plan for 1-3 months notice period with current employer\\n`;
  advice += `• **Family Support:** Discuss career change with family members\\n`;
  advice += `• **Location:** Consider if you're willing to relocate to job hubs\\n`;
  advice += `• **Government Jobs:** Consider PSU and government opportunities for job security\\n\\n`;
  
  advice += `💡 **Pro Tip:** In India, employee referrals are very powerful. Focus on building relationships within your target industry.\\n\\n`;
  advice += `Would you like specific guidance for your educational background or target city?`;
  
  return advice;
}

// New function for Indian student guidance
function generateStudentGuidance(message: string, details: any): string {
  let guidance = "# 🎓 Career Guidance for Indian Students\\n\\n";
  
  const lowerMessage = message.toLowerCase();
  
  // Detect student stage
  let studentStage = 'general';
  if (lowerMessage.includes('12th') || lowerMessage.includes('class 12') || lowerMessage.includes('board exam')) {
    studentStage = '12th';
  } else if (lowerMessage.includes('graduation') || lowerMessage.includes('final year') || lowerMessage.includes('campus placement')) {
    studentStage = 'graduation';
  } else if (lowerMessage.includes('entrance') || lowerMessage.includes('jee') || lowerMessage.includes('neet')) {
    studentStage = 'entrance';
  }
  
  switch (studentStage) {
    case '12th':
      return generateClass12Guidance(message);
    case 'graduation':
      return generateGraduationGuidance(message);
    case 'entrance':
      return generateEntranceExamGuidance(message);
    default:
      return generateGeneralStudentGuidance(message);
  }
}

function generateClass12Guidance(message: string): string {
  let guidance = "# 🎓 Class 12th Career Guidance\\n\\n";
  
  guidance += "Congratulations on reaching this crucial milestone! Here's your comprehensive career roadmap:\\n\\n";
  
  guidance += "## 📚 Stream-wise Career Options\\n\\n";
  
  // Science stream guidance
  guidance += "### 🔬 **Science Stream (PCM/PCB)**\\n";
  guidance += "**Engineering (PCM):**\\n";
  guidance += "• **Top Exams:** JEE Main, JEE Advanced, BITSAT, State CETs\\n";
  guidance += "• **Target Colleges:** IITs, NITs, IIITs, BITS, State Engineering Colleges\\n";
  guidance += "• **Career Prospects:** Software Engineer (₹3-25 LPA), Data Scientist (₹5-30 LPA)\\n";
  guidance += "• **Preparation:** Focus on Physics, Chemistry, Mathematics\\n\\n";
  
  guidance += "**Medical (PCB):**\\n";
  guidance += "• **Top Exams:** NEET, AIIMS, JIPMER\\n";
  guidance += "• **Target Colleges:** AIIMS, Government Medical Colleges, Private Medical Colleges\\n";
  guidance += "• **Career Prospects:** Doctor (₹5-100 LPA), Medical Researcher (₹4-20 LPA)\\n";
  guidance += "• **Preparation:** Focus on Biology, Chemistry, Physics\\n\\n";
  
  // Commerce stream guidance
  guidance += "### 💼 **Commerce Stream**\\n";
  guidance += "• **Popular Courses:** B.Com, BBA, CA, CS, CMA\\n";
  guidance += "• **Entrance Exams:** CAT, XAT, CMAT for MBA\\n";
  guidance += "• **Career Options:** Chartered Accountant (₹3-50 LPA), Investment Banking (₹8-40 LPA)\\n";
  guidance += "• **Target Colleges:** SRCC, LSR, IIM (for MBA)\\n\\n";
  
  // Arts stream guidance
  guidance += "### 🎨 **Arts/Humanities Stream**\\n";
  guidance += "• **Popular Courses:** BA, Journalism, Psychology, Political Science\\n";
  guidance += "• **Career Options:** Civil Services (₹7-25 LPA), Journalism (₹3-15 LPA)\\n";
  guidance += "• **Entrance Exams:** UPSC CSE, CLAT, JNU Entrance\\n";
  guidance += "• **Target Colleges:** JNU, DU, BHU\\n\\n";
  
  guidance += "## 🎯 Action Plan for Next 6 Months\\n";
  guidance += "1. **Research thoroughly** - Explore career options in your stream\\n";
  guidance += "2. **Entrance exam prep** - Join coaching or online courses\\n";
  guidance += "3. **College applications** - Research and apply to target colleges\\n";
  guidance += "4. **Skill development** - Start learning relevant skills early\\n";
  guidance += "5. **Networking** - Connect with seniors and professionals\\n\\n";
  
  guidance += "## 💡 Pro Tips for Indian Students\\n";
  guidance += "• **Backup options:** Always have multiple career paths planned\\n";
  guidance += "• **Government jobs:** Consider PSU and government opportunities\\n";
  guidance += "• **Location factors:** Decide if you're willing to study/work in different cities\\n";
  guidance += "• **Family discussion:** Involve parents in career decision making\\n\\n";
  
  guidance += "What specific stream or entrance exam would you like detailed guidance on?";
  
  return guidance;
}

function generateGraduationGuidance(message: string): string {
  let guidance = "# 🎓 Final Year Student Career Guidance\\n\\n";
  
  guidance += "You're in the final stretch! Here's your comprehensive placement and career strategy:\\n\\n";
  
  guidance += "## 💼 Campus Placement Strategy\\n\\n";
  guidance += "### **Resume Building**\\n";
  guidance += "• **Technical Skills:** List programming languages, tools, frameworks\\n";
  guidance += "• **Projects:** Include 2-3 significant projects with GitHub links\\n";
  guidance += "• **Internships:** Highlight summer internships and learnings\\n";
  guidance += "• **Achievements:** Academic awards, certifications, competitions\\n";
  guidance += "• **Format:** Keep it to 1-page, ATS-friendly format\\n\\n";
  
  guidance += "### **Interview Preparation**\\n";
  guidance += "• **Technical rounds:** Practice coding problems on LeetCode, HackerRank\\n";
  guidance += "• **HR rounds:** Prepare for behavioral questions\\n";
  guidance += "• **Group discussions:** Practice current affairs and communication\\n";
  guidance += "• **Company research:** Know about companies visiting your campus\\n\\n";
  
  guidance += "## 🏢 Top Recruiting Companies in India\\n\\n";
  guidance += "**Technology:**\\n";
  guidance += "• **Service-based:** TCS (₹3.5 LPA), Infosys (₹3.6 LPA), Wipro (₹3.5 LPA)\\n";
  guidance += "• **Product-based:** Microsoft (₹25-40 LPA), Google (₹30-50 LPA), Amazon (₹25-45 LPA)\\n";
  guidance += "• **Startups:** Flipkart (₹8-15 LPA), Zomato (₹6-12 LPA), Paytm (₹7-14 LPA)\\n\\n";
  
  guidance += "**Finance:**\\n";
  guidance += "• **Banks:** HDFC Bank (₹4-8 LPA), ICICI Bank (₹4-7 LPA)\\n";
  guidance += "• **Investment Banking:** Goldman Sachs (₹15-25 LPA), JP Morgan (₹12-20 LPA)\\n\\n";
  
  guidance += "**Consulting:**\\n";
  guidance += "• **Top Tier:** McKinsey (₹25-35 LPA), BCG (₹25-35 LPA), Bain (₹25-35 LPA)\\n";
  guidance += "• **Big 4:** Deloitte (₹6-12 LPA), PwC (₹5-10 LPA), EY (₹5-10 LPA)\\n\\n";
  
  guidance += "## 🚀 Alternative Career Paths\\n\\n";
  guidance += "### **Higher Studies**\\n";
  guidance += "• **MBA:** CAT, XAT, GMAT for IIMs and top B-schools\\n";
  guidance += "• **MS Abroad:** GRE/GMAT for US, IELTS for other countries\\n";
  guidance += "• **Research:** GATE for M.Tech, NET for PhD\\n\\n";
  
  guidance += "### **Entrepreneurship**\\n";
  guidance += "• **Startup ecosystem:** Bangalore, Mumbai, Delhi NCR\\n";
  guidance += "• **Government support:** Startup India, MSME schemes\\n";
  guidance += "• **Incubators:** T-Hub, NASSCOM, IIT incubators\\n\\n";
  
  guidance += "### **Government Jobs**\\n";
  guidance += "• **UPSC:** IAS, IPS, IFS (application starts in February)\\n";
  guidance += "• **Banking:** IBPS PO, SBI PO, RBI Grade B\\n";
  guidance += "• **PSUs:** Through GATE scores or direct recruitment\\n\\n";
  
  guidance += "## 📅 Timeline for Final Year Students\\n";
  guidance += "**July-September:** Resume building, skill development\\n";
  guidance += "**October-December:** Campus placements, interview prep\\n";
  guidance += "**January-March:** Off-campus applications, backup planning\\n";
  guidance += "**April-June:** Final preparations, joining preparations\\n\\n";
  
  guidance += "What specific area would you like detailed guidance on - placements, higher studies, or government jobs?";
  
  return guidance;
}

function generateEntranceExamGuidance(message: string): string {
  let guidance = "# 📝 Entrance Exam Guidance for Indian Students\\n\\n";
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('jee')) {
    return generateJEEGuidance();
  } else if (lowerMessage.includes('neet')) {
    return generateNEETGuidance();
  } else if (lowerMessage.includes('cat') || lowerMessage.includes('mba')) {
    return generateCATGuidance();
  } else if (lowerMessage.includes('upsc')) {
    return generateUPSCGuidance();
  } else {
    return generateGeneralEntranceGuidance();
  }
}

function generateJEEGuidance(): string {
  let guidance = "# 🎯 JEE Preparation Strategy\\n\\n";
  
  guidance += "## 📚 JEE Main & Advanced Overview\\n\\n";
  guidance += "**JEE Main:**\\n";
  guidance += "• **Attempts:** 2 per year (January & April)\\n";
  guidance += "• **Subjects:** Physics, Chemistry, Mathematics\\n";
  guidance += "• **Duration:** 3 hours\\n";
  guidance += "• **Total Marks:** 300 (100 each subject)\\n";
  guidance += "• **Qualifying colleges:** NITs, IIITs, CFTIs\\n\\n";
  
  guidance += "**JEE Advanced:**\\n";
  guidance += "• **Eligibility:** Top 2.5 lakh JEE Main qualifiers\\n";
  guidance += "• **Attempts:** Maximum 2 in consecutive years\\n";
  guidance += "• **Target:** IIT admission\\n";
  guidance += "• **Difficulty:** Very high\\n\\n";
  
  guidance += "## 📈 Preparation Strategy\\n\\n";
  guidance += "### **Subject-wise Approach**\\n";
  guidance += "**Physics:**\\n";
  guidance += "• Focus on conceptual understanding\\n";
  guidance += "• Practice numerical problems daily\\n";
  guidance += "• Important topics: Mechanics, Electromagnetism, Modern Physics\\n\\n";
  
  guidance += "**Chemistry:**\\n";
  guidance += "• Organic: Learn reactions and mechanisms\\n";
  guidance += "• Inorganic: Memorize facts and properties\\n";
  guidance += "• Physical: Focus on numerical problems\\n\\n";
  
  guidance += "**Mathematics:**\\n";
  guidance += "• Practice variety of problems\\n";
  guidance += "• Important topics: Calculus, Algebra, Coordinate Geometry\\n";
  guidance += "• Speed and accuracy are crucial\\n\\n";
  
  guidance += "## 🏫 Top Coaching Institutes\\n";
  guidance += "• **FIITJEE:** Comprehensive programs\\n";
  guidance += "• **Allen:** Strong faculty and results\\n";
  guidance += "• **Resonance:** Good study material\\n";
  guidance += "• **Unacademy:** Online platform with top educators\\n";
  guidance += "• **BYJU's:** Comprehensive online preparation\\n\\n";
  
  guidance += "## 🎯 Target Colleges & Expected Cutoffs\\n";
  guidance += "**IITs (JEE Advanced required):**\\n";
  guidance += "• IIT Bombay, Delhi, Madras: Rank under 500\\n";
  guidance += "• IIT Kanpur, Kharagpur, Roorkee: Rank under 1500\\n";
  guidance += "• New IITs: Rank under 5000\\n\\n";
  
  guidance += "**NITs (JEE Main):**\\n";
  guidance += "• NIT Trichy, Warangal, Surathkal: 99+ percentile\\n";
  guidance += "• Other top NITs: 95+ percentile\\n";
  guidance += "• Home state advantage available\\n\\n";
  
  guidance += "## 📅 Preparation Timeline\\n";
  guidance += "**11th Standard:** Build strong foundation\\n";
  guidance += "**12th Standard:** Intensive preparation and practice\\n";
  guidance += "**Last 3 months:** Mock tests and revision\\n";
  guidance += "**Last month:** Final revision and stress management\\n\\n";
  
  guidance += "## 💡 Success Tips\\n";
  guidance += "• **Consistency:** Study 6-8 hours daily\\n";
  guidance += "• **Mock tests:** Take regular tests to assess preparation\\n";
  guidance += "• **Doubt clearing:** Don't let doubts accumulate\\n";
  guidance += "• **Health:** Maintain physical and mental health\\n";
  guidance += "• **Backup plans:** Keep other options open\\n\\n";
  
  guidance += "Would you like detailed guidance on any specific subject or preparation strategy?";
  
  return guidance;
}

function generateNEETGuidance(): string {
  let guidance = "# 🏥 NEET Preparation Strategy\\n\\n";
  
  guidance += "## 📚 NEET Overview\\n\\n";
  guidance += "• **Full Name:** National Eligibility cum Entrance Test\\n";
  guidance += "• **Subjects:** Physics, Chemistry, Biology (Botany + Zoology)\\n";
  guidance += "• **Duration:** 3 hours\\n";
  guidance += "• **Total Questions:** 200 (50 each subject, 45 to attempt)\\n";
  guidance += "• **Marking:** +4 for correct, -1 for incorrect\\n";
  guidance += "• **Target:** All medical colleges in India\\n\\n";
  
  guidance += "## 📈 Preparation Strategy\\n\\n";
  guidance += "**Biology (50% weightage):**\\n";
  guidance += "• Most scoring subject, focus heavily here\\n";
  guidance += "• NCERT is the bible - read multiple times\\n";
  guidance += "• Important topics: Human Physiology, Plant Physiology, Genetics\\n\\n";
  
  guidance += "**Chemistry:**\\n";
  guidance += "• Organic: Focus on reactions and name reactions\\n";
  guidance += "• Inorganic: NCERT + additional reference for facts\\n";
  guidance += "• Physical: Numerical practice essential\\n\\n";
  
  guidance += "**Physics:**\\n";
  guidance += "• Often the most challenging for biology students\\n";
  guidance += "• Focus on class 11 topics (higher weightage)\\n";
  guidance += "• Important: Mechanics, Optics, Modern Physics\\n\\n";
  
  guidance += "## 🎯 Target Colleges & Cutoffs\\n";
  guidance += "• **AIIMS Delhi:** 720+ marks\\n";
  guidance += "• **AIIMS other locations:** 700+ marks\\n";
  guidance += "• **Government Medical Colleges:** 600+ marks\\n";
  guidance += "• **Private Medical Colleges:** 550+ marks\\n\\n";
  
  guidance += "## 💡 Success Tips\\n";
  guidance += "• **NCERT First:** Master NCERT before reference books\\n";
  guidance += "• **Regular revision:** Biology requires constant revision\\n";
  guidance += "• **Mock tests:** Essential for time management\\n";
  guidance += "• **Stay healthy:** Medical aspirants often neglect health\\n\\n";
  
  return guidance;
}

function generateCATGuidance(): string {
  let guidance = "# 📊 CAT Preparation Strategy\\n\\n";
  
  guidance += "## 📚 CAT Overview\\n\\n";
  guidance += "• **Full Name:** Common Admission Test\\n";
  guidance += "• **Conducted by:** IIMs (rotational basis)\\n";
  guidance += "• **Sections:** Verbal Ability, Data Interpretation & Logical Reasoning, Quantitative Ability\\n";
  guidance += "• **Duration:** 2 hours (40 minutes per section)\\n";
  guidance += "• **Target:** IIMs and 1000+ MBA colleges\\n\\n";
  
  guidance += "## 📈 Section-wise Strategy\\n\\n";
  guidance += "**Verbal Ability & Reading Comprehension:**\\n";
  guidance += "• Reading habit is crucial - start early\\n";
  guidance += "• Focus on RC, Para jumbles, Para completion\\n";
  guidance += "• Vocabulary building through roots and usage\\n\\n";
  
  guidance += "**Data Interpretation & Logical Reasoning:**\\n";
  guidance += "• Most unpredictable section\\n";
  guidance += "• Practice various question types daily\\n";
  guidance += "• Focus on accuracy over speed initially\\n\\n";
  
  guidance += "**Quantitative Ability:**\\n";
  guidance += "• Strong foundation in basics required\\n";
  guidance += "• Important areas: Arithmetic, Algebra, Geometry\\n";
  guidance += "• Shortcut techniques for speed\\n\\n";
  
  guidance += "## 🎯 IIM Cutoffs (General Category)\\n";
  guidance += "• **IIM A,B,C:** 99+ percentile\\n";
  guidance += "• **IIM L,I,K:** 97+ percentile\\n";
  guidance += "• **New IIMs:** 95+ percentile\\n\\n";
  
  guidance += "## 💼 Post-MBA Career Prospects\\n";
  guidance += "• **Consulting:** McKinsey, BCG, Bain (₹25-35 LPA)\\n";
  guidance += "• **Investment Banking:** Goldman Sachs, JP Morgan (₹20-30 LPA)\\n";
  guidance += "• **General Management:** Various sectors (₹15-25 LPA)\\n\\n";
  
  return guidance;
}

function generateUPSCGuidance(): string {
  let guidance = "# 🏛️ UPSC Civil Services Preparation\\n\\n";
  
  guidance += "## 📚 UPSC CSE Overview\\n\\n";
  guidance += "• **Three Stages:** Prelims, Mains, Interview\\n";
  guidance += "• **Services:** IAS, IPS, IFS, IRS, and 21+ others\\n";
  guidance += "• **Age Limit:** 21-32 years (General), relaxation for reserved categories\\n";
  guidance += "• **Attempts:** 6 (General), 9 (OBC), No limit (SC/ST)\\n\\n";
  
  guidance += "## 📈 Preparation Strategy\\n\\n";
  guidance += "**Prelims (MCQ-based):**\\n";
  guidance += "• **GS Paper 1:** History, Geography, Polity, Economics, Environment\\n";
  guidance += "• **CSAT Paper 2:** Reasoning, Comprehension, Math (qualifying)\\n";
  guidance += "• **Current Affairs:** Extremely important, read newspapers daily\\n\\n";
  
  guidance += "**Mains (Descriptive):**\\n";
  guidance += "• **4 GS Papers:** Comprehensive coverage required\\n";
  guidance += "• **Optional Subject:** Choose based on interest and background\\n";
  guidance += "• **Essay Paper:** Critical for final selection\\n";
  guidance += "• **Language Papers:** English + Regional language\\n\\n";
  
  guidance += "**Interview (Personality Test):**\\n";
  guidance += "• Tests personality, not knowledge\\n";
  guidance += "• Be honest and confident\\n";
  guidance += "• Know your optional and home state well\\n\\n";
  
  guidance += "## 📖 Recommended Study Material\\n";
  guidance += "• **NCERTs:** Foundation for all subjects\\n";
  guidance += "• **Laxmikanth:** For Indian Polity\\n";
  guidance += "• **Spectrum:** For Modern History\\n";
  guidance += "• **Economic Survey:** For Economics\\n";
  guidance += "• **The Hindu/Indian Express:** For current affairs\\n\\n";
  
  guidance += "## 🎯 Success Tips\\n";
  guidance += "• **Long-term commitment:** Usually takes 2-3 years\\n";
  guidance += "• **Consistent study:** 8-10 hours daily\\n";
  guidance += "• **Answer writing practice:** Critical for mains\\n";
  guidance += "• **Stay motivated:** Very tough exam, perseverance required\\n\\n";
  
  return guidance;
}

function generateGeneralEntranceGuidance(): string {
  let guidance = "# 📝 General Entrance Exam Guidance\\n\\n";
  
  guidance += "## 🎯 Popular Entrance Exams in India\\n\\n";
  
  guidance += "### **Engineering**\\n";
  guidance += "• **JEE Main/Advanced:** For IITs, NITs\\n";
  guidance += "• **BITSAT:** For BITS Pilani\\n";
  guidance += "• **State CETs:** For state engineering colleges\\n";
  guidance += "• **VITEEE:** For VIT Universities\\n\\n";
  
  guidance += "### **Medical**\\n";
  guidance += "• **NEET:** For all medical colleges\\n";
  guidance += "• **AIIMS:** For AIIMS institutions\\n";
  guidance += "• **JIPMER:** For JIPMER\\n\\n";
  
  guidance += "### **Management**\\n";
  guidance += "• **CAT:** For IIMs\\n";
  guidance += "• **XAT:** For XLRI\\n";
  guidance += "• **SNAP:** For Symbiosis\\n";
  guidance += "• **MAT:** For various B-schools\\n\\n";
  
  guidance += "### **Government Jobs**\\n";
  guidance += "• **UPSC CSE:** For civil services\\n";
  guidance += "• **IBPS:** For banking jobs\\n";
  guidance += "• **SSC:** For central government jobs\\n";
  guidance += "• **RRB:** For railway jobs\\n\\n";
  
  guidance += "## 💡 General Preparation Tips\\n";
  guidance += "• **Understand syllabus:** Know exactly what to study\\n";
  guidance += "• **Create timeline:** Plan preparation phase-wise\\n";
  guidance += "• **Mock tests:** Essential for all competitive exams\\n";
  guidance += "• **Stay updated:** Follow exam notifications and changes\\n";
  guidance += "• **Health maintenance:** Don't compromise on health\\n\\n";
  
  guidance += "Which specific entrance exam would you like detailed guidance on?";
  
  return guidance;
}

function generateGovernmentJobGuidance(message: string, details: any): string {
  const { jobType, examMentioned } = details;
  
  let guidance = "# 🏛️ Government Jobs in India\\n\\n";
  
  guidance += "Government jobs remain one of the most sought-after career options in India due to job security and benefits.\\n\\n";
  
  if (jobType === 'civil_services') {
    return generateUPSCGuidance();
  }
  
  guidance += "## 🎯 Major Government Job Categories\\n\\n";
  
  guidance += "### **Central Government Services**\\n";
  governmentJobs.centralServices.forEach(service => {
    guidance += `• **${service.name}** (${service.fullName})\\n`;
    guidance += `  - Exam: ${service.exam}\\n`;
    guidance += `  - Difficulty: ${service.difficulty}\\n\\n`;
  });
  
  guidance += "### **Banking Sector**\\n";
  governmentJobs.bankingJobs.forEach(job => {
    guidance += `• **${job.name}** (${job.fullName})\\n`;
    guidance += `  - Exam: ${job.exam}\\n`;
    guidance += `  - Salary: ${job.salary}\\n\\n`;
  });
  
  guidance += "### **Railways**\\n";
  governmentJobs.railways.forEach(job => {
    guidance += `• **${job.name}** (${job.fullName})\\n`;
    guidance += `  - Exam: ${job.exam}\\n`;
    guidance += `  - Salary: ${job.salary}\\n\\n`;
  });
  
  guidance += "### **Defence Services**\\n";
  governmentJobs.defence.forEach(service => {
    guidance += `• **${service.name}** (${service.fullName})\\n`;
    guidance += `  - Exam: ${service.exam}\\n`;
    guidance += `  - Salary: ${service.salary}\\n\\n`;
  });
  
  guidance += "## 💡 Benefits of Government Jobs\\n";
  guidance += "• **Job Security:** Permanent employment with pension\\n";
  guidance += "• **Work-Life Balance:** Fixed working hours\\n";
  guidance += "• **Social Status:** Respect in society\\n";
  guidance += "• **Benefits:** Medical, housing allowances\\n";
  guidance += "• **Transfers:** Opportunity to work in different locations\\n\\n";
  
  guidance += "## 📚 Preparation Strategy\\n";
  guidance += "• **Choose wisely:** Select exams based on your background\\n";
  guidance += "• **Long-term planning:** Government exams require sustained effort\\n";
  guidance += "• **Current affairs:** Extremely important for all exams\\n";
  guidance += "• **Mock tests:** Regular practice essential\\n";
  guidance += "• **Multiple attempts:** Don't lose hope after failures\\n\\n";
  
  guidance += "Which specific government job or exam would you like detailed guidance on?";
  
  return guidance;
}

function generateGeneralStudentGuidance(message: string): string {
  let guidance = "# 🎓 General Career Guidance for Indian Students\\n\\n";
  
  guidance += "Welcome to your career planning journey! Here's comprehensive guidance for Indian students:\\n\\n";
  
  guidance += "## 🛣️ Career Path Planning\\n\\n";
  guidance += "### **Step 1: Self-Discovery**\\n";
  guidance += "• **Interests:** What subjects/activities do you enjoy?\\n";
  guidance += "• **Strengths:** What are you naturally good at?\\n";
  guidance += "• **Values:** What matters to you (money, impact, work-life balance)?\\n";
  guidance += "• **Personality:** Are you introverted/extroverted, creative/analytical?\\n\\n";
  
  guidance += "### **Step 2: Explore Career Options**\\n";
  guidance += "**High-Growth Sectors in India:**\\n";
  guidance += "• **Technology:** Software development, AI/ML, cybersecurity\\n";
  guidance += "• **Healthcare:** Medical services, telemedicine, pharma\\n";
  guidance += "• **Finance:** Banking, fintech, investment management\\n";
  guidance += "• **Education:** EdTech, skill development, content creation\\n";
  guidance += "• **Government:** Civil services, PSU, defense\\n\\n";
  
  guidance += "## 🎯 Popular Career Choices by Stream\\n\\n";
  
  // Add stream-wise guidance using the imported data
  Object.entries(careerKnowledgeBase.educationStreams).forEach(([stream, data]) => {
    guidance += `### **${stream}**\\n`;
    guidance += `• **Top Careers:** ${data.topCareers.join(', ')}\\n`;
    guidance += `• **Entrance Exams:** ${data.entranceExams.join(', ')}\\n`;
    guidance += `• **Top Colleges:** ${data.colleges.join(', ')}\\n`;
    guidance += `• **Average Package:** ${data.averagePackage}\\n\\n`;
  });
  
  guidance += "## 🏢 Job Market Insights\\n\\n";
  guidance += "### **Top Job Locations in India**\\n";
  
  // Add city-wise job market info
  Object.entries(indianJobMarket.cities).forEach(([city, data]) => {
    guidance += `**${city}** (${data.nickname}):\\n`;
    guidance += `• Major Sectors: ${data.majorSectors.join(', ')}\\n`;
    guidance += `• Average Salary: ${data.avgSalary}\\n`;
    guidance += `• Cost of Living: ${data.costOfLiving}\\n\\n`;
  });
  
  guidance += "## 🚀 Skill Development Roadmap\\n\\n";
  guidance += "### **Essential Skills for 2024-25**\\n";
  guidance += "**Technical Skills:**\\n";
  guidance += `• ${indianSkillsFramework.technical.software.slice(0, 5).join(', ')}\\n`;
  guidance += `• ${indianSkillsFramework.technical.data.slice(0, 5).join(', ')}\\n\\n`;
  
  guidance += "**Soft Skills:**\\n";
  guidance += "• Communication (English + Hindi/Regional language)\\n";
  guidance += "• Problem-solving and critical thinking\\n";
  guidance += "• Leadership and teamwork\\n";
  guidance += "• Adaptability and continuous learning\\n\\n";
  
  guidance += "## 💡 Success Strategies for Indian Students\\n";
  guidance += "1. **Academic Excellence:** Maintain good grades for better opportunities\\n";
  guidance += "2. **Practical Skills:** Learn industry-relevant skills early\\n";
  guidance += "3. **Networking:** Build connections with seniors and professionals\\n";
  guidance += "4. **Internships:** Gain practical experience during college\\n";
  guidance += "5. **English Communication:** Essential for career growth\\n";
  guidance += "6. **Technology Adoption:** Stay updated with digital trends\\n";
  guidance += "7. **Financial Literacy:** Understand investments and financial planning\\n\\n";
  
  guidance += "## 📞 Next Steps\\n";
  guidance += "Tell me more about yourself:\\n";
  guidance += "• What class/year are you in?\\n";
  guidance += "• What stream have you chosen or planning to choose?\\n";
  guidance += "• What are your interests and career goals?\\n";
  guidance += "• Any specific concerns or questions?\\n\\n";
  
  guidance += "I'll provide personalized guidance based on your specific situation!";
  
  return guidance;
}

function generateSkillsAssessment(message: string, details: any): string {
  let assessment = "# 🎯 Skills Assessment & Development Plan\\n\\n";
  
  assessment += "Let me help you evaluate your skills and identify development opportunities:\\n\\n";
  
  assessment += "## 📊 Skill Categories Framework\\n\\n";
  
  // Technical Skills
  assessment += "### 🔧 **Technical Skills**\\n";
  assessment += `${careerKnowledgeBase.skillCategories.technical.map(skill => `• ${skill}`).join('\\n')}\\n\\n`;
  
  // Soft Skills
  assessment += "### 🤝 **Soft Skills**\\n";
  assessment += `${careerKnowledgeBase.skillCategories.soft.map(skill => `• ${skill}`).join('\\n')}\\n\\n`;
  
  // Analytical Skills
  assessment += "### 📈 **Analytical Skills**\\n";
  assessment += `${careerKnowledgeBase.skillCategories.analytical.map(skill => `• ${skill}`).join('\\n')}\\n\\n`;
  
  // Creative Skills
  assessment += "### 🎨 **Creative Skills**\\n";
  assessment += `${careerKnowledgeBase.skillCategories.creative.map(skill => `• ${skill}`).join('\\n')}\\n\\n`;
  
  assessment += "## 🔍 Self-Assessment Questions\\n\\n";
  assessment += "For each skill category, rate yourself (1-5) and consider:\\n\\n";
  assessment += "• **Proficiency Level:** How skilled are you currently?\\n";
  assessment += "• **Usage Frequency:** How often do you use this skill?\\n";
  assessment += "• **Career Relevance:** How important is this for your goals?\\n";
  assessment += "• **Improvement Need:** How much development is needed?\\n\\n";
  
  assessment += "## 🚀 Skill Development Strategies\\n\\n";
  assessment += "### **High-Impact Learning Methods:**\\n";
  assessment += "• **Online Courses** - Coursera, Udemy, LinkedIn Learning\\n";
  assessment += "• **Certifications** - Industry-recognized credentials\\n";
  assessment += "• **Project-Based Learning** - Build portfolio pieces\\n";
  assessment += "• **Mentorship** - Learn from experienced professionals\\n";
  assessment += "• **Practice & Application** - Real-world implementation\\n\\n";
  
  assessment += "## 📋 Skill Gap Analysis Template\\n\\n";
  assessment += "**Current Skills:**\\n";
  assessment += "• List your strongest 5-7 skills\\n\\n";
  assessment += "**Target Skills:**\\n";
  assessment += "• Skills needed for your desired role\\n\\n";
  assessment += "**Priority Gaps:**\\n";
  assessment += "• Skills with the biggest impact on your goals\\n\\n";
  assessment += "**Development Plan:**\\n";
  assessment += "• Specific actions to bridge each gap\\n\\n";
  
  assessment += "💡 **Next Step:** Share your current role or target position, and I'll provide a more personalized skill assessment and development roadmap!";
  
  return assessment;
}

function generateIndustryInsights(message: string, details: any): string {
  const { industry } = details;
  
  let insights = "# 🏭 Industry Insights & Analysis\\n\\n";
  
  if (industry) {
    const industryData = careerKnowledgeBase.industries.find(ind => 
      ind.name.toLowerCase() === industry.toLowerCase()
    );
    
    if (industryData) {
      insights += `## 🎯 ${industryData.name} Industry Deep Dive\\n\\n`;
      
      insights += `### 👔 **Key Career Roles**\\n`;
      insights += `${industryData.roles.map(role => `• **${role}** - Growing demand with competitive salaries`).join('\\n')}\\n\\n`;
      
      insights += `### 🛠️ **Essential Skills**\\n`;
      insights += `${industryData.skills.map(skill => `• **${skill}** - Critical for success in this field`).join('\\n')}\\n\\n`;
      
      insights += `### 📈 **Current Trends & Opportunities**\\n`;
      insights += `${industryData.trends.map(trend => `• **${trend}** - Shaping the future of the industry`).join('\\n')}\\n\\n`;
      
      insights += `### 🔮 **Future Outlook**\\n`;
      insights += `The ${industryData.name} industry is experiencing significant transformation. Key factors driving change include technological advancement, changing consumer behavior, and global market dynamics.\\n\\n`;
      
      insights += `### 💼 **Career Entry Strategies**\\n`;
      insights += `• **Entry-Level Positions:** Start with internships or junior roles\\n`;
      insights += `• **Skill Development:** Focus on both technical and soft skills\\n`;
      insights += `• **Networking:** Join professional associations and attend industry events\\n`;
      insights += `• **Continuous Learning:** Stay updated with industry publications and trends\\n\\n`;
    }
  } else {
    insights += "Here's an overview of major industries and their current landscape:\\n\\n";
    
    careerKnowledgeBase.industries.forEach(ind => {
      insights += `## 🏢 ${ind.name}\\n`;
      insights += `**Top Roles:** ${ind.roles.slice(0, 3).join(', ')}\\n`;
      insights += `**Key Trends:** ${ind.trends.slice(0, 2).join(', ')}\\n\\n`;
    });
  }
  
  insights += "## 🔍 Industry Research Framework\\n\\n";
  insights += "When exploring any industry, consider these factors:\\n\\n";
  insights += "• **Market Size & Growth:** Is the industry expanding or contracting?\\n";
  insights += "• **Competition Level:** How saturated is the job market?\\n";
  insights += "• **Salary Ranges:** What compensation can you expect?\\n";
  insights += "• **Work-Life Balance:** What's the typical work environment?\\n";
  insights += "• **Innovation Rate:** How quickly is the industry changing?\\n";
  insights += "• **Geographic Distribution:** Where are the jobs located?\\n\\n";
  
  insights += "💡 **Want specific insights about a particular industry or role? Just ask!**";
  
  return insights;
}

function generateGeneralCareerAdvice(message: string, context: any): string {
  let advice = "# 💼 Career Development Insights\\n\\n";
  
  // Determine career stage based on context
  const stage = determineCareerStage(message);
  
  if (stage && stage in careerKnowledgeBase.careerStages) {
    const stageData = careerKnowledgeBase.careerStages[stage as keyof typeof careerKnowledgeBase.careerStages];
    
    advice += `## 🎯 ${stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' ')} Focus Areas\\n\\n`;
    
    advice += `### **Key Priorities:**\\n`;
    advice += `${stageData.focus.map((focus: string) => `• **${focus}** - Essential for your current career stage`).join('\\n')}\\n\\n`;
    
    advice += `### **Common Challenges:**\\n`;
    advice += `${stageData.challenges.map((challenge: string) => `• ${challenge}`).join('\\n')}\\n\\n`;
  }
  
  advice += "## 🚀 Universal Career Success Principles\\n\\n";
  
  advice += "### **1. Continuous Learning**\\n";
  advice += "• Stay curious and embrace new challenges\\n";
  advice += "• Invest in both technical and soft skills\\n";
  advice += "• Follow industry trends and innovations\\n\\n";
  
  advice += "### **2. Strategic Networking**\\n";
  advice += "• Build genuine professional relationships\\n";
  advice += "• Provide value to your network\\n";
  advice += "• Maintain consistent communication\\n\\n";
  
  advice += "### **3. Personal Branding**\\n";
  advice += "• Define your unique value proposition\\n";
  advice += "• Maintain a strong online presence\\n";
  advice += "• Consistently deliver quality work\\n\\n";
  
  advice += "### **4. Goal Setting & Planning**\\n";
  advice += "• Set SMART career goals\\n";
  advice += "• Create actionable development plans\\n";
  advice += "• Regular progress review and adjustment\\n\\n";
  
  advice += "### **5. Adaptability & Resilience**\\n";
  advice += "• Embrace change and uncertainty\\n";
  advice += "• Learn from setbacks and failures\\n";
  advice += "• Maintain a growth mindset\\n\\n";
  
  advice += "## 📈 Career Advancement Strategies\\n\\n";
  advice += "• **Performance Excellence:** Consistently exceed expectations\\n";
  advice += "• **Visibility:** Ensure your contributions are recognized\\n";
  advice += "• **Leadership:** Take initiative and guide others\\n";
  advice += "• **Innovation:** Bring creative solutions to challenges\\n";
  advice += "• **Mentorship:** Both seek mentors and mentor others\\n\\n";
  
  advice += "💡 **Remember:** Career success is a marathon, not a sprint. Focus on consistent progress and long-term growth rather than quick wins.\\n\\n";
  advice += "What specific aspect of your career would you like to explore further?";
  
  return advice;
}

function determineCareerStage(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('entry level') || lowerMessage.includes('new graduate') || 
      lowerMessage.includes('first job') || lowerMessage.includes('just started')) {
    return 'entry-level';
  }
  
  if (lowerMessage.includes('mid career') || lowerMessage.includes('experienced') || 
      lowerMessage.includes('senior') || lowerMessage.includes('manager')) {
    return 'mid-career';
  }
  
  if (lowerMessage.includes('executive') || lowerMessage.includes('director') || 
      lowerMessage.includes('c-level') || lowerMessage.includes('leadership')) {
    return 'senior-level';
  }
  
  if (lowerMessage.includes('career change') || lowerMessage.includes('transition') || 
      lowerMessage.includes('switch') || lowerMessage.includes('pivot')) {
    return 'career-change';
  }
  
  return null;
}

function generateDefaultResponse(message: string): string {
  return `# 👋 Hello! I'm your AI Career Advisor

I'm here to help you with all aspects of your professional journey! I can assist you with:

## 🎯 **Career Guidance Services**

• **Career Path Planning** - Find the right direction for your career
• **Skills Assessment** - Identify your strengths and development areas
• **Industry Insights** - Learn about different sectors and opportunities
• **Learning Recommendations** - Get personalized skill development plans
• **Career Transition Support** - Navigate career changes successfully
• **Professional Development** - Advance your current career

## 💡 **How to Get Started**

You can ask me questions like:
• "I'm thinking about changing careers, can you help?"
• "What skills should I develop for a career in technology?"
• "How do I transition from marketing to data science?"
• "What are the current trends in the finance industry?"
• "Can you help me create a learning plan for project management?"

Feel free to share your current situation, career goals, or any specific questions you have. I'll provide personalized advice based on your needs!

What would you like to explore today? 🚀`;
}
