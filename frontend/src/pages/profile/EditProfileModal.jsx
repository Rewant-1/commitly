import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileModal = ({ authUser }) => {
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName,
				username: authUser.username,
				email: authUser.email,
				bio: authUser.bio,
				link: authUser.link,
				newPassword: "",
				currentPassword: "",
			});
		}
	}, [authUser]);

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm border-green-400 text-green-400 hover:bg-green-400 hover:text-black font-mono'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				git config --edit
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-green-400 shadow-md bg-gray-900'>
					<h3 className='font-bold text-lg my-3 text-green-400 font-mono'>$ git config --global user.*</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-green-400 rounded p-2 input-md bg-gray-800 text-green-300 font-mono'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-green-400 rounded p-2 input-md bg-gray-800 text-green-300 font-mono'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-green-400 rounded p-2 input-md bg-gray-800 text-green-300 font-mono'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-green-400 rounded p-2 input-md bg-gray-800 text-green-300 font-mono'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-green-400 rounded p-2 input-md bg-gray-800 text-green-300 font-mono'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-green-400 rounded p-2 input-md bg-gray-800 text-green-300 font-mono'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-green-400 rounded p-2 input-md bg-gray-800 text-green-300 font-mono'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						<button className='btn bg-green-400 text-black hover:bg-green-500 rounded-full btn-sm font-mono'>
							{isUpdatingProfile ? "git commit..." : "git commit"}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;