import { Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import Navbar from "./components/Navbar";
import { CreatePostPage } from "./pages/CreatePostPage";
import { PostPage } from "./pages/PostPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CreateCommunityPage } from "./pages/CreateCommunityPage";
import { CommunityPage } from "./pages/CommunityPage";

function App() {
	return (
		<div className="min-h-screen bg-black text-zinc-100 relative">
			<div className="fixed inset-0 bg-grid opacity-50 pointer-events-none z-0" />
			<Navbar />
			<main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/create" element={<CreatePostPage />} />
					<Route path="/post/:id" element={<PostPage />} />
					<Route path="/community/create" element={<CreateCommunityPage />} />
					<Route path="/communities" element={<CommunitiesPage />} />
					<Route path="/community/:id" element={<CommunityPage />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
