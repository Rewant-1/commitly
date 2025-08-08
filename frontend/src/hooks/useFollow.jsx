import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


import { useState } from "react";
const useFollow = () => {
	const queryClient = useQueryClient();
	const [pendingId, setPendingId] = useState(null);

	const { mutate: follow } = useMutation({
		mutationFn: async (userId) => {
			setPendingId(userId);
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
		onSettled: (userId) => {
			setPendingId(null);
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