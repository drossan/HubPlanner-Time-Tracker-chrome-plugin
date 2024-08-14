import {
	ApiResponse, ApiResponseAuthGoogle,
	BodyLogin,
	DataTypesReloadData,
	TimeEntry,
	TimeEntryAdd
} from "./../types.d";
import { API_URL } from "../share/api";
import { callHubPlannerProxy } from "../share/callHubPlannerProxy";

chrome.runtime.onInstalled.addListener(() => {
	console.log("Hub Planner Time Tracker Extension Installed");
});

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
	const {action, data} = request;
	const {apiToken, body} = data;

	const login = async (body: BodyLogin) => {
		const userEmail = body.username;

		try {
			// Llamada a la API de login
			const response: ApiResponse = await callHubPlannerProxy(`${API_URL}/login`, "", 'POST', body);

			if (response.status) {
				const {token: apiToken} = response;
				chrome.storage.sync.set({apiToken, userEmail}, () => {
					sendResponse({apiToken, userEmail});
				});
			} else {
				sendResponse(response);
			}
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-expect-error
			sendResponse({error: error?.message || error});
		}
	}

	const loginAuthGoogle = async () => {
		chrome.identity.getAuthToken({interactive: true}, async function (token) {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError);
				sendResponse(`Login failed: ${chrome.runtime.lastError.message}`);
				return;
			}
			if (token) {
				try {
					const response: ApiResponseAuthGoogle = await callHubPlannerProxy(`${API_URL}/login-google/${token}`, "", 'GET', body);

					if (response.userEmail) {
						const {token: apiToken, userEmail} = response;
						chrome.storage.sync.set({apiToken, userEmail}, () => {
							sendResponse({apiToken, userEmail});
						});
					} else {
						sendResponse(response);
					}
				} catch (error) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					//@ts-expect-error
					sendResponse({error: error?.message || error});
				}
			}
		});

	}

	const fetchProjectsAndCategories = async () => {
		try {
			const projects = await callHubPlannerProxy(`${API_URL}/projects`, apiToken, 'GET');
			const categories = await callHubPlannerProxy(`${API_URL}/categories`, apiToken, 'GET');

			chrome.storage.local.set({projects: projects, categories: categories}, () => {
				sendResponse({projects: projects, categories: categories});
			});

			sendResponse({projects: projects, categories: categories});
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-expect-error
			sendResponse({error: error?.message || error});
		}
	}

	const fetchRecentTasks = async () => {
		try {
			const recentTasks = await callHubPlannerProxy(`${API_URL}/timeentries`, apiToken, 'GET');
			chrome.storage.local.set({recentTasks}, () => {
				sendResponse({recentTasks});
			});
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-expect-error
			sendResponse({error: error?.message || error});
		}
	}

	const addTask = async (timeEntry: TimeEntryAdd) => {
		try {
			await callHubPlannerProxy(`${API_URL}/timeentry`, apiToken, 'POST', timeEntry);
			sendResponse({message: "Entrada de tiempo registrada con éxito"});
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-expect-error
			sendResponse({error: error?.message || error});
		}
	}

	const submitTask = async (timeEntryID: TimeEntry["_id"]) => {
		try {
			await callHubPlannerProxy(`${API_URL}/timeentry/submit/${timeEntryID}`, apiToken, 'GET')
				.then(async () => {
					await fetchRecentTasks()
				})
			sendResponse({message: "Entrada enviada con éxito"});
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-expect-error
			sendResponse({error: error?.message || error});
		}
	}

	async function processAction() {
		switch (action) {
			case DataTypesReloadData.ALL:
				await fetchProjectsAndCategories();
				await fetchRecentTasks();
				break;
			case DataTypesReloadData.LOGIN:
				await login(body);
				break;
			case DataTypesReloadData.LOGIN_AUTH_GOOGLE:
				await loginAuthGoogle();
				break;
			case DataTypesReloadData.PROJECTS_AND_CATEGORIES:
				await fetchProjectsAndCategories();
				break;
			case DataTypesReloadData.RECENT_TASK:
				await fetchRecentTasks();
				break;
			case DataTypesReloadData.ADD_TASK:
				await addTask(body);
				break;
			case DataTypesReloadData.SUBMIT_TASK:
				await submitTask(body);
				break;
		}
	}

	(async () => await processAction())();

	return true;
});

