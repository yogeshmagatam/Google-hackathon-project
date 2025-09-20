interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Career knowledge base and assessment logic
const careerKnowledgeBase = {
  industries: [
    {
      name: 'Technology',
      roles: ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'DevOps Engineer'],
      skills: ['Programming', 'Problem Solving', 'Systems Thinking', 'Communication', 'Continuous Learning'],
      trends: ['AI/ML', 'Cloud Computing', 'Cybersecurity', 'Remote Work', 'Agile Methodologies']
    },
    {
      name: 'Healthcare',
      roles: ['Doctor', 'Nurse', 'Healthcare Administrator', 'Medical Researcher', 'Therapist'],
      skills: ['Empathy', 'Attention to Detail', 'Communication', 'Critical Thinking', 'Stress Management'],
      trends: ['Telemedicine', 'Personalized Medicine', 'Healthcare AI', 'Mental Health Focus', 'Preventive Care']
    },
    {
      name: 'Finance',
      roles: ['Financial Analyst', 'Investment Banker', 'Risk Manager', 'Financial Advisor', 'Actuary'],
      skills: ['Analytical Thinking', 'Attention to Detail', 'Communication', 'Ethics', 'Technical Analysis'],
      trends: ['FinTech', 'Cryptocurrency', 'ESG Investing', 'Robo-advisors', 'Digital Banking']
    },
    {
      name: 'Education',
      roles: ['Teacher', 'Professor', 'Educational Administrator', 'Instructional Designer', 'School Counselor'],
      skills: ['Communication', 'Patience', 'Creativity', 'Adaptability', 'Leadership'],
      trends: ['Online Learning', 'EdTech', 'Personalized Learning', 'STEM Focus', 'Social-Emotional Learning']
    },
    {
      name: 'Marketing',
      roles: ['Digital Marketer', 'Brand Manager', 'Content Creator', 'Market Researcher', 'Social Media Manager'],
      skills: ['Creativity', 'Communication', 'Data Analysis', 'Strategic Thinking', 'Adaptability'],
      trends: ['Digital Marketing', 'Influencer Marketing', 'Data-Driven Marketing', 'Personalization', 'Video Content']
    }
  ],
  
  skillCategories: {
    technical: ['Programming', 'Data Analysis', 'Digital Marketing', 'Design', 'Engineering'],
    soft: ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Adaptability'],
    analytical: ['Critical Thinking', 'Research', 'Financial Analysis', 'Statistical Analysis', 'Strategic Planning'],
    creative: ['Content Creation', 'Graphic Design', 'Writing', 'Innovation', 'Artistic Skills']
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
    case 'career_change':
      return generateCareerChangeAdvice(userMessage, intent.details);
    case 'skills_assessment':
      return generateSkillsAssessment(userMessage, intent.details);
    case 'industry_inquiry':
      return generateIndustryInsights(userMessage, intent.details);
    case 'learning_path':
      return generateLearningPath(userMessage, intent.details);
    case 'general_career':
      return generateGeneralCareerAdvice(userMessage, context);
    default:
      return generateDefaultResponse(userMessage);
  }
}

