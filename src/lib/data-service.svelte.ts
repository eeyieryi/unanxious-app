import { getContext, onMount, setContext } from 'svelte';

import { applyUpdate, Doc } from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';

import { SyncService } from '$lib/sync.svelte';
import { getUnixEpochFromNow } from '$lib/datetime';

class AppState {
	tasks = $state<Task[]>([]);
	lists = $state<List[]>([]);
	timers = $state<Timer[]>([]);
	timerIntervals = $state<TimerInterval[]>([]);

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

	updateTask(t: Task) {
		this.tasks = this.tasks.map((task) => {
			if (t.id === task.id) {
				return t;
			}
			return task;
		});
	}
}

export class AppDataService {
	readonly doc: Doc;
	readonly state: AppState;
	readonly syncService: SyncService;

	readonly listsMap;
	readonly tasksMap;
	readonly timersMap;
	readonly timerIntervalsMap;

	constructor() {
		this.doc = new Doc();
		this.state = new AppState();
		this.syncService = new SyncService(
			this.doc,
			'demo-demo-demo' // Change this
		);

		this.listsMap = this.doc.getMap<List>('lists');
		this.tasksMap = this.doc.getMap<Task>('tasks');
		this.timersMap = this.doc.getMap<Timer>('timers');
		this.timerIntervalsMap = this.doc.getMap<TimerInterval>('timer_intervals');

		this.doc.on('update', (update) => {
			applyUpdate(this.doc, update);
		});

		this.listsMap.observe((event) => {
			if (event.keysChanged.size !== 0) {
				this.state.lists = Array.from(this.listsMap.values());
			}
		});
		this.tasksMap.observe((event) => {
			if (event.keysChanged.size !== 0) {
				this.state.tasks = Array.from(this.tasksMap.values());
			}
		});

		this.timersMap.observe((event) => {
			if (event.keysChanged.size !== 0) {
				this.state.timers = Array.from(this.timersMap.values());
			}
		});

		this.timerIntervalsMap.observe((event) => {
			if (event.keysChanged.size !== 0) {
				this.state.timerIntervals = Array.from(this.timerIntervalsMap.values());
			}
		});

		onMount(() => {
			this.enablePersist();
		});
	}

	enablePersist() {
		const indexeddbProvider = new IndexeddbPersistence('unanxious-app-idxdb', this.doc);
		indexeddbProvider.whenSynced.then(() => {
			console.log('loaded data from indexed db');
		});
	}

	createList(name: string, id?: string): List {
		const list: List = {
			id: id ?? crypto.randomUUID(),
			name: name,
			created_at: getUnixEpochFromNow(),
			updated_at: getUnixEpochFromNow()
		};
		return this.listsMap.set(list.id, list);
	}

	createTask(name: string, listID: string): Task {
		const task: Task = {
			id: crypto.randomUUID(),
			name: name,
			created_at: getUnixEpochFromNow(),
			updated_at: getUnixEpochFromNow(),
			list_id: listID,
			completed: false,
			description: '',
			due_at: null
		};
		return this.tasksMap.set(task.id, task);
	}

	createTimer(name: string) {
		const timer: Timer = {
			id: crypto.randomUUID(),
			name: name,
			task_id: null,
			created_at: getUnixEpochFromNow(),
			updated_at: getUnixEpochFromNow()
		};
		return this.timersMap.set(timer.id, timer);
	}

	fetchListTasks(listID: string): Task[] {
		const listTasks: Task[] = [];
		for (const task of this.tasksMap.values()) {
			if (task.list_id === listID || listID === 'all') {
				listTasks.push(task);
			}
		}
		return listTasks;
	}

	updateTask(t: Task): Task {
		return this.tasksMap.set(t.id, t);
	}

	fetchLastTimerInterval(t: Timer | null): TimerInterval | null {
		const timerID = t ? t.id : 'focus';

		let lastTimerInterval: TimerInterval | null = null;
		for (const ti of this.timerIntervalsMap.values()) {
			if (ti.timer_id === timerID) {
				if (!lastTimerInterval) {
					lastTimerInterval = ti;
				} else {
					if (ti.start_time > lastTimerInterval.start_time) {
						lastTimerInterval = ti;
					}
				}
			}
		}
		return lastTimerInterval;
	}

	toggleTimer(t: Timer | null): TimerInterval {
		const timerID = t ? t.id : 'focus';
		const lastTimerInterval = this.fetchLastTimerInterval(t);

		if (lastTimerInterval && lastTimerInterval.end_time === null) {
			return this.timerIntervalsMap.set(lastTimerInterval.id, {
				...lastTimerInterval,
				end_time: getUnixEpochFromNow()
			});
		}

		const timerInterval: TimerInterval = {
			id: crypto.randomUUID(),
			start_time: getUnixEpochFromNow(),
			end_time: null,
			task_id: null,
			timer_id: timerID
		};
		return this.timerIntervalsMap.set(timerInterval.id, timerInterval);
	}

	attachTaskToTimer(t: Timer, task: Task) {
		return this.timersMap.set(t.id, { ...t, task_id: task.id });
	}
}

const APP_DATA_SERVICE_KEY = Symbol('APP_DATA_SERVICE');
export function setAppDataService() {
	return setContext(APP_DATA_SERVICE_KEY, new AppDataService());
}
export function getAppDataService() {
	return getContext<ReturnType<typeof setAppDataService>>(APP_DATA_SERVICE_KEY);
}

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

export interface Timer {
	id: string;
	name: string;
	task_id: string | null;
	created_at: number;
	updated_at: number;
}

export interface TimerInterval {
	id: string;
	timer_id: string | null;
	task_id: string | null;
	start_time: number;
	end_time: number | null;
}
