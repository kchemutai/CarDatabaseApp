import React, { useState } from "react";
import axios from "axios";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";

interface LoginProps {
	setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
	setUsername: React.Dispatch<React.SetStateAction<string>>;
}

function Login({ setIsAuthenticated, setUsername }: LoginProps) {
	const [user, setUser] = useState({
		username: "",
		password: "",
	});

	const [open, setOpen] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUser({
			...user,
			[e.target.name]: e.target.value,
		});
	};

	const handleLogin = async () => {
		try {
			await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, user, {
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
				},
			});

			setUsername(user.username);
			setIsAuthenticated(true);
		} catch (error) {
			console.error(error);
			setOpen(true);
		}
	};

	return (
		<>
			<Stack spacing={2} alignItems="center" mt={2}>
				<TextField name="username" label="Username" onChange={handleChange} />

				<TextField
					name="password"
					label="Password"
					type="password"
					onChange={handleChange}
				/>

				<Button variant="outlined" color="primary" onClick={handleLogin}>
					Login
				</Button>
			</Stack>

			<Snackbar
				open={open}
				autoHideDuration={3000}
				onClose={() => setOpen(false)}
				message="Login failed: Check your username and password"
			/>
		</>
	);
}

export default Login;
