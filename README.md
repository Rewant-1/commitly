# commitly — Terminal-Inspired Social Platform

![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)
![Tailwind](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![daisyUI](https://img.shields.io/badge/daisyUI-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)

A developer-themed social app with a terminal-style UI. Built with React (Vite), Express, and MongoDB.

## Live Demo

https://commitly-152b.onrender.com

## What you can do

**Core**
- Signup/login (JWT stored in httpOnly cookies)
- Create/delete posts, comment, like
- Bookmarks + reposts
- Notifications (follow/like/repost)

**UX / performance**
- Terminal-inspired UI (monospace + CLI-ish styling)
- Paginated feeds (`page`/`limit`) + infinite scrolling on the client
- Cloudinary uploads (profile + post media)
- Client caching + invalidation with TanStack Query

**Quality**
- Zod request validation on backend (body/params/query)
- MongoDB indexes for common feed/notification queries
- CI via GitHub Actions (build + lint)

## Tech Stack

**Frontend**: React, Vite, React Router, TanStack Query, TailwindCSS, daisyUI

**Backend**: Node.js, Express, MongoDB, Mongoose, Zod, JWT, bcryptjs, Cloudinary

## Project Structure

```
commitly/
├── backend/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    ├── package.json
    └── vite.config.js
```

## Getting Started (local)

### Prerequisites
- Node.js **22.x** (recommended; matches CI)
- MongoDB (local or Atlas)

### Setup

1) Install deps

```bash
npm install
npm install --include=dev --prefix frontend
```

2) Add env

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

3) (Optional) Seed data

```bash
npm run seed
```

4) Run backend + frontend

Backend (from root):

```bash
npm start
```

Frontend (new terminal):

```bash
cd frontend
npm run dev
```

App: `http://localhost:5173`

## API (quick reference)

Most API routes require auth (httpOnly cookie) — `GET /api/health` is public.

**Auth**
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

**Posts**
- `GET /api/posts/all?page=1&limit=10`
- `GET /api/posts/following?page=1&limit=10`
- `GET /api/posts/user/:username?page=1&limit=10`
- `GET /api/posts/likes/:id?page=1&limit=10`
- `GET /api/posts/bookmarks/:id?page=1&limit=10`
- `GET /api/posts/reposts/:id?page=1&limit=10`
- `POST /api/posts/create`
- `POST /api/posts/like/:id`
- `POST /api/posts/bookmark/:id`
- `POST /api/posts/repost/:id`
- `POST /api/posts/comment/:id`
- `DELETE /api/posts/:id`

**Users**
- `GET /api/users/profile/:username`
- `GET /api/users/suggested`
- `POST /api/users/follow/:id`
- `POST /api/users/update`

**Notifications**
- `GET /api/notifications`
- `DELETE /api/notifications`

**Health**
- `GET /api/health`

## Metrics (for resume)

If you want metrics that are easy to defend in interviews, generate them from reproducible tools and keep the reports.

### Lighthouse (performance)

Run on the deployed URL (desktop preset shown):

```bash
npx lighthouse https://commitly-152b.onrender.com --preset=desktop --output html --output-path lighthouse-desktop.html
```

Run 3 times and use the median.

**Latest results (desktop, median of 3 runs — Dec 27, 2025)**

- Scores: Performance **99**, Accessibility **100**, Best Practices **96**, SEO **91**
- Core metrics: **FCP ~532ms**, **LCP ~600ms**, **TBT 0ms**, **CLS 0.006**, **Speed Index ~1161ms**

### API throughput (basic)

Use a public endpoint for benchmarking:

```bash
npx autocannon -c 20 -d 15 https://commitly-152b.onrender.com/api/health
```

**Latest results (valid runs median — 20 connections, 15s)**

- Throughput: **~78.67 req/s**
- Latency: **p50 ~205ms**, **p97.5 ~597ms**

## Testing

Manual testing flows covered:
- Auth: signup/login/logout + protected routes
- Posts: create/delete/like/bookmark/repost/comment
- Feeds: all/following/user timeline + pagination
- Profile: update profile + follow/unfollow + suggestions
- Notifications: fetch + clear
