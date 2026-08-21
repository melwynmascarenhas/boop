import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="py-12 text-center font-mono text-xs text-zinc-500 uppercase tracking-wider">
				Loading...
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
}
