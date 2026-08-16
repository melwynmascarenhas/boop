import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { fetchCommunities } from "../utils/communities";

export const CommunityList = () => {
	const { data, isError, error, isLoading } = useQuery({
		queryKey: ["communities"],
		queryFn: fetchCommunities,
	});

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="h-32 rounded-lg bg-zinc-950/80 border border-zinc-800 p-5 space-y-3 animate-pulse">
						<div className="h-6 w-1/2 bg-zinc-900 rounded"></div>
						<div className="h-4 w-3/4 bg-zinc-900/60 rounded"></div>
					</div>
				))}
			</div>
		);
	}
	if (isError) {
		return (
			<div className="p-4 rounded-md border border-red-900/50 bg-red-950/20 text-red-400 font-mono text-xs">
				Failed to load communities: {error.message}
			</div>
		);
	}

	if (!data || data.length === 0) {
		return (
			<div className="p-12 text-center border border-dashed border-zinc-800 rounded-lg bg-zinc-950/40">
				<p className="font-mono text-xs text-zinc-500 uppercase tracking-wider">No communities found</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{data.map((community) => (
				<div
					key={community.id}
					className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all shadow-xs group flex flex-col justify-between"
				>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Link
								to={`/community/${community.id}`}
								className="text-lg font-semibold text-white tracking-tight group-hover:text-zinc-200 transition-colors"
							>
								{community.name}
							</Link>
							<span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
								Community
							</span>
						</div>
						<p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">{community.description}</p>
					</div>
					<div className="mt-4 pt-3 border-t border-zinc-800/60 flex justify-end">
						<Link
							to={`/community/${community.id}`}
							className="font-mono text-xs text-zinc-400 group-hover:text-white transition-colors uppercase tracking-wider"
						>
							Enter Community →
						</Link>
					</div>
				</div>
			))}
		</div>
	);
};
