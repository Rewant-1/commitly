import { useState } from "react";
import { Link } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const queryClient = useQueryClient();

	const {
		mutate: loginMutation,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
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
			// refetch the authUser
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
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
						<span className="text-green-400 ml-4">login.sh</span>
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<div className="text-green-400">$ git pull --user</div>
							<div className="text-green-300 text-xl">Welcome back to gittweet</div>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
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
									placeholder="enter username..."
									required
								/>
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
									placeholder="enter password..."
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
								{isPending ? "authenticating..." : "$ git login"}
							</button>
						</form>

						<div className="text-center text-green-600 text-sm">
							<span>need an account? </span>
							<Link to="/signup" className="text-green-400 hover:underline">
								git clone --signup
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

export default LoginPage;