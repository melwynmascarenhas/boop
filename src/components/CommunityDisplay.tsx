import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Trash2 } from "lucide-react";
import { supabase } from "../utils/supabase";
import { useAuth } from "../context/AuthContext";
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
	const { user } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: posts, isError: isPostsError, error: postsError, isLoading: isPostsLoading } = useQuery({
		queryKey: ["community-posts", communityId],
		queryFn: () => fetchPostsByCommunity(communityId),
	});

	const { data: community, isLoading: isCommunityLoading } = useQuery({
		queryKey: ["community", communityId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("communities")
				.select("*")
				.eq("id", communityId)
				.single();
			if (error) throw error;
			return data as {
				id: string;
				name: string;
				description?: string;
				user_id?: string;
				creator_id?: string;
			};
		},
	});

	const deleteCommunityMutation = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("communities").delete().eq("id", communityId);
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["communities"] });
			navigate("/communities");
		},
	});

	const isCreator = Boolean(
		user &&
			community &&
			(community.user_id === user.id || community.creator_id === user.id)
	);

	const handleDeleteCommunity = () => {
		if (window.confirm("Are you sure you want to delete this community?")) {
			deleteCommunityMutation.mutate();
		}
	};

	if (isPostsLoading || isCommunityLoading) {
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
	if (isPostsError) {
		return (
			<div className="p-4 rounded-md border border-red-900/50 bg-red-950/20 text-red-400 font-mono text-xs">
				Failed to load community posts: {postsError.message}
			</div>
		);
	}

	const communityName = community?.name || (posts && posts.length > 0 ? posts[0].communities?.name : "Community");

	return (
		<div className="space-y-6">
			{/* Header: Community Name on Left, Delete Button on Right */}
			<div className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
				<div>
					<h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
						{communityName}
					</h1>
					{community?.description && (
						<p className="text-xs font-mono text-zinc-400 mt-1">{community.description}</p>
					)}
				</div>

				{isCreator && (
					<button
						onClick={handleDeleteCommunity}
						disabled={deleteCommunityMutation.isPending}
						className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
						title="Delete this community"
					>
						<Trash2 className="w-3.5 h-3.5" />
						<span>
							{deleteCommunityMutation.isPending ? "Deleting..." : "Delete this community"}
						</span>
					</button>
				)}
			</div>

			{posts && posts.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					{posts.map((post) => (
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
