# 🚀 Deployment Guide: Render (Backend) & Vercel (Frontend)

This guide provides the exact steps to deploy your MERN stack application with the Backend on Render and the Frontend on Vercel.

---

## 🏗️ 1. Backend Deployment (Render)

1. **Connect Repository**: Create a new **Web Service** on Render and connect your GitHub repository.
2. **Environment**: Select **Node**.
3. **Build Command**: 
   ```bash
   cd server && npm install && npm run build
   ```
4. **Start Command**: 
   ```bash
   cd server && npm start
   ```
5. **Environment Variables**: Add the following in Render's dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string (e.g., from Neon.tech).
   - `GEMINI_API_KEY`: Your Google AI Gemini API key.
   - `JWT_SECRET`: A secure random string.
   - `NODE_ENV`: `production`

---

## 🎨 2. Frontend Deployment (Vercel)

1. **New Project**: Create a new project on Vercel and connect your repository.
2. **Framework Preset**: Select **Vite**.
3. **Root Directory**: Select the `client` folder (or set it in the project settings).
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables**:
   - `VITE_API_URL`: `https://codefoundry.onrender.com/api`
7. **SPAs Support**: Vercel handles this automatically for Vite projects, but ensure you have a `vercel.json` in the `client` root if you face 404s on refresh:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

---

## 🛠️ 3. Features & Security

- **CORS**: The backend is configured to `origin: '*Available'`, allowing your Vercel frontend to communicate with the Render API without issues.
- **Prisma**: The build command automatically runs `prisma generate`.
- **Database**: Ensure you run `npx prisma db push` from your local machine targeting the production `DATABASE_URL` before the first deploy to sync the schema.

---

## 🔗 Connection Checklist
- [ ] Render Backend Status: `Live`
- [ ] Vercel Frontend URL added to `VITE_API_URL`
- [ ] DB connection string verified in Render settings
- [ ] Gemini API key verified in Render settings
