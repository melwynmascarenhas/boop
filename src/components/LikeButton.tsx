import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../utils/supabase";

interface Props {
	postId: string;
}

interface VoteInput {
	post_id: string;
	voteValue: number;
	user_id: string;
}

async function modifyVote(voteObj: VoteInput) {
	if (!voteObj.user_id) {
		throw new Error("You must be logged in to vote");
	}

	//getting vote for current post and userid
	const { data: existingVote, error: getError } = await supabase
		.from("votes")
		.select("*")
		.eq("post_id", voteObj.post_id)
		.eq("user_id", voteObj.user_id)
		.maybeSingle();

	if (getError) {
		throw new Error(getError.message);
	}

	if (existingVote) {
		if (existingVote.vote == voteObj.voteValue) {
			//delete vote
			const { error: deleteError } = await supabase
				.from("votes")
				.delete()
				.eq("post_id", voteObj.post_id)
				.eq("user_id", voteObj.user_id);

			if (deleteError) {
				throw new Error(deleteError.message);
			}

			return "Vote deleted";
		}

		//update the existing vote
		const { data: updateData, error: updateError } = await supabase
			.from("votes")
			.update({ vote: voteObj.voteValue })
			.eq("post_id", voteObj.post_id)
			.eq("user_id", voteObj.user_id);

		if (updateError) {
			throw new Error(updateError.message);
		}

		return updateData;
	} else {
		//insert new vote
		const { data: insertData, error: insertError } = await supabase
			.from("votes")
			.insert({
				post_id: voteObj.post_id,
				vote: voteObj.voteValue,
				user_id: voteObj.user_id,
			});

		if (insertError) {
			throw new Error(insertError.message);
		}

		return insertData;
	}
}

///fetch all the votes for the current post
async function fetchVotes(postId: string) {
	const { data, error } = await supabase
		.from("votes")
		.select("*")
		.eq("post_id", postId);

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

export const LikeButton = ({ postId }: Props) => {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	const {
		data: votes,
		isLoading: fetchLoading,
		isError: isFetchError,
		error: fetchError,
	} = useQuery({
		queryKey: ["votes", postId],
		queryFn: () => fetchVotes(postId),
		refetchInterval: 1000,
	});

	const { mutate } = useMutation({
		mutationFn: modifyVote,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["votes", postId],
			});
		},
	});

	const handleVote = (voteValue: number) => {
		if (!user) {
			alert("You must be logged in to vote");
			return;
		}
		mutate({
			post_id: postId,
			voteValue: voteValue,
			user_id: user.id,
		});
	};

	const likes = votes?.filter((vote) => vote.vote === 1).length;
	const dislikes = votes?.filter((vote) => vote.vote === -1).length;

	//check if the current user has liked or disliked the post
	const userVote = votes?.find((vote) => vote.user_id === user?.id);

	const userHasLiked = userVote?.vote === 1;
	const userHasDisliked = userVote?.vote === -1;

	if (fetchLoading) {
		return <div className="font-mono text-xs text-zinc-500 my-2">Loading reactions...</div>;
	}
	if (isFetchError) {
		return <div className="font-mono text-xs text-red-400 my-2">Error: {fetchError.message}</div>;
	}

	return (
		<div className="flex items-center space-x-3 my-4 font-mono text-xs">
			<button
				onClick={() => handleVote(1)}
				className={`px-3 py-1.5 cursor-pointer rounded-md border transition-colors duration-150 flex items-center space-x-2 ${
					userHasLiked
						? "bg-emerald-950/80 border-emerald-700/80 text-emerald-300 font-semibold"
						: "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/80"
				}`}
			>
				<span>👍</span>
				<span>{likes ?? 0}</span>
			</button>
			<button
				onClick={() => handleVote(-1)}
				className={`px-3 py-1.5 cursor-pointer rounded-md border transition-colors duration-150 flex items-center space-x-2 ${
					userHasDisliked
						? "bg-red-950/80 border-red-800/80 text-red-300 font-semibold"
						: "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/80"
				}`}
			>
				<span>👎</span>
				<span>{dislikes ?? 0}</span>
			</button>
		</div>
	);
};
