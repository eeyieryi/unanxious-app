import { SvelteMap } from 'svelte/reactivity';

import { Map as YMap } from 'yjs';
import {
	addWeeks,
	fromUnixTime,
	isBefore,
	isPast,
	isSameMonth,
	isToday,
	isTomorrow,
	startOfToday,
	startOfTomorrow
} from 'date-fns';

import { getUnixEpochFromNow } from '$lib/datetime';

import type { List, Task } from '../models';

class TasksState {
	tasks = $state(new SvelteMap<string, Task>());
	lists = $state(new SvelteMap<string, List>());

	selectedListID = $state<string>('today');
	selectedTaskID = $state<string | null>(null);

	constructor() {}

	readonly selectedList = $derived.by(() => {
		const listID = this.selectedListID;
		if (listID) {
			const found = this.lists.get(listID);
			if (found) return found;
		}
		return null;
	});

	readonly selectedListTasks = $derived.by(() => {
		const listID = this.selectedListID;
		const tasks = Array.from(this.tasks.values());
		switch (listID) {
			case 'all':
				return tasks;
			case 'due':
				return tasks.filter((task) => {
					if (task.due_at) {
						return isBefore(fromUnixTime(task.due_at), startOfToday());
					}
					return false;
				});
			case 'today':
				return tasks.filter((task) => {
					if (task.due_at) {
						return isToday(fromUnixTime(task.due_at));
					}
					return false;
				});
			case 'tomorrow':
				return tasks.filter((task) => {
					if (task.due_at) {
						return isTomorrow(fromUnixTime(task.due_at));
					}
					return false;
				});
			case 'next-seven-days':
				return tasks.filter((task) => {
					if (task.due_at) {
						const dueAt = fromUnixTime(task.due_at);
						return (
							!isPast(dueAt) && !isToday(dueAt) && isBefore(dueAt, addWeeks(startOfTomorrow(), 1))
						);
					}
					return false;
				});
			case 'this-month':
				return tasks.filter((task) => {
					if (task.due_at) {
						const dueAt = fromUnixTime(task.due_at);
						return isSameMonth(startOfToday(), dueAt);
					}
					return false;
				});
			default:
				return tasks.filter((task) => task.list_id === listID);
		}
	});

	readonly selectedTask = $derived.by(() => {
		const taskID = this.selectedTaskID;
		if (taskID) {
			const found = this.tasks.get(taskID);
			if (found) return found;
		}
		return null;
	});

	readonly selectedTaskList = $derived.by(() => {
		const task = this.selectedTask;
		if (task) {
			const found = this.lists.get(task.list_id);
			if (found) return found;
		}
		return null;
	});
}

export class TasksService {
	readonly listsMap;
	readonly tasksMap;
	readonly state;
	constructor(listsMap: YMap<List>, tasksMap: YMap<Task>) {
		this.listsMap = listsMap;
		this.tasksMap = tasksMap;
		this.state = new TasksState();

		this.listsMap.observe((event) => {
			event.changes.keys.forEach((value, listID, _changesMap) => {
				switch (value.action) {
					case 'add':
					case 'update': {
						const updatedList = this.listsMap.get(listID)!;
						this.state.lists.set(listID, updatedList);
						break;
					}
					case 'delete': {
						this.state.lists.delete(listID);
						break;
					}
					default:
						throw new Error(`unknown action: ${value.action}`);
				}
			});
		});

		this.tasksMap.observe((event) => {
			event.changes.keys.forEach((value, taskID, _changesMap) => {
				switch (value.action) {
					case 'add':
					case 'update': {
						const updatedTask = this.tasksMap.get(taskID)!;
						this.state.tasks.set(taskID, updatedTask);
						break;
					}
					case 'delete': {
						this.state.tasks.delete(taskID);
						break;
					}
					default:
						throw new Error(`unknown action: ${value.action}`);
				}
			});
		});
	}

	createList(payload: { name: string }): List {
		const list: List = {
			id: crypto.randomUUID(),
			name: payload.name,
			created_at: getUnixEpochFromNow(),
			updated_at: getUnixEpochFromNow()
		};
		return this.listsMap.set(list.id, list);
	}

	deleteList(payload: { listID: string }): void {
		Array.from(this.state.tasks.values())
			.filter((task) => task.list_id === payload.listID)
			.map((task) => task.id)
			.forEach((taskID) => {
				this.tasksMap.delete(taskID);
			});
		this.listsMap.delete(payload.listID);
	}

	createTask(payload: { name: string; listID: string }): Task {
		const task: Task = {
			id: crypto.randomUUID(),
			name: payload.name,
			created_at: getUnixEpochFromNow(),
			updated_at: getUnixEpochFromNow(),
			list_id: payload.listID,
			completed: false,
			description: '',
			due_at: null
		};
		return this.tasksMap.set(task.id, task);
	}

	updateTask(payload: { task: Task }): Task {
		return this.tasksMap.set(payload.task.id, payload.task);
	}

	deleteTask(payload: { taskID: string }): void {
		return this.tasksMap.delete(payload.taskID);
	}
}
