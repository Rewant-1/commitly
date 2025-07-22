import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import DotfileConfigModal from "../../DotfileConfigModal.jsx";

const Sidebar = () => {
	const queryClient = useQueryClient();
	const [showDotfileModal, setShowDotfileModal] = useState(false);
	
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});
	const { data: authUser } = useQuery({ 
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
	});

	return (
		<div className='md:flex-[2_2_0] w-18 max-w-64 bg-black'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-green-400 w-20 md:w-full font-mono'>
				{/* Terminal Header */}
				<div className='p-4 border-b border-green-400'>
					<div className='flex items-center space-x-2'>
						<div className='w-3 h-3 rounded-full bg-red-500'></div>
						<div className='w-3 h-3 rounded-full bg-yellow-500'></div>
						<div className='w-3 h-3 rounded-full bg-green-400'></div>
						<span className='text-green-400 ml-4 hidden md:block'>commitly.sh</span>
					</div>
				</div>

				{/* Navigation */}
				<div className='flex-1 p-4 space-y-2'>
					<div className='text-green-400 text-sm mb-4 hidden md:block'>
						user@commitly:~$
					</div>

					<ul className='space-y-1'>
						<li>
							<Link
								to='/'
								className='flex items-center gap-3 p-2 text-green-400 hover:bg-green-900/20 transition-colors border border-transparent hover:border-green-400'
							>
								<span className='text-green-400'>$</span>
								<span className='hidden md:block'>cd ~/home</span>
							</Link>
						</li>
						<li>
							<Link
								to='/notifications'
								className='flex items-center gap-3 p-2 text-green-400 hover:bg-green-900/20 transition-colors border border-transparent hover:border-green-400'
							>
								<span className='text-green-400'>$</span>
								<span className='hidden md:block'>ls notifications/</span>
							</Link>
						</li>
						<li>
							<Link
								to='/messages'
								className='flex items-center gap-3 p-2 text-green-400 hover:bg-green-900/20 transition-colors border border-transparent hover:border-green-400'
							>
								<span className='text-green-400'>$</span>
								<span className='hidden md:block'>ssh messages/</span>
							</Link>
						</li>
						<li>
							<Link
								to={`/profile/${authUser?.username}`}
								className='flex items-center gap-3 p-2 text-green-400 hover:bg-green-900/20 transition-colors border border-transparent hover:border-green-400'
							>
								<span className='text-green-400'>$</span>
								<span className='hidden md:block'>whoami</span>
							</Link>
						</li>
						<li>
							<button
								onClick={() => setShowDotfileModal(true)}
								data-settings-btn
								className='flex items-center gap-3 p-2 text-green-400 hover:bg-green-900/20 transition-colors border border-transparent hover:border-green-400 w-full text-left'
							>
								<span className='text-green-400'>$</span>
								<span className='hidden md:block'>vim ~/.config</span>
							</button>
						</li>
					</ul>
				</div>

				{/* User Info & Logout */}
				{authUser && (
					<div className='border-t border-green-400 p-4'>
						<Link
							to={`/profile/${authUser.username}`}
							className='flex items-center gap-3 p-2 hover:bg-green-900/20 transition-colors group'
						>
							<div className='w-8 h-8 border border-green-400 rounded-full overflow-hidden flex-shrink-0'>
								<img 
									src={authUser?.profileImg || "/avatar-placeholder.jpg"} 
									alt="Avatar"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className='flex-1 hidden md:block'>
								<div className='text-green-400 text-sm truncate'>{authUser?.fullName}</div>
								<div className='text-green-600 text-xs'>@{authUser?.username}</div>
							</div>
						</Link>
						<button
							onClick={(e) => {
								e.preventDefault();
								logout();
							}}
							data-logout-btn
							className='w-full mt-2 flex items-center gap-3 p-2 text-red-400 hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-400'
						>
							<span className='text-red-400'>$</span>
							<span className='hidden md:block'>exit</span>
						</button>
					</div>
				)}
			</div>
			
			{/* Dotfile Configuration Modal */}
			<DotfileConfigModal 
				isOpen={showDotfileModal} 
				onClose={() => setShowDotfileModal(false)} 
				authUser={authUser} 
			/>
		</div>
	);
};
export default Sidebar;