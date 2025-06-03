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
		<div className='hidden lg:block w-96 px-4'>
			<div className='bg-[#16181C] rounded-xl p-4 space-y-4 sticky top-2'>
				<h3 className='text-white text-lg font-bold'>Who to follow</h3>
				<div className='space-y-4'>
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestedUsers?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex justify-between items-center'
								key={user._id}
							>
								<div className='flex items-center gap-3 w-[240px]'>
									<div className='w-12 h-12 rounded-full overflow-hidden flex-shrink-0'>
										<img 
											src={user.profileImg || "/avatar-placeholder.jpg"} 
											alt="Avatar" 
											className='w-full h-full object-cover'
										/>
									</div>
									<div className='min-w-0 flex-1'>
										<h4 className='text-sm font-semibold text-white truncate'>
											{user.fullName}
										</h4>
										<p className='text-sm text-gray-500 truncate'>@{user.username}</p>
									</div>
								</div>
								<button
									className='bg-white text-black text-sm font-semibold px-5 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 flex-shrink-0'
									onClick={(e) => {
										e.preventDefault();
										follow(user._id);
									}}
								>
									{isPending ? <LoadingSpinner size='sm' /> : "Follow"}
								</button>
							</Link>
						))}
				</div>
				<p className='text-sm text-blue-500 hover:underline cursor-pointer'>Show more</p>
			</div>
		</div>
	);
};
export default RightPanel;