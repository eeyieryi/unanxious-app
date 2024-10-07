import type { Map as YMap } from 'yjs';

import type { List, Task, Timer, TimerInterval, Counter, CounterRecord } from '.';

export interface SharedTypes {
	listsMap: YMap<List>;
	tasksMap: YMap<Task>;
	timersMap: YMap<Timer>;
	timerIntervalsMap: YMap<TimerInterval>;
	countersMap: YMap<Counter>;
	counterRecordsMap: YMap<CounterRecord[]>;
}
