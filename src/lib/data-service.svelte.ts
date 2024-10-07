import { SvelteMap } from 'svelte/reactivity';
import { getContext, onMount, setContext } from 'svelte';

import { applyUpdate, Doc } from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { fromDate, getLocalTimeZone, isToday } from '@internationalized/date';

import { SyncService } from '$lib/sync.svelte';
import { TasksService } from '$lib/tasks-service.svelte';
import { BackupService } from '$lib/backup-service.svelte';
import { getUnixEpochFromNow, getDateTimeFromUnixEpoch } from '$lib/datetime';

class AppState {
	timers = $state<Timer[]>([]);
	timerIntervals = $state<TimerInterval[]>([]);
	selectedTimerID = $state<string | null>(null);
	counters = $state<Counter[]>([]);
	countersRecords = $state(new SvelteMap<string, CounterRecord[]>());
	countersStats = $state(new SvelteMap<string, CounterStats>());

	reset() {
		this.timers = [];
		this.timerIntervals = [];
		this.selectedTimerID = null;

		this.counters = [];
		this.countersRecords.clear();
		this.countersStats.clear();
	}

	readonly selectedTimer = $derived.by(() => {
		const selectedTimerID = this.selectedTimerID;
		if (selectedTimerID) {
			const found = this.timers.find((timer) => selectedTimerID === timer.id);
			if (found) return found;
		}
		return null;
	});

	readonly selectedTimerIntervals = $derived.by(() => {
		const timerID = this.selectedTimerID ?? 'focus';
		return this.timerIntervals.filter((ti) => timerID === ti.timer_id);
	});

	readonly selectedTimerLastInterval = $derived.by(() => {
		let lastTimerInterval: TimerInterval | null = null;
		for (const ti of this.selectedTimerIntervals) {
			if (!lastTimerInterval) {
				lastTimerInterval = ti;
			} else {
				if (ti.start_time > lastTimerInterval.start_time) {
					lastTimerInterval = ti;
				}
			}
		}
		return lastTimerInterval;
	});

	readonly selectedTimerStats = $derived.by(() => {
		const timerStats: TimerStats = {
			today: 0,
			total: 0
		};
		for (const ti of this.selectedTimerIntervals) {
			if (ti.end_time) {
				const seconds = ti.end_time - ti.start_time;
				timerStats.total += seconds;
				if (
					isToday(
						fromDate(getDateTimeFromUnixEpoch(ti.end_time), getLocalTimeZone()),
						getLocalTimeZone()
					)
				) {
					timerStats.today += seconds;
				}
			}
		}
		return timerStats;
	});
}

export class AppDataService {
	readonly doc: Doc;
	readonly state: AppState;
	readonly syncService: SyncService;
	readonly backupService: BackupService;

	readonly listsMap;
	readonly tasksMap;
	readonly tasksService: TasksService;

	readonly timersMap;
	readonly timerIntervalsMap;
	readonly countersMap;
	readonly counterRecordsMap;

	clearData: (() => Promise<void>) | undefined = undefined;

	constructor() {
		this.doc = new Doc();
		this.state = new AppState();
		this.syncService = new SyncService(
			this.doc,
			'demo-demo-demo' // Change this
		);
		this.backupService = new BackupService();

		this.listsMap = this.doc.getMap<List>('lists');
		this.tasksMap = this.doc.getMap<Task>('tasks');
		this.tasksService = new TasksService(this.listsMap, this.tasksMap);

		this.timersMap = this.doc.getMap<Timer>('timers');
		this.timerIntervalsMap = this.doc.getMap<TimerInterval>('timer_intervals');
		this.countersMap = this.doc.getMap<Counter>('counters');
		this.counterRecordsMap = this.doc.getMap<CounterRecord[]>('counter_records');

		this.doc.on('update', (update) => {
			applyUpdate(this.doc, update);
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

		this.countersMap.observe((event) => {
			if (event.keysChanged.size !== 0) {
				this.state.counters = Array.from(this.countersMap.values());
			}
		});

		this.counterRecordsMap.observe((event) => {
			if (event.keysChanged.size !== 0) {
				for (const counterID of event.keysChanged) {
					const counter = this.countersMap.get(counterID) || null;
					if (counter === null) {
						// Counter got deleted
						this.state.countersRecords.delete(counterID);
						this.state.countersStats.delete(counterID);
						return;
					}

					const current = this.counterRecordsMap.get(counterID) || [];
					const counterStats: CounterStats = {
						total: 0
					};
					for (const record of current) {
						counterStats.total += record.increased_by ?? 0;
						counterStats.total -= record.decreased_by ?? 0;
					}
					this.state.countersRecords.set(counterID, current);
					this.state.countersStats.set(counterID, counterStats);
				}
			}
		});

		onMount(() => {
			this.enablePersist();
			this.backupService.dataService = this;
			return () => {
				this.doc.destroy();
				this.state.reset();
			};
		});
	}

	enablePersist() {
		const indexeddbProvider = new IndexeddbPersistence('unanxious-app-idxdb', this.doc);
		indexeddbProvider.whenSynced.then(() => {
			console.log('loaded data from indexed db');
		});
		this.clearData = async () => {
			await indexeddbProvider.clearData();
			this.doc.destroy();
			this.state.reset();
			location.reload();
		};
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

	createCounter(name: string, step: number) {
		const counter: Counter = {
			id: crypto.randomUUID(),
			name: name,
			step: step
		};
		this.countersMap.set(counter.id, counter);
	}

	increaseCounter(counter: Counter, by: number) {
		const current = this.counterRecordsMap.get(counter.id) || [];
		const counterRecord: CounterRecord = {
			counter_id: counter.id,
			increased_by: by,
			created_at: getUnixEpochFromNow()
		};
		this.counterRecordsMap.set(counter.id, [counterRecord, ...current]);
	}

	decreaseCounter(counter: Counter, by: number) {
		const current = this.counterRecordsMap.get(counter.id) || [];
		const counterRecord: CounterRecord = {
			counter_id: counter.id,
			decreased_by: by,
			created_at: getUnixEpochFromNow()
		};
		this.counterRecordsMap.set(counter.id, [counterRecord, ...current]);
	}

	deleteCounter(counter: Counter) {
		this.countersMap.delete(counter.id);
	}

	resetCounter(counter: Counter) {
		this.counterRecordsMap.delete(counter.id);
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

	deleteSelectedTimer() {
		const t = this.state.selectedTimer;
		if (!t) return;
		const ti_ids = this.state.selectedTimerIntervals.map((ti) => ti.id);
		this.timersMap.delete(t.id);
		for (const id of ti_ids) {
			this.timerIntervalsMap.delete(id);
		}
	}

	archiveSelectedTimer() {
		const t = this.state.selectedTimer;
		if (!t) return;
		this.timersMap.set(t.id, { ...t, archived: true });
		this.state.selectedTimerID = null;
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
	archived?: boolean;
}

export function isTimerArchived(timer: Timer) {
	if (timer.archived !== undefined) {
		return timer.archived;
	}
	return false;
}

export function isTimerNotArchived(timer: Timer) {
	return !isTimerArchived(timer);
}

export interface TimerInterval {
	id: string;
	timer_id: string | null;
	task_id: string | null;
	start_time: number;
	end_time: number | null;
}

export interface TimerStats {
	today: number;
	total: number;
}

export interface Counter {
	id: string;
	name: string;
	step: number;
}

export interface CounterRecord {
	counter_id: string;
	increased_by?: number;
	decreased_by?: number;
	created_at: number;
}

export interface CounterStats {
	total: number;
}
