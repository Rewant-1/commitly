import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../../utils/date";

const Post = ({ post }) => {
	const [comment, setComment] = useState("");
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();
	const postOwner = post.user;
	const isLiked = post.likes.includes(authUser._id);

	const isMyPost = authUser._id === post.user._id;

	const formattedDate = formatPostDate(post.createdAt);

	const { mutate: deletePost, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/${post._id}`, {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Post deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const { mutate: likePost, isPending: isLiking } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/like/${post._id}`, {
					method: "POST",
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: (updatedLikes) => {
			// this is not the best UX, bc it will refetch all posts
			// queryClient.invalidateQueries({ queryKey: ["posts"] });

			// instead, update the cache directly for that post
			queryClient.setQueryData(["posts"], (oldData) => {
				return oldData.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: updatedLikes };
					}
					return p;
				});
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: commentPost, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/comment/${post._id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text: comment }),
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Comment posted successfully");
			setComment("");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleDeletePost = () => {
		deletePost();
	};

	const handlePostComment = (e) => {
		e.preventDefault();
		if (isCommenting) return;
		commentPost();
	};

	const handleLikePost = () => {
		if (isLiking) return;
		likePost();
	};

	return (
		<>
			<div className='border-b border-green-400 p-4 bg-black font-mono'>
				<div className='border border-green-600 p-3'>
					{/* Git commit header */}
					<div className='flex items-center gap-2 text-sm mb-3 border-b border-green-600 pb-2'>
						<span className='text-green-600'>commit</span>
						<span className='text-green-400'>{post._id.slice(-8)}</span>
						<span className='text-green-600 ml-auto'>{formattedDate}</span>
						{isMyPost && (
							<span className='ml-2'>
								{!isDeleting && (
									<button 
										onClick={handleDeletePost}
										className='text-red-400 hover:text-red-300 text-xs border border-red-400 px-2 py-1'
									>
										rm
									</button>
								)}
								{isDeleting && <span className='text-red-400 text-xs'>deleting...</span>}
							</span>
						)}
					</div>

					{/* Author info */}
					<div className='flex items-center gap-3 mb-3'>
						<Link to={`/profile/${postOwner.username}`} className='w-8 h-8 border border-green-400 rounded-full overflow-hidden'>
							<img src={postOwner.profileImg || "/avatar-placeholder.jpg"} className="w-full h-full object-cover" />
						</Link>
						<div>
							<Link to={`/profile/${postOwner.username}`} className='text-green-400 font-bold text-sm'>
								{postOwner.fullName}
							</Link>
							<div className='text-green-600 text-xs'>@{postOwner.username}</div>
						</div>
					</div>

					{/* Commit message */}
					<div className='mb-3'>
						<div className='text-green-600 text-xs mb-1'>message:</div>
						<div className='text-green-400 leading-relaxed'>{post.text}</div>
					</div>

					{/* Attached file (image) */}
					{post.img && (
						<div className='mb-3'>
							<div className='text-green-600 text-xs mb-1'>modified: attachment.img</div>
							<img
								src={post.img}
								className='max-w-full border border-green-400'
								alt='Attachment'
							/>
						</div>
					)}

					{/* Git stats */}
					<div className='flex justify-between items-center text-xs pt-3 border-t border-green-600'>
						<div className='flex gap-4'>
							<button
								className='flex items-center gap-1 text-green-600 hover:text-green-400'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<span>💬</span>
								<span>{post.comments.length}</span>
							</button>

							<div className='flex items-center gap-1 text-green-600'>
								<span>🔄</span>
								<span>0</span>
							</div>

							<button 
								className='flex items-center gap-1 text-green-600 hover:text-green-400'
								onClick={handleLikePost}
							>
								{isLiking && <span className='text-green-400'>⏳</span>}
								{!isLiking && (
									<span className={isLiked ? 'text-red-400' : 'text-green-600'}>
										{isLiked ? '❤️' : '🤍'}
									</span>
								)}
								<span className={isLiked ? 'text-red-400' : 'text-green-600'}>
									{post.likes.length}
								</span>
							</button>
						</div>

						<button className='text-green-600 hover:text-green-400'>
							<span>🔖</span>
						</button>
					</div>
				</div>

				{/* Comments Modal */}
				<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
					<div className='modal-box bg-black border border-green-400 font-mono'>
						<div className='flex items-center space-x-2 mb-4 border-b border-green-400 pb-2'>
							<div className='w-3 h-3 rounded-full bg-red-500'></div>
							<div className='w-3 h-3 rounded-full bg-yellow-500'></div>
							<div className='w-3 h-3 rounded-full bg-green-400'></div>
							<span className='text-green-400 ml-4'>comments.log</span>
						</div>

						<h3 className='text-green-400 font-bold text-lg mb-4'>$ cat comments.txt</h3>
						
						<div className='flex flex-col gap-3 max-h-60 overflow-auto mb-4'>
							{post.comments.length === 0 && (
								<p className='text-green-600 text-sm'>
									No comments found. Be the first to commit a comment!
								</p>
							)}
							{post.comments.map((comment) => (
								<div key={comment._id} className='border border-green-600 p-2'>
									<div className='flex items-center gap-2 mb-2'>
										<div className='w-6 h-6 border border-green-400 rounded-full overflow-hidden'>
											<img
												src={comment.user.profileImg || "/avatar-placeholder.jpg"}
												className="w-full h-full object-cover"
											/>
										</div>
										<span className='text-green-400 text-sm font-bold'>{comment.user.fullName}</span>
										<span className='text-green-600 text-xs'>@{comment.user.username}</span>
									</div>
									<div className='text-green-400 text-sm'>{comment.text}</div>
								</div>
							))}
						</div>

						<form
							className='border-t border-green-400 pt-4'
							onSubmit={handlePostComment}
						>
							<div className='text-green-400 text-sm mb-2'>$ echo "your comment" &gt;&gt; comments.txt</div>
							<div className='flex gap-2'>
								<textarea
									className='flex-1 bg-black text-green-400 border border-green-400 p-2 resize-none focus:outline-none focus:border-green-300'
									placeholder='your comment here...'
									value={comment}
									onChange={(e) => setComment(e.target.value)}
									rows="2"
								/>
								<button 
									type="submit"
									className='border border-green-400 bg-black text-green-400 px-3 py-1 hover:bg-green-400 hover:text-black transition-colors text-sm'
								>
									{isCommenting ? "committing..." : "commit"}
								</button>
							</div>
						</form>
					</div>
					<form method='dialog' className='modal-backdrop'>
						<button className='outline-none'>close</button>
					</form>
				</dialog>
			</div>
		</>
	);
};
export default Post;