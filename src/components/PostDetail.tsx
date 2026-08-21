import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { Trash2 } from "lucide-react";
import { supabase } from "../utils/supabase";
import type { Post } from "./PostList";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { useAuth } from "../context/AuthContext";

const fetchPostById = async (postId: string): Promise<Post> => {
	const { data, error } = await supabase
		.from("posts")
		.select("*, communities(id, name)")
		.eq("id", postId)
		.single();

	if (error) throw new Error(error.message);
	return data as Post;
};

export const PostDetail = ({ postId }: { postId: string }) => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data, isError, error, isLoading } = useQuery({
		queryKey: ["post", postId],
		queryFn: () => fetchPostById(postId),
	});

	const deleteMutation = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("posts").delete().eq("id", postId);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			navigate("/");
		},
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

	const authorDisplay = data?.author_name || data?.author_email || "Anonymous";
	const isAuthor = Boolean(
		user && (data?.author_email === user.email || data?.user_id === user.id),
	);

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this post?")) {
			deleteMutation.mutate();
		}
	};

	return (
		<div className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm">
			{/* Community Badge */}
			{data?.communities?.name && data.community_id && (
				<div>
					<Link
						to={`/community/${data.community_id}`}
						className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 font-mono text-xs transition-colors"
					>
						c/{data.communities.name}
					</Link>
				</div>
			)}

			{data?.image_url && (
				<div className="overflow-hidden rounded-md border border-zinc-800/80 bg-zinc-900 aspect-video w-full">
					<img
						src={data.image_url}
						alt={data?.title}
						className="w-full h-full object-cover"
					/>
				</div>
			)}
			<h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-tight">
				{data?.title}
			</h1>

			{/* Author Info Bar & Separator Line */}
			<div className="flex items-center justify-between border-t border-b border-zinc-800/80 p-4">
				<div className="flex items-center space-x-3">
					{data?.avatar_url ? (
						<img
							src={data.avatar_url}
							alt="Author Avatar"
							className="w-9 h-9 rounded-full border border-zinc-800 object-cover shrink-0"
						/>
					) : (
						<div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-xs text-zinc-400 shrink-0">
							{authorDisplay.charAt(0).toUpperCase()}
						</div>
					)}
					<span className="text-xs font-mono font-medium text-zinc-200">
						{authorDisplay}
					</span>
				</div>

				<div className="flex items-center space-x-4">
					<span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
						{new Date(data!.created_at).toLocaleDateString()}
					</span>
				</div>
			</div>

			<div className="text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
				{data?.content}
			</div>

			<div className="pt-4 border-t border-zinc-800/80 space-y-6">
				<LikeButton postId={postId} />
				<CommentSection postId={postId} />

				{isAuthor && (
					<div className="pt-4 border-t border-zinc-800/60 flex justify-center">
						<button
							onClick={handleDelete}
							disabled={deleteMutation.isPending}
							className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
							title="Delete this post"
						>
							<Trash2 className="w-3.5 h-3.5" />
							<span>
								{deleteMutation.isPending ? "Removing..." : "Remove this post"}
							</span>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
