export interface Timer {
	id: string;
	name: string;
	task_id: string | null;
	created_at: number;
	updated_at: number;
	archived?: boolean;
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
