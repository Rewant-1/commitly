import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import Posts from "../components/svgs/common/Posts.jsx";
import CreatePost from "./CreatePost.jsx";
import Terminal from "../components/terminal/Terminal";
import ActivityFeed from "../components/activity/ActivityFeed";
import Compose from "../components/compose/Compose";
import Messages from "../components/messages/Messages";
import Dashboard from "../components/dashboard/Dashboard";
import Sidebar from "../components/sidebar/Sidebar";
import StatusBar from "../components/statusbar/StatusBar";

const HomePage = () => {
	const [activeTab, setActiveTab] = useState("activity");
	const [terminalHistory, setTerminalHistory] = useState([
		"$ welcome to commitly terminal",
		"$ initializing workspace...",
		"$ loading recent commits...",
		"$ ready for development"
	]);
	const [commandInput, setCommandInput] = useState("");
	const [commandHistory, setCommandHistory] = useState([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const terminalRef = useRef(null);
	const timeoutRef = useRef(null);

	const { data: authUser } = useQuery({ 
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me");
				if (!res.ok) {
					const data = await res.json();
					throw new Error(data.error || "Something went wrong");
				}
				const data = await res.json();
				return data;
			} catch (error) {
				throw new Error(error.message || "Failed to fetch user data");
			}
		},
	});

	// Memoize commands object to avoid recreation on each executeCommand call
	const commands = useMemo(() => ({
		'ls': () => ({ output: "drwxr-xr-x  activity/  messages/  profile/  settings/" }),
		'pwd': () => ({ output: `/home/${authUser?.username}/commitly` }),
		'whoami': () => ({ output: authUser?.username || "anonymous" }),
		'git status': () => ({ 
			output: `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes)

	modified:   profile.json
	modified:   settings.config

no changes added to commit (use "git add" and "git commit")`
		}),
		'git log --oneline': () => ({ 
			output: `a1b2c3d (HEAD -> main) Added new feature
f4e5d6c Fixed bug in user auth
9d8c7b6 Updated dependencies
2f1e0d9 Initial commit`
		}),
		'npm run build': () => ({ 
			output: `> commitly@1.0.0 build
> vite build

✓ 42 modules transformed.
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-a1b2c3d4.css   12.34 kB │ gzip:  3.21 kB
dist/assets/index-e5f6g7h8.js   142.67 kB │ gzip: 45.78 kB
✓ built in 1.23s`
		}),
		'docker ps': () => ({ 
			output: `CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                    NAMES
a1b2c3d4e5f6   nginx     "/docker-entrypoint.…"   2 hours ago     Up 2 hours     0.0.0.0:80->80/tcp      web_server
f6e5d4c3b2a1   mongo     "docker-entrypoint.s…"   2 hours ago     Up 2 hours     0.0.0.0:27017->27017/tcp mongo_db`
		}),
		'kubectl get pods': () => ({ 
			output: `NAME                           READY   STATUS    RESTARTS   AGE
commitly-app-7d9f8c6b5-x4z2w   1/1     Running   0          2d
commitly-db-6c8d7b9a4-h5j3k    1/1     Running   0          2d
nginx-ingress-8b7c6d5a2-m9n1l  1/1     Running   0          5d`
		}),
		'terraform plan': () => ({ 
			output: `Refreshing Terraform state in-memory prior to plan...

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create
  ~ update in-place

Terraform will perform the following actions:
  + aws_instance.web
  + aws_security_group.web_sg
Plan: 2 to add, 0 to change, 0 to destroy.`
		}),
		'yarn test': () => ({ 
			output: `yarn run v1.22.19
$ jest
 PASS  src/components/Post.test.js
 PASS  src/utils/auth.test.js
 PASS  src/hooks/useFollow.test.js

Test Suites: 3 passed, 3 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        2.341 s
Done in 3.45s.`
		}),
		'clear': () => ({ clearHistory: true }),
		'help': () => ({ 
			output: `Available commands:
- ls: list directory contents
- pwd: print working directory  
- whoami: current user
- git status: repository status
- git log: commit history
- npm run build: build project
- docker ps: list containers
- kubectl get pods: list pods
- terraform plan: plan infrastructure
- yarn test: run tests
- clear: clear terminal
- tab [name]: switch to tab

Keyboard shortcuts:
- ↑/↓: Navigate command history
- Tab: Autocomplete commands
- Esc: Clear current input
- Enter: Execute command`
		}),
		'tab activity': () => ({ switchTab: "activity", output: "switched to activity feed" }),
		'tab messages': () => ({ switchTab: "messages", output: "switched to messages" }),
		'tab compose': () => ({ switchTab: "compose", output: "switched to compose" }),
		'tab dashboard': () => ({ switchTab: "dashboard", output: "switched to developer dashboard" })
	}), [authUser?.username]);

	// Memoize contribution data to avoid recreation on each render
	const contributionData = useMemo(() => 
		Array.from({ length: 49 }, () => {
			const rand = Math.random();
			return rand > 0.5 ? 'high' : rand > 0.7 ? 'medium' : 'low';
		}), 
	[]);

	const executeCommand = (cmd) => {
		const newHistory = [...terminalHistory, `$ ${cmd}`];
		
		// Add command to history if it's not empty and not a duplicate of the last command
		if (cmd.trim() && (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== cmd.trim())) {
			setCommandHistory(prev => [...prev, cmd.trim()]);
		}
		
		// Reset history index
		setHistoryIndex(-1);
		
		const commandHandler = commands[cmd.toLowerCase()];
		
		if (!commandHandler) {
			newHistory.push(`command not found: ${cmd}`);
			setTerminalHistory(newHistory);
			setCommandInput("");
			return;
		}

		const result = commandHandler();
		
		// Handle side effects based on command result
		if (result.clearHistory) {
			setTerminalHistory(["$ terminal cleared"]);
		} else {
			if (result.output) {
				newHistory.push(result.output);
			}
			setTerminalHistory(newHistory);
		}
		
		if (result.switchTab) {
			setActiveTab(result.switchTab);
		}
		
		setCommandInput("");
	};

	const handleKeyDown = (e) => {
		switch (e.key) {
			case 'Enter':
				if (commandInput.trim()) {
					executeCommand(commandInput);
				}
				break;
				
			case 'ArrowUp':
				e.preventDefault();
				if (commandHistory.length > 0) {
					const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
					setHistoryIndex(newIndex);
					setCommandInput(commandHistory[newIndex]);
				}
				break;
				
			case 'ArrowDown':
				e.preventDefault();
				if (historyIndex >= 0) {
					const newIndex = historyIndex + 1;
					if (newIndex >= commandHistory.length) {
						setHistoryIndex(-1);
						setCommandInput("");
					} else {
						setHistoryIndex(newIndex);
						setCommandInput(commandHistory[newIndex]);
					}
				}
				break;
				
			case 'Escape':
				e.preventDefault();
				setCommandInput("");
				setHistoryIndex(-1);
				break;
				
			case 'Tab':
				e.preventDefault();
				// Basic tab completion for common commands
				if (commandInput) {
					const availableCommands = Object.keys(commands);
					const matches = availableCommands.filter(cmd => cmd.startsWith(commandInput.toLowerCase()));
					if (matches.length === 1) {
						setCommandInput(matches[0]);
					} else if (matches.length > 1) {
						// Show available completions
						const newHistory = [...terminalHistory, `$ ${commandInput}`, `Available completions: ${matches.join(', ')}`];
						setTerminalHistory(newHistory);
					}
				}
				break;
				
			default:
				// For any other key, reset history navigation
				if (historyIndex !== -1) {
					setHistoryIndex(-1);
				}
				break;
		}
	};

	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [terminalHistory]);

	// Cleanup timeout on component unmount
	useEffect(() => {
		const currentTimeout = timeoutRef.current;
		return () => {
			if (currentTimeout) {
				clearTimeout(currentTimeout);
			}
		};
	}, []);

	const tabs = [
		{ id: "activity", name: "activity.log", icon: "📊" },
		{ id: "compose", name: "new_commit.md", icon: "✏️" },
		{ id: "dashboard", name: "dev_stats.json", icon: "📈" },
		{ id: "messages", name: "messages.ssh", icon: "💬" },
		{ id: "terminal", name: "terminal.sh", icon: "⚡" }
	];

	return (
		<div className="flex-[5_5_0] bg-black text-green-400 font-mono border-r border-green-400 min-h-screen flex flex-col">
			{/* IDE-style Tab Bar */}
			<div className="border-b border-green-400 bg-gray-900/20">
				<div className="flex">
					{tabs.map(tab => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`px-4 py-2 text-sm border-r border-green-600 hover:bg-green-900/20 transition-colors flex items-center gap-2 ${
								activeTab === tab.id ? 'bg-green-900/30 text-green-300' : 'text-green-600'
							}`}
						>
							<span>{tab.icon}</span>
							<span>{tab.name}</span>
							{activeTab === tab.id && <span className="text-green-400">●</span>}
						</button>
					))}
				</div>
				
				{/* Breadcrumb */}
				<div className="px-4 py-1 text-xs text-green-600 border-t border-green-600">
					/home/{authUser?.username}/commitly/{tabs.find(t => t.id === activeTab)?.name}
				</div>
			</div>

			{/* Content Area */}
			<div className="flex-1 flex">
				{/* Main Content */}
				<div className="flex-1 flex flex-col">
					{activeTab === "activity" && (
						<ActivityFeed />
					)}

					{activeTab === "compose" && (
						<Compose />
					)}

					{activeTab === "dashboard" && (
						<Dashboard contributionData={contributionData} authUser={authUser} executeCommand={executeCommand} setActiveTab={setActiveTab} timeoutRef={timeoutRef} />
					)}

					{activeTab === "messages" && (
						<Messages />
					)}

					{activeTab === "terminal" && (
						<Terminal 
							terminalHistory={terminalHistory}
							commandInput={commandInput}
							setCommandInput={setCommandInput}
							handleKeyDown={handleKeyDown}
							authUser={authUser}
							commandHistory={commandHistory}
							terminalRef={terminalRef}
						/>
					)}
				</div>

				{/* Sidebar */}
				<Sidebar 
					authUser={authUser}
					executeCommand={executeCommand}
					setActiveTab={setActiveTab}
					timeoutRef={timeoutRef}
				/>
			</div>

			{/* VS Code-style Status Bar */}
			<StatusBar commandHistory={commandHistory} />
		</div>
	);
};

export default HomePage;