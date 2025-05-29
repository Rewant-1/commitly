import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import Signup from './pages/auth/Signup';
import Sidebar from './components/svgs/common/Sidebar';
import RightPanel from './components/svgs/common/RightPanel';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
function App() {
  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="flex">
        <Sidebar />
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/notifications" element={<NotificationPage />}/>
          <Route path="/profile/:username" element={<ProfilePage />}/>
        </Routes>
        <RightPanel />
      </div>
    </div>
  );
}

export default App
