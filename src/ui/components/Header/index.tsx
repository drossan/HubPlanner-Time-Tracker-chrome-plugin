import { Dispatch, SetStateAction } from "react";

import useReloadData from "@hooks/useReloadDatabase.ts";
import { DataTypesReloadData } from "@projectTypes";
import IconButtonWithTooltip from "@ui/components/IconButtonWithTooltip";

type HeaderProps = {
	apiToken: string;
	setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
	setLoading: Dispatch<SetStateAction<boolean>>;
};

const Header = ({ apiToken, setIsLoggedIn, setLoading }: HeaderProps) => {
	const reloadData = useReloadData();

	const handleLogout = () => {
		chrome.storage.local.remove(["recentTasks"], () => {});
		chrome.storage.sync.remove(
			[
				"apiToken",
				"userEmail",
				"startTime",
				"selectedProject",
				"selectedCategory",
			],
			() => {
				setIsLoggedIn(false);
			},
		);
	};

	const handleReloadData = async (apiToken: string) => {
		setLoading(true);
		reloadData({
			apiToken: apiToken,
			action: DataTypesReloadData.RECENT_TASK,
		}).finally(() => {
			setLoading(false);
		});
	};

	return (
		<section className="p-4 bg-white fixed top-0 end-0 start-0 border-b border-color-gray-100">
			<div className="flex items-center justify-between gap-x-1 w-full">
				<div className="flex items-center justify-center">
					<img src="/images/logo.png" width="30px" height="30px" />
					<h2 className="text-base font-bold"> Secuoyas Experience</h2>
				</div>
				<div className="flex justify-end items-center text-right">
					<IconButtonWithTooltip
						onClick={() => apiToken && handleReloadData(apiToken)}
						image="images/reload_database.png"
						alt="Sync projects and categorios"
						width="20px"
						tooltip="Sincroniza proyectos y categorias con HubPLanner"
					/>
					<button
						onClick={handleLogout}
						className="p-2 text-red-500 text-right"
					>
						<img src="/images/logout.png" alt="logout" width="16px" />
					</button>
				</div>
			</div>
		</section>
	);
};

export default Header;
