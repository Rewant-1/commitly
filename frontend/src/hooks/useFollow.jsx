// Custom hook for following/unfollowing users with optimistic updates
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "../utils/toast";
import { useState } from "react";

const useFollow = () => {
	const queryClient = useQueryClient();
	const [pendingId, setPendingId] = useState(null); // Track which user's follow is pending

	// Follow/unfollow mutation with cache invalidation
	const { mutate: follow } = useMutation({
		mutationFn: async (userId) => {
			setPendingId(userId); // Show loading state for specific user
			try {
				const res = await fetch(`/api/users/follow/${userId}`, {
					method: "POST",
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong!");
				}
				return;
			} catch (error) {
				throw new Error(error.message);
			}
		},
		// Cleanup and refresh data regardless of success/failure
		onSettled: (userId) => {
			setPendingId(null);
			// Invalidate relevant queries to refresh user data
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
				queryClient.invalidateQueries({ queryKey: ["followers", userId] }),
			]);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return { follow, pendingId };
};

export default useFollow;