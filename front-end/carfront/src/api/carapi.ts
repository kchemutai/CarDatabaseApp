import { api } from "./apiClient";

import { Car, CarEntry, CarResponse } from "../types";

export const getCars = async (): Promise<CarResponse[]> => {
	const response = await api.get("/cars");

	return response.data._embedded.cars;
};

export const deleteCar = async (link: string): Promise<void> => {
	const response = await api.delete(link);

	return response.data;
};

export const addCar = async (car: Car): Promise<void> => {
	const response = await api.post("/api/cars", car);

	return response.data;
};

export const updateCar = async (carEntry: CarEntry): Promise<void> => {
	const response = await api.put(carEntry.url, carEntry.car);

	return response.data;
};
