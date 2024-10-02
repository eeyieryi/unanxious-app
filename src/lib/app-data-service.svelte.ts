import { onMount } from 'svelte';

import { Doc } from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';

import { SyncService } from '$lib/sync.svelte';
import { AppState } from '$lib/app-state.svelte';

export class AppDataService {
	readonly doc: Doc;
	readonly appState: AppState;
	readonly syncService: SyncService;

	constructor() {
		this.doc = new Doc();
		this.appState = new AppState();
		this.syncService = new SyncService(
			this.doc,
			'demo-demo-demo' // Change this
		);

		onMount(() => {
			this.enablePersist();
		});
	}

	enablePersist() {
		const indexeddbProvider = new IndexeddbPersistence('unanxious-app-idxdb', this.doc);
		indexeddbProvider.whenSynced.then(() => {
			console.log('loaded data from indexed db');
		});
	}
}

export interface Task {
	id: string;
	name: string;
	description: string;
	completed: boolean;
	due_at: number | null;
	list_id: string | null;
}

export interface List {
	id: string;
	name: string;
}

export interface Timer {
	id: string;
	name: string;
	task_id: string | null;
}

export interface TimerInterval {
	id: string;
	timer_id: string | null;
	task_id: string | null;
	start_time: number;
	end_time: number | null;
}
