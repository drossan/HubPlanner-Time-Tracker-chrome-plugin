import { API_URL, callHubPlannerProxy } from "./utils";

document.addEventListener('DOMContentLoaded', async () => {
	const projectSearch = document.getElementById('projectSearch') as HTMLInputElement;
	const projectDropdown = document.getElementById('projectDropdown') as HTMLDivElement;
	const categorySearch = document.getElementById('categorySearch') as HTMLInputElement;
	const categoryDropdown = document.getElementById('categoryDropdown') as HTMLDivElement;
	const startButton = document.getElementById('startButton') as HTMLButtonElement;
	const startIcon = document.getElementById('startIcon') as HTMLImageElement;
	const startText = document.getElementById('startText') as HTMLImageElement;
	const timer = document.getElementById('timer') as HTMLSpanElement;
	const timerSeconds = document.getElementById('seconds') as HTMLSpanElement;
	const logoutButton = document.getElementById('logoutButton') as HTMLButtonElement;
	const message = document.getElementById('message') as HTMLDivElement;

	const toggleButtons = document.querySelectorAll('.js-toggle') as NodeListOf<HTMLElement>;
	const toggleContents = document.querySelectorAll('.js-toggle-content') as NodeListOf<HTMLElement>;

	const clearForm = document.getElementById('clearForm') as HTMLButtonElement;
	const fetchProjectsAndCategoriesButton = document.getElementById('fetchProjectsAndCategories') as HTMLButtonElement;

	let projects: any[] = [];

	let categories: any[] = [];
	let selectedProject: string | null = null;
	let selectedCategory: string | null = null;
	let startTime: Date | null = null;
	let timerInterval: number | null = null;

	chrome.storage.sync.get(['apiToken', 'userEmail', 'startTime', 'selectedProject', 'selectedCategory', 'projects', 'categories'], async (data) => {
		const {
			apiToken,
			userEmail,
			startTime: storedStartTime,
			selectedProject: storageProject,
			selectedCategory: storageCategory,
			projects: storedProjects,
			categories: storedCategories,
		} = data;

		selectedProject = storageProject;
		selectedCategory = storageCategory;

		if (!apiToken || !userEmail) {
			window.location.href = 'popup.html';
			return;
		}

		if (storedStartTime) {
			startTime = new Date(storedStartTime);
			startIcon.src = './images/stop.png';
			updateTimer();
			startText.textContent = "Parar";
			timerInterval = setInterval(updateTimer, 1000);

		}

		try {
			if (storedProjects && storedCategories) {
				projects = storedProjects;
				categories = storedCategories;
				initializeDropdowns();
			} else {
				await fetchProjectsAndCategories(apiToken)
			}

			startButton.addEventListener('click', async () => {
				if (startTime) {
					//@ts-ignore
					clearInterval(timerInterval);
					const endTime = new Date();
					const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
					startTime = null;
					startIcon.src = './images/play.png';
					timer.textContent = '00:00';
					timerSeconds.textContent = "00"
					startText.textContent = "Iniciar";

					const timeEntry = {
						project: selectedProject!,
						categoryTemplateId: selectedCategory!,
						date: new Date().toISOString().split('T')[0],
						minutes: duration
					};

					try {
						await callHubPlannerProxy(
							`${API_URL}/timeentry`,
							apiToken,
							'POST',
							timeEntry
						);
						message.classList.remove("text-red-600")
						message.classList.add("text-green-600")
						message.textContent = 'Time entry recorded successfully!';
					} catch (error) {
						message.classList.remove("text-green-600")
						message.classList.add("text-red-600")
						message.textContent = 'Failed to record time entry.';
					}

					resetForm()
				} else {
					startTime = new Date();
					startIcon.src = './images/stop.png';
					startButton.classList.replace('bg-green-500', 'bg-red-500');
					updateTimer();
					timerInterval = setInterval(updateTimer, 1000);
					startText.textContent = "Parar";

					// Guardar el estado del temporizador y el proyecto/categoría seleccionados
					await chrome.storage.sync.set({
						startTime: startTime.toISOString(),
						selectedProject,
						selectedCategory
					});
				}
			});

			logoutButton.addEventListener('click', () => {
				chrome.storage.local.remove(['recentTasks'], () => {});
				chrome.storage.sync.remove(['apiToken', 'userEmail', 'startTime', 'selectedProject', 'selectedCategory'], () => {
					window.location.href = 'popup.html';
				});
			});

			logoutButton.addEventListener('click', () => {
				chrome.storage.sync.remove(['apiToken', 'userEmail', 'startTime', 'selectedProject', 'selectedCategory'], () => {
					window.location.href = 'popup.html';
				});
			});

			toggleButtons.forEach(button => {
				button.addEventListener('click', () => {
					const toggleId = button.getAttribute('data-toggle');
					const activeContent = Array.from(toggleContents).find(content => content.getAttribute('data-toggle') === toggleId);

					if (activeContent && !activeContent.classList.contains('hidden')) {
						return;
					}

					toggleContents.forEach(content => {
						if (content.getAttribute('data-toggle') === toggleId) {
							content.classList.toggle('hidden');
						} else {
							content.classList.add('hidden');
						}
					});
				});
			});

			clearForm.addEventListener('click', async (e) => {
				e.stopPropagation()
				// TODO: Añadir aviso!
				resetForm()
			});

			fetchProjectsAndCategoriesButton.addEventListener('click', async (e) => {
				e.stopPropagation()
				await fetchProjectsAndCategories(apiToken);
			});

			startButtonEnable()
		} catch (error) {
			message.textContent = 'Error fetching user data: ' + (error as Error).message;
		}
	});

	function initializeDropdowns() {
		if (selectedProject) {
			projectSearch.value = projects.find(project => project._id === selectedProject)?.name || '';
		}

		updateDropdown(projectDropdown, projects, projectSearch, selectedProject, setSelectedProject);

		if (selectedCategory) {
			categorySearch.value = categories.find(category => category._id === selectedCategory)?.name || '';
		}

		updateDropdown(categoryDropdown, categories, categorySearch, selectedCategory, setSelectedCategory);
	}

	function updateDropdown(
		dropdown: HTMLDivElement,
		items: any[],
		searchInput: HTMLInputElement,
		itemID: string | null,
		selectCallback: (value: string) => void,
	) {
		searchInput.addEventListener('input', () => {
			const filter = searchInput.value.toLowerCase();
			const filteredItems = items.filter(item => item.name.toLowerCase().includes(filter));
			renderDropdown(dropdown, filteredItems, itemID, selectCallback);
		});

		searchInput.addEventListener('focus', () => {
			dropdown.style.display = 'block';
		});

		document.addEventListener('click', (event) => {
			if (!dropdown.contains(event.target as Node) && event.target !== searchInput) {
				dropdown.style.display = 'none';
			}
		});

		renderDropdown(dropdown, items, itemID, selectCallback);
	}

	function renderDropdown(
		dropdown: HTMLDivElement,
		items: any[],
		itemID: string | null,
		selectCallback: (value: string) => void
	) {
		dropdown.innerHTML = '';
		items.forEach(item => {
			const div = document.createElement('div');
			div.textContent = item.name;
			div.className = 'cursor-pointer hover:bg-gray-200 p-2';
			div.addEventListener('click', () => {
				selectCallback(item._id);
				dropdown.style.display = 'none';
			});

			if (itemID === item._id) {
				div.click()
			}

			dropdown.appendChild(div);
		});
	}

	function setSelectedProject(value: string) {
		selectedProject = value;
		projectSearch.value = projects.find(project => project._id === value)?.name || '';
		chrome.storage.sync.set({selectedProject: value});
		startButtonEnable();
	}

	function setSelectedCategory(value: string) {
		selectedCategory = value;
		categorySearch.value = categories.find(category => category._id === value)?.name || '';
		chrome.storage.sync.set({selectedCategory});

		startButtonEnable();
	}

	function startButtonEnable() {
		const disabled = !(selectedProject && selectedCategory);

		if (disabled) {
			startButton.classList.replace(startTime ? 'bg-green-500' : 'bg-red-500', 'bg-gray-500');
		} else {
			if (startTime) {
				startButton.classList.replace('bg-gray-300', 'bg-red-500');
			} else {
				startButton.classList.replace('bg-gray-300', 'bg-green-500');
			}
		}

		startButton.disabled = disabled;
	}

	function updateTimer() {
		if (startTime) {
			const now = new Date();
			const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
			const hours = Math.floor(elapsed / 3600);
			const minutes = Math.floor((elapsed % 3600) / 60);
			const seconds = elapsed % 60;
			timer.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
			timerSeconds.textContent = `${String(seconds).padStart(2, '0')}`;
		}
	}


	function resetForm() {
		chrome.storage.sync.remove(['startTime', 'selectedProject', 'selectedCategory']);

		startTime = null;
		timer.textContent = '00:00';
		timerSeconds.textContent = '00';

		selectedProject = null;
		selectedCategory = null;

		projectSearch.value = "";
		categorySearch.value = "";

		startButton.disabled = true;
		startButton.classList.replace('bg-green-500', 'bg-gray-300');
		startButton.classList.replace('bg-red-500', 'bg-gray-300');
	}

	async function fetchProjectsAndCategories(apiToken: string) {
		try {
			chrome.runtime.sendMessage(
				{action: "fetchProjectsAndCategories", data: {apiToken}},
				async (response) => {
					if (response?.error) {
						message.textContent = 'Error fetching data: ' + response.error;
					} else {
						initializeDropdowns();
					}
				}
			);
		} catch (error) {
			message.textContent = 'Error fetching user data: ' + (error as Error).message;
		}
	}
});
