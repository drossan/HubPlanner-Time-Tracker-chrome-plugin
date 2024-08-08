import { Dispatch, SetStateAction, useState } from "react";

import { API_URL } from "./../../../../share/api.ts";

type LoginProps = {
	setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

const Login = ({ setIsLoggedIn }: LoginProps) => {
	const [message, setMessage] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const handleResponse = async (response: Response) => {
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const result = await response.json();

		if (result.status) {
			chrome.storage.sync.set(
				{ apiToken: result["token"], userEmail: email },
				() => {
					console.log("Token stored in chrome.storage.sync");
					setMessage("Login successful!");
					setIsLoggedIn(true);
				},
			);
		} else {
			setMessage("Login failed: " + result.message);
		}
	};

	const handleLogin = async () => {
		try {
			const myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			const requestOptions = {
				method: "POST",
				headers: myHeaders,
				body: JSON.stringify({ username: email, password: password }),
			};

			const response = await fetch(`${API_URL}/login`, requestOptions);

			await handleResponse(response);
		} catch (error) {
			setMessage("Error: " + (error as Error).message);
		}
	};

	return (
		<main className="container mx-auto max-w-sm w-400px h-500px p-8 flex items-center justify-center">
			<section className="px-10 py-8 border border-gray-300 rounded shadow-2xl">
				<div className="flex items-center justify-center gap-x-1 mb-4 mt-6">
					<img src="images/logo.png" width="40px" height="40px" />
					<h2 className="text-base font-bold"> Secuoyas Experience</h2>
				</div>
				<div className="flex flex-col gap-y-2 mb-4">
					<input
						type="email"
						id="email"
						placeholder="Email"
						className="w-full p-2 border border-gray-300 rounded mb-2 outline-none hover:border-green-500 focus:border-green-500"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						type="password"
						id="password"
						placeholder="Password"
						className="w-full p-2 border border-gray-300 rounded mb-2 outline-none hover:border-green-500 focus:border-green-500"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button
						onClick={handleLogin}
						className="w-full p-2 bg-green-500 hover:bg-green-600 text-white rounded"
					>
						Login
					</button>
				</div>
				{message && (
					<div className="mt-4 text-center text-red-500">{message}</div>
				)}
			</section>
		</main>
	);
};

export default Login;
