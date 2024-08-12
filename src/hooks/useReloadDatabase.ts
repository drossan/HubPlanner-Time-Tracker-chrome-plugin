import { useCallback } from "react";
import { ApiResponse, BodyLogin, DataTypesReloadData, TimeEntry, TimeEntryAdd } from "@projectTypes";

type ReloadDataProps = {
	apiToken: string;
	action: DataTypesReloadData;
	body?: TimeEntryAdd | TimeEntry["_id"] | BodyLogin;
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
			body,
		}: ReloadDataProps): Promise<ApiResponse | string | boolean> => {
			try {
				const response = await new Promise<ApiResponse | boolean>(
					(resolve) => {
						chrome.runtime.sendMessage(
							{ action, data: { apiToken, body } },
							(response) => {
								if (chrome.runtime.lastError) {
									resolve({ error: chrome.runtime.lastError.message });
								} else {
									resolve(response);
								}
							}
						);
					}
				);

				if (response === false) {
					console.error("Failed to fetch data: response was false.");
					return false;
				}

				if (response && typeof response === "object" && "error" in response) {
					return response
				}

				return true;
			} catch (error) {
				console.error("Error fetching user data:", (error as Error).message);
				return false;
			}
		},
		[]
	);
};

export default useReloadData;