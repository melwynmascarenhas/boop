import { useParams } from "react-router";
import { PostDetail } from "../components/PostDetail";

export const PostPage = () => {
	const { id } = useParams<{ id: string }>();

	if (!id) {
		return <div className="pt-10 text-center font-mono text-zinc-500">Post not found.</div>;
	}

	return (
		<div className="pt-6 max-w-3xl mx-auto space-y-6">
			<PostDetail postId={id} />
		</div>
	);
};
