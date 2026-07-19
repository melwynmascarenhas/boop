import { useParams } from "react-router";
import { CommunityDisplay } from "../components/CommunityDisplay";

export const CommunityPage = () => {
	const { id } = useParams<{ id: string }>();
	if (!id) {
		return <div className="pt-20 text-center">Community not found.</div>;
	}
	return (
		<div className="pt-20">
			<CommunityDisplay communityId={id} />
		</div>
	);
};
