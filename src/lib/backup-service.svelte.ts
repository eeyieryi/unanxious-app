import { saveAs } from 'file-saver';

import { getUnixEpochFromNow } from '$lib/datetime';
import type { AppDataService } from '$lib/data-service.svelte';

export class BackupService {
	dataService?: AppDataService;

	constructor() {}

	async export() {
		const data = {
			listsMap: this.dataService?.listsMap.toJSON(),
			tasksMap: this.dataService?.tasksMap.toJSON(),
			timersMap: this.dataService?.timersMap.toJSON(),
			timerIntervalsMap: this.dataService?.timerIntervalsMap.toJSON(),
			countersMap: this.dataService?.countersMap.toJSON(),
			counterRecordsMap: this.dataService?.counterRecordsMap.toJSON()
		};
		const blob = new Blob([JSON.stringify(data, null, 4)], { type: 'application/json' });
		saveAs(blob, `unanxious-app-backup-${getUnixEpochFromNow().toFixed(0)}.json`);
	}
}
