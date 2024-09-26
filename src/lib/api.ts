import moment from 'moment';

export type Task = {
	id: string;
	title: string;
	description: string;
	completed: boolean;
	due_at: number | null; // Unix epoch
};

export type CreateTaskDTO = {
	title: string;
	description: string | undefined;
};

export function formatDueAt(seconds: number): string {
	return moment().to(new Date(seconds * 1000));
}
