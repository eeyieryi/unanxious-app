import moment from 'moment';

export type Task = {
	id: string;
	title: string;
	description: string;
	completed: boolean;
	due_at: number | null; // Unix epoch
	list_id: string | null;
};

export type CreateTaskDTO = {
	title: string;
	description: string | undefined;
	list_id: string | undefined;
};

export type List = {
	id: string;
	title: string;
};

export type ListWithTasks = {
	list: List;
	list_tasks: Task[];
};

export function formatDueAt(seconds: number): string {
	return moment().to(new Date(seconds * 1000));
}
