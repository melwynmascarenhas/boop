import { Outlet } from "react-router";
import Navbar from "./components/Navbar";

export default function App() {
	return (
		<div className="min-h-screen bg-black text-zinc-100 relative">
			<div className="fixed inset-0 bg-grid opacity-50 pointer-events-none z-0" />
			<Navbar />
			<main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12">
				<Outlet />
			</main>
		</div>
	);
}
