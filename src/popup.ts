import { API_URL } from "./utils";

document.addEventListener('DOMContentLoaded', async () => {
	const loginButton = document.getElementById('loginButton');
	const message = document.getElementById('message') as HTMLDivElement;

	// Verificar si hay una sesión activa
	chrome.storage.sync.get(['apiToken', 'userEmail'], (data) => {
		if (data.apiToken && data.userEmail) {
			// Redirigir a la pantalla de tracking si hay una sesión activa
			window.location.href = 'tracker.html';
		}
	});

	if (loginButton) {
		loginButton.addEventListener('click', async () => {
			const email = (document.getElementById('email') as HTMLInputElement).value;
			const password = (document.getElementById('password') as HTMLInputElement).value;

			try {
				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				const requestOptions = {
					method: 'POST',
					headers: myHeaders,
					body: JSON.stringify({ username: email, password: password }), // asegúrate de que los nombres de los campos coincidan
				};

				//@ts-ignore
				const response = await fetch(`${API_URL}/login`, requestOptions);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const result = await response.json();

				if (result.status) {
					chrome.storage.sync.set({ apiToken: result['token'], userEmail: email }, () => {
						message.textContent = 'Login successful!';
						 window.location.href = 'tracker.html';
					});
				} else {
					message.textContent = 'Login failed: ' + result.message;
				}
			} catch (error) {
				message.textContent = 'Error: ' + (error as Error).message;
			}
		});
	}
});
