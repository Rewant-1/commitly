// Main App component - handles routing and layout for commitly social app
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/Signup";

// Lazy load heavy components for better performance
const NotificationPage = React.lazy(() => import(/* webpackPrefetch: true */ "./pages/notification/NotificationPage"));
const ProfilePage = React.lazy(() => import(/* webpackPrefetch: true */ "./pages/profile/ProfilePage"));
const Sidebar = React.lazy(() => import(/* webpackPreload: true */ "./components/svgs/common/Sidebar"));
const RightPanel = React.lazy(() => import(/* webpackPrefetch: true */ "./components/svgs/common/RightPanel"));
import React from "react";
import LoadingSpinner from "./components/svgs/common/LoadingSpinner";

import useAuth from "./context/useAuth";

// Lazy load toast notifications to reduce initial bundle size
const ToasterLazy = React.lazy(() => import("react-hot-toast").then(m => ({ default: m.Toaster })));

function App() {
  // Get current user authentication state
  const { user: authUser, loading: isLoading } = useAuth();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#101014]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101014]">
      <Routes>
        {/* Auth routes - accessible when not logged in */}
        <Route
          path="/login"
          element={
            <div className="max-w-md mx-auto">
              <LoginPage />
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div className="max-w-md mx-auto">
              <SignUpPage />
            </div>
          }
        />
        
        {/* Home route - show feed if authenticated, landing page if not */}
        <Route
          path="/"
          element={
            authUser ? (
              <React.Suspense fallback={<div className="flex max-w-7xl mx-auto"><div className="flex-1" /><LoadingSpinner size="lg" /><div className="flex-1" /></div>}>
                <div className="flex max-w-7xl mx-auto">
                  <Sidebar />
                  <HomePage />
                  <RightPanel />
                </div>
              </React.Suspense>
            ) : (
              <LandingPage />
            )
          }
        />
        
        {/* Protected routes - require authentication */}
        <Route
          path="/notifications"
          element={
            authUser ? (
              <React.Suspense fallback={<div className="flex max-w-7xl mx-auto"><LoadingSpinner size="lg" /></div>}>
                <div className="flex max-w-7xl mx-auto">
                  <Sidebar />
                  <NotificationPage />
                  <RightPanel />
                </div>
              </React.Suspense>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile/:username"
          element={
            authUser ? (
              <React.Suspense fallback={<div className="flex max-w-7xl mx-auto"><LoadingSpinner size="lg" /></div>}>
                <div className="flex max-w-7xl mx-auto">
                  <Sidebar />
                  <ProfilePage />
                  <RightPanel />
                </div>
              </React.Suspense>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      
      {/* Global toast notifications */}
      <React.Suspense fallback={null}><ToasterLazy /></React.Suspense>
    </div>
  );
}

export default App;
