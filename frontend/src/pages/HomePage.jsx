import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import Posts from "../components/svgs/common/Posts.jsx";
import CreatePost from "./CreatePost.jsx";

const HomePage = () => {
	const [activeTab, setActiveTab] = useState("activity");
	const [terminalHistory, setTerminalHistory] = useState([
		"$ welcome to commitly terminal",
		"$ initializing workspace...",
		"$ loading recent commits...",
		"$ ready for development"
	]);
	const [commandInput, setCommandInput] = useState("");
	const terminalRef = useRef(null);

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

	const executeCommand = (cmd) => {
		const newHistory = [...terminalHistory, `$ ${cmd}`];
		
		const commands = {
			'ls': () => "drwxr-xr-x  activity/  messages/  profile/  settings/",
			'pwd': () => `/home/${authUser?.username}/commitly`,
			'whoami': () => authUser?.username || "anonymous",
			'git status': () => `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes)

	modified:   profile.json
	modified:   settings.config

no changes added to commit (use "git add" and "git commit")`,
			'git log --oneline': () => `a1b2c3d (HEAD -> main) Added new feature
f4e5d6c Fixed bug in user auth
9d8c7b6 Updated dependencies
2f1e0d9 Initial commit`,
			'npm run build': () => `> commitly@1.0.0 build
> vite build

✓ 42 modules transformed.
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-a1b2c3d4.css   12.34 kB │ gzip:  3.21 kB
dist/assets/index-e5f6g7h8.js   142.67 kB │ gzip: 45.78 kB
✓ built in 1.23s`,
			'docker ps': () => `CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                    NAMES
a1b2c3d4e5f6   nginx     "/docker-entrypoint.…"   2 hours ago     Up 2 hours     0.0.0.0:80->80/tcp      web_server
f6e5d4c3b2a1   mongo     "docker-entrypoint.s…"   2 hours ago     Up 2 hours     0.0.0.0:27017->27017/tcp mongo_db`,
			'kubectl get pods': () => `NAME                           READY   STATUS    RESTARTS   AGE
commitly-app-7d9f8c6b5-x4z2w   1/1     Running   0          2d
commitly-db-6c8d7b9a4-h5j3k    1/1     Running   0          2d
nginx-ingress-8b7c6d5a2-m9n1l  1/1     Running   0          5d`,
			'terraform plan': () => `Refreshing Terraform state in-memory prior to plan...

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create
  ~ update in-place

Terraform will perform the following actions:
  + aws_instance.web
  + aws_security_group.web_sg
Plan: 2 to add, 0 to change, 0 to destroy.`,
			'yarn test': () => `yarn run v1.22.19
$ jest
 PASS  src/components/Post.test.js
 PASS  src/utils/auth.test.js
 PASS  src/hooks/useFollow.test.js

Test Suites: 3 passed, 3 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        2.341 s
Done in 3.45s.`,
			'clear': () => {
				setTerminalHistory(["$ terminal cleared"]);
				return "";
			},
			'help': () => `Available commands:
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
- tab [name]: switch to tab`,
			'tab activity': () => {
				setActiveTab("activity");
				return "switched to activity feed";
			},
			'tab messages': () => {
				setActiveTab("messages");
				return "switched to messages";
			},
			'tab compose': () => {
				setActiveTab("compose");
				return "switched to compose";
			},
			'tab dashboard': () => {
				setActiveTab("dashboard");
				return "switched to developer dashboard";
			}
		};

		const result = commands[cmd.toLowerCase()] ? commands[cmd.toLowerCase()]() : `command not found: ${cmd}`;
		if (result) newHistory.push(result);
		
		setTerminalHistory(newHistory);
		setCommandInput("");
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			executeCommand(commandInput);
		}
	};

	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [terminalHistory]);

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
						<div className="flex-1 p-4">
							<div className="mb-4 space-y-2">
								<div className="text-green-400 text-sm flex items-center justify-between">
									<span>$ git log --graph --oneline --all</span>
									<div className="flex gap-2 text-xs">
										<button className="text-green-600 hover:text-green-400 border border-green-600 px-2 py-1">--follow</button>
										<button className="text-green-600 hover:text-green-400 border border-green-600 px-2 py-1">--for-you</button>
										<button className="text-green-600 hover:text-green-400 border border-green-600 px-2 py-1">--all</button>
									</div>
								</div>
								<div className="text-green-600 text-xs">
									Showing commits from your network • Use filters to narrow results
								</div>
							</div>
							<Posts feedType="forYou" />
						</div>
					)}

					{activeTab === "compose" && (
						<div className="flex-1 p-4">
							<div className="mb-4 text-green-400 text-sm">
								$ vim new_commit.md
							</div>
							<CreatePost />
						</div>
					)}

					{activeTab === "dashboard" && (
						<div className="flex-1 p-4 space-y-6">
							<div className="text-green-400 text-sm mb-4">
								$ cat dev_stats.json | jq '.'
							</div>
							
							{/* Contribution Graph */}
							<div className="border border-green-400 p-4 bg-gray-900/10">
								<div className="text-green-400 text-sm mb-3">
									<span className="text-green-600">"contributions":</span> {" {"}
								</div>
								<div className="grid grid-cols-7 gap-1 text-xs">
									<div className="text-green-600 text-center">S</div>
									<div className="text-green-600 text-center">M</div>
									<div className="text-green-600 text-center">T</div>
									<div className="text-green-600 text-center">W</div>
									<div className="text-green-600 text-center">T</div>
									<div className="text-green-600 text-center">F</div>
									<div className="text-green-600 text-center">S</div>
									{Array.from({ length: 49 }, (_, i) => (
										<div
											key={i}
											className={`w-3 h-3 border border-green-600 ${
												Math.random() > 0.5 
													? 'bg-green-400/60' 
													: Math.random() > 0.7 
														? 'bg-green-400/30' 
														: 'bg-gray-800'
											}`}
										/>
									))}
								</div>
								<div className="text-green-600 text-xs mt-2">
									💡 Commits in the last 7 weeks
								</div>
							</div>

							{/* Language Stats */}
							<div className="grid grid-cols-2 gap-4">
								<div className="border border-green-400 p-4 bg-gray-900/10">
									<div className="text-green-400 text-sm mb-2">
										<span className="text-green-600">"languages":</span> {" ["}
									</div>
									<div className="space-y-2 text-xs">
										<div className="flex justify-between">
											<span className="text-blue-400">JavaScript</span>
											<span className="text-green-400">42.1%</span>
										</div>
										<div className="flex justify-between">
											<span className="text-yellow-400">Python</span>
											<span className="text-green-400">28.3%</span>
										</div>
										<div className="flex justify-between">
											<span className="text-purple-400">TypeScript</span>
											<span className="text-green-400">19.7%</span>
										</div>
										<div className="flex justify-between">
											<span className="text-red-400">Rust</span>
											<span className="text-green-400">9.9%</span>
										</div>
									</div>
									<div className="text-green-600 text-xs mt-2">{"]"}</div>
								</div>

								<div className="border border-green-400 p-4 bg-gray-900/10">
									<div className="text-green-400 text-sm mb-2">
										<span className="text-green-600">"metrics":</span> {" {"}
									</div>
									<div className="space-y-2 text-xs">
										<div className="flex justify-between">
											<span className="text-green-600">commits_today:</span>
											<span className="text-green-400">3</span>
										</div>
										<div className="flex justify-between">
											<span className="text-green-600">streak_days:</span>
											<span className="text-green-400">12</span>
										</div>
										<div className="flex justify-between">
											<span className="text-green-600">code_reviews:</span>
											<span className="text-green-400">8</span>
										</div>
										<div className="flex justify-between">
											<span className="text-green-600">pull_requests:</span>
											<span className="text-green-400">15</span>
										</div>
									</div>
									<div className="text-green-600 text-xs mt-2">{"}"}</div>
								</div>
							</div>

							{/* Recent Repos */}
							<div className="border border-green-400 p-4 bg-gray-900/10">
								<div className="text-green-400 text-sm mb-3">
									<span className="text-green-600">"recent_repos":</span> {" ["}
								</div>
								<div className="space-y-2">
									{[
										{ name: "commitly", lang: "JavaScript", activity: "2 hours ago" },
										{ name: "awesome-terminal-apps", lang: "Shell", activity: "1 day ago" },
										{ name: "rust-cli-tools", lang: "Rust", activity: "3 days ago" },
										{ name: "python-automation", lang: "Python", activity: "1 week ago" }
									].map((repo, i) => (
										<div key={i} className="flex items-center justify-between text-xs border-b border-green-600 pb-2">
											<div>
												<span className="text-blue-400">📁 {repo.name}</span>
												<span className="text-green-600 ml-2">({repo.lang})</span>
											</div>
											<span className="text-green-500">{repo.activity}</span>
										</div>
									))}
								</div>
								<div className="text-green-600 text-xs mt-2">{"]"}</div>
							</div>

							{/* Terminal Commands */}
							<div className="border border-green-400 p-4 bg-gray-900/10">
								<div className="text-green-400 text-sm mb-3">Quick Actions</div>
								<div className="grid grid-cols-2 gap-2">
									{[
										"git status",
										"npm run build", 
										"docker ps",
										"kubectl get pods",
										"terraform plan",
										"yarn test"
									].map((cmd, i) => (
										<button
											key={i}
											className="text-left text-xs text-green-600 hover:text-green-400 hover:bg-green-900/20 p-2 border border-green-600 transition-colors"
											onClick={() => {
												setActiveTab("terminal");
												setTimeout(() => executeCommand(cmd), 100);
											}}
										>
											$ {cmd}
										</button>
									))}
								</div>
							</div>
						</div>
					)}

					{activeTab === "messages" && (
						<div className="flex-1 p-4">
							<div className="text-green-400 text-sm mb-4">
								$ ssh messages@commitly.dev
							</div>
							<div className="border border-green-600 p-4 bg-gray-900/20 text-center">
								<div className="text-green-600 mb-2">No active SSH connections</div>
								<div className="text-xs text-green-500">Use DM buttons on commits to start conversations</div>
							</div>
						</div>
					)}

					{activeTab === "terminal" && (
						<div className="flex-1 flex flex-col">
							{/* Terminal Output */}
							<div 
								ref={terminalRef}
								className="flex-1 p-4 overflow-y-auto space-y-1 bg-gray-900/10"
							>
								{terminalHistory.map((line, i) => (
									<div key={i} className="text-sm">
										{line.startsWith('$') ? (
											<span className="text-green-400">{line}</span>
										) : (
											<div className="text-green-300 ml-2 whitespace-pre-wrap">{line}</div>
										)}
									</div>
								))}
							</div>

							{/* Terminal Input */}
							<div className="border-t border-green-400 p-4">
								<div className="flex items-center gap-2">
									<span className="text-green-400">
										{authUser?.username}@commitly:~$
									</span>
									<input
										type="text"
										value={commandInput}
										onChange={(e) => setCommandInput(e.target.value)}
										onKeyPress={handleKeyPress}
										className="flex-1 bg-transparent text-green-400 outline-none"
										placeholder="type 'help' for available commands"
										autoFocus
									/>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Mini Terminal Sidebar */}
				<div className="w-80 border-l border-green-400 bg-gray-900/10 flex flex-col">
					{/* File Explorer */}
					<div className="border-b border-green-400 p-3">
						<div className="text-green-400 text-sm mb-2">EXPLORER</div>
						<div className="space-y-1 text-xs">
							<div className="text-green-600">📁 commitly/</div>
							<div className="text-green-600 ml-4">📁 src/</div>
							<div className="text-green-500 ml-8">📄 activity.log</div>
							<div className="text-green-500 ml-8">📄 new_commit.md</div>
							<div className="text-green-500 ml-8">📄 messages.ssh</div>
							<div className="text-green-600 ml-4">📁 .git/</div>
							<div className="text-green-600 ml-4">📄 README.md</div>
							<div className="text-green-600 ml-4">📄 package.json</div>
						</div>
					</div>

					{/* Quick Stats */}
					<div className="border-b border-green-400 p-3">
						<div className="text-green-400 text-sm mb-2">STATS</div>
						<div className="space-y-1 text-xs text-green-600">
							<div className="flex justify-between">
								<span>Commits:</span>
								<span className="text-green-400">42</span>
							</div>
							<div className="flex justify-between">
								<span>Following:</span>
								<span className="text-green-400">{authUser?.following?.length || 0}</span>
							</div>
							<div className="flex justify-between">
								<span>Followers:</span>
								<span className="text-green-400">{authUser?.followers?.length || 0}</span>
							</div>
							<div className="flex justify-between">
								<span>Uptime:</span>
								<span className="text-green-400">13:37</span>
							</div>
						</div>
					</div>

					{/* Quick Commands */}
					<div className="flex-1 p-3">
						<div className="text-green-400 text-sm mb-2">QUICK COMMANDS</div>
						<div className="space-y-2">
							{['git status', 'git log --oneline', 'docker ps', 'npm run build', 'kubectl get pods', 'clear'].map(cmd => (
								<button
									key={cmd}
									onClick={() => {
										setActiveTab("terminal");
										setTimeout(() => executeCommand(cmd), 100);
									}}
									className="block w-full text-left text-xs text-green-600 hover:text-green-400 hover:bg-green-900/20 p-1 rounded transition-colors"
								>
									$ {cmd}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* VS Code-style Status Bar */}
			<div className="bg-blue-600 text-white text-xs px-4 py-1 flex items-center justify-between font-mono">
				<div className="flex items-center gap-4">
					<span>● {activeTab === "activity" ? "Git Log" : activeTab === "compose" ? "Editing" : activeTab === "dashboard" ? "Dashboard" : activeTab === "messages" ? "SSH Session" : "Terminal"}</span>
					<span>Ln 1, Col 1</span>
					<span>UTF-8</span>
					<span>JavaScript</span>
				</div>
				<div className="flex items-center gap-4">
					<span>⚡ {authUser?.username}@commitly</span>
					<span>🔗 Connected</span>
					<span>📊 {tabs.find(t => t.id === activeTab)?.name}</span>
				</div>
			</div>
		</div>
	);
};

export default HomePage;