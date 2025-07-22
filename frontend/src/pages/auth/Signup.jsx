import { Link } from "react-router-dom";
import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullName, password }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, fullName, password }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to create account");
				console.log(data);
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
			<div className="max-w-md w-full p-8">
				{/* Terminal Window */}
				<div className="border border-green-400 rounded-lg p-6">
					<div className="flex items-center space-x-2 mb-6 border-b border-green-400 pb-2">
						<div className="w-3 h-3 rounded-full bg-red-500"></div>
						<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
						<div className="w-3 h-3 rounded-full bg-green-400"></div>
						<span className="text-green-400 ml-4">signup.sh</span>
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<div className="text-green-400">$ git clone --new-user</div>
							<div className="text-green-300 text-xl">Join the gittweet community</div>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-green-400 text-sm mb-1">
									email:
								</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									className="w-full bg-black border border-green-400 text-green-400 font-mono p-2 focus:outline-none focus:border-green-300"
									placeholder="enter email..."
									required
								/>
							</div>

							<div className="grid grid-cols-2 gap-2">
								<div>
									<label className="block text-green-400 text-sm mb-1">
										username:
									</label>
									<input
										type="text"
										name="username"
										value={formData.username}
										onChange={handleInputChange}
										className="w-full bg-black border border-green-400 text-green-400 font-mono p-2 focus:outline-none focus:border-green-300"
										placeholder="username..."
										required
									/>
								</div>

								<div>
									<label className="block text-green-400 text-sm mb-1">
										name:
									</label>
									<input
										type="text"
										name="fullName"
										value={formData.fullName}
										onChange={handleInputChange}
										className="w-full bg-black border border-green-400 text-green-400 font-mono p-2 focus:outline-none focus:border-green-300"
										placeholder="full name..."
										required
									/>
								</div>
							</div>

							<div>
								<label className="block text-green-400 text-sm mb-1">
									password:
								</label>
								<input
									type="password"
									name="password"
									value={formData.password}
									onChange={handleInputChange}
									className="w-full bg-black border border-green-400 text-green-400 font-mono p-2 focus:outline-none focus:border-green-300"
									placeholder="create password..."
									required
								/>
							</div>

							{isError && (
								<div className="text-red-400 text-sm">
									error: {error.message}
								</div>
							)}

							<button
								type="submit"
								disabled={isPending}
								className="w-full border border-green-400 bg-black text-green-400 font-mono p-2 hover:bg-green-400 hover:text-black transition-colors disabled:opacity-50"
							>
								{isPending ? "creating account..." : "$ git init --user"}
							</button>
						</form>

						<div className="text-center text-green-600 text-sm">
							<span>already have an account? </span>
							<Link to="/login" className="text-green-400 hover:underline">
								git pull --login
							</Link>
						</div>

						<div className="text-center">
							<Link to="/" className="text-green-600 hover:text-green-400 text-sm">
								← back to home
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;