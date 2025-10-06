// Indian Education System and Career Context
// Comprehensive data for Indian students and professionals

export const indianEducationSystem = {
  // School education streams (Class 11-12)
  streams: [
    {
      name: 'Science',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science'],
      careerPaths: ['Engineering', 'Medical', 'Research', 'Technology', 'Pharmaceuticals'],
      entranceExams: ['JEE Main', 'JEE Advanced', 'NEET', 'BITSAT', 'VITEEE']
    },
    {
      name: 'Commerce',
      subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English'],
      careerPaths: ['Business', 'Finance', 'Accounting', 'Economics', 'Management'],
      entranceExams: ['CAT', 'XAT', 'SNAP', 'CMAT', 'CA Foundation']
    },
    {
      name: 'Arts/Humanities',
      subjects: ['History', 'Geography', 'Political Science', 'Psychology', 'Sociology', 'English'],
      careerPaths: ['Civil Services', 'Journalism', 'Psychology', 'Social Work', 'Teaching'],
      entranceExams: ['UPSC CSE', 'NET/JRF', 'CLAT', 'BHU UET', 'IPU CET']
    }
  ],

  // Higher education degrees
  degrees: {
    engineering: [
      'B.Tech/B.E. Computer Science',
      'B.Tech/B.E. Electronics & Communication',
      'B.Tech/B.E. Mechanical Engineering',
      'B.Tech/B.E. Civil Engineering',
      'B.Tech/B.E. Electrical Engineering',
      'B.Tech/B.E. Information Technology',
      'B.Tech/B.E. Chemical Engineering',
      'B.Tech/B.E. Aerospace Engineering'
    ],
    medical: [
      'MBBS',
      'BDS (Dental)',
      'BAMS (Ayurveda)',
      'BHMS (Homeopathy)',
      'B.Pharm',
      'D.Pharm',
      'Nursing (B.Sc)',
      'Physiotherapy (BPT)'
    ],
    commerce: [
      'B.Com (General)',
      'B.Com (Honors)',
      'BBA',
      'CA (Chartered Accountancy)',
      'CS (Company Secretary)',
      'CMA (Cost & Management Accounting)',
      'B.Com + CA',
      'BBA + MBA'
    ],
    arts: [
      'BA (English)',
      'BA (History)',
      'BA (Political Science)',
      'BA (Psychology)',
      'BA (Economics)',
      'BA (Journalism)',
      'BA (Fine Arts)',
      'BA (Social Work)'
    ],
    computer: [
      'BCA (Bachelor of Computer Applications)',
      'BSc Computer Science',
      'BSc IT',
      'BCA + MCA',
      'BSc Data Science',
      'B.Tech CSE'
    ]
  },

  // Major entrance examinations
  entranceExams: {
    engineering: {
      'JEE Main': {
        fullName: 'Joint Entrance Examination Main',
        eligibility: '12th with PCM',
        colleges: ['NITs', 'IIITs', 'CFTIs', 'State Engineering Colleges'],
        difficulty: 'High',
        attempts: '2 per year'
      },
      'JEE Advanced': {
        fullName: 'Joint Entrance Examination Advanced',
        eligibility: 'JEE Main qualified + 12th with PCM',
        colleges: ['IITs'],
        difficulty: 'Very High',
        attempts: '2 lifetime attempts'
      },
      'BITSAT': {
        fullName: 'Birla Institute of Technology and Science Admission Test',
        eligibility: '12th with PCM',
        colleges: ['BITS Pilani', 'BITS Goa', 'BITS Hyderabad'],
        difficulty: 'High',
        attempts: '1 per year'
      }
    },
    medical: {
      'NEET': {
        fullName: 'National Eligibility cum Entrance Test',
        eligibility: '12th with PCB',
        colleges: ['All Medical Colleges in India'],
        difficulty: 'Very High',
        attempts: 'No limit'
      }
    },
    management: {
      'CAT': {
        fullName: 'Common Admission Test',
        eligibility: 'Graduate in any discipline',
        colleges: ['IIMs', 'Top B-Schools'],
        difficulty: 'Very High',
        attempts: 'No limit'
      },
      'XAT': {
        fullName: 'Xavier Aptitude Test',
        eligibility: 'Graduate in any discipline',
        colleges: ['XLRI', 'Xavier Schools'],
        difficulty: 'High',
        attempts: 'No limit'
      }
    },
    civilServices: {
      'UPSC CSE': {
        fullName: 'Union Public Service Commission Civil Services Examination',
        eligibility: 'Graduate in any discipline',
        services: ['IAS', 'IPS', 'IFS', 'IRS'],
        difficulty: 'Extremely High',
        attempts: '6 (General), 9 (OBC), No limit (SC/ST)'
      }
    }
  },

  // Career progression paths for Indian students
  careerProgression: {
    freshGraduate: {
      engineering: [
        { role: 'Software Developer Trainee', experience: '0-1 years', salary: '₹3-8 LPA' },
        { role: 'Associate Software Engineer', experience: '1-2 years', salary: '₹5-12 LPA' },
        { role: 'Software Engineer', experience: '2-4 years', salary: '₹8-18 LPA' },
        { role: 'Senior Software Engineer', experience: '4-7 years', salary: '₹15-30 LPA' },
        { role: 'Tech Lead/Engineering Manager', experience: '7+ years', salary: '₹25-50 LPA' }
      ],
      commerce: [
        { role: 'Trainee Analyst', experience: '0-1 years', salary: '₹2.5-6 LPA' },
        { role: 'Financial Analyst', experience: '1-3 years', salary: '₹4-10 LPA' },
        { role: 'Senior Analyst', experience: '3-5 years', salary: '₹8-15 LPA' },
        { role: 'Manager', experience: '5-8 years', salary: '₹12-25 LPA' },
        { role: 'Director/VP', experience: '8+ years', salary: '₹20-40 LPA' }
      ]
    }
  }
};

