import useReloadData from "@hooks/useReloadDatabase.ts";
import { ApiResponse, BodyLogin, DataTypesReloadData } from "@projectTypes";
import Loader from "@ui/components/Loader";
import { Dispatch, SetStateAction, useState } from "react";


type LoginProps = {
	setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

//@ts-ignore
const Login = ({setIsLoggedIn}: LoginProps) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const reloadData = useReloadData();

	const handleLogin = async () => {
		setLoading(true);
		await reloadData({
			apiToken: "",
			action: DataTypesReloadData.LOGIN,
			body: {username: email, password: password} as BodyLogin
		})
			.then(async (resp) => {
				const response = resp as ApiResponse;
				if(!response) {
					setMessage("Login failed");
				} else if (response?.error && response?.message) {
					setMessage(response.message);
				} else {
					setMessage("Login successful!");
					setIsLoggedIn(true);
				}
			})
			.catch((err) => {
				setMessage("Login failed: " + err.message);
			})
		setLoading(false);
	};

	return (
		<main className="container mx-auto max-w-sm w-400px h-500px p-8 flex items-center justify-center">
			<section className="px-10 py-8 border border-gray-300 rounded shadow-2xl">
				<div className="flex items-center justify-center gap-x-1 mb-4 mt-6">
					<img src="/images/logo.png" width="40px" height="40px" alt="logo"/>
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
			{loading && <Loader/>}
		</main>
	);
};

export default Login;
