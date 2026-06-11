import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import axios from "axios";

import Login from "../../components/Login";

vi.mock("axios");

describe("Login", () => {
	test("renders login form", () => {
		render(<Login setIsAuthenticated={vi.fn()} setUsername={vi.fn()} />);

		expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();

		expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
	});

	test("successful login", async () => {
		const setIsAuthenticated = vi.fn();
		const setUsername = vi.fn();

		vi.mocked(axios.post).mockResolvedValue({
			headers: {
				authorization: "fake-token",
			},
		} as never);

		render(
			<Login setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />,
		);

		await userEvent.type(screen.getByLabelText(/Username/i), "admin");

		await userEvent.type(screen.getByLabelText(/Password/i), "password");

		await userEvent.click(
			screen.getByRole("button", {
				name: /Login/i,
			}),
		);

		expect(setIsAuthenticated).toHaveBeenCalledWith(true);

		expect(setUsername).toHaveBeenCalledWith("admin");
	});
});
