import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../../components/svgs/common/LoadingSpinner";

import { IoSettingsOutline, IoNotifications } from "react-icons/io5";
import { FaUser, FaTrash } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { VscGitCommit } from "react-icons/vsc";
import { formatPostDate } from "../../utils/date/index";

const NotificationPage = () => {
	const queryClient = useQueryClient();
	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/notifications");
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/notifications", {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("All notifications cleared");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-green-400/60 min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black relative overflow-hidden'>
				{/* Background pattern */}
				<div className="absolute inset-0 opacity-5">
					<div className="absolute top-20 left-10 text-green-400/30 text-6xl font-mono">{'>'}</div>
					<div className="absolute top-40 right-20 text-green-400/20 text-4xl font-mono">$</div>
					<div className="absolute bottom-40 right-10 text-green-400/20 text-5xl font-mono">{'~'}</div>
				</div>

				{/* Header */}
				<div className='flex justify-between items-center p-6 border-b border-green-400/60 bg-gradient-to-r from-black via-gray-950 to-black backdrop-blur-sm relative z-10'>
					<div className="flex items-center gap-3">
						<div className="p-2 bg-green-400/10 rounded-lg">
							<IoNotifications className="w-5 h-5 text-green-400" />
						</div>
						<div>
							<h1 className='font-bold text-green-400 text-xl font-mono'>Notifications</h1>
							<p className='text-green-400/60 text-sm font-mono'>git log --alerts</p>
						</div>
					</div>
					<div className='dropdown dropdown-end'>
						<div tabIndex={0} role='button' className='btn btn-ghost btn-circle hover:bg-green-400/10 transition-all duration-300'>
							<IoSettingsOutline className='w-5 h-5 text-green-400 hover:text-green-300 transition-colors' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-3 shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl w-56 border border-green-400/40 backdrop-blur-sm'
						>
							<li>
								<button
									type='button'
									onClick={deleteNotifications}
									className='text-green-300 font-mono hover:bg-green-400/10 hover:text-green-200 w-full text-left rounded-lg p-3 transition-all duration-300 flex items-center gap-3'
								>
									<FaTrash className="w-4 h-4" />
									<span>git clean --all</span>
								</button>
							</li>
						</ul>
					</div>
				</div>

				{/* Content */}
				<div className="relative z-10">
					{isLoading && (
						<div className='flex justify-center h-96 items-center'>
							<LoadingSpinner size='lg' />
						</div>
					)}
					
					{notifications?.length === 0 && (
						<div className='text-center p-12'>
							<div className="text-8xl mb-6 opacity-30">🔔</div>
							<p className='font-bold text-green-400 font-mono text-xl mb-2'>All caught up!</p>
							<p className='text-green-500/70 font-mono'>No new notifications to review</p>
							<div className="mt-6 p-4 bg-green-400/5 rounded-xl border border-green-400/20 max-w-md mx-auto">
								<p className='text-green-400/80 font-mono text-sm'>
									$ git status: clean working tree ✨
								</p>
							</div>
						</div>
					)}
					
					{notifications?.map((notification) => (
						<div className='border-b border-green-400/20 hover:bg-green-400/5 transition-all duration-300 group' key={notification?._id}>
							<div className='flex gap-4 p-6 items-start'>
								{/* Notification Icon */}
								<div className="flex-shrink-0">
									{notification.type === "follow" && (
										<div className="p-3 bg-blue-400/10 rounded-lg border border-blue-400/30">
											<FaUser className='w-5 h-5 text-blue-400' />
										</div>
									)}
									{notification.type === "like" && (
										<div className="p-3 bg-pink-400/10 rounded-lg border border-pink-400/30">
											<FaHeart className='w-5 h-5 text-pink-400' />
										</div>
									)}
								</div>

								{/* Notification Content */}
								<div className="flex-1 min-w-0">
									<Link to={`/profile/${notification.from.username}`} className="block group-hover:scale-[1.01] transition-transform duration-300">
										<div className='flex gap-3 items-start'>
											<div className='avatar flex-shrink-0'>
												<div className='w-10 h-10 rounded-full border-2 border-green-400/50 overflow-hidden shadow-lg group-hover:border-green-400 transition-all duration-300'>
													<img src={notification.from.profileImg || "/avatars/boy5.jpg"} className="w-full h-full object-cover" />
												</div>
											</div>
											<div className='flex-1 min-w-0'>
												<div className='flex flex-wrap items-center gap-2 mb-1'>
													<span className='font-bold text-green-300 font-mono group-hover:text-green-200 transition-colors'>
														{notification.from.fullName}
													</span>
													<span className='text-green-500/70 font-mono text-sm'>
														@{notification.from.username}
													</span>
													{notification.createdAt && (
														<>
															<span className='text-green-500/50'>·</span>
															<span className='text-green-500/70 font-mono text-sm'>
																{formatPostDate(notification.createdAt)}
															</span>
														</>
													)}
												</div>
												<div className='flex items-center gap-2 text-sm'>
													<VscGitCommit className='w-4 h-4 text-green-400/70' />
													<span className='text-green-200 font-mono'>
														{notification.type === "follow" 
															? "started following your repository" 
															: "starred your commit"
														}
													</span>
													<span className='text-green-400/60 font-mono text-xs px-2 py-1 bg-green-400/10 rounded border border-green-400/20'>
														{notification.type === "follow" ? "git follow" : "git star"}
													</span>
												</div>
											</div>
										</div>
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
};
export default NotificationPage;