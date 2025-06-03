import { useState } from "react";

import Posts from "../components/svgs/common/Posts.jsx";
import CreatePost from "./CreatePost.jsx";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<div className='flex-[5_5_0] mr-auto border-r border-gray-700 min-h-screen'>
				{/* Header */}
				<div className='flex w-full border-b border-gray-700'>
					<div
						className={
							"flex justify-center flex-1 p-4 hover:bg-secondary transition duration-300 cursor-pointer relative text-lg"
						}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-12 h-1 rounded-full bg-primary'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 p-4 hover:bg-secondary transition duration-300 cursor-pointer relative text-lg'
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className='absolute bottom-0 w-12 h-1 rounded-full bg-primary'></div>
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