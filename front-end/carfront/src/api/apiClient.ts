import axios from "axios";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			sessionStorage.removeItem("jwt");
			sessionStorage.removeItem("username");

			window.location.href = "/";
		}

		return Promise.reject(error);
	},
);
