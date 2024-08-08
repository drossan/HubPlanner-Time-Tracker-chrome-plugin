/* eslint-disable import/no-unused-modules */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/tailwind.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<main className="container mx-auto max-w-sm w-400px h-500px flex flex-col overflow-y-hidden">
			<App />
		</main>
	</StrictMode>,
);
