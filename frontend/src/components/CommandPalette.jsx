import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CommandPalette = ({ isOpen, onClose }) => {
	const [query, setQuery] = useState("");
	const [filteredCommands, setFilteredCommands] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const inputRef = useRef(null);
	const navigate = useNavigate();
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

	// Available commands
	const commands = useMemo(() => [
		// Navigation
		{ name: "cd ~/home", description: "Go to home feed", action: () => navigate("/") },
		{ name: "whoami", description: "Go to your profile", action: () => navigate(`/profile/${authUser?.username}`) },
		{ name: "ls notifications/", description: "View notifications", action: () => navigate("/notifications") },
		{ name: "ssh messages/", description: "Open messages", action: () => navigate("/messages") },
		
		// Git-style actions
		{ name: "git status", description: "Show current user status", action: () => toast.success(`User: @${authUser?.username} - Online`) },
		{ name: "git log", description: "Show recent posts", action: () => toast.success("Showing recent commits (posts)") },
		{ name: "git push", description: "Create new post", action: () => {
			const createPostModal = document.getElementById('create_post_modal');
			if (createPostModal) createPostModal.showModal();
		}},
		{ name: "git pull", description: "Refresh feed", action: () => window.location.reload() },
		{ name: "git branch", description: "Show current user branch", action: () => toast.success(`* main (${authUser?.username})`) },
		
		// Terminal utilities
		{ name: "ps aux", description: "Show running processes", action: () => toast.success("USER: commitly, PID: 1337, CMD: social_network.exe") },
		{ name: "uptime", description: "Show system uptime", action: () => toast.success("System uptime: 24 days, 13:37") },
		{ name: "df -h", description: "Show disk usage", action: () => toast.success("Posts: 1.2K / ∞ (0% used)") },
		{ name: "ping github.com", description: "Test connection", action: () => toast.success("PING github.com: 64 bytes, time=13.37ms") },
		{ name: "curl weather", description: "Check weather", action: () => toast.success("Weather: ☀️ 24°C - Perfect coding weather!") },
		
		// Social commands
		{ name: "grep followers", description: "Find followers", action: () => toast.success(`${authUser?.followers?.length || 0} followers found`) },
		{ name: "grep following", description: "Find following", action: () => toast.success(`${authUser?.following?.length || 0} following found`) },
		{ name: "find . -name '*.dm'", description: "Find direct messages", action: () => navigate("/messages") },
		
		// System commands
		{ name: "clear", description: "Clear current view", action: () => window.location.reload() },
		{ name: "pwd", description: "Show current location", action: () => toast.success(`/home/${authUser?.username}${window.location.pathname}`) },
		{ name: "history", description: "Show command history", action: () => toast.success("Command history: cd, whoami, git push...") },
		{ name: "man commitly", description: "Show manual", action: () => toast.success("commitly v1.0 - Terminal-inspired social platform") },
		{ name: "vim ~/.config", description: "Edit configuration", action: () => {
			// Trigger settings modal
			const settingsBtn = document.querySelector('[data-settings-btn]');
			if (settingsBtn) settingsBtn.click();
		}},
		{ name: "sudo rm -rf loneliness", description: "Connect with people", action: () => toast.success("Loneliness removed successfully! 💚") },
		{ name: "exit", description: "Logout", action: () => {
			if (confirm("Are you sure you want to logout?")) {
				// Trigger logout
				document.querySelector('[data-logout-btn]')?.click();
			}
		}},
		
		// Search and discovery
		{ name: "grep @username", description: "Search for a user", action: () => {
			const username = prompt("Enter username to search:");
			if (username) navigate(`/profile/${username.replace('@', '')}`);
		}},
		{ name: "find . -name", description: "Search posts", action: () => toast.info("Search feature coming soon!") },
		
		// DM commands
		{ name: "ssh username", description: "Message a user", action: () => {
			const username = prompt("Enter username to message:");
			if (username) navigate(`/messages/${username.replace('@', '')}`);
		}},
		
		// Help
		{ name: "man commitly", description: "Show help", action: () => {
			toast.success(`commitly v2.1.0
Available Commands:
- Navigation: cd, whoami, ls
- Git: status, log, push
- System: clear, pwd, exit
- Search: grep, find
- Messages: ssh
- Help: man`);
		}},
	], [navigate, authUser?.username, authUser?.followers?.length, authUser?.following?.length]);

	const executeCommand = useCallback((command) => {
		try {
			command.action();
			onClose();
			setQuery("");
		} catch (error) {
			toast.error("Command execution failed");
		}
	}, [onClose]);

	// Filter commands based on query
	useEffect(() => {
		if (!query.trim()) {
			setFilteredCommands(commands.slice(0, 8)); // Show top 8 by default
		} else {
			const filtered = commands.filter(cmd =>
				cmd.name.toLowerCase().includes(query.toLowerCase()) ||
				cmd.description.toLowerCase().includes(query.toLowerCase())
			);
			setFilteredCommands(filtered.slice(0, 8));
		}
		setSelectedIndex(0);
	}, [query, commands]);

	// Focus input when opened
	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	// Handle keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (!isOpen) return;

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setSelectedIndex(prev => 
						prev < filteredCommands.length - 1 ? prev + 1 : 0
					);
					break;
				case "ArrowUp":
					e.preventDefault();
					setSelectedIndex(prev => 
						prev > 0 ? prev - 1 : filteredCommands.length - 1
					);
					break;
				case "Enter":
					e.preventDefault();
					if (filteredCommands[selectedIndex]) {
						executeCommand(filteredCommands[selectedIndex]);
					}
					break;
				case "Escape":
					e.preventDefault();
					onClose();
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, filteredCommands, selectedIndex, executeCommand, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-32 z-50">
			<div className="bg-black border border-green-400 rounded-lg w-full max-w-lg mx-4 font-mono">
				{/* Terminal Header */}
				<div className="flex items-center space-x-2 p-3 border-b border-green-400">
					<div className="w-3 h-3 rounded-full bg-red-500"></div>
					<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
					<div className="w-3 h-3 rounded-full bg-green-400"></div>
					<span className="text-green-400 ml-4">command-palette.sh</span>
				</div>

				{/* Search Input */}
				<div className="p-4 border-b border-green-600">
					<div className="flex items-center space-x-2">
						<span className="text-green-600">$</span>
						<input
							ref={inputRef}
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="type command or search..."
							className="flex-1 bg-transparent text-green-400 outline-none placeholder-green-600"
						/>
					</div>
				</div>

				{/* Commands List */}
				<div className="max-h-64 overflow-y-auto">
					{filteredCommands.length === 0 ? (
						<div className="p-4 text-center text-green-600">
							<div>Command not found: {query}</div>
							<div className="text-xs mt-1">Try 'man commitly' for help</div>
						</div>
					) : (
						filteredCommands.map((command, index) => (
							<div
								key={command.name}
								className={`p-3 cursor-pointer transition-colors ${
									index === selectedIndex
										? "bg-green-900/20 border-l-4 border-green-400"
										: "hover:bg-green-900/10"
								}`}
								onClick={() => executeCommand(command)}
							>
								<div className="flex items-center justify-between">
									<div>
										<div className="text-green-400 font-medium">{command.name}</div>
										<div className="text-green-600 text-sm">{command.description}</div>
									</div>
									{index === selectedIndex && (
										<div className="text-green-600 text-xs">↵</div>
									)}
								</div>
							</div>
						))
					)}
				</div>

				{/* Footer */}
				<div className="p-3 border-t border-green-600 text-green-600 text-xs">
					<div className="flex justify-between">
						<span>↑↓ navigate • ↵ execute • esc close</span>
						<span>Ctrl+K to open</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CommandPalette;
