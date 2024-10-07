import { SvelteMap } from 'svelte/reactivity';
import { getContext, setContext } from 'svelte';

import { applyUpdate, Doc } from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { isToday, fromDate, getLocalTimeZone } from '@internationalized/date';

import { getDateTimeFromUnixEpoch, getUnixEpochFromNow } from '$lib/datetime';

import type {
	List,
	Task,
	Timer,
	TimerInterval,
	TimerStats,
	Counter,
	CounterRecord,
	CounterStats,
	SharedTypes
} from './models';
import { BackupService } from './internal';

import { TasksService } from './services';

export class AppDataService {
	private readonly doc: Doc;
	private readonly persistenceProvider: IndexeddbPersistence;

	public readonly state: AppState;
	public readonly sharedTypes: SharedTypes;
	public readonly tasksService: TasksService;
	public readonly backupService: BackupService;

	constructor() {
		this.doc = new Doc();
		this.state = new AppState(); // TODO: Remove

		this.sharedTypes = {
			listsMap: this.doc.getMap<List>('lists'),
			tasksMap: this.doc.getMap<Task>('tasks'),
			timersMap: this.doc.getMap<Timer>('timers'),
			timerIntervalsMap: this.doc.getMap<TimerInterval>('timer_intervals'),
			countersMap: this.doc.getMap<Counter>('counters'),
			counterRecordsMap: this.doc.getMap<CounterRecord[]>('counter_records')
		};

		this.backupService = new BackupService(this.sharedTypes);

		// Initialize App State
		this.tasksService = new TasksService(this.sharedTypes.listsMap, this.sharedTypes.tasksMap);

		this.doc.on('update', (update) => {
			applyUpdate(this.doc, update);
		});

		this.sharedTypes.timersMap.observe((event) => {
			if (event.keysChanged.size !== 0) {
				this.state.timers = Array.from(this.sharedTypes.timersMap.values());
			}
		});

		this.sharedTypes.timerIntervalsMap.observe((event) => {
			if (event.keysChanged.size !== 0) {
				this.state.timerIntervals = Array.from(this.sharedTypes.timerIntervalsMap.values());
			}
		});

		this.sharedTypes.countersMap.observe((event) => {
			if (event.keysChanged.size !== 0) {
				this.state.counters = Array.from(this.sharedTypes.countersMap.values());
			}
		});

		this.sharedTypes.counterRecordsMap.observe((event) => {
			if (event.keysChanged.size !== 0) {
				for (const counterID of event.keysChanged) {
					const counter = this.sharedTypes.countersMap.get(counterID) || null;
					if (counter === null) {
						// Counter got deleted
						this.state.countersRecords.delete(counterID);
						this.state.countersStats.delete(counterID);
						return;
					}

					const current = this.sharedTypes.counterRecordsMap.get(counterID) || [];
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

		this.persistenceProvider = new IndexeddbPersistence('unanxious-app-idxdb', this.doc);
		this.persistenceProvider.whenSynced.then(() => {
			console.log('loaded data from indexed db');
		});
	}

	public async clearData() {
		await this.persistenceProvider.clearData();
		this.doc.destroy();
		location.reload();
	}

	createTimer(name: string): Timer {
		const timer: Timer = {
			id: crypto.randomUUID(),
			name: name,
			task_id: null,
			created_at: getUnixEpochFromNow(),
			updated_at: getUnixEpochFromNow()
		};
		return this.sharedTypes.timersMap.set(timer.id, timer);
	}

	createCounter(name: string, step: number) {
		const counter: Counter = {
			id: crypto.randomUUID(),
			name: name,
			step: step
		};
		this.sharedTypes.countersMap.set(counter.id, counter);
	}

	increaseCounter(counter: Counter, by: number) {
		const current = this.sharedTypes.counterRecordsMap.get(counter.id) || [];
		const counterRecord: CounterRecord = {
			counter_id: counter.id,
			increased_by: by,
			created_at: getUnixEpochFromNow()
		};
		this.sharedTypes.counterRecordsMap.set(counter.id, [counterRecord, ...current]);
	}

	decreaseCounter(counter: Counter, by: number) {
		const current = this.sharedTypes.counterRecordsMap.get(counter.id) || [];
		const counterRecord: CounterRecord = {
			counter_id: counter.id,
			decreased_by: by,
			created_at: getUnixEpochFromNow()
		};
		this.sharedTypes.counterRecordsMap.set(counter.id, [counterRecord, ...current]);
	}

	deleteCounter(counter: Counter) {
		this.sharedTypes.countersMap.delete(counter.id);
	}

	resetCounter(counter: Counter) {
		this.sharedTypes.counterRecordsMap.delete(counter.id);
	}

	toggleTimer(): void {
		const timerID = this.state.selectedTimerID ? this.state.selectedTimerID : 'focus';
		const lastTimerInterval = this.state.selectedTimerLastInterval;

		if (lastTimerInterval && lastTimerInterval.end_time === null) {
			this.sharedTypes.timerIntervalsMap.set(lastTimerInterval.id, {
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
		this.sharedTypes.timerIntervalsMap.set(timerInterval.id, timerInterval);
	}

	attachTaskToTimer(task: Task): void {
		const timer = this.state.selectedTimer;
		if (!timer) return;
		this.sharedTypes.timersMap.set(timer.id, { ...timer, task_id: task.id });
	}

	deleteSelectedTimer() {
		const t = this.state.selectedTimer;
		if (!t) return;
		const ti_ids = this.state.selectedTimerIntervals.map((ti) => ti.id);
		this.sharedTypes.timersMap.delete(t.id);
		for (const id of ti_ids) {
			this.sharedTypes.timerIntervalsMap.delete(id);
		}
	}

	archiveSelectedTimer() {
		const t = this.state.selectedTimer;
		if (!t) return;
		this.sharedTypes.timersMap.set(t.id, { ...t, archived: true });
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

class AppState {
	timers = $state<Timer[]>([]);
	timerIntervals = $state<TimerInterval[]>([]);
	selectedTimerID = $state<string | null>(null);
	counters = $state<Counter[]>([]);
	countersRecords = $state(new SvelteMap<string, CounterRecord[]>());
	countersStats = $state(new SvelteMap<string, CounterStats>());

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

export function isTimerArchived(timer: Timer) {
	if (timer.archived !== undefined) {
		return timer.archived;
	}
	return false;
}

export function isTimerNotArchived(timer: Timer) {
	return !isTimerArchived(timer);
}
