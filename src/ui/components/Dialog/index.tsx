import React from 'react';

interface DialogProps {
	isOpen: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6">
				<h2 className="text-xl font-semibold mb-4">{title}</h2>
				<p className="mb-6">{message}</p>
				<div className="flex justify-end space-x-4">
					<button
						className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
						onClick={onCancel}
					>
						Cancelar
					</button>
					<button
						className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
						onClick={onConfirm}
					>
						Confirmar
					</button>
				</div>
			</div>
		</div>
	);
};

export default Dialog;
