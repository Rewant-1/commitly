import Post from "./Post";
import PostSkeleton from "../../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, username, userId }) => {
	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			case "posts":
				return `/api/posts/user/${username}`;
			case "likes":
				return `/api/posts/likes/${userId}`;
			case "bookmarks":
				return `/api/posts/bookmarks/${userId}`;
			case "reposts":
				return `/api/posts/reposts/${userId}`;
			default:
				return "/api/posts/all";
		}
	};

	const POST_ENDPOINT = getPostEndpoint();

	const {
		data: posts,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		// Include params in key so switching tabs/users creates distinct caches
		queryKey: ["posts", { feedType, username, userId, endpoint: POST_ENDPOINT }],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}

				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		// Only run when required params exist
		enabled:
			(feedType === "likes" || feedType === "bookmarks" || feedType === "reposts")
				? Boolean(userId)
				: feedType === "posts"
				? Boolean(username)
				: true,
	});

	useEffect(() => {
		// Refetch on explicit param changes when query was disabled before
		refetch();
	}, [POST_ENDPOINT, feedType, username, userId, refetch]);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && (
				<p className='text-center my-4'>No posts in this tab. Switch 👻</p>
			)}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post?._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;