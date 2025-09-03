import { type User, type InsertUser, type Resume, type InsertResume, type Internship, type InsertInternship, type Application, type InsertApplication, type ResumeAnalysis, type InsertResumeAnalysis, type InternshipWithMatch, type ApplicationWithDetails } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Resume operations
  createResume(resume: InsertResume): Promise<Resume>;
  getResumesByUserId(userId: string): Promise<Resume[]>;
  getResumeById(id: string): Promise<Resume | undefined>;
  updateResumeAnalysis(resumeId: string, analysis: Partial<Resume>): Promise<Resume | undefined>;

  // Internship operations
  getAllInternships(): Promise<Internship[]>;
  getInternshipById(id: string): Promise<Internship | undefined>;
  searchInternships(query: string, location?: string, industry?: string): Promise<Internship[]>;
  getMatchingInternships(resumeId: string): Promise<InternshipWithMatch[]>;

  // Application operations
  createApplication(application: InsertApplication): Promise<Application>;
  getApplicationsByUserId(userId: string): Promise<ApplicationWithDetails[]>;
  getApplicationById(id: string): Promise<ApplicationWithDetails | undefined>;
  updateApplicationStatus(id: string, status: string): Promise<Application | undefined>;

  // Resume analysis operations
  createResumeAnalysis(analysis: InsertResumeAnalysis): Promise<ResumeAnalysis>;
  getResumeAnalysis(resumeId: string, internshipId?: string): Promise<ResumeAnalysis | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private resumes: Map<string, Resume> = new Map();
  private internships: Map<string, Internship> = new Map();
  private applications: Map<string, Application> = new Map();
  private resumeAnalyses: Map<string, ResumeAnalysis> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Sample internships
    const sampleInternships: Internship[] = [
      {
        id: "1",
        title: "Software Engineering Intern",
        company: "Microsoft",
        description: "Join our team to develop scalable web applications using React, Node.js, and Azure cloud services. You'll work on real products used by millions of users worldwide.",
        location: "Seattle, WA",
        duration: "3 months",
        salary: "$6,000/month",
        requirements: ["Computer Science or related field", "Experience with JavaScript", "Knowledge of React", "Understanding of software development principles"],
        skills: ["React", "Node.js", "Azure", "TypeScript", "JavaScript", "Git"],
        industry: "Technology",
        isRemote: false,
        companyLogo: "fab fa-microsoft",
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "2",
        title: "Data Science Intern",
        company: "Google",
        description: "Work with large datasets to derive insights and build machine learning models. Experience with Python, SQL, and TensorFlow preferred.",
        location: "Mountain View, CA",
        duration: "3 months",
        salary: "$7,500/month",
        requirements: ["Statistics or Computer Science background", "Python proficiency", "SQL knowledge", "Machine learning fundamentals"],
        skills: ["Python", "SQL", "TensorFlow", "Machine Learning", "Data Analysis", "Statistics"],
        industry: "Technology",
        isRemote: false,
        companyLogo: "fab fa-google",
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "3",
        title: "UX Design Intern",
        company: "Spotify",
        description: "Design user experiences for our mobile and web platforms. Collaborate with product managers and engineers to create intuitive interfaces.",
        location: "New York, NY",
        duration: "4 months",
        salary: "$5,500/month",
        requirements: ["Design portfolio", "Figma proficiency", "User research experience", "Basic prototyping skills"],
        skills: ["Figma", "Sketch", "Prototyping", "User Research", "Design Systems", "Adobe Creative Suite"],
        industry: "Technology",
        isRemote: false,
        companyLogo: "fab fa-spotify",
        postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "4",
        title: "Product Management Intern",
        company: "Slack",
        description: "Work with cross-functional teams to define product roadmaps and drive feature development. Great opportunity to learn product strategy.",
        location: "San Francisco, CA",
        duration: "3 months",
        salary: "$6,500/month",
        requirements: ["Business or technical background", "Analytical thinking", "Communication skills", "Interest in product development"],
        skills: ["Product Strategy", "Analytics", "Roadmapping", "User Stories", "Market Research", "Agile"],
        industry: "Technology",
        isRemote: true,
        companyLogo: "fab fa-slack",
        postedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "5",
        title: "Marketing Analytics Intern",
        company: "Netflix",
        description: "Analyze marketing campaigns and user engagement data to optimize marketing strategies and improve user acquisition.",
        location: "Los Angeles, CA",
        duration: "4 months",
        salary: "$5,000/month",
        requirements: ["Marketing or Analytics background", "Excel proficiency", "SQL knowledge", "Statistical analysis skills"],
        skills: ["Excel", "SQL", "Google Analytics", "A/B Testing", "Data Visualization", "Marketing"],
        industry: "Media",
        isRemote: false,
        companyLogo: "fab fa-netflix",
        postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "6",
        title: "Financial Analyst Intern",
        company: "Goldman Sachs",
        description: "Support investment banking teams with financial modeling, market research, and client presentations. Great exposure to finance industry.",
        location: "New York, NY",
        duration: "10 weeks",
        salary: "$8,000/month",
        requirements: ["Finance or Economics major", "Excel expertise", "Financial modeling knowledge", "Strong analytical skills"],
        skills: ["Excel", "Financial Modeling", "PowerPoint", "Bloomberg", "VBA", "SQL"],
        industry: "Finance",
        isRemote: false,
        companyLogo: "fas fa-building",
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "7",
        title: "Mobile App Development Intern",
        company: "Apple",
        description: "Develop iOS applications using Swift and SwiftUI. Work on consumer-facing apps used by millions worldwide.",
        location: "Cupertino, CA",
        duration: "12 weeks",
        salary: "$7,000/month",
        requirements: ["Computer Science background", "iOS development experience", "Swift programming", "UI/UX understanding"],
        skills: ["Swift", "SwiftUI", "Xcode", "iOS Development", "Git", "REST APIs"],
        industry: "Technology",
        isRemote: false,
        companyLogo: "fab fa-apple",
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "8",
        title: "DevOps Engineering Intern",
        company: "Amazon",
        description: "Build and maintain cloud infrastructure, automate deployment pipelines, and work with AWS services at scale.",
        location: "Seattle, WA",
        duration: "3 months",
        salary: "$6,800/month",
        requirements: ["CS or related field", "Linux experience", "Cloud platforms knowledge", "Scripting abilities"],
        skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Python", "Linux", "Terraform"],
        industry: "Technology",
        isRemote: false,
        companyLogo: "fab fa-amazon",
        postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "9",
        title: "Digital Marketing Intern",
        company: "Meta",
        description: "Create and optimize digital advertising campaigns across Facebook, Instagram, and other Meta platforms.",
        location: "Menlo Park, CA",
        duration: "4 months",
        salary: "$5,800/month",
        requirements: ["Marketing or Communications major", "Social media knowledge", "Analytics experience", "Creative thinking"],
        skills: ["Facebook Ads", "Instagram Marketing", "Google Analytics", "Adobe Creative Suite", "A/B Testing"],
        industry: "Technology",
        isRemote: false,
        companyLogo: "fab fa-meta",
        postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "10",
        title: "Cybersecurity Intern",
        company: "Palantir",
        description: "Work on security assessments, threat analysis, and develop security tools to protect sensitive data systems.",
        location: "Denver, CO",
        duration: "3 months",
        salary: "$6,200/month",
        requirements: ["Cybersecurity or CS background", "Network security knowledge", "Programming skills", "Problem-solving abilities"],
        skills: ["Python", "Network Security", "Penetration Testing", "Linux", "Wireshark", "Metasploit"],
        industry: "Technology",
        isRemote: false,
        companyLogo: "fas fa-shield-alt",
        postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "11",
        title: "Data Engineer Intern",
        company: "Airbnb",
        description: "Build data pipelines, work with big data technologies, and support data science teams with infrastructure.",
        location: "San Francisco, CA",
        duration: "4 months",
        salary: "$7,200/month",
        requirements: ["CS or Data Science background", "Database knowledge", "Programming experience", "ETL understanding"],
        skills: ["Python", "SQL", "Apache Spark", "Kafka", "Airflow", "AWS", "Scala"],
        industry: "Technology",
        isRemote: true,
        companyLogo: "fab fa-airbnb",
        postedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "12",
        title: "Healthcare Analytics Intern",
        company: "Johnson & Johnson",
        description: "Analyze clinical trial data, develop predictive models, and support pharmaceutical research initiatives.",
        location: "New Brunswick, NJ",
        duration: "3 months",
        salary: "$4,800/month",
        requirements: ["Statistics or Biostatistics background", "R or Python knowledge", "Healthcare interest", "Data analysis skills"],
        skills: ["R", "Python", "SAS", "Statistics", "Clinical Data", "SQL"],
        industry: "Healthcare",
        isRemote: false,
        companyLogo: "fas fa-plus-square",
        postedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "13",
        title: "AI Research Intern",
        company: "OpenAI",
        description: "Conduct research in artificial intelligence, develop machine learning models, and contribute to cutting-edge AI projects.",
        location: "San Francisco, CA",
        duration: "6 months",
        salary: "$8,500/month",
        requirements: ["CS or AI background", "Machine learning knowledge", "Research experience", "Programming proficiency"],
        skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "Research"],
        industry: "Technology",
        isRemote: true,
        companyLogo: "fas fa-brain",
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "14",
        title: "Business Development Intern",
        company: "Tesla",
        description: "Support business development initiatives, analyze market opportunities, and assist with partnership strategies.",
        location: "Austin, TX",
        duration: "4 months",
        salary: "$5,500/month",
        requirements: ["Business or Economics major", "Strategic thinking", "Communication skills", "Market analysis"],
        skills: ["Market Research", "Excel", "PowerPoint", "Business Strategy", "Analytics"],
        industry: "Automotive",
        isRemote: false,
        companyLogo: "fas fa-car",
        postedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "15",
        title: "Frontend Developer Intern",
        company: "Stripe",
        description: "Build user interfaces for payment platforms, work with modern web technologies, and create seamless user experiences.",
        location: "San Francisco, CA",
        duration: "3 months",
        salary: "$6,800/month",
        requirements: ["Web development experience", "JavaScript proficiency", "React knowledge", "Design sensibility"],
        skills: ["React", "JavaScript", "TypeScript", "CSS", "HTML", "Git", "Figma"],
        industry: "Fintech",
        isRemote: true,
        companyLogo: "fab fa-stripe",
        postedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "16",
        title: "Operations Research Intern",
        company: "FedEx",
        description: "Optimize logistics and supply chain operations using mathematical modeling and data analysis techniques.",
        location: "Memphis, TN",
        duration: "3 months",
        salary: "$4,500/month",
        requirements: ["Operations Research or Industrial Engineering", "Mathematical modeling", "Optimization knowledge", "Analytical skills"],
        skills: ["Python", "R", "Operations Research", "Mathematical Modeling", "Excel", "SQL"],
        industry: "Logistics",
        isRemote: false,
        companyLogo: "fas fa-shipping-fast",
        postedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "17",
        title: "Game Development Intern",
        company: "Epic Games",
        description: "Develop games using Unreal Engine, work on graphics programming, and create immersive gaming experiences.",
        location: "Cary, NC",
        duration: "4 months",
        salary: "$5,800/month",
        requirements: ["Game development experience", "C++ knowledge", "3D graphics understanding", "Creative problem solving"],
        skills: ["C++", "Unreal Engine", "3D Graphics", "Game Design", "Unity", "Graphics Programming"],
        industry: "Gaming",
        isRemote: false,
        companyLogo: "fas fa-gamepad",
        postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "18",
        title: "Environmental Engineering Intern",
        company: "Tesla Energy",
        description: "Work on renewable energy projects, analyze environmental impact, and develop sustainable technology solutions.",
        location: "Reno, NV",
        duration: "4 months",
        salary: "$5,200/month",
        requirements: ["Environmental or Chemical Engineering", "Sustainability knowledge", "CAD software experience", "Environmental regulations"],
        skills: ["AutoCAD", "Environmental Analysis", "Renewable Energy", "Project Management", "Data Analysis"],
        industry: "Energy",
        isRemote: false,
        companyLogo: "fas fa-leaf",
        postedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "19",
        title: "Content Strategy Intern",
        company: "TikTok",
        description: "Develop content strategies, analyze social media trends, and create engaging content for global audiences.",
        location: "Los Angeles, CA",
        duration: "3 months",
        salary: "$5,000/month",
        requirements: ["Marketing or Communications background", "Social media expertise", "Creative writing", "Trend analysis"],
        skills: ["Content Creation", "Social Media Marketing", "Analytics", "Video Editing", "Trend Analysis"],
        industry: "Social Media",
        isRemote: true,
        companyLogo: "fab fa-tiktok",
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        id: "20",
        title: "Blockchain Developer Intern",
        company: "Coinbase",
        description: "Build decentralized applications, work with smart contracts, and develop blockchain-based financial solutions.",
        location: "San Francisco, CA",
        duration: "4 months",
        salary: "$7,500/month",
        requirements: ["CS background", "Blockchain knowledge", "Smart contract development", "Cryptocurrency understanding"],
        skills: ["Solidity", "Ethereum", "Web3", "JavaScript", "React", "Blockchain", "Smart Contracts"],
        industry: "Cryptocurrency",
        isRemote: true,
        companyLogo: "fab fa-bitcoin",
        postedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        isActive: true,
      }
    ];

    sampleInternships.forEach(internship => {
      this.internships.set(internship.id, internship);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Resume operations
  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = randomUUID();
    const resume: Resume = {
      id,
      userId: insertResume.userId,
      fileName: insertResume.fileName,
      filePath: insertResume.filePath,
      content: insertResume.content || null,
      skills: insertResume.skills || null,
      experience: insertResume.experience || null,
      education: insertResume.education || null,
      analysisScore: insertResume.analysisScore || null,
      keywords: insertResume.keywords || null,
      uploadedAt: new Date(),
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async getResumesByUserId(userId: string): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(resume => resume.userId === userId);
  }

  async getResumeById(id: string): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async updateResumeAnalysis(resumeId: string, analysis: Partial<Resume>): Promise<Resume | undefined> {
    const resume = this.resumes.get(resumeId);
    if (resume) {
      const updatedResume = { ...resume, ...analysis };
      this.resumes.set(resumeId, updatedResume);
      return updatedResume;
    }
    return undefined;
  }

  // Internship operations
  async getAllInternships(): Promise<Internship[]> {
    return Array.from(this.internships.values()).filter(internship => internship.isActive);
  }

  async getInternshipById(id: string): Promise<Internship | undefined> {
    return this.internships.get(id);
  }

  async searchInternships(query: string, location?: string, industry?: string): Promise<Internship[]> {
    const allInternships = await this.getAllInternships();
    
    return allInternships.filter(internship => {
      const matchesQuery = !query || 
        internship.title.toLowerCase().includes(query.toLowerCase()) ||
        internship.company.toLowerCase().includes(query.toLowerCase()) ||
        internship.description.toLowerCase().includes(query.toLowerCase()) ||
        (internship.skills && internship.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase())));

      const matchesLocation = !location || location === "All Locations" ||
        internship.location.toLowerCase().includes(location.toLowerCase()) ||
        (location === "Remote" && internship.isRemote);

      const matchesIndustry = !industry || industry === "All Industries" ||
        (internship.industry && internship.industry.toLowerCase().includes(industry.toLowerCase()));

      return matchesQuery && matchesLocation && matchesIndustry;
    });
  }

  async getMatchingInternships(resumeId: string): Promise<InternshipWithMatch[]> {
    const resume = await this.getResumeById(resumeId);
    if (!resume) return [];

    const allInternships = await this.getAllInternships();
    const userSkills = resume.skills || [];

    return allInternships.map(internship => {
      const jobSkills = internship.skills || [];
      const matchScore = this.calculateMatchScore(userSkills, jobSkills);
      const missingKeywords = jobSkills.filter(skill => 
        !userSkills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))
      );

      return {
        ...internship,
        matchScore,
        missingKeywords,
      };
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  private calculateMatchScore(userSkills: string[], jobSkills: string[]): number {
    if (!userSkills.length || !jobSkills.length) return 0;

    const matchedSkills = jobSkills.filter(jobSkill =>
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );

    return Math.round((matchedSkills.length / jobSkills.length) * 100);
  }

  // Application operations
  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = randomUUID();
    const application: Application = {
      id,
      userId: insertApplication.userId,
      internshipId: insertApplication.internshipId,
      resumeId: insertApplication.resumeId,
      status: insertApplication.status || "pending",
      matchScore: insertApplication.matchScore || null,
      coverLetter: insertApplication.coverLetter || null,
      appliedAt: new Date(),
      updatedAt: new Date(),
    };
    this.applications.set(id, application);
    return application;
  }

  async getApplicationsByUserId(userId: string): Promise<ApplicationWithDetails[]> {
    const userApplications = Array.from(this.applications.values())
      .filter(app => app.userId === userId);

    const applicationsWithDetails: ApplicationWithDetails[] = [];

    for (const app of userApplications) {
      const internship = await this.getInternshipById(app.internshipId);
      const resume = await this.getResumeById(app.resumeId);

      if (internship && resume) {
        applicationsWithDetails.push({
          ...app,
          internship,
          resume,
        });
      }
    }

    return applicationsWithDetails.sort((a, b) => 
      (b.appliedAt ? new Date(b.appliedAt).getTime() : 0) - (a.appliedAt ? new Date(a.appliedAt).getTime() : 0)
    );
  }

  async getApplicationById(id: string): Promise<ApplicationWithDetails | undefined> {
    const application = this.applications.get(id);
    if (!application) return undefined;

    const internship = await this.getInternshipById(application.internshipId);
    const resume = await this.getResumeById(application.resumeId);

    if (internship && resume) {
      return {
        ...application,
        internship,
        resume,
      };
    }

    return undefined;
  }

  async updateApplicationStatus(id: string, status: string): Promise<Application | undefined> {
    const application = this.applications.get(id);
    if (application) {
      const updatedApplication = {
        ...application,
        status,
        updatedAt: new Date(),
      };
      this.applications.set(id, updatedApplication);
      return updatedApplication;
    }
    return undefined;
  }

  // Resume analysis operations
  async createResumeAnalysis(insertAnalysis: InsertResumeAnalysis): Promise<ResumeAnalysis> {
    const id = randomUUID();
    const analysis: ResumeAnalysis = {
      id,
      resumeId: insertAnalysis.resumeId,
      internshipId: insertAnalysis.internshipId || null,
      missingKeywords: insertAnalysis.missingKeywords || null,
      suggestions: insertAnalysis.suggestions || null,
      technicalSkillsScore: insertAnalysis.technicalSkillsScore || null,
      experienceScore: insertAnalysis.experienceScore || null,
      achievementsScore: insertAnalysis.achievementsScore || null,
      overallScore: insertAnalysis.overallScore || null,
      createdAt: new Date(),
    };
    this.resumeAnalyses.set(id, analysis);
    return analysis;
  }

  async getResumeAnalysis(resumeId: string, internshipId?: string): Promise<ResumeAnalysis | undefined> {
    return Array.from(this.resumeAnalyses.values()).find(analysis => 
      analysis.resumeId === resumeId && 
      (!internshipId || analysis.internshipId === internshipId)
    );
  }
}

export const storage = new MemStorage();
