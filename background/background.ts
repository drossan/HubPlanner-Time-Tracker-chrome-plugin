import { DataTypesReloadData, TimeEntryAdd } from "./../types.d";
import { API_URL } from "../share/api";
import { callHubPlannerProxy } from "../share/callHubPlannerProxy";

chrome.runtime.onInstalled.addListener(() => {
	console.log("HubPlanner Time Tracker Extension Installed");
});

chrome.runtime.onMessage.addListener( (request, _, sendResponse) => {
	const {action, data} = request;
	const {apiToken, body} = data;

	const fetchProjectsAndCategories = async () => {
		try {
			const projects = await callHubPlannerProxy(`${API_URL}/projects`, apiToken, 'GET');
			const categories = await callHubPlannerProxy(`${API_URL}/categories`, apiToken, 'GET');

			chrome.storage.sync.set({projects, categories}, () => {
				sendResponse({projects, categories});
			});
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

	async function processAction() {
		switch (action) {
			case DataTypesReloadData.ALL:
				await fetchProjectsAndCategories();
				await fetchRecentTasks();
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
		}
	}

	(async () => await processAction())();

	return true;
});

