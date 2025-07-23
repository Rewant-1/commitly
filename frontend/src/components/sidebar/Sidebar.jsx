const Sidebar = ({ authUser, executeCommand, setActiveTab, timeoutRef }) => {
	return (
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
								// Clear any existing timeout
								if (timeoutRef.current) {
									clearTimeout(timeoutRef.current);
								}
								// Set new timeout with cleanup
								timeoutRef.current = setTimeout(() => executeCommand(cmd), 100);
							}}
							className="block w-full text-left text-xs text-green-600 hover:text-green-400 hover:bg-green-900/20 p-1 rounded transition-colors"
						>
							$ {cmd}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
