import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreatePost = () => {
	const [commandInput, setCommandInput] = useState("");
	const [commitMessage, setCommitMessage] = useState("");
	const [showCommitForm, setShowCommitForm] = useState(false);
	const [showPollForm, setShowPollForm] = useState(false);
	const [pollOptions, setPollOptions] = useState(["", ""]);
	const [pollDuration, setPollDuration] = useState("24h");
	const [img, setImg] = useState(null);
	const imgRef = useRef(null);

	const { data: authUser } = useQuery({ 
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});
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
		} else if (commandInput.startsWith("poll create ")) {
			// Parse poll command: poll create "question" "option1" "option2" [duration]
			const parts = commandInput.match(/"([^"]*)"/g);
			if (parts && parts.length >= 3) {
				const question = parts[0].replace(/"/g, "");
				const options = parts.slice(1).map(opt => opt.replace(/"/g, ""));
				setPollOptions(options);
				setCommitMessage(question);
				setShowPollForm(true);
			} else {
				toast.error('Usage: poll create "question" "option1" "option2" [option3] [option4]');
			}
		} else if (commandInput === "poll --help") {
			toast.success(`Poll Commands:
- poll create "question" "option1" "option2": Create a poll
- poll --help: Show this help
- git commit: Create a regular post`);
		} else {
			toast.error("Invalid command. Use 'git commit -m \"message\"', 'git commit', or 'poll create \"question\" \"option1\" \"option2\"'");
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

	const handlePollSubmit = (e) => {
		e.preventDefault();
		const validOptions = pollOptions.filter(opt => opt.trim() !== "");
		if (commitMessage.trim() && validOptions.length >= 2) {
			// For now, create a post with poll data (backend would need poll model)
			const pollText = `${commitMessage}\n\nPoll (${pollDuration}):\n${validOptions.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`;
			createPost({ text: pollText, img: null });
		} else {
			toast.error("Poll question and at least 2 options are required");
		}
	};

	const addPollOption = () => {
		if (pollOptions.length < 4) {
			setPollOptions([...pollOptions, ""]);
		}
	};

	const removePollOption = (index) => {
		if (pollOptions.length > 2) {
			setPollOptions(pollOptions.filter((_, i) => i !== index));
		}
	};

	const updatePollOption = (index, value) => {
		const newOptions = [...pollOptions];
		newOptions[index] = value;
		setPollOptions(newOptions);
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
						<span className="text-green-600">user@commitly</span>
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

	if (showPollForm) {
		return (
			<div className="border-b border-green-400 p-4 bg-black">
				<div className="border border-green-400 p-4 font-mono">
					<div className="text-green-400 mb-4">
						<span className="text-green-600">user@commitly</span>
						<span className="text-white">:</span>
						<span className="text-blue-400">~/polls</span>
						<span className="text-white">$ poll create</span>
					</div>

					<form onSubmit={handlePollSubmit} className="space-y-4">
						<div>
							<div className="text-green-400 text-sm mb-2"># Poll question:</div>
							<textarea
								value={commitMessage}
								onChange={(e) => setCommitMessage(e.target.value)}
								className="w-full bg-black text-green-400 border border-green-400 p-2 font-mono resize-none focus:outline-none focus:border-green-300"
								rows="2"
								placeholder="What's your question?"
								required
							/>
						</div>

						<div>
							<div className="text-green-400 text-sm mb-2"># Poll options:</div>
							<div className="space-y-2">
								{pollOptions.map((option, index) => (
									<div key={index} className="flex items-center gap-2">
										<span className="text-green-600 text-sm">{index + 1}.</span>
										<input
											type="text"
											value={option}
											onChange={(e) => updatePollOption(index, e.target.value)}
											className="flex-1 bg-black text-green-400 border border-green-400 p-2 font-mono focus:outline-none focus:border-green-300"
											placeholder={`Option ${index + 1}`}
											required={index < 2}
										/>
										{pollOptions.length > 2 && index >= 2 && (
											<button
												type="button"
												onClick={() => removePollOption(index)}
												className="text-red-400 hover:text-red-300 text-sm border border-red-400 px-2 py-1"
											>
												rm
											</button>
										)}
									</div>
								))}
							</div>
							
							{pollOptions.length < 4 && (
								<button
									type="button"
									onClick={addPollOption}
									className="text-green-400 hover:text-green-300 text-sm border border-green-400 px-2 py-1 mt-2"
								>
									+ add option
								</button>
							)}
						</div>

						<div>
							<div className="text-green-400 text-sm mb-2"># Poll duration:</div>
							<select
								value={pollDuration}
								onChange={(e) => setPollDuration(e.target.value)}
								className="bg-black text-green-400 border border-green-400 p-2 font-mono focus:outline-none focus:border-green-300"
							>
								<option value="1h">1 hour</option>
								<option value="6h">6 hours</option>
								<option value="12h">12 hours</option>
								<option value="24h">24 hours</option>
								<option value="3d">3 days</option>
								<option value="7d">7 days</option>
							</select>
						</div>

						<div className="flex justify-between items-center">
							<div className="space-x-2">
								<button
									type="button"
									onClick={() => setShowPollForm(false)}
									className="text-red-400 hover:text-red-300 border border-red-400 px-3 py-1 font-mono text-sm"
								>
									abort
								</button>
								<button
									type="submit"
									disabled={isPending}
									className="text-green-400 hover:text-green-300 border border-green-400 px-3 py-1 font-mono text-sm disabled:opacity-50"
								>
									{isPending ? "creating..." : "create poll"}
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
							<span className="text-green-600">user@commitly</span>
							<span className="text-white">:</span>
							<span className="text-blue-400">~/tweets</span>
							<span className="text-white">$ </span>
							{!commandInput && (<span className="terminal-cursor">█</span>)}
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
								<div>• poll create "question" "option1" "option2" - create poll</div>
								<div>• poll --help - show poll commands</div>
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