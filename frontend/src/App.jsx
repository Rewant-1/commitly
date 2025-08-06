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
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/svgs/common/LoadingSpinner";

function App() {
	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		retry: false,
	});

	if (isLoading) {
		return (
			<div className='h-screen flex justify-center items-center bg-[#101014]'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-[#101014]'>
			<Routes>
				<Route path='/login' element={<div className='max-w-md mx-auto'><LoginPage /></div>} />
				<Route path='/signup' element={<div className='max-w-md mx-auto'><SignUpPage /></div>} />
				<Route
					path='/'
					element={authUser ? (
						<div className='flex max-w-7xl mx-auto'>
							<Sidebar />
							<HomePage />
							<RightPanel />
						</div>
					) : (
						<LandingPage />
					)}
				/>
				<Route
					path='/notifications'
					element={authUser ? (
						<div className='flex max-w-7xl mx-auto'>
							<Sidebar />
							<NotificationPage />
							<RightPanel />
						</div>
					) : (
						<Navigate to='/login' />
					)}
				/>
				<Route
					path='/profile/:username'
					element={authUser ? (
						<div className='flex max-w-7xl mx-auto'>
							<Sidebar />
							<ProfilePage />
							<RightPanel />
						</div>
					) : (
						<Navigate to='/login' />
					)}
				/>
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;