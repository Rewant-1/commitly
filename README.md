# commitly - Terminal-Inspired Social Platform

![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-Cache-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwindcss)
![daisyUI](https://img.shields.io/badge/daisyUI-UI-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)

A developer-themed social platform with a terminal-style UI. Built with React (Vite), Express, and MongoDB.

## Live Demo

[Visit commitly](https://commitly-152b.onrender.com)

Note: The frontend README references localhost for development; the link above is the public demo.

## Features

- Auth with JWT in httpOnly cookies
- Create/delete posts + comments + likes
- Bookmarks + reposts + notifications
- Paginated feeds (`page`/`limit`) + client infinite scrolling
- Cloudinary image uploads (profile + post media)

## Tech Stack

### Frontend
- **React 18.2.0** - Modern React with hooks and functional components
- **React Router DOM** - Client-side routing and navigation
- **TanStack Query** - Powerful data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Beautiful component library for Tailwind
- **React Icons** - Comprehensive icon library
- **React Hot Toast** - Elegant toast notifications
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling library
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and security
- **Cloudinary** - Cloud-based image and video management
- **Cookie Parser** - HTTP cookie parsing middleware
- **CORS** - Cross-Origin Resource Sharing support

### Development Tools

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

## Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rewant-1/commitly
   cd commitly
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

5. **Seed the database with sample data**

   ```bash
   npm run seed
   ```

6. **Start the development servers**
   
   Backend (from root directory):
   ```bash
   npm run dev
   ```
   
   Frontend (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## Key Features Showcase

### Terminal-Inspired UI
- Authentic terminal green-on-black color scheme
- Monospace fonts throughout the interface
- CLI-style command prompts and navigation
- Git terminology: "star" instead of "like", "watch" instead of "follow"

### Developer Data Seeding
The application comes with pre-populated developer-focused content.

### Post Creation with Git Syntax
Users can create posts using familiar git commit syntax:
```bash
-git commit -m "your message here"
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts/all` - Get all posts
- `GET /api/posts/following` - Get posts from followed users
- `GET /api/posts/all?page=1&limit=10` - Paginated feed
- `GET /api/posts/likes/:id` - Get post likes
- `GET /api/posts/bookmarks/:id` - Get bookmarked posts
- `GET /api/posts/reposts/:id` - Get reposted posts
- `GET /api/posts/user/:username` - Get user posts
- `POST /api/posts/create` - Create new post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/like/:id` - Like/unlike post
- `POST /api/posts/comment/:id` - Comment on post

### Users
- `GET /api/users/profile/:username` - Get user profile
- `GET /api/users/suggested` - Get suggested users
- `POST /api/users/follow/:id` - Follow/unfollow user
- `POST /api/users/update` - Update user profile

### Notifications
- `GET /api/notifications` - Get user notifications
- `DELETE /api/notifications` - Delete all notifications

### Health
- `GET /api/health` - Public healthcheck (useful for benchmarks)

## Design System

- Terminal-inspired UI (green-on-black, monospace styling)
- React components styled with Tailwind + DaisyUI

## Performance Optimizations

- **Code Splitting**: Lazy loading for routes and components
- **Image Optimization**: Cloudinary integration for responsive images
- **Caching**: TanStack Query for efficient data caching
- **Bundle Optimization**: Vite for fast builds and HMR
- **Database**: Optimized MongoDB queries with proper indexing

## Metrics (for resume)

If you want metrics that are easy to defend in interviews, generate them from reproducible tools and keep the reports.

### Lighthouse (performance)

Run on the deployed URL (desktop preset shown):

```bash
npx lighthouse https://commitly-152b.onrender.com --preset=desktop --output html --output-path lighthouse-desktop.html
```

Run 3 times and use the median for your resume.

**Latest results (desktop, median of 3 runs — Dec 27, 2025)**

- Scores: Performance **99**, Accessibility **100**, Best Practices **96**, SEO **91**
- Core metrics: **FCP ~532ms**, **LCP ~600ms**, **TBT 0ms**, **CLS 0.006**, **Speed Index ~1161ms**

### Bundle size (from build output)

The Vite build prints per-chunk sizes and gzip sizes. Keep a screenshot of the output from:

```bash
cd frontend
npm run build
```

### API latency (basic)

Use a load generator like `autocannon` against a read-only endpoint (example):

```bash
npx autocannon -c 20 -d 15 https://commitly-152b.onrender.com/api/health
```

**Latest results (valid runs median — 20 connections, 15s)**

- Throughput: **~78.67 req/s**
- Latency: **p50 ~205ms**, **p97.5 ~597ms**

Store the terminal output (or paste key numbers in a doc) so your metrics are verifiable.

## Security Features

- **Authentication**: JWT tokens with secure httpOnly cookies
- **Password Security**: bcrypt hashing with salt rounds
- **Input Validation**: Server-side validation for all inputs
- **Protected Routes**: Frontend and backend route protection

## Testing

Currently uses manual testing. Covered flows include:
- Authentication: signup, login, logout, protected route redirects
- Posts: create, delete, star/unstar, repost, bookmark, comment
- Feeds: all posts, following feed, user timeline
- Profile: edit profile, follow/unfollow, suggested users
- Notifications: follow, like, repost notifications lifecycle


## Acknowledgments

- **Design Inspiration**: Github/ CLI
- **Icons**: React Icons library
- **UI Components**: DaisyUI and Tailwind CSS
- **Fonts**: Google Fonts (Inter)
- **Images**: Unsplash for demo content



