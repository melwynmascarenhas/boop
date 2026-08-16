import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { PostItem } from "./PostItem";
import type { Post } from "./PostList";

interface Props {
	communityId: string;
}

interface PostWithCommunity extends Post {
	communities: {
		name: string;
	};
}

const fetchPostsByCommunity = async (
	communityId: string,
): Promise<PostWithCommunity[]> => {
	const { data, error } = await supabase
		.from("posts")
		.select("*, communities(name)")
		.eq("community_id", communityId)
		.order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data as PostWithCommunity[];
};

export const CommunityDisplay = ({ communityId }: Props) => {
	const { data, isError, error, isLoading } = useQuery({
		queryKey: ["community-posts", communityId],
		queryFn: () => fetchPostsByCommunity(communityId),
	});

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{[1, 2, 3].map((i) => (
					<div key={i} className="h-64 rounded-lg bg-zinc-950/80 border border-zinc-800 p-5 space-y-4 animate-pulse">
						<div className="h-4 w-3/4 bg-zinc-900 rounded"></div>
						<div className="h-28 bg-zinc-900/60 rounded"></div>
					</div>
				))}
			</div>
		);
	}
	if (isError) {
		return (
			<div className="p-4 rounded-md border border-red-900/50 bg-red-950/20 text-red-400 font-mono text-xs">
				Failed to load community posts: {error.message}
			</div>
		);
	}

	const communityName = data && data.length > 0 ? data[0].communities?.name : "Community";

	return (
		<div className="space-y-6">
			<div className="space-y-2 border-b border-zinc-800/80 pb-6">
				<p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
					Community / Feed
				</p>
				<h1 className="text-3xl font-semibold tracking-tight text-white">
					{communityName}
				</h1>
			</div>

			{data && data.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					{data.map((post) => (
						<PostItem key={post.id} post={post} />
					))}
				</div>
			) : (
				<div className="p-12 text-center border border-dashed border-zinc-800 rounded-lg bg-zinc-950/40">
					<p className="font-mono text-xs text-zinc-500 uppercase tracking-wider">No posts in this community yet.</p>
				</div>
			)}
		</div>
	);
};
