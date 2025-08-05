import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useFollow from "../../../hooks/useFollow";

import RightPanelSkeleton from "../../skeletons/RightPanelSkeleton";
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

	// Always show the panel, even if no suggested users
	return (
		<div className='w-64 min-w-64 my-4 mx-2'>
			<div className='bg-gray-900 border border-green-400 p-4 rounded-md sticky top-2'>
				<p className='font-bold text-green-400'>$ git log --contributors</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
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
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full border border-green-400'>
											<img src={user.profileImg || "/avatars/boy1.jpg"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28 text-green-300'>
											{user.fullName}
										</span>
										<span className='text-sm text-green-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-green-400 text-black hover:bg-green-500 hover:opacity-90 rounded-full btn-sm font-mono'
										onClick={(e) => {
											e.preventDefault();
											follow(user._id);
										}}
									>
										{isPending ? <LoadingSpinner size='sm' /> : "git add"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;