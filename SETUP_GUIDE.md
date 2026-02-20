# Shivendra Pratap Singh — Portfolio System
## Complete Architecture, Setup & Deployment Guide

---

## 1. ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    PORTFOLIO ECOSYSTEM                       │
├──────────────────┬────────────────────┬────────────────────-┤
│  PART 1          │  PART 2            │  PART 3             │
│  Static Website  │  Blog CMS (MERN)   │  Page Builder        │
│  (HTML/CSS/JS)   │  React + Node.js   │  (React)            │
├──────────────────┼────────────────────┼─────────────────────┤
│  • index.html    │  Client (React):   │  • Sidebar panel    │
│  • about.html    │  • Blog listing    │  • Drag & drop      │
│  • projects.html │  • Blog post view  │  • Canvas editor    │
│  • blog.html     │  • Create/Edit     │  • Props editor     │
│  • contact.html  │  • Admin panel     │  • JSON save/load   │
│  • styles.css    │                    │  • HTML export      │
│  • script.js     │  Server (Node.js): │                     │
│                  │  • REST API        │  Components:        │
│  Features:       │  • JWT Auth        │  • Heading          │
│  • Typed hero    │  • MongoDB         │  • Paragraph        │
│  • Scroll reveal │  • Admin routes    │  • Button           │
│  • Dark/Light    │  • Markdown        │  • Image            │
│  • Responsive    │  • Search/Tags     │  • Card             │
│  • Contact form  │                    │  • Section          │
│                  │                    │  • Divider          │
└──────────────────┴────────────────────┴─────────────────────┘
```

---

## 2. COMPLETE FILE STRUCTURE

```
portfolio-sps/
│
├── static/                          ← Part 1: Static Website
│   ├── index.html
│   ├── about.html
│   ├── projects.html
│   ├── blog.html
│   ├── contact.html
│   ├── styles.css
│   ├── script.js
│   └── assets/
│       └── resume.pdf
│
├── blog-cms/                        ← Part 2: Blog System
│   ├── client/                      ← React Frontend
│   │   ├── public/
│   │   │   └── index.html
│   │   ├── src/
│   │   │   ├── App.jsx
│   │   │   ├── main.jsx
│   │   │   ├── index.css
│   │   │   ├── components/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── BlogCard.jsx
│   │   │   │   ├── MarkdownEditor.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── pages/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── BlogList.jsx
│   │   │   │   ├── BlogPost.jsx
│   │   │   │   ├── CreatePost.jsx
│   │   │   │   ├── EditPost.jsx
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   └── AdminDashboard.jsx
│   │   │   ├── context/
│   │   │   │   └── AuthContext.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── usePosts.js
│   │   │   │   └── useAuth.js
│   │   │   └── utils/
│   │   │       ├── api.js
│   │   │       └── markdownUtils.js
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── server/                      ← Node.js Backend
│       ├── src/
│       │   ├── index.js             ← Entry point
│       │   ├── config/
│       │   │   └── db.js            ← MongoDB connection
│       │   ├── models/
│       │   │   ├── Post.js          ← Blog post schema
│       │   │   └── User.js          ← Admin user schema
│       │   ├── routes/
│       │   │   ├── posts.js         ← Blog CRUD routes
│       │   │   └── auth.js          ← Auth routes
│       │   ├── middleware/
│       │   │   ├── auth.js          ← JWT verification
│       │   │   └── errorHandler.js
│       │   └── controllers/
│       │       ├── postController.js
│       │       └── authController.js
│       ├── .env
│       └── package.json
│
└── page-builder/                    ← Part 3: Drag & Drop Builder
    ├── src/
    │   ├── App.jsx                  ← PageBuilder.jsx (provided)
    │   └── main.jsx
    └── package.json
```

---

## 3. BLOG BACKEND — COMPLETE CODE

### server/package.json
```json
{
  "name": "blog-server",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.4.0",
    "jsonwebtoken": "^9.0.1",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### server/.env
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio-blog
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@sps.dev
ADMIN_PASSWORD=Admin@123
```

### server/src/index.js
```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/posts', require('./routes/posts'));
app.use('/api/auth', require('./routes/auth'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Error handler
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
```

### server/src/config/db.js
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### server/src/models/Post.js
```javascript
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  coverImage: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    enum: ['mern', 'dsa', 'react', 'system-design', 'career', 'tutorial', 'other'],
    default: 'other'
  },
  author: {
    type: String,
    default: 'Shivendra Pratap Singh'
  },
  published: {
    type: Boolean,
    default: false
  },
  readTime: {
    type: Number,  // minutes
    default: 5
  },
  views: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Auto-generate slug from title
PostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 80);
  }
  // Auto-generate excerpt from content
  if (this.isModified('content') && !this.excerpt) {
    this.excerpt = this.content
      .replace(/[#*`\[\]]/g, '')  // strip markdown
      .substring(0, 200) + '...';
  }
  // Estimate read time (avg 200 wpm)
  if (this.isModified('content')) {
    const words = this.content.split(' ').length;
    this.readTime = Math.ceil(words / 200);
  }
  next();
});

module.exports = mongoose.model('Post', PostSchema);
```

### server/src/models/User.js
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin'], default: 'admin' }
}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
```

