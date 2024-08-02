//export const API_URL = "http://localhost:1331/api/v1";
export const API_URL = "https://gpjw64fugg.execute-api.eu-west-3.amazonaws.com/dev/api/v1";

export async function callHubPlannerProxy(endpoint: string, apiToken: string, method: string, body: object = {}) {
	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Authorization", `Bearer ${apiToken}`);


	const requestOptions = {
		method: method,
		headers: myHeaders,
		redirect: "follow"
	};

	if (method !== "GET" && method !== "HEAD") {
		const payload = {
			...body
		};
		//@ts-ignore
		requestOptions.body = JSON.stringify(payload);
	}

	try {
		//@ts-ignore
		const response = await fetch(endpoint, requestOptions);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Error calling proxy:", error);
		throw error;
	}
}
