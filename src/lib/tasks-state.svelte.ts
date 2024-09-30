import { getContext, setContext } from 'svelte';

import type { List, Task } from '$lib/api';

export class TasksState {
	tasks = $state<Task[]>([]);
	lists = $state<List[]>([]);

	selectedTaskID = $state<string | null>(null);
	selectedTask = $derived.by(() => {
		const selectedTaskID = this.selectedTaskID;
		if (selectedTaskID) {
			const found = this.tasks.find((task) => selectedTaskID === task.id);
			if (found) return found;
		}
		return null;
	});
	selectedTaskList = $derived.by(() => {
		const selectedTask = this.selectedTask;
		if (selectedTask) {
			const found = this.lists.find((list) => selectedTask.list_id === list.id);
			if (found) return found;
		}
		return null;
	});

	constructor() {}

	init(initialState: Task[]) {
		this.tasks = initialState;
	}

	reset() {
		this.tasks = [];
	}

	update(t: Task) {
		this.tasks = this.tasks.map((task) => {
			if (t.id === task.id) {
				return t;
			}
			return task;
		});
	}

	add(t: Task) {
		this.tasks = [t, ...this.tasks];
	}

	remove(t: Task) {
		this.tasks = this.tasks.filter((task) => t.id !== task.id);
	}
}

const TASKS_KEY = Symbol('TASKS_STATE');
export function setTasksState() {
	return setContext(TASKS_KEY, new TasksState());
}
export function getTasksState() {
	return getContext<ReturnType<typeof setTasksState>>(TASKS_KEY);
}
