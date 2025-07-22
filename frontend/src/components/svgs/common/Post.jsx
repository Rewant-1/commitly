import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { formatPostDate } from "../../../utils/date";

const Post = ({ post }) => {
	const [comment, setComment] = useState("");
	const { data: authUser } = useQuery({ 
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});
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
		if (isCommenting || !comment.trim()) return;
		commentPost();
	};

	const handleLikePost = () => {
		if (isLiking) return;
		likePost();
	};

	return (
		<div className="bg-black border-b border-green-400 p-4 font-mono">
			<div className='border border-green-600 p-4 hover:border-green-400 transition-colors'>
				{/* Git commit header */}
				<div className='flex items-center gap-2 text-sm mb-3 border-b border-green-600 pb-2'>
					<span className='text-green-600'>commit</span>
					<span className='text-green-400 font-bold'>{post._id.slice(-8)}</span>
					<span className='text-green-600 ml-auto'>{formattedDate}</span>
					{isMyPost && (
						<span className='ml-2'>
							{!isDeleting && (
								<button 
									onClick={handleDeletePost}
									className='text-red-400 hover:text-red-300 hover:bg-red-900/20 text-xs border border-red-400 px-2 py-1 transition-all'
								>
									rm -rf
								</button>
							)}
							{isDeleting && <span className='text-red-400 text-xs animate-pulse'>deleting...</span>}
						</span>
					)}
				</div>

				{/* Author info */}
				<div className='flex items-center gap-3 mb-3'>
					<Link to={`/profile/${postOwner.username}`} className='w-10 h-10 border border-green-400 rounded-full overflow-hidden hover:border-green-300 transition-colors'>
						<img src={postOwner.profileImg || "/avatar-placeholder.jpg"} className="w-full h-full object-cover" />
					</Link>
					<div>
						<Link to={`/profile/${postOwner.username}`} className='text-green-400 font-bold text-sm hover:text-green-300 transition-colors'>
							{postOwner.fullName}
						</Link>
						<div className='text-green-600 text-xs'>@{postOwner.username}</div>
					</div>
				</div>

				{/* Commit message */}
				<div className='mb-4'>
					<div className='text-green-600 text-xs mb-1'>$ git commit -m</div>
					<div className='text-green-400 leading-relaxed pl-4 border-l-2 border-green-600'>"{post.text}"</div>
				</div>

				{/* Attached file (image) */}
				{post.img && (
					<div className='mb-4'>
						<div className='text-green-600 text-xs mb-2'>modified: attachment.img</div>
						<img
							src={post.img}
							className='max-w-full border border-green-400 rounded'
							alt='Attachment'
						/>
					</div>
				)}

				{/* Terminal Actions */}
				<div className='flex justify-between items-center pt-3 border-t border-green-600'>
					<div className='flex gap-6'>
						{/* Comments */}
						<button
							className='flex items-center gap-2 text-green-600 hover:text-blue-400 hover:bg-blue-900/20 p-2 rounded transition-all group'
							onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
						>
							<span className='text-sm'>💬</span>
							<span className='font-mono text-xs'>{post.comments.length}</span>
							<span className='text-xs opacity-0 group-hover:opacity-100 transition-opacity'>reply</span>
						</button>

						{/* Retweet */}
						<button className='flex items-center gap-2 text-green-600 hover:text-green-400 hover:bg-green-900/20 p-2 rounded transition-all group'>
							<span className='text-sm'>🔄</span>
							<span className='font-mono text-xs'>0</span>
							<span className='text-xs opacity-0 group-hover:opacity-100 transition-opacity'>retweet</span>
						</button>

						{/* Like */}
						<button 
							className={`flex items-center gap-2 p-2 rounded transition-all group ${
								isLiked 
									? 'text-red-400 bg-red-900/20' 
									: 'text-green-600 hover:text-red-400 hover:bg-red-900/20'
							}`}
							onClick={handleLikePost}
							disabled={isLiking}
						>
							{isLiking ? (
								<span className='text-sm animate-pulse'>⏳</span>
							) : (
								<span className='text-sm'>{isLiked ? '❤️' : '🤍'}</span>
							)}
							<span className='font-mono text-xs'>{post.likes.length}</span>
							<span className='text-xs opacity-0 group-hover:opacity-100 transition-opacity'>
								{isLiked ? 'unlike' : 'like'}
							</span>
						</button>

						{/* DM Button - Only show if not own post */}
						{!isMyPost && (
							<button 
								className='flex items-center gap-2 text-green-600 hover:text-purple-400 hover:bg-purple-900/20 p-2 rounded transition-all group'
								onClick={() => document.getElementById("dm_modal" + postOwner._id).showModal()}
							>
								<span className='text-sm'>📨</span>
								<span className='text-xs opacity-0 group-hover:opacity-100 transition-opacity'>dm</span>
							</button>
						)}
					</div>

					<div className='flex gap-4'>
						{/* Bookmark */}
						<button className='text-green-600 hover:text-yellow-400 hover:bg-yellow-900/20 p-2 rounded transition-all group'>
							<span className='text-sm'>🔖</span>
							<span className='text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-1'>save</span>
						</button>

						{/* Share */}
						<button className='text-green-600 hover:text-blue-400 hover:bg-blue-900/20 p-2 rounded transition-all group'>
							<span className='text-sm'>📤</span>
							<span className='text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-1'>share</span>
						</button>
					</div>
				</div>
			</div>

			{/* Comments Modal */}
			<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
				<div className='modal-box bg-black border border-green-400 font-mono max-w-2xl'>
					<div className='flex items-center space-x-2 mb-4 border-b border-green-400 pb-2'>
						<div className='w-3 h-3 rounded-full bg-red-500'></div>
						<div className='w-3 h-3 rounded-full bg-yellow-500'></div>
						<div className='w-3 h-3 rounded-full bg-green-400'></div>
						<span className='text-green-400 ml-4'>comments.log</span>
					</div>

					<h3 className='text-green-400 font-bold text-lg mb-4'>$ cat comments.txt</h3>
					
					<div className='flex flex-col gap-3 max-h-60 overflow-auto mb-4'>
						{post.comments.length === 0 && (
							<div className='text-center py-8 border border-green-600 rounded'>
								<div className='text-green-600 text-sm mb-2'>$ ls comments/</div>
								<div className='text-green-400'>directory is empty</div>
								<div className='text-green-600 text-xs mt-2'>be the first to commit a comment!</div>
							</div>
						)}
						{post.comments.map((comment) => (
							<div key={comment._id} className='border border-green-600 p-3 rounded hover:border-green-400 transition-colors'>
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
								<div className='text-green-400 text-sm pl-8'>&gt; {comment.text}</div>
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
								className='flex-1 bg-black text-green-400 border border-green-400 p-3 resize-none focus:outline-none focus:border-green-300 rounded'
								placeholder='your comment here...'
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								rows="3"
							/>
							<button 
								type="submit"
								className='border border-green-400 bg-black text-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-colors text-sm rounded'
								disabled={isCommenting}
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

			{/* DM Modal - Only render if not own post */}
			{!isMyPost && (
				<dialog id={`dm_modal${postOwner._id}`} className='modal border-none outline-none'>
					<div className='modal-box bg-black border border-green-400 font-mono max-w-md'>
						<div className='flex items-center space-x-2 mb-4 border-b border-green-400 pb-2'>
							<div className='w-3 h-3 rounded-full bg-red-500'></div>
							<div className='w-3 h-3 rounded-full bg-yellow-500'></div>
							<div className='w-3 h-3 rounded-full bg-green-400'></div>
							<span className='text-green-400 ml-4'>ssh {postOwner.username}@terminal.dm</span>
						</div>

						<div className='mb-4'>
							<div className='text-green-600 text-sm mb-2'>$ whoami</div>
							<div className='text-green-400 text-sm mb-4'>@{authUser.username}</div>
							<div className='text-green-600 text-sm mb-2'>$ ping {postOwner.username}</div>
							<div className='text-green-400 text-sm'>PING {postOwner.fullName} ({postOwner.username}): 56 data bytes</div>
							<div className='text-green-400 text-sm'>64 bytes from {postOwner.username}: icmp_seq=0 time=1.337ms</div>
						</div>

						<form className='border-t border-green-400 pt-4'>
							<div className='text-green-400 text-sm mb-2'>$ echo "your message" | sendmail {postOwner.username}</div>
							<div className='flex gap-2'>
								<textarea
									className='flex-1 bg-black text-green-400 border border-green-400 p-3 resize-none focus:outline-none focus:border-green-300 rounded'
									placeholder='write your direct message...'
									rows="3"
								/>
								<button 
									type="submit"
									className='border border-green-400 bg-black text-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-colors text-sm rounded'
								>
									send
								</button>
							</div>
						</form>

						<div className='mt-4 text-center'>
							<button 
								className='text-green-600 hover:text-green-400 text-xs underline'
								onClick={() => {
									document.getElementById(`dm_modal${postOwner._id}`).close();
									// Navigate to full DM interface
									window.location.href = `/messages/${postOwner.username}`;
								}}
							>
								open full terminal session →
							</button>
						</div>
					</div>
					<form method='dialog' className='modal-backdrop'>
						<button className='outline-none'>close</button>
					</form>
				</dialog>
			)}
		</div>
	);
};

export default Post;
