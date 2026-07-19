import { supabase } from "../utils/supabase";
import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
	user: User | null;
	signInWithGithub: () => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user ?? null);
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, []);

	async function signInWithGithub() {
		await supabase.auth.signInWithOAuth({
			provider: "github",
		});
	}

	async function signOut() {
		await supabase.auth.signOut();
	}

	return (
		<AuthContext.Provider value={{ user, signInWithGithub, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
