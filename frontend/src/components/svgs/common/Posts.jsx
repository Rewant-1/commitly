// Posts component - displays different types of post feeds based on feedType
import Post from "./Post";
import PostSkeleton from "../../skeletons/PostSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";

const Posts = ({ feedType, username, userId }) => {
	const LIMIT = 10;
	const loadMoreRef = useRef(null);

	// Determine API endpoint based on feed type
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

	const enabled =
		(feedType === "likes" || feedType === "bookmarks" || feedType === "reposts")
			? Boolean(userId)
			: feedType === "posts"
			? Boolean(username)
			: true;

	// Fetch posts using React Query for caching and loading states
	const {
		data,
		isLoading,
		isRefetching,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["posts", { feedType, username, userId, endpoint: POST_ENDPOINT, limit: LIMIT }],
		enabled,
		initialPageParam: 1,
		queryFn: async ({ pageParam }) => {
			try {
				const url = new URL(POST_ENDPOINT, window.location.origin);
				url.searchParams.set("page", String(pageParam));
				url.searchParams.set("limit", String(LIMIT));

				const res = await fetch(url.pathname + url.search);
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		getNextPageParam: (lastPage, allPages) => {
			if (!Array.isArray(lastPage)) return undefined;
			if (lastPage.length < LIMIT) return undefined;
			return allPages.length + 1;
		},
	});

	const posts = useMemo(() => {
		const pages = data?.pages || [];
		return pages.flatMap((p) => (Array.isArray(p) ? p : []));
	}, [data]);

	useEffect(() => {
		if (!enabled) return;
		if (!loadMoreRef.current) return;
		if (!hasNextPage) return;

		const element = loadMoreRef.current;
		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ root: null, rootMargin: "600px", threshold: 0 }
		);

		observer.observe(element);
		return () => observer.disconnect();
	}, [enabled, fetchNextPage, hasNextPage, isFetchingNextPage]);

	return (
		<>
			{/* Show loading skeletons while fetching */}
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			
			{/* Show message when no posts found */}
			{!isLoading && !isRefetching && posts?.length === 0 && (
				<p className='text-center my-4'>No posts in this tab. Switch 👻</p>
			)}
			
			{/* Render posts list */}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post?._id} post={post} />
					))}
					{/* Infinite scroll sentinel */}
					<div ref={loadMoreRef} />
					{isFetchingNextPage && (
						<div className='flex flex-col justify-center'>
							<PostSkeleton />
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default Posts;