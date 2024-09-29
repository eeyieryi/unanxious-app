import { derived, writable } from 'svelte/store';

import type { List, Task } from '$lib/api';

export type TasksStore = ReturnType<typeof createTasksStore>;
export function createTasksStore() {
	const { set, subscribe, update } = writable<Task[]>([]);

	return {
		set,
		subscribe,
		update,

		init: (initialState: Task[]) => {
			set(initialState);
		},

		reset: () => {
			update(() => {
				return [];
			});
		},

		updateTask: (t: Task) => {
			update((tasks) => {
				return tasks.map((task) => {
					if (task.id === t.id) {
						return t;
					}
					return task;
				});
			});
		},
		addTask: (t: Task) => {
			update((tasks) => {
				return [t, ...tasks];
			});
		},
		removeTask: (t: Task) => {
			update((tasks) => {
				return tasks.filter((task) => {
					return task.id !== t.id;
				});
			});
		}
	};
}

export const tasksStore: TasksStore = createTasksStore();
export const selectedTaskID = writable<string | null>(null);
export const selectedTask = derived([tasksStore, selectedTaskID], ([tasks, selectedTaskID]) => {
	if (selectedTaskID) {
		const found = tasks.find((task) => task.id === selectedTaskID);
		if (found) return found;
	}
	return null;
});

export const listsStore = writable<List[]>([]);
export const taskList = derived([listsStore, selectedTask], ([lists, selectedTask]) => {
	if (selectedTask) {
		const found = lists.find((l) => l.id === selectedTask.list_id);
		if (found) return found;
	}
	return null;
});
