import { CreatePost } from "../components/CreatePost";

export const CreatePostPage = () => {
	return (
		<div className="pt-6 space-y-6">
			<div className="space-y-2 border-b border-zinc-800/80 pb-6 text-center">
				<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
					Create New Post
				</h1>
				<p className="text-sm text-zinc-400">
					Share your thoughts, questions, or links with the community.
				</p>
			</div>
			<CreatePost />
		</div>
	);
};

