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
	const res = await fetch("/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({ email, username, fullName, password }),
	});
	let data;
	try {
		data = await res.json();
	} catch (e) {
		throw new Error("Invalid server response");
	}
	if (!res.ok) {
		throw new Error(data?.error || "Failed to create account");
	}
	return data;
},
onSuccess: () => {
	toast.success("Account created successfully");
	queryClient.invalidateQueries({ queryKey: ["authUser"] });
	window.location.href = "/";
},
});

	const handleSubmit = (e) => {
		e.preventDefault();

		// Basic validation
		if (!formData.email || !formData.username || !formData.fullName || !formData.password) {
			toast.error("All fields are required");
			return;
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			toast.error("Please enter a valid email address");
			return;
		}

		// Password strength validation (optional)
		if (formData.password.length < 8) {
			toast.error("Password must be at least 8 characters long");
			return;
		}

		mutate(formData);
	};
	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-green-400 font-mono flex items-center justify-center px-0">
			<div className="w-full max-w-md mx-auto mt-12">
				{/* Terminal Header */}
				<div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-xl border-2 border-green-400/60 p-4 shadow-xl w-full">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="flex space-x-1">
								<div className="w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
								<div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg"></div>
								<div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
							</div>
							<span className="text-green-400 text-sm font-semibold">commitly@terminal</span>
						</div>
						<span className="text-green-400/80 text-sm">~/signup</span>
					</div>
				</div>

				{/* Main Content */}
				<div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border-x-2 border-b-2 border-green-400/60 rounded-b-xl p-8 shadow-2xl w-full">
					{/* Welcome Message */}
					<div className="mb-8 space-y-3">
						<div className="flex items-center space-x-2 text-green-400">
							<span className="text-green-500">$</span>
							<span className="font-semibold">Initialize new repository</span>
						</div>
						<div className="text-green-300/70 text-sm pl-6">
							Join the developer community and start collaborating
						</div>
					</div>

					<form className="space-y-6" onSubmit={handleSubmit}>
						<div className="space-y-3">
							<div className="flex items-center space-x-2 text-green-400">
								<span className="text-green-500">$</span>
								<label htmlFor="email" className="text-sm font-medium">git config user.email</label>
							</div>
							<input
								id="email"
								name="email"
								type="email"
								className="w-full bg-gray-800/80 border-2 border-green-400/50 rounded-lg px-4 py-3 text-green-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 font-mono placeholder-green-400/50 transition-all duration-300 backdrop-blur-sm shadow-inner"
								placeholder="developer@example.com"
								onChange={handleInputChange}
								value={formData.email}
							/>
						</div>

						<div className="space-y-3">
							<div className="flex items-center space-x-2 text-green-400">
								<span className="text-green-500">$</span>
								<label htmlFor="username" className="text-sm font-medium">git config user.name</label>
							</div>
							<input
								id="username"
								name="username"
								type="text"
								className="w-full bg-gray-800/80 border-2 border-green-400/50 rounded-lg px-4 py-3 text-green-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 font-mono placeholder-green-400/50 transition-all duration-300 backdrop-blur-sm shadow-inner"
								placeholder="your_username"
								onChange={handleInputChange}
								value={formData.username}
							/>
						</div>

						<div className="space-y-3">
							<div className="flex items-center space-x-2 text-green-400">
								<span className="text-green-500">$</span>
								<label htmlFor="fullName" className="text-sm font-medium">git config user.fullname</label>
							</div>
							<input
								id="fullName"
								name="fullName"
								type="text"
								className="w-full bg-gray-800/80 border-2 border-green-400/50 rounded-lg px-4 py-3 text-green-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 font-mono placeholder-green-400/50 transition-all duration-300 backdrop-blur-sm shadow-inner"
								placeholder="Your Full Name"
								onChange={handleInputChange}
								value={formData.fullName}
							/>
						</div>

						<div className="space-y-3">
							<div className="flex items-center space-x-2 text-green-400">
								<span className="text-green-500">$</span>
								<label htmlFor="password" className="text-sm font-medium">git config user.password</label>
							</div>
							<input
								id="password"
								name="password"
								type="password"
								className="w-full bg-gray-800/80 border-2 border-green-400/50 rounded-lg px-4 py-3 text-green-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 font-mono placeholder-green-400/50 transition-all duration-300 backdrop-blur-sm shadow-inner"
								placeholder="create secure password"
								onChange={handleInputChange}
								value={formData.password}
							/>
						</div>

						<button 
							type="submit"
							disabled={isPending}
							className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-gray-900 font-bold py-3 rounded-lg hover:from-green-500 hover:to-emerald-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-green-400/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						>
							{isPending ? (
								<span className="flex items-center justify-center gap-2">
									<div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
									git init --creating...
								</span>
							) : (
								"git init --create-repo"
							)}
						</button>

						{isError && (
							<div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 backdrop-blur-sm">
								<div className="flex items-center space-x-2 text-red-400">
									<span className="text-red-500">$</span>
									<span className="text-sm font-medium">Error:</span>
								</div>
								<p className="text-red-300 text-sm pl-6 mt-1">{error.message}</p>
							</div>
						)}
					</form>

					{/* Login Link */}
					<div className="mt-8 pt-6 border-t border-green-400/30">
						<div className="text-center space-y-4">
							<div className="flex items-center justify-center space-x-2 text-green-300/80">
								<span className="text-green-500">$</span>
								<span className="text-sm">Already have a repository?</span>
							</div>
							<Link 
								to="/login" 
								className="inline-block px-8 py-3 border-2 border-green-400/50 rounded-lg text-green-400 hover:bg-green-400/10 hover:border-green-400 transition-all duration-300 font-mono text-sm transform hover:scale-[1.02] shadow-md hover:shadow-green-400/20"
							>
								git checkout --login
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;