import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
	isAuthenticated: boolean;
	username: string;
	login: (token: string, username: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(
		!!sessionStorage.getItem("jwt"),
	);

	const [username, setUsername] = useState(
		sessionStorage.getItem("username") || "",
	);

	const login = (token: string, username: string) => {
		sessionStorage.setItem("jwt", token);
		sessionStorage.setItem("username", username);

		setIsAuthenticated(true);
		setUsername(username);
	};

	const logout = () => {
		sessionStorage.removeItem("jwt");
		sessionStorage.removeItem("username");

		setIsAuthenticated(false);
		setUsername("");
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				username,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used inside AuthProvider");
	}

	return context;
};
