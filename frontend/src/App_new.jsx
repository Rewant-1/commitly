import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import SignUpPage from "./pages/auth/Signup.jsx";
import NotificationPage from "./pages/notification/NotificationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import Sidebar from "./components/svgs/common/Sidebar.jsx";
import RightPanel from "./components/svgs/common/RightPanel.jsx";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/svgs/common/LoadingSpinner.jsx";

function App() {
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
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
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
				<Route path='*' element={<NotFoundPage />} />
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
