import { useState } from "react";

import Posts from "../components/svgs/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-green-400 bg-gray-900 min-h-screen'>
				{/* Header */}
				<div className='flex w-full border-b border-green-400 bg-black'>
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-green-900 text-green-400 font-mono transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("forYou")}
					>
						$ git log --all
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-green-400'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 p-3 hover:bg-green-900 text-green-400 font-mono transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("following")}
					>
						$ git log --following
						{feedType === "following" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-green-400'></div>
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