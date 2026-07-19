import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.tsx";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<QueryClientProvider client={client}>
				<Router>
					<App />
				</Router>
			</QueryClientProvider>
		</AuthProvider>
	</StrictMode>,
);
