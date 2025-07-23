const StatusBar = ({ commandHistory }) => {
	return (
		<div className="h-6 border-t border-green-400 bg-gray-900/20 flex items-center justify-between px-4 text-xs">
			<div className="flex items-center space-x-4">
				<div className="text-green-400">✓ Ready</div>
				<div className="text-green-600">Branch: main</div>
				<div className="text-green-600">Encoding: UTF-8</div>
			</div>
			<div className="flex items-center space-x-4">
				<div className="text-green-600">History: {commandHistory.length}</div>
				<div className="text-green-600">Terminal: active</div>
				<div className="text-green-400">Ln 1, Col 1</div>
			</div>
		</div>
	);
};

export default StatusBar;
