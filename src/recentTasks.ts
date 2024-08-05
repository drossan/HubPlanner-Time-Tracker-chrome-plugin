//@ts-ignore
import { TimeEntry, TimeEntries, RecentTask, TimeEntriesWeek, TimeEntriesDayOfWeek } from '@projectTypes';

document.addEventListener('DOMContentLoaded', async () => {
	const buttonFetchRecentTasks = document.getElementById('fetchRecentTasks') as HTMLButtonElement;

	let recentTask: RecentTask;

	// Recuperar datos de recentTasks desde chrome.storage.local
	chrome.storage.local.get(['recentTasks'], async (data) => {
		if (data.recentTasks) {
			recentTask = data.recentTasks;
			renderRecentTasks();
		} else {
			await fetchRecentTasks();
		}

		buttonFetchRecentTasks.addEventListener('click', async (e) => {
			e.stopPropagation()
			await fetchRecentTasks();
		});
	});

	// Definir la función para agrupar los proyectos por project y categoryTemplateId
	function groupProjectsByCategory(entries: TimeEntry[]): TimeEntry[] {
		const grouped: { [key: string]: TimeEntry } = {};

		entries.forEach(entry => {
			const key = `${entry.project}-${entry.categoryTemplateId}`;
			if (grouped[key]) {
				grouped[key].minutes += entry.minutes;
			} else {
				grouped[key] = {...entry};
			}
		});

		return Object.values(grouped);
	}

	// Convertir minutos a formato hh:mm
	function minutesToHoursMinutes(minutes: number): string {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	}

	// Convertir fecha a formato "Lunes, 3 de agosto"
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const options = {weekday: 'long', day: 'numeric', month: 'long'} as const;
		return date.toLocaleDateString('es-ES', options);
	}

	// Función para renderizar las tareas recientes
	function renderRecentTasks() {
		const recentTaskContainer = document.getElementById('timerRecentTasksWrapper');

		if (!recentTaskContainer) {
			console.error('Elemento con ID "recentTask" no encontrado');
			return;
		}

		recentTaskContainer.innerHTML = ''; // Limpiar el contenedor antes de renderizar

		if (recentTask?.items?.length) {
			recentTask.items.forEach((timeEntriesWeek: TimeEntriesWeek) => {
				const weekDiv = document.createElement('div');
				weekDiv.classList.add('my-2', 'border', 'border-gray-200');
				weekDiv.innerHTML = `<h2 class="bg-gray-300 py-4 px-4 flex items-center justify-between">${timeEntriesWeek.week} <span>Total: (${timeEntriesWeek.total_time})</span></h2>`;

				const daysList = document.createElement('ul');

				// Ordenar los días de la semana de mayor a menor
				timeEntriesWeek.items.sort((a: TimeEntriesDayOfWeek, b: TimeEntriesDayOfWeek) => {
					return new Date(b.day_of_week).getTime() - new Date(a.day_of_week).getTime();
				});

				timeEntriesWeek.items.forEach((day: TimeEntries) => {
					const dayItem = document.createElement('li');
					dayItem.innerHTML = `<strong class="bg-gray-100 py-4 px-4 flex items-center justify-between">${formatDate(day.day_of_week)} <span>Total: (${day.total_time})</span></strong>`;
					dayItem.classList.add("border-b", "border-gray-200");

					const projectsList = document.createElement('ul');
					projectsList.classList.add("flex", "flex-col");

					const groupedProjects = groupProjectsByCategory(day.items);

					groupedProjects.forEach(project => {
						const projectItem = document.createElement('li');
						projectItem.classList.add("p-4", "border-b", "border-gray-200", "flex", "items-center", "justify-between");

						const projectName = document.createElement('span');
						const projectTime = document.createElement('span');

						projectName.innerHTML = project.projectName;
						projectTime.innerHTML = minutesToHoursMinutes(project.minutes);

						projectItem.appendChild(projectName);
						projectItem.appendChild(projectTime);

						projectsList.appendChild(projectItem);
					});

					dayItem.appendChild(projectsList);
					daysList.appendChild(dayItem);
				});

				weekDiv.appendChild(daysList);
				recentTaskContainer.appendChild(weekDiv);
			});
		}
	}

	async function fetchRecentTasks() {
		try {
			chrome.storage.sync.get(['apiToken'], async (data) => {
				const {apiToken} = data;

				chrome.runtime.sendMessage(
					{action: "fetchRecentTasks", data: {apiToken}},
					async (response) => {
						if (!response?.error) {
							recentTask = response?.recentTasks || {};
							renderRecentTasks();
						}
					}
				);
			});
		} catch (error) {
			console.error('Error fetching user data: ' + (error as Error).message);
		}
	}
});
