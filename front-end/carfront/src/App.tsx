import { useEffect, useState } from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Login from "./components/Login";
import Carlist from "./components/Carlist";

import { api } from "./api/apiClient";

const queryClient = new QueryClient();

function App() {
	const [loading, setLoading] = useState(true);

	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const [username, setUsername] = useState("");

	useEffect(() => {
		api
			.get("/auth/me")
			.then((response) => {
				setIsAuthenticated(response.data.authenticated);

				setUsername(response.data.username ?? "");
			})
			.catch(() => {
				setIsAuthenticated(false);
				setUsername("");
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleLogout = () => {
		setIsAuthenticated(false);
		setUsername("");
	};

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					mt: 5,
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Container maxWidth="xl">
			<CssBaseline />

			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6">Carshop</Typography>

					<Box sx={{ flexGrow: 1 }} />

					{isAuthenticated && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 3,
							}}
						>
							<Typography>{username}</Typography>

							<Typography
								sx={{
									cursor: "pointer",
								}}
								onClick={handleLogout}
							>
								Logout
							</Typography>
						</Box>
					)}
				</Toolbar>
			</AppBar>

			<QueryClientProvider client={queryClient}>
				{isAuthenticated ? (
					<Carlist onLogout={handleLogout} />
				) : (
					<Login setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />
				)}
			</QueryClientProvider>
		</Container>
	);
}

export default App;
