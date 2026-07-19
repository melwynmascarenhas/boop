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
		return <div>Loading posts...</div>;
	}
	if (isError) {
		return <div>{error.message}</div>;
	}

	return (
		<div>
			<h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
				{data && data[0].communities.name} Community Posts
			</h2>

			{data && data.length > 0 ? (
				<div className="flex flex-wrap gap-6 justify-center">
					{data.map((post) => (
						<PostItem key={post.id} post={post} />
					))}
				</div>
			) : (
				<p className="text-center text-gray-400">
					No posts in this community yet.
				</p>
			)}
		</div>
	);
};
