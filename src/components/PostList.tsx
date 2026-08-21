import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { PostItem } from "./PostItem";

export interface Post {
	id: string;
	title: string;
	content: string;
	created_at: string;
	image_url: string;
	user_id?: string;
	community_id?: string | null;
	avatar_url?: string;
	author_name?: string;
	author_email?: string;
	like_count?: number;
	comment_count?: number;
	communities?: {
		id?: string;
		name?: string;
	} | null;
}

const fetchPosts = async (): Promise<Post[]> => {
	const { data, error } = await supabase.rpc("get_posts_with_counts");
	// .from("posts")
	// .select("*")
	// .order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	console.log(data);
	return data as Post[];
};

export const PostList = () => {
	const { data, isError, error, isLoading } = useQuery({
		queryKey: ["posts"],
		queryFn: fetchPosts,
	});

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<div key={i} className="h-64 rounded-lg bg-zinc-950/80 border border-zinc-800 p-5 space-y-4 animate-pulse">
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800"></div>
							<div className="h-4 w-3/4 bg-zinc-900 rounded"></div>
						</div>
						<div className="h-28 bg-zinc-900/60 rounded"></div>
						<div className="h-4 w-1/2 bg-zinc-900 rounded pt-2"></div>
					</div>
				))}
			</div>
		);
	}
	if (isError) {
		return (
			<div className="p-4 rounded-md border border-red-900/50 bg-red-950/20 text-red-400 font-mono text-xs">
				Failed to load posts: {error.message}
			</div>
		);
	}

	if (!data || data.length === 0) {
		return (
			<div className="p-12 text-center border border-dashed border-zinc-800 rounded-lg bg-zinc-950/40">
				<p className="font-mono text-xs text-zinc-500 uppercase tracking-wider">No posts found</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
			{data.map((post) => (
				<PostItem key={post.id} post={post} />
			))}
		</div>
	);
};