### server/src/middleware/auth.js
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, access denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};
```

### server/src/routes/auth.js
```javascript
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/register (one-time admin creation)
router.post('/register', async (req, res) => {
  try {
    const { email, password, secret } = req.body;
    if (secret !== process.env.ADMIN_SECRET) return res.status(403).json({ message: 'Forbidden' });
    const user = await User.create({ email, password });
    res.status(201).json({ message: 'Admin created', id: user._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
```

### server/src/routes/posts.js
```javascript
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');

// GET /api/posts — Public: list published posts
router.get('/', async (req, res) => {
  try {
    const { tag, category, search, page = 1, limit = 10 } = req.query;
    const query = { published: true };

    if (tag) query.tags = { $in: [tag] };
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-content');  // exclude full content in listing

    const total = await Post.countDocuments(query);
    res.json({ posts, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/posts/:slug — Public: single post
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug, published: true },
      { $inc: { views: 1 } },  // increment view count
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts — Admin: create post
router.post('/', auth, async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/posts/:id — Admin: update post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/posts/:id — Admin: delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/posts/admin/all — Admin: all posts (published + drafts)
router.get('/admin/all', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).select('-content');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
```

### server/src/middleware/errorHandler.js
```javascript
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
};
```

---

## 4. BLOG FRONTEND — KEY FILES

### client/package.json
```json
{
  "name": "blog-client",
  "scripts": { "dev": "vite", "build": "vite build" },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "react-markdown": "^9.0.0",
    "@uiw/react-md-editor": "^4.0.0",
    "axios": "^1.5.0"
  },
  "devDependencies": { "vite": "^4.4.5", "@vitejs/plugin-react": "^4.0.3" }
}
```

### client/src/utils/api.js
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 - redirect to login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// Post API helpers
export const postsAPI = {
  getAll: (params) => api.get('/posts', { params }),
  getBySlug: (slug) => api.get(`/posts/${slug}`),
  getAdminAll: () => api.get('/posts/admin/all'),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export default api;
```

### client/src/context/AuthContext.jsx
```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');
    if (token && savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

## 5. SETUP INSTRUCTIONS

### Step 1 — Clone & Setup
```bash
mkdir portfolio-sps && cd portfolio-sps
```

### Step 2 — Static Website
```bash
# Just open index.html in browser or use live-server
npx live-server static/
```

### Step 3 — Blog Backend
```bash
cd blog-cms/server
npm install
# Edit .env with your MongoDB URI and secrets
cp .env.example .env

# Start MongoDB (if local)
mongod --dbpath ~/data/db

# Start server
npm run dev
# Server runs at http://localhost:5000
```

### Step 4 — Blog Frontend
```bash
cd blog-cms/client
npm install
npm run dev
# App runs at http://localhost:5173
```

### Step 5 — Page Builder
```bash
# The PageBuilder.jsx is a standalone React component
# Add to any React project:
cd page-builder
npm create vite@latest . -- --template react
npm install
# Replace src/App.jsx content with PageBuilder.jsx
npm run dev
```

### Step 6 — Create Admin Account (one-time)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sps.dev","password":"Admin@123","secret":"your_admin_secret"}'
```

---

## 6. DEPLOYMENT

### Static Website → GitHub Pages
```bash
# Push to GitHub, enable Pages from Settings > Pages
# Or use: npx gh-pages -d static/
```

### Blog Backend → Render
```bash
# 1. Push to GitHub
# 2. Create Render Web Service
# 3. Build command: npm install
# 4. Start command: npm start
# 5. Add environment variables from .env
# 6. MongoDB: Use MongoDB Atlas free tier
```

### Blog Frontend → Vercel
```bash
# 1. Push client/ to GitHub
# 2. Import project in Vercel
# 3. Set VITE_API_URL=https://your-render-url.onrender.com/api
# 4. Deploy
```

### Page Builder → Vercel
```bash
# Same as frontend - Vercel auto-detects Vite
```

---

## 7. API ENDPOINTS REFERENCE

```
PUBLIC:
  GET  /api/posts              - List published posts (with filters)
  GET  /api/posts/:slug        - Get single post by slug
  GET  /api/health             - Health check

ADMIN (JWT required):
  POST   /api/posts            - Create post
  PUT    /api/posts/:id        - Update post
  DELETE /api/posts/:id        - Delete post
  GET    /api/posts/admin/all  - All posts (drafts + published)

AUTH:
  POST /api/auth/login         - Admin login → returns JWT
  POST /api/auth/register      - Create admin (one-time, needs secret)
```

---

## 8. FUTURE IMPROVEMENTS

1. **Portfolio**: Add Three.js 3D background, GSAP animations, custom cursor
2. **Blog**: Add comment system (Disqus or custom), email newsletter, RSS feed
3. **Blog**: Add image upload with Cloudinary integration
4. **Builder**: Add undo/redo history, multi-select, grid snapping
5. **Builder**: Add template library, custom CSS injection per element
6. **Performance**: Add Redis caching for blog API, CDN for assets
7. **Analytics**: Integrate Plausible or self-hosted analytics
8. **SEO**: Add meta tags, OpenGraph, structured data (JSON-LD)
9. **Auth**: Add Google OAuth for admin login
10. **Mobile**: Build React Native portfolio app

---

*Generated for Shivendra Pratap Singh — IIIT Sonepat, B.Tech CSE 2023–2027*
