/* eslint-disable @typescript-eslint/no-explicit-any */
import { saveAs } from 'file-saver';

import * as Y from 'yjs';

import type {
	AppDataService,
	Counter,
	CounterRecord,
	List,
	Task,
	Timer,
	TimerInterval
} from '$lib/data-service.svelte';
import { getUnixEpochFromNow } from '$lib/datetime';

interface AppData {
	listsMap: Y.Map<List>;
	tasksMap: Y.Map<Task>;
	timersMap: Y.Map<Timer>;
	timerIntervalsMap: Y.Map<TimerInterval>;
	countersMap: Y.Map<Counter>;
	counterRecordsMap: Y.Map<CounterRecord[]>;
}

interface BackupData {
	listsMap: Map<string, List>;
	tasksMap: Map<string, Task>;
	timersMap: Map<string, Timer>;
	timerIntervalsMap: Map<string, TimerInterval>;
	countersMap: Map<string, Counter>;
	counterRecordsMap: Map<string, CounterRecord[]>;
}

function replacer(_key: string, value: any) {
	if (value instanceof Object && value !== null && 'listsMap' in value) {
		const backupData: any = {};
		for (const entry of Object.entries(value)) {
			const [backupMapKey, ymap] = entry;
			const map = new Map<string, any>();
			if (ymap instanceof Y.Map) {
				for (const entry of ymap.entries()) {
					const [key, value] = entry;
					map.set(key, value);
				}
			}
			backupData[backupMapKey] = { dataType: 'Map', value: Array.from(map.entries()) };
		}
		return backupData;
	}
	return value;
}

function reviver(_key: string, value: any) {
	if (typeof value === 'object' && value !== null) {
		if (value.dataType === 'Map') {
			return new Map(value.value as Iterable<readonly [unknown, unknown]>);
		}
	}
	return value;
}

export class BackupService {
	dataService?: AppDataService;

	constructor() {}

	async export() {
		if (!this.dataService) return;
		const data: AppData = {
			listsMap: this.dataService.listsMap,
			tasksMap: this.dataService.tasksMap,
			timersMap: this.dataService.timersMap,
			timerIntervalsMap: this.dataService.timerIntervalsMap,
			countersMap: this.dataService.countersMap,
			counterRecordsMap: this.dataService.counterRecordsMap
		};
		const jsonData = JSON.stringify(data, replacer);
		const blob = new Blob([jsonData], { type: 'application/json' });
		saveAs(blob, `unanxious-app-backup-${getUnixEpochFromNow().toFixed(0)}.json`);
	}

	async import(file: File) {
		if (!this.dataService) return;

		const {
			listsMap,
			tasksMap,
			timersMap,
			timerIntervalsMap,
			countersMap,
			counterRecordsMap
		}: BackupData = JSON.parse(await file.text(), reviver);

		this.dataService.listsMap.clear();
		this.dataService.tasksMap.clear();
		this.dataService.timersMap.clear();
		this.dataService.timerIntervalsMap.clear();
		this.dataService.countersMap.clear();
		this.dataService.counterRecordsMap.clear();

		for (const [k, v] of listsMap) {
			this.dataService.listsMap.set(k, v);
		}
		for (const [k, v] of tasksMap) {
			this.dataService.tasksMap.set(k, v);
		}
		for (const [k, v] of timersMap) {
			this.dataService.timersMap.set(k, v);
		}
		for (const [k, v] of timerIntervalsMap) {
			this.dataService.timerIntervalsMap.set(k, v);
		}
		for (const [k, v] of countersMap) {
			this.dataService.countersMap.set(k, v);
		}
		for (const [k, v] of counterRecordsMap) {
			this.dataService.counterRecordsMap.set(k, v);
		}
	}
}
