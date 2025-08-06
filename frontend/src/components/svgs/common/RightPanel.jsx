import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import RecentLikes from "./RecentLikes";

import useFollow from "../../../hooks/useFollow";

import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { follow, pendingId } = useFollow();
  
  const location = useLocation();
  const isAuthRoute = ["/", "/notifications"].includes(location.pathname) || location.pathname.startsWith("/profile");
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    enabled: isAuthRoute,
  });

  // Early return for empty state - maintain layout space
  if (suggestedUsers?.length === 0) {
    return <div className="hidden lg:block w-80 flex-shrink-0" />;
  }

  return (
    <div className="hidden lg:block w-80 flex-shrink-0">
      <div className="sticky top-0 space-y-4">
        {/* Who to Follow Card */}
        <div className="bg-[#101014] border-r-2 border-b-2  border-green-400/60 rounded-xl shadow-xl ">
          <div className="p-4 border-b border-green-400/30">
            <h3 className="text-lg font-semibold text-green-400 font-mono">
              Who to watch
            </h3>
          </div>
          <div className="divide-y divide-green-400/10">
            {isLoading ? (
              // Loading state
              <>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="p-4 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-400/10 rounded-full" />
                        <div className="space-y-2">
                          <div className="h-4 bg-green-400/10 rounded w-24" />
                          <div className="h-3 bg-green-400/10 rounded w-16" />
                        </div>
                      </div>
                      <div className="h-8 bg-green-400/10 rounded-full w-16" />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // User suggestions
              suggestedUsers?.map((user, index) => (
                <UserSuggestionItem
                  key={user._id}
                  user={user}
                  onFollow={follow}
                  isPending={pendingId === user._id}
                  isLast={index === suggestedUsers.length - 1}
                />
              ))
            )}
          </div>
        </div>
        {authUser && (
          <div className="bg-[#101014] border-t-2 border-r-2 border-b-2  border-green-400/60 rounded-xl shadow-xl ">
            
            <RecentLikes userId={authUser._id} />
          </div>
        )}
      </div>
    </div>
  );
};

// Extracted component for better maintainability
const UserSuggestionItem = ({ user, onFollow, isPending, isLast }) => {
  const handleFollowClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onFollow(user._id);
  };

  return (
    <Link
      to={`/profile/${user.username}`}
      className={`
         block p-4 transition-colors duration-200
         hover:bg-green-400/5 focus:bg-green-400/10
         focus:outline-none
         ${isLast ? "rounded-b-xl" : ""}
       `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={user.profileImg || "/avatar-placeholder.jpg"}
              alt={`${user.fullName}'s profile`}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-green-400/30 hover:ring-green-400 transition-all duration-200"
            />
          </div>
          {/* User info */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-green-400 truncate font-mono">
              {user.fullName}
            </p>
            <p className="text-sm text-green-400/70 truncate font-mono">
              @{user.username}
            </p>
          </div>
        </div>
        {/* Follow button */}
        <button
          onClick={handleFollowClick}
          disabled={isPending}
          className={`
             ml-3 px-4 py-1.5 text-sm font-bold rounded-full font-mono
             transition-all duration-200 flex-shrink-0
             ${
               isPending
                 ? "bg-green-400/10 text-green-400 cursor-not-allowed"
                 : "bg-green-400 hover:bg-green-500 text-black shadow-sm hover:shadow-green-400/30"
             }
             focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2
           `}
        >
          {isPending ? (
            <div className="flex items-center space-x-1">
              <LoadingSpinner size="sm" />
              <span>Watching...</span>
            </div>
          ) : (
            "Watch"
          )}
        </button>
      </div>
    </Link>
  );
};

export default RightPanel;