export const indianJobMarket = {
  // Top Indian companies by sector
  companies: {
    technology: [
      { name: 'Tata Consultancy Services (TCS)', sector: 'IT Services', employees: '500K+', headquarters: 'Mumbai' },
      { name: 'Infosys', sector: 'IT Services', employees: '250K+', headquarters: 'Bangalore' },
      { name: 'Wipro', sector: 'IT Services', employees: '200K+', headquarters: 'Bangalore' },
      { name: 'HCL Technologies', sector: 'IT Services', employees: '180K+', headquarters: 'Noida' },
      { name: 'Tech Mahindra', sector: 'IT Services', employees: '140K+', headquarters: 'Pune' },
      { name: 'Flipkart', sector: 'E-commerce', employees: '50K+', headquarters: 'Bangalore' },
      { name: 'Zomato', sector: 'Food Tech', employees: '5K+', headquarters: 'Gurgaon' },
      { name: 'Paytm', sector: 'Fintech', employees: '20K+', headquarters: 'Noida' },
      { name: 'Byju\'s', sector: 'EdTech', employees: '50K+', headquarters: 'Bangalore' }
    ],
    banking: [
      { name: 'State Bank of India', sector: 'Public Banking', employees: '250K+', headquarters: 'Mumbai' },
      { name: 'HDFC Bank', sector: 'Private Banking', employees: '120K+', headquarters: 'Mumbai' },
      { name: 'ICICI Bank', sector: 'Private Banking', employees: '100K+', headquarters: 'Mumbai' },
      { name: 'Axis Bank', sector: 'Private Banking', employees: '80K+', headquarters: 'Mumbai' },
      { name: 'Kotak Mahindra Bank', sector: 'Private Banking', employees: '75K+', headquarters: 'Mumbai' }
    ],
    manufacturing: [
      { name: 'Tata Motors', sector: 'Automotive', employees: '80K+', headquarters: 'Mumbai' },
      { name: 'Mahindra & Mahindra', sector: 'Automotive', employees: '50K+', headquarters: 'Mumbai' },
      { name: 'Bajaj Auto', sector: 'Automotive', employees: '20K+', headquarters: 'Pune' },
      { name: 'Larsen & Toubro', sector: 'Infrastructure', employees: '180K+', headquarters: 'Mumbai' }
    ],
    consulting: [
      { name: 'McKinsey & Company India', sector: 'Management Consulting', employees: '2K+', headquarters: 'Mumbai' },
      { name: 'Boston Consulting Group India', sector: 'Management Consulting', employees: '1K+', headquarters: 'Mumbai' },
      { name: 'Deloitte India', sector: 'Consulting', employees: '50K+', headquarters: 'Mumbai' },
      { name: 'PwC India', sector: 'Consulting', employees: '40K+', headquarters: 'Mumbai' }
    ]
  },

  // Popular job portals in India
  jobPortals: [
    { name: 'Naukri.com', focus: 'General', popularity: 'Very High' },
    { name: 'LinkedIn India', focus: 'Professional', popularity: 'High' },
    { name: 'Indeed India', focus: 'General', popularity: 'High' },
    { name: 'Monster India', focus: 'General', popularity: 'Medium' },
    { name: 'Freshersworld', focus: 'Entry Level', popularity: 'Medium' },
    { name: 'InternShala', focus: 'Internships/Freshers', popularity: 'High' },
    { name: 'AngelList India', focus: 'Startups', popularity: 'Medium' },
    { name: 'Glassdoor India', focus: 'Company Reviews', popularity: 'Medium' }
  ],

  // Major Indian cities and their job markets
  cities: {
    'Bangalore': {
      nickname: 'Silicon Valley of India',
      majorSectors: ['Technology', 'Startups', 'R&D'],
      avgSalary: '₹8-15 LPA',
      costOfLiving: 'High',
      companies: ['Infosys', 'Wipro', 'Flipkart', 'Ola']
    },
    'Mumbai': {
      nickname: 'Financial Capital',
      majorSectors: ['Finance', 'Entertainment', 'Textiles'],
      avgSalary: '₹10-18 LPA',
      costOfLiving: 'Very High',
      companies: ['TCS', 'HDFC', 'Reliance', 'SBI']
    },
    'Delhi/NCR': {
      nickname: 'Political & Business Hub',
      majorSectors: ['Government', 'Manufacturing', 'Services'],
      avgSalary: '₹9-16 LPA',
      costOfLiving: 'High',
      companies: ['HCL', 'Paytm', 'Maruti Suzuki']
    },
    'Hyderabad': {
      nickname: 'Cyberabad',
      majorSectors: ['Technology', 'Pharmaceuticals', 'Biotechnology'],
      avgSalary: '₹7-14 LPA',
      costOfLiving: 'Medium',
      companies: ['Microsoft India', 'Google India', 'Facebook India']
    },
    'Chennai': {
      nickname: 'Detroit of India',
      majorSectors: ['Automotive', 'Manufacturing', 'Healthcare'],
      avgSalary: '₹6-12 LPA',
      costOfLiving: 'Medium',
      companies: ['Ford India', 'Hyundai India', 'Cognizant']
    },
    'Pune': {
      nickname: 'IT Hub',
      majorSectors: ['Technology', 'Automotive', 'Manufacturing'],
      avgSalary: '₹7-13 LPA',
      costOfLiving: 'Medium',
      companies: ['Tech Mahindra', 'Bajaj Auto', 'Persistent Systems']
    }
  }
};

