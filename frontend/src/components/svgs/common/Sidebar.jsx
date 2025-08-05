import XSvg from "../x";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
	const queryClient = useQueryClient();
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	return (
		<div className='flex-[2_2_0] w-52 max-w-52'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-green-400 bg-gray-900 w-full'>
				<Link to='/' className='flex justify-start p-4'>
					<span className='text-green-400 font-bold text-xl font-mono'>$ commitly</span>
				</Link>
				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-start'>
						<Link
							to='/'
							className='flex gap-3 items-center hover:bg-green-900 text-green-300 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-8 h-8' />
							<span className='text-lg font-mono'>git status</span>
						</Link>
					</li>
					<li className='flex justify-start'>
						<Link
							to='/notifications'
							className='flex gap-3 items-center hover:bg-green-900 text-green-300 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-6 h-6' />
							<span className='text-lg font-mono'>git log --alerts</span>
						</Link>
					</li>

					<li className='flex justify-start'>
						<Link
							to={`/profile/${authUser?.username}`}
							className='flex gap-3 items-center hover:bg-green-900 text-green-300 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6' />
							<span className='text-lg font-mono'>git config --user</span>
						</Link>
					</li>
				</ul>
				{authUser && (
					<Link
						to={`/profile/${authUser.username}`}
						className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-green-900 py-2 px-4 rounded-full'
					>
						<div className='avatar inline-flex'>
							<div className='w-8 rounded-full border border-green-400'>
								<img src={authUser?.profileImg || "/avatars/boy2.jpg"} />
							</div>
						</div>
						<div className='flex justify-between flex-1'>
							<div>
								<p className='text-green-300 font-bold text-sm w-20 truncate font-mono'>{authUser?.fullName}</p>
								<p className='text-green-500 text-sm font-mono'>@{authUser?.username}</p>
							</div>
							<BiLogOut
								className='w-5 h-5 cursor-pointer text-red-500 hover:text-red-400 transition-colors'
								onClick={(e) => {
									e.preventDefault();
									logout();
								}}
							/>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};
export default Sidebar;