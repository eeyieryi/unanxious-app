export interface Task {
	id: string;
	name: string;
	description: string;
	completed: boolean;
	due_at: number | null;
	list_id: string;
	created_at: number;
	updated_at: number;
}

export interface List {
	id: string;
	name: string;
	created_at: number;
	updated_at: number;
}
