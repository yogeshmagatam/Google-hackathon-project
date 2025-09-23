# 🎯 AI Career & Skills Advisor - Enhanced Edition

A comprehensive web application that provides personalized career guidance and skills development recommendations using AI technology. This enhanced version includes **5 major new features** that transform it into a complete career development platform.

## ✨ New Features Added

### 🔐 1. User Authentication & Persistent Profiles
- **NextAuth.js integration** with Google/GitHub OAuth
- **Persistent user sessions** - no more data loss on refresh
- **User profiles** with career-specific fields
- **Secure data storage** with Prisma ORM

### 📄 2. Resume Upload & AI Analysis
- **PDF resume upload** with drag-and-drop interface
- **AI-powered text extraction** and analysis
- **Skill identification** (technical, soft skills, tools)
- **Comprehensive scoring** with improvement recommendations
- **Career level assessment** (entry/mid/senior/executive)


### 💼 4. Job Recommendations Engine
- **AI-powered job matching** based on user profile
- **Fit score calculation** (skill matching + career level)
- **Real-time job filtering** (high-fit, remote, salary)
- **Job bookmarking** and application tracking
- **Multiple job sources** integration ready


## 🚀 Original Features (Enhanced)

### 🤖 AI Career Chatbot
- Enhanced with **multi-provider support** (OpenAI, Google AI, Anthropic, etc.)
- **Conversation history** with search and organization
- **Context-aware responses** based on user profile
- **Quick action buttons** for common queries

### 📊 Skills Assessment
- **Database integration** for result persistence
- **Progress tracking** over multiple assessments
- **Enhanced reporting** with visual analytics
- **Career goal alignment** scoring

### 📈 Assessment Reports
- **Historical comparison** with previous assessments
- **Trend analysis** and improvement tracking
- **Action-oriented recommendations**
- **Integration with learning paths**

## �️ Technology Stack

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with OAuth providers
- **Database**: Prisma ORM with SQLite (production-ready for PostgreSQL)
- **AI Integration**: Multi-provider support (OpenAI, Google AI, Anthropic, etc.)
- **File Processing**: PDF parsing with AI analysis
- **Charts**: Recharts for data visualization
- **UI Components**: Radix UI for accessible components

## � Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### 1. Clone and Install
```bash
git clone <repository-url>
cd career-advisor-ai
npm install
```

### 2. Environment Setup
Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# OAuth Providers (Get from Google/GitHub Developer Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# AI Provider Configuration
AI_PROVIDER=google
GOOGLE_AI_API_KEY=your-google-ai-api-key
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
GROQ_API_KEY=your-groq-api-key

# Optional: Job API Integration
RAPIDAPI_KEY=your-rapidapi-key-for-job-apis

# AI Settings
MAX_TOKENS=1000
TEMPERATURE=0.7
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 4. OAuth Setup

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

#### GitHub OAuth:
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 How to Use

### 1. AI Career Chat
- Start a conversation with the AI career advisor
- Ask questions about career paths, industry trends, or skill development
- Get personalized advice based on your situation
- Use quick action buttons for common queries

### 2. Skills Assessment
- Complete the comprehensive skills evaluation
- Rate your technical and soft skills (1-5 scale)
- Specify your experience level and career goals
- Select your areas of interest

### 3. View Assessment Report
- Review your detailed assessment results
- Explore recommended career paths with match percentages
- Access personalized learning plans
- Download or share your report

## 🎯 Key Components

### CareerAdvisorChat
- Real-time chat interface with AI responses
- Message history and conversation context
- Quick action buttons for common queries
- Markdown support for formatted responses

### SkillAssessment
- Multi-step assessment wizard
- Progress tracking and validation
- Interactive skill rating system
- Career goals and interests selection

### AssessmentReport
- Comprehensive results visualization
- Expandable sections for detailed analysis
- Career recommendations with match scores
- Learning path suggestions with resources

## 🧠 AI Career Advisory Logic

The application includes a sophisticated career advisory system that:

- Analyzes user messages for career-related intents
- Provides industry-specific insights and trends
- Generates personalized learning recommendations
- Offers career transition guidance
- Delivers context-aware advice based on conversation history

### Supported Career Areas
- Technology & Software Development
- Healthcare & Medical
- Finance & Banking
- Education & Training
- Marketing & Sales
- And many more...

## 📊 Assessment Features

### Skills Categories
- **Technical Skills**: Programming, Data Analysis, Digital Marketing, etc.
- **Soft Skills**: Communication, Leadership, Problem Solving, etc.
- **Analytical Skills**: Critical Thinking, Research, Strategic Planning, etc.
- **Creative Skills**: Content Creation, Design, Innovation, etc.

### Career Stage Support
- Entry Level (0-2 years)
- Mid-Career (3-5 years)
- Senior Level (6-10 years)
- Executive Level (10+ years)
- Career Changers

## 🎨 Styling & Design

- Modern gradient backgrounds
- Responsive grid layouts
- Interactive hover effects
- Consistent color scheme
- Accessible design principles
- Mobile-first approach

## 🚀 Deployment

The application is ready for deployment on Vercel:

```bash
npm run build
npm run start
```

Or deploy directly to Vercel:
```bash
vercel deploy
```

## 🔮 Future Enhancements

- Integration with external AI APIs (OpenAI, Claude)
- User authentication and profile management
- Career progress tracking over time
- Job market data integration
- Resume analysis and improvement suggestions
- Interview preparation modules
- Networking recommendations
- Industry-specific certifications tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- Tailwind CSS for the utility-first styling
- Lucide React for the beautiful icons
- The open-source community for inspiration and resources

---

**Built with ❤️ for career development and professional growth**


