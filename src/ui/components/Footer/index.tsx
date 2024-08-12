const Footer = () => {
	return (
		<section
			className="p-4 flex items-center justify-between fixed bottom-0 end-0 start-0 bg-white border-t border-color-gray-100">
			<a
				href="https://secuoyas.hubplanner.com/time_sheets"
				className="hover:text-green-500"
				target="_blank"
			>
				Hub Planner
			</a>
			<a href="https://github.com/Secuoyas-Experience/HubPlanner-Time-Tracker-Chrome-Extension/releases/tag/v1.2.7"
			   target="_blank">v1.2.7</a>
		</section>
	);
};

export default Footer;
