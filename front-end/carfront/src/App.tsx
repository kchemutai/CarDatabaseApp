import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Login from "./components/Login";
import Carlist from "./components/Carlist";

const queryClient = new QueryClient();

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(
		!!sessionStorage.getItem("jwt"),
	);

	const [username, setUsername] = useState(
		sessionStorage.getItem("username") || "",
	);

	const handleLogout = () => {
		sessionStorage.removeItem("jwt");
		sessionStorage.removeItem("username");

		setIsAuthenticated(false);
		setUsername("");
	};

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
