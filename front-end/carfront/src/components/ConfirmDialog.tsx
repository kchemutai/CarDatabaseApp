import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from "@mui/material";
import { ConfirmDialogProps } from "../types";

function ConfirmDialog({
	open,
	title,
	message,
	onCancel,
	onConfirm,
}: ConfirmDialogProps) {
	return (
		<Dialog open={open} onClose={onCancel}>
			<DialogTitle>{title}</DialogTitle>

			<DialogContent>
				<DialogContentText>{message}</DialogContentText>
			</DialogContent>

			<DialogActions>
				<Button onClick={onCancel}>Cancel</Button>

				<Button variant="contained" color="error" onClick={onConfirm}>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ConfirmDialog;
