import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import type { Post } from "./PostList";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

const fetchPostById = async (postId: string): Promise<Post> => {
	const { data, error } = await supabase
		.from("posts")
		.select("*")
		.eq("id", postId)
		.single();

	if (error) throw new Error(error.message);
	return data as Post;
};

export const PostDetail = ({ postId }: { postId: string }) => {
	const { data, isError, error, isLoading } = useQuery({
		queryKey: ["post", postId],
		queryFn: () => fetchPostById(postId),
	});

	if (isLoading) {
		return (
			<div className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-8 space-y-4 animate-pulse">
				<div className="h-4 w-24 bg-zinc-900 rounded"></div>
				<div className="h-8 w-3/4 bg-zinc-900 rounded"></div>
				<div className="h-64 bg-zinc-900/60 rounded"></div>
			</div>
		);
	}
	if (isError) {
		return (
			<div className="p-4 rounded-md border border-red-900/50 bg-red-950/20 text-red-400 font-mono text-xs">
				Failed to load post: {error.message}
			</div>
		);
	}

	return (
		<div className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm">
			<div className="space-y-3">
				<div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-500 border-b border-zinc-800/80 pb-3">
					<span>Post Details</span>
					<span>{new Date(data!.created_at).toLocaleDateString()}</span>
				</div>
				<h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-tight">
					{data?.title}
				</h1>
			</div>

			{data?.image_url && (
				<div className="overflow-hidden rounded-md border border-zinc-800/80 bg-zinc-900 aspect-video w-full">
					<img
						src={data.image_url}
						alt={data?.title}
						className="w-full h-full object-cover"
					/>
				</div>
			)}

			<div className="text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
				{data?.content}
			</div>

			<div className="pt-4 border-t border-zinc-800/80 space-y-6">
				<LikeButton postId={postId} />
				<CommentSection postId={postId} />
			</div>
		</div>
	);
};
