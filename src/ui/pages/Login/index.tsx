import useReloadData from "@hooks/useReloadDatabase.ts";
import { ApiResponse, BodyLogin, DataTypesReloadData } from "@projectTypes";
import Loader from "@ui/components/Loader";
import { Dispatch, SetStateAction, useCallback, useState } from "react";


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

	const handleLogin = useCallback(async (action: DataTypesReloadData, body?: BodyLogin) => {
		setLoading(true);
		await reloadData({
			apiToken: "",
			action,
			body,
		})
			.then(async (resp) => {
				const response = resp as ApiResponse;
				if (!response) {
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
	}, [])

	const handleLoginUserAndPassword = useCallback(async () => (await handleLogin(DataTypesReloadData.LOGIN, {
		username: email,
		password: password
	})), []);

	const handleLoginOAuth = useCallback(async () => (await handleLogin(DataTypesReloadData.LOGIN_AUTH_GOOGLE)), []);

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
						onClick={handleLoginUserAndPassword}
						className="w-full p-2 bg-green-500 hover:bg-green-600 text-white rounded"
					>
						Login
					</button>

					<div className="my-4 flex items-center gap-4">
						<hr className="w-full border-gray-300"/>
						<p className="text-sm text-gray-800 text-center">or</p>
						<hr className="w-full border-gray-300"/>
					</div>

					<button type="button"
					        onClick={handleLoginOAuth}
					        className="w-full flex items-center justify-center gap-4 py-2 px-6 text-xs tracking-wide text-gray-800 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 focus:outline-none">
						<svg xmlns="http://www.w3.org/2000/svg" width="20px" className="inline" viewBox="0 0 512 512">
							<path fill="#fbbd00"
							      d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
							      data-original="#fbbd00"></path>
							<path fill="#0f9d58"
							      d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
							      data-original="#0f9d58"></path>
							<path fill="#31aa52"
							      d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
							      data-original="#31aa52"></path>
							<path fill="#3c79e6"
							      d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
							      data-original="#3c79e6"></path>
							<path fill="#cf2d48"
							      d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
							      data-original="#cf2d48"></path>
							<path fill="#eb4132"
							      d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
							      data-original="#eb4132"></path>
						</svg>
						Iniciar sesión con Google
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
