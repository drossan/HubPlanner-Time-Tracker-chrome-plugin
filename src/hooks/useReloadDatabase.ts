import { useCallback } from "react";

import { DataTypesReloadData, TimeEntryAdd } from "@projectTypes";

type ReloadDataProps = {
	apiToken: string;
	action: DataTypesReloadData;
	body?: TimeEntryAdd
};

/**
 * Hook personalizado para recargar datos utilizando la mensajería runtime de Chrome.
 *
 * @returns {function({apiToken: string, action: DataTypesReloadData}): Promise<boolean>}
 *          Una función que acepta un objeto con `apiToken` y `action`, y devuelve una promesa que se resuelve a un booleano.
 */
const useReloadData = () => {
	return useCallback(
		async ({
			apiToken,
			action = DataTypesReloadData.PROJECTS_AND_CATEGORIES,
		}: ReloadDataProps) => {
			try {
				chrome.runtime.sendMessage(
					{ action, data: { apiToken } },
					(response) => {
						if (response?.error) {
							console.log("Error fetching data: " + response.error || response);
							return false;
						} else {
							console.log("Fetched projects and categories successfully.");
							return true;
						}
					},
				);
			} catch (error) {
				console.log("Error fetching user data: " + (error as Error).message);
				return false;
			}
		},
		[],
	);
};

export default useReloadData;
