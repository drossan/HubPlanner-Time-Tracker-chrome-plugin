export interface TimeEntry {
	_id: string;
	project: string;
	projectName: string;
	date?: string;
	minutes: number;
	categoryTemplateId: string;
	categoryName: string;
}

export type TimeEntryAdd = {
	project: TimeEntry['project'];
	date: TimeEntry['date'];
	minutes: TimeEntry['minutes'];
	categoryTemplateId: TimeEntry['categoryTemplateId'];
}

interface TimeEntriesDayOfWeek {
	total_time: string;
	day_of_week: string;
	items: TimeEntry[];
}

export interface TimeEntriesWeek {
	total_time: string;
	week: string;
	items: TimeEntriesDayOfWeek[];
}

export interface TimeEntries {
	totalItems: number;
	items: TimeEntriesWeek[];
}

export type RecentTask = TimeEntries;

export type Project = {
	_id: string
	name: string
}

export type Projects = Project[]

export type Category = {
	_id: string
	name: string
	type?: string
	gridColor?: string
	createdDate?: string
	updatedDate?: string
}

export type Categories = Category[]

export enum DataTypesReloadData {
	'ALL' = 'all',
	'PROJECTS_AND_CATEGORIES' = 'fetchProjectsAndCategories',
	'RECENT_TASK' = 'fetchRecentTasks',
	'ADD_TASK' = 'addTask',
}