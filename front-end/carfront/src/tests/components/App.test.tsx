import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../../App";

describe("App", () => {
	test("renders application title", () => {
		render(<App />);

		expect(screen.getByText(/Carshop/i)).toBeInTheDocument();
	});
});
