import useReloadData from "@hooks/useReloadDatabase.ts";
import { DataTypesReloadData } from "@projectTypes";
import { useEffect, useState } from "react";

import Login from "@ui/pages/Login";
import Tracking from "@ui/pages/Tracking";

const App = () => {
	const [apiToken, setApiToken] = useState<string>("");
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

	const reloadData = useReloadData();

	const decodeJWT = (token: string) => {
		if (!token) return null;
		const payload = token.split('.')[1];
		return JSON.parse(atob(payload));
	};

	useEffect(() => {
		chrome.storage.sync.get(["apiToken", "refreshToken"], async (result) => {
			if (result.apiToken && result.refreshToken) {
				setApiToken(result.apiToken);
				setIsLoggedIn(true);

				const decodedToken = decodeJWT(result.apiToken);
				const expTime = decodedToken.exp * 1000;
				const currentTime = Date.now();
				const timeLeft = expTime - currentTime;

				if (timeLeft < 24 * 60 * 60 * 1000) {
					reloadData({
						apiToken: "",
						action: DataTypesReloadData.REFRESH_TOKEN,
					}).then(() => {
						console.log("REFRESH_TOKEN OK!")
						setApiToken(result.apiToken);
					});
				}
			} else {
				reloadData({
					apiToken: "",
					action: DataTypesReloadData.REFRESH_TOKEN,
				}).then(() => {
					console.log("REFRESH_TOKEN OK!")
					setApiToken(result.apiToken);
				}).catch( () => console.log("No apiToken found"))
			}
		});
	}, [isLoggedIn]);

	return (
		<div>
			{isLoggedIn ? (
				<Tracking apiToken={apiToken} setIsLoggedIn={setIsLoggedIn}/>
			) : (
				<Login setIsLoggedIn={setIsLoggedIn}/>
			)}
		</div>
	);
};

export default App;
