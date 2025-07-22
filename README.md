# SocialSphere - Modern Social Media Platform

![SocialSphere](https://img.shields.io/badge/SocialSphere-v1.0.0-blue?style=for-the-badge&logo=twitter)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwindcss)

A modern, feature-rich social media platform built with cutting-edge technologies to showcase full-stack development skills. SocialSphere combines the best of modern web development with an elegant, responsive design and real-time features.

## 🌟 Live Demo

[Visit SocialSphere](http://localhost:3000) *(Local development server)*

## 🚀 Features

### ✨ Core Features
- **🔐 Authentication System** - Secure JWT-based authentication with bcrypt password hashing
- **📝 Real-time Posts** - Create, edit, and delete posts with instant updates
- **❤️ Interactive Engagement** - Like and comment on posts with real-time notifications
- **👥 User Connections** - Follow/unfollow users and build your network
- **🔔 Smart Notifications** - Real-time notifications for likes, comments, and follows
- **👤 User Profiles** - Customizable profiles with bio, cover images, and profile pictures
- **📱 Responsive Design** - Fully responsive across all devices and screen sizes

### 🎨 Modern UI/UX
- **🌙 Dark Theme** - Beautiful dark theme with gradient accents
- **✨ Glass Morphism** - Modern glass effects and backdrop blur
- **🎭 Smooth Animations** - Engaging micro-interactions and transitions
- **📐 Clean Layout** - Intuitive navigation and organized content structure
- **🎨 Custom Design System** - Consistent branding and visual hierarchy

### 🛡️ Technical Excellence
- **⚡ Performance Optimized** - Fast loading times and optimized bundle size
- **🔄 Real-time Updates** - WebSocket-like experience with React Query
- **📊 State Management** - Efficient state management with TanStack Query
- **🔒 Security Best Practices** - Protected routes, input validation, and secure headers
- **📱 Progressive Web App** - PWA capabilities for enhanced user experience

## 🛠️ Tech Stack

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

## 📁 Project Structure

```
twitter/
├── backend/
│   ├── controllers/          # Route controllers
│   │   ├── auth.controller.js
│   │   ├── notification.controller.js
│   │   ├── post.controller.js
│   │   └── user.controller.js
│   ├── db/                   # Database configuration
│   │   └── connectMongoDb.js
│   ├── lib/utils/           # Utility functions
│   │   └── generateToken.js
│   ├── middleware/          # Custom middleware
│   │   └── protectRoute.js
│   ├── models/              # Database models
│   │   ├── notification.model.js
│   │   ├── post.model.js
│   │   └── user.model.js
│   ├── routes/              # API routes
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
│   │   ├── pages/          # Page components
│   │   │   ├── auth/       # Authentication pages
│   │   │   ├── notification/ # Notification pages
│   │   │   ├── profile/    # Profile pages
│   │   │   ├── LandingPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── utils/          # Frontend utilities
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # App entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   └── vite.config.js      # Vite configuration
├── logs/                   # Application logs
├── package.json            # Root package configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/socialsphere.git
   cd socialsphere
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

5. **Start the development servers**
   
   Backend (from root directory):
   ```bash
   npm run dev
   ```
   
   Frontend (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 🎯 API Endpoints

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

## 🎨 Design System

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

## 📈 Performance Optimizations

- **Code Splitting**: Lazy loading for routes and components
- **Image Optimization**: Cloudinary integration for responsive images
- **Caching**: TanStack Query for efficient data caching
- **Bundle Optimization**: Vite for fast builds and HMR
- **Database**: Optimized MongoDB queries with proper indexing

## 🔒 Security Features

- **Authentication**: JWT tokens with secure httpOnly cookies
- **Password Security**: bcrypt hashing with salt rounds
- **Input Validation**: Server-side validation for all inputs
- **CORS**: Properly configured cross-origin requests
- **Protected Routes**: Frontend and backend route protection
- **XSS Protection**: Input sanitization and output encoding

## 🚦 Testing

Currently implements manual testing strategies. Future enhancements will include:
- Unit tests with Jest and React Testing Library
- Integration tests for API endpoints
- E2E tests with Cypress
- Performance testing with Lighthouse

## 📦 Deployment

### Frontend (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables

### Backend (Railway/Heroku)
1. Set up environment variables
2. Configure start script: `npm start`
3. Ensure MongoDB connection string is updated

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern social media platforms
- **Icons**: React Icons library
- **UI Components**: DaisyUI and Tailwind CSS
- **Fonts**: Google Fonts (Inter)
- **Images**: Unsplash for demo content

## 📞 Contact

**Your Name** - [your.email@example.com](mailto:your.email@example.com)

**Project Link**: [https://github.com/yourusername/socialsphere](https://github.com/yourusername/socialsphere)

**Portfolio**: [https://yourportfolio.com](https://yourportfolio.com)

---

<div align="center">
  <p>Built with ❤️ to showcase full-stack development skills</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
