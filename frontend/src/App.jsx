import { Navigate, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import SignUpPage from "./pages/auth/Signup.jsx";
import NotificationPage from "./pages/notification/NotificationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import MessagesPage from "./pages/MessagesPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import Sidebar from "./components/svgs/common/Sidebar.jsx";
import RightPanel from "./components/svgs/common/RightPanel.jsx";
import CommandPalette from "./components/CommandPalette.jsx";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import ModernLoadingSpinner from "./components/ModernLoadingSpinner.jsx";

function App() {
	const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
	
	// Keyboard shortcut for command palette (Ctrl+K)
	useEffect(() => {
		const handleKeyDown = (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
				e.preventDefault();
				setIsCommandPaletteOpen(true);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const { data: authUser, isLoading } = useQuery({
		// we use queryKey to give a unique name to our query and refer to it later
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				console.log("authUser is here:", data);
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		retry: false,
	});

	if (isLoading) {
		return <ModernLoadingSpinner size="lg" message="Initializing commitly..." />;
	}

	return (
		<>
			<Routes>
				<Route path='/' element={authUser ? (
					<div className='flex max-w-6xl mx-auto'>
						<Sidebar />
						<HomePage />
						<RightPanel />
					</div>
				) : <LandingPage />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/notifications' element={authUser ? (
					<div className='flex max-w-6xl mx-auto'>
						<Sidebar />
						<NotificationPage />
						<RightPanel />
					</div>
				) : <Navigate to='/login' />} />
				<Route path='/profile/:username' element={authUser ? (
					<div className='flex max-w-6xl mx-auto'>
						<Sidebar />
						<ProfilePage />
						<RightPanel />
					</div>
				) : <Navigate to='/login' />} />
				<Route path='/messages' element={authUser ? <MessagesPage /> : <Navigate to='/login' />} />
				<Route path='/messages/:username' element={authUser ? <MessagesPage /> : <Navigate to='/login' />} />
				<Route path='*' element={<NotFoundPage />} />
			</Routes>
			
			{/* Command Palette - Available globally when logged in */}
			{authUser && (
				<CommandPalette 
					isOpen={isCommandPaletteOpen} 
					onClose={() => setIsCommandPaletteOpen(false)} 
				/>
			)}
			
			<Toaster />
		</>
	);
}

export default App;
