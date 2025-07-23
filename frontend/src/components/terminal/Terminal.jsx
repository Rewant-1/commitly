import { useRef, useEffect } from "react";

const Terminal = ({ 
	terminalHistory, 
	commandInput, 
	setCommandInput, 
	handleKeyDown, 
	authUser, 
	commandHistory 
}) => {
	const terminalRef = useRef(null);

	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [terminalHistory]);

	return (
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
						onKeyDown={handleKeyDown}
						className="flex-1 bg-transparent text-green-400 outline-none"
						placeholder="type 'help' for available commands"
						autoFocus
					/>
				</div>
				{/* Terminal shortcuts hint */}
				<div className="text-green-600 text-xs mt-2 flex items-center gap-4">
					<span>↑↓ History</span>
					<span>Tab Autocomplete</span>
					<span>Esc Clear</span>
					{commandHistory.length > 0 && (
						<span className="text-green-500">
							{commandHistory.length} commands in history
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default Terminal;
