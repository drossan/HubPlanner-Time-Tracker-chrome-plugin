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

const Tracking = ({ apiToken, setIsLoggedIn }: OptionsProps) => {
	const [loading, setLoading] = useState<boolean>(false);

	const [hasData, setHasData] = useState<boolean>(false);
	const [projects, setProjects] = useState<Projects>([]);
	const [categories, setCategories] = useState<Categories>([]);
	const [recentTask, setRecentTask] = useState<RecentTask>({
		items: [],
		totalItems: 0,
	});
	const [selectedProject, setSelectedProject] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [timerInterval, setTimerInterval] = useState<number | null>(null);

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
				"projects",
				"categories",
				"recentTasks",
			],
			async (data) => {
				const {
					apiToken,
					userEmail,
					startTime: storedStartTime,
					selectedProject: storageProject,
					selectedCategory: storageCategory,
					projects: storedProjects,
					categories: storedCategories,
					recentTasks: storedRecentTasks,
				} = data;

				setSelectedProject(storageProject);
				setSelectedCategory(storageCategory);

				if (!apiToken || !userEmail) {
					return;
				}

				if (storedStartTime) {
					setStartTime(new Date(storedStartTime));
				}

				if (storedProjects && storedCategories & storedRecentTasks) {
					setProjects(storedProjects);
					setCategories(storedCategories);
					setRecentTask(storedRecentTasks);
				} else {
					reloadData({
						apiToken: apiToken,
						action: DataTypesReloadData.ALL,
					})
						.then(() => setHasData(true))
						.finally(() => {
							setLoading(false);
						});
				}
			},
		);
	}, [hasData]);

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
						setTab={setTab}
						setLoading={setLoading}
					/>
					<RecentTasksSection
						apiToken={apiToken}
						tab={tab}
						recentTask={recentTask}
						setTab={setTab}
						setLoading={setLoading}
					/>
				</>
			)}
		</LayoutApp>
	);
};

export default Tracking;
