import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaRegStar } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../../utils/date";

const RecentStars = ({ userId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const queryClient = useQueryClient();
  
  const { data: starredPosts, isLoading } = useQuery({
    queryKey: ["starredPosts", userId],
    queryFn: async () => {
      const res = await fetch(`/api/posts/likes/${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data.slice(0, 5); // Show 5 most recent
    },
  });

  // Listen for like/unlike mutations and refetch
  queryClient.getMutationCache().subscribe((mutation) => {
    if (
      mutation.options?.mutationFn?.toString().includes("/api/posts/like/") &&
      mutation.state.status === "success"
    ) {
      queryClient.invalidateQueries({ queryKey: ["starredPosts", userId] });
    }
  });

  const nextPost = () => {
    if (starredPosts && currentIndex < starredPosts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevPost = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-4 bg-[#101014] rounded-xl shadow-xl p-4">
        <h3 className="text-green-400 font-mono font-bold text-lg mb-3 flex items-center gap-2">
          <FaRegStar className="text-yellow-400" />
          Recently Starred
        </h3>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (!starredPosts || starredPosts.length === 0) {
    return (
      <div className="mt-4 bg-[#101014]   rounded-xl shadow-xl p-4">
        <h3 className="text-green-400 font-mono font-bold text-lg mb-3 flex items-center gap-2">
          <FaRegStar className="text-yellow-400" />
          Recently Starred
        </h3>
        <p className="text-green-400/70 font-mono text-sm">No starred commits yet.</p>
      </div>
    );
  }

  const currentPost = starredPosts[currentIndex];

  return (
    <div className="mt-4 bg-[#101014]  rounded-xl shadow-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-green-400 font-mono font-bold text-lg flex items-center gap-2">
          <FaRegStar className="text-yellow-400" />
          Recently Starred
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={prevPost}
            disabled={currentIndex === 0}
            className={`p-1 rounded transition-colors ${
              currentIndex === 0
                ? "text-green-400/30 cursor-not-allowed"
                : "text-green-400 hover:text-yellow-400"
            }`}
          >
            <FaChevronLeft className="w-3 h-3" />
          </button>
          <span className="text-green-400/70 font-mono text-xs">
            {currentIndex + 1}/{starredPosts.length}
          </span>
          <button
            onClick={nextPost}
            disabled={currentIndex === starredPosts.length - 1}
            className={`p-1 rounded transition-colors ${
              currentIndex === starredPosts.length - 1
                ? "text-green-400/30 cursor-not-allowed"
                : "text-green-400 hover:text-yellow-400"
            }`}
          >
            <FaChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {currentPost && (
        <div className="border border-green-400/20 rounded-lg p-3 bg-gradient-to-r from-gray-900/20 to-gray-800/20">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={currentPost.user.profileImg || "/avatar-placeholder.jpg"}
              alt={currentPost.user.fullName}
              className="w-6 h-6 rounded-full border border-green-400/50"
            />
            <Link
              to={`/profile/${currentPost.user.username}`}
              className="text-green-400 font-mono text-sm hover:text-yellow-400 transition-colors"
            >
              @{currentPost.user.username}
            </Link>
            <span className="text-green-400/50 text-xs">·</span>
            <span className="text-green-400/50 text-xs font-mono">
              {formatPostDate(currentPost.createdAt)}
            </span>
          </div>
          <p className="text-green-200 font-mono text-sm leading-relaxed line-clamp-3">
            {currentPost.text}
          </p>
          {currentPost.img && (
            <img
              src={currentPost.img}
              alt="Post content"
              className="mt-2 rounded-lg max-h-32 w-full object-cover border border-green-400/30"
            />
          )}
          <div className="flex items-center gap-4 mt-2 pt-2 border-t border-green-400/10">
            <span className="flex items-center gap-1 text-xs text-yellow-400 font-mono">
              <FaRegStar className="w-3 h-3" />
              {currentPost.likes.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentStars;
