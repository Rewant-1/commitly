import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const DotfileConfigModal = ({ isOpen, onClose, authUser }) => {
	const [config, setConfig] = useState({
		displayName: authUser?.fullName || "",
		bio: authUser?.bio || "",
		theme: "terminal-green",
		prompt: "${USER}@commitly:~$",
		editor: "vim",
		notifications: true,
		privateMode: false
	});

	const queryClient = useQueryClient();

	const { mutate: updateProfile, isPending } = useMutation({
		mutationFn: async (profileData) => {
			const res = await fetch("/api/users/update", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(profileData),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to update profile");
			return data;
		},
		onSuccess: () => {
			toast.success("Configuration saved successfully!");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
			queryClient.invalidateQueries({ queryKey: ["userProfile"] });
			onClose();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleSave = () => {
		updateProfile({
			fullName: config.displayName,
			bio: config.bio,
		});
	};

	const configFileContent = `# commitly Configuration File
# ~/.commitly/config

[user]
    name = "${config.displayName}"
    bio = "${config.bio}"
    editor = ${config.editor}

[terminal]
    theme = ${config.theme}
    prompt = "${config.prompt}"
    
[preferences]
    notifications = ${config.notifications ? "true" : "false"}
    private_mode = ${config.privateMode ? "true" : "false"}

# Advanced Configuration
[aliases]
    home = "cd ~/"
    posts = "git log --oneline"
    messages = "ssh messages/"
    profile = "whoami"

[keybindings]
    command_palette = "Ctrl+K"
    new_post = "Ctrl+Enter"
    
# Last modified: ${new Date().toLocaleString()}`;

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 font-mono">
			<div className="bg-black border-2 border-green-400 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
				{/* Terminal Header */}
				<div className="flex items-center space-x-2 border-b border-green-400 p-4">
					<div className="w-3 h-3 rounded-full bg-red-500"></div>
					<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
					<div className="w-3 h-3 rounded-full bg-green-400"></div>
					<span className="text-green-400 ml-4">vim ~/.commitly/config</span>
					<div className="ml-auto flex space-x-2">
						<button
							onClick={onClose}
							className="text-green-600 hover:text-green-400 text-sm border border-green-600 px-2 py-1 hover:border-green-400 transition-colors"
						>
							:q
						</button>
						<button
							onClick={handleSave}
							disabled={isPending}
							className="text-green-400 hover:text-green-300 text-sm border border-green-400 px-2 py-1 hover:border-green-300 transition-colors disabled:opacity-50"
						>
							{isPending ? ":w saving..." : ":wq"}
						</button>
					</div>
				</div>

				<div className="flex h-[70vh]">
					{/* Config File Editor */}
					<div className="flex-1 p-4 bg-gray-900/20 overflow-y-auto">
						<div className="text-green-600 text-xs mb-2">
							{authUser?.username}@commitly:~$ vim ~/.commitly/config
						</div>
						<pre className="text-green-400 text-sm whitespace-pre-wrap">
							{configFileContent}
						</pre>
					</div>

					{/* Visual Editor */}
					<div className="w-80 border-l border-green-400 p-4 bg-black overflow-y-auto">
						<div className="text-green-400 text-sm mb-4">Interactive Editor</div>
						
						<div className="space-y-4">
							<div>
								<label className="block text-green-600 text-xs mb-1">Display Name</label>
								<input
									type="text"
									value={config.displayName}
									onChange={(e) => setConfig(prev => ({ ...prev, displayName: e.target.value }))}
									className="w-full bg-black border border-green-600 text-green-400 p-2 text-sm focus:border-green-400 outline-none"
									placeholder="Your display name"
								/>
							</div>

							<div>
								<label className="block text-green-600 text-xs mb-1">Bio</label>
								<textarea
									value={config.bio}
									onChange={(e) => setConfig(prev => ({ ...prev, bio: e.target.value }))}
									className="w-full bg-black border border-green-600 text-green-400 p-2 text-sm focus:border-green-400 outline-none h-20 resize-none"
									placeholder="Tell us about yourself..."
								/>
							</div>

							<div>
								<label className="block text-green-600 text-xs mb-1">Terminal Theme</label>
								<select
									value={config.theme}
									onChange={(e) => setConfig(prev => ({ ...prev, theme: e.target.value }))}
									className="w-full bg-black border border-green-600 text-green-400 p-2 text-sm focus:border-green-400 outline-none"
								>
									<option value="terminal-green">Terminal Green</option>
									<option value="hacker-matrix">Matrix Green</option>
									<option value="retro-amber">Retro Amber</option>
									<option value="cyberpunk-cyan">Cyberpunk Cyan</option>
								</select>
							</div>

							<div>
								<label className="block text-green-600 text-xs mb-1">Custom Prompt</label>
								<input
									type="text"
									value={config.prompt}
									onChange={(e) => setConfig(prev => ({ ...prev, prompt: e.target.value }))}
									className="w-full bg-black border border-green-600 text-green-400 p-2 text-sm focus:border-green-400 outline-none"
									placeholder="${USER}@commitly:~$"
								/>
							</div>

							<div>
								<label className="block text-green-600 text-xs mb-1">Default Editor</label>
								<select
									value={config.editor}
									onChange={(e) => setConfig(prev => ({ ...prev, editor: e.target.value }))}
									className="w-full bg-black border border-green-600 text-green-400 p-2 text-sm focus:border-green-400 outline-none"
								>
									<option value="vim">vim</option>
									<option value="nano">nano</option>
									<option value="emacs">emacs</option>
									<option value="code">vscode</option>
								</select>
							</div>

							<div className="space-y-2">
								<label className="flex items-center space-x-2">
									<input
										type="checkbox"
										checked={config.notifications}
										onChange={(e) => setConfig(prev => ({ ...prev, notifications: e.target.checked }))}
										className="text-green-400 focus:ring-green-400"
									/>
									<span className="text-green-600 text-xs">Enable notifications</span>
								</label>

								<label className="flex items-center space-x-2">
									<input
										type="checkbox"
										checked={config.privateMode}
										onChange={(e) => setConfig(prev => ({ ...prev, privateMode: e.target.checked }))}
										className="text-green-400 focus:ring-green-400"
									/>
									<span className="text-green-600 text-xs">Private mode</span>
								</label>
							</div>
						</div>

						<div className="mt-6 pt-4 border-t border-green-600">
							<div className="text-green-600 text-xs mb-2">Quick Actions</div>
							<div className="space-y-1 text-xs">
								<div className="text-green-500">:w - Save configuration</div>
								<div className="text-green-500">:q - Quit without saving</div>
								<div className="text-green-500">:wq - Save and quit</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DotfileConfigModal;
