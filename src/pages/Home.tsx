import { PostList } from "../components/PostList";

export const Home = () => {
	return (
		<div className="pt-6 space-y-6">
			<div className="space-y-2 border-b border-zinc-800/80 pb-6">
				<p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
					Feed / Overview
				</p>
				<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
					Recent Posts
				</h1>
				<p className="text-sm text-zinc-400">
					Explore discussions, ideas, and updates shared across the community.
				</p>
			</div>
			<div>
				<PostList />
			</div>
		</div>
	);
};
