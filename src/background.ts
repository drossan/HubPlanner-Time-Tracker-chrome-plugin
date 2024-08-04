import { API_URL, callHubPlannerProxy } from './utils';

chrome.runtime.onInstalled.addListener(() => {
	console.log("HubPlanner Time Tracker Extension Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "fetchProjectsAndCategories") {
		(async () => {
			const { apiToken } = request.data;
			try {
				const projects = await callHubPlannerProxy(`${API_URL}/projects`, apiToken, 'GET');
				const categories = await callHubPlannerProxy(`${API_URL}/categories`, apiToken, 'GET');

				chrome.storage.sync.set({ projects, categories }, () => {
					sendResponse({ projects, categories });
				});
			} catch (error) {
				//@ts-ignore
				sendResponse({ error: error?.message || error });
			}
		})();

		return true;
	}
});