export type Task = {
	id: string;
	title: string;
	description: string;
	completed: boolean;
};

export type CreateTaskDTO = {
	title: string;
	description: string | undefined;
};
