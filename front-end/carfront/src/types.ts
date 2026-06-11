export type CarResponse = {
	brand: string;
	model: string;
	color: string;
	registerNumber: string;
	modelYear: number;
	price: number;
	_links: {
		self: {
			href: string;
		};
		car: {
			href: string;
		};
		owner: {
			href: string;
		};
	};
};

export type Car = {
	brand: string;
	model: string;
	color: string;
	registerNumber: string;
	modelYear: number;
	price: number;
};

export type DialogFormProps = {
	car: Car;
	handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type CarEntry = {
	car: Car;
	url: string;
};

export type ConfirmDialogProps = {
	open: boolean;
	title: string;
	message: string;
	onCancel: () => void;
	onConfirm: () => void;
};
