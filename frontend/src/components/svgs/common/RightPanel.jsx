import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useFollow from "../../../hooks/useFollow.jsx";

import RightPanelSkeleton from "../../skeletons/RightPanelSkeleton.jsx";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
	const { data: suggestedUsers, isLoading } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/users/suggested");
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong!");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
	});

	const { follow, isPending } = useFollow();

	if (suggestedUsers?.length === 0) return <div className='w-96'></div>;

	return (
		<div className='hidden lg:block w-96 px-4 bg-black'>
			<div className='border border-green-400 rounded-lg p-4 space-y-4 sticky top-2 bg-black font-mono'>
				{/* Terminal Header */}
				<div className='flex items-center space-x-2 border-b border-green-400 pb-2'>
					<div className='w-3 h-3 rounded-full bg-red-500'></div>
					<div className='w-3 h-3 rounded-full bg-yellow-500'></div>
					<div className='w-3 h-3 rounded-full bg-green-400'></div>
					<span className='text-green-400 ml-4'>users.log</span>
				</div>

				<div className='space-y-2'>
					<div className='text-green-400 text-sm'>$ cat suggested_users.txt</div>
					<h3 className='text-green-300 font-bold'>Active developers to follow</h3>
				</div>

				<div className='space-y-3'>
					{isLoading && (
						<div className='space-y-2'>
							<div className='text-green-600'>Loading user data...</div>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</div>
					)}
					{!isLoading &&
						suggestedUsers?.map((user) => (
							<div
								className='border border-green-600 p-3 hover:border-green-400 transition-colors'
								key={user._id}
							>
								<Link
									to={`/profile/${user.username}`}
									className='flex justify-between items-center'
								>
									<div className='flex items-center gap-3 flex-1 min-w-0'>
										<div className='w-10 h-10 border border-green-400 rounded-full overflow-hidden flex-shrink-0'>
											<img 
												src={user.profileImg || "/avatar-placeholder.jpg"} 
												alt="Avatar" 
												className='w-full h-full object-cover'
											/>
										</div>
										<div className='min-w-0 flex-1'>
											<h4 className='text-sm font-semibold text-green-400 truncate'>
												{user.fullName}
											</h4>
											<p className='text-xs text-green-600 truncate'>@{user.username}</p>
										</div>
									</div>
								</Link>
								<button
									className='w-full mt-2 border border-green-400 bg-black text-green-400 text-xs px-3 py-1 hover:bg-green-400 hover:text-black transition-colors'
									onClick={(e) => {
										e.preventDefault();
										follow(user._id);
									}}
								>
									{isPending ? "connecting..." : "$ git follow"}
								</button>
							</div>
						))}
				</div>
				
				<div className='text-green-600 text-xs border-t border-green-400 pt-2'>
					tip: use 'git log --oneline' to see recent activity
				</div>
			</div>
		</div>
	);
};
export default RightPanel;