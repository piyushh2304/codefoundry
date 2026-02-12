import { PrismaClient } from '@prisma/client';
import process from 'process';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data to avoid conflicts with new schema
  await prisma.snippetStep.deleteMany();
  await prisma.snippet.deleteMany();

  // 1. JavaScript / Node.js
  const js = await prisma.language.upsert({
    where: { slug: 'javascript' },
    update: {},
    create: {
      name: 'JavaScript',
      slug: 'javascript',
      icon: 'javascript-icon', // You can use an SVG or URL here later
    },
  });

  // 1a. JS Category: Auth
  const jsAuth = await prisma.category.upsert({
    where: {
      languageId_slug: {
        languageId: js.id,
        slug: 'authentication',
      },
    },
    update: {},
    create: {
      name: 'Authentication',
      slug: 'authentication',
      languageId: js.id,
    },
  });

  // 1b. JS Snippet: JWT Middleware
  await prisma.snippet.create({
    data: {
      title: 'JWT Authentication Middleware',
      description: 'Middleware to verify JWT tokens in Express requests.',
      categoryId: jsAuth.id,
      code: `
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
`.trim(),
    },
  });

  // 2. Python
  const python = await prisma.language.upsert({
    where: { slug: 'python' },
    update: {},
    create: {
      name: 'Python',
      slug: 'python',
      icon: 'python-icon',
    },
  });

  // 2a. Python Category: Utils
  const pyUtils = await prisma.category.upsert({
    where: {
      languageId_slug: {
        languageId: python.id,
        slug: 'utilities',
      },
    },
    update: {},
    create: {
      name: 'Utilities',
      slug: 'utilities',
      languageId: python.id,
    },
  });

  // 2b. Python Snippet: File Reader
  await prisma.snippet.create({
    data: {
      title: 'Read JSON File',
      description: 'Utility function to safely read and parse a JSON file.',
      categoryId: pyUtils.id,
      code: `
import json

def read_json_file(file_path):
try:
with open(file_path, 'r') as file:
return json.load(file)
    except FileNotFoundError:
return None
  `.trim(),
    },
  });

  // 3. MERN Stack
  const mern = await prisma.language.upsert({
    where: { slug: 'mern' },
    update: {},
    create: {
      name: 'MERN Stack',
      slug: 'mern',
      icon: 'mern-icon',
    },
  });

  const mernSetup = await prisma.category.upsert({
    where: { languageId_slug: { languageId: mern.id, slug: 'auth-setup' } },
    update: {},
    create: {
      name: 'Authentication Setup',
      slug: 'auth-setup',
      languageId: mern.id,
    },
  });


  await prisma.snippet.create({
    data: {
      title: 'Comprehensive MERN Authentication Guide (JWT + Bcrypt)',
      description: 'This guide provides a step-by-step implementation for a robust authentication system using the MERN stack.',
      categoryId: mernSetup.id,
      steps: {
        create: [
          {
            order: 1,
            title: '1. Backend Setup ( /server )',
            description: 'Step 1.1: Install Dependencies',
            code: 'npm install express mongoose dotenv bcryptjs jsonwebtoken cors cookie-parser\nnpm install -D nodemon'
          },
          {
            order: 2,
            title: '2. Environment Variables ( .env )',
            description: 'Step 1.2: Environment Variables ( .env )',
            code: `PORT=5000\nMONGODB_URI=mongodb://localhost:27017/mern-auth\nJWT_SECRET=your_super_secret_key_123\nNODE_ENV=development`
          },
          {
            order: 3,
            title: '3. User Model ( server/models/User.js )',
            description: 'Step 1.3: User Model ( server/models/User.js )',
            code: `const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);`
          },
          {
            order: 4,
            title: '4. Auth Controller ( server/controllers/authController.js )',
            description: 'Step 1.4: Auth Controller ( server/controllers/authController.js )',
            code: `const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ success: true, token, user: { id: user._id, name, email } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token, user: { id: user._id, name: user.name, email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};`
          },
          {
            order: 5,
            title: '5. Auth Middleware ( server/middleware/auth.js )',
            description: 'Step 1.5: Auth Middleware ( server/middleware/auth.js )',
            code: `const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};`
          },
          {
            order: 6,
            title: '6. Server Entry Point ( server/server.js )',
            description: 'Step 1.6: Server Entry Point ( server/server.js )',
            code: `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/api/auth', require('./routes/authRoutes'));
app.listen(process.env.PORT, () => console.log(\`Server on \${process.env.PORT}\`));`
          },
          {
            order: 7,
            title: '7. Frontend Setup ( /client )',
            description: 'Step 2.1: Install Dependencies & Axios Configuration ( client/src/api/axios.js )',
            code: `// Terminal: npx create-react-app client\n// npm install axios react-router-dom lucide-react\n\nimport axios from 'axios';\n\nconst api = axios.create({\n  baseURL: 'http://localhost:5000/api',\n});\n\nexport default api;`
          },
          {
            order: 8,
            title: '8. Auth Context ( client/src/context/AuthContext.js )',
            description: 'Step 2.2: Manage User State & Auth Logic',
            code: `import { createContext, useState, useContext, useEffect } from 'react';\nimport api from '../api/axios';\n\nconst AuthContext = createContext();\n\nexport const AuthProvider = ({ children }) => {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    const token = localStorage.getItem('token');\n    if (token) {\n      api.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;\n      // Fetch user profile logic here\n    }\n    setLoading(false);\n  }, []);\n\n  const login = (token, userData) => {\n    localStorage.setItem('token', token);\n    api.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;\n    setUser(userData);\n  };\n\n  return (\n    <AuthContext.Provider value={{ user, login, loading }}>\n      {children}\n    </AuthContext.Provider>\n  );\n};\n\nexport const useAuth = () => useContext(AuthContext);`
          },
          {
            order: 9,
            title: '9. Navbar Component ( client/src/components/Navbar.js )',
            description: 'Step 2.3: Dynamic Navigation based on Auth State',
            code: `import { Link } from 'react-router-dom';\nimport { useAuth } from '../context/AuthContext';\n\nexport default function Navbar() {\n  const { user } = useAuth();\n\n  return (\n    <nav className="flex justify-between p-4 bg-slate-900 text-white">\n      <Link to="/" className="font-bold">MERN Auth</Link>\n      <div className="flex gap-4">\n        {user ? (\n          <span>Welcome, {user.name}</span>\n        ) : (\n          <><Link to="/login">Login</Link><Link to="/register">Register</Link></>\n        )}\n      </div>\n    </nav>\n  );\n}`
          },
          {
            order: 10,
            title: '10. Login Page ( client/src/pages/Login.js )',
            description: 'Step 2.4: Handle Login Form Submission',
            code: `import { useState } from 'react';\nimport api from '../api/axios';\nimport { useAuth } from '../context/AuthContext';\n\nexport default function Login() {\n  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n  const { login } = useAuth();\n\n  const handleSubmit = async (e) => {\n    e.preventDefault();\n    try {\n      const res = await api.post('/auth/login', { email, password });\n      login(res.data.token, res.data.user);\n    } catch (err) { alert(err.response.data.message); }\n  };\n\n  return (\n    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto p-8">\n      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />\n      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />\n      <button type="submit">Login</button>\n    </form>\n  );\n}`
          },
          {
            order: 11,
            title: '11. Protected Route ( client/src/components/ProtectedRoute.js )',
            description: 'Step 2.5: Guarding Auth-only Pages',
            code: `import { Navigate } from 'react-router-dom';\nimport { useAuth } from '../context/AuthContext';\n\nexport default function ProtectedRoute({ children }) {\n  const { user, loading } = useAuth();\n  if (loading) return <div>Loading...</div>;\n  return user ? children : <Navigate to="/login" />;\n}`
          },
          {
            order: 12,
            title: '12. App Component ( client/src/App.js )',
            description: 'Step 2.6: Bringing it all Together',
            code: `import { BrowserRouter, Routes, Route } from 'react-router-dom';\nimport { AuthProvider } from './context/AuthContext';\nimport Navbar from './components/Navbar';\nimport Login from './pages/Login';\nimport ProtectedRoute from './components/ProtectedRoute';\n\nfunction App() {\n  return (\n    <AuthProvider>\n      <BrowserRouter>\n        <Navbar />\n        <Routes>\n          <Route path="/login" element={<Login />} />\n          <Route path="/dashboard" element={<ProtectedRoute><h1>Dashboard</h1></ProtectedRoute>} />\n        </Routes>\n      </BrowserRouter>\n    </AuthProvider>\n  );\n}\n\nexport default App;`
          }
        ]
      }
    },
  });

  // 4. Next.js
  const nextjs = await prisma.language.upsert({
    where: { slug: 'nextjs' },
    update: {},
    create: {
      name: 'Next.js',
      slug: 'nextjs',
      icon: 'nextjs-icon',
    },
  });

  const nextjsHooks = await prisma.category.upsert({
    where: { languageId_slug: { languageId: nextjs.id, slug: 'server-actions' } },
    update: {},
    create: {
      name: 'Server Actions',
      slug: 'server-actions',
      languageId: nextjs.id,
    },
  });

  await prisma.snippet.create({
    data: {
      title: 'Optimistic UI Update',
      description: 'Next.js 14+ Server Action with useOptimistic hook.',
      categoryId: nextjsHooks.id,
      code: `
'use client';

import { useOptimistic } from 'react';
import { updateTodo } from './actions';

export function TodoItem({ todo }) {
  const [optimisticTodo, addOptimisticTodo] = useOptimistic(
    todo,
    (state, newTodo) => ({ ...state, ...newTodo })
  );

  return (
    <div onClick={async () => {
      addOptimisticTodo({ text: 'Updating...' });
      await updateTodo(todo.id);
    }}>
      {optimisticTodo.text}
    </div>
  );
}
      `.trim(),
    },
  });


  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
