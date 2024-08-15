import TitleTab from "@ui/components/TitleTab";
import { Dispatch, SetStateAction, useCallback } from "react";
import Icon from '@mdi/react';
import {
	mdiShapeOutline,
	mdiPlayCircleOutline,
	mdiCheck,
	mdiSendVariantOutline,
	mdiHistory,
	mdiReload, mdiNote,
} from '@mdi/js';

import useReloadData from "@hooks/useReloadDatabase.ts";
import {
	DataTypesReloadData,
	RecentTask, StatusEntry,
	TimeEntriesDayOfWeek,
	TimeEntriesWeek,
	TimeEntry, TimeEntryClone,
} from "@projectTypes";
import IconButtonWithTooltip from "@ui/components/IconButtonWithTooltip";

interface RecentTasksSectionProps {
	apiToken: string;
	tab: number;
	indexTab: number;
	recentTask: RecentTask;
	setTab: Dispatch<SetStateAction<number>>;
	setLoading: Dispatch<SetStateAction<boolean>>;
	setStartTime: (startTime: Date | null) => void;
	setSelectedProject: (project: string | null) => void;
	setSelectedCategory: (category: string | null) => void;
}

const RecentTasksSection = ({
	apiToken,
	tab,
	indexTab,
	recentTask,
	setTab,
	setLoading,
	setStartTime,
	setSelectedProject,
	setSelectedCategory,
}: RecentTasksSectionProps) => {
	const reloadData = useReloadData();

	const groupProjectsByCategory = (entries: TimeEntry[]) => {
		const grouped: { [key: string]: TimeEntry } = {};
		entries.forEach((entry: TimeEntry) => {
			const key = `${entry.project}-${entry.categoryTemplateId}`;
			if (grouped[key]) {
				grouped[key].minutes += entry.minutes;
			} else {
				grouped[key] = {...entry};
			}
		});
		return Object.values(grouped);
	};

	const formatTime = (hours: number, minutes: number) => {
		if (hours > 0 && minutes > 0) {
			return `${hours}h ${minutes}m`;
		} else if (hours > 0) {
			return `${hours}h`;
		} else if (minutes > 0) {
			return `${minutes}m`;
		} else {
			return '0m';
		}
	};

	const minutesToHoursMinutes = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;

		return formatTime(hours, mins);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const options = {weekday: "long", day: "numeric", month: "long"} as const;
		return date.toLocaleDateString("es-ES", options);
	};

	const handleSyncRecentTask = async () => {
		setLoading(true);
		await reloadData({
			apiToken: apiToken,
			action: DataTypesReloadData.RECENT_TASK,
		})
		setLoading(false);
	};

	const startTask = useCallback(({project, categoryTemplateId}: TimeEntryClone) => {
		setSelectedProject(project)
		setSelectedCategory(categoryTemplateId)
		setStartTime(new Date());
		setTab(1)
	}, [])

	const handleSubmitTask = useCallback(async (entryID: TimeEntry['_id']) => {
		setLoading(true);
		await reloadData({
			apiToken: apiToken,
			action: DataTypesReloadData.SUBMIT_TASK,
			body: entryID,
		})
		setLoading(false);
	}, [reloadData])

	return (
		<section className="my-1 mx-4 bg-white border  rounded">
			<div
				className="px-4 py-2 titleTab flex justify-between items-center gap-x-2 js-toggle cursor-pointer"
				onClick={() => setTab(tab !== indexTab ? indexTab : 0)}
			>
				<TitleTab
					tab={tab}
					indexTab={2}
					iconPath={mdiHistory}
					text="Tareas recientes"
				/>

				<IconButtonWithTooltip
					onClick={() => apiToken && handleSyncRecentTask()}
					iconPath={mdiReload}
					tooltip="Sincroniza tareas recientes con Hub PLanner"
				/>
			</div>

			<div
				className={`${tab !== indexTab ? "hidden" : ""} overflow-y-auto max-h-250px`}
			>
				{recentTask?.items?.length ? (
					recentTask.items.map((timeEntriesWeek: TimeEntriesWeek) => (
						<div
							key={timeEntriesWeek.week}
							className="mb-4 "
						>
							<h2 className="py-2 px-4 text-sm flex items-center justify-between border-b border-gray-200">
								{timeEntriesWeek.week}
								<span
									className={`${timeEntriesWeek.total_time_in_minutes >= 1920 ? 'bg-green-200' : 'bg-amber-200' }  px-2 py-1 text-xs rounded-2xl`}>{timeEntriesWeek.total_time}</span>
							</h2>
							<ul>
								{timeEntriesWeek.items
									.sort(
										(a: TimeEntriesDayOfWeek, b: TimeEntriesDayOfWeek) =>
											new Date(b.day_of_week).getTime() -
											new Date(a.day_of_week).getTime(),
									)
									.map((day: TimeEntriesDayOfWeek) => (
										<li key={day.day_of_week}>
											<p
												className="py-2 px-4 flex items-center justify-between bg-gray-100 text-xs font-light">
												{formatDate(day.day_of_week)}
												<span
													className="bg-gray-200 px-2 py-1 text-xs rounded-2xl">{day.total_time}</span>
											</p>
											<ul className="flex-col cursor-pointer">
												{groupProjectsByCategory(day.items).map(
													({
														_id,
														projectName,
														project,
														categoryName,
														categoryTemplateId,
														minutes,
														status,
														note
													}: TimeEntry) => (
														<li
															key={projectName}
															className="px-4 py-2 hover:bg-gray-50 flex items-center justify-between"
														>
															<div className="flex items-center gap-x-3">
																<button
																	className="p-1 hover:text-green-500 border rounded-full border-transparent hover:bg-green-100"
																	onClick={() => startTask({
																		project,
																		categoryTemplateId
																	})}
																>
																	<Icon path={mdiPlayCircleOutline}
																	      title="Start time"
																	      size={.8}
																	      className="text-green-300 cursor-pointer"
																	/>
																</button>

																<div className="flex flex-col justidy-start">
																	<div className="flex items-center gap-x-1">
																		<Icon path={mdiShapeOutline}
																		      title="Category"
																		      size={0.5}
																		      className="text-gray-400"
																		/>
																		<span className="text-gray-400">
																		{categoryName}
																		</span>
																		{
																			note && (
																				<IconButtonWithTooltip
																					iconPath={mdiNote}
																					iconColor="text-gray-300"
																					tooltip={note}
																					positionX="center"
																				/>
																			)
																		}
																	</div>
																	<span>{projectName}</span>
																</div>
															</div>

															<div className="flex items-center gap-x-1">
															<span className="flex">
																{minutesToHoursMinutes(minutes)}
															</span>
																{status !== StatusEntry.SUBMITTED
																	? <IconButtonWithTooltip
																		onClick={() => handleSubmitTask(_id)}
																		iconPath={mdiSendVariantOutline}
																		iconColor="text-amber-300"
																		tooltip="Completar tarea"
																		iconRotate={-45}
																		iconSize={.6}
																	/>
																	: <Icon
																		path={mdiCheck}
																		size={0.8}
																		className="text-green-700"
																	/>
																}
															</div>
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
