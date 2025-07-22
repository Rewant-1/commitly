import { useState } from "react";

import Posts from "../components/svgs/common/Posts.jsx";
import CreatePost from "./CreatePost.jsx";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<div className='flex-[5_5_0] mr-auto border-r border-green-400 min-h-screen bg-black'>
				{/* Header */}
				<div className='flex w-full border-b border-green-400'>
					<div
						className={`flex justify-center flex-1 p-4 hover:bg-green-900/20 transition duration-300 cursor-pointer relative text-lg font-mono ${
							feedType === "forYou" ? "text-green-400" : "text-green-600"
						}`}
						onClick={() => setFeedType("forYou")}
					>
						for_you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-12 h-1 rounded-full bg-green-400'></div>
						)}
					</div>
					<div
						className={`flex justify-center flex-1 p-4 hover:bg-green-900/20 transition duration-300 cursor-pointer relative text-lg font-mono ${
							feedType === "following" ? "text-green-400" : "text-green-600"
						}`}
						onClick={() => setFeedType("following")}
					>
						following
						{feedType === "following" && (
							<div className='absolute bottom-0 w-12 h-1 rounded-full bg-green-400'></div>
						)}
					</div>
				</div>

				{/*  CREATE POST INPUT */}
				<CreatePost />

				{/* POSTS */}
				<Posts feedType={feedType} />
			</div>
		</>
	);
};
export default HomePage;