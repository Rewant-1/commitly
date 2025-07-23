import CreatePost from "../../pages/CreatePost.jsx";

const Compose = () => {
	return (
		<div className="flex-1 p-4">
			<div className="mb-4 text-green-400 text-sm">
				$ vim new_commit.md
			</div>
			<CreatePost />
		</div>
	);
};

export default Compose;
