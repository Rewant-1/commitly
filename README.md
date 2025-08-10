# commitly - Terminal-Inspired Social Platform

![commitly](https://img.shields.io/badge/commitly-v1.0.0-green?style=for-the-badge&logo=terminal)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwindcss)

A premium, developer-centric social media platform built with cutting-edge technologies. commitly combines the familiar aesthetics of command-line interfaces with modern social networking features, creating a unique platform tailored specifically for developers and tech enthusiasts.

## Live Demo

[Visit commitly](https://commitly-152b.onrender.com)

Note: The frontend README references localhost for development; the link above is the public demo.

> **Note**: This is a portfolio demonstration project showcasing modern full-stack development practices with a unique CLI-inspired design.

## Features

### Terminal-Inspired Core Features

- **Full Terminal Aesthetic** - Complete terminal-style UI with green text on black background
- **Secure Authentication System** - JWT-based authentication with bcrypt password hashing
- **Git-Style Posts** - Posts displayed as git commits with authentic developer terminology
- **CLI-Style Comments** - Terminal-inspired comment system with command-line interface
- **Star System** - "Star" posts instead of traditional "likes" for developer appeal
- **Watch/Remotes System** - Follow users as "watching" and followers as "remotes"

### Developer-Centric Experience

- **Terminal Theme** - Authentic terminal colors with green-on-black color scheme
- **Responsive Design** - Terminal interface that works perfectly on all devices
- **Real-time Updates** - Live data synchronization with React Query
- **Advanced Features** - User discovery with "Who to watch" suggestions
- **Recently Starred** - Carousel of recently starred commits/posts

### Technical Excellence

- **Performance Optimized** - Fast loading times and optimized bundle size
- **Real-time Updates** - Efficient state management with TanStack Query
- **Smart Caching** - Intelligent data caching and invalidation
- **Security Best Practices** - Protected routes, input validation, and secure headers
- **Modern Architecture** - Component-based architecture with React hooks

## Tech Stac
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
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting and style consistency
- **Nodemon** - Automatic server restart during development
- **PostCSS** - CSS post-processing and optimization

## Project Structure

```
commitly/
├── backend/
│   ├── controllers/          # Route controllers
│   │   ├── auth.controller.js
   ```bash
   git clone https://github.com/Rewant-1/commitly
   cd commitly
   ```
│   │   └── user.controller.js
│   ├── db/                   # Database configuration
   ```bash
   npm install
   ```
│   │   └── generateToken.js
│   ├── middleware/          # Custom middleware
   ```bash
   cd frontend
   npm install
   cd ..
   ```
│   │   ├── notification.model.js
│   │   ├── post.model.js
│   │   └── user.model.js
   ```env
│   │   ├── auth.route.js
│   │   ├── notification.route.js
│   │   ├── post.route.js
│   │   └── user.route.js
│   └── server.js            # Express server setup
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── hooks/          # Custom React hooks
   ```bash
   npm run seed
   ```
│   │   │   ├── profile/    # Profile pages
│   │   │   ├── LandingPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── utils/          # Frontend utilities
   ```bash
   npm run dev
   ```
│   ├── package.json
│   └── vite.config.js      # Vite configuration
   ```bash
   cd frontend
   npm run dev
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
- `GET /api/posts/likes/:id` - Get post likes
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

## Design System

### Color Palette
- **Primary Blue**: `#3B82F6` (Tailwind blue-500)
- **Primary Purple**: `#8B5CF6` (Tailwind purple-500)
- **Background Dark**: `#0F172A` (Tailwind slate-900)
- **Surface**: `#1E293B` (Tailwind slate-800)
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#94A3B8` (Tailwind slate-400)

### Typography
- **Headings**: Inter font family with various weights
- **Body**: Default system font stack
- **Monospace**: For code elements

### Components
- **Buttons**: Gradient backgrounds with hover effects
- **Cards**: Glass morphism with backdrop blur
- **Forms**: Clean inputs with focus states
- **Navigation**: Sticky sidebar with active states

## Performance Optimizations

- **Code Splitting**: Lazy loading for routes and components
- **Image Optimization**: Cloudinary integration for responsive images
- **Caching**: TanStack Query for efficient data caching
- **Bundle Optimization**: Vite for fast builds and HMR
- **Database**: Optimized MongoDB queries with proper indexing

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

Future enhancements will include:
- Unit tests with Jest and React Testing Library
- Integration tests for API endpoints
- E2E tests with Cypress
- Performance testing with Lighthouse

## Deployment

### Frontend (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables

### Backend (Railway/Heroku)
1. Set up environment variables
2. Configure start script: `npm start`
3. Ensure MongoDB connection string is updated

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request


## Acknowledgments

- **Design Inspiration**: Github/ CLI
- **Icons**: React Icons library
- **UI Components**: DaisyUI and Tailwind CSS
- **Fonts**: Google Fonts (Inter)
- **Images**: Unsplash for demo content



