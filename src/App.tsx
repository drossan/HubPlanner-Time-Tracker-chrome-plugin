import { useEffect, useState } from "react";

import Login from "@ui/pages/Login";
import Tracking from "@ui/pages/Tracking";

const App = () => {
	const [apiToken, setApiToken] = useState<string>("");
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

	useEffect(() => {
		chrome.storage.sync.get(["apiToken"], (result) => {
			if (result.apiToken) {
				setApiToken(result.apiToken);
				setIsLoggedIn(true);
			} else {
				console.log("No apiToken found");
			}
		});
	}, [isLoggedIn]);

	return (
		<div>
			{isLoggedIn ? (
				<Tracking apiToken={apiToken} setIsLoggedIn={setIsLoggedIn} />
			) : (
				<Login setIsLoggedIn={setIsLoggedIn} />
			)}
		</div>
	);
};

export default App;
