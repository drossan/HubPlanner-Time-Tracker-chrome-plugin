//export const API_URL = "http://localhost:1331/api/v1";
export const API_URL = "https://gpjw64fugg.execute-api.eu-west-3.amazonaws.com/dev/api/v1";

export const fetchProjectsAndCategories = async (apiToken: string) => {
	const myHeaders = new Headers();
	myHeaders.append("Authorization", `Bearer ${apiToken}`);
	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
	};

	const response = await fetch(`${API_URL}/projects`, requestOptions);
	const result = await response.json();

	if (response.ok) {
		return {
			projects: result.projects,
			categories: result.categories,
		};
	} else {
		throw new Error(result.message);
	}
};

export const fetchRecentTasks = async (apiToken: string) => {
	const myHeaders = new Headers();
	myHeaders.append("Authorization", `Bearer ${apiToken}`);
	const requestOptions = {
		method: 'GET',
		headers: myHeaders,
	};

	const response = await fetch(`${API_URL}/timeentries`, requestOptions);
	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message);
	}
};

export const callHubPlannerProxy = async (url: string, apiToken: string, method: string, body?: any) => {
	const myHeaders = new Headers();
	myHeaders.append("Authorization", `Bearer ${apiToken}`);
	myHeaders.append("Content-Type", "application/json");

	const requestOptions = {
		method,
		headers: myHeaders,
		body: body ? JSON.stringify(body) : undefined,
	};

	const response = await fetch(url, requestOptions);
	const result = await response.json();

	if (response.ok) {
		return result;
	} else {
		throw new Error(result.message);
	}
};