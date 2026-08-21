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
	user_id: string;
	avatar_url: string | null;
	author_name: string | null;
	author_email: string | null;
}

async function createPost(post: PostInput) {
	if (!post.imageFile) {
		throw new Error("Image file is required");
	}
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
		user_id: post.user_id,
		image_url: publicUrlData.publicUrl,
		avatar_url: post.avatar_url,
		author_name: post.author_name,
		author_email: post.author_email,
	});

	if (postError) {
		throw Error("Failed to create post");
	}

	return data;
}

export function CreatePost() {
	const { user } = useAuth();
	console.log(user);
	const avatar_url = user?.user_metadata?.avatar_url || null;
	const author_name =
		user?.user_metadata?.name || user?.user_metadata?.email || null;
	const author_email = user?.email || null;

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
		if (!user) {
			alert("You must be logged in to create a post");
			return;
		}
		if (!title || !content || !imageFile) {
			alert("Please fill in all the fields");
			return;
		}
		mutate({
			title: title,
			content: content,
			community_id: communityId,
			user_id: user.id,
			avatar_url: avatar_url,
			author_name: author_name,
			author_email: author_email,
			imageFile: imageFile,
		});
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-2xl mx-auto bg-zinc-950/80 border border-zinc-800 rounded-lg p-6 sm:p-8 space-y-5 shadow-sm"
		>
			<div>
				<label
					htmlFor="title"
					className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-medium mb-1.5 block"
				>
					Title
				</label>
				<input
					type="text"
					id="title"
					name="title"
					value={title}
					required
					placeholder="Enter your post title..."
					onChange={(e) => setTitle(e.target.value)}
					className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-md p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
				/>
			</div>
			<div>
				<label
					htmlFor="content"
					className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-medium mb-1.5 block"
				>
					Content
				</label>
				<textarea
					id="content"
					name="content"
					value={content}
					rows={5}
					required
					placeholder="Enter your post content..."
					onChange={(e) => setContent(e.target.value)}
					className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-md p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
				></textarea>
			</div>

			<div>
				<label className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-medium mb-1.5 block">
					{" "}
					Select Community
				</label>
				<select
					id="community"
					onChange={handleCommunityChange}
					className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-md p-3 text-sm text-zinc-100 focus:outline-none transition-colors"
				>
					<option value="" className="bg-zinc-900 text-zinc-400">
						{" "}
						-- Choose a Community --{" "}
					</option>
					{communities?.map((community, key) => (
						<option
							key={key}
							value={community.id}
							className="bg-zinc-900 text-zinc-100"
						>
							{community.name}
						</option>
					))}
				</select>
			</div>

			<div>
				<label
					htmlFor="image"
					className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-medium mb-1.5 block"
				>
					Banner Image
				</label>
				<input
					id="image"
					name="image"
					required
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					className="w-full text-xs font-mono text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-zinc-800 file:bg-zinc-900 file:text-zinc-300 file:font-mono file:text-xs file:uppercase hover:file:bg-zinc-800 cursor-pointer"
				></input>
			</div>

			<div className="pt-2">
				<button
					type="submit"
					disabled={isPending}
					className="w-full sm:w-auto bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded-md hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
				>
					{isPending ? "Creating..." : "Create Post"}
				</button>
			</div>
			{isError && (
				<p className="text-red-400 font-mono text-xs pt-2">
					{" "}
					{mutationError.message}
				</p>
			)}
		</form>
	);
}
