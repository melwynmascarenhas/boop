import { CommunityList } from "../components/CommunityList";

export const CommunitiesPage = () => {
	return (
		<div className="pt-6 space-y-6">
			<div className="space-y-2 border-b border-zinc-800/80 pb-6 text-center">
				<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
					Communities
				</h1>
				<p className="text-sm text-zinc-400">
					Discover topic spaces and join conversations across Boop.
				</p>
			</div>
			<CommunityList />
		</div>
	);
};
