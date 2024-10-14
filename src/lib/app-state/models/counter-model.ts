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
	lastUpdatedAt: number; // time when the counter was last increased/decreased
}
