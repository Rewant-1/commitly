import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/Signup";
const NotificationPage = React.lazy(() => import("./pages/notification/NotificationPage"));
const ProfilePage = React.lazy(() => import("./pages/profile/ProfilePage"));
const Sidebar = React.lazy(() => import("./components/svgs/common/Sidebar"));
const RightPanel = React.lazy(() => import("./components/svgs/common/RightPanel"));
import { Toaster } from "react-hot-toast";
import React from "react";
import LoadingSpinner from "./components/svgs/common/LoadingSpinner";


import useAuth from "./context/useAuth";

function App() {
  const { user: authUser, loading: isLoading } = useAuth();

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
      <Toaster />
    </div>
  );
}

export default App;
