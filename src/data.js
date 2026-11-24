// All site content lives here. Edit and save to update the portfolio.
export const profile = {
  name: "Shivendra Pratap Singh",
  role: "Full-stack developer",
  tagline:
    "I build MERN apps with a backend-first mindset: secure JWT auth, clean middleware and REST APIs that stay predictable as they grow.",
  email: "spsingh20051969@gmail.com",
  phone: "+91-7906524480",
  location: "Sonepat, Haryana",
  links: {
    linkedin: "https://www.linkedin.com/in/shivendra-pratap-singh-b192b9370",
    github: "https://github.com/sps72057931",
    leetcode: "https://leetcode.com/u/sps12311072/",
    codechef: "https://www.codechef.com/users/sp_singh16",
  },
  roles: ["MERN stack apps", "JWT-secured REST APIs", "real-time Socket.IO apps", "clean backend architecture"],
};

export const stats = [
  { value: 3, suffix: "", label: "full-stack apps shipped" },
  { value: 25, suffix: "+", label: "REST endpoints designed" },
  { value: 200, suffix: "+", label: "DSA problems solved" },
  { value: 1608, suffix: "", label: "LeetCode rating" },
];

export const projects = [
  {
    title: "ShopSphere",
    period: "May 2026 to Jun 2026",
    summary: "Full-stack e-commerce platform with role-based access, product discovery and an order lifecycle.",
    stack: ["React", "Express", "Node", "MongoDB", "JWT"],
    live: "https://shopsphere-s5dp.onrender.com", github: "https://github.com/sps72057931/ShopSphere",
    points: [
      "15 REST endpoints across auth, product and order controllers, backed by Mongoose schemas for Users, Products and Orders.",
      "JWT authentication with bcrypt hashing across 2 user roles; custom protect/admin middleware gates 8+ admin-only routes.",
      "Regex search with 4 filter/sort types (category, price, rating, stock) and an admin image pipeline (Multer + Cloudinary, 5 images per product).",
      "Orders follow a 6-stage lifecycle (Processing to Delivered) with auto-logged status history, centralized error handling and pagination (10 items/page).",
      "React Context cart with localStorage persistence, discount-aware totals and stock-capped quantities; backend deployed on Render with dotenv-managed config.",
    ],
  },
  {
    title: "AI Resume Builder",
    period: "Apr 2026 to May 2026",
    summary: "Split-pane resume editor with live preview, AI-written bullets and one-click PDF export.",
    stack: ["React", "Express", "Node", "MongoDB", "Gemini API"],
    live: "https://ai-resume-builder-n4bo.onrender.com", github: "https://github.com/sps72057931/ai-resume-builder",
    points: [
      "JWT-authenticated MERN app with 10+ CRUD endpoints powering a live editor with real-time preview rendering.",
      "RESTful CRUD across 3 resource types (resumes, sections, auth) with route-level validation and structured JSON errors.",
      "Google Gemini 2.5 Flash integration with structured prompts that enforce action-verb bullets and word limits across 4 section types, secured behind auth middleware.",
      "4 modular Mongoose sub-schemas (education, experience, projects, certifications) supporting add, edit and reorder.",
      "One-click PDF export with html2pdf.js; Express backend deployed on Render with environment-scoped secrets across 2 services.",
    ],
  },
  {
    title: "Quick Chat",
    period: "Mar 2026 to Apr 2026",
    summary: "Real-time 1:1 chat with live presence, unseen-message tracking and image sharing.",
    stack: ["React", "Express", "Node", "MongoDB", "Socket.IO"],
    live: "https://quickchat-backend-dahu.onrender.com", github: "https://github.com/sps72057931/quick-chat",
    points: [
      "Instant message delivery and live online-presence tracking across connected clients with Socket.IO.",
      "JWT sessions with custom token middleware guarding all 10+ message and profile routes.",
      "Unseen-message tracking that auto-marks messages seen on open, plus in-chat image sharing (up to 5MB) via Cloudinary, emitted live over sockets.",
      "Mongoose schemas indexed by conversation pair and timestamp, with an in-memory socket-to-user map and disconnect/reconnect cleanup.",
      "React ChatContext subscribed to newMessage events, updating conversations and unread state instantly.",
    ],
  },
];

export const skills = {
  Frontend: ["React.js", "Vite", "Tailwind CSS", "HTML", "CSS"],
  Backend: ["Node.js", "Express.js", "REST API Design", "JWT Authentication", "bcrypt", "Middleware Architecture", "Request Validation", "Socket.IO", "Multer"],
  Databases: ["MongoDB", "Mongoose", "Schema Design", "Indexing"],
  Languages: ["C++", "JavaScript"],
  "Cloud & Tools": ["Cloudinary", "Render", "Git", "GitHub"],
  Coursework: ["OOP", "Operating Systems", "Computer Networks", "DBMS"],
};

export const experience = {
  company: "1Stop",
  role: "Frontend Developer Intern",
  period: "Jun 2026 to Jul 2026",
  place: "Remote",
  points: [
    "Completed a 6-week, project-based mentorship covering HTML, CSS and JavaScript fundamentals through live sessions and hands-on assignments.",
    "Created and submitted 3 mentor-approved projects: a responsive single-page site, an expense tracker and a to-do list app.",
  ],
  certs: [{ label: "Internship certificate", href: "https://drive.google.com/file/d/1TnlX1Y2agTifR0e1fpUAAwu4Q-PVIGAu/view?usp=sharing" }, { label: "Project completion certificate", href: "https://drive.google.com/file/d/1RrOcV5xhQNmVktz18m-AY3zIfiU8_jrc/view?usp=sharing" }],
};

export const education = [
  { school: "Indian Institute of Information Technology, Sonepat", detail: "B.Tech in Computer Science and Engineering, CGPA 8.43", period: "2023 to 2027" },
  { school: "Bishop Conrad Sr. Sec. School, Dohna", detail: "Class 12 (CBSE), 85.8%", period: "2022" },
  { school: "Bishop Conrad Sr. Sec. School, Dohna", detail: "Class 10 (CBSE), 86.4%", period: "2020" },
];

export const achievements = [
  "LeetCode rating of 1608 and CodeChef rating of 1498 across rated contests.",
  "200+ problems solved on LeetCode and CodeChef, covering arrays, graphs, DP and trees.",
  "Completed a 6-week Frontend Developer internship at 1Stop, shipping 3 mentor-approved projects.",
];

// The hero "API console" serves these as fake responses.
export const endpoints = [
  { path: "/api/me", ms: 38, body: { name: profile.name, role: "Full-stack developer (MERN)", focus: "Backend architecture", education: "B.Tech CSE, IIIT Sonepat (2027)", cgpa: 8.43, open_to: ["internships", "full-time roles"] } },
  { path: "/api/projects", ms: 52, body: projects.map((p) => ({ title: p.title, stack: p.stack })) },
  { path: "/api/skills", ms: 41, body: { backend: skills.Backend.slice(0, 5), frontend: skills.Frontend.slice(0, 3), database: ["MongoDB", "Mongoose"] } },
  { path: "/api/stats", ms: 29, body: { apps_shipped: 3, endpoints_built: "25+", dsa_solved: "200+", leetcode_rating: 1608, codechef_rating: 1498 } },
];
