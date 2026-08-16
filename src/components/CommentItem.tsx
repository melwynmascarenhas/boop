import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import type { commentInputType, CommentWithChildren } from "./CommentSection";

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

interface CommentItemProps {
	comment: CommentWithChildren;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
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
		<div className="pl-4 border-l border-zinc-800 space-y-2">
			{/* Display Comment content */}
			<div className="space-y-1">
				{/* Display Comment Author and time */}
				<div className="flex items-center space-x-2 font-mono text-xs">
					<span className="font-semibold text-zinc-200">
						{comment.author || "Anonymous"}
					</span>
					<span className="text-zinc-600">•</span>
					<span className="text-[10px] text-zinc-500 uppercase tracking-wider">
						{new Date(comment.created_at).toLocaleString()}
					</span>
				</div>
				{/* Display Comment */}
				<p className="text-sm text-zinc-300 leading-normal">{comment.content}</p>
				<div className="flex items-center space-x-3 pt-0.5 font-mono text-xs">
					<button
						onClick={toggleReply}
						className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
					>
						{showReply ? "Cancel" : "Reply"}
					</button>
				</div>
			</div>

			{/* Reply Input */}
			{showReply && user && (
				<form onSubmit={handleReplySubmit} className="mt-2 space-y-2">
					<textarea
						name="reply"
						rows={2}
						placeholder="Write a reply..."
						value={replyText}
						onChange={(e) => setReplyText(e.target.value)}
						className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-md p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
					/>
					<div className="flex items-center justify-between">
						{isError ? (
							<p className="text-red-400 font-mono text-xs">Error posting reply.</p>
						) : <div />}
						<button
							type="submit"
							disabled={!replyText || isPending}
							className="bg-white text-black font-mono text-xs uppercase tracking-wider font-medium px-3 py-1 rounded-md hover:bg-zinc-200 transition-colors disabled:opacity-40 cursor-pointer"
						>
							{isPending ? "Replying..." : "Submit Reply"}
						</button>
					</div>
				</form>
			)}

			{comment.children && comment.children.length > 0 && (
				<div className="mt-2 space-y-2">
					<button
						onClick={() => setIsCollapsed((prev) => !prev)}
						className="flex items-center space-x-1.5 font-mono text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
						title={isCollapsed ? "Show Replies" : "Hide Replies"}
					>
						<span className="uppercase tracking-wider">{isCollapsed ? "Show replies" : "Hide replies"} ({comment.children.length})</span>
						{isCollapsed ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								className="w-3 h-3"
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
								className="w-3 h-3"
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
						<div className="space-y-3 pt-1">
							{comment.children?.map((child: CommentWithChildren, key: number) => (
								<CommentItem key={key} comment={child} />
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
