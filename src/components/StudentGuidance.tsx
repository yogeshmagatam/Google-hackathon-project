'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Building, MapPin, Star, ExternalLink, Filter, BookOpen, Award, Users, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import { AnimatedButton, AnimatedCard, StaggeredGrid } from '@/components/animations'
import { studentCareerGuidance, indianEducationSystem } from '@/lib/indian-career-context'

interface College {
  id: string
  name: string
  location: string
  type: 'IIT' | 'NIT' | 'IIM' | 'Medical' | 'Private' | 'Government'
  rating: number
  averagePackage: string
  topRecruiters: string[]
  courses: string[]
  entranceExam: string
  fees: string
  website: string
}

interface Internship {
  id: string
  title: string
  company: string
  location: string
  duration: string
  stipend: string
  description: string
  requirements: string[]
  type: 'Tech' | 'Finance' | 'Consulting' | 'Marketing' | 'Research'
  applicationDeadline: string
  applyUrl: string
}

const tabList = [
  { key: 'colleges', label: 'Top Colleges', icon: Building },
  { key: 'internships', label: 'Internships', icon: BookOpen },
  { key: 'career-paths', label: 'Career Paths', icon: Award }
];

const StudentGuidance = () => {
  const [activeTab, setActiveTab] = useState('colleges')
  const [selectedType, setSelectedType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const router = useRouter()

  // Mock college data based on Indian context
  const colleges: College[] = [
    {
      id: '1',
      name: 'IIT Bombay',
      location: 'Mumbai, Maharashtra',
      type: 'IIT',
      rating: 4.9,
      averagePackage: '₹20-25 LPA', 
      topRecruiters: ['Google', 'Microsoft', 'Goldman Sachs', 'McKinsey'],
      courses: ['B.Tech CSE', 'B.Tech EE', 'B.Tech Mechanical', 'M.Tech', 'MBA'],
      entranceExam: 'JEE Advanced',
      fees: '₹2,50,000/year',
      website: 'https://www.iitb.ac.in/'
    },
    {
      id: '2',
      name: 'AIIMS Delhi',
      location: 'New Delhi',
      type: 'Medical',
      rating: 4.8,
      averagePackage: '₹12-15 LPA',
      topRecruiters: ['Apollo Hospitals', 'Fortis', 'Max Healthcare', 'PGIMER'],
      courses: ['MBBS', 'MD', 'MS', 'DM', 'MCh'],
      entranceExam: 'NEET',
      fees: '₹1,50,000/year',
      website: 'https://www.aiims.edu/en.html'
    },
    {
      id: '3',
      name: 'IIM Ahmedabad',
      location: 'Ahmedabad, Gujarat',
      type: 'IIM',
      rating: 4.9,
      averagePackage: '₹25-30 LPA',
      topRecruiters: ['McKinsey', 'BCG', 'Bain', 'Goldman Sachs', 'JP Morgan'],
      courses: ['MBA', 'PGPX', 'PhD'],
      entranceExam: 'CAT',
      fees: '₹23,00,000 (2 years)',
      website: 'https://www.iima.ac.in/'
    },
    {
      id: '4',
      name: 'BITS Pilani',
      location: 'Pilani, Rajasthan',
      type: 'Private',
      rating: 4.7,
      averagePackage: '₹15-20 LPA',
      topRecruiters: ['Microsoft', 'Amazon', 'Google', 'Adobe', 'Flipkart'],
      courses: ['B.E.', 'M.Sc.', 'MBA', 'PhD'],
      entranceExam: 'BITSAT',
      fees: '₹4,50,000/year',
      website: 'https://www.bits-pilani.ac.in/'
    },
    {
      id: '5',
      name: 'NIT Trichy',
      location: 'Tiruchirappalli, Tamil Nadu',
      type: 'NIT',
      rating: 4.6,
      averagePackage: '₹10-15 LPA',
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant'],
      courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'],
      entranceExam: 'JEE Main',
      fees: '₹1,50,000/year',
      website: 'https://www.nitt.edu/'
    },
      {
        id: '11',
        name: 'IIT Delhi',
        location: 'New Delhi',
        type: 'IIT',
        rating: 4.8,
        averagePackage: '₹18-22 LPA',
        topRecruiters: ['Google', 'Amazon', 'Microsoft', 'Apple'],
        courses: ['B.Tech CSE', 'B.Tech Civil', 'M.Tech', 'PhD'],
        entranceExam: 'JEE Advanced',
        fees: '₹2,40,000/year',
        website: 'https://home.iitd.ac.in/'
      },
      {
        id: '12',
        name: 'IIT Madras',
        location: 'Chennai, Tamil Nadu',
        type: 'IIT',
        rating: 4.8,
        averagePackage: '₹17-21 LPA',
        topRecruiters: ['Microsoft', 'Google', 'Qualcomm', 'Texas Instruments'],
        courses: ['B.Tech', 'M.Tech', 'MS', 'PhD'],
        entranceExam: 'JEE Advanced',
        fees: '₹2,30,000/year',
        website: 'https://www.iitm.ac.in/'
      },
      {
        id: '13',
        name: 'IIT Kanpur',
        location: 'Kanpur, Uttar Pradesh',
        type: 'IIT',
        rating: 4.7,
        averagePackage: '₹16-20 LPA',
        topRecruiters: ['Google', 'Amazon', 'Flipkart', 'Ola'],
        courses: ['B.Tech', 'M.Tech', 'MBA', 'PhD'],
        entranceExam: 'JEE Advanced',
        fees: '₹2,20,000/year',
        website: 'https://www.iitk.ac.in/'
      },
      {
        id: '14',
        name: 'IIT Kharagpur',
        location: 'Kharagpur, West Bengal',
        type: 'IIT',
        rating: 4.7,
        averagePackage: '₹15-19 LPA',
        topRecruiters: ['Microsoft', 'Google', 'Tata Steel', 'Wipro'],
        courses: ['B.Tech', 'M.Tech', 'LLB', 'PhD'],
        entranceExam: 'JEE Advanced',
        fees: '₹2,10,000/year',
        website: 'https://www.iitkgp.ac.in/'
      },
      {
        id: '15',
        name: 'NIT Surathkal',
        location: 'Mangalore, Karnataka',
        type: 'NIT',
        rating: 4.5,
        averagePackage: '₹9-13 LPA',
        topRecruiters: ['Amazon', 'Microsoft', 'TCS', 'Wipro'],
        courses: ['B.Tech', 'M.Tech', 'MBA'],
        entranceExam: 'JEE Main',
        fees: '₹1,40,000/year',
        website: 'https://www.nitk.ac.in/'
      },
      {
        id: '16',
        name: 'NIT Warangal',
        location: 'Warangal, Telangana',
        type: 'NIT',
        rating: 4.5,
        averagePackage: '₹8-12 LPA',
        topRecruiters: ['TCS', 'Infosys', 'Cognizant', 'Capgemini'],
        courses: ['B.Tech', 'M.Tech', 'PhD'],
        entranceExam: 'JEE Main',
        fees: '₹1,35,000/year',
        website: 'https://www.nitw.ac.in/'
      },
      {
        id: '17',
        name: 'NIT Rourkela',
        location: 'Rourkela, Odisha',
        type: 'NIT',
        rating: 4.4,
        averagePackage: '₹7-11 LPA',
        topRecruiters: ['TCS', 'Wipro', 'Infosys', 'Vedanta'],
        courses: ['B.Tech', 'M.Tech', 'MBA'],
        entranceExam: 'JEE Main',
        fees: '₹1,30,000/year',
        website: 'https://www.nitrkl.ac.in/'
      },
      {
        id: '18',
        name: 'NIT Calicut',
        location: 'Calicut, Kerala',
        type: 'NIT',
        rating: 4.3,
        averagePackage: '₹6-10 LPA',
        topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant'],
        courses: ['B.Tech', 'M.Tech', 'PhD'],
        entranceExam: 'JEE Main',
        fees: '₹1,25,000/year',
        website: 'https://www.nitc.ac.in/'
      },
      {
        id: '19',
        name: 'IIM Bangalore',
        location: 'Bangalore, Karnataka',
        type: 'IIM',
        rating: 4.8,
        averagePackage: '₹24-28 LPA',
        topRecruiters: ['McKinsey', 'BCG', 'Amazon', 'Accenture'],
        courses: ['MBA', 'PGPEM', 'PhD'],
        entranceExam: 'CAT',
        fees: '₹23,00,000 (2 years)',
        website: 'https://www.iimb.ac.in/'
      },
      {
        id: '20',
        name: 'IIM Calcutta',
        location: 'Kolkata, West Bengal',
        type: 'IIM',
        rating: 4.8,
        averagePackage: '₹23-27 LPA',
        topRecruiters: ['BCG', 'McKinsey', 'Goldman Sachs', 'Tata'],
        courses: ['MBA', 'PGDBA', 'PhD'],
        entranceExam: 'CAT',
        fees: '₹22,00,000 (2 years)',
        website: 'https://www.iimcal.ac.in/'
      },
      {
        id: '21',
        name: 'IIM Lucknow',
        location: 'Lucknow, Uttar Pradesh',
        type: 'IIM',
        rating: 4.7,
        averagePackage: '₹22-26 LPA',
        topRecruiters: ['Amazon', 'Accenture', 'Deloitte', 'HUL'],
        courses: ['MBA', 'PGP', 'PhD'],
        entranceExam: 'CAT',
        fees: '₹21,00,000 (2 years)',
        website: 'https://www.iiml.ac.in/'
      },
      {
        id: '22',
        name: 'IIM Indore',
        location: 'Indore, Madhya Pradesh',
        type: 'IIM',
        rating: 4.6,
        averagePackage: '₹21-25 LPA',
        topRecruiters: ['Deloitte', 'Amazon', 'BCG', 'ICICI'],
        courses: ['MBA', 'IPM', 'PhD'],
        entranceExam: 'CAT',
        fees: '₹20,00,000 (2 years)',
        website: 'https://www.iimidr.ac.in/'
      },
      {
        id: '23',
        name: 'CMC Vellore',
        location: 'Vellore, Tamil Nadu',
        type: 'Medical',
        rating: 4.7,
        averagePackage: '₹10-13 LPA',
        topRecruiters: ['Apollo Hospitals', 'Fortis', 'Max Healthcare'],
        courses: ['MBBS', 'MD', 'MS', 'B.Sc Nursing'],
        entranceExam: 'NEET',
        fees: '₹1,20,000/year',
        website: 'https://www.cmch-vellore.edu/'
      },
      {
        id: '24',
        name: 'JIPMER',
        location: 'Puducherry',
        type: 'Medical',
        rating: 4.6,
        averagePackage: '₹9-12 LPA',
        topRecruiters: ['AIIMS', 'Apollo Hospitals', 'Fortis'],
        courses: ['MBBS', 'MD', 'MS', 'B.Sc Nursing'],
        entranceExam: 'NEET',
        fees: '₹1,10,000/year',
        website: 'https://www.jipmer.edu.in/'
      },
      {
        id: '25',
        name: 'Kasturba Medical College',
        location: 'Manipal, Karnataka',
        type: 'Medical',
        rating: 4.5,
        averagePackage: '₹8-11 LPA',
        topRecruiters: ['Manipal Hospitals', 'Apollo', 'Fortis'],
        courses: ['MBBS', 'MD', 'MS', 'BPT'],
        entranceExam: 'NEET',
        fees: '₹1,00,000/year',
        website: 'https://manipal.edu/kmc-manipal.html'
      },
      {
        id: '26',
        name: 'Maulana Azad Medical College',
        location: 'New Delhi',
        type: 'Medical',
        rating: 4.5,
        averagePackage: '₹7-10 LPA',
        topRecruiters: ['Apollo', 'Fortis', 'Max Healthcare'],
        courses: ['MBBS', 'MD', 'MS'],
        entranceExam: 'NEET',
        fees: '₹90,000/year',
        website: 'https://www.mamc.ac.in/'
      },
      {
        id: '27',
        name: 'VIT Vellore',
        location: 'Vellore, Tamil Nadu',
        type: 'Private',
        rating: 4.6,
        averagePackage: '₹7-10 LPA',
        topRecruiters: ['Amazon', 'Microsoft', 'TCS', 'Wipro'],
        courses: ['B.Tech', 'M.Tech', 'MBA'],
        entranceExam: 'VITEEE',
        fees: '₹3,00,000/year',
        website: 'https://vit.ac.in/'
      },
      {
        id: '28',
        name: 'SRM Institute of Science and Technology',
        location: 'Chennai, Tamil Nadu',
        type: 'Private',
        rating: 4.5,
        averagePackage: '₹6-9 LPA',
        topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant'],
        courses: ['B.Tech', 'M.Tech', 'MBA'],
        entranceExam: 'SRMJEEE',
        fees: '₹2,80,000/year',
        website: 'https://www.srmist.edu.in/'
      },
      {
        id: '29',
        name: 'Manipal University',
        location: 'Manipal, Karnataka',
        type: 'Private',
        rating: 4.5,
        averagePackage: '₹6-8 LPA',
        topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant'],
        courses: ['B.Tech', 'M.Tech', 'MBA', 'BBA'],
        entranceExam: 'MET',
        fees: '₹3,20,000/year',
        website: 'https://manipal.edu/'
      },
      {
        id: '30',
        name: 'Amity University',
        location: 'Noida, Uttar Pradesh',
        type: 'Private',
        rating: 4.4,
        averagePackage: '₹5-7 LPA',
        topRecruiters: ['TCS', 'Wipro', 'Infosys', 'Cognizant'],
        courses: ['B.Tech', 'MBA', 'BBA', 'M.Tech'],
        entranceExam: 'Amity JEE',
        fees: '₹2,50,000/year',
        website: 'https://www.amity.edu/'
      },
    // Government Colleges
    {
      id: '6',
      name: 'Delhi University (DU)',
      location: 'New Delhi',
      type: 'Government',
      rating: 4.5,
      averagePackage: '₹6-10 LPA',
      topRecruiters: ['Deloitte', 'KPMG', 'EY', 'Google', 'ZS Associates'],
      courses: ['B.A.', 'B.Sc.', 'B.Com', 'M.A.', 'M.Sc.', 'MBA'],
      entranceExam: 'CUET',
      fees: '₹20,000/year',
      website: 'https://www.du.ac.in/'
    },
    {
      id: '7',
      name: 'Jadavpur University',
      location: 'Kolkata, West Bengal',
      type: 'Government',
      rating: 4.4,
      averagePackage: '₹5-8 LPA',
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'IBM'],
      courses: ['B.Tech', 'M.Tech', 'B.A.', 'M.A.', 'PhD'],
      entranceExam: 'WBJEE',
      fees: '₹12,000/year',
      website: 'https://www.jaduniv.edu.in/'
    },
    {
      id: '8',
      name: 'BHU (Banaras Hindu University)',
      location: 'Varanasi, Uttar Pradesh',
      type: 'Government',
      rating: 4.3,
      averagePackage: '₹4-7 LPA',
      topRecruiters: ['ICICI Bank', 'HDFC Bank', 'TCS', 'Wipro', 'Dabur'],
      courses: ['B.Sc.', 'B.A.', 'B.Com', 'M.Sc.', 'MBA', 'PhD'],
      entranceExam: 'CUET',
      fees: '₹15,000/year',
      website: 'https://www.bhu.ac.in/'
    },
    {
      id: '9',
      name: 'Presidency University',
      location: 'Kolkata, West Bengal',
      type: 'Government',
      rating: 4.2,
      averagePackage: '₹3-6 LPA',
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant'],
      courses: ['B.Sc.', 'B.A.', 'M.Sc.', 'M.A.', 'PhD'],
      entranceExam: 'PUBDET',
      fees: '₹10,000/year',
      website: 'https://www.presiuniv.ac.in/'
    },
    {
      id: '10',
      name: 'Osmania University',
      location: 'Hyderabad, Telangana',
      type: 'Government',
      rating: 4.1,
      averagePackage: '₹3-5 LPA',
      topRecruiters: ['Infosys', 'Wipro', 'TCS', 'Capgemini'],
      courses: ['B.Sc.', 'B.A.', 'B.Com', 'M.Sc.', 'MBA'],
      entranceExam: 'TS EAMCET',
      fees: '₹15,000/year',
      website: 'https://www.osmania.ac.in/'
    }
  ]

  // Mock internship data
  const internships: Internship[] = [
    {
      id: '1',
      title: 'Software Development Intern',
      company: 'Flipkart',
      location: 'Bangalore, Karnataka',
      duration: '2-3 months',
      stipend: '₹50,000/month',
      description: 'Work on cutting-edge e-commerce platform features. Gain hands-on experience with large-scale distributed systems.',
      requirements: ['Java/Python', 'Data Structures', 'System Design', 'Problem Solving'],
      type: 'Tech',
      applicationDeadline: '15th November 2024',
      applyUrl: 'https://www.flipkart.com/careers'
    },
    {
      id: '6',
      title: 'Frontend Developer Intern',
      company: 'Google',
      location: 'Hyderabad, Telangana',
      duration: '3 months',
      stipend: '₹60,000/month',
      description: 'Build UI components for Google products. Collaborate with design and backend teams.',
      requirements: ['React', 'JavaScript', 'CSS', 'Teamwork'],
      type: 'Tech',
      applicationDeadline: '10th December 2024',
      applyUrl: 'https://careers.google.com/'
    },
    {
      id: '7',
      title: 'Data Science Intern',
      company: 'Microsoft',
      location: 'Bangalore, Karnataka',
      duration: '2 months',
      stipend: '₹55,000/month',
      description: 'Analyze large datasets and build predictive models for Microsoft products.',
      requirements: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
      type: 'Tech',
      applicationDeadline: '5th December 2024',
      applyUrl: 'https://careers.microsoft.com/'
    },
    {
      id: '8',
      title: 'Mobile App Developer Intern',
      company: 'Paytm',
      location: 'Noida, Uttar Pradesh',
      duration: '3 months',
      stipend: '₹45,000/month',
      description: 'Develop and test mobile applications for Paytm platform.',
      requirements: ['Kotlin', 'Android', 'Problem Solving', 'APIs'],
      type: 'Tech',
      applicationDeadline: '20th December 2024',
      applyUrl: 'https://paytm.com/careers'
    },
    {
      id: '9',
      title: 'Backend Developer Intern',
      company: 'Amazon',
      location: 'Chennai, Tamil Nadu',
      duration: '2 months',
      stipend: '₹50,000/month',
      description: 'Work on scalable backend systems for Amazon services.',
      requirements: ['Node.js', 'Databases', 'Cloud', 'Teamwork'],
      type: 'Tech',
      applicationDeadline: '18th December 2024',
      applyUrl: 'https://www.amazon.jobs/en/'
    },
    {
      id: '2',
      title: 'Investment Banking Intern',
      company: 'Goldman Sachs',
      location: 'Mumbai, Maharashtra',
      duration: '10 weeks',
      stipend: '₹1,00,000/month',
      description: 'Support deal execution, financial modeling, and client presentations in Investment Banking Division.',
      requirements: ['Finance Background', 'Excel', 'Financial Modeling', 'Communication'],
      type: 'Finance',
      applicationDeadline: '30th October 2024',
      applyUrl: 'https://www.goldmansachs.com/careers/'
    },
    {
      id: '10',
      title: 'Financial Analyst Intern',
      company: 'ICICI Bank',
      location: 'Mumbai, Maharashtra',
      duration: '2 months',
      stipend: '₹40,000/month',
      description: 'Assist in financial analysis and reporting for ICICI Bank.',
      requirements: ['Excel', 'Finance', 'Reporting', 'Communication'],
      type: 'Finance',
      applicationDeadline: '10th November 2024',
      applyUrl: 'https://www.icicicareers.com/'
    },
    {
      id: '11',
      title: 'Audit Intern',
      company: 'KPMG',
      location: 'Delhi',
      duration: '3 months',
      stipend: '₹35,000/month',
      description: 'Support audit teams in financial audits and compliance checks.',
      requirements: ['Accounting', 'Excel', 'Attention to Detail', 'Teamwork'],
      type: 'Finance',
      applicationDeadline: '15th November 2024',
      applyUrl: 'https://home.kpmg/in/en/home/careers.html'
    },
    {
      id: '12',
      title: 'Risk Management Intern',
      company: 'HDFC Bank',
      location: 'Pune, Maharashtra',
      duration: '2 months',
      stipend: '₹38,000/month',
      description: 'Assist in risk analysis and management for HDFC Bank.',
      requirements: ['Risk Analysis', 'Excel', 'Finance', 'Communication'],
      type: 'Finance',
      applicationDeadline: '22nd November 2024',
      applyUrl: 'https://www.hdfcbank.com/careers'
    },
    {
      id: '13',
      title: 'Equity Research Intern',
      company: 'Motilal Oswal',
      location: 'Mumbai, Maharashtra',
      duration: '2 months',
      stipend: '₹36,000/month',
      description: 'Conduct equity research and prepare investment reports.',
      requirements: ['Equity Research', 'Finance', 'Excel', 'Analysis'],
      type: 'Finance',
      applicationDeadline: '28th November 2024',
      applyUrl: 'https://careers.motilaloswal.com/'
    },
    {
      id: '3',
      title: 'Management Consulting Intern',
      company: 'McKinsey & Company',
      location: 'Mumbai, Maharashtra',
      duration: '8 weeks',
      stipend: '₹80,000/month',
      description: 'Work with Fortune 500 clients on strategy and operations projects. Mentorship from senior consultants.',
      requirements: ['MBA/B.Tech', 'Problem Solving', 'Communication', 'Analytics'],
      type: 'Consulting',
      applicationDeadline: '20th November 2024',
      applyUrl: 'https://www.mckinsey.com/careers'
    },
    {
      id: '14',
      title: 'Strategy Consulting Intern',
      company: 'BCG',
      location: 'Bangalore, Karnataka',
      duration: '2 months',
      stipend: '₹75,000/month',
      description: 'Support strategy projects for BCG clients in India.',
      requirements: ['Strategy', 'Analytics', 'Communication', 'Teamwork'],
      type: 'Consulting',
      applicationDeadline: '18th November 2024',
      applyUrl: 'https://careers.bcg.com/'
    },
    {
      id: '15',
      title: 'Business Analyst Intern',
      company: 'Deloitte',
      location: 'Hyderabad, Telangana',
      duration: '2 months',
      stipend: '₹70,000/month',
      description: 'Assist in business analysis and process improvement projects.',
      requirements: ['Business Analysis', 'Excel', 'Problem Solving', 'Communication'],
      type: 'Consulting',
      applicationDeadline: '25th November 2024',
      applyUrl: 'https://www2.deloitte.com/in/en/careers.html'
    },
    {
      id: '16',
      title: 'Operations Consulting Intern',
      company: 'Accenture',
      location: 'Gurgaon, Haryana',
      duration: '2 months',
      stipend: '₹65,000/month',
      description: 'Work on operations and supply chain consulting projects.',
      requirements: ['Operations', 'Supply Chain', 'Excel', 'Teamwork'],
      type: 'Consulting',
      applicationDeadline: '30th November 2024',
      applyUrl: 'https://www.accenture.com/in-en/careers'
    },
    {
      id: '17',
      title: 'Market Research Intern',
      company: 'Nielsen',
      location: 'Mumbai, Maharashtra',
      duration: '2 months',
      stipend: '₹60,000/month',
      description: 'Conduct market research and data analysis for Nielsen clients.',
      requirements: ['Market Research', 'Excel', 'Analysis', 'Communication'],
      type: 'Consulting',
      applicationDeadline: '5th December 2024',
      applyUrl: 'https://www.nielsen.com/careers/'
    },
    {
      id: '4',
      title: 'Product Marketing Intern',
      company: 'Zomato',
      location: 'Gurgaon, Haryana',
      duration: '3 months',
      stipend: '₹35,000/month',
      description: 'Drive go-to-market strategies for new product launches. Work closely with product and marketing teams.',
      requirements: ['Marketing', 'Analytics', 'Content Creation', 'Communication'],
      type: 'Marketing',
      applicationDeadline: '25th October 2024',
      applyUrl: 'https://www.zomato.com/careers'
    },
    {
      id: '18',
      title: 'Digital Marketing Intern',
      company: 'Byju’s',
      location: 'Bangalore, Karnataka',
      duration: '2 months',
      stipend: '₹30,000/month',
      description: 'Assist in digital marketing campaigns and social media management.',
      requirements: ['Digital Marketing', 'SEO', 'Content Creation', 'Analytics'],
      type: 'Marketing',
      applicationDeadline: '10th November 2024',
      applyUrl: 'https://byjus.com/careers/'
    },
    {
      id: '19',
      title: 'Brand Management Intern',
      company: 'HUL',
      location: 'Mumbai, Maharashtra',
      duration: '2 months',
      stipend: '₹32,000/month',
      description: 'Support brand management and marketing strategy for HUL products.',
      requirements: ['Brand Management', 'Marketing', 'Analytics', 'Communication'],
      type: 'Marketing',
      applicationDeadline: '15th November 2024',
      applyUrl: 'https://www.hul.in/careers/'
    },
    {
      id: '20',
      title: 'Content Marketing Intern',
      company: 'Unacademy',
      location: 'Remote',
      duration: '2 months',
      stipend: '₹28,000/month',
      description: 'Create and manage content for Unacademy’s marketing channels.',
      requirements: ['Content Marketing', 'Writing', 'SEO', 'Social Media'],
      type: 'Marketing',
      applicationDeadline: '20th November 2024',
      applyUrl: 'https://unacademy.com/careers'
    },
    {
      id: '21',
      title: 'Social Media Intern',
      company: 'Swiggy',
      location: 'Bangalore, Karnataka',
      duration: '2 months',
      stipend: '₹27,000/month',
      description: 'Manage and grow Swiggy’s social media presence.',
      requirements: ['Social Media', 'Content Creation', 'Marketing', 'Analytics'],
      type: 'Marketing',
      applicationDeadline: '25th November 2024',
      applyUrl: 'https://careers.swiggy.com/'
    },
    {
      id: '5',
      title: 'Research Intern',
      company: 'IIT Bombay',
      location: 'Mumbai, Maharashtra',
      duration: '6 months',
      stipend: '₹20,000/month',
      description: 'Research on AI/ML applications in healthcare. Opportunity to publish papers and attend conferences.',
      requirements: ['Python', 'Machine Learning', 'Research Aptitude', 'Mathematics'],
      type: 'Research',
      applicationDeadline: '10th December 2024',
      applyUrl: 'https://www.iitb.ac.in/en/research-opportunities'
    },
    {
      id: '22',
      title: 'Physics Research Intern',
      company: 'TIFR',
      location: 'Mumbai, Maharashtra',
      duration: '3 months',
      stipend: '₹25,000/month',
      description: 'Participate in physics research projects at TIFR.',
      requirements: ['Physics', 'Research', 'Data Analysis', 'Teamwork'],
      type: 'Research',
      applicationDeadline: '15th December 2024',
      applyUrl: 'https://www.tifr.res.in/'
    },
    {
      id: '23',
      title: 'Biotech Research Intern',
      company: 'IISc Bangalore',
      location: 'Bangalore, Karnataka',
      duration: '4 months',
      stipend: '₹22,000/month',
      description: 'Work on biotechnology research projects at IISc.',
      requirements: ['Biotechnology', 'Research', 'Lab Skills', 'Teamwork'],
      type: 'Research',
      applicationDeadline: '20th December 2024',
      applyUrl: 'https://iisc.ac.in/careers/'
    },
    {
      id: '24',
      title: 'AI Research Intern',
      company: 'Google Research',
      location: 'Bangalore, Karnataka',
      duration: '3 months',
      stipend: '₹30,000/month',
      description: 'Contribute to AI research projects at Google.',
      requirements: ['AI', 'Python', 'Machine Learning', 'Research'],
      type: 'Research',
      applicationDeadline: '25th December 2024',
      applyUrl: 'https://careers.google.com/'
    },
    {
      id: '25',
      title: 'Environmental Research Intern',
      company: 'TERI',
      location: 'New Delhi',
      duration: '2 months',
      stipend: '₹18,000/month',
      description: 'Assist in environmental research and sustainability projects.',
      requirements: ['Environmental Science', 'Research', 'Data Analysis', 'Teamwork'],
      type: 'Research',
      applicationDeadline: '30th December 2024',
      applyUrl: 'https://www.teriin.org/careers'
    },
  ]

  const filteredColleges = colleges.filter(college => {
    if (selectedType === 'all') return true
    return college.type === selectedType
  })

  const filteredInternships = internships.filter(internship => {
    if (selectedType === 'all') return true
    return internship.type === selectedType
  })

  const getTypeColor = (type: string) => {
    const colors = {
      'IIT': 'bg-red-100 text-black border-red-200',
      'NIT': 'bg-blue-100 text-black border-blue-200',
      'IIM': 'bg-green-100 text-black border-green-200',
      'Medical': 'bg-purple-100 text-black border-purple-200',
      'Private': 'bg-orange-100 text-black border-orange-200',
      'Government': 'bg-gray-100 text-black border-gray-200',
      'Tech': 'bg-blue-100 text-black border-blue-200',
      'Finance': 'bg-green-100 text-black border-green-200',
      'Consulting': 'bg-purple-100 text-black border-purple-200',
      'Marketing': 'bg-pink-100 text-black border-pink-200',
      'Research': 'bg-indigo-100 text-black border-indigo-200'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-black border-gray-200'
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </motion.div>
          Student Career Guidance
        </h2>
        <p className="text-gray-600">Comprehensive guidance for Indian students - Colleges, Internships & Career Paths</p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        className="flex justify-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
          {tabList.map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="flex justify-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {activeTab === 'colleges' && (
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All College Types</option>
            <option value="IIT">IITs</option>
            <option value="NIT">NITs</option>
            <option value="IIM">IIMs</option>
            <option value="Medical">Medical Colleges</option>
            <option value="Private">Private Colleges</option>
            <option value="Government">Government Colleges</option>
          </select>
        )}
        {activeTab === 'internships' && (
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Internship Types</option>
            <option value="Tech">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Consulting">Consulting</option>
            <option value="Marketing">Marketing</option>
            <option value="Research">Research</option>
          </select>
        )}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Colleges Tab */}
          {activeTab === 'colleges' && (
            <div className="space-y-4">
              {filteredColleges.map((college, index) => (
                <AnimatedCard 
                  key={college.id}
                  animation="hover"
                  delay={index * 0.1}
                  className="p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{college.name}</h3>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <MapPin className="w-4 h-4 text-white" />
                            <span className="text-white">{college.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(college.type)}`}>
                            {college.type}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium text-white">{college.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-white mb-1">Average Package</p>
                          <p className="font-semibold text-green-600">{college.averagePackage}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white mb-1">Entrance Exam</p>
                          <p className="font-semibold text-blue-600">{college.entranceExam}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white mb-1">Annual Fees</p>
                          <p className="font-semibold text-orange-600">{college.fees}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white mb-1">Popular Courses</p>
                          <p className="font-medium text-white">{college.courses.slice(0, 2).join(', ')}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-white mb-2">Top Recruiters:</p>
                        <div className="flex flex-wrap gap-2">
                          {college.topRecruiters.map((recruiter, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-black text-xs rounded-full">
                              {recruiter}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:ml-4">
                      <AnimatedButton
                        onClick={() => setExpandedCard(expandedCard === college.id ? null : college.id)}
                        variant="primary"
                        animation="glow"
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        {expandedCard === college.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {expandedCard === college.id ? 'Hide Details' : 'View Details'}
                      </AnimatedButton>
                      <AnimatedButton
                        onClick={() => window.open(college.website, '_blank')}
                        variant="secondary"
                        animation="bounce"
                        className="border-gray-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Apply Now
                      </AnimatedButton>
                    </div>

                    {/* Expanded Details Section for Colleges */}
                    <AnimatePresence>
                      {expandedCard === college.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-gray-200 col-span-full"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <h4 className="font-semibold text-white mb-2">Entrance Exam</h4>
                              <p className="text-white">{college.entranceExam}</p>
                              
                              <h4 className="font-semibold text-white mt-4 mb-2">Course Fees</h4>
                              <p className="text-white">{college.fees}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-white mb-2">All Courses</h4>
                              <div className="flex flex-wrap gap-1">
                                {college.courses.map((course, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-100 text-black text-xs rounded">
                                    {course}
                                  </span>
                                ))}
                              </div>
                              
                              <h4 className="font-semibold text-white mt-4 mb-2">College Type</h4>
                              <span className={`px-2 py-1 text-xs rounded ${getTypeColor(college.type)}`}>
                                {college.type}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          )}

          {/* Internships Tab */}
          {activeTab === 'internships' && (
            <div className="space-y-4">
              {filteredInternships.map((internship, index) => (
                <AnimatedCard 
                  key={internship.id}
                  animation="hover"
                  delay={index * 0.1}
                  className="p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{internship.title}</h3>
                          <p className="text-lg text-white">{internship.company}</p>
                          <div className="flex items-center gap-4 text-sm text-white mt-2">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {internship.location}
                            </div>
                            <span>Duration: {internship.duration}</span>
                            <span className="font-semibold text-green-600">{internship.stipend}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(internship.type)}`}>
                          {internship.type}
                        </span>
                      </div>

                      <p className="text-white mb-4">{internship.description}</p>

                      <div className="mb-4">
                        <p className="text-sm text-white mb-2">Requirements:</p>
                        <div className="flex flex-wrap gap-2">
                          {internship.requirements.map((req, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-sm text-white">
                        <span className="font-medium">Application Deadline:</span> {internship.applicationDeadline}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:ml-4">
                      <AnimatedButton
                        onClick={() => setExpandedCard(expandedCard === internship.id ? null : internship.id)}
                        variant="secondary"
                        animation="bounce"
                        className="border-gray-300"
                      >
                        {expandedCard === internship.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {expandedCard === internship.id ? 'Hide Details' : 'View Details'}
                      </AnimatedButton>
                      <AnimatedButton
                        onClick={() => window.open(internship.applyUrl, '_blank')}
                        variant="primary"
                        animation="glow"
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Apply Now
                      </AnimatedButton>
                    </div>

                    {/* Expanded Details Section for Internships */}
                    <AnimatePresence>
                      {expandedCard === internship.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-gray-200 col-span-full"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <h4 className="font-semibold text-white mb-2">Stipend Range</h4>
                              <p className="text-white">{internship.stipend}</p>
                              
                              <h4 className="font-semibold text-white mt-4 mb-2">Duration</h4>
                              <p className="text-white">{internship.duration}</p>
                              
                              <h4 className="font-semibold text-white mt-4 mb-2">Location Type</h4>
                              <p className="text-white">{internship.location}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-white mb-2">Skills You'll Learn</h4>
                              <div className="flex flex-wrap gap-1">
                                {internship.requirements.map((skill, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-green-100 text-black text-xs rounded">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                              
                              <h4 className="font-semibold text-white mt-4 mb-2">Application Process</h4>
                              <p className="text-white text-xs">Apply online → Resume screening → Technical round → HR round</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          )}

          {/* Career Paths Tab */}
          {activeTab === 'career-paths' && (
            <div className="space-y-6">
              {Object.entries(studentCareerGuidance.byStream).map(([stream, data], index) => (
                <AnimatedCard 
                  key={stream}
                  animation="hover"
                  delay={index * 0.1}
                  className="p-6"
                >
                  <div className="mb-4">
                    <h3 className="text-2xl font-semibold text-white capitalize mb-2">{stream} Stream</h3>
                    <p className="text-white">Popular career paths and emerging opportunities</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-500" />
                        Top Career Options
                      </h4>
                      <ul className="space-y-2">
                        {data.topCareers.map((career, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-white">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {career}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        Emerging Fields
                      </h4>
                      <ul className="space-y-2">
                        {data.emergingFields.map((field, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-white">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {field}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold text-white mb-3">Recommended Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.recommendedSkills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

export default StudentGuidance