# commitly — Developer Social Platform

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=flat-square&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)

**A terminal-themed social platform for developers. Think Twitter, but for people who prefer `git commit -m` over tweets.**

[Live Demo](https://commitly-152b.onrender.com) · [Features](#features) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started)

</div>

---

## Why I Built This

I wanted a social platform that actually feels like home for developers—terminal aesthetics, git-inspired interactions, and fast performance. Instead of "What's happening?", you get `$ git commit -m "your thoughts"`.

## Features

### Core Functionality
- **Authentication** — JWT-based auth with httpOnly cookies (no localStorage token exposure)
- **Posts** — Create, delete, like, comment, bookmark, and repost
- **Social Graph** — Follow/unfollow users, suggested users algorithm
- **Notifications** — Real-time notifications for likes, follows, and reposts
- **Profiles** — Editable profiles with Cloudinary image uploads

### Performance
- **Paginated Feeds** — Server-side pagination (`page`/`limit` params) with infinite scroll on client
- **Optimistic Updates** — UI updates immediately while API calls happen in background
- **Code Splitting** — React lazy loading + Vite manual chunks (react, router, query bundles)
- **Asset Caching** — Static assets cached for 1 year with immutable headers
- **Request Validation** — Zod schemas validate body, params, and query before hitting controllers

### Lighthouse Scores (Desktop, Median of 3 Runs)
| Metric | Score |
|--------|-------|
| Performance | **99** |
| Accessibility | **100** |
| Best Practices | **96** |
| SEO | **91** |
| FCP | ≈532ms |
| LCP | ≈600ms |
| CLS | 0.006 |

### API Throughput (Autocannon — 20 connections, 15s)
- **≈78.67 req/s** throughput
- **p50 latency: ≈205ms**, p97.5: ≈597ms

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, React Router v7, TanStack Query v5, TailwindCSS, daisyUI |
| **Backend** | Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs |
| **Validation** | Zod (request body/params/query validation) |
| **Media** | Cloudinary (profile pics, cover images, post images) |
| **Security** | Helmet, httpOnly cookies, password hashing |
| **Performance** | Compression, static asset caching, lazy loading |
| **CI/CD** | GitHub Actions (build + lint on push/PR) |

---

## Project Structure

```
commitly/
├── backend/
│   ├── controllers/      # Route handlers (auth, posts, users, notifications)
│   ├── middleware/       # protectRoute, validateRequest, errorHandler
│   ├── models/           # Mongoose schemas with indexes
│   ├── routes/           # Express route definitions
│   ├── validation/       # Zod schemas for request validation
│   └── server.js         # Entry point with security/compression middleware
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI (Post, Sidebar, RightPanel, Skeletons)
│   │   ├── context/      # AuthContext with useAuth hook
│   │   ├── hooks/        # Custom hooks (useFollow, useUpdateUserProfile)
│   │   ├── pages/        # Page components (Home, Profile, Auth, Notifications)
│   │   └── utils/        # Helper functions (date formatting, toast)
│   └── vite.config.js    # Build config with code splitting
│
└── .github/workflows/    # CI pipeline
```

---

## Getting Started

### Prerequisites
- Node.js 22.x (matches CI)
- MongoDB (local or Atlas)
- Cloudinary account (free tier works)

### Setup

1. **Clone and install**
```bash
git clone https://github.com/Rewant-1/commitly.git
cd commitly
npm install
npm install --include=dev --prefix frontend
```

2. **Environment variables** — Create `.env` in root:
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

3. **Seed sample data (optional)**
```bash
npm run seed
```

4. **Run development servers**
```bash
# Terminal 1 — Backend
npm start

# Terminal 2 — Frontend  
cd frontend && npm run dev
```

App runs at `http://localhost:5173`

---

## API Reference

All routes except `/api/health` require authentication (JWT in httpOnly cookie).

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout (clears cookie) |
| GET | `/api/auth/me` | Get current user |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/all?page=1&limit=10` | All posts (paginated) |
| GET | `/api/posts/following?page=1&limit=10` | Following feed |
| GET | `/api/posts/user/:username` | User's posts |
| GET | `/api/posts/likes/:id` | User's liked posts |
| GET | `/api/posts/bookmarks/:id` | User's bookmarks |
| POST | `/api/posts/create` | Create post |
| POST | `/api/posts/like/:id` | Like/unlike |
| POST | `/api/posts/bookmark/:id` | Bookmark toggle |
| POST | `/api/posts/comment/:id` | Add comment |
| DELETE | `/api/posts/:id` | Delete post |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile/:username` | Get profile |
| GET | `/api/users/suggested` | Suggested users |
| POST | `/api/users/follow/:id` | Follow/unfollow |
| POST | `/api/users/update` | Update profile |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications |
| DELETE | `/api/notifications` | Clear all |

---

## Performance Optimizations

1. **Frontend**
   - Lazy-loaded routes with React.lazy + Suspense
   - TanStack Query for caching and background refetching
   - Intersection Observer for infinite scroll (no scroll event listeners)
   - Code splitting: separate chunks for react, router, and query

2. **Backend**
   - MongoDB indexes on `createdAt` and `user` fields for feed queries
   - Compression middleware (gzip)
   - Static asset caching with 1-year max-age
   - Zod validation short-circuits invalid requests before DB calls

3. **Security**
   - Helmet for security headers
   - JWT stored in httpOnly cookies (not localStorage)
   - Password hashing with bcrypt (10 rounds)
   - Request body limit (5MB) to prevent payload attacks

---

## Deployment

The app is deployed on [Render](https://render.com) with:
- Backend serving the built frontend (`frontend/dist`)
- MongoDB Atlas for database
- Cloudinary for media storage

Build command for Render:
```bash
npm run build
```

Start command:
```bash
npm start
```

---

## Future Improvements

- [ ] WebSocket for real-time notifications
- [ ] Search functionality
- [ ] Direct messages
- [ ] Dark/light theme toggle
- [ ] Rate limiting middleware

---




