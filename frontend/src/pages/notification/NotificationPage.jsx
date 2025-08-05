import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../../components/svgs/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const NotificationPage = () => {
	const queryClient = useQueryClient();
	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/notifications");
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/notifications", {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-green-400 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-green-400'>
					<p className='font-bold text-green-300 font-mono'>$ git log --notifications</p>
					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4 text-green-400' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-gray-800 rounded-box w-52 border border-green-400'
						>
							<li>
								<button
									type='button'
									onClick={deleteNotifications}
									className='text-green-300 font-mono hover:bg-gray-700 w-full text-left'
								>
									git clean --all
								</button>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='text-center p-4 font-bold text-green-500 font-mono'>No notifications yet 🤔</div>}
				{notifications?.map((notification) => (
					<div className='border-b border-green-400' key={notification._id}>
						<div className='flex gap-2 p-4'>
							{notification.type === "follow" && <FaUser className='w-7 h-7 text-green-400' />}
							{notification.type === "like" && <FaHeart className='w-7 h-7 text-pink-500' />}
							<Link to={`/profile/${notification.from.username}`}>
								<div className='avatar'>
									<div className='w-8 rounded-full border border-green-400'>
										<img src={notification.from.profileImg || "/avatars/boy5.jpg"} />
									</div>
								</div>
								<div className='flex gap-1'>
									<span className='font-bold text-green-300 font-mono'>@{notification.from.username}</span>{" "}
									{notification.type === "follow" ? "started following you" : "liked your commit"}
									<span className='text-green-500 font-mono'>{notification.type === "follow" ? "(git follow)" : "(git star)"}</span>
								</div>
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;