function analyzeIntent(message: string): { type: string; details: any } {
  const lowerMessage = message.toLowerCase();
  
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
  
  // Learning path indicators
  if (lowerMessage.includes('learn') || lowerMessage.includes('study') || 
      lowerMessage.includes('course') || lowerMessage.includes('training')) {
    return { type: 'learning_path', details: extractLearningContext(message) };
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

function extractLearningContext(message: string): any {
  const lowerMessage = message.toLowerCase();
  const learningTypes = [];
  
  if (lowerMessage.includes('online') || lowerMessage.includes('course')) learningTypes.push('online_courses');
  if (lowerMessage.includes('certification') || lowerMessage.includes('cert')) learningTypes.push('certifications');
  if (lowerMessage.includes('degree') || lowerMessage.includes('university')) learningTypes.push('formal_education');
  if (lowerMessage.includes('bootcamp')) learningTypes.push('bootcamps');
  
  return { learningTypes, urgency: lowerMessage.includes('quick') || lowerMessage.includes('fast') ? 'high' : 'normal' };
}

function generateCareerChangeAdvice(message: string, details: any): string {
  const { currentField, targetField } = details;
  
  let advice = "# 🔄 Career Change Guidance\\n\\n";
  
  if (currentField && targetField) {
    advice += `Great! You're considering transitioning from **${currentField}** to **${targetField}**. Here's a strategic approach:\\n\\n`;
  } else {
    advice += "I understand you're considering a career change. Here's a comprehensive guide to help you navigate this transition:\\n\\n";
  }
  
  advice += `## 🎯 Step-by-Step Career Transition Plan\\n\\n`;
  advice += `### 1. **Self-Assessment**\\n`;
  advice += `• Identify your transferable skills\\n`;
  advice += `• Clarify your values and motivations\\n`;
  advice += `• Assess your financial readiness\\n`;
  advice += `• Consider your risk tolerance\\n\\n`;
  
  advice += `### 2. **Research & Exploration**\\n`;
  advice += `• Industry research and trends analysis\\n`;
  advice += `• Informational interviews with professionals\\n`;
  advice += `• Job shadowing or volunteer opportunities\\n`;
  advice += `• Skill gap analysis\\n\\n`;
  
  advice += `### 3. **Skill Development**\\n`;
  advice += `• Online courses and certifications\\n`;
  advice += `• Professional workshops and seminars\\n`;
  advice += `• Side projects or freelance work\\n`;
  advice += `• Networking events and conferences\\n\\n`;
  
  advice += `### 4. **Strategic Networking**\\n`;
  advice += `• LinkedIn optimization\\n`;
  advice += `• Industry associations and groups\\n`;
  advice += `• Mentorship opportunities\\n`;
  advice += `• Professional references\\n\\n`;
  
  if (targetField) {
    const industry = careerKnowledgeBase.industries.find(ind => 
      ind.name.toLowerCase().includes(targetField.toLowerCase())
    );
    
    if (industry) {
      advice += `## 🏢 ${industry.name} Industry Insights\\n\\n`;
      advice += `**Key Roles:** ${industry.roles.join(', ')}\\n\\n`;
      advice += `**Essential Skills:** ${industry.skills.join(', ')}\\n\\n`;
      advice += `**Current Trends:** ${industry.trends.join(', ')}\\n\\n`;
    }
  }
  
  advice += `## 📈 Next Steps\\n`;
  advice += `1. **This Week:** Complete a skills inventory and research target roles\\n`;
  advice += `2. **This Month:** Connect with 3-5 professionals in your target field\\n`;
  advice += `3. **Next 3 Months:** Start skill development and consider transitional roles\\n\\n`;
  
  advice += `💡 **Pro Tip:** Consider transitional roles that bridge your current experience with your target field. This can make the change less risky and more appealing to employers.\\n\\n`;
  advice += `Would you like me to dive deeper into any specific aspect of your career transition?`;
  
  return advice;
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

function generateLearningPath(message: string, details: any): string {
  const { learningTypes, urgency } = details;
  
  let path = "# 📚 Personalized Learning Path\\n\\n";
  
  if (urgency === 'high') {
    path += "🚀 **Fast-Track Learning Plan** (3-6 months)\\n\\n";
  } else {
    path += "📈 **Comprehensive Learning Plan** (6-12 months)\\n\\n";
  }
  
  path += "## 🎯 Learning Strategy Framework\\n\\n";
  
  path += "### **Phase 1: Foundation Building** (Month 1-2)\\n";
  path += "• **Assess Current Knowledge:** Take skill assessments\\n";
  path += "• **Set Clear Goals:** Define specific learning objectives\\n";
  path += "• **Choose Learning Style:** Visual, auditory, kinesthetic, or reading\\n";
  path += "• **Create Schedule:** Dedicated learning time blocks\\n\\n";
  
  path += "### **Phase 2: Core Skill Development** (Month 3-6)\\n";
  path += "• **Structured Courses:** Online platforms or formal education\\n";
  path += "• **Hands-on Practice:** Projects and real-world application\\n";
  path += "• **Peer Learning:** Study groups and forums\\n";
  path += "• **Regular Assessment:** Track progress and adjust plan\\n\\n";
  
  path += "### **Phase 3: Advanced Application** (Month 7-12)\\n";
  path += "• **Specialization:** Focus on niche areas\\n";
  path += "• **Portfolio Building:** Showcase your skills\\n";
  path += "• **Mentorship:** Guidance from experts\\n";
  path += "• **Certification:** Validate your knowledge\\n\\n";
  
  path += "## 🛠️ Learning Resources by Type\\n\\n";
  
  path += "### **📱 Online Learning Platforms**\\n";
  path += "• **Coursera** - University-level courses with certificates\\n";
  path += "• **Udemy** - Practical skills and technical training\\n";
  path += "• **LinkedIn Learning** - Professional development focus\\n";
  path += "• **Pluralsight** - Technology and creative skills\\n";
  path += "• **Khan Academy** - Free foundational courses\\n\\n";
  
  path += "### **🏆 Certification Programs**\\n";
  path += "• **Technology:** AWS, Google Cloud, Microsoft, Cisco\\n";
  path += "• **Project Management:** PMP, Scrum Master, Agile\\n";
  path += "• **Marketing:** Google Ads, HubSpot, Facebook Blueprint\\n";
  path += "• **Data Science:** Tableau, SAS, IBM Data Science\\n";
  path += "• **Finance:** CFA, FRM, CPA\\n\\n";
  
  path += "### **🎓 Formal Education Options**\\n";
  path += "• **Bootcamps** - Intensive, job-focused training (3-6 months)\\n";
  path += "• **Professional Certificates** - University-backed programs (6-12 months)\\n";
  path += "• **Master's Degrees** - Advanced expertise (1-2 years)\\n";
  path += "• **MBA Programs** - Leadership and business strategy (2 years)\\n\\n";
  
  path += "### **🤝 Community Learning**\\n";
  path += "• **Meetup Groups** - Local professional gatherings\\n";
  path += "• **Professional Associations** - Industry-specific communities\\n";
  path += "• **Online Forums** - Reddit, Stack Overflow, Discord\\n";
  path += "• **Conferences & Webinars** - Latest industry insights\\n\\n";
  
  path += "## 📊 Learning Success Metrics\\n\\n";
  path += "Track your progress with these indicators:\\n\\n";
  path += "• **Knowledge Retention:** Quiz scores and practical application\\n";
  path += "• **Skill Application:** Successfully completed projects\\n";
  path += "• **Recognition:** Certificates, badges, or endorsements\\n";
  path += "• **Career Impact:** Job opportunities or advancement\\n";
  path += "• **Network Growth:** Professional connections made\\n\\n";
  
  path += "💡 **Pro Tip:** The most effective learning combines theory with practice. For every hour of learning, spend at least 30 minutes applying the knowledge in real scenarios.\\n\\n";
  path += "What specific skills or areas would you like to focus your learning plan on?";
  
  return path;
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