// Government job opportunities
export const governmentJobs = {
  centralServices: [
    { name: 'IAS', fullName: 'Indian Administrative Service', exam: 'UPSC CSE', difficulty: 'Extremely High' },
    { name: 'IPS', fullName: 'Indian Police Service', exam: 'UPSC CSE', difficulty: 'Extremely High' },
    { name: 'IFS', fullName: 'Indian Foreign Service', exam: 'UPSC CSE', difficulty: 'Extremely High' },
    { name: 'IRS', fullName: 'Indian Revenue Service', exam: 'UPSC CSE', difficulty: 'Extremely High' }
  ],
  bankingJobs: [
    { name: 'Bank PO', fullName: 'Probationary Officer', exam: 'IBPS PO', salary: '₹4-8 LPA' },
    { name: 'Bank Clerk', fullName: 'Clerical Cadre', exam: 'IBPS Clerk', salary: '₹2.5-4 LPA' },
    { name: 'SBI PO', fullName: 'State Bank PO', exam: 'SBI PO', salary: '₹8-13 LPA' },
    { name: 'RBI Grade B', fullName: 'Reserve Bank Officer', exam: 'RBI Grade B', salary: '₹15-20 LPA' }
  ],
  railways: [
    { name: 'NTPC', fullName: 'Non-Technical Popular Categories', exam: 'RRB NTPC', salary: '₹1.9-7 LPA' },
    { name: 'JE', fullName: 'Junior Engineer', exam: 'RRB JE', salary: '₹3.5-9 LPA' },
    { name: 'ALP', fullName: 'Assistant Loco Pilot', exam: 'RRB ALP', salary: '₹1.9-6.5 LPA' }
  ],
  defence: [
    { name: 'CDS', fullName: 'Combined Defence Services', exam: 'UPSC CDS', salary: '₹5-15 LPA' },
    { name: 'NDA', fullName: 'National Defence Academy', exam: 'UPSC NDA', salary: '₹5-15 LPA' },
    { name: 'AFCAT', fullName: 'Air Force Common Admission Test', exam: 'AFCAT', salary: '₹5-15 LPA' }
  ]
};

