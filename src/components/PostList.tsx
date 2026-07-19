import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { PostItem } from "./PostItem";

export interface Post {
	id: string;
	title: string;
	content: string;
	created_at: string;
	image_url: string;
	avatar_url?: string;
	like_count?: number;
	comment_count?: number;
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
		return <div>Loading posts...</div>;
	}
	if (isError) {
		return <div>{error.message}</div>;
	}

	return (
		<div className="flex flex-wrap gap-6 justify-center">
			{data?.map((post) => (
				<PostItem key={post.id} post={post} />
			))}
		</div>
	);
};
