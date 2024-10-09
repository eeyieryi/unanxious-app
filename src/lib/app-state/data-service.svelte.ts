import { getContext, setContext } from 'svelte';

import { applyUpdate, Doc } from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';

import type {
	List,
	Task,
	Timer,
	TimerInterval,
	Counter,
	CounterRecord,
	SharedTypes
} from './models';
import { BackupService } from './internal';
import { FocusService, TasksService, CounterService } from './services';

class AppDataService {
	private readonly doc: Doc;
	private readonly persistenceProvider: IndexeddbPersistence;

	public readonly sharedTypes: SharedTypes;
	public readonly backupService: BackupService;

	public readonly tasksService: TasksService;
	public readonly focusService: FocusService;
	public readonly counterService: CounterService;

	constructor() {
		this.doc = new Doc();

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
		this.counterService = new CounterService(
			this.sharedTypes.countersMap,
			this.sharedTypes.counterRecordsMap
		);

		this.doc.on('update', (update) => {
			applyUpdate(this.doc, update);
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
}

const APP_DATA_SERVICE_KEY = Symbol('APP_DATA_SERVICE');
export function setAppDataService() {
	return setContext(APP_DATA_SERVICE_KEY, new AppDataService());
}
export function getAppDataService() {
	return getContext<ReturnType<typeof setAppDataService>>(APP_DATA_SERVICE_KEY);
}
