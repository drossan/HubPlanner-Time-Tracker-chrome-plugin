import Icon from "@mdi/react";

type TitleTab = {
	tab: number;
	indexTab: number;
	iconPath: string;
	text: string;
}

const TitleTab = ({
	tab,
	indexTab,
	iconPath,
	text
}: TitleTab) => {

	return (
		<div className="flex items-center gap-x-2">
			<Icon path={iconPath} size={tab !== indexTab ? 0.6 : 0.7} className={`${tab !== indexTab ? 'text-gray-500' : 'text-green-300'}`}/>
			<span className={`${tab !== indexTab ? "text-gray-500" : "text-sm font-medium"}  `}>{text}</span>
		</div>
	)
}

export default TitleTab