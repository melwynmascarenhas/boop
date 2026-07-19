import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, type ChangeEvent } from "react";
import React from "react";
import { supabase } from "../utils/supabase";
import { useAuth } from "../context/AuthContext";
import { fetchCommunities } from "../utils/communities";
import { useNavigate } from "react-router";

interface PostInput {
	title: string;
	content: string;
	imageFile: File | null;
	community_id: string | null;
	avatar_url: string | null;
}

async function createPost(post: PostInput) {
	const filePath = `${post.title}-${Date.now()}-${post.imageFile.name}`;
	const { error: uploadError } = await supabase.storage
		.from("post-images")
		.upload(filePath, post.imageFile);

	if (uploadError) {
		throw uploadError;
	}

	//get public url of the uploaded image

	const { data: publicUrlData } = supabase.storage
		.from("post-images")
		.getPublicUrl(filePath);

	const { data, error: postError } = await supabase.from("posts").insert({
		title: post.title,
		content: post.content,
		community_id: post.community_id,
		image_url: publicUrlData.publicUrl,
		avatar_url: post.avatar_url,
	});

	if (postError) {
		throw Error("Failed to create post");
	}

	return data;
}

export function CreatePost() {
	const { user } = useAuth();

	const avatar_url = user?.user_metadata.avatar_url;

	const navigate = useNavigate();

	const [title, setTitle] = useState<string>("");
	const [content, setContent] = useState<string>("");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [communityId, setCommunityId] = useState<string | null>(null);

	const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		setCommunityId(value ? String(value) : null);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setImageFile(event.target.files[0]);
		}
	};

	const {
		mutate,
		isPending,
		isError,
		error: mutationError,
	} = useMutation({
		mutationFn: createPost,
		onSuccess: () => {
			navigate("/");
		},
	});

	const { data: communities } = useQuery({
		queryKey: ["communities"],
		queryFn: fetchCommunities,
	});

	const handleSubmit = (event: React.SyntheticEvent) => {
		event.preventDefault();
		if (!title || !content || !imageFile) {
			alert("Please fill in all the fields");
			return;
		}
		mutate({
			title: title,
			content: content,
			community_id: communityId,
			avatar_url: avatar_url,
			imageFile: imageFile,
		});
	};

	return (
		<form
			action=""
			onSubmit={handleSubmit}
			className="max-w-2xl mx-auto space-y-4"
		>
			<div>
				<label htmlFor="title" className="block mb-2 font-medium">
					Title
				</label>
				<input
					type="text"
					id="title"
					name="title"
					value={title}
					required
					placeholder="Enter your post title here..."
					onChange={(e) => setTitle(e.target.value)}
					className="w-full border border-white/10 bg-transparent p-2 rounded"
				/>
			</div>
			<div>
				<label htmlFor="content" className="block mb-2 font-medium">
					Content
				</label>
				<textarea
					id="content"
					name="content"
					value={content}
					rows={5}
					required
					placeholder="Enter your post content here..."
					onChange={(e) => setContent(e.target.value)}
					className="w-full border border-white/10 bg-transparent p-2 rounded"
				></textarea>
			</div>

			<div>
				<label className="block mb-2 font-medium"> Select Community</label>
				<select
					id="community"
					onChange={handleCommunityChange}
					className="w-full border border-white/10 bg-transparent p-2 rounded"
				>
					<option value={""}> -- Choose a Community -- </option>
					{communities?.map((community, key) => (
						<option key={key} value={community.id}>
							{community.name}
						</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor="image" className="block mb-2 font-medium">
					Image
				</label>
				<input
					id="image"
					name="image"
					required
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					className="w-full text-gray-200"
				></input>
			</div>
			<button
				type="submit"
				className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
			>
				{isPending ? "Creating..." : "Create Post"}
			</button>
			{isError && <p className="text-red-500"> {mutationError.message}</p>}
		</form>
	);
}
