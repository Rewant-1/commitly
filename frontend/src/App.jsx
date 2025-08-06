import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/Signup";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import Sidebar from "./components/svgs/common/Sidebar";
import RightPanel from "./components/svgs/common/RightPanel";
import { Toaster } from "react-hot-toast";
import React from "react";
import LoadingSpinner from "./components/svgs/common/LoadingSpinner";


import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isProfileRoute = location.pathname.startsWith("/profile");
  const isNotificationsRoute = location.pathname === "/notifications";
  const isHomeRoute = location.pathname === "/";
  // Only enable authUser query if on a protected route (not landing page) or if already authenticated
  const [authUser, setAuthUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    if (isHomeRoute || isNotificationsRoute || isProfileRoute) {
      fetch("/api/auth/me")
        .then(async (res) => {
          if (!res.ok) {
            setAuthUser(null);
            setIsLoading(false);
            return;
          }
          const data = await res.json();
          setAuthUser(data);
          setIsLoading(false);
        })
        .catch(() => {
          setAuthUser(null);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [location.pathname]);

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
              <div className="flex max-w-7xl mx-auto">
                <Sidebar />
                <HomePage />
                <RightPanel />
              </div>
            ) : (
              <LandingPage />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            authUser ? (
              <div className="flex max-w-7xl mx-auto">
                <Sidebar />
                <NotificationPage />
                <RightPanel />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile/:username"
          element={
            authUser ? (
              <div className="flex max-w-7xl mx-auto">
                <Sidebar />
                <ProfilePage />
                <RightPanel />
              </div>
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
