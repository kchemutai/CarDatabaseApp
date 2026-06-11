import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { Car } from "../types";
import { addCar } from "../api/carapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CarDialogContent from "../components/CarDialogContent";

function AddCar() {
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

	// Open the modal form
	const handleClickOpen = () => {
		setOpen(true);
	};

	// Close the modal form
	const handleClose = () => {
		setOpen(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCar({ ...car, [e.target.name]: e.target.value });
	};

	//Add car
	const { mutate } = useMutation(addCar, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cars"] });
		},
		onError: (err) => {
			console.error(err);
		},
	});

	const handleSave = () => {
		mutate(car);
		setCar({
			brand: "",
			model: "",
			color: "",
			registerNumber: "",
			modelYear: 0,
			price: 0,
		});
		handleClose();
	};

	return (
		<>
			<Button size="small" variant="outlined" onClick={handleClickOpen}>
				New Car
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add New Car</DialogTitle>
				<CarDialogContent car={car} handleChange={handleChange} />
				<DialogActions>
					<Button variant="contained" onClick={handleClose}>
						Close
					</Button>
					<Button variant="contained" onClick={handleSave}>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
export default AddCar;
