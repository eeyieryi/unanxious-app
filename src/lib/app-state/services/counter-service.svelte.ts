import { SvelteMap } from 'svelte/reactivity';

import { Map as YMap } from 'yjs';

import { getUnixEpochFromNow } from '$lib/datetime';

import type { Counter, CounterRecord, CounterStats } from '../models';

class CounterState {
	counters = $state(new SvelteMap<string, Counter>());
	countersRecords = $state(new SvelteMap<string, CounterRecord[]>());
	countersStats = $state(new SvelteMap<string, CounterStats>());

	constructor() {}
}

export class CounterService {
	readonly countersMap;
	readonly counterRecordsMap;
	readonly state;

	constructor(countersMap: YMap<Counter>, counterRecordsMap: YMap<CounterRecord[]>) {
		this.countersMap = countersMap;
		this.counterRecordsMap = counterRecordsMap;
		this.state = new CounterState();

		this.countersMap.observe((event) => {
			event.changes.keys.forEach((value, counterID, _changesMap) => {
				switch (value.action) {
					case 'add':
					case 'update': {
						const updatedCounter = this.countersMap.get(counterID)!;
						this.state.counters.set(counterID, updatedCounter);
						break;
					}
					case 'delete': {
						this.state.counters.delete(counterID);
						break;
					}
					default:
						throw new Error(`unknown action: ${value.action}`);
				}
			});
		});

		this.counterRecordsMap.observe((event) => {
			event.changes.keys.forEach((value, counterID, _changesMap) => {
				switch (value.action) {
					case 'add':
					case 'update': {
						const counterRecords = this.counterRecordsMap.get(counterID) || [];
						const counterStats: CounterStats = {
							total: 0,
							lastUpdatedAt: 0
						};
						for (const record of counterRecords) {
							counterStats.total += record.increased_by ?? 0;
							counterStats.total -= record.decreased_by ?? 0;
							if (record.created_at > counterStats.lastUpdatedAt) {
								counterStats.lastUpdatedAt = record.created_at;
							}
						}
						this.state.countersRecords.set(counterID, counterRecords);
						this.state.countersStats.set(counterID, counterStats);
						break;
					}
					case 'delete': {
						this.state.countersRecords.delete(counterID);
						this.state.countersStats.delete(counterID);
						break;
					}
					default:
						throw new Error(`unknown action: ${value.action}`);
				}
			});
		});
	}

	createCounter(name: string, step: number) {
		const counter: Counter = {
			id: crypto.randomUUID(),
			name: name,
			step: step
		};
		this.countersMap.set(counter.id, counter);
	}

	updateCounter(counter: Counter) {
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
}
