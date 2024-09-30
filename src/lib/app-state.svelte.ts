import { getContext, setContext } from 'svelte';

import type { List, Task } from '$lib/api';

export class AppState {
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

const API_STATE_KEY = Symbol('API_STATE');
export function setAppState() {
	return setContext(API_STATE_KEY, new AppState());
}
export function getAppState() {
	return getContext<ReturnType<typeof setAppState>>(API_STATE_KEY);
}
