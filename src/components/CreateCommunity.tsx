import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router";

interface communityInputType {
	name: string;
	description: string;
}

//create function to add reply to supabase
async function createCommunity(communityInput: communityInputType) {
	const { data, error } = await supabase.from("communities").insert({
		name: communityInput.name,
		description: communityInput.description,
	});

	if (error) throw new Error(error.message);
	return data;
}

export const CreateCommunity = () => {
	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	//call useMutation to add reply to supabase
	const { mutate, isPending, isError } = useMutation({
		mutationFn: createCommunity,
		onSuccess: () => {
			setName("");
			setDescription("");
			navigate("/communities");
			queryClient.invalidateQueries({
				queryKey: ["communities"],
			});
		},
	});

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		mutate({
			name,
			description,
		});
	}

	return (
		<form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-zinc-950/80 border border-zinc-800 rounded-lg p-6 sm:p-8 space-y-5 shadow-sm">
			<div>
				<label htmlFor="name" className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-medium mb-1.5 block">
					Community Name
				</label>
				<input
					type="text"
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="e.g. typescript, webdev, design"
					className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-md p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
					required
				/>
			</div>
			<div>
				<label htmlFor="description" className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-medium mb-1.5 block">
					Description
				</label>
				<textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Briefly describe what this community is about..."
					className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-md p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
					rows={4}
				/>
			</div>
			<div className="pt-2">
				<button
					type="submit"
					disabled={isPending}
					className="w-full sm:w-auto bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded-md hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
				>
					{isPending ? "Creating..." : "Create Community"}
				</button>
			</div>
			{isError && <p className="text-red-400 font-mono text-xs pt-2">Error creating community.</p>}
		</form>
	);
};
