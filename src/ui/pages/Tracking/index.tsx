import { Dispatch, SetStateAction, useEffect, useState } from "react";

import useReloadData from "@hooks/useReloadDatabase.ts";
import {
	Projects,
	Categories,
	RecentTask,
	DataTypesReloadData,
} from "@projectTypes";
import RecentTasksSection from "@ui/components/RecentTasksSection";
import TimerSection from "@ui/components/TimerSection";
import LayoutApp from "@ui/layout/App.tsx";

type OptionsProps = {
	apiToken?: string;
	setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

const Tracking = ({apiToken, setIsLoggedIn}: OptionsProps) => {
	const [loading, setLoading] = useState<boolean>(false);

	const [projects, setProjects] = useState<Projects>([]);
	const [categories, setCategories] = useState<Categories>([]);
	const [recentTask, setRecentTask] = useState<RecentTask>({
		items: [],
		totalItems: 0,
	});
	const [selectedProject, setSelectedProject] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
		null,
	);

	const [tab, setTab] = useState(1);

	const reloadData = useReloadData();

	useEffect(() => {
		chrome.storage.sync.get(
			[
				"apiToken",
				"userEmail",
				"startTime",
				"selectedProject",
				"selectedCategory",
			],
			async (data) => {
				const {
					apiToken,
					userEmail,
					startTime: storedStartTime,
					selectedProject: storageProject,
					selectedCategory: storageCategory,
				} = data;

				setSelectedProject(storageProject);
				setSelectedCategory(storageCategory);

				if (!apiToken || !userEmail) {
					return;
				}

				if (storedStartTime) {
					setStartTime(new Date(storedStartTime));
				}

				chrome.storage.local.get([
					"recentTasks",
					"projects",
					"categories",
				], async (localData) => {
					const {
						projects: storedProjects,
						categories: storedCategories,
						recentTasks: storedRecentTasks,
					} = localData;

					console.log({
						apiToken,
						localData
					})

					if (!apiToken) {
						return;
					}


					if (storedProjects) {
						setProjects(storedProjects);
					}

					if (storedCategories) {
						setCategories(storedCategories);
					}

					if (storedRecentTasks) {
						setRecentTask(storedRecentTasks);
					}

					if (!storedProjects || !storedCategories || !storedRecentTasks) {
						setLoading(true);
						await reloadData({
							apiToken: apiToken,
							action: DataTypesReloadData.ALL,
						})
						setLoading(false);
					}
				});
			},
		);

	}, []);


	useEffect(() => {
		const handleStorageChange = (
			changes: { [key: string]: chrome.storage.StorageChange },
			areaName: "sync" | "local"
		) => {
			if (areaName === "local") {
				if (changes.projects) {
					const newProjects = changes.projects.newValue;
					setProjects(newProjects);
				}

				if (changes.categories) {
					const newCategories = changes.categories.newValue;
					setCategories(newCategories);
				}

				if (changes.recentTasks) {
					const newRecentTasks = changes.recentTasks.newValue;
					setRecentTask(newRecentTasks);
				}

			}
		};

		//@ts-ignore
		chrome.storage.onChanged.addListener(handleStorageChange);

		return () => {
			//@ts-ignore
			chrome.storage.onChanged.removeListener(handleStorageChange);
		};
	}, []);

	useEffect(() => {
		chrome.storage.sync.set({
			startTime: startTime?.toISOString() || null,
		});
	}, [startTime]);

	return (
		<LayoutApp
			apiToken={apiToken!}
			setIsLoggedIn={setIsLoggedIn}
			loading={loading}
			setLoading={setLoading}
		>
			{apiToken && (
				<>
					<TimerSection
						apiToken={apiToken}
						projects={projects}
						categories={categories}
						selectedProject={selectedProject}
						setSelectedProject={setSelectedProject}
						selectedCategory={selectedCategory}
						setSelectedCategory={setSelectedCategory}
						startTime={startTime}
						setStartTime={setStartTime}
						timerInterval={timerInterval}
						setTimerInterval={setTimerInterval}
						tab={tab}
						indexTab={1}
						setTab={setTab}
						setLoading={setLoading}
					/>
					<RecentTasksSection
						apiToken={apiToken}
						tab={tab}
						indexTab={2}
						recentTask={recentTask}
						setTab={setTab}
						setLoading={setLoading}
						setStartTime={setStartTime}
						setSelectedProject={setSelectedProject}
						setSelectedCategory={setSelectedCategory}
					/>
				</>
			)}
		</LayoutApp>
	);
};

export default Tracking;
