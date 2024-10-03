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
	selectedListID = $state<string>('inbox');
	selectedTimerID = $state<string | null>(null);

	selectedList = $derived.by(() => {
		const listID = this.selectedListID;
		if (listID) {
			const found = this.lists.find((list) => listID === list.id);
			if (found) return found;
		}
		return null;
	});
	selectedListTasks = $derived(
		this.tasks.filter((task) => {
			if (this.selectedListID === 'all') {
				return true;
			}
			return task.list_id === this.selectedListID;
		})
	);
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

	selectedTimer = $derived.by(() => {
		const selectedTimerID = this.selectedTimerID;
		if (selectedTimerID) {
			const found = this.timers.find((timer) => selectedTimerID === timer.id);
			if (found) return found;
		}
		return null;
	});
	selectedTimerIntervals = $derived.by(() => {
		const timerID = this.selectedTimerID ?? 'focus';
		return this.timerIntervals.filter((ti) => timerID === ti.timer_id);
	});
	selectedTimerLastInterval = $derived.by(() => {
		const timerID = this.selectedTimerID ?? 'focus';
		let lastTimerInterval: TimerInterval | null = null;
		for (const ti of this.selectedTimerIntervals) {
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

	clearData: (() => Promise<void>) | undefined = undefined;

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
		this.clearData = async () => {
			await indexeddbProvider.clearData();
			this.state.tasks = [];
			this.state.lists = [];
			this.state.timers = [];
			this.state.timerIntervals = [];
			this.state.selectedListID = 'inbox';
			this.state.selectedTaskID = null;
			this.state.selectedTimerID = null;
			this.doc.destroy();
			location.reload();
		};
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

	createTimer(name: string): Timer {
		const timer: Timer = {
			id: crypto.randomUUID(),
			name: name,
			task_id: null,
			created_at: getUnixEpochFromNow(),
			updated_at: getUnixEpochFromNow()
		};
		return this.timersMap.set(timer.id, timer);
	}

	updateTask(t: Task): void {
		this.tasksMap.set(t.id, t);
	}

	toggleTimer(): void {
		const timerID = this.state.selectedTimerID ? this.state.selectedTimerID : 'focus';
		const lastTimerInterval = this.state.selectedTimerLastInterval;

		if (lastTimerInterval && lastTimerInterval.end_time === null) {
			this.timerIntervalsMap.set(lastTimerInterval.id, {
				...lastTimerInterval,
				end_time: getUnixEpochFromNow()
			});
			return;
		}

		const timerInterval: TimerInterval = {
			id: crypto.randomUUID(),
			start_time: getUnixEpochFromNow(),
			end_time: null,
			task_id: null,
			timer_id: timerID
		};
		this.timerIntervalsMap.set(timerInterval.id, timerInterval);
	}

	attachTaskToTimer(task: Task): void {
		const timer = this.state.selectedTimer;
		if (!timer) return;
		this.timersMap.set(timer.id, { ...timer, task_id: task.id });
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
