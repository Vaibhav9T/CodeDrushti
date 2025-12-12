
export const projectInfo = {
  title: "CodeDrushti Design Documentation",
  version: "1.0.0",
  lastUpdated: "December 2025",
  author: "Vaibhav Tembukade"
};

export const docSections = [
  {
    id: "overview",
    title: "1. Project Overview",
    content: `CodeDrushti is an AI-powered code review platform designed to help developers identify bugs, security vulnerabilities, and performance improvements in real-time. By leveraging the Google Gemini API, it provides intelligent, context-aware feedback that goes beyond simple syntax checking.`,
    subsections: [
      {
        subtitle: "Key Objectives",
        items: [
          "Automate the code review process to save developer time.",
          "Provide actionable insights with severity levels (Critical, Warning, Info).",
          "Secure user data and code snippets during analysis.",
          "Maintain a history of past reviews for tracking progress."
        ]
      }
    ]
  },
  {
    id: "architecture",
    title: "2. System Architecture",
    content: "The application follows a standard MERN (MongoDB, Express, React, Node.js) architecture with external AI integration.",
    subsections: [
      {
        subtitle: "Tech Stack",
        items: [
          "**Frontend:** React.js, Tailwind CSS, Lucide React (Icons), React Router DOM.",
          "**Backend:** Node.js, Express.js.",
          "**Database:** MongoDB (storing users and review history).",
          "**AI Engine:** Google Gemini API (Generative AI for code analysis).",
          "**Authentication:** JWT (JSON Web Tokens) & OAuth (Google/GitHub)."
        ]
      },
      {
        subtitle: "Data Flow",
        items: [
          "1. User submits code via the Dashboard UI.",
          "2. Frontend sends code to Backend API (/api/analyze).",
          "3. Backend sanitizes input and forwards it to Gemini API.",
          "4. AI processes code and returns JSON structured data (Bugs, Security, Improvements).",
          "5. Backend stores the result in MongoDB and responds to Frontend.",
          "6. Dashboard renders the results in an easy-to-read format."
        ]
      }
    ]
  },
  {
    id: "features",
    title: "3. Core Features",
    content: "Detailed breakdown of the application modules.",
    subsections: [
      {
        subtitle: "User Dashboard",
        items: [
          "Code Editor with syntax highlighting (auto-detect language).",
          "One-click 'Analyze Code' button with loading states.",
          "Visual result cards categorized by Bugs, Improvements, and Security."
        ]
      },
      {
        subtitle: "Authentication & Security",
        items: [
          "Secure Login/Signup with email and password.",
          "Social Login integration (Google/GitHub).",
          "Protected Routes ensuring only logged-in users access the dashboard.",
          "Environment variable protection for API keys."
        ]
      }
    ]
  },
  {
    id: "database",
    title: "4. Database Design",
    content: "Schema definitions for MongoDB collections.",
    subsections: [
      {
        subtitle: "Users Collection",
        items: [
          "_id: ObjectId",
          "username: String",
          "email: String (Unique)",
          "password: String (Hashed)",
          "createdAt: Date"
        ]
      },
      {
        subtitle: "Reviews Collection",
        items: [
          "_id: ObjectId",
          "userId: ObjectId (Ref: Users)",
          "codeSnippet: String",
          "analysisResult: Object (JSON response from AI)",
          "timestamp: Date"
        ]
      }
    ]
  },
  {
    id: "future",
    title: "5. Future Enhancements",
    content: "Planned features for upcoming versions.",
    subsections: [
      {
        subtitle: "Roadmap",
        items: [
          "IDE Extension (VS Code) for direct analysis.",
          "Support for analyzing entire GitHub repositories.",
          "Team collaboration features (sharing reviews).",
          "Downloadable PDF reports for code audits."
        ]
      }
    ]
  }
];