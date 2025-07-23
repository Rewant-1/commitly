import { useMemo } from "react";

const Dashboard = ({ executeCommand, setActiveTab, timeoutRef }) => {
	// Memoize contribution data to avoid recreation on each render
	const contributionData = useMemo(() => 
		Array.from({ length: 49 }, () => {
			const rand = Math.random();
			return rand > 0.5 ? 'high' : rand > 0.7 ? 'medium' : 'low';
		}), 
	[]);

	return (
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
					{Array.from({ length: 49 }, (_, i) => {
						const level = contributionData[i];
						return (
							<div
								key={i}
								className={`w-3 h-3 border border-green-600 ${
									level === 'high'
										? 'bg-green-400/60'
										: level === 'medium'
											? 'bg-green-400/30'
											: 'bg-gray-800'
								}`}
							/>
						);
					})}
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
								// Clear any existing timeout
								if (timeoutRef.current) {
									clearTimeout(timeoutRef.current);
								}
								// Set new timeout with cleanup
								timeoutRef.current = setTimeout(() => executeCommand(cmd), 100);
							}}
						>
							$ {cmd}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
