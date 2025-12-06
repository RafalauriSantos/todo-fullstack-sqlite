import React, { createContext, useState, useContext, useEffect } from "react";
import { api } from "../services/api";

interface AuthContextData {
	signed: boolean;
	user: string | null;
	login: (email: string, pass: string) => Promise<void>;
	register: (email: string, pass: string) => Promise<void>;
	logout: () => void;
	loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const storagedUser = localStorage.getItem("user");
		const storagedToken = localStorage.getItem("token");

		if (storagedUser && storagedToken) {
			setUser(storagedUser);
		}
		setLoading(false);
	}, []);

	async function login(email: string, pass: string) {
		const response = await api.login(email, pass);
		localStorage.setItem("user", email);
		localStorage.setItem("token", response.token);
		setUser(email);
	}

	async function register(email: string, pass: string) {
		await api.register(email, pass);
		await login(email, pass);
	}

	function logout() {
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		setUser(null);
	}

	return (
		<AuthContext.Provider
			value={{ signed: !!user, user, login, register, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export function useAuth() {
	return useContext(AuthContext);
}
