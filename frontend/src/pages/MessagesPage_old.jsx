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
						<div className="text-green-600 text-sm mb-4">Use 'ssh [username]' to connect to a conversation</div>
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
				</div>
			</div>
		);
	}

	// Fetch messages with the user
	const { data: messages, isLoading } = useQuery({
		queryKey: ["messages", username],
		queryFn: async () => {
			const res = await fetch(`/api/messages/${username}`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to fetch messages");
			return data;
		}
	});

	// Fetch user info
	const { data: recipient } = useQuery({
		queryKey: ["user", username],
		queryFn: async () => {
			const res = await fetch(`/api/users/profile/${username}`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to fetch user");
			return data;
		}
	});

	// Send message mutation
	const { mutate: sendMessage, isPending: isSending } = useMutation({
		mutationFn: async (messageText) => {
			const res = await fetch(`/api/messages/send/${username}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: messageText })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to send message");
			return data;
		},
		onSuccess: () => {
			setMessage("");
			setCommand("");
			queryClient.invalidateQueries({ queryKey: ["messages", username] });
		},
		onError: (error) => toast.error(error.message)
	});

	// Terminal commands
	const handleCommand = (cmd) => {
		const commands = {
			clear: () => {
				// Clear messages (frontend only)
				toast.success("Terminal cleared");
			},
			help: () => {
				const helpMsg = `Available commands:
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
				toast.success(`PING ${recipient?.fullName} (${username}): 64 bytes, time=1.337ms`);
			}
		};

		const [baseCmd, ...args] = cmd.trim().split(" ");
		
		if (baseCmd === "send" && args.length > 0) {
			const messageText = args.join(" ");
			sendMessage(messageText);
		} else if (commands[baseCmd]) {
			commands[baseCmd]();
		} else {
			toast.error(`Command not found: ${baseCmd}. Type 'help' for available commands.`);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (command.trim()) {
			handleCommand(command);
		} else if (message.trim()) {
			sendMessage(message);
		}
	};

	// Auto scroll to bottom
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Terminal prompt simulation
	const getPrompt = () => `${authUser?.username}@terminal:~/messages/${username}$`;

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
						disconnect
					</Link>
				</div>
				
				{recipient && (
					<div className="text-sm">
						<div className="text-green-600">Connected to: {recipient.fullName} (@{recipient.username})</div>
						<div className="text-green-600">Status: {recipient.isOnline ? "🟢 online" : "🔴 offline"}</div>
						<div className="text-green-600 mt-2">Type 'help' for available commands</div>
					</div>
				)}
			</div>

			{/* Messages Container */}
			<div className="flex-1 p-4 h-[calc(100vh-200px)] overflow-y-auto">
				<div className="space-y-4">
					{/* Welcome message */}
					<div className="text-green-600 text-sm">
						<div>Last login: {new Date().toLocaleDateString()} from terminal.social</div>
						<div>Welcome to secure messaging terminal v2.1.0</div>
						<div className="mt-2">--- Chat History ---</div>
					</div>

					{/* Messages */}
					{messages?.map((msg, index) => (
						<div key={index} className="mb-2">
							<div className="text-green-600 text-xs">
								[{new Date(msg.createdAt).toLocaleTimeString()}] 
								{msg.sender._id === authUser._id ? ` ${authUser.username}` : ` ${username}`}
							</div>
							<div className={`pl-4 ${msg.sender._id === authUser._id ? 'text-green-400' : 'text-blue-400'}`}>
								&gt; {msg.message}
							</div>
						</div>
					))}

					{messages?.length === 0 && (
						<div className="text-center py-8 border border-green-600 rounded">
							<div className="text-green-600 text-sm mb-2">$ ls messages/</div>
							<div className="text-green-400">directory is empty</div>
							<div className="text-green-600 text-xs mt-2">start the conversation!</div>
						</div>
					)}
					
					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Input Area */}
			<div className="border-t border-green-400 p-4">
				<form onSubmit={handleSubmit} className="space-y-2">
					{/* Command Input */}
					<div className="flex items-center space-x-2">
						<span className="text-green-600 text-sm">{getPrompt()}</span>
						<input
							type="text"
							value={command}
							onChange={(e) => setCommand(e.target.value)}
							className="flex-1 bg-black text-green-400 border-none outline-none"
							placeholder="enter command or message..."
							disabled={isSending}
						/>
					</div>

					{/* Quick Message Input */}
					<div className="flex items-center space-x-2">
						<span className="text-green-600 text-sm">msg&gt;</span>
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
