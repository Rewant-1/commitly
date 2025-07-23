const Messages = () => {
	return (
		<div className="flex-1 p-4">
			<div className="text-green-400 text-sm mb-4">
				$ ssh messages@commitly.dev
			</div>
			<div className="border border-green-600 p-4 bg-gray-900/20 text-center">
				<div className="text-green-600 mb-2">No active SSH connections</div>
				<div className="text-xs text-green-500">Use DM buttons on commits to start conversations</div>
			</div>
		</div>
	);
};

export default Messages;
