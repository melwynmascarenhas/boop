import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import type { commentInputType } from "./CommentSection";

//create function to add reply to supabase
async function addReply(replyInput: commentInputType) {
	const { data, error } = await supabase.from("comments").insert({
		content: replyInput.content,
		post_id: replyInput.post_id,
		parent_comment_id: replyInput.parent_comment_id,
		user_id: replyInput.user_id,
		author: replyInput.author,
	});

	if (error) throw new Error(error.message);
	return data;
}

export const CommentItem = ({ comment }) => {
	const { user } = useAuth();

	const [showReply, setShowReply] = useState(false);
	const [replyText, setReplyText] = useState("");
	const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
	const queryClient = useQueryClient();

	//call useMutation to add reply to supabase
	const { mutate, isPending, isError } = useMutation({
		mutationFn: addReply,
		onSuccess: () => {
			setReplyText("");
			setIsCollapsed(false);
			setShowReply(false);
			queryClient.invalidateQueries({
				queryKey: ["comments", comment.post_id],
			});
		},
	});

	async function handleReplySubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!user) {
			throw new Error("You must be logged in to comment");
		}
		if (!replyText) return;

		//call mutate
		mutate({
			content: replyText,
			post_id: comment.post_id,
			parent_comment_id: comment.id,
			user_id: user.id,
			author: user.user_metadata?.user_name,
		});
	}

	function toggleReply() {
		setShowReply(!showReply);
	}
	return (
		<div className="pl-4 border-l border-white/10">
			{/* Display Comment content */}
			<div className="mb-2">
				{/* Display Comment Author and time */}
				<div className="flex items-center space-x-2">
					<span className="text-sm font-bold text-blue-400">
						{comment.author}
					</span>
					<span className="text-xs text-gray-500">
						{new Date(comment.created_at).toLocaleString()}
					</span>
				</div>
				{/* Display Comment */}
				<p className="text-gray-300">{comment.content}</p>
				<button onClick={toggleReply} className="text-blue-500 text-sm mt-1">
					{showReply ? "Cancel" : "Reply"}
				</button>
			</div>

			{/* Reply Input */}
			{showReply && user && (
				<form onSubmit={handleReplySubmit} className="mb-2">
					<textarea
						name="reply"
						rows={2}
						placeholder="Write your reply"
						value={replyText}
						onChange={(e) => setReplyText(e.target.value)}
						className="w-full border border-white/10 bg-transparent p-2 rounded"
					/>
					<button
						type="submit"
						disabled={!replyText}
						className="mt-1 bg-blue-500 text-white px-3 py-1 rounded"
					>
						{isPending ? "Replying..." : "Reply"}
					</button>
					{isError && (
						<p className="text-red-500 mt-2">Error replying to the comment.</p>
					)}
				</form>
			)}

			{comment.children && comment.children.length > 0 && (
				<div>
					<button
						onClick={() => setIsCollapsed((prev) => !prev)}
						title={isCollapsed ? "Hide Replies" : "Show Replies"}
					>
						{isCollapsed ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								className="w-4 h-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								className="w-4 h-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M5 15l7-7 7 7"
								/>
							</svg>
						)}
					</button>

					{!isCollapsed && (
						<div className="space-y-2">
							{comment.children.map((child, key) => (
								<CommentItem key={key} comment={child} />
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
