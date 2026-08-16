import { useParams } from "react-router";
import { CommunityDisplay } from "../components/CommunityDisplay";

export const CommunityPage = () => {
	const { id } = useParams<{ id: string }>();
	if (!id) {
		return <div className="pt-10 text-center font-mono text-zinc-500">Community not found.</div>;
	}
	return (
		<div className="pt-6">
			<CommunityDisplay communityId={id} />
		</div>
	);
};