// Skills relevant to Indian job market
export const indianSkillsFramework = {
  technical: {
    software: ['Java', 'Python', 'JavaScript', 'C++', 'React', 'Angular', 'Node.js', 'Spring Boot', 'Django'],
    data: ['SQL', 'Power BI', 'Tableau', 'Excel', 'Python', 'R', 'Machine Learning', 'Data Analytics'],
    finance: ['Tally', 'SAP', 'Advanced Excel', 'Financial Modeling', 'GST', 'Taxation', 'Audit'],
    design: ['Photoshop', 'Illustrator', 'Figma', 'CorelDraw', 'AutoCAD', 'SolidWorks']
  },
  certifications: {
    technology: ['AWS Certified', 'Google Cloud Certified', 'Microsoft Azure', 'Oracle Certified', 'Cisco CCNA'],
    finance: ['CFA', 'FRM', 'CA', 'CS', 'CMA', 'ACCA'],
    digital: ['Google Ads', 'Facebook Blueprint', 'HubSpot', 'Salesforce', 'Digital Marketing Institute'],
    project: ['PMP', 'PRINCE2', 'Agile/Scrum Master', 'Six Sigma']
  },
  languages: {
    programming: ['Java', 'Python', 'JavaScript', 'C++', 'C#', 'PHP', 'Swift', 'Kotlin'],
    spoken: ['English', 'Hindi', 'Regional Languages (Tamil, Telugu, Marathi, Bengali, Gujarati)']
  }
};

// Student-specific career guidance
export const studentCareerGuidance = {
  byStream: {
    science: {
      topCareers: [
        'Software Engineer',
        'Data Scientist',
        'Doctor',
        'Research Scientist',
        'Product Manager',
        'Environmental Scientist',
        'Robotics Engineer'
      ],
      emergingFields: ['AI/ML Engineer', 'Cybersecurity Specialist', 'Biotech Researcher', 'Space Technology'],
      recommendedSkills: ['Programming', 'Mathematics', 'Research', 'Problem Solving', 'Critical Thinking']
    },
    engineering: {
      topCareers: [
        'Mechanical Engineer',
        'Civil Engineer',
        'Electrical Engineer',
        'Software Developer',
        'Automobile Engineer',
        'Aerospace Engineer',
        'Chemical Engineer'
      ],
      emergingFields: ['Robotics', 'Renewable Energy', 'Nanotechnology', 'Smart Infrastructure'],
      recommendedSkills: ['Design', 'Mathematics', 'Technical Drawing', 'Project Management', 'Problem Solving']
    },
    medical: {
      topCareers: [
        'Surgeon',
        'Pediatrician',
        'Dentist',
        'Pharmacist',
        'Veterinarian',
        'Radiologist',
        'Psychiatrist'
      ],
      emergingFields: ['Genetics', 'Telemedicine', 'Medical Informatics', 'Healthcare Management'],
      recommendedSkills: ['Biology', 'Empathy', 'Attention to Detail', 'Communication', 'Teamwork']
    },
    commerce: {
      topCareers: [
        'Financial Analyst',
        'Investment Banking',
        'Management Consultant',
        'Entrepreneur',
        'CA/CS',
        'Supply Chain Manager',
        'Insurance Underwriter'
      ],
      emergingFields: ['Fintech', 'Digital Marketing', 'Business Analytics', 'E-commerce'],
      recommendedSkills: ['Financial Analysis', 'Business Strategy', 'Communication', 'Leadership', 'Excel']
    },
    arts: {
      topCareers: [
        'Civil Services',
        'Journalism',
        'Teaching',
        'Content Writer',
        'Social Worker',
        'Psychologist',
        'Event Manager'
      ],
      emergingFields: ['Digital Content', 'UX Writing', 'Policy Research', 'NGO Leadership'],
      recommendedSkills: ['Communication', 'Research', 'Writing', 'Critical Thinking', 'Empathy']
    }
  },
  
  internshipOpportunities: {
    technology: ['Flipkart', 'Amazon', 'Microsoft', 'Google', 'Zomato', 'Paytm'],
    finance: ['Goldman Sachs', 'JP Morgan', 'Deutsche Bank', 'HDFC Bank', 'ICICI Bank'],
    consulting: ['McKinsey', 'BCG', 'Bain', 'Deloitte', 'PwC', 'EY'],
    startups: ['InternShala', 'LetsIntern', 'Twenty19', 'Forage', 'Verzeo']
  },

  collegeRankings: {
    engineering: [
      'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
      'BITS Pilani', 'NIT Trichy', 'IIIT Hyderabad', 'DTU', 'NSIT'
    ],
    management: [
      'IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta', 'IIM Lucknow', 'IIM Kozhikode',
      'XLRI Jamshedpur', 'FMS Delhi', 'IIFT Delhi', 'MDI Gurgaon', 'SPJIMR Mumbai'
    ],
    medical: [
      'AIIMS Delhi', 'AIIMS Bangalore', 'JIPMER Puducherry', 'CMC Vellore', 'AFMC Pune',
      'King George Medical University', 'BHU Varanasi', 'MAMC Delhi'
    ]
  }
};