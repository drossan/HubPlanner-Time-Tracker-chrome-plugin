import { Dispatch, SetStateAction } from "react";

import useReloadData from "@hooks/useReloadDatabase.ts";
import {
	DataTypesReloadData,
	RecentTask,
	TimeEntriesDayOfWeek,
	TimeEntriesWeek,
	TimeEntry,
} from "@projectTypes";
import IconButtonWithTooltip from "@ui/components/IconButtonWithTooltip";

interface RecentTasksSectionProps {
	apiToken: string;
	tab: number;
	recentTask: RecentTask;
	setTab: Dispatch<SetStateAction<number>>;
	setLoading: Dispatch<SetStateAction<boolean>>;
}

const RecentTasksSection = ({
	apiToken,
	tab,
	recentTask,
	setTab,
	setLoading,
}: RecentTasksSectionProps) => {
	const reloadData = useReloadData();

	const groupProjectsByCategory = (entries: TimeEntry[]) => {
		const grouped: { [key: string]: TimeEntry } = {};
		entries.forEach((entry: TimeEntry) => {
			const key = `${entry.project}-${entry.categoryTemplateId}`;
			if (grouped[key]) {
				grouped[key].minutes += entry.minutes;
			} else {
				grouped[key] = { ...entry };
			}
		});
		return Object.values(grouped);
	};

	const minutesToHoursMinutes = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const options = { weekday: "long", day: "numeric", month: "long" } as const;
		return date.toLocaleDateString("es-ES", options);
	};

	const handleSyncRecentTask = () => {
		setLoading(true);
		reloadData({
			apiToken: apiToken,
			action: DataTypesReloadData.RECENT_TASK,
		}).finally(() => {
			setLoading(false);
		});
	};

	return (
		<section className="my-2 mx-4 bg-white">
			<div
				className="px-4 py-4 flex justify-between items-center gap-x-2 js-toggle cursor-pointer border rounded"
				onClick={() => setTab(2)}
			>
				<div className="flex items-center gap-x-2">
					<img src="/images/recent-tasks.png" alt="recent-tasks" width="16px" />
					<span className="text-sm font-medium">Tareas recientes</span>
				</div>
				<IconButtonWithTooltip
					onClick={() => apiToken && handleSyncRecentTask()}
					image="images/reload.png"
					alt="Sync recent task"
					width="16px"
					tooltip="Sincroniza tareas recientes con HubPLanner"
				/>
			</div>

			<div
				className={`${tab !== 2 ? "hidden" : ""} overflow-y-auto max-h-250px`}
			>
				{recentTask?.items?.length ? (
					recentTask.items.map((timeEntriesWeek: TimeEntriesWeek) => (
						<div
							key={timeEntriesWeek.week}
							className="mb-4 border border-gray-200"
						>
							<h2 className="bg-gray-300 py-4 px-4 flex items-center justify-between">
								{timeEntriesWeek.week}
								<span>Total: ({timeEntriesWeek.total_time})</span>
							</h2>
							<ul>
								{timeEntriesWeek.items
									.sort(
										(a: TimeEntriesDayOfWeek, b: TimeEntriesDayOfWeek) =>
											new Date(b.day_of_week).getTime() -
											new Date(a.day_of_week).getTime(),
									)
									.map((day: TimeEntriesDayOfWeek) => (
										<li
											key={day.day_of_week}
											className="border-b border-gray-200"
										>
											<strong className="bg-gray-100 py-4 px-4 flex items-center justify-between">
												{formatDate(day.day_of_week)}
												<span>Total: ({day.total_time})</span>
											</strong>
											<ul className="flex flex-col">
												{groupProjectsByCategory(day.items).map(
													(entry: TimeEntry) => (
														<li
															key={entry.projectName}
															className="p-4 border-b border-gray-200 flex items-center justify-between"
														>
															<div className="flex flex-col justidy-start">
																<span>{entry.projectName}</span>
																<span className="text-gray-300">
																	{entry.categoryName}
																</span>
															</div>
															<span>
																{minutesToHoursMinutes(entry.minutes)}
															</span>
														</li>
													),
												)}
											</ul>
										</li>
									))}
							</ul>
						</div>
					))
				) : (
					<div>No recent tasks found</div>
				)}
			</div>
		</section>
	);
};

export default RecentTasksSection;
