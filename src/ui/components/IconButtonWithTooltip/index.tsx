import Icon from "@mdi/react";

type IconButtonWithTooltipProps = {
	id?: string;
	iconPath: string;
	iconSize?: number;
	iconRotate?: number;
	iconColor?: string;
	tooltip: string;
	onClick?: () => void;
	positionX?: "left" | "right" | "center";
	positionY?: "top" | "bottom" | "center";
};

const IconButtonWithTooltip = ({
	id,
	onClick,
	iconPath,
	iconSize = 0.8,
	iconRotate = 0,
	iconColor = "text-gray-300",
	tooltip,
	positionX = "left",
	positionY = "bottom",
}: IconButtonWithTooltipProps) => {
	const positionYClasses = {
		top: "bottom-full mb-1",
		bottom: "top-full mt-1",
		center: "top-1/2 transform -translate-y-1/2",
	};

	const positionXClasses = {
		left: "right-full -mr-4",
		right: "left-full -ml-4",
		center: "left-1/2 transform -translate-x-1/2",
	};

	return (
		<div className="relative group">
			<button id={id} onClick={onClick} className="focus:outline-none p-1">
				<Icon path={iconPath} size={iconSize} className={iconColor} rotate={iconRotate} />
			</button>

			<p
				className={`absolute ${positionYClasses[positionY]} ${positionXClasses[positionX]} z-50 px-2 py-1 text-[8px] text-black border border-gray-300 bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
				style={{
					width: "150px",
				}}
				dangerouslySetInnerHTML={{ __html: tooltip?.replaceAll(/\n/g, "<br>") }}
			/>
		</div>
	);
};

export default IconButtonWithTooltip;
