import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function PrivateRoute({ children }: { children: React.ReactElement }) {
	const { signed, loading } = useAuth();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center text-white">
				Carregando...
			</div>
		);
	}

	return signed ? children : <Navigate to="/login" />;
}

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route
						path="/"
						element={
							<PrivateRoute>
								<Home />
							</PrivateRoute>
						}
					/>
				</Routes>
				<Analytics />
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
