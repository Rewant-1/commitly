import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const MessagesPage = () => {
	const { username } = useParams();
	const [message, setMessage] = useState("");
	const [command, setCommand] = useState("");
	const messagesEndRef = useRef(null);
	
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

	// Fetch messages with the user (only if username exists)
	const { data: messages, isLoading } = useQuery({
		queryKey: ["messages", username],
		queryFn: async () => {
			if (!username) return [];
			const res = await fetch(`/api/messages/${username}`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to fetch messages");
			return data;
		},
		enabled: !!username
	});

	// Fetch user info (only if username exists)
	const { data: recipient } = useQuery({
		queryKey: ["user", username],
		queryFn: async () => {
			if (!username) return null;
			const res = await fetch(`/api/users/profile/${username}`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to fetch user");
			return data;
		},
		enabled: !!username
	});

	// Send message mutation
	const { mutate: sendMessage, isPending: isSending } = useMutation({
		mutationFn: async (messageContent) => {
			const res = await fetch("/api/messages/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					receiverId: recipient._id,
					message: messageContent,
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to send message");
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["messages", username] });
			setMessage("");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	// Handle terminal commands
	const handleCommand = (cmd) => {
		const commands = {
			help: () => {
				const helpMsg = `Available commands:
- help: Show this help message
- send [message]: Send a message
- clear: Clear terminal
- exit: Return to home
- whoami: Show current user
- ping: Test connection`;
				toast.success(helpMsg);
			},
			exit: () => {
				window.location.href = "/";
			},
			whoami: () => {
				toast.success(`Current user: @${authUser.username}`);
			},
			ping: () => {
				if (!username) {
					toast.success(`PING messages server: 64 bytes, time=1.337ms`);
				} else {
					toast.success(`PING ${recipient?.fullName} (${username}): 64 bytes, time=1.337ms`);
				}
			}
		};

		const [baseCmd, ...args] = cmd.trim().split(" ");
		
		if (baseCmd === "send" && args.length > 0) {
			const messageContent = args.join(" ");
			if (username && recipient) {
				sendMessage(messageContent);
				toast.success("Message sent!");
			} else {
				toast.error("No recipient selected. Use DM button on posts to start conversations.");
			}
		} else if (commands[baseCmd]) {
			commands[baseCmd]();
		} else {
			toast.error(`Command not found: ${baseCmd}. Type 'help' for available commands.`);
		}
		
		setCommand("");
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		
		if (command.trim()) {
			handleCommand(command);
		} else if (message.trim() && username && recipient) {
			sendMessage(message.trim());
		} else if (message.trim() && !username) {
			toast.error("No recipient selected. Use DM button on posts to start conversations.");
		}
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Terminal prompt simulation
	const getPrompt = () => {
		if (!username) return `${authUser?.username}@terminal:~/messages$`;
		return `${authUser?.username}@terminal:~/messages/${username}$`;
	};

	// If no username, show conversations list
	if (!username) {
		return (
			<div className="min-h-screen bg-black text-green-400 font-mono">
				{/* Terminal Header */}
				<div className="border-b border-green-400 p-4">
					<div className="flex items-center space-x-2 mb-2">
						<div className="w-3 h-3 rounded-full bg-red-500"></div>
						<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
						<div className="w-3 h-3 rounded-full bg-green-400"></div>
						<span className="ml-4 text-green-400">ssh messages@terminal.dm</span>
						<Link 
							to="/" 
							className="ml-auto text-green-600 hover:text-green-400 text-sm border border-green-600 px-2 py-1 hover:border-green-400 transition-colors"
						>
							exit
						</Link>
					</div>
					<div className="text-green-600 text-sm">
						user@commitly:~/messages$ ls -la
					</div>
				</div>

				{/* Messages Directory Listing */}
				<div className="p-4 space-y-4">
					<div className="text-green-400 mb-4">
						<div className="mb-2">Available conversations:</div>
						<div className="text-green-600 text-sm mb-4">Click DM buttons on posts to start conversations</div>
					</div>

					{/* Sample conversations placeholder */}
					<div className="space-y-2">
						<div className="text-green-600 text-sm">
							drwxr-xr-x 2 user user 4096 Jan 22 14:30 ./
						</div>
						<div className="text-green-600 text-sm">
							drwxr-xr-x 5 user user 4096 Jan 22 14:25 ../
						</div>
						<div className="text-green-600 text-sm">
							-rw-r--r-- 1 user user  156 Jan 22 14:30 README.md
						</div>
					</div>

					<div className="mt-8 p-4 border border-green-600 bg-gray-900/20">
						<div className="text-green-400 text-sm mb-2">📡 Direct Message System</div>
						<div className="text-green-600 text-xs space-y-1">
							<div>• Click DM buttons on posts to start conversations</div>
							<div>• Use terminal commands to interact</div>
							<div>• Real-time messaging with SSH-style interface</div>
						</div>
					</div>

					<div className="mt-4 text-green-600 text-sm">
						<div>$ whoami</div>
						<div className="text-green-400">{authUser?.username}</div>
					</div>

					{/* Terminal Input */}
					<form onSubmit={handleSubmit} className="mt-8 flex items-center space-x-2">
						<span className="text-green-400">{getPrompt()}</span>
						<input
							type="text"
							value={command}
							onChange={(e) => setCommand(e.target.value)}
							className="flex-1 bg-transparent text-green-400 outline-none"
							placeholder="type 'help' for commands..."
						/>
					</form>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin text-2xl mb-2">⏳</div>
					<div>Establishing SSH connection...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-green-400 font-mono">
			{/* Terminal Header */}
			<div className="border-b border-green-400 p-4">
				<div className="flex items-center space-x-2 mb-2">
					<div className="w-3 h-3 rounded-full bg-red-500"></div>
					<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
					<div className="w-3 h-3 rounded-full bg-green-400"></div>
					<span className="ml-4 text-green-400">ssh {username}@terminal.dm</span>
					<Link 
						to="/" 
						className="ml-auto text-green-600 hover:text-green-400 text-sm border border-green-600 px-2 py-1 hover:border-green-400 transition-colors"
					>
						exit
					</Link>
				</div>
				<div className="text-green-600 text-sm">
					Connected to {recipient?.fullName} (@{username})
				</div>
			</div>

			{/* Messages Container */}
			<div className="flex-1 p-4 h-96 overflow-y-auto space-y-3">
				{messages?.map((msg, index) => (
					<div key={index} className="space-y-1">
						<div className="text-green-600 text-xs">
							[{new Date(msg.createdAt).toLocaleTimeString()}] 
							{msg.senderId === authUser._id ? 
								` ${authUser.username}@local` : 
								` ${username}@remote`
							}:
						</div>
						<div className="text-green-400 ml-4">
							{msg.message}
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>

			{/* Terminal Input */}
			<div className="border-t border-green-400 p-4">
				<form onSubmit={handleSubmit} className="space-y-2">
					<div className="flex items-center space-x-2">
						<span className="text-green-400">{getPrompt()}</span>
						<input
							type="text"
							value={command}
							onChange={(e) => setCommand(e.target.value)}
							className="flex-1 bg-black text-green-400 border-none outline-none"
							placeholder="enter terminal command (e.g., send hello there!)"
							disabled={isSending}
						/>
					</div>
					
					{/* Quick Message Input */}
					<div className="flex items-center space-x-2 ml-6">
						<span className="text-green-600">quick:</span>
						<input
							type="text"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className="flex-1 bg-black text-green-400 border-none outline-none"
							placeholder="quick message (or use: send [your message])"
							disabled={isSending}
						/>
						<button
							type="submit"
							disabled={isSending || (!command.trim() && !message.trim())}
							className="text-green-400 hover:text-green-300 border border-green-400 px-3 py-1 text-sm hover:border-green-300 transition-colors disabled:opacity-50"
						>
							{isSending ? "sending..." : "send"}
						</button>
					</div>
				</form>

				{/* Command Hints */}
				<div className="mt-2 text-green-600 text-xs">
					<span>Quick commands: </span>
					<button onClick={() => setCommand("help")} className="hover:text-green-400 underline">help</button>
					<span> | </span>
					<button onClick={() => setCommand("clear")} className="hover:text-green-400 underline">clear</button>
					<span> | </span>
					<button onClick={() => setCommand("ping")} className="hover:text-green-400 underline">ping</button>
					<span> | </span>
					<button onClick={() => setCommand("exit")} className="hover:text-green-400 underline">exit</button>
				</div>
			</div>
		</div>
	);
};

export default MessagesPage;
