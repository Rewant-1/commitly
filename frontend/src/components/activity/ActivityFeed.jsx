import Posts from "../svgs/common/Posts.jsx";

const ActivityFeed = () => {
	return (
		<div className="flex-1 p-4">
			<div className="mb-4 space-y-2">
				<div className="text-green-400 text-sm flex items-center justify-between">
					<span>$ git log --graph --oneline --all</span>
					<div className="flex gap-2 text-xs">
						<button className="text-green-600 hover:text-green-400 border border-green-600 px-2 py-1">--follow</button>
						<button className="text-green-600 hover:text-green-400 border border-green-600 px-2 py-1">--for-you</button>
						<button className="text-green-600 hover:text-green-400 border border-green-600 px-2 py-1">--all</button>
					</div>
				</div>
				<div className="text-green-600 text-xs">
					Showing commits from your network • Use filters to narrow results
				</div>
			</div>
			<Posts feedType="forYou" />
		</div>
	);
};

export default ActivityFeed;
