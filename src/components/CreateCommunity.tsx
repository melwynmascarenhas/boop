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
		<form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
			<div>
				<label htmlFor="name" className="block mb-2 font-medium">
					Community Name
				</label>
				<input
					type="text"
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full border border-white/10 bg-transparent p-2 rounded"
					required
				/>
			</div>
			<div>
				<label htmlFor="description" className="block mb-2 font-medium">
					Description
				</label>
				<textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="w-full border border-white/10 bg-transparent p-2 rounded"
					rows={3}
				/>
			</div>
			<button
				type="submit"
				className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
			>
				{isPending ? "Creating..." : "Create Community"}
			</button>
			{isError && <p className="text-red-500">Error creating community.</p>}
		</form>
	);
};
