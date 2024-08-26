export enum ProjectTypes {
	EVENT = "EVENT",
	REGULAR = "REGULAR",
}

export enum StatusEntry {
	SUBMITTED = "SUBMITTED",
	APPROVED = "APPROVED",
	UNSUBMITTED = "UNSUBMITTED",
	PENDING = "PENDING",
}

export interface TimeEntry {
	_id: string;
	project: string;
	projectName: string;
	projectType: ProjectTypes;
	date?: string;
	minutes: number;
	categoryTemplateId: string;
	categoryName: string;
	status: StatusEntry;
	note: string | null;
}

export type TimeEntryAdd = {
	project: TimeEntry['project'];
	date: TimeEntry['date'];
	minutes: TimeEntry['minutes'];
	categoryTemplateId: TimeEntry['categoryTemplateId'];
	note: TimeEntry['note'];
}

export type TimeEntryClone = {
	project: TimeEntry['project'];
	categoryTemplateId: TimeEntry['categoryTemplateId'];
}

interface TimeEntriesDayOfWeek {
	total_time: string;
	total_time_in_minutes: number;
	day_of_week: string;
	items: TimeEntry[];
}

export interface TimeEntriesWeek {
	total_time: string;
	total_time_in_minutes: number;
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
	'LOGIN' = 'login',
	'LOGIN_AUTH_GOOGLE' = 'loginAuthGoogle',
	'REFRESH_TOKEN' = 'refreshToken',
	'PROJECTS_AND_CATEGORIES' = 'fetchProjectsAndCategories',
	'RECENT_TASK' = 'fetchRecentTasks',
	'ADD_TASK' = 'addTask',
	'SUBMIT_TASK' = 'submitTask',
}

export interface ApiResponse {
	status?: boolean;
	location?: string;
	token?: string;
	refresh_token?: string;
	code?: string;
	error?: string;
	message?: string;
	version?: string;
}

export interface ApiResponseAuthGoogle {
	userEmail?: boolean;
	token?: string;
	refresh_token?: string;
	code?: string;
	error?: string;
	message?: string;
}


export interface BodyLogin {
	username: string;
	password: string;
}

export interface BodyLoginAuthGoogle {
	idToken: string;
}
