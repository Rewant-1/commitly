import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import Signup from './pages/auth/Signup';
import Sidebar from './components/svgs/common/Sidebar';
import RightPanel from './components/svgs/common/RightPanel';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/svgs/common/LoadingSpinner';

function App() {
  const {data:authUser,isLoading,error,isError}=useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try{
      const res = await fetch('/api/auth/me');
      const data= await res.json();
      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }
      console.log("authUser is here:",data);
      return data;
    } catch (error) {
      throw new Error(error); // Return null or handle the error as needed
    }
    
  },});
  if (isLoading) {
    return (<div className='h-screen flex justify-center items-center'><LoadingSpinner size='lg' /></div>)
  }
  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="flex">
        <Sidebar />
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
          <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
          <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
        <RightPanel />
        <Toaster />
      </div>
    </div>
  );
}

export default App
