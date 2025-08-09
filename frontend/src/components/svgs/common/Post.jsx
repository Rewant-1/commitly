import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../../utils/date/index";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const queryClient = useQueryClient();
  const postOwner = post?.user;
  const isLiked = post?.likes?.includes(authUser?._id);
  const isBookmarked = authUser?.bookmarkedPosts?.includes?.(post?._id);
  const hasReposted = authUser?.retweetedPosts?.includes?.(post?._id);

  const isMyPost = authUser?._id === post?.user?._id;

  const formattedDate = formatPostDate(post?.createdAt);

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post?._id}`, {
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
        const res = await fetch(`/api/posts/like/${post?._id}`, {
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
          if (p?._id === post?._id) {
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

  const { mutate: toggleBookmark, isPending: isBookmarking } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/bookmark/${post?._id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data; // { bookmarked: boolean }
    },
    onSuccess: ({ bookmarked }) => {
      // Update authUser cache
      queryClient.setQueryData(["authUser"], (prev) => {
        if (!prev) return prev;
        const set = new Set(prev.bookmarkedPosts?.map(String) || []);
        if (bookmarked) set.add(String(post?._id)); else set.delete(String(post?._id));
        return { ...prev, bookmarkedPosts: Array.from(set) };
      });

      // Update posts cache
      queryClient.setQueryData(["posts"], (old) => {
        if (!old) return old;
        return old.map((p) => (p?._id === post?._id ? { ...p, bookmarked } : p));
      });
    },
    onError: (e) => toast.error(e.message),
  });

  const { mutate: toggleRepost, isPending: isReposting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/repost/${post?._id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data; // { reposted, reposts }
    },
    onSuccess: ({ reposted }) => {
      // Update authUser cache
      queryClient.setQueryData(["authUser"], (prev) => {
        if (!prev) return prev;
        const set = new Set(prev.retweetedPosts?.map(String) || []);
        if (reposted) set.add(String(post?._id)); else set.delete(String(post?._id));
        return { ...prev, retweetedPosts: Array.from(set) };
      });

      // Update posts cache
      queryClient.setQueryData(["posts"], (old) => {
        if (!old) return old;
        return old.map((p) => (p?._id === post?._id ? { ...p, reposted } : p));
      });
    },
    onError: (e) => toast.error(e.message),
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${post?._id}`, {
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

  // Early return if essential data is missing
  if (!post || !postOwner) {
    return null;
  }

  return (
    <>
      <div className="group flex gap-4 items-start p-6 border-b border-green-400/20 bg-gradient-to-r from-gray-900/30 via-black/20 to-gray-900/30 backdrop-blur-sm hover:from-gray-900/50 hover:via-black/30 hover:to-gray-900/50 transition-all duration-500 relative overflow-hidden">
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="avatar flex-shrink-0 relative z-10">
          <Link
            to={`/profile/${postOwner?.username}`}
            className="block w-12 h-12 rounded-full overflow-hidden border-2 border-green-400/60 hover:border-green-400 transition-all duration-300 shadow-lg hover:shadow-green-400/30 hover:scale-105"
          >
            <img
              src={postOwner?.profileImg || "/avatar-placeholder.jpg"}
              className="w-full h-full object-cover"
            />
          </Link>
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-gray-900 shadow-lg"></div>
        </div>
        <div className="flex flex-col flex-1 min-w-0 relative z-10">
          <div className="flex gap-3 items-center mb-2">
            <Link
              to={`/profile/${postOwner?.username}`}
              className="font-bold text-cyan-400 font-mono hover:text-cyan-300 transition-colors flex items-center gap-2"
            >
              {postOwner?.fullName}
              {/* Verified badge for some users */}
              {["alexcode", "ai_enthusiast", "cloud_expert"].includes(
                postOwner?.username
              ) && (
                <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                </div>
              )}
            </Link>
            <span className="text-purple-400/70 flex gap-2 text-sm font-mono">
              <Link
                to={`/profile/${postOwner?.username}`}
                className="hover:text-purple-300 transition-colors"
              >
                @{postOwner?.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {!isDeleting && (
                  <FaTrash
                    className="cursor-pointer hover:text-red-400 text-red-500/70 transition-colors duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                    onClick={handleDeletePost}
                  />
                )}
                {isDeleting && <LoadingSpinner size="sm" />}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-4 overflow-hidden">
            <span className="text-cyan-100 font-mono leading-relaxed text-[15px] group-hover:text-cyan-50 transition-colors duration-300">
              {post?.text}
            </span>
            {post?.img && (
              <div className="rounded-xl overflow-hidden border border-green-400/40 shadow-xl group-hover:border-green-400/60 transition-all duration-300 hover:shadow-green-400/20">
                <img
                  src={post.img}
                  className="w-full max-h-96 object-cover hover:scale-105 transition-transform duration-700"
                  alt=""
                />
              </div>
            )}
          </div>
          <div className="flex justify-between mt-4 pt-3 border-t border-green-400/20 group-hover:border-green-400/30 transition-colors duration-300">
            <div className="flex gap-8 items-center">
              <div
                className="flex gap-2 items-center cursor-pointer group/comment hover:bg-green-400/10 rounded-full px-3 py-2 transition-all duration-300 hover:scale-105"
                onClick={() =>
                  document
                    .getElementById("comments_modal" + post?._id)
                    ?.showModal()
                }
              >
                <FaRegComment className="w-4 h-4 text-green-500/70 group-hover/comment:text-green-400 transition-colors" />
                <span className="text-sm text-green-500/70 group-hover/comment:text-green-400 font-mono transition-colors font-semibold">
                  {post?.comments?.length || 0}
                </span>
              </div>

              <dialog
                id={`comments_modal${post?._id}`}
                className="modal border-none outline-none"
              >
                <div className="modal-box rounded-xl border-2 border-green-400/60 bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-2xl backdrop-blur-xl">
                  <h3 className="font-bold text-xl mb-6 text-green-400 font-mono flex items-center gap-2">
                    <span className="text-green-500">$</span>
                    git log --comments
                  </h3>
                  <div className="flex flex-col gap-4 max-h-60 overflow-auto custom-scrollbar">
                    {(!post?.comments || post.comments.length === 0) && (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4 opacity-30">💭</div>
                        <p className="text-sm text-green-500/70 font-mono">
                          No comments yet... be the first to contribute!
                        </p>
                      </div>
                    )}
                    {post?.comments?.map((comment) => (
                      <div
                        key={comment?._id}
                        className="flex gap-3 items-start p-3 bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-lg border border-green-400/20 hover:border-green-400/40 transition-all duration-300"
                      >
                        <div className="avatar flex-shrink-0">
                          <div className="w-8 h-8 rounded-full border border-green-400/50 overflow-hidden shadow-lg">
                            <img
                              src={
                                comment?.user?.profileImg || "/avatar-placeholder.jpg"
                              }
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-green-300 font-mono text-sm">
                              {comment?.user?.fullName}
                            </span>
                            <span className="text-green-500/70 text-xs font-mono">
                              @{comment?.user?.username}
                            </span>
                          </div>
                          <div className="text-sm text-green-200 font-mono leading-relaxed">
                            {comment?.text}
                          </div>
                        </div>
                      </div>
                    )) || []}
                  </div>
                  <form
                    className="flex gap-3 items-center mt-6 pt-4 border-t border-green-400/30"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="textarea flex-1 p-3 rounded-lg text-sm resize-none border-2 focus:outline-none border-green-400/50 focus:border-green-400 bg-gray-800/80 text-green-300 font-mono placeholder-green-400/50 transition-all duration-300 shadow-inner"
                      placeholder='git comment -m "your thoughts..."'
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="2"
                    />
                    <button className="btn bg-gradient-to-r from-green-400 to-emerald-500 text-gray-900 hover:from-green-500 hover:to-emerald-600 rounded-lg px-6 font-mono font-bold transition-all duration-300 border-none shadow-lg hover:shadow-green-400/30 hover:scale-105">
                      {isCommenting ? <LoadingSpinner size="md" /> : "commit"}
                    </button>
                  </form>
                </div>
                <form
                  method="dialog"
                  className="modal-backdrop bg-black/70 backdrop-blur-sm"
                >
                  <button className="outline-none">close</button>
                </form>
              </dialog>

              <button
                type="button"
                className="flex gap-2 items-center group/repost cursor-pointer hover:bg-blue-400/10 rounded-full px-3 py-2 transition-all duration-300 hover:scale-105 disabled:opacity-60"
                onClick={() => !isReposting && toggleRepost()}
                disabled={isReposting}
                aria-label={hasReposted ? "Undo repost" : "Repost"}
                title={hasReposted ? "Undo repost" : "Repost"}
              >
                {isReposting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <BiRepost className={`w-5 h-5 ${hasReposted ? "text-blue-400" : "text-green-500/70 group-hover/repost:text-blue-400"} transition-colors`} />
                )}
                <span className={`text-sm font-mono transition-colors font-semibold ${hasReposted ? "text-blue-400" : "text-green-500/70 group-hover/repost:text-blue-400"}`}>
                  {post.reposts?.length || 0}
                </span>
              </button>

              <div
                className="flex gap-2 items-center group/like cursor-pointer hover:bg-yellow-400/10 rounded-full px-3 py-2 transition-all duration-300 hover:scale-105"
                onClick={handleLikePost}
              >
                {isLiking && <LoadingSpinner size="sm" />}
                {!isLiked && !isLiking && (
                  <FaRegStar className="w-4 h-4 text-green-500/70 group-hover/like:text-yellow-400 transition-colors duration-200" />
                )}
                {isLiked && !isLiking && (
                  <FaStar className="w-4 h-4 text-yellow-400 animate-pulse" />
                )}
                <span
                  className={`text-sm font-mono transition-colors duration-200 font-semibold ${
                    isLiked
                      ? "text-yellow-400"
                      : "text-green-500/70 group-hover/like:text-yellow-400"
                  }`}
                >
                  {post?.likes?.length || 0}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => !isBookmarking && toggleBookmark()}
                disabled={isBookmarking}
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
                title={isBookmarked ? "Remove bookmark" : "Bookmark"}
              >
                {isBookmarking ? (
                  <LoadingSpinner size="sm" />
                ) : isBookmarked ? (
                  <FaBookmark className="w-4 h-4 text-green-400" />
                ) : (
                  <FaRegBookmark className="w-4 h-4 text-green-500/70 hover:text-green-400 transition-all duration-200 hover:scale-110" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Post;
