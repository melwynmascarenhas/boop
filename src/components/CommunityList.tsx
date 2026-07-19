import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { fetchCommunities } from "../utils/communities";

export const CommunityList = () => {
	const { data, isError, error, isLoading } = useQuery({
		queryKey: ["communities"],
		queryFn: fetchCommunities,
	});

	if (isLoading) {
		return <div>Loading communities...</div>;
	}
	if (isError) {
		return <div>{error.message}</div>;
	}

	return (
		<div className="max-w-5xl mx-auto space-y-4">
			{data?.map((community) => (
				<div
					key={community.id}
					className="border border-white/10 p-4 rounded hover:-translate-y-1 transition transform"
				>
					<Link
						to={`/community/${community.id}`}
						className="text-2xl font-bold text-purple-500 hover:underline"
					>
						{community.name}
					</Link>
					<p className="text-gray-400 mt-2">{community.description}</p>
				</div>
			))}
		</div>
	);
};
