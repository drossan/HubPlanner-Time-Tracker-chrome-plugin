export async function callHubPlannerProxy(endpoint: string, apiToken: string, method: string, body: object = {}) {
	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	if(apiToken) {
		myHeaders.append("Authorization", `Bearer ${apiToken}`);
	}

	const requestOptions = {
		method: method,
		headers: myHeaders,
		redirect: "follow"
	};

	if (method !== "GET" && method !== "HEAD") {
		const payload = {
			...body
		};
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-expect-error
		requestOptions.body = JSON.stringify(payload);
	}

	try {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-expect-error
		const response = await fetch(endpoint, requestOptions);
//		if (!response.ok) {
//			throw new Error(`HTTP error! Status: ${response.status}`);
//		}
		return await response.json();
	} catch (error) {
		console.error("Error calling proxy:", error);
		throw error;
	}
}
