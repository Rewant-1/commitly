import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreatePost = () => {
	const [commandInput, setCommandInput] = useState("");
	const [commitMessage, setCommitMessage] = useState("");
	const [showCommitForm, setShowCommitForm] = useState(false);
	const [img, setImg] = useState(null);
	const imgRef = useRef(null);

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const {
		mutate: createPost,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ text, img }) => {
			try {
				const res = await fetch("/api/posts/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text, img }),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},

		onSuccess: () => {
			setCommandInput("");
			setCommitMessage("");
			setShowCommitForm(false);
			setImg(null);
			toast.success("Tweet committed successfully!");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const handleCommandSubmit = (e) => {
		e.preventDefault();
		
		if (commandInput.startsWith("git commit -m ")) {
			const message = commandInput.substring(14).replace(/['"]/g, "");
			if (message.trim()) {
				createPost({ text: message, img });
			} else {
				toast.error("Commit message cannot be empty");
			}
		} else if (commandInput === "git commit") {
			setShowCommitForm(true);
		} else {
			toast.error("Invalid command. Use 'git commit -m \"your message\"' or 'git commit'");
		}
	};

	const handleCommitFormSubmit = (e) => {
		e.preventDefault();
		if (commitMessage.trim()) {
			createPost({ text: commitMessage, img });
		} else {
			toast.error("Commit message cannot be empty");
		}
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	if (showCommitForm) {
		return (
			<div className="border-b border-green-400 p-4 bg-black">
				<div className="border border-green-400 p-4 font-mono">
					<div className="text-green-400 mb-4">
						<span className="text-green-600">user@gittweet</span>
						<span className="text-white">:</span>
						<span className="text-blue-400">~/tweets</span>
						<span className="text-white">$ git commit</span>
					</div>

					<form onSubmit={handleCommitFormSubmit} className="space-y-4">
						<div>
							<div className="text-green-400 text-sm mb-2"># Enter commit message:</div>
							<textarea
								value={commitMessage}
								onChange={(e) => setCommitMessage(e.target.value)}
								className="w-full bg-black text-green-400 border border-green-400 p-2 font-mono resize-none focus:outline-none focus:border-green-300"
								rows="3"
								placeholder="What's happening?"
								required
							/>
						</div>

						{img && (
							<div className="relative w-48">
								<button
									type="button"
									onClick={() => {
										setImg(null);
										imgRef.current.value = null;
									}}
									className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
								>
									×
								</button>
								<img src={img} className="w-full border border-green-400" alt="Upload preview" />
							</div>
						)}

						<div className="flex justify-between items-center">
							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => imgRef.current.click()}
									className="text-green-400 hover:text-green-300 text-sm border border-green-400 px-2 py-1"
								>
									attach
								</button>
								<input
									type="file"
									accept="image/*"
									hidden
									ref={imgRef}
									onChange={handleImgChange}
								/>
							</div>
							<div className="space-x-2">
								<button
									type="button"
									onClick={() => setShowCommitForm(false)}
									className="text-red-400 hover:text-red-300 border border-red-400 px-3 py-1 font-mono text-sm"
								>
									abort
								</button>
								<button
									type="submit"
									disabled={isPending}
									className="text-green-400 hover:text-green-300 border border-green-400 px-3 py-1 font-mono text-sm disabled:opacity-50"
								>
									{isPending ? "committing..." : "commit"}
								</button>
							</div>
						</div>
					</form>

					{isError && (
						<div className="text-red-400 text-sm mt-2">
							error: {error.message}
						</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="border-b border-green-400 p-4 bg-black">
			<div className="flex items-start gap-4">
				<div className="w-8 h-8 border border-green-400 rounded-full overflow-hidden flex-shrink-0">
					<img 
						src={authUser?.profileImg || "/avatar-placeholder.jpg"} 
						alt="Avatar"
						className="w-full h-full object-cover"
					/>
				</div>

				<div className="flex-1">
					<div className="border border-green-400 p-3 font-mono">
						<div className="text-green-400 mb-2 text-sm">
							<span className="text-green-600">user@gittweet</span>
							<span className="text-white">:</span>
							<span className="text-blue-400">~/tweets</span>
							<span className="text-white">$ </span>
							<span className="terminal-cursor"></span>
						</div>

						<form onSubmit={handleCommandSubmit} className="space-y-3">
							<input
								type="text"
								value={commandInput}
								onChange={(e) => setCommandInput(e.target.value)}
								className="w-full bg-black text-green-400 border-none outline-none font-mono"
								placeholder="git commit -m &quot;your tweet here&quot;"
								autoComplete="off"
							/>

							<div className="text-green-600 text-xs space-y-1">
								<div>• git commit -m "message" - quick tweet</div>
								<div>• git commit - open commit editor</div>
							</div>
						</form>

						{isError && (
							<div className="text-red-400 text-sm mt-2">
								error: {error.message}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
export default CreatePost;