import { render, screen } from "@testing-library/react";
import { describe, test, expect, beforeEach, vi } from "vitest";

import Carlist from "../../components/Carlist";
import * as carApi from "../../api/carapi";

import { mockCars } from "../mocks/carData";
import { createTestWrapper } from "../utils/test-utils";

vi.mock("../../api/carapi");

vi.mock("../../components/AddCar", () => ({
	default: () => <button>New Car</button>,
}));

vi.mock("../../components/EditCar", () => ({
	default: () => <button>Edit</button>,
}));

describe("Carlist", () => {
	beforeEach(() => {
		vi.mocked(carApi.getCars).mockResolvedValue(mockCars as never);
	});

	test("shows loading initially", () => {
		render(<Carlist onLogout={vi.fn()} />, {
			wrapper: createTestWrapper(),
		});

		expect(screen.getByText(/Loading/i)).toBeInTheDocument();
	});

	test("renders fetched cars", async () => {
		render(<Carlist onLogout={vi.fn()} />, {
			wrapper: createTestWrapper(),
		});

		expect(await screen.findByText(/Mazda/i)).toBeInTheDocument();
	});

	test("renders add car button", async () => {
		render(<Carlist onLogout={vi.fn()} />, {
			wrapper: createTestWrapper(),
		});

		expect(await screen.findByText(/New Car/i)).toBeInTheDocument();
	});
});
