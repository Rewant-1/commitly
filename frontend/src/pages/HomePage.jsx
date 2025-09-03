// Home page - main feed with tab switching between "For You" and "Following"
import { useState } from "react";
import Posts from "../components/svgs/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-green-400/60 bg-[#101014] min-h-screen'>
				{/* Header with feed type tabs (terminal-themed) */}
				<div className='flex w-full border-b border-green-400/60 bg-black'>
					<div
						className={`flex justify-center flex-1 p-3 hover:bg-green-900 text-green-400 font-mono transition duration-300 cursor-pointer relative ${
							feedType === "forYou" ? "bg-green-900/50" : ""
						}`}
						onClick={() => setFeedType("forYou")}
					>
						$ git log --all
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-10 h-1 rounded-full bg-green-400'></div>
						)}
					</div>
					<div
						className={`flex justify-center flex-1 p-3 hover:bg-green-900 text-green-400 font-mono transition duration-300 cursor-pointer relative ${
							feedType === "following" ? "bg-green-900/50" : ""
						}`}
						onClick={() => setFeedType("following")}
					>
						$ git log --remotes
						{feedType === "following" && (
							<div className='absolute bottom-0 w-10 h-1 rounded-full bg-green-400'></div>
						)}
					</div>
				</div>

				{/* Post creation component */}
				<CreatePost />

				{/* Posts feed based on selected tab */}
				<Posts feedType={feedType} />
			</div>
		</>
	);
};

export default HomePage;