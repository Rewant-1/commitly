import XSvg from "../x.jsx";

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
		<div className='md:flex-[2_2_0] w-18 max-w-64'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
				<Link to='/' className='flex justify-center md:justify-start'>
					<XSvg className='px-2 w-14 h-14 rounded-full fill-white hover:bg-stone-900' />
				</Link>
				<ul className='flex flex-col gap-4 mt-6'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-4 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-3 pl-3 pr-6 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-7 h-7' />
							<span className='text-xl hidden md:block'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-4 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-3 pl-3 pr-6 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-7 h-7' />
							<span className='text-xl hidden md:block'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${authUser?.username}`}
							className='flex gap-4 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-3 pl-3 pr-6 max-w-fit cursor-pointer'
						>
							<FaUser className='w-7 h-7' />
							<span className='text-xl hidden md:block'>Profile</span>
						</Link>
					</li>
				</ul>
				{authUser && (
					<Link
						to={`/profile/${authUser.username}`}
						className='mt-auto mb-10 flex gap-3 items-start transition-all duration-300 hover:bg-[#181818] py-3 px-4 rounded-full'
					>
						<div className='avatar hidden md:inline-flex'>
							<div className='w-10 rounded-full'>
								<img src={authUser?.profileImg || "/avatar-placeholder.jpg"} />
							</div>
						</div>
						<div className='flex justify-between flex-1'>
							<div className='hidden md:block'>
								<p className='text-white font-bold text-sm w-20 truncate'>{authUser?.fullName}</p>
								<p className='text-slate-500 text-sm'>@{authUser?.username}</p>
							</div>
							<BiLogOut
								className='w-6 h-6 cursor-pointer'
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