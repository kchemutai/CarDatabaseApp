import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCars, deleteCar } from "../api/carapi";
import { DataGrid, GridColDef, GridCellParams } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import AddCar from "../components/AddCar";
import EditCar from "../components/EditCar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../components/ConfirmDialog";

interface CarlistProps {
	onLogout: () => void;
}

function Carlist({ onLogout }: CarlistProps) {
	const [open, setOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteLink, setDeleteLink] = useState("");

	const queryClient = useQueryClient();
	const columns: GridColDef[] = [
		{ field: "brand", headerName: "Brand", width: 200 },
		{ field: "model", headerName: "Model", width: 200 },
		{ field: "color", headerName: "Color", width: 200 },
		{ field: "registerNumber", headerName: "Reg.nr.", width: 150 },
		{ field: "modelYear", headerName: "Model Year", width: 150 },
		{ field: "price", headerName: "Price", width: 150 },
		{
			field: "edit",
			headerName: "",
			width: 90,
			sortable: false,
			filterable: false,
			disableColumnMenu: true,
			renderCell: (params: GridCellParams) => <EditCar cardata={params.row} />,
		},
		{
			field: "delete",
			headerName: "",
			width: 100,
			sortable: false,
			filterable: false,
			disableColumnMenu: true,
			renderCell: (params: GridCellParams) => (
				<IconButton
					aria-label="delete"
					size="small"
					onClick={() => {
						setDeleteLink(params.row._links.car.href);
						setDeleteDialogOpen(true);
					}}
				>
					<DeleteIcon fontSize="small" />
				</IconButton>
			),
		},
	];
	const { data, error, isSuccess } = useQuery({
		queryKey: ["cars"],
		queryFn: getCars,
	});

	const handleDelete = () => {
		mutate(deleteLink);
		setDeleteDialogOpen(false);
	};

	//delete car
	const { mutate } = useMutation(deleteCar, {
		onSuccess: () => {
			setOpen(true);
			queryClient.invalidateQueries({ queryKey: ["cars"] });
		},
		onError: (err) => {
			console.error(err);
		},
	});

	if (!isSuccess) {
		return <span>Loading...</span>;
	} else if (error) {
		return <span>Error when fetching cars...</span>;
	} else {
		return (
			<>
				<AddCar />
				<DataGrid
					rows={data}
					columns={columns}
					disableRowSelectionOnClick={true}
					getRowId={(row) => row._links.self.href}
					showToolbar
				/>
				<Snackbar
					open={open}
					autoHideDuration={2000}
					onClose={() => setOpen(false)}
					message="Car deleted"
				/>

				<ConfirmDialog
					open={deleteDialogOpen}
					title="Delete Car"
					message="Are you sure you want to delete this car?"
					onCancel={() => setDeleteDialogOpen(false)}
					onConfirm={handleDelete}
				/>
			</>
		);
	}
}
export default Carlist;
