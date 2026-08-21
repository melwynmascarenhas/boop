import { CreateCommunity } from "../components/CreateCommunity";

export const CreateCommunityPage = () => {
	return (
		<div className="pt-6 space-y-6">
			<div className="space-y-2 border-b border-zinc-800/80 pb-6 text-center">
				<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
					Create New Community
				</h1>
				<p className="text-sm text-zinc-400">
					Start a new dedicated space for your favorite topic.
				</p>
			</div>
			<CreateCommunity />
		</div>
	);
};
