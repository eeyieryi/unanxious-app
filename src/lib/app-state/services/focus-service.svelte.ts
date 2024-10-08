import { SvelteMap } from 'svelte/reactivity';

import { Map as YMap } from 'yjs';
import { isToday, fromDate, getLocalTimeZone } from '@internationalized/date';

import { getDateTimeFromUnixEpoch, getUnixEpochFromNow } from '$lib/datetime';

import type { Task, Timer, TimerInterval, TimerStats } from '../models';

class FocusState {
	timers = $state(new SvelteMap<string, Timer>());
	timerIntervals = $state(new SvelteMap<string, TimerInterval[]>());

	selectedTimerID = $state<string | null>(null);

	constructor() {}

	readonly selectedTimer = $derived.by(() => {
		const timerID = this.selectedTimerID;
		if (timerID) {
			const found = this.timers.get(timerID);
			if (found) return found;
		}
		return null;
	});

	readonly selectedTimerIntervals = $derived.by(() => {
		const timerID = this.selectedTimerID ?? 'focus';
		return Array.from(this.timerIntervals.get(timerID) ?? []);
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

export class FocusService {
	readonly timersMap;
	readonly timerIntervalsMap;
	readonly state;

	constructor(timersMap: YMap<Timer>, timerIntervalsMap: YMap<TimerInterval[]>) {
		this.timersMap = timersMap;
		this.timerIntervalsMap = timerIntervalsMap;
		this.state = new FocusState();

		this.timersMap.observe((event) => {
			event.changes.keys.forEach((value, timerID, _changesMap) => {
				switch (value.action) {
					case 'add':
					case 'update': {
						const updatedTimer = this.timersMap.get(timerID)!;
						this.state.timers.set(timerID, updatedTimer);
						break;
					}
					case 'delete': {
						this.state.timers.delete(timerID);
						break;
					}
					default:
						throw new Error(`unknown action: ${value.action}`);
				}
			});
		});

		this.timerIntervalsMap.observe((event) => {
			event.changes.keys.forEach((value, timerID, _changesMap) => {
				console.log(value, timerID);
				switch (value.action) {
					case 'add':
					case 'update': {
						const timerIntervals = this.timerIntervalsMap.get(timerID)!;
						console.log(timerIntervals);
						this.state.timerIntervals.set(timerID, timerIntervals);
						break;
					}
					case 'delete': {
						this.state.timerIntervals.delete(timerID);
						break;
					}
					default:
						throw new Error(`unknown action: ${value.action}`);
				}
			});
		});
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

	toggleSelectedTimer(): void {
		const timerID = this.state.selectedTimerID ? this.state.selectedTimerID : 'focus';
		const lastTimerInterval = this.state.selectedTimerLastInterval;
		console.log(this.state.selectedTimerIntervals);

		if (lastTimerInterval && lastTimerInterval.end_time === null) {
			this.timerIntervalsMap.set(timerID, [
				{
					...lastTimerInterval,
					end_time: getUnixEpochFromNow()
				},
				...this.state.selectedTimerIntervals.filter((ti) => ti.id !== lastTimerInterval.id)
			]);
			return;
		}

		const timerInterval: TimerInterval = {
			id: crypto.randomUUID(),
			start_time: getUnixEpochFromNow(),
			end_time: null,
			task_id: null,
			timer_id: timerID
		};
		this.timerIntervalsMap.set(timerID, [timerInterval, ...this.state.selectedTimerIntervals]);
	}

	attachTaskToTimer(timer: Timer, task: Task): void {
		this.timersMap.set(timer.id, { ...timer, task_id: task.id });
	}

	deleteTimer(timer: Timer) {
		this.timersMap.delete(timer.id);
		this.timerIntervalsMap.delete(timer.id);
	}

	archiveTimer(timer: Timer) {
		this.timersMap.set(timer.id, { ...timer, archived: true });
		this.state.selectedTimerID = null;
	}

	unarchiveTimer(timer: Timer) {
		this.timersMap.set(timer.id, { ...timer, archived: false });
		this.state.selectedTimerID = timer.id;
	}
}
