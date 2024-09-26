import { derived, writable } from 'svelte/store';
import type { Task } from '$lib/api';

function createTasksStore() {
	const { set, subscribe, update } = writable<Task[]>();

	return {
		set,
		subscribe,
		update,

		init: (initialState: Task[]) => {
			set(initialState);
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
		}
	};
}

export const tasksStore = createTasksStore();
export const selectedTaskID = writable<string | null>(null);
export const selectedTask = derived([tasksStore, selectedTaskID], ([tasks, selectedTaskID]) => {
	return selectedTaskID
		? tasks
			? tasks.length > 0
				? tasks.find((task) => task.id === selectedTaskID)
				: null
			: null
		: null;
});
