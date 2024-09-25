type Task = {
	id: string;
	title: string;
	description: string;
	completed: boolean;
};

type CreateTaskDTO = {
	title: string;
	description: string | undefined;
};
