import { useCallback } from "react";
import { DataTypesReloadData, TimeEntry, TimeEntryAdd } from "@projectTypes";

type ReloadDataProps = {
	apiToken: string;
	action: DataTypesReloadData;
	body?: TimeEntryAdd | TimeEntry["_id"];
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
		}: ReloadDataProps): Promise<boolean> => {
			try {
				const response = await new Promise<{ error?: string } | boolean>(
					(resolve) => {
						chrome.runtime.sendMessage(
							{ action, data: { apiToken, body } },
							(response) => {
								if (chrome.runtime.lastError) {
									console.error(chrome.runtime.lastError.message);
									resolve(false);
								} else {
									resolve(response);
								}
							}
						);
					}
				);

				//@ts-ignore
				if (response === false || (response && "error" in response)) {
					console.error("Error fetching data:", response);
					return false;
				} else {
					console.log("Fetched successfully.");
					return true;
				}
			} catch (error) {
				console.error("Error fetching user data:", (error as Error).message);
				return false;
			}
		},
		[]
	);
};

export default useReloadData;
