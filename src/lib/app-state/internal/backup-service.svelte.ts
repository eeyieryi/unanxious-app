/* eslint-disable @typescript-eslint/no-explicit-any */
import { Map as YMap } from 'yjs';
import { saveAs } from 'file-saver';

import { getUnixEpochFromNow } from '$lib/datetime';

import type {
	List,
	Task,
	Timer,
	TimerInterval,
	Counter,
	CounterRecord,
	SharedTypes
} from '../models';

interface BackupData {
	listsMap: Map<string, List>;
	tasksMap: Map<string, Task>;
	timersMap: Map<string, Timer>;
	timerIntervalsMap: Map<string, TimerInterval[]>;
	countersMap: Map<string, Counter>;
	counterRecordsMap: Map<string, CounterRecord[]>;
}

function replacer(_key: string, value: any) {
	if (value instanceof Object && value !== null && 'listsMap' in value) {
		const backupData: any = {};
		for (const entry of Object.entries(value)) {
			const [backupMapKey, ymap] = entry;
			const map = new Map<string, any>();
			if (ymap instanceof YMap) {
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
	sharedTypes: SharedTypes;

	constructor(appYSharedTypes: SharedTypes) {
		this.sharedTypes = appYSharedTypes;
	}

	async export() {
		const jsonData = JSON.stringify(this.sharedTypes, replacer);
		const blob = new Blob([jsonData], { type: 'application/json' });
		saveAs(blob, `unanxious-app-backup-${getUnixEpochFromNow().toFixed(0)}.json`);
	}

	async import(file: File) {
		const {
			listsMap,
			tasksMap,
			timersMap,
			timerIntervalsMap,
			countersMap,
			counterRecordsMap
		}: BackupData = JSON.parse(await file.text(), reviver);

		this.sharedTypes.listsMap.clear();
		this.sharedTypes.tasksMap.clear();
		this.sharedTypes.timersMap.clear();
		this.sharedTypes.timerIntervalsMap.clear();
		this.sharedTypes.countersMap.clear();
		this.sharedTypes.counterRecordsMap.clear();

		for (const [listID, list] of listsMap) {
			this.sharedTypes.listsMap.set(listID, list);
		}
		for (const [taskID, task] of tasksMap) {
			this.sharedTypes.tasksMap.set(taskID, task);
		}
		for (const [timerID, timer] of timersMap) {
			this.sharedTypes.timersMap.set(timerID, timer);
		}
		for (const [timerID, timerIntervals] of timerIntervalsMap) {
			this.sharedTypes.timerIntervalsMap.set(timerID, timerIntervals);
		}
		for (const [counterID, counter] of countersMap) {
			this.sharedTypes.countersMap.set(counterID, counter);
		}
		for (const [counterID, counterRecords] of counterRecordsMap) {
			this.sharedTypes.counterRecordsMap.set(counterID, counterRecords);
		}
	}
}
