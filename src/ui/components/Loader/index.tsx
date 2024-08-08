const Loader = () => {
	return (
		<div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center z-50">
			<div className="flex space-x-2">
				<div className="dot bg-white h-4 w-4 rounded-full"></div>
				<div className="dot bg-white h-4 w-4 rounded-full"></div>
				<div className="dot bg-white h-4 w-4 rounded-full"></div>
			</div>
		</div>
	);
};

export default Loader;
