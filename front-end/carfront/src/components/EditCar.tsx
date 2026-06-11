import { useState } from "react";
import { Car, CarEntry, CarResponse } from "../types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import CarDialogContent from "../components/CarDialogContent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCar } from "../api/carapi";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

type FormProps = {
	cardata: CarResponse;
};

function EditCar({ cardata }: FormProps) {
	const queryClient = useQueryClient();

	const [open, setOpen] = useState(false);
	const [car, setCar] = useState<Car>({
		brand: "",
		model: "",
		color: "",
		registerNumber: "",
		modelYear: 0,
		price: 0,
	});

	const { mutate } = useMutation(updateCar, {
		onSuccess: () => {
			queryClient.invalidateQueries(["cars"]);
		},
		onError: (err) => {
			console.error(err);
		},
	});

	const handleClickOpen = () => {
		setCar({
			brand: cardata.brand,
			model: cardata.model,
			color: cardata.color,
			registerNumber: cardata.registerNumber,
			modelYear: cardata.modelYear,
			price: cardata.price,
		});
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSave = () => {
		const url = cardata._links.self.href;
		const carEntry: CarEntry = { car, url };
		mutate(carEntry);
		setOpen(false);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCar({ ...car, [event.target.name]: event.target.value });
	};

	return (
		<>
			<IconButton aria-label="edit" size="small" onClick={handleClickOpen}>
				<EditIcon fontSize="small" />
			</IconButton>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Edit car</DialogTitle>
				<CarDialogContent car={car} handleChange={handleChange} />
				<DialogActions>
					<Button variant="outlined" onClick={handleClose}>
						Cancel
					</Button>
					<Button variant="outlined" onClick={handleSave}>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default EditCar;
