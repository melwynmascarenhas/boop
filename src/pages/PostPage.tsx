import { useParams } from "react-router";
import { PostDetail } from "../components/PostDetail";

export const PostPage = () => {
	const { id } = useParams<{ id: string }>();

	return (
		<div className="pt-10 max-w-2xl mx-auto space-y-4">
			<PostDetail postId={id} />
		</div>
	);
};
