import { Link } from "react-router";
import type { Post } from "./PostList";

interface Props {
	post: Post;
}

export const PostItem = ({ post }: Props) => {
	return (
		<Link to={`/post/${post.id}`} className="h-full block group">
			<div className="w-full h-full bg-zinc-950/80 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between hover:border-zinc-700 hover:bg-zinc-900/50 transition-all duration-200 shadow-xs">
				{/* Image Banner if available */}
				{post.image_url && (
					<div className=" overflow-hidden rounded-md border border-zinc-800/80 bg-zinc-900 aspect-video w-full">
						<img
							src={post.image_url}
							alt={post.title}
							className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
						/>
					</div>
				)}

				{/* Header: Title */}
				<div className="mt-3">
					<h3 className="text-base font-semibold text-white tracking-tight leading-snug group-hover:text-zinc-200 transition-colors line-clamp-2 min-h-[2lh]">
						{post.title}
					</h3>
				</div>

				{/* Footer stats */}
				<div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between font-mono text-xs text-zinc-400">
					<div className="flex items-center space-x-4">
						<span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
							<span className="text-red-400">♥</span> {post.like_count ?? 0}
						</span>
						<span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
							<span className="text-zinc-400">💬</span>{" "}
							{post.comment_count ?? 0}
						</span>
					</div>
					<span className="text-[10px] uppercase tracking-wider text-zinc-500 group-hover:text-zinc-400 transition-colors">
						View Post →
					</span>
				</div>
			</div>
		</Link>
	);
};
