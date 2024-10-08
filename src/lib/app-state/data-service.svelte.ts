import { SvelteMap } from 'svelte/reactivity';
import { getContext, setContext } from 'svelte';

import { applyUpdate, Doc } from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';

import { getUnixEpochFromNow } from '$lib/datetime';

import type {
	List,
	Task,
	Timer,
	TimerInterval,
	Counter,
	CounterRecord,
	CounterStats,
	SharedTypes
} from './models';
import { BackupService } from './internal';
import { FocusService, TasksService } from './services';

export class AppDataService {
	private readonly doc: Doc;
	private readonly persistenceProvider: IndexeddbPersistence;

	public readonly state: AppState;
	public readonly sharedTypes: SharedTypes;
	public readonly backupService: BackupService;

	public readonly tasksService: TasksService;
	public readonly focusService: FocusService;

	constructor() {
		this.doc = new Doc();
		this.state = new AppState(); // TODO: Remove

		this.sharedTypes = {
			listsMap: this.doc.getMap<List>('lists'),
			tasksMap: this.doc.getMap<Task>('tasks'),
			timersMap: this.doc.getMap<Timer>('timers'),
			timerIntervalsMap: this.doc.getMap<TimerInterval[]>('timer_intervals'),
			countersMap: this.doc.getMap<Counter>('counters'),
			counterRecordsMap: this.doc.getMap<CounterRecord[]>('counter_records')
		};

		this.backupService = new BackupService(this.sharedTypes);

		// Initialize App State
		this.tasksService = new TasksService(this.sharedTypes.listsMap, this.sharedTypes.tasksMap);
		this.focusService = new FocusService(
			this.sharedTypes.timersMap,
			this.sharedTypes.timerIntervalsMap
		);

		this.doc.on('update', (update) => {
			applyUpdate(this.doc, update);
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
}

const APP_DATA_SERVICE_KEY = Symbol('APP_DATA_SERVICE');
export function setAppDataService() {
	return setContext(APP_DATA_SERVICE_KEY, new AppDataService());
}
export function getAppDataService() {
	return getContext<ReturnType<typeof setAppDataService>>(APP_DATA_SERVICE_KEY);
}

class AppState {
	counters = $state<Counter[]>([]);
	countersRecords = $state(new SvelteMap<string, CounterRecord[]>());
	countersStats = $state(new SvelteMap<string, CounterStats>());
}
