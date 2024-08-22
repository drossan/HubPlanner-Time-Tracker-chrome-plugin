import { useState, useRef, useEffect, ChangeEvent } from "react";

import { Categories, Category, Project, Projects } from "@projectTypes";

interface AutocompleteInputProps {
	items: Projects | Categories;
	selectedItem: string | null;
	onSelectItem: (value: string) => void;
	placeholder: string;
}

const AutocompleteInput = ({
	items,
	selectedItem,
	onSelectItem,
	placeholder,
}: AutocompleteInputProps) => {
	const [filteredItems, setFilteredItems] = useState<Projects | Categories>([]);
	const [inputValue, setInputValue] = useState<string>("");
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (selectedItem) {
			const selected = items?.find((item) => item._id === selectedItem);
			if (selected) {
				setInputValue(selected.name);
			}
		} else {
			setInputValue("");
			setFilteredItems([]);
		}
	}, [selectedItem, items]);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);

		const filter = value.toLowerCase();
		const filtered = items?.filter((item) =>
			item.name.toLowerCase().includes(filter),
		);
		setFilteredItems(filtered);
	};

	const handleInputClick = () => {
		setFilteredItems(items);
	};

	const handleSelectItem = (item: Project | Category) => {
		setInputValue(item.name);
		onSelectItem(item._id);
		setFilteredItems([]);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node) &&
			inputRef.current &&
			!inputRef.current.contains(event.target as Node)
		) {
			setFilteredItems([]);
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	return (
		<div className="relative">
			<input
				ref={inputRef}
				type="text"
				value={inputValue}
				onChange={handleInputChange}
				onClick={handleInputClick}
				placeholder={placeholder}
				className="w-full p-2 border border-gray-300 rounded outline-none hover:border-green-500 focus:border-green-500"
			/>
			{filteredItems.length > 0 && (
				<div
					ref={dropdownRef}
					className="absolute z-20 bg-white border border-gray-300 rounded w-full mt-1 max-h-60 overflow-y-auto"
				>
					{filteredItems.map((item) => (
						<div
							key={item._id}
							className="cursor-pointer hover:bg-gray-200 p-2"
							onClick={() => handleSelectItem(item)}
						>
							{item.name}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default AutocompleteInput;
