import { LucideMenu, LucideX } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);

	const { user, signInWithGithub, signOut } = useAuth();

	const displayName = user?.user_metadata.name || user?.user_metadata.email;

	return (
		<nav className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-zinc-800">
			<div className="max-w-6xl mx-auto px-4 sm:px-6">
				<div className="flex justify-between items-center h-14">
					<Link to="/" className="flex items-center gap-2 group">
						<span className="font-mono text-base font-bold text-white tracking-wider uppercase">
							Boop
						</span>
					</Link>

					{/* Desktop Links */}
					<div className="hidden md:flex items-center space-x-1 font-mono text-xs uppercase tracking-wider">
						<Link
							to="/"
							className="px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-md transition-colors"
						>
							Home
						</Link>
						<Link
							to="/communities"
							className="px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-md transition-colors"
						>
							Communities
						</Link>
						{user && (
							<>
								<Link
									to="/create"
									className="px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-md transition-colors"
								>
									Create Post
								</Link>
								<Link
									to="/community/create"
									className="px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-md transition-colors"
								>
									Create Community
								</Link>
							</>
						)}
					</div>

					{/* Desktop Auth */}
					<div className="hidden md:flex items-center">
						{user ? (
							<div className="flex items-center space-x-3">
								{user.user_metadata?.avatar_url && (
									<img
										src={user.user_metadata.avatar_url}
										alt="User Avatar"
										className="w-7 h-7 rounded-full border border-zinc-800 object-cover"
									/>
								)}
								<span className="text-xs font-mono text-zinc-300 max-w-35 truncate">
									{displayName}
								</span>
								<button
									onClick={signOut}
									className="px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 font-mono text-xs uppercase tracking-wider transition-colors"
								>
									Sign Out
								</button>
							</div>
						) : (
							<button
								onClick={signInWithGithub}
								className="px-4 py-1.5 rounded-md bg-white text-black font-mono text-xs uppercase tracking-wider font-medium hover:bg-zinc-200 transition-colors shadow-xs"
							>
								Sign in with GitHub
							</button>
						)}
					</div>

					{/* Menu button */}
					<div className="md:hidden">
						<button
							onClick={() => setMenuOpen(!menuOpen)}
							className="p-1.5 text-zinc-400 hover:text-white focus:outline-none"
							aria-label="Toggle menu"
						>
							{menuOpen ? <LucideX size={20} /> : <LucideMenu size={20} />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{menuOpen && (
				<div className="md:hidden border-b border-zinc-800 bg-zinc-950/95 px-4 pt-2 pb-4 space-y-2 font-mono text-xs uppercase tracking-wider">
					<Link
						to="/"
						onClick={() => setMenuOpen(false)}
						className="block px-3 py-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-900"
					>
						Home
					</Link>
					<Link
						to="/communities"
						onClick={() => setMenuOpen(false)}
						className="block px-3 py-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-900"
					>
						Communities
					</Link>
					{user && (
						<>
							<Link
								to="/create"
								onClick={() => setMenuOpen(false)}
								className="block px-3 py-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-900"
							>
								Create Post
							</Link>
							<Link
								to="/community/create"
								onClick={() => setMenuOpen(false)}
								className="block px-3 py-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-900"
							>
								Create Community
							</Link>
						</>
					)}
					<div className="pt-2 border-t border-zinc-800/80">
						{user ? (
							<div className="flex items-center justify-between pt-1">
								<span className="text-zinc-400 text-xs truncate max-w-45">
									{displayName}
								</span>
								<button
									onClick={signOut}
									className="px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs uppercase tracking-wider"
								>
									Sign Out
								</button>
							</div>
						) : (
							<button
								onClick={signInWithGithub}
								className="w-full py-2 rounded-md bg-white text-black font-mono text-xs uppercase tracking-wider font-medium hover:bg-zinc-200 transition-colors"
							>
								Sign in with GitHub
							</button>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}
