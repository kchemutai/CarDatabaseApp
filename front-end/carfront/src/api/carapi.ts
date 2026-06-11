import { AxiosRequestConfig } from "axios";

import { api } from "./apiClient";

import { Car, CarEntry, CarResponse } from "../types";

const getAxiosConfig = (): AxiosRequestConfig => {
	const token = sessionStorage.getItem("jwt");

	return {
		headers: {
			Authorization: token,
			"Content-Type": "application/json",
		},
	};
};

export const getCars = async (): Promise<CarResponse[]> => {
	const response = await api.get("/api/cars", getAxiosConfig());

	return response.data._embedded.cars;
};

export const deleteCar = async (link: string): Promise<void> => {
	const response = await api.delete(link, getAxiosConfig());

	return response.data;
};

export const addCar = async (car: Car): Promise<void> => {
	const response = await api.post("/api/cars", car, getAxiosConfig());

	return response.data;
};

export const updateCar = async (carEntry: CarEntry): Promise<void> => {
	const response = await api.put(carEntry.url, carEntry.car, getAxiosConfig());

	return response.data;
};
