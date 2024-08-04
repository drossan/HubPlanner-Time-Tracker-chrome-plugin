interface TimeEntry {
	_id: string;
	project: string;
	project_name: string;
	date?: string;
	minutes: number;
	categoryTemplateId: string;
	categoryName: string;
}

interface TimeEntriesDayOfWeek {
	total_time: string;
	day_of_week: string;
	items: TimeEntry[];
}

interface TimeEntriesWeek {
	total_time: string;
	week: string;
	items: TimeEntriesDayOfWeek[];
}

interface TimeEntries {
	totalItems: number;
	items: TimeEntriesWeek[];
}

// Definición de recentTask
type RecentTask = TimeEntries;
