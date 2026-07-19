import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { CommentItem } from "./CommentItem";

interface Props {
	postId: string;
}

export interface commentInputType {
	content: string;
	post_id: string;
	parent_comment_id: string | null;
	user_id: string;
	author: string;
}

export interface Comment {
	id: string;
	content: string;
	post_id: string;
	parent_comment_id: string | null;
	user_id: string;
	author: string;
	created_at: string;
}

export interface CommentWithChildren extends Comment {
	children?: CommentWithChildren[];
}

//create function to add comment to supabase
async function addComment(commentInput: commentInputType) {
	const { data, error } = await supabase.from("comments").insert({
		content: commentInput.content,
		post_id: commentInput.post_id,
		parent_comment_id: commentInput.parent_comment_id || null,
		user_id: commentInput.user_id,
		author: commentInput.author,
	});

	if (error) throw new Error(error.message);
	return data;
}

/// CommentSection Component
export const CommentSection = ({ postId }: Props) => {
	const [newCommentText, setNewCommentText] = useState("");

	const { user } = useAuth();

	//call useMutation to add comment to supabase
	const queryClient = useQueryClient();
	const { mutate, isPending, isError } = useMutation({
		mutationFn: addComment,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments", postId] });
		},
	});

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!user) {
			throw new Error("You must be logged in to comment");
		}
		if (!newCommentText) return;

		//call mutate
		mutate({
			content: newCommentText,
			post_id: postId,
			parent_comment_id: null,
			user_id: user.id,
			author: user.user_metadata?.user_name,
		});
		setNewCommentText("");
	}

	//create a fetch function to fetch test comments from supabase
	const fetchComments = async (postId: string): Promise<Comment[]> => {
		const { data, error } = await supabase
			.from("comments")
			.select("*")
			.eq("post_id", postId)
			.order("created_at", { ascending: false });

		if (error) throw new Error(error.message);
		return data;
	};

	//use useQuery to fetch comments from supabase
	const {
		data: comments,
		isLoading: fetchLoading,
		isError: isFetchError,
		error: fetchError,
	} = useQuery<Comment[], Error>({
		queryKey: ["comments", postId],
		queryFn: () => fetchComments(postId),
		refetchInterval: 1000,
	});

	if (fetchLoading) {
		return <div>Loading likes...</div>;
	}
	if (isFetchError) {
		return <div>{fetchError.message}</div>;
	}

	//function to build comments tree with typescript

	const buildCommentsTree = (flatComments: Comment[]): CommentWithChildren[] => {
		//create a map to store comments
		const map = new Map<string, CommentWithChildren>();
		//create an array to store roots
		const roots: CommentWithChildren[] = [];

		//loop through comments and populate the map with comment objects with children property
		flatComments.forEach((comment) => {
			map.set(comment.id, { ...comment, children: [] });
		});

		//loop to identify roots and children
		flatComments.forEach((comment) => {
			const parentId = comment.parent_comment_id;
			if (parentId) {
				//this is a child comment and has to be pushed to its parent's children array
				const parent = map.get(parentId);
				if (parent) {
					if (!parent.children) {
						parent.children = [];
					}
					const child = map.get(comment.id);
					if (child) {
						parent.children.push(child);
					}
				}
			} else {
				// push the parent comment with children populated from map into roots array
				const mappedComment = map.get(comment.id);
				if (mappedComment) {
					roots.push(mappedComment);
				}
			}
		});
		return roots;
	};

	const commentsTree = comments ? buildCommentsTree(comments) : [];

	return (
		<div className="mt-6">
			<h3 className="text-2xl font-semibold mb-4">Comments</h3>
			{/* Create Comment Section */}

			{user ? (
				<form action="" onSubmit={handleSubmit} className="mb-4">
					<textarea
						name="comment"
						id="comment"
						rows={3}
						placeholder="Write your comment"
						value={newCommentText}
						onChange={(e) => setNewCommentText(e.target.value)}
						className="w-full border border-white/10 bg-transparent p-2 rounded"
					/>
					<button
						type="submit"
						disabled={!newCommentText}
						className="mt-2 bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
					>
						{isPending ? "Posting comment..." : "Post Comment"}
					</button>
					{isError && (
						<p className="text-red-500 mt-2">Error posting comment.</p>
					)}
				</form>
			) : (
				<div>login to comment</div>
			)}

			{/* Comment Display Section */}
			<div className="space-y-4">
				{commentsTree.map((comment) => (
					<CommentItem key={comment.id} comment={comment} />
				))}
			</div>
		</div>
	);
};
