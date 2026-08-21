import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.tsx";

import App from "./App.tsx";
import { Home } from "./pages/Home.tsx";
import { CreatePostPage } from "./pages/CreatePostPage.tsx";
import { PostPage } from "./pages/PostPage.tsx";
import { CommunitiesPage } from "./pages/CommunitiesPage.tsx";
import { CreateCommunityPage } from "./pages/CreateCommunityPage.tsx";
import { CommunityPage } from "./pages/CommunityPage.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "communities", element: <CommunitiesPage /> },
			{ path: "post/:id", element: <PostPage /> },
			{ path: "community/:id", element: <CommunityPage /> },
			{
				path: "create",
				element: (
					<ProtectedRoute>
						<CreatePostPage />
					</ProtectedRoute>
				),
			},
			{
				path: "community/create",
				element: (
					<ProtectedRoute>
						<CreateCommunityPage />
					</ProtectedRoute>
				),
			},
		],
	},
]);

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<QueryClientProvider client={client}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</AuthProvider>
	</StrictMode>,
);